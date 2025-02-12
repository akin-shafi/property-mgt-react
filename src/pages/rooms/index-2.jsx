"use client";

import { useEffect, useState } from "react";
import { Plus, DollarSign } from "lucide-react";
import { DateNavigation } from "@/components/date-picker";
import { StatusLegend } from "@/components/status-legend";
import { RoomSection } from "@/components/room-section";
import { StatusCounter } from "@/components/status-counter";
import Layout from "@/components/utils/Layout";
import {
  fetchHotelRoomsWithPrice,
  fetchAvailableRoomTypesByHotelId,
} from "@/hooks/useAction";
import { useSession } from "@/hooks/useSession";
import { fetchReservationByHotelId } from "@/hooks/useReservation";

export default function RoomsView() {
  const { session } = useSession();
  const token = session.token;
  const hotelId = session?.user?.hotelId;
  const [hotelRooms, setHotelRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const availableRoomTypes = await fetchAvailableRoomTypesByHotelId(
          hotelId,
          token
        );
        setRoomTypes(availableRoomTypes);

        const hotelData = await fetchHotelRoomsWithPrice(hotelId, token);
        const formattedRooms = hotelData.map((room) => ({
          id: room.id,
          number: room.roomName,
          status: room.isAvailable ? "available" : "occupied", // Default to available or occupied
          guest: room.isAvailable ? null : "Occupied by a guest",
          roomType: room.roomType,
        }));
        setHotelRooms(formattedRooms);

        const reservationData = await fetchReservationByHotelId(hotelId, token);
        setReservations(reservationData);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId && token) {
      fetchData();
    }
  }, [hotelId, token]);

  const getRoomStats = (rooms) => {
    const stats = {
      occupied: 0,
      available: 0,
      complimentary: 0,
      maintenance: 0,
    };

    rooms.forEach((room) => {
      switch (room.status) {
        case "occupied":
          stats.occupied++;
          break;
        case "available":
          stats.available++;
          break;
        case "complimentary":
          stats.complimentary++;
          break;
        case "maintenance":
          stats.maintenance++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const handleToggleClick = (title) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const renderRoomSections = () => {
    return roomTypes.map((roomType) => {
      const rooms = hotelRooms.filter((room) => room.roomType === roomType);
      const roomStats = getRoomStats(rooms);
      const isOpen = expandedSections[roomType] !== false;

      return (
        <RoomSection
          key={roomType}
          title={roomType}
          stats={roomStats}
          rooms={rooms}
          reservations={reservations} // Pass reservations to RoomSection
          toggleClick={handleToggleClick}
          isOpen={isOpen}
        />
      );
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Rooms View</h1>
            <div className="flex gap-4">
              <StatusCounter
                label="Occupied"
                count={getRoomStats(hotelRooms).occupied}
                color="text-green-600"
              />
              <StatusCounter
                label="Available"
                count={getRoomStats(hotelRooms).available}
                color="text-green-600"
              />
              <StatusCounter
                label="Complimentary"
                count={getRoomStats(hotelRooms).complimentary}
                color="text-blue-600"
              />
              <StatusCounter
                label="Maintenance"
                count={getRoomStats(hotelRooms).maintenance}
                color="text-red-600"
              />
            </div>
          </div>

          <StatusLegend />

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                <DollarSign className="w-5 h-5" />
              </button>
            </div>
            <DateNavigation />
          </div>
        </div>

        {renderRoomSections()}
      </div>
    </Layout>
  );
}
