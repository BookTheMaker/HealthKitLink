import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Clock, Share2, Trash2 } from "react-native-vector-icons/Feather";
import { useHealthKit } from "../healthkit";
import type { JointReplacementData } from "../healthkit/types";
import JointReplacementDetails from "./JointReplacementDetails";

const ScanHistory: React.FC = () => {
  const { jointReplacements, loadJointReplacements, deleteJointReplacement } =
    useHealthKit();
  const [selectedItem, setSelectedItem] = useState<JointReplacementData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await loadJointReplacements();
      setLoading(false);
    };
    loadData();
  }, [loadJointReplacements]);

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this joint replacement record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteJointReplacement(id);
            if (success) {
              setSelectedItem(null);
            } else {
              Alert.alert(
                "Error",
                "Failed to delete the record. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const handleShareItem = (item: JointReplacementData) => {
    // In a real app, this would use the Share API
    Alert.alert(
      "Share Joint Replacement Data",
      "This would open the native share sheet with the joint replacement data.",
      [{ text: "OK" }],
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderHistoryItem = ({ item }: { item: JointReplacementData }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => setSelectedItem(item)}
    >
      <View style={styles.historyItemHeader}>
        <Text style={styles.historyItemTitle}>{item.type}</Text>
        <Text style={styles.historyItemDate}>
          Implanted: {formatDate(item.implantDate)}
        </Text>
      </View>

      <View style={styles.historyItemContent}>
        <Text style={styles.historyItemDetail}>
          {item.manufacturer} - {item.model}
        </Text>
        <Text style={styles.historyItemDetail}>SN: {item.serialNumber}</Text>
        <Text style={styles.historyItemDetail}>Location: {item.location}</Text>
      </View>

      <View style={styles.historyItemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShareItem(item)}
        >
          <Share2
            name="share-2"
            size={14}
            color="#4a5568"
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteItem(item.id)}
        >
          <Trash2
            name="trash-2"
            size={14}
            color="#e53e3e"
            style={styles.actionIcon}
          />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (selectedItem) {
    return (
      <View style={styles.container}>
        <JointReplacementDetails
          data={selectedItem}
          onEdit={() =>
            Alert.alert("Edit", "Edit functionality would be implemented here")
          }
          onDelete={() => handleDeleteItem(selectedItem.id)}
          onShare={() => handleShareItem(selectedItem)}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedItem(null)}
        >
          <Text style={styles.backButtonText}>Back to History</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text>Loading history...</Text>
        </View>
      ) : jointReplacements.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Clock name="clock" size={48} color="#cbd5e0" />
          <Text style={styles.emptyText}>No scan history yet</Text>
        </View>
      ) : (
        <FlatList
          data={jointReplacements}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    color: "#718096",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  historyItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  historyItemDate: {
    fontSize: 12,
    color: "#718096",
  },
  historyItemContent: {
    marginBottom: 12,
  },
  historyItemDetail: {
    fontSize: 14,
    color: "#4a5568",
    marginBottom: 2,
  },
  historyItemActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#f7fafc",
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#fff5f5",
  },
  actionIcon: {
    marginRight: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#4a5568",
  },
  deleteText: {
    fontSize: 12,
    color: "#e53e3e",
  },
  backButton: {
    backgroundColor: "#f7fafc",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  backButtonText: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
});

export default ScanHistory;
