import React from "react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import {
  Settings as SettingsIcon,
  Shield,
  Heart,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <SettingsIcon className="mr-2 h-6 w-6" /> Settings
      </h2>

      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-500" /> Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save Scan History</p>
                <p className="text-sm text-gray-500">
                  Store scanned QR data on device
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-gray-500">Help improve the app</p>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-red-500" /> Health Integration
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-Save to Health</p>
                <p className="text-sm text-gray-500">
                  Automatically save scans
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Health Categories</p>
                <p className="text-sm text-gray-500">
                  Manage health data categories
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Reconnect Health App
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <HelpCircle className="mr-2 h-5 w-5 text-purple-500" /> About & Help
          </h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
              <span>Help Center</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              <span>Privacy Policy</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
              <span>Terms of Service</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="pt-2 text-center text-sm text-gray-500">
              Version 1.0.0
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
