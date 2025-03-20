import React from "react";
import { useHealthKit } from "../hooks/useHealthKit";
import { Button } from "./ui/button";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";

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
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center">
        <div className="bg-blue-100 p-2 rounded-full mr-4">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium">HealthKit Integration</h3>

          {permissionStatus === "authorized" ? (
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Connected and working properly</span>
            </div>
          ) : permissionStatus === "denied" ? (
            <div className="flex items-center text-red-600 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Permission denied - limited functionality</span>
            </div>
          ) : (
            <div className="flex items-center text-yellow-600 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Permission not requested yet</span>
            </div>
          )}
        </div>

        {permissionStatus !== "authorized" && (
          <Button
            size="sm"
            onClick={handleRequestPermission}
            disabled={isLoading}
          >
            {isLoading ? "Requesting..." : "Request Access"}
          </Button>
        )}
      </div>

      {permissionStatus !== "authorized" && (
        <p className="text-xs text-gray-500 mt-3">
          Without HealthKit access, your joint replacement data will only be
          stored within this app and not in your Apple Health records.
        </p>
      )}
    </div>
  );
};

export default HealthKitStatus;
