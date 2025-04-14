
import React from "react";
import { ParkingSlot, ParkingSlotStatus } from "./ParkingSlot";

export interface ParkingSlotData {
  id: string;
  status: ParkingSlotStatus;
  slotId?: string;  // Database ID for the slot
}

interface ParkingMapProps {
  slots: ParkingSlotData[];
  onSlotSelect: (slotId: string) => void;
  selectedSlotId: string | null;
}

export const ParkingMap = ({ slots, onSlotSelect, selectedSlotId }: ParkingMapProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-medium mb-4">Available Parking Slots</h3>
      <div className="grid grid-cols-4 gap-3">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot.id}
            id={slot.id}
            status={selectedSlotId === slot.id ? "selected" : slot.status}
            onClick={() => slot.status !== "booked" && onSlotSelect(slot.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-1"></div>
          <span className="text-xs">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-1"></div>
          <span className="text-xs">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-1"></div>
          <span className="text-xs">Selected</span>
        </div>
      </div>
    </div>
  );
};
