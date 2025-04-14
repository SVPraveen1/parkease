
import { Button } from "@/components/ui/button";
import { ParkingMap } from "@/components/parking/ParkingMap";
import { ParkingSlotData } from "@/components/parking/ParkingMap";
import { LocationInfo } from "@/components/parking/LocationSelector";
import { ArrowLeft, Clock, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SlotsViewerProps {
  selectedLocation: LocationInfo;
  parkingSlots: ParkingSlotData[];
  selectedSlotId: string | null;
  isLoadingSlots: boolean;
  onSlotSelect: (slotId: string) => void;
  onBack: () => void;
}

export const SlotsViewer = ({
  selectedLocation,
  parkingSlots,
  selectedSlotId,
  isLoadingSlots,
  onSlotSelect,
  onBack
}: SlotsViewerProps) => {
  const availableSlots = parkingSlots.filter(slot => slot.status === "available").length;

  return (
    <div>
      <Button 
        variant="outline" 
        onClick={onBack} 
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Map
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{selectedLocation.name}</CardTitle>
          <CardDescription>{selectedLocation.address}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4" />
            <span>Open 24 hours</span>
          </div>
          
          {isLoadingSlots ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg p-4">
              <Loader2 className="h-8 w-8 animate-spin text-parkblue-500" />
              <span className="ml-2">Loading parking slots...</span>
            </div>
          ) : (
            <>
              <Alert className="mb-4 bg-blue-50">
                <AlertDescription className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Click on an available slot to select it, then click "Book Selected Slot" to proceed
                </AlertDescription>
              </Alert>

              <ParkingMap 
                slots={parkingSlots} 
                onSlotSelect={onSlotSelect}
                selectedSlotId={selectedSlotId}
              />
            </>
          )}
        </CardContent>

        {selectedSlotId && !isLoadingSlots && (
          <CardFooter className="flex justify-end pt-4 border-t">
            <Button onClick={() => onSlotSelect(selectedSlotId)} className="flex items-center">
              Book Selected Slot <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
