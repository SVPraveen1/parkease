import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Clock, CarFront, MapPin, CreditCard } from "lucide-react";

export interface BookingData {
  id: string;
  locationName: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: "upcoming" | "active";
  vehicleNumber: string;
}

interface BookingCardProps {
  booking: BookingData;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
}

export const BookingCard = ({ booking, onCancel, onComplete }: BookingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{booking.locationName}</h3>
          <p className="text-gray-600">Slot {booking.slotId}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-medium capitalize" 
          style={{ 
            backgroundColor: booking.status === 'active' ? '#dcfce7' : '#f1f5f9',
            color: booking.status === 'active' ? '#166534' : '#475569'
          }}
        >
          {booking.status}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="font-medium">{booking.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Time:</span>
          <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Vehicle:</span>
          <span className="font-medium">{booking.vehicleNumber}</span>
        </div>        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="font-medium">₹{booking.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4 border-t">
        {booking.status === 'upcoming' && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            Cancel Booking
          </button>
        )}
        {booking.status === 'active' && onComplete && (
          <button
            onClick={() => onComplete(booking.id)}
            className="w-full px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
          >
            Complete Booking
          </button>
        )}
      </div>
    </div>
  );
};
