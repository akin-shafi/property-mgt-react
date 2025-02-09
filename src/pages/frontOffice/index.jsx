import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

import Layout from "@/components/utils/Layout";
import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler
import { getSchedulerConfig } from "@/hooks/SchedulerConfig";
import { hotelBookings, updateReservationStatus } from "@/hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "@/hooks/useAction";
import { Spin, message } from "antd";
import AddPaymentModal from "@/components/modals/AddPaymentModal";
import ModalDrawer from "@/components/modals/ModalDrawer";

import ViewDetailsModal from "@/components/modals/ViewDetailsModal";
import EditReservationModal from "@/components/modals/EditReservationModal";
import InvoiceModal from "@/components/modals/InvoiceModal";
import ExchangeRoomModal from "@/components/modals/ExchangeRoomModal";
import ExtendStayModalVisible from "@/components/modals/ExtendStayModalVisible";

const Scheduler = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const token = session?.token;

  const hotelId = session?.user?.hotelId;
  const hotelName = session?.user?.hotelName;
  const [hotelRooms, setHotelRooms] = useState([]);
  const [hotelReservations, setHotelReservations] = useState([]);
  const [scheduler, setScheduler] = useState(null);
  const [events, setEvents] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddPaymentModalVisible, setAddPaymentModalVisible] = useState(false); // Modal state
  const [isEditReservationVisible, setEditReservationVisible] = useState(false); // Modal state
  const [isInvoiceModalVisible, setInvoiceModalVisible] = useState(false); // Modal state
  const [isExchangeRoomVisible, setExchangeRoomVisible] = useState(false); // Modal state
  const [extendStayModalVisible, setExtendStayModalVisible] = useState(false); // Modal state
  const [newEndDate, setNewEndDate] = useState(null); // State to hold new end date
  const [isViewDetailsModalVisible, setViewDetailsModalVisible] =
    useState(false); // Example modal state
  const [selectedResourceId, setSelectedResourceId] = useState(null); // Store resourceId
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        // console.log("reservationData today", reservationData);
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
      // console.log("hotelReservations", hotelReservations);
      setEvents(hotelReservations);
      setResources(hotelRooms);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      scheduler.scrollTo(sevenDaysAgo.toISOString().split("T")[0]);
    }
  }, [scheduler, hotelReservations, hotelRooms]);

  const handleNewEndDate = (resourceId, newEnd) => {
    setSelectedResourceId(resourceId);
    setNewEndDate(newEnd); // Update new end date
    setExtendStayModalVisible(true);
  };

  const config = getSchedulerConfig(
    scheduler,
    setScheduler,
    events,
    resources,
    navigate,
    setExtendStayModalVisible,
    setViewDetailsModalVisible,
    setSelectedResourceId, // Pass the setSelectedResourceId function to update the resourceId
    handleNewEndDate // Pass the function here
  );

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleOpenEditReservationModal = async (obj) => {
    console.log("object", obj);
    setDataSet(obj);
    setViewDetailsModalVisible(false);

    const updateStatus = async (data) => {
      try {
        await updateReservationStatus(data, selectedResourceId, token);
        message.success("Status updated successfully!", 3);
        const updatedReservations = await hotelBookings(hotelId, token);
        setHotelReservations(updatedReservations);
      } catch {
        message.error("Error updating reservation status.", 3);
      }
    };

    const actions = {
      "Check-In": async () =>
        updateStatus({
          activity: "check_in",
          reservationStatus: "confirmed",
        }),
      "Undo Check in": async () =>
        updateStatus({
          activity: "pending_arrival",
          reservationStatus: "pending",
        }),
      Edit: () => setEditReservationVisible(true),
      Invoice: () => setInvoiceModalVisible(true),
      "Check-Out": () => toggleDrawer(),
      "Add Payment": () => setAddPaymentModalVisible(true),
      "Exchange Room": () => setExchangeRoomVisible(true),
    };

    if (actions[obj.buttonName]) {
      await actions[obj.buttonName]();
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

      <ViewDetailsModal
        visible={isViewDetailsModalVisible}
        onCancel={() => setViewDetailsModalVisible(false)}
        onOtherModal={(buttonName) =>
          handleOpenEditReservationModal(buttonName)
        }
        resourceId={selectedResourceId}
        token={token}
      />

      <ExtendStayModalVisible
        visible={extendStayModalVisible}
        onCancel={() => setExtendStayModalVisible(false)}
        newEndDate={newEndDate}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
        token={token}
      />

      <AddPaymentModal
        visible={isAddPaymentModalVisible}
        onCancel={() => setAddPaymentModalVisible(false)}
        resourceId={selectedResourceId}
        data={dataSet}
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
      <ExchangeRoomModal
        visible={isExchangeRoomVisible}
        onCancel={() => setExchangeRoomVisible(false)}
        resourceId={selectedResourceId} // Pass the selected resourceId to modal
        token={token}
      />

      <ModalDrawer
        open={drawerOpen}
        onClose={toggleDrawer}
        resourceId={selectedResourceId}
        dataSet={dataSet}
        token={token}
      />
    </Layout>
  );
};

export default Scheduler;
