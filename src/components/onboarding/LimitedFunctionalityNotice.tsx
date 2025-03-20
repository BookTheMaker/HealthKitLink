import React from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface LimitedFunctionalityNoticeProps {
  onRetryPermissions?: () => void;
  onContinueLimited?: () => void;
}

const LimitedFunctionalityNotice = ({
  onRetryPermissions = () => {},
  onContinueLimited = () => {},
}: LimitedFunctionalityNoticeProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <div className="max-w-md mx-auto space-y-6 text-center">
        <div className="bg-yellow-100 p-6 rounded-full inline-flex items-center justify-center mx-auto">
          <AlertTriangle className="h-16 w-16 text-yellow-600" />
        </div>
        <h1 className="text-2xl font-bold">Limited Functionality</h1>
        <p className="text-gray-600">
          Without HealthKit permissions, you won't be able to save joint
          replacement data to your Health app. You can still scan QR codes, but
          the data will only be stored within this app.
        </p>
        <div className="space-y-3 pt-4">
          <Button className="w-full" onClick={onRetryPermissions}>
            Retry Permission Request
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onContinueLimited}
          >
            Continue with Limited Functionality
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LimitedFunctionalityNotice;
