import { Modal, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { DayPilot } from "daypilot-pro-react"; // DayPilot Scheduler

const { confirm } = Modal;

export const getSchedulerConfig = (
  scheduler,
  setScheduler,
  events,
  resources,
  navigate,
  setViewPaymentModalVisible,
  setViewDetailsModalVisible,
  setEditReservationVisible,
  setSelectedResourceId // New function to pass the resourceId to modal
) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Function to handle creating a new reservation
  const handleCreateNew = (args) => {
    confirm({
      title: "Create New Reservation",
      content: "Do you want to create a new reservation?",
      onOk() {
        const start = args.start?.toString();
        const end = args.end?.toString();
        const room = args.resource;

        navigate(
          `/reservations/new-test?startDate=${encodeURIComponent(
            start
          )}&endDate=${encodeURIComponent(end)}&roomName=${encodeURIComponent(
            room
          )}`
        );
      },
      onCancel() {
        scheduler.clearSelection();
        console.log("Canceled");
      },
    });
  };

  // Menu items for the dropdown
  const menuItems = (resourceId) => [
    {
      label: "View Payment",
      key: "viewPayment",
      onClick: () => {
        setSelectedResourceId(resourceId); // Pass resourceId to the modal
        setViewPaymentModalVisible(true); // Open the View Payment Modal
      },
    },
    {
      label: "View Reservation",
      key: "viewReservation",
      onClick: () => {
        setSelectedResourceId(resourceId); // Pass resourceId to the modal
        setViewDetailsModalVisible(true); // Open the View Details Modal
      },
    },
    {
      label: "Edit Reservation",
      key: "editReservation",
      onClick: () => {
        setSelectedResourceId(resourceId); // Pass resourceId to the modal
        setEditReservationVisible(true);
      },
    },
  ];

  return {
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "d" },
    ],
    eventHeight: 50,
    bubble: new DayPilot.Bubble({}),
    scale: "Day",
    treeEnabled: true,
    days: 30, // Adjusted for a 30-day view
    eventBorderRadius: "1px",
    startDate: sevenDaysAgo.toISOString().split("T")[0],

    onTimeRangeSelected: async (args) => {
      if (args.resource !== args.resourceRoot) {
        handleCreateNew(args);
      }
    },

    onBeforeEventDomAdd: (args) => {
      const resourceId = args.e.data.id; // Assuming event data contains an 'id' field for reservationId
      args.element = (
        <div className="flex justify-between w-full items-center">
          <span>{args.e.data.text}</span>
          <Dropdown menu={{ items: menuItems(resourceId) }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} className="hover:bg-gray-200" />
          </Dropdown>
        </div>
      );
    },
  };
};
