import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import {
  Settings as SettingsIcon,
  Shield,
  Heart,
  HelpCircle,
  ChevronRight,
} from "react-native-vector-icons/Feather";
import { useHealthKit } from "../healthkit";

const Settings: React.FC = () => {
  const { permissionStatus, requestAuthorization } = useHealthKit();

  // State for toggle switches
  const [saveHistory, setSaveHistory] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleRequestHealthAccess = async () => {
    try {
      const status = await requestAuthorization();
      if (status === "authorized") {
        Alert.alert("Success", "HealthKit access has been granted.");
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable HealthKit access in your device settings to use all features.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to request HealthKit permissions.");
    }
  };

  const handleOpenHealthCategories = () => {
    Alert.alert(
      "Health Categories",
      "This would open a screen to manage which health data categories are used.",
      [{ text: "OK" }],
    );
  };

  const handleOpenHelp = () => {
    Alert.alert(
      "Help Center",
      "This would open the help center with documentation and support options.",
      [{ text: "OK" }],
    );
  };

  const handleOpenPrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "This would open the privacy policy document.",
      [{ text: "OK" }],
    );
  };

  const handleOpenTerms = () => {
    Alert.alert(
      "Terms of Service",
      "This would open the terms of service document.",
      [{ text: "OK" }],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <SettingsIcon
          name="settings"
          size={24}
          color="#2d3748"
          style={styles.headerIcon}
        />
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield
            name="shield"
            size={20}
            color="#3182ce"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Save Scan History</Text>
            <Text style={styles.settingDescription}>
              Store scanned QR data on device
            </Text>
          </View>
          <Switch
            value={saveHistory}
            onValueChange={setSaveHistory}
            trackColor={{ false: "#cbd5e0", true: "#90cdf4" }}
            thumbColor={saveHistory ? "#3182ce" : "#f7fafc"}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Analytics</Text>
            <Text style={styles.settingDescription}>Help improve the app</Text>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: "#cbd5e0", true: "#90cdf4" }}
            thumbColor={analytics ? "#3182ce" : "#f7fafc"}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Heart
            name="heart"
            size={20}
            color="#e53e3e"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Health Integration</Text>
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-Save to Health</Text>
            <Text style={styles.settingDescription}>
              Automatically save scans
            </Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: "#cbd5e0", true: "#90cdf4" }}
            thumbColor={autoSave ? "#3182ce" : "#f7fafc"}
          />
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleOpenHealthCategories}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Health Categories</Text>
            <Text style={styles.settingDescription}>
              Manage health data categories
            </Text>
          </View>
          <ChevronRight name="chevron-right" size={20} color="#a0aec0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRequestHealthAccess}
        >
          <Text style={styles.buttonText}>
            {permissionStatus === "authorized"
              ? "HealthKit Connected"
              : "Connect to HealthKit"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <HelpCircle
            name="help-circle"
            size={20}
            color="#805ad5"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>About & Help</Text>
        </View>

        <TouchableOpacity style={styles.linkItem} onPress={handleOpenHelp}>
          <Text style={styles.linkText}>Help Center</Text>
          <ChevronRight name="chevron-right" size={20} color="#a0aec0" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={handleOpenPrivacyPolicy}
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
          <ChevronRight name="chevron-right" size={20} color="#a0aec0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkItem} onPress={handleOpenTerms}>
          <Text style={styles.linkText}>Terms of Service</Text>
          <ChevronRight name="chevron-right" size={20} color="#a0aec0" />
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#718096",
  },
  button: {
    backgroundColor: "#f7fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3182ce",
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  linkText: {
    fontSize: 16,
    color: "#2d3748",
  },
  versionContainer: {
    alignItems: "center",
    paddingTop: 16,
  },
  versionText: {
    fontSize: 12,
    color: "#a0aec0",
  },
});

export default Settings;
