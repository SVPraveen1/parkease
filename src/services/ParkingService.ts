import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ParkingSlotData } from "@/components/parking/ParkingMap";

export const ParkingService = {
  fetchParkingSlots: async (locationId?: string): Promise<ParkingSlotData[]> => {
    try {
      // Build query with location filter if provided
      let query = supabase
        .from("parking_slots")
        .select(`
          id,
          number,
          is_active,
          location:location_id (
            id,
            name,
            address
          )
        `)
        .eq("is_active", true);

      // Add location filter if provided
      if (locationId) {
        query = query.eq("location_id", locationId);
      }

      const { data: slotsData, error: slotsError } = await query;

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
            
            if (now >= startTime && now <= endTime) {
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
            }
          });
        }

        // Transform slot data with status and location info
        const transformedSlots: ParkingSlotData[] = slotsData.map((slot) => {
          const slotNumber = `Slot ${String(slot.number).padStart(2, '0')}`;
          
          if (!slot.location) {
            console.error(`No location found for slot ${slotNumber}`);
          }

          return {
            id: slotNumber,
            status: bookedSlotIds.has(slot.id) ? "booked" : "available",
            slotId: slot.id.toString(),
            location: {
              name: slot.location?.name || "Unknown Location",
              address: slot.location?.address || "Address not available"
            }
          };
        });
        
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
      const newStartTime = new Date(startTime);
      const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000);
      
      // Check for any overlapping bookings
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("slot_id", slotId)
        .in("status", ["upcoming", "active"])
        .or(
          `start_time.gte.${newStartTime.toISOString()},start_time.lt.${newEndTime.toISOString()}`
        );

      if (error) {
        throw error;
      }

      // Also check if any existing booking's end time overlaps with our time slot
      if (bookings) {
        for (const booking of bookings) {
          const existingStartTime = new Date(booking.start_time);
          const existingEndTime = new Date(existingStartTime.getTime() + booking.duration * 60 * 1000);
          
          // Check if there's any overlap
          if (
            (newStartTime <= existingEndTime && newEndTime >= existingStartTime) ||
            (existingStartTime <= newEndTime && existingEndTime >= newStartTime)
          ) {
            return false;
          }
        }
      }

      return true;
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
