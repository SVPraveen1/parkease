
import { Car, CircleParking } from "lucide-react";
import { cn } from "@/lib/utils";

export type ParkingSlotStatus = "available" | "booked" | "selected";

interface ParkingSlotProps {
  id: string;
  status: ParkingSlotStatus;
  onClick?: () => void;
}

export const ParkingSlot = ({ id, status, onClick }: ParkingSlotProps) => {
  const baseClasses = "h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-md border transition-all transform hover:scale-105";
  
  const statusClasses = {
    available: "bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer shadow-sm",
    booked: "bg-red-100 border-red-300 cursor-not-allowed opacity-80",
    selected: "bg-blue-100 border-blue-300 ring-2 ring-blue-500 shadow-md"
  };

  return (
    <div 
      className={cn(baseClasses, statusClasses[status])}
      onClick={status !== "booked" ? onClick : undefined}
      role="button"
      aria-label={`Parking slot ${id}, status: ${status}`}
    >
      <div className="flex flex-col items-center justify-center">
        <span className="text-sm font-medium">{id}</span>
        
        {status === "booked" && (
          <div className="flex flex-col items-center mt-1">
            <Car className="h-4 w-4 text-red-600" />
            <span className="text-xs mt-0.5 text-red-700 font-medium">Booked</span>
          </div>
        )}
        
        {status === "selected" && (
          <div className="flex flex-col items-center mt-1">
            <CircleParking className="h-5 w-5 text-blue-600" />
            <span className="text-xs mt-0.5 text-blue-700 font-medium">Selected</span>
          </div>
        )}
        
        {status === "available" && (
          <div className="flex flex-col items-center mt-1">
            <CircleParking className="h-5 w-5 text-green-600" />
            <span className="text-xs mt-0.5 text-green-700 font-medium">Available</span>
          </div>
        )}
      </div>
    </div>
  );
};
