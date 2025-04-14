import React from "react";
import { ParkingSlot, ParkingSlotStatus } from "./ParkingSlot";

export interface ParkingSlotData {
  id: string;
  status: ParkingSlotStatus;
  slotId?: string;  // Database ID for the slot
  location?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
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
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {slots.map((slot) => (
          <ParkingSlot
            key={slot.slotId}
            id={slot.id}
            status={selectedSlotId === slot.slotId ? "selected" : slot.status}
            onClick={() => slot.status !== "booked" && onSlotSelect(slot.slotId || '')}
            locationName={slot.location?.name}
            locationAddress={slot.location?.address}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
          <span className="text-sm">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
          <span className="text-sm">Selected</span>
        </div>
      </div>
    </div>
  );
};
