import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, MapPin, Car, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export interface BookingData {
  id: string;
  parkingLot: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: "upcoming" | "active";  // Updated to match database types
  vehicleNumber: string;
}

interface BookingCardProps {
  booking: BookingData;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export const BookingCard = ({ booking, onCancel, onComplete }: BookingCardProps) => {
  const statusColors = {
    upcoming: "bg-parkblue-100 text-parkblue-700",
    active: "bg-parkteal-100 text-parkteal-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };
  
  const statusLabels = {
    upcoming: "Upcoming",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel(booking.id);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete(booking.id);
    }
  };

  return (
    <Card className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{booking.parkingLot}</CardTitle>
          <span className={`text-xs py-1 px-2 rounded-full ${statusColors[booking.status]}`}>
            {statusLabels[booking.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-parkblue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Slot {booking.slotId}</p>
              <p className="text-gray-500">Level 2, Section A</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-parkblue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">{booking.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-parkblue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">
                {booking.startTime} - {booking.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Car className="h-4 w-4 text-parkblue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Vehicle: {booking.vehicleNumber}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-gray-100">
        <p className="font-medium">${booking.price.toFixed(2)}</p>
        {booking.status === "upcoming" && onCancel && (
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        {booking.status === "active" && onComplete && (
          <Button variant="outline" size="sm" onClick={handleComplete}>
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
