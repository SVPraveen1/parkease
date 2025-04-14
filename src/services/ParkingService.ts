import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ParkingSlotData } from "@/components/parking/ParkingMap";

export const ParkingService = {
  fetchParkingSlots: async (): Promise<ParkingSlotData[]> => {
    try {
      // Get all active slots
      const { data: slotsData, error: slotsError } = await supabase
        .from("parking_slots")
        .select("*")
        .eq("is_active", true);

      if (slotsError) {
        throw slotsError;
      }

      if (slotsData) {
        // Get current bookings
        const now = new Date().toISOString();
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .in("status", ["upcoming", "active"]);

        if (bookingsError) {
          throw bookingsError;
        }

        // Create a set of booked slot IDs
        const bookedSlotIds = new Set();
        
        if (bookingsData) {
          bookingsData.forEach(booking => {
            const startTime = new Date(booking.start_time);
            const endTime = new Date(startTime.getTime() + booking.duration * 60 * 1000);
            const now = new Date();
            
            // Update booking status based on time
            if (now >= startTime && now <= endTime) {
              // Update booking to active if it's currently upcoming
              if (booking.status === "upcoming") {
                supabase
                  .from("bookings")
                  .update({ status: "active" })
                  .eq("id", booking.id)
                  .then(({ error }) => {
                    if (error) console.error("Error updating booking status:", error);
                  });
              }
              bookedSlotIds.add(booking.slot_id);
            } else if (now > endTime) {
              // Remove expired bookings and make slots available
              supabase
                .from("bookings")
                .delete()
                .eq("id", booking.id)
                .then(({ error }) => {
                  if (error) console.error("Error removing expired booking:", error);
                });
            } else if (now < startTime) {
              // Future bookings should still mark the slot as booked
              bookedSlotIds.add(booking.slot_id);
            }
          });
        }

        // Transform slot data with status
        const transformedSlots: ParkingSlotData[] = slotsData.map((slot) => ({
          id: slot.number,
          status: bookedSlotIds.has(slot.id) ? "booked" : "available",
          slotId: slot.id
        }));
        
        return transformedSlots;
      }

      return [];
    } catch (error) {
      console.error("Error fetching parking slots:", error);
      toast.error("Failed to load parking slots");
      return [];
    }
  },

  validateSlotAvailability: async (slotId: string, startTime: string, duration: number): Promise<boolean> => {
    try {
      const endTime = new Date(new Date(startTime).getTime() + duration * 60 * 1000).toISOString();
      
      // Check for any overlapping bookings
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("slot_id", slotId)
        .in("status", ["upcoming", "active"])
        .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

      if (error) {
        throw error;
      }

      return !bookings || bookings.length === 0;
    } catch (error) {
      console.error("Error validating slot availability:", error);
      return false;
    }
  },

  cleanupExpiredBookings: async () => {
    try {
      const now = new Date();
      
      // Get all bookings
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*");

      if (error) {
        console.error("Error fetching bookings for cleanup:", error);
        return;
      }

      if (!bookings) return;

      for (const booking of bookings) {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(startTime.getTime() + booking.duration * 60 * 1000);

        // Remove if booking is ended
        if (now > endTime) {
          const { error: deleteError } = await supabase
            .from("bookings")
            .delete()
            .eq("id", booking.id);

          if (deleteError) {
            console.error("Error removing expired booking:", deleteError);
          }
        } 
        // Update to active if booking has started but not ended
        else if (now >= startTime && now <= endTime && booking.status === "upcoming") {
          const { error: updateError } = await supabase
            .from("bookings")
            .update({ status: "active" })
            .eq("id", booking.id);

          if (updateError) {
            console.error("Error updating booking status:", updateError);
          }
        }
      }
    } catch (error) {
      console.error("Error in cleanup process:", error);
    }
  }
};
