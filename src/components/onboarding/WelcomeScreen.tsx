import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted?: () => void;
  appName?: string;
  description?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted = () => console.log("Get Started clicked"),
  appName = "Joint Replacement Scanner",
  description = "A simple way to scan QR codes containing joint replacement information and store it securely in your Apple Health repository.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      <div className="max-w-md mx-auto">
        {/* App Logo */}
        <div className="mb-8 bg-blue-100 p-6 rounded-full inline-flex items-center justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600"
          >
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect width="7" height="7" x="7" y="7" rx="1" />
            <path d="M10 10h1v1h-1z" />
          </svg>
        </div>

        {/* App Title */}
        <h1 className="text-3xl font-bold mb-4 text-gray-900">{appName}</h1>

        {/* App Description */}
        <p className="text-gray-600 mb-8">{description}</p>

        {/* Features List */}
        <div className="text-left mb-8">
          <div className="flex items-start mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect width="7" height="7" x="7" y="7" rx="1" />
                <path d="M10 10h1v1h-1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Scan QR Codes</h3>
              <p className="text-sm text-gray-600">
                Quickly scan joint replacement QR codes with your camera
              </p>
            </div>
          </div>

          <div className="flex items-start mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Health Integration</h3>
              <p className="text-sm text-gray-600">
                Store your joint replacement data securely in Apple Health
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Privacy First</h3>
              <p className="text-sm text-gray-600">
                Your data stays on your device and is never shared without
                permission
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <Button onClick={onGetStarted} className="w-full py-6" size="lg">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
