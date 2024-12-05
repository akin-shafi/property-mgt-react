import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Access AuthContext
import ReservationLayout from "../../components/utils/ReservationLayout";
import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler
import { getSchedulerConfig } from "../../hooks/SchedulerConfig";
import { hotelBookings } from "../../hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "../../hooks/useAction";

import { Spin } from "antd";
const Scheduler = () => {
  const { state } = useAuth();
  const token = state.token;
  const hotelId = state?.user?.hotelId;
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotelReservations, setHotelReservations] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch and format room data
  // useEffect(() => {
  //   const fetchRoomData = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const hotelData = await fetchhotelRooms(hotelId, token);
  //       const groupedRooms = hotelData.reduce((acc, room) => {
  //         const { roomType } = room;
  //         if (!acc[roomType]) {
  //           acc[roomType] = [];
  //         }
  //         acc[roomType].push({
  //           name: `Room ${room.roomName}`,
  //           id: room.roomName,
  //         });
  //         return acc;
  //       }, {});

  //       const formattedRooms = Object.entries(groupedRooms).map(
  //         ([roomType, rooms]) => ({
  //           name: roomType,
  //           id: roomType,
  //           expanded: true,
  //           children: rooms,
  //         })
  //       );

  //       setHotelRooms(formattedRooms);
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch room data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (hotelId && token) {
  //     fetchRoomData();
  //   }
  // }, [hotelId, token]);
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        const hotelData = await fetchHotelRoomsWithPrice(hotelId, token);

        // console.log("Rooms:", hotelData);
        // Format the rooms without grouping by roomType
        const formattedRooms = hotelData.map((room) => ({
          id: room.roomName,
          name: `Room ${room.roomName}`,
          status: room.maintenanceStatus,
          capacity: room.capacity,
          avalability: room.isAvailable,
        }));

        setHotelRooms(formattedRooms);
      } catch (err) {
        setError(err.message || "Failed to fetch room data.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId && token) {
      fetchRoomData();
    }
  }, [hotelId, token]);

  // Fetch and format reservation data
  useEffect(() => {
    const fetchReservationData = async () => {
      setLoading(true);
      setError(null);

      try {
        const reservationData = await hotelBookings(hotelId, token);
        setHotelReservations(reservationData);
      } catch (err) {
        setError(err.message || "Failed to fetch reservation data.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId && token) {
      fetchReservationData();
    }
  }, [hotelId, token]);

  // Initialize scheduler once it's available
  useEffect(() => {
    if (scheduler) {
      setEvents(hotelReservations);
      setResources(hotelRooms);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      scheduler.scrollTo(sevenDaysAgo.toISOString().split("T")[0]);
    }
  }, [scheduler, hotelReservations, hotelRooms]);

  const config = getSchedulerConfig(
    scheduler,
    setScheduler,
    events,
    resources,
    navigate
  );

  return (
    <ReservationLayout>
      <Spin spinning={loading}>
        <main className="mt-10">
          {error && <div className="text-red-500">{error}</div>}
          <DayPilotScheduler
            {...config}
            events={events}
            resources={resources}
            controlRef={setScheduler}
          />
        </main>
      </Spin>
    </ReservationLayout>
  );
};

export default Scheduler;
