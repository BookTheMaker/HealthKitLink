import React, { useState, useEffect } from "react";
import WelcomeScreen from "../components/onboarding/WelcomeScreen";
import PrivacyInformation from "../components/onboarding/PrivacyInformation";
import HealthKitPermissions from "../components/onboarding/HealthKitPermissions";
import LimitedFunctionalityNotice from "../components/onboarding/LimitedFunctionalityNotice";
import { useHealthKit } from "../hooks/useHealthKit";

type OnboardingStep =
  | "welcome"
  | "privacy"
  | "healthkit"
  | "limited"
  | "completed";

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const { permissionStatus, resetAuthorization } = useHealthKit();

  // Reset HealthKit permissions when the component mounts (for demo purposes)
  useEffect(() => {
    resetAuthorization();
  }, [resetAuthorization]);

  const handleGetStarted = () => {
    setCurrentStep("privacy");
  };

  const handlePrivacyNext = () => {
    setCurrentStep("healthkit");
  };

  const handlePrivacyBack = () => {
    setCurrentStep("welcome");
  };

  const handleGrantPermission = () => {
    // Permission is already granted in the HealthKitPermissions component
    // Just proceed to the main app
    setCurrentStep("completed");
  };

  const handleSkipPermission = () => {
    // Permission is already denied in the HealthKitPermissions component
    setCurrentStep("limited");
  };

  const handleHealthKitBack = () => {
    setCurrentStep("privacy");
  };

  const handleRetryPermissions = () => {
    setCurrentStep("healthkit");
  };

  const handleContinueLimited = () => {
    setCurrentStep("completed");
  };

  // Render the appropriate step based on the current state
  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
      case "privacy":
        return (
          <PrivacyInformation
            onNext={handlePrivacyNext}
            onBack={handlePrivacyBack}
          />
        );
      case "healthkit":
        return (
          <HealthKitPermissions
            onGrantPermission={handleGrantPermission}
            onSkip={handleSkipPermission}
            onBack={handleHealthKitBack}
          />
        );
      case "limited":
        return (
          <LimitedFunctionalityNotice
            onRetryPermissions={handleRetryPermissions}
            onContinueLimited={handleContinueLimited}
          />
        );
      case "completed":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="bg-green-100 p-6 rounded-full inline-flex items-center justify-center">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Setup Complete!</h1>
              <p className="text-gray-600">
                You're all set to start scanning joint replacement QR codes and
                managing your health data.
              </p>
              <p className="text-gray-600 text-sm mt-2">
                {permissionStatus === "authorized"
                  ? "Your data will be securely stored in HealthKit."
                  : "You're using the app with limited functionality. Data will only be stored locally."}
              </p>
              <button
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => (window.location.href = "/")}
              >
                Go to Home Screen
              </button>
            </div>
          </div>
        );
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} />;
    }
  };

  return <div className="bg-white min-h-screen">{renderStep()}</div>;
};

export default OnboardingFlow;
