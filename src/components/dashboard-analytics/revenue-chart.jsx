"use client";

import { Bar } from "react-chartjs-2";

export function RevenueChart({ yearlyRevenue }) {
  // console.log("yearlyRevenue", yearlyRevenue);

  const yearlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Revenue",
        data: yearlyRevenue,
        backgroundColor: "#0369a1",
      },
    ],
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm text-gray-600 mb-2">Revenue Yearly</h2>
        <div className="h-52">
          <Bar data={yearlyData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </>
  );
}
