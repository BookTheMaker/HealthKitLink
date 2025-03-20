import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useHealthKit } from "../healthkit";
import type { JointReplacementData } from "../healthkit/types";

interface JointReplacementFormProps {
  initialData?: Partial<JointReplacementData>;
  onSaveSuccess?: (data: JointReplacementData) => void;
  onCancel?: () => void;
}

const JointReplacementForm: React.FC<JointReplacementFormProps> = ({
  initialData = {},
  onSaveSuccess = () => {},
  onCancel = () => {},
}) => {
  const { saveJointReplacement, permissionStatus } = useHealthKit();
  const [formData, setFormData] = useState<Partial<JointReplacementData>>({
    id: crypto.randomUUID(),
    type: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    implantDate: new Date().toISOString().split("T")[0],
    location: "",
    surgeon: "",
    hospital: "",
    notes: "",
    ...initialData,
  });

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"success" | "error" | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (name: keyof JointReplacementData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, implantDate: dateString }));
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSaveResult(null);
    setErrorMessage("");

    // Validate required fields
    const requiredFields = [
      "type",
      "manufacturer",
      "model",
      "serialNumber",
      "implantDate",
      "location",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof JointReplacementData],
    );

    if (missingFields.length > 0) {
      setSaving(false);
      setSaveResult("error");
      setErrorMessage(
        `Please fill in all required fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    try {
      // Cast to full JointReplacementData since we've validated required fields
      const result = await saveJointReplacement(
        formData as JointReplacementData,
      );
      if (result) {
        setSaveResult("success");
        setTimeout(() => {
          onSaveSuccess(formData as JointReplacementData);
        }, 1500);
      } else {
        setSaveResult("error");
        setErrorMessage(
          permissionStatus === "authorized"
            ? "Failed to save data. Please try again."
            : "HealthKit permissions not granted. Data cannot be saved.",
        );
      }
    } catch (error) {
      setSaveResult("error");
      setErrorMessage("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Joint Replacement Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type *</Text>
            <TextInput
              style={styles.input}
              value={formData.type}
              onChangeText={(value) => handleChange("type", value)}
              placeholder="Hip, Knee, etc."
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer *</Text>
            <TextInput
              style={styles.input}
              value={formData.manufacturer}
              onChangeText={(value) => handleChange("manufacturer", value)}
              placeholder="Manufacturer name"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Model *</Text>
            <TextInput
              style={styles.input}
              value={formData.model}
              onChangeText={(value) => handleChange("model", value)}
              placeholder="Model number"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serial Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.serialNumber}
              onChangeText={(value) => handleChange("serialNumber", value)}
              placeholder="Serial number"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Implant Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.implantDate || "Select date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.implantDate || Date.now())}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleChange("location", value)}
              placeholder="Left knee, Right hip, etc."
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surgeon</Text>
            <TextInput
              style={styles.input}
              value={formData.surgeon}
              onChangeText={(value) => handleChange("surgeon", value)}
              placeholder="Surgeon name"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hospital</Text>
            <TextInput
              style={styles.input}
              value={formData.hospital}
              onChangeText={(value) => handleChange("hospital", value)}
              placeholder="Hospital name"
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleChange("notes", value)}
              placeholder="Additional information"
              placeholderTextColor="#a0aec0"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {saveResult === "success" && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>
                Joint replacement data saved successfully!
              </Text>
            </View>
          )}

          {saveResult === "error" && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorText}>
                {errorMessage || "Failed to save data"}
              </Text>
            </View>
          )}

          {permissionStatus !== "authorized" && (
            <View style={styles.warningMessage}>
              <Text style={styles.warningText}>
                HealthKit permissions not granted. Data will only be stored
                locally.
              </Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.buttonText}>Saving...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Save Data</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#4a5568",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f7fafc",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#f7fafc",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#4a5568",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#3182ce",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "#4a5568",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  successMessage: {
    backgroundColor: "#c6f6d5",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  successText: {
    color: "#2f855a",
  },
  errorMessage: {
    backgroundColor: "#fed7d7",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: "#c53030",
  },
  warningMessage: {
    backgroundColor: "#fefcbf",
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  warningText: {
    color: "#b7791f",
  },
});

export default JointReplacementForm;
