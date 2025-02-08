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
  const [loadingItems, setLoadingItems] = useState({}); // Track loading state for each item

  const firstDayOfWeek = new Date();
  const dayOfWeek = firstDayOfWeek.getDay();
  const diff = firstDayOfWeek.getDate() - dayOfWeek;
  firstDayOfWeek.setDate(diff);

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
    setLoadingItems((prev) => ({ ...prev, [resourceId]: true })); // Set loading for specific item
    setSelectedResourceId(resourceId);
    setViewPaymentModalVisible(true);
    setTimeout(() => {
      setLoadingItems((prev) => ({ ...prev, [resourceId]: false })); // Reset loading after timeout
    }, 1000);
  };

  return {
    timeHeaders: [
      { groupBy: "Month", format: "MMMM yyyy" },
      { groupBy: "Day", format: "ddd" },
      { groupBy: "Day", format: "d" },
    ],
    eventHeight: 30,
    bubble: new DayPilot.Bubble({}),
    scale: "Day",
    treeEnabled: true,
    days: 31,
    eventBorderRadius: "5px 10px",
    startDate: firstDayOfWeek.toISOString().split("T")[0],

    onTimeRangeSelected: async (args) => {
      if (args.resource !== args.resourceRoot) {
        handleCreateNew(args);
      }
    },

    onBeforeEventDomAdd: (args) => {
      const resourceId = args.e.data.id;
      args.element = (
        <div
          className="flex justify-between w-full items-center hover-effect"
          onClick={() => handleDivClick(resourceId)}
        >
          {loadingItems[resourceId] ? (
            <span>Processing...</span>
          ) : (
            <span>{args.e.data.text}</span>
          )}
        </div>
      );
    },

    onAfterRender: () => {
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
      }, 0);
    },
  };
};
