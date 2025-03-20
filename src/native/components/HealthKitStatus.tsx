import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useHealthKit } from "../healthkit";
import {
  Shield,
  AlertCircle,
  CheckCircle,
} from "react-native-vector-icons/Feather";

interface HealthKitStatusProps {
  onRequestPermission?: () => void;
}

const HealthKitStatus: React.FC<HealthKitStatusProps> = ({
  onRequestPermission = () => {},
}) => {
  const { permissionStatus, requestAuthorization, isLoading } = useHealthKit();

  const handleRequestPermission = async () => {
    await requestAuthorization();
    onRequestPermission();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield name="shield" size={24} color="#3182ce" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>HealthKit Integration</Text>

          {permissionStatus === "authorized" ? (
            <View style={styles.statusContainer}>
              <CheckCircle
                name="check-circle"
                size={16}
                color="#38a169"
                style={styles.statusIcon}
              />
              <Text style={styles.statusTextSuccess}>
                Connected and working properly
              </Text>
            </View>
          ) : permissionStatus === "denied" ? (
            <View style={styles.statusContainer}>
              <AlertCircle
                name="alert-circle"
                size={16}
                color="#e53e3e"
                style={styles.statusIcon}
              />
              <Text style={styles.statusTextError}>
                Permission denied - limited functionality
              </Text>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <AlertCircle
                name="alert-circle"
                size={16}
                color="#dd6b20"
                style={styles.statusIcon}
              />
              <Text style={styles.statusTextWarning}>
                Permission not requested yet
              </Text>
            </View>
          )}
        </View>

        {permissionStatus !== "authorized" && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleRequestPermission}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Request Access</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {permissionStatus !== "authorized" && (
        <Text style={styles.infoText}>
          Without HealthKit access, your joint replacement data will only be
          stored within this app and not in your Apple Health records.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#ebf8ff",
    padding: 8,
    borderRadius: 20,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusTextSuccess: {
    fontSize: 14,
    color: "#38a169",
  },
  statusTextError: {
    fontSize: 14,
    color: "#e53e3e",
  },
  statusTextWarning: {
    fontSize: 14,
    color: "#dd6b20",
  },
  button: {
    backgroundColor: "#3182ce",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  infoText: {
    fontSize: 12,
    color: "#718096",
    marginTop: 12,
  },
});

export default HealthKitStatus;
