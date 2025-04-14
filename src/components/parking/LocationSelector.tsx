import { useState } from "react";
import { ParkingLocationMap } from "@/components/parking/ParkingLocationMap";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent
} from "@/components/ui/card";

export interface LocationInfo {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

interface LocationSelectorProps {
  userLocation: {lat: number, lng: number} | null;
  isLoadingLocation: boolean;
  onLocationSelect: (location: LocationInfo) => void;
  handleGetCurrentLocation: () => void;
}

export const LocationSelector = ({
  userLocation,
  isLoadingLocation,
  onLocationSelect,
  handleGetCurrentLocation
}: LocationSelectorProps) => {
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = (location: LocationInfo) => {
    setIsSearching(false);
    onLocationSelect(location);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select a Parking Location</CardTitle>
        <CardDescription>
          Click anywhere on the map to search for parking locations in that area. Then click on a parking icon (P) to select it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userLocation ? (
          <ParkingLocationMap 
            latitude={userLocation.lat} 
            longitude={userLocation.lng}
            name="Your Location"
            onLocationSelect={handleLocationSelect}
          />
        ) : (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg p-4">
            <Loader2 className="h-8 w-8 animate-spin text-parkblue-500" />
            <span className="ml-2">Getting your location...</span>
          </div>
        )}
        <div className="mt-4">
          <Button 
            onClick={handleGetCurrentLocation} 
            variant="outline" 
            className="w-full sm:w-auto"
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Getting location...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Refresh My Location
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
