import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ParkingSlotData } from "@/components/parking/ParkingMap";
import { LocationSelector, LocationInfo } from "@/components/parking/LocationSelector";
import { SlotsViewer } from "@/components/parking/SlotsViewer";
import { BookingView } from "@/components/parking/BookingView";
import { ParkingService } from "@/services/ParkingService";

const ParkingPage = () => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentStep, setCurrentStep] = useState<"map" | "slots" | "booking">("map");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get user's current location when the page loads
  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  // Fetch parking slots when a location is selected
  useEffect(() => {
    if (selectedLocation && currentStep === "slots") {
      fetchParkingSlots();
    }
  }, [selectedLocation, currentStep]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
      },
      () => {
        toast.error("Unable to retrieve your location");
        setIsLoadingLocation(false);
        // Set to default location if geolocation fails
        setUserLocation({ lat: 37.7749, lng: -122.4194 }); // San Francisco
      }
    );
  };
  
  const fetchParkingSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const slots = await ParkingService.fetchParkingSlots();
      setParkingSlots(slots);
    } finally {
      setIsLoadingSlots(false);
    }
  };
  
  const handleSlotSelect = (slotId: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to select a parking slot");
      return;
    }
    setSelectedSlotId(slotId);
    setCurrentStep("booking");
  };
  
  const handleBookingComplete = () => {
    navigate("/bookings");
  };

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location);
    setCurrentStep("slots");
    toast.success(`Selected parking at: ${location.name}`);
  };

  const handleBackToMap = () => {
    setCurrentStep("map");
    setSelectedSlotId(null);
  };

  const handleBackToSlots = () => {
    setCurrentStep("slots");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Parking</h1>
      
      {currentStep === "map" && (
        <LocationSelector 
          userLocation={userLocation}
          isLoadingLocation={isLoadingLocation}
          onLocationSelect={handleLocationSelect}
          handleGetCurrentLocation={handleGetCurrentLocation}
        />
      )}
      
      {currentStep === "slots" && selectedLocation && (
        <SlotsViewer 
          selectedLocation={selectedLocation}
          parkingSlots={parkingSlots}
          selectedSlotId={selectedSlotId}
          isLoadingSlots={isLoadingSlots}
          onSlotSelect={handleSlotSelect}
          onBack={handleBackToMap}
        />
      )}
      
      {currentStep === "booking" && selectedLocation && selectedSlotId && (
        <BookingView 
          selectedLocation={selectedLocation}
          parkingSlots={parkingSlots}
          selectedSlotId={selectedSlotId}
          onBack={handleBackToSlots}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
};

export default ParkingPage;
