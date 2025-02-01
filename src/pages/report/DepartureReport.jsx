// import React from "react";

const DepartureReport = () => {
  // Mock data for departures
  const departures = [
    {
      id: 1,
      guestName: "John Doe",
      roomNumber: "101",
      departureDate: "2023-10-15",
    },
    {
      id: 2,
      guestName: "Jane Smith",
      roomNumber: "205",
      departureDate: "2023-10-16",
    },
    {
      id: 3,
      guestName: "Alice Johnson",
      roomNumber: "302",
      departureDate: "2023-10-17",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Departure Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Guest Name</th>
              <th className="px-4 py-2 border-b">Room Number</th>
              <th className="px-4 py-2 border-b">Departure Date</th>
            </tr>
          </thead>
          <tbody>
            {departures.map((departure) => (
              <tr key={departure.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{departure.guestName}</td>
                <td className="px-4 py-2 border-b">{departure.roomNumber}</td>
                <td className="px-4 py-2 border-b">
                  {departure.departureDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartureReport;
