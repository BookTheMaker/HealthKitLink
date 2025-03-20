import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Trash2, Share2, Edit } from "react-native-vector-icons/Feather";
import type { JointReplacementData } from "../healthkit/types";

interface JointReplacementDetailsProps {
  data: JointReplacementData;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const JointReplacementDetails: React.FC<JointReplacementDetailsProps> = ({
  data,
  onEdit = () => {},
  onDelete = () => {},
  onShare = () => {},
}) => {
  // Format the implant date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.type} Replacement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Manufacturer</Text>
            <Text style={styles.detailValue}>{data.manufacturer}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Model</Text>
            <Text style={styles.detailValue}>{data.model}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Serial Number</Text>
            <Text style={styles.detailValue}>{data.serialNumber}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Implant Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(data.implantDate)}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{data.location}</Text>
          </View>

          {data.surgeon && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Surgeon</Text>
              <Text style={styles.detailValue}>{data.surgeon}</Text>
            </View>
          )}

          {data.hospital && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hospital</Text>
              <Text style={styles.detailValue}>{data.hospital}</Text>
            </View>
          )}
        </View>

        {data.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={onEdit}>
          <Edit
            name="edit"
            size={16}
            color="#4a5568"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onShare}>
          <Share2
            name="share-2"
            size={16}
            color="#4a5568"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2
            name="trash-2"
            size={16}
            color="#e53e3e"
            style={styles.buttonIcon}
          />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  detailItem: {
    width: "50%",
    paddingRight: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: "#2d3748",
  },
  notesContainer: {
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#2d3748",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    padding: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: "#f7fafc",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: "#fff5f5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fed7d7",
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
  deleteButtonText: {
    fontSize: 14,
    color: "#e53e3e",
    fontWeight: "500",
  },
});

export default JointReplacementDetails;
