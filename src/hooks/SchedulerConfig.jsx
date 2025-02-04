import { Modal } from "antd";
import { DayPilot } from "daypilot-pro-react"; // DayPilot Scheduler

const { confirm } = Modal;

export const getSchedulerConfig = (
  scheduler,
  setScheduler,
  events,
  resources,
  navigate,
  setViewPaymentModalVisible,
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

  return {
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "d" },
    ],
    eventHeight: 30,
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
        <div
          className="flex justify-between w-full items-center"
          onClick={() => {
            setSelectedResourceId(resourceId); // Pass resourceId to the modal
            setViewPaymentModalVisible(true); // Open the View Payment Modal
          }}
        >
          <span>{args.e.data.text}</span>
        </div>
      );
    },

    onAfterRender: () => {
      // Hide the "DEMO" element after rendering
      setTimeout(() => {
        document
          .querySelectorAll(".scheduler_default_corner")
          .forEach((div) => {
            const child = div.children[1];
            if (child && child.textContent === "DEMO") {
              child.style.backgroundColor = "black";
              child.className = "hidden";
              child.id = "demo-label";
            }
          });
      }, 0); // Add a small delay to ensure the DOM is fully rendered
    },
  };
};
