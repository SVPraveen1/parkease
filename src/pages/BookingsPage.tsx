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
import type { Database } from "@/integrations/supabase/types";

type BookingDetail = Database['public']['Tables']['booking_details']['Row'];

const transformBooking = (bookingDetail: BookingDetail): BookingData => {
  const startDate = new Date(bookingDetail.start_time);
  const endDate = new Date(startDate.getTime() + bookingDetail.duration * 60000);

  return {
    id: bookingDetail.booking_id,
    locationName: bookingDetail.location_name,
    slotId: bookingDetail.slot_number,
    date: startDate.toLocaleDateString(),
    startTime: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    endTime: endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    price: bookingDetail.price,
    status: bookingDetail.status as "upcoming" | "active",
    vehicleNumber: bookingDetail.vehicle_number
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
      // Initial fetch
      fetchBookings();

      // Check booking statuses every 30 seconds
      intervalId = window.setInterval(() => {
        fetchBookings();
      }, 30000); // 30 second interval
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
        .from("booking_details")
        .select("*")
        .eq("user_id", user?.id)
        .in("status", ["upcoming", "active"])
        .order("start_time", { ascending: true });
        
      if (error) {
        throw error;
      }

      const now = new Date();
      const updatedBookings: BookingDetail[] = [];
      
      // Process each booking and update status if needed
      for (const booking of (data as BookingDetail[] || [])) {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(startTime.getTime() + booking.duration * 60000);
          // Determine the correct status or if booking should be removed
        const now = new Date();
        
        // If the booking has completely passed its end time
        if (now > endTime) {
          // Remove expired booking
          await supabase
            .from("booking_details")
            .delete()
            .eq("booking_id", booking.booking_id);
            
          await supabase
            .from("bookings")
            .delete()
            .eq("id", booking.booking_id);
          
          continue; // Skip this booking
        }
        
        // If booking is currently active
        if (now >= startTime && now <= endTime) {
          // Update the status in database if it's not already active
          if (booking.status !== "active") {
            await supabase
              .from("booking_details")
              .update({ status: "active" })
              .eq("booking_id", booking.booking_id);
            
            await supabase
              .from("bookings")
              .update({ status: "active" })
              .eq("id", booking.booking_id);
          }
          
          updatedBookings.push({
            ...booking,
            status: "active"
          });
        } 
        // If booking is truly upcoming (start time is in the future)
        else if (startTime > now) {
          updatedBookings.push({
            ...booking,
            status: "upcoming"
          });
        }
      }      const filteredBookings = updatedBookings.filter(booking => {
        if (activeTab === "upcoming") {
          return booking.status === "upcoming";
        } else if (activeTab === "active") {
          return booking.status === "active";
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
      // First delete from booking_details
      const { error: detailsError } = await supabase
        .from("booking_details")
        .delete()
        .eq("booking_id", id);
        
      if (detailsError) {
        throw detailsError;
      }

      // Then delete from bookings
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
      // First delete from booking_details
      const { error: detailsError } = await supabase
        .from("booking_details")
        .delete()
        .eq("booking_id", id);
        
      if (detailsError) {
        throw detailsError;
      }

      // Then delete from bookings
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);
        
      if (error) {
        throw error;
      }
      
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
