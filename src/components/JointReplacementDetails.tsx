import React from "react";
import { JointReplacementData } from "../lib/healthkit";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Trash2, Share2, Edit } from "lucide-react";

interface JointReplacementDetailsProps {
  data: JointReplacementData;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const JointReplacementDetails: React.FC<JointReplacementDetailsProps> = ({
  data,
  onEdit = () => {},
  onDelete = () => {},
  onShare = () => {},
}) => {
  // Format the implant date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{data.type} Replacement</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
            <p className="text-gray-900">{data.manufacturer}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Model</h3>
            <p className="text-gray-900">{data.model}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
            <p className="text-gray-900">{data.serialNumber}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Implant Date</h3>
            <p className="text-gray-900">{formatDate(data.implantDate)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-gray-900">{data.location}</p>
          </div>

          {data.surgeon && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Surgeon</h3>
              <p className="text-gray-900">{data.surgeon}</p>
            </div>
          )}

          {data.hospital && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Hospital</h3>
              <p className="text-gray-900">{data.hospital}</p>
            </div>
          )}
        </div>

        {data.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="text-gray-900 whitespace-pre-line">{data.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between space-x-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="flex-1"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JointReplacementDetails;
