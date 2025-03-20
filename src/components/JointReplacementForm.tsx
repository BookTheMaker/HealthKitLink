import React, { useState } from "react";
import { useHealthKit } from "../hooks/useHealthKit";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6">Joint Replacement Information</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="type">Type *</Label>
          <Input
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Hip, Knee, etc."
            required
          />
        </div>

        <div>
          <Label htmlFor="manufacturer">Manufacturer *</Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            placeholder="Manufacturer name"
            required
          />
        </div>

        <div>
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model number"
            required
          />
        </div>

        <div>
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="Serial number"
            required
          />
        </div>

        <div>
          <Label htmlFor="implantDate">Implant Date *</Label>
          <Input
            id="implantDate"
            name="implantDate"
            type="date"
            value={formData.implantDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Left knee, Right hip, etc."
            required
          />
        </div>

        <div>
          <Label htmlFor="surgeon">Surgeon</Label>
          <Input
            id="surgeon"
            name="surgeon"
            value={formData.surgeon}
            onChange={handleChange}
            placeholder="Surgeon name"
          />
        </div>

        <div>
          <Label htmlFor="hospital">Hospital</Label>
          <Input
            id="hospital"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
            placeholder="Hospital name"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional information"
            rows={3}
          />
        </div>

        {saveResult === "success" && (
          <div className="bg-green-50 p-3 rounded-md flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Joint replacement data saved successfully!</span>
          </div>
        )}

        {saveResult === "error" && (
          <div className="bg-red-50 p-3 rounded-md flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{errorMessage || "Failed to save data"}</span>
          </div>
        )}

        {permissionStatus !== "authorized" && (
          <div className="bg-yellow-50 p-3 rounded-md flex items-center text-yellow-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              HealthKit permissions not granted. Data will only be stored
              locally.
            </span>
          </div>
        )}

        <div className="flex space-x-3 pt-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Data"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JointReplacementForm;
