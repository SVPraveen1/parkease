import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ParkingLocationMapProps {
  latitude: number;
  longitude: number;
  name: string;
  onLocationSelect?: (location: { lat: number, lng: number, name: string, address: string }) => void;
}

export const ParkingLocationMap = ({ latitude, longitude, name, onLocationSelect }: ParkingLocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) {
        return;
      }

      try {
        setIsLoading(true);
        
        const mapOptions: google.maps.MapOptions = {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          gestureHandling: "cooperative"
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Add user's location marker with correct animation
        const userMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(40, 40)
          },
          animation: google.maps.Animation.DROP
        });

        const userInfoWindow = new google.maps.InfoWindow({
          content: "<div><strong>You are here</strong><br>Searching for nearby parking...</div>"
        });

        userMarker.addListener("click", () => {
          userInfoWindow.open(map, userMarker);
        });

        // Show info window briefly
        setTimeout(() => {
          userInfoWindow.open(map, userMarker);
          setTimeout(() => userInfoWindow.close(), 5000);
        }, 1000);

        // Automatically search for parking locations
        const currentLocation = { lat: latitude, lng: longitude };
        searchNearbyParkingLots(map, currentLocation);

        if (onLocationSelect) {
          // Add click listener for finding parking
          map.addListener("click", async (event: google.maps.MapMouseEvent) => {
            if (!event.latLng) return;
            
            const clickedLocation = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            
            toast.info("Searching for parking locations...");
            searchNearbyParkingLots(map, clickedLocation);
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map. Please try again.");
        setIsLoading(false);
      }
    };

    const searchNearbyParkingLots = (map: google.maps.Map, location: {lat: number, lng: number}) => {
      if (!window.google || !window.google.maps) return;
      
      clearMarkers();
      
      const service = new google.maps.places.PlacesService(map);
      
      const request: google.maps.places.PlacesSearchRequest = {
        location: location,
        radius: 1000,
        type: "parking"
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach(place => createParkingMarker(place, map));
          
          if (results.length > 0) {
            toast.success(`Found ${results.length} parking locations nearby`);
            
            const bounds = new google.maps.LatLngBounds();
            markersRef.current.forEach(marker => {
              if (marker.getPosition()) {
                bounds.extend(marker.getPosition()!);
              }
            });
            map.fitBounds(bounds);
          } else {
            toast.error("No parking lots found nearby");
          }
        } else {
          toast.error("No parking lots found nearby");
        }
      });
    };

    const createParkingMarker = (place: google.maps.places.PlaceResult, map: google.maps.Map) => {
      if (!place.geometry || !place.geometry.location) return;
      
      const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name || "Parking Location",
        label: {
          text: "P",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold"
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 14,
          fillColor: "#FF0000",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2
        },
        animation: google.maps.Animation.DROP
      });
      
      markersRef.current.push(marker);
      
      marker.addListener("click", () => {
        // Add bounce animation when clicked
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 750);
        
        if (onLocationSelect && place.name) {
          onLocationSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.name,
            address: place.vicinity || "No address available"
          });
        }
      });
      
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${place.name}</strong><br>${place.vicinity || ""}<br><em>Click to select this location</em></div>`
      });
      
      marker.addListener("mouseover", () => {
        infoWindow.open(map, marker);
      });
      
      marker.addListener("mouseout", () => {
        infoWindow.close();
      });
    };
    
    const clearMarkers = () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };

    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      window.initMap = initializeMap;
      
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error("Failed to load Google Maps API");
        setError("Failed to load Google Maps API. Please check your internet connection and try again.");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        window.initMap = () => {};
      };
    }
  }, [latitude, longitude, name, onLocationSelect]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="w-full h-48 bg-red-50 flex items-center justify-center rounded-lg border border-red-200">
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-parkblue-500" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-64 md:h-96 bg-gray-100 rounded-lg"
        aria-label={`Map showing ${name} location`} 
      />
      {onLocationSelect && (
        <div className="mt-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-md border border-blue-100">
          <p className="font-medium">Instructions:</p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
            <li>Click anywhere on the map to find nearby parking locations</li>
            <li>Click on a parking icon (P) to select that parking location</li>
            <li>Once selected, you'll be shown available parking slots</li>
          </ol>
        </div>
      )}
    </div>
  );
};
