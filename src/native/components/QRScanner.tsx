import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Scan,
  Camera as CameraIcon,
  Check,
  X,
} from "react-native-vector-icons/Feather";
import { useHealthKit } from "../healthkit";
import type { JointReplacementData } from "../healthkit/types";

const QRScanner: React.FC = () => {
  const { saveJointReplacement } = useHealthKit();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<JointReplacementData | null>(
    null,
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const startScanning = () => {
    setScanning(true);
  };

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    try {
      // Try to parse the QR code data as JSON
      const parsedData = JSON.parse(data);

      // Validate that this is joint replacement data
      if (
        parsedData.type &&
        parsedData.manufacturer &&
        parsedData.serialNumber
      ) {
        // Add an ID if not present
        if (!parsedData.id) {
          parsedData.id = crypto.randomUUID();
        }

        setScannedData(parsedData as JointReplacementData);
        setScanning(false);
      } else {
        Alert.alert(
          "Invalid QR Code",
          "This QR code does not contain valid joint replacement data.",
          [{ text: "OK", onPress: () => setScanning(true) }],
        );
      }
    } catch (error) {
      Alert.alert(
        "Invalid QR Code",
        "Could not parse the QR code data. Please try again.",
        [{ text: "OK", onPress: () => setScanning(true) }],
      );
    }
  };

  const saveToHealth = async () => {
    if (!scannedData) return;

    try {
      const success = await saveJointReplacement(scannedData);
      if (success) {
        setSaved(true);
        setTimeout(() => {
          setScannedData(null);
          setSaved(false);
        }, 2000);
      } else {
        Alert.alert(
          "Save Failed",
          "Failed to save data to HealthKit. Please check permissions and try again.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred while saving data.", [
        { text: "OK" },
      ]);
    }
  };

  const cancelScan = () => {
    setScannedData(null);
    setScanning(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3182ce" />
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => {
            if (Platform.OS === "ios") {
              Alert.alert(
                "Camera Permission Required",
                "Please enable camera access in your device settings to scan QR codes.",
                [{ text: "OK" }],
              );
            } else {
              Camera.requestCameraPermissionsAsync();
            }
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joint Replacement Scanner</Text>

      {!scanning && !scannedData && !saved && (
        <View style={styles.startContainer}>
          <View style={styles.iconContainer}>
            <Scan name="scan" size={64} color="#3182ce" />
          </View>
          <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
            <CameraIcon
              name="camera"
              size={16}
              color="#ffffff"
              style={styles.buttonIcon}
            />
            <Text style={styles.scanButtonText}>Scan QR Code</Text>
          </TouchableOpacity>
          <Text style={styles.infoText}>
            Scan a joint replacement QR code to import data into your health
            repository
          </Text>
        </View>
      )}

      {scanning && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            onBarCodeScanned={handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          >
            <View style={styles.scanOverlay}>
              <View style={styles.scanFrame} />
              <Text style={styles.scanningText}>Scanning for QR code...</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelScan}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}

      {scannedData && !saved && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Joint Replacement Data</Text>

          <View style={styles.dataContent}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Type:</Text>
              <Text style={styles.dataValue}>{scannedData.type}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Manufacturer:</Text>
              <Text style={styles.dataValue}>{scannedData.manufacturer}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Model:</Text>
              <Text style={styles.dataValue}>{scannedData.model}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Serial Number:</Text>
              <Text style={styles.dataValue}>{scannedData.serialNumber}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Implant Date:</Text>
              <Text style={styles.dataValue}>{scannedData.implantDate}</Text>
            </View>
            {scannedData.surgeon && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Surgeon:</Text>
                <Text style={styles.dataValue}>{scannedData.surgeon}</Text>
              </View>
            )}
            {scannedData.hospital && (
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Hospital:</Text>
                <Text style={styles.dataValue}>{scannedData.hospital}</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={saveToHealth}>
              <Check
                name="check"
                size={16}
                color="#ffffff"
                style={styles.buttonIcon}
              />
              <Text style={styles.saveButtonText}>Save to Health</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelDataButton}
              onPress={cancelScan}
            >
              <X name="x" size={16} color="#4a5568" style={styles.buttonIcon} />
              <Text style={styles.cancelDataButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {saved && (
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Check name="check" size={64} color="#38a169" />
          </View>
          <Text style={styles.successTitle}>Data Saved Successfully</Text>
          <Text style={styles.successText}>
            Joint replacement data has been added to your health repository
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  startContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconContainer: {
    backgroundColor: "#f7fafc",
    padding: 32,
    borderRadius: 100,
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: "#3182ce",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    width: "100%",
    marginBottom: 16,
  },
  scanButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonIcon: {
    marginRight: 8,
  },
  infoText: {
    textAlign: "center",
    color: "#718096",
    fontSize: 14,
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 16,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: "70%",
    height: "70%",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 12,
  },
  scanningText: {
    color: "#ffffff",
    marginTop: 16,
    fontSize: 14,
  },
  cancelButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  dataContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  dataContent: {
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dataLabel: {
    color: "#718096",
    fontSize: 14,
  },
  dataValue: {
    color: "#2d3748",
    fontSize: 14,
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#3182ce",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelDataButton: {
    flex: 1,
    backgroundColor: "#f7fafc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginLeft: 8,
  },
  cancelDataButtonText: {
    color: "#4a5568",
    fontSize: 14,
    fontWeight: "600",
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  successIconContainer: {
    backgroundColor: "#f0fff4",
    padding: 32,
    borderRadius: 100,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  successText: {
    textAlign: "center",
    color: "#718096",
    fontSize: 14,
  },
  permissionText: {
    fontSize: 16,
    color: "#4a5568",
    marginTop: 16,
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: "#3182ce",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default QRScanner;
