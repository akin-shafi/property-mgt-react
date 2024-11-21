// data.js

// Hotel Booking Events
export const hotelBookings = [
  {
    id: 1,
    text: "John Doe - Deluxe Room",
    start: "2024-11-02T14:00:00",
    end: "2024-11-05T11:00:00",
    resource: "101", // Room number
    barColor: "#4caf50",
    barBackColor: "#a5d6a7",
  },
  {
    id: 2,
    text: "Jane Smith - Standard Room",
    start: "2024-11-06T15:00:00",
    end: "2024-11-10T10:00:00",
    resource: "102",
    barColor: "#2196f3",
    barBackColor: "#90caf9",
  },
  {
    id: 3,
    text: "Alice Johnson - Suite",
    start: "2024-11-07T12:00:00",
    end: "2024-11-15T11:00:00",
    resource: "103",
    barColor: "#ff9800",
    barBackColor: "#ffe0b2",
  },
  {
    id: 4,
    text: "David Brown - Economy Room",
    start: "2024-11-09T13:00:00",
    end: "2024-11-12T11:00:00",
    resource: "104",
    barColor: "#f44336",
    barBackColor: "#ef9a9a",
  },
];

// Hotel Rooms (Resources)
export const hotelRooms = [
  { name: "Room 101 - Deluxe", id: "101" },
  { name: "Room 102 - Standard", id: "102" },
  { name: "Room 103 - Suite", id: "103" },
  { name: "Room 104 - Economy", id: "104" },
  { name: "Room 105 - Penthouse", id: "105" },
];
