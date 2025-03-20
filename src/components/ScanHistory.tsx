import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Share2, Trash2 } from "lucide-react";

interface ScanHistoryItem {
  id: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  implantDate: string;
  scanDate: string;
}

export default function ScanHistory() {
  // Mock data for demonstration
  const historyItems: ScanHistoryItem[] = [
    {
      id: "1",
      type: "Hip Replacement",
      manufacturer: "Zimmer Biomet",
      model: "Taperloc Complete",
      serialNumber: "ZB-TC-2023-45678",
      implantDate: "2023-05-15",
      scanDate: "2023-06-10",
    },
    {
      id: "2",
      type: "Knee Replacement",
      manufacturer: "Stryker",
      model: "Triathlon",
      serialNumber: "ST-TR-2023-12345",
      implantDate: "2023-03-22",
      scanDate: "2023-04-05",
    },
    {
      id: "3",
      type: "Shoulder Replacement",
      manufacturer: "DePuy Synthes",
      model: "Global AP",
      serialNumber: "DP-GA-2022-98765",
      implantDate: "2022-11-30",
      scanDate: "2023-01-15",
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Scan History</h2>

      {historyItems.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No scan history yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{item.type}</h3>
                <span className="text-xs text-gray-500">
                  Scanned: {item.scanDate}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <p>
                  {item.manufacturer} - {item.model}
                </p>
                <p>SN: {item.serialNumber}</p>
                <p>Implanted: {item.implantDate}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="mr-1 h-3 w-3" /> Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
