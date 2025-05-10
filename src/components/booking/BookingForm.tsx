import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { ParkingService } from "@/services/ParkingService";
import type { Database } from "@/integrations/supabase/types";

type BookingDetail = Database['public']['Tables']['booking_details']['Insert'];

interface BookingFormProps {
  selectedSlotId: string | null;
  parkingLocationName?: string;
  onBookingComplete: () => void;
}

export const BookingForm = ({ 
  selectedSlotId, 
  parkingLocationName, 
  onBookingComplete 
}: BookingFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
    // Calculate price based on duration (simple implementation)
  const calculatePrice = (durationHours: number) => {
    // Base rate: ₹100 per hour
    return Math.max(100 * durationHours, 100);
  };

  // Calculate the current price based on selected duration
  const calculateCurrentPrice = () => {
    if (!startTime || !endTime) return 0;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const durationHours = endHour - startHour;
    return calculatePrice(durationHours);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!selectedSlotId) {
        toast.error("Please select a parking slot");
        return;
      }

      if (!user) {
        toast.error("You need to be logged in to book a slot");
        return;
      }

      if (!vehicleNumber) {
        toast.error("Please enter your vehicle registration number");
        return;
      }

      if (!date) {
        toast.error("Please select a date");
        return;
      }

      // Format the date and time for the database
      const bookingDate = new Date(date);
      const [hours, minutes] = startTime.split(':').map(Number);
      
      bookingDate.setHours(hours, minutes, 0, 0);
      
      // Calculate duration in minutes
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      const durationMinutes = (endHour - startHour) * 60;
      
      // Check slot availability first
      const isAvailable = await ParkingService.validateSlotAvailability(
        selectedSlotId,
        bookingDate.toISOString(),
        durationMinutes
      );

      if (!isAvailable) {
        toast.error("This slot is not available for the selected time period");
        return;
      }

      // First create the booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          slot_id: selectedSlotId,
          start_time: bookingDate.toISOString(),
          duration: durationMinutes,
          status: "upcoming",
          vehicle_number: vehicleNumber
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;

      // Calculate price
      const price = calculatePrice(durationMinutes / 60);

      // Then store the complete booking details
      const { error: detailsError } = await supabase
        .from("booking_details")
        .insert({
          booking_id: bookingData.id,
          user_id: user.id,
          location_name: parkingLocationName || "",
          slot_number: selectedSlotId,
          start_time: bookingDate.toISOString(),
          duration: durationMinutes,
          status: "upcoming",
          vehicle_number: vehicleNumber,
          price: price
        } satisfies BookingDetail);

      if (detailsError) {
        // If storing details fails, rollback the booking
        await supabase
          .from("bookings")
          .delete()
          .eq("id", bookingData.id);
        throw detailsError;
      }

      toast.success("Booking confirmed!");
      onBookingComplete();
    } catch (err: any) {
      console.error("Error booking slot:", err);
      toast.error(err.message || "Failed to complete booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Booking Details</h3>
      
      <div className="space-y-2">
        <Label>Selected Slot</Label>
        <Input value={selectedSlotId ? `Slot ${selectedSlotId}` : "No slot selected"} readOnly className="bg-gray-50" />
      </div>

      {parkingLocationName && (
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={parkingLocationName} readOnly />
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Select value={startTime} onValueChange={(value) => {
            setStartTime(value);
            // Auto-adjust end time to be at least 1 hour after start time
            const startHour = parseInt(value.split(':')[0]);
            const currentEndHour = parseInt(endTime.split(':')[0]);
            if (currentEndHour <= startHour) {
              setEndTime(`${startHour + 1}:00`);
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                <SelectItem key={hour} value={`${hour}:00`}>
                  {`${hour}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>End Time</Label>
          <Select value={endTime} onValueChange={setEndTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 13 }, (_, i) => i + parseInt(startTime.split(':')[0]) + 1)
                .filter(hour => hour <= 21)
                .map((hour) => (
                <SelectItem key={hour} value={`${hour}:00`}>
                  {`${hour}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vehicle Number</Label>
        <Input
          placeholder="Enter vehicle registration number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
        />
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">Total Price:</span>
          <span className="text-lg font-semibold text-primary">₹{calculateCurrentPrice()}</span>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming Booking
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </form>
  );
};
