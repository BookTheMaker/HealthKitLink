import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Scan, Camera, Check, X } from "lucide-react";

interface JointReplacementData {
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  implantDate: string;
  surgeon: string;
  hospital: string;
}

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<JointReplacementData | null>(
    null,
  );
  const [saved, setSaved] = useState(false);

  const startScanning = () => {
    setScanning(true);
    // In a real app, this would activate the camera and QR scanner
    // For demo purposes, we'll simulate finding a QR code after 2 seconds
    setTimeout(() => {
      const mockData: JointReplacementData = {
        type: "Hip Replacement",
        manufacturer: "Zimmer Biomet",
        model: "Taperloc Complete",
        serialNumber: "ZB-TC-2023-45678",
        implantDate: "2023-05-15",
        surgeon: "Dr. Sarah Johnson",
        hospital: "Memorial Orthopedic Center",
      };
      setScannedData(mockData);
      setScanning(false);
    }, 2000);
  };

  const saveToHealth = () => {
    // In a real app, this would integrate with HealthKit
    setSaved(true);
    setTimeout(() => {
      setScannedData(null);
      setSaved(false);
    }, 2000);
  };

  const cancelScan = () => {
    setScannedData(null);
    setScanning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Joint Replacement Scanner
      </h2>

      {!scanning && !scannedData && (
        <div className="flex flex-col items-center w-full">
          <div className="bg-slate-100 p-8 rounded-full mb-6">
            <Scan size={64} className="text-blue-600" />
          </div>
          <Button onClick={startScanning} className="w-full mb-4">
            <Camera className="mr-2 h-4 w-4" /> Scan QR Code
          </Button>
          <p className="text-sm text-gray-500 text-center mt-2">
            Scan a joint replacement QR code to import data into your health
            repository
          </p>
        </div>
      )}

      {scanning && (
        <div className="w-full aspect-square bg-slate-800 rounded-lg relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 m-auto w-2/3 h-2/3 border-2 border-white/50 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <p className="text-white text-sm animate-pulse">
              Scanning for QR code...
            </p>
          </div>
          <Button
            variant="outline"
            onClick={cancelScan}
            className="absolute bottom-4 right-4 bg-white/20"
          >
            Cancel
          </Button>
        </div>
      )}

      {scannedData && !saved && (
        <Card className="w-full p-4">
          <h3 className="text-lg font-semibold mb-4">Joint Replacement Data</h3>
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="font-medium">{scannedData.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Manufacturer:</span>
              <span className="font-medium">{scannedData.manufacturer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Model:</span>
              <span className="font-medium">{scannedData.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Serial Number:</span>
              <span className="font-medium">{scannedData.serialNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Implant Date:</span>
              <span className="font-medium">{scannedData.implantDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Surgeon:</span>
              <span className="font-medium">{scannedData.surgeon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Hospital:</span>
              <span className="font-medium">{scannedData.hospital}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={saveToHealth} className="flex-1">
              <Check className="mr-2 h-4 w-4" /> Save to Health
            </Button>
            <Button variant="outline" onClick={cancelScan} className="flex-1">
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </div>
        </Card>
      )}

      {saved && (
        <div className="flex flex-col items-center w-full">
          <div className="bg-green-100 p-8 rounded-full mb-6">
            <Check size={64} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Data Saved Successfully
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Joint replacement data has been added to your health repository
          </p>
        </div>
      )}
    </div>
  );
}
