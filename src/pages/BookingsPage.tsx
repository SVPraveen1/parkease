import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { BookingCard, BookingData } from "@/components/booking/BookingCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ParkingService } from "@/services/ParkingService";

interface DbBooking {
  id: string;
  start_time: string;
  duration: number;
  slot_id: string;
  status: "upcoming" | "active";
  vehicle_number: string;
  parking_slot?: {
    number: string;
    location_name: string;  // Add location name to the type
  };
}

const transformBooking = (booking: DbBooking): BookingData => {
  const startDate = new Date(booking.start_time);
  const endDate = new Date(startDate.getTime() + booking.duration * 60000);

  // Calculate price based on duration (base rate: $6 per hour)
  const durationHours = booking.duration / 60;
  const price = Math.max(6 * durationHours, 6);

  return {
    id: booking.id,
    parkingLot: booking.parking_slot?.location_name || "Parking Location",
    slotId: booking.parking_slot?.number || booking.slot_id,
    date: startDate.toLocaleDateString(),
    startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: price,
    status: booking.status,
    vehicleNumber: booking.vehicle_number
  };
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, activeTab]);

  // Set up periodic check for booking status updates
  useEffect(() => {
    let intervalId: number;

    if (user) {
      // Initial cleanup and fetch
      ParkingService.cleanupExpiredBookings().then(() => fetchBookings());

      // Check booking statuses every minute
      intervalId = window.setInterval(() => {
        ParkingService.cleanupExpiredBookings().then(() => fetchBookings());
      }, 60000); // 1 minute interval
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [user]);
  
  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          duration,
          slot_id,
          status,
          vehicle_number,
          parking_slot:slot_id (
            number,
            location_name
          )
        `)
        .eq("user_id", user?.id)
        .order("start_time", { ascending: true });
        
      if (error) {
        throw error;
      }

      const now = new Date();
      const filteredBookings = (data as DbBooking[] || []).filter(booking => {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(startTime.getTime() + booking.duration * 60000);

        if (activeTab === "upcoming") {
          return startTime > now;
        } else if (activeTab === "active") {
          return startTime <= now && endTime > now;
        }
        return false;
      });
      
      const transformedBookings = filteredBookings.map(transformBooking);
      setBookings(transformedBookings);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      setBookings(bookings.filter(booking => booking.id !== id));
      toast.success("Booking cancelled successfully");
    } catch (err: any) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to cancel booking");
    }
  };
  
  const handleCompleteBooking = async (id: string) => {
    try {
      // Find the booking to check its end time
      const booking = bookings.find(b => b.id === id);
      if (!booking) {
        throw new Error("Booking not found");
      }

      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
      // Remove the booking from the state immediately
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
      await fetchBookings(); // Refresh the list to ensure sync
      toast.success("Booking marked as completed");
    } catch (err: any) {
      console.error("Error completing booking:", err);
      toast.error("Failed to complete booking");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <TabsContent value="upcoming">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No upcoming bookings found</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.href = "/parking"}>
                    Book a parking slot
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      onCancel={() => handleCancelBooking(booking.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No active bookings found</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map(booking => (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      onComplete={() => handleCompleteBooking(booking.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default BookingsPage;
