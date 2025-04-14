import { Car, CircleParking, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export type ParkingSlotStatus = "available" | "booked" | "selected";

interface ParkingSlotProps {
  id: string;
  status: ParkingSlotStatus;
  onClick?: () => void;
  locationName?: string;
  locationAddress?: string;
}

export const ParkingSlot = ({ 
  id, 
  status, 
  onClick, 
  locationName, 
  locationAddress 
}: ParkingSlotProps) => {
  const baseClasses = "relative h-24 w-24 flex flex-col items-center justify-center rounded-md border transition-all duration-200";
  
  const statusClasses = {
    available: "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer shadow-sm",
    booked: "bg-red-50 border-red-200 cursor-not-allowed opacity-80",
    selected: "bg-blue-50 border-blue-300 ring-2 ring-blue-500 shadow-md"
  };

  const tooltipContent = locationAddress 
    ? `${locationName} - ${locationAddress}`
    : locationName || "Unknown Location";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(baseClasses, statusClasses[status])}
            onClick={status !== "booked" ? onClick : undefined}
            role="button"
            aria-label={`Parking slot ${id} at ${locationName}, status: ${status}`}
          >
            <div className="absolute top-2 left-2">
              <span className="text-xs font-medium px-1.5 py-0.5 bg-white rounded shadow-sm border">
                {id}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              {status === "booked" && (
                <>
                  <Car className="h-5 w-5 text-red-600" />
                  <span className="text-xs text-red-700 font-medium">Booked</span>
                </>
              )}
              
              {status === "selected" && (
                <>
                  <CircleParking className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-blue-700 font-medium">Selected</span>
                </>
              )}
              
              {status === "available" && (
                <>
                  <CircleParking className="h-5 w-5 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Available</span>
                </>
              )}
              
              {locationName && (
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <div className="flex items-center justify-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-0.5 shrink-0" />
                    <span className="truncate text-center">{locationName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
