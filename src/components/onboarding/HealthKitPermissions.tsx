import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useHealthKit } from "../../hooks/useHealthKit";

interface HealthKitPermissionsProps {
  onGrantPermission?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
}

const HealthKitPermissions = ({
  onGrantPermission = () => {},
  onSkip = () => {},
  onBack = () => {},
}: HealthKitPermissionsProps) => {
  const {
    permissionStatus,
    isLoading,
    error,
    requestAuthorization,
    denyAuthorization,
  } = useHealthKit();

  const [requestState, setRequestState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    // Update UI state based on permission status
    if (permissionStatus === "authorized") {
      setRequestState("success");
    } else if (permissionStatus === "denied") {
      setRequestState("error");
    }
  }, [permissionStatus]);

  const handleRequestPermission = async () => {
    setRequestState("loading");
    try {
      const status = await requestAuthorization();
      if (status === "authorized") {
        setRequestState("success");
        // Wait a moment before calling onGrantPermission to show the success state
        setTimeout(() => {
          onGrantPermission();
        }, 1000);
      } else {
        setRequestState("error");
      }
    } catch (err) {
      setRequestState("error");
    }
  };

  const handleSkip = () => {
    // Simulate denying permission when user skips
    denyAuthorization();
    onSkip();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-6">Health Data Access</h1>

        <p className="text-gray-600 mt-2">
          To store your joint replacement information securely, we need
          permission to access your Apple Health records.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h3 className="font-medium text-gray-900">We'll only:</h3>
          <ul className="mt-2 space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-left">
                Store joint replacement data you explicitly scan
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-left">
                Save information in your secure Health app
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600 text-left">
                Keep your medical data private and encrypted
              </span>
            </li>
          </ul>
        </div>

        {requestState === "success" && (
          <div className="bg-green-50 p-4 rounded-lg mt-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">
              Health access granted successfully!
            </span>
          </div>
        )}

        {requestState === "error" && (
          <div className="bg-red-50 p-4 rounded-lg mt-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">
              Permission denied. Some features will be limited.
            </span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-lg mt-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Button
            className="w-full"
            onClick={handleRequestPermission}
            disabled={requestState === "success" || isLoading}
          >
            {requestState === "loading"
              ? "Requesting Access..."
              : requestState === "success"
                ? "Permission Granted"
                : "Grant Health Access"}
          </Button>

          <Button variant="outline" className="w-full" onClick={handleSkip}>
            Skip for now
          </Button>

          <Button variant="ghost" className="w-full" onClick={onBack}>
            Back
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          You can change these permissions later in your device settings.
          Skipping will limit the app's ability to store your joint replacement
          data.
        </p>
      </div>
    </div>
  );
};

export default HealthKitPermissions;
