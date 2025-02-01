// import React from "react";

const ArrivalReport = () => {
  // Mock data for arrivals
  const arrivals = [
    {
      id: 1,
      guestName: "Michael Brown",
      roomNumber: "104",
      arrivalDate: "2023-10-15",
    },
    {
      id: 2,
      guestName: "Sarah Davis",
      roomNumber: "208",
      arrivalDate: "2023-10-16",
    },
    {
      id: 3,
      guestName: "Chris Wilson",
      roomNumber: "303",
      arrivalDate: "2023-10-17",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arrival Report</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Guest Name</th>
              <th className="px-4 py-2 border-b">Room Number</th>
              <th className="px-4 py-2 border-b">Arrival Date</th>
            </tr>
          </thead>
          <tbody>
            {arrivals.map((arrival) => (
              <tr key={arrival.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{arrival.guestName}</td>
                <td className="px-4 py-2 border-b">{arrival.roomNumber}</td>
                <td className="px-4 py-2 border-b">{arrival.arrivalDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArrivalReport;
