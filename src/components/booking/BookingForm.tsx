import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format, addHours } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

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
  const calculatePrice = () => {
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const durationHours = endHour - startHour;
    
    // Base rate: $6 per hour
    return Math.max(6 * durationHours, 6);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    setIsLoading(true);
    
    try {
      // Format the date and time for the database
      const bookingDate = new Date(date);
      const [hours, minutes] = startTime.split(':').map(Number);
      
      bookingDate.setHours(hours, minutes, 0, 0);
      
      // Calculate duration in minutes
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      const durationMinutes = (endHour - startHour) * 60;
      
      // Debug log
      console.log('Booking data:', {
        user_id: user?.id,
        slot_id: selectedSlotId,
        start_time: bookingDate.toISOString(),
        duration: durationMinutes,
        vehicle_number: vehicleNumber,
        status: 'upcoming'
      });

      // Insert booking into Supabase with the correct status value
      const { data, error } = await supabase.from('bookings').insert({
        user_id: user?.id,
        slot_id: selectedSlotId,
        start_time: bookingDate.toISOString(),
        duration: durationMinutes,
        vehicle_number: vehicleNumber,
        status: 'upcoming'
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Booking confirmed!");
      onBookingComplete();
    } catch (error: any) {
      console.error("Error booking slot:", error);
      toast.error(error.message || "Failed to complete booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">Booking Details</h3>
      
      <div className="space-y-2">
        <Label>Selected Slot</Label>
        <Input value={selectedSlotId || "No slot selected"} readOnly />
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
                  {hour}:00 {hour < 12 ? "AM" : "PM"}
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
              {Array.from({ length: 13 }, (_, i) => i + 9).map((hour) => (
                <SelectItem 
                  key={hour} 
                  value={`${hour}:00`}
                  disabled={hour <= parseInt(startTime.split(':')[0])}
                >
                  {hour}:00 {hour < 12 ? "AM" : "PM"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Vehicle Registration</Label>
        <Input 
          placeholder="e.g. ABC123" 
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Total Price</Label>
        <div className="text-xl font-semibold">${calculatePrice().toFixed(2)}</div>
      </div>
      
      <Button type="submit" className="w-full" disabled={!selectedSlotId || isLoading}>
        {isLoading ? "Processing..." : "Confirm Booking"}
      </Button>
    </form>
  );
};
