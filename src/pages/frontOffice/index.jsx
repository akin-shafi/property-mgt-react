import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Access AuthContext
import ReservationLayout from "../../components/utils/ReservationLayout";
import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler
import { getSchedulerConfig } from "../../hooks/SchedulerConfig";
import { hotelBookings } from "../../hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "../../hooks/useAction";
import { Spin } from "antd";
import ViewPaymentModal from "../../components/modals/ViewPaymentModal";
import ViewDetailsModal from "../../components/modals/ViewDetailsModal";
import EditReservationModal from "../../components/modals/EditReservationModal";

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
  const [isViewPaymentModalVisible, setViewPaymentModalVisible] =
    useState(false); // Modal state
  const [isEditReservationVisible, setEditReservationVisible] = useState(false); // Modal state
  const [isViewDetailsModalVisible, setViewDetailsModalVisible] =
    useState(false); // Example modal state
  const [selectedResourceId, setSelectedResourceId] = useState(null); // Store resourceId
  const navigate = useNavigate();

  // Fetch and format room data
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
    navigate,
    setViewPaymentModalVisible, // Pass the modal state handler
    setViewDetailsModalVisible, // Example modal state handler
    setEditReservationVisible,
    setSelectedResourceId // Pass the setSelectedResourceId function to update the resourceId
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

      {/* Modals */}
      <ViewPaymentModal
        visible={isViewPaymentModalVisible}
        onCancel={() => setViewPaymentModalVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
      />
      <ViewDetailsModal
        visible={isViewDetailsModalVisible}
        onCancel={() => setViewDetailsModalVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
      />
      <EditReservationModal
        visible={isEditReservationVisible}
        onCancel={() => setEditReservationVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
      />
    </ReservationLayout>
  );
};

export default Scheduler;
