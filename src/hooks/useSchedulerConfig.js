export const hotelRooms = [
  { name: "Room 101 - Deluxe", id: "101", type: "Deluxe" },
  { name: "Room 102 - Standard", id: "102", type: "Standard" },
  { name: "Room 103 - Suite", id: "103", type: "Suite" },
  { name: "Room 104 - Economy", id: "104", type: "Economy" },
  { name: "Room 105 - Penthouse", id: "105", type: "Penthouse" },
];

// Group rooms by type
export const groupedHotelRooms = hotelRooms.reduce((acc, room) => {
  const { type } = room;

  if (!acc[type]) {
    acc[type] = [];
  }

  acc[type].push({ name: room.name, id: room.id });

  return acc;
}, {});

// Convert grouped data into the desired structure
export const resources = Object.entries(groupedHotelRooms).map(
  ([roomType, rooms]) => ({
    name: roomType,
    id: roomType,
    expanded: true,
    children: rooms,
  })
);

export const hotelBookings = [
  {
    id: 1,
    text: "John Doe - Deluxe Room",
    start: "2024-11-01T14:00:00",
    end: "2024-11-03T11:00:00",
    resource: "101",
    barColor: "#4caf50",
    barBackColor: "#a5d6a7",
  },
  {
    id: 2,
    text: "Jane Smith - Standard Room",
    start: "2024-11-04T15:00:00",
    end: "2024-11-06T10:00:00",
    resource: "102",
    barColor: "#2196f3",
    barBackColor: "#90caf9",
  },
  {
    id: 3,
    text: "Alice Johnson - Suite",
    start: "2024-11-07T12:00:00",
    end: "2024-11-10T11:00:00",
    resource: "103",
    barColor: "#ff9800",
    barBackColor: "#ffe0b2",
  },
  {
    id: "4",
    text: "John Doe - 101 Room",
    start: "2024-11-10T12:00:00",
    end: "2024-11-17T11:00:00",
    resource: "201",
    barColor: "#4caf50",
    barBackColor: "#a5d6a7",
  },
];
