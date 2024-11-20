import { DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import DashboardLayout from "../../components/utils/DashboardLayout";

const RoomScheduler = () => {
  // Room data
  const rooms = [
    { id: "101", name: "Room 101" },
    { id: "102", name: "Room 102" },
    { id: "103", name: "Room 103" },
    { id: "104", name: "Room 104" },
    { id: "105", name: "Room 105" },
  ];

  // Booking data
  const bookings = [
    {
      id: "1",
      resource: "101",
      start: "2024-11-20T12:00:00",
      end: "2024-11-22T11:00:00",
      text: "Occupied - Martyn Barrow",
      status: "Occupied",
    },
    {
      id: "2",
      resource: "102",
      start: "2024-11-21T14:00:00",
      end: "2024-11-24T10:00:00",
      text: "Occupied - Binny Hannaby",
      status: "Occupied",
    },
    {
      id: "3",
      resource: "103",
      start: "2024-11-23T13:00:00",
      end: "2024-11-25T11:00:00",
      text: "Maintenance",
      status: "Maintenance",
    },
    {
      id: "4",
      resource: "104",
      start: "2024-11-20T10:00:00",
      end: "2024-11-22T09:00:00",
      text: "Reserved - Kalindi Lardiner",
      status: "Reserved",
    },
  ];

  // Scheduler configuration
  const schedulerConfig = {
    timeHeaders: [
      { groupBy: "Day", format: "MMM d, yyyy" },
      { groupBy: "Hour" },
    ],
    scale: "Hour",
    startDate: "2024-11-20",
    days: 7,
    resources: rooms.map((room) => ({ id: room.id, name: room.name })),
    events: bookings,
    eventHeight: 30,
    rowHeaderWidth: 120,
    cellWidth: 60,
    onEventClick: (args) => {
      alert(`Booking Details:\n${args.e.data.text}`);
    },
  };

  return (
    <DashboardLayout>
      <div>
        <h1>Room Booking Scheduler</h1>
        <DayPilotScheduler {...schedulerConfig} />
      </div>
    </DashboardLayout>
  );
};

export default RoomScheduler;
