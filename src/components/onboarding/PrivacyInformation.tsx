import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Shield, Lock, FileText } from "lucide-react";

interface PrivacyInformationProps {
  onNext?: () => void;
  onBack?: () => void;
}

const PrivacyInformation = ({
  onNext = () => {},
  onBack = () => {},
}: PrivacyInformationProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <Shield className="w-16 h-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Privacy & Data Security</h1>
          <p className="text-muted-foreground">
            Learn how we handle your joint replacement data
          </p>
        </div>

        <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">
                  Your Data Stays Private
                </h2>
                <p className="text-muted-foreground">
                  All your joint replacement information is stored securely on
                  your device and in your Apple Health repository. We never
                  upload or share your medical data without your explicit
                  permission.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">HealthKit Integration</h2>
                <p className="text-muted-foreground">
                  We use Apple's HealthKit to securely store your joint
                  replacement data as medical records. This integration follows
                  Apple's strict privacy guidelines and encryption standards.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">Data Usage</h2>
                <p className="text-muted-foreground">
                  We collect anonymous usage statistics to improve the app
                  experience, but this never includes your personal or medical
                  information. You can opt out of analytics in the app settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-center text-muted-foreground">
          <p>
            By continuing, you acknowledge that you have read and understood our
            privacy practices. For more details, you can view our full{" "}
            <a
              href="#"
              className="text-primary underline hover:text-primary/80"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={onNext} className="flex items-center gap-2">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyInformation;
