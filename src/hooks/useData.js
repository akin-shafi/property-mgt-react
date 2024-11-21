// data.js
export const resources = [
  //   {
  //     id: "business-suite",
  //     name: "Business Suite",
  //     expanded: true,
  //     children: [
  //       { id: "BS-101", name: "BS - 101" },
  //       { id: "BS-102", name: "BS - 102" },
  //       { id: "BS-103", name: "BS - 103" },
  //     ],
  //   },
  //   {
  //     id: "deluxe",
  //     name: "Deluxe",
  //     expanded: true,
  //     children: [
  //       { id: "DLX-201", name: "DLX - 201" },
  //       { id: "DLX-202", name: "DLX - 202" },
  //       { id: "DLX-203", name: "DLX - 203" },
  //     ],
  //   },
  {
    id: "standard",
    name: "Standard Rooms",
    expanded: true,
    children: [
      { id: "room101", name: "Room 101 - Standard" },
      { id: "room102", name: "Room 102 - Standard" },
    ],
  },
  {
    id: "business",
    name: "Business Suites",
    expanded: true,
    children: [
      { id: "room201", name: "Room 201 - Business" },
      { id: "room202", name: "Room 202 - Business" },
    ],
  },
];

export const events = [
  {
    id: 1,
    text: "Mr. Mike James",
    start: "2024-11-25T14:00:00",
    end: "2024-11-27T11:00:00",
    resource: "room101",
    status: "Arrived",
    barColor: "#4caf50", // Green for "Arrived"
  },
  {
    id: 2,
    text: "Ms. Alysha Liu",
    start: "2024-11-26T12:00:00",
    end: "2024-11-28T11:00:00",
    resource: "room102",
    status: "Confirmed Reservation",
    barColor: "#2196f3", // Blue for "Confirmed"
  },
  {
    id: 3,
    text: "Mr. Brooke M. Kennedy",
    start: "2024-11-27T15:00:00",
    end: "2024-11-30T10:00:00",
    resource: "room201",
    status: "Checked Out",
    barColor: "#ff9800", // Orange for "Checked Out"
  },
];
