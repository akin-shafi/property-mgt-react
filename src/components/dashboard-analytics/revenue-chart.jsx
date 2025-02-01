"use client";

import { Bar } from "react-chartjs-2";

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
      data: [
        85000, 90000, 82000, 95000, 88000, 92000, 84000, 89000, 91000, 87000,
        93000, 86000,
      ],
      backgroundColor: "#0369a1",
    },
  ],
};

export function RevenueChart() {
  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-sm text-gray-600 mb-2">Revenue Yearly</h2>
        <div className="h-32">
          <Bar data={yearlyData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </>
  );
}
