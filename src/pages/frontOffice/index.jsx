// Scheduler.js
// import React from "react";
import { resources, events } from "../../hooks/useData"; // Import the data

import { DayPilotScheduler } from "daypilot-pro-react"; // DayPilot Scheduler

const Scheduler = () => {
  const config = {
    scale: "Day",
    days: 365, // Show a year of bookings
    startDate: "2024-11-21",
    timeHeaders: [
      { groupBy: "Month" },
      { groupBy: "Day", format: "MMM dd" }, // e.g., "Saturday, Nov 25" format: "dddd, MMM d"
    ],
    rowHeaderWidth: 150, // Room info column width
    eventBorderRadius: 5,
    cellWidth: 70,
    footerHeight: 100, // Footer for availability
    resources: resources.flatMap((group) =>
      group.children.map((child) => ({
        id: child.id,
        name: child.name,
      }))
    ),
    events: events.map((event) => ({
      id: event.id,
      text: event.text,
      start: event.start,
      end: event.end,
      resource: event.resource,
      barColor: event.barColor,
    })),
    rowHeaderColumns: [
      { name: "Room", width: 150 },
      // { name: "Room Type", width: 150 },
    ],
    onBeforeEventRender: (args) => {
      if (args.data.status) {
        args.data.cssClass = args.data.status.toLowerCase().replace(" ", "-");
      } else {
        args.data.cssClass = "default"; // Apply a default class if status is undefined
      }
    },
  };

  return (
    <div>
      <DayPilotScheduler {...config} />
      <div className="legend mt-4">
        <span className="mr-1 py-2 px-2" style={{ backgroundColor: "#4caf50" }}>
          Arrived
        </span>
        <span className="mr-1 py-2 px-2" style={{ backgroundColor: "#2196f3" }}>
          Confirmed Reservation
        </span>
        <span className="mr-1 py-2 px-2" style={{ backgroundColor: "#ff9800" }}>
          Checked Out
        </span>
      </div>
    </div>
  );
};

export default Scheduler;
