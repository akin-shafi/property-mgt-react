import { Modal, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { DayPilot } from "daypilot-pro-react"; // DayPilot Scheduler

const { confirm } = Modal;

export const getSchedulerConfig = (
  scheduler,
  setScheduler,
  events,
  resources,
  navigate
) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const handleCreateNew = (args) => {
    confirm({
      title: "Create New Reservation",
      content: "Do you want to create a new reservation?",
      onOk() {
        const start = args.start?.toString();
        const end = args.end?.toString();
        const room = args.resource;

        navigate(
          `/reservations/new?startDate=${encodeURIComponent(
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

  const showModal = (modalType, resourceId) => {
    // Display different modals based on the type
    switch (modalType) {
      case "viewPayment":
        // Fetch data based on resourceId for View Payment
        console.log(`Fetching payment details for resource: ${resourceId}`);
        Modal.info({
          title: "View Payment",
          content: <div>Payment details for resource {resourceId}</div>,
        });
        break;
      case "viewReservation":
        // Fetch data based on resourceId for View Reservation
        console.log(`Fetching reservation details for resource: ${resourceId}`);
        Modal.info({
          title: "View Reservation",
          content: <div>Reservation details for resource {resourceId}</div>,
        });
        break;
      case "editReservation":
        // Fetch data based on resourceId for Edit Reservation
        console.log(
          `Fetching reservation edit details for resource: ${resourceId}`
        );
        Modal.info({
          title: "Edit Reservation",
          content: <div>Edit reservation for resource {resourceId}</div>,
        });
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      label: "View Payment",
      key: "viewPayment",
      onClick: (e, resourceId) => showModal("viewPayment", resourceId),
    },
    {
      label: "View Reservation",
      key: "viewReservation",
      onClick: (e, resourceId) => showModal("viewReservation", resourceId),
    },
    {
      label: "Edit Reservation",
      key: "editReservation",
      onClick: (e, resourceId) => showModal("editReservation", resourceId),
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
      const resourceId = args.resource; // Assuming resourceId is available here
      args.element = (
        <div className="flex justify-between w-full items-center">
          <span>{args.e.data.text}</span>
          <Dropdown
            menu={{
              items: menuItems.map((item) => ({
                ...item,
                onClick: (e) => item.onClick(e, resourceId),
              })),
            }}
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} className="hover:bg-gray-200" />
          </Dropdown>
        </div>
      );
    },
  };
};
