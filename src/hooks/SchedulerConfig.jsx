/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const firstDayOfWeek = new Date();
  const dayOfWeek = firstDayOfWeek.getDay(); // Get the current day of the week (0 for Sunday, 6 for Saturday)
  const diff = firstDayOfWeek.getDate() - dayOfWeek; // Calculate the difference to the first day of the week
  firstDayOfWeek.setDate(diff);

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

  const handleDivClick = (resourceId) => {
    setLoading(true); // Show processing indicator
    setSelectedResourceId(resourceId); // Pass resourceId to the modal
    setViewPaymentModalVisible(true); // Open the View Payment Modal
    setTimeout(() => {
      setLoading(false); // Hide processing indicator after 2 seconds
    }, 1000);
  };

  return {
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "ddd" }, // Adding day of the week
      { groupBy: "Day", format: "d" },
    ],
    eventHeight: 30,
    bubble: new DayPilot.Bubble({}),
    scale: "Day",
    treeEnabled: true,
    days: 31, // Adjusted for a 30-day view
    eventBorderRadius: "5px 10px",
    startDate: firstDayOfWeek.toISOString().split("T")[0],

    onTimeRangeSelected: async (args) => {
      if (args.resource !== args.resourceRoot) {
        handleCreateNew(args);
      }
    },

    onBeforeEventDomAdd: (args) => {
      const resourceId = args.e.data.id; // Assuming event data contains an 'id' field for reservationId

      args.element = (
        <div
          className="flex justify-between w-full items-center hover:text-teal-900"
          onClick={() => handleDivClick(resourceId)}
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <span>{args.e.data.text}</span>
          )}
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
