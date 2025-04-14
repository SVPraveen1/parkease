import { Button } from "@/components/ui/button";
import { ParkingMap } from "@/components/parking/ParkingMap";
import { ParkingSlotData } from "@/components/parking/ParkingMap";
import { BookingForm } from "@/components/booking/BookingForm";
import { LocationInfo } from "@/components/parking/LocationSelector";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingViewProps {
  selectedLocation: LocationInfo;
  parkingSlots: ParkingSlotData[];
  selectedSlotId: string;
  onBack: () => void;
  onBookingComplete: () => void;
}

export const BookingView = ({
  selectedLocation,
  parkingSlots,
  selectedSlotId,
  onBack,
  onBookingComplete
}: BookingViewProps) => {
  const selectedSlot = parkingSlots.find(slot => slot.id === selectedSlotId);

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Slots
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{selectedLocation.name}</CardTitle>
              <CardDescription>{selectedLocation.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-green-50">
                <AlertDescription className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  You've selected slot {selectedSlotId}. Fill in the booking details to confirm.
                </AlertDescription>
              </Alert>

              <ParkingMap 
                slots={parkingSlots} 
                onSlotSelect={() => {}}
                selectedSlotId={selectedSlotId}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <BookingForm 
            selectedSlotId={selectedSlotId}
            parkingLocationName={selectedLocation.name}
            onBookingComplete={onBookingComplete}
          />
        </div>
      </div>
    </div>
  );
};
