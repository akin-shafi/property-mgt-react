import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

import Layout from "@/components/utils/Layout";
import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler
import { getSchedulerConfig } from "@/hooks/SchedulerConfig";
import { hotelBookings } from "@/hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "@/hooks/useAction";
import { Spin } from "antd";
import ModalDrawer from "@/components/modals/ModalDrawer";

const Scheduler = () => {
  const { session } = useSession();
  const token = session.token;
  const hotelId = session?.user?.hotelId;
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotelReservations, setHotelReservations] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        const hotelData = await fetchHotelRoomsWithPrice(hotelId, token);
        const formattedRooms = hotelData.map((room) => ({
          id: room.roomName,
          name: `Room ${room.roomName}`,
          status: room.maintenanceStatus,
          capacity: room.capacity,
          availability: room.isAvailable,
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
    navigate,
    setDrawerOpen, // Open drawer instead of modal
    setSelectedResourceId
  );

  return (
    <Layout>
      <Spin spinning={loading}>
        <main className="mt-10 px-4">
          {error && <div className="text-red-500">{error}</div>}
          <DayPilotScheduler
            {...config}
            events={events}
            resources={resources}
            controlRef={setScheduler}
          />
        </main>
      </Spin>

      {/* Drawer */}
      <ModalDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pageTitle={`Reservation Details `}
        resourceId={selectedResourceId}
      />
    </Layout>
  );
};

export default Scheduler;
