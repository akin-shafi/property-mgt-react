import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

import Layout from "@/components/utils/Layout";
import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler
import { getSchedulerConfig } from "@/hooks/SchedulerConfig";
import { hotelBookings } from "@/hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "@/hooks/useAction";
import { Spin } from "antd";
// import ViewPaymentModal from "@/components/modals/ViewPaymentModal";
import ModalDrawer from "@/components/modals/ModalDrawer";

import ViewDetailsModal from "@/components/modals/ViewDetailsModal";
import EditReservationModal from "@/components/modals/EditReservationModal";
import InvoiceModal from "@/components/modals/InvoiceModal";

const Scheduler = () => {
  const { session } = useSession();
  const token = session.token;
  const hotelId = session?.user?.hotelId;
  const hotelName = session?.user?.hotelName;
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotelReservations, setHotelReservations] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [isViewPaymentModalVisible, setViewPaymentModalVisible] =
  //   useState(false); // Modal state
  const [isEditReservationVisible, setEditReservationVisible] = useState(false); // Modal state
  const [isInvoiceModalVisible, setInvoiceModalVisible] = useState(false); // Modal state

  const [isViewDetailsModalVisible, setViewDetailsModalVisible] =
    useState(false); // Example modal state
  const [selectedResourceId, setSelectedResourceId] = useState(null); // Store resourceId
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch and format room data
  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        const hotelData = await fetchHotelRoomsWithPrice(hotelId, token);
        // console.log("hotelData:--", hotelData);
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
        console.log("reservationData today", reservationData);
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
    // setViewPaymentModalVisible,
    setViewDetailsModalVisible,
    // setEditReservationVisible,
    setSelectedResourceId // Pass the setSelectedResourceId function to update the resourceId
  );

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleOpenEditReservationModal = (buttonName) => {
    // console.log(`Button clicked: ${buttonName}`);
    setViewDetailsModalVisible(false);
    if (buttonName === "Edit") {
      setEditReservationVisible(true);
    } else if (buttonName === "Invoice") {
      setInvoiceModalVisible(true);
    }
  };

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
      {/* Modals */}
      {/* <ViewPaymentModal
        visible={isViewPaymentModalVisible}
        onCancel={() => setViewPaymentModalVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
        token={token}
      /> */}
      <ModalDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        resourceId={selectedResourceId}
      />
      <ViewDetailsModal
        visible={isViewDetailsModalVisible}
        onCancel={() => setViewDetailsModalVisible(false)}
        onOtherModal={(buttonName) =>
          handleOpenEditReservationModal(buttonName)
        }
        resourceId={selectedResourceId}
        token={token}
      />
      <EditReservationModal
        visible={isEditReservationVisible}
        onCancel={() => setEditReservationVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
      />
      <InvoiceModal
        visible={isInvoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
        token={token}
        hotelName={hotelName}
      />
    </Layout>
  );
};

export default Scheduler;
