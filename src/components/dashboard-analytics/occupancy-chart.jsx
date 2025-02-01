// import React from "react";
import { Bar } from "react-chartjs-2";

export function OccupancyADRChart() {
  const occupancyADRData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        type: "bar",
        label: "Occupancy",
        data: [65, 70, 62, 75, 68, 72],
        backgroundColor: "#f87171",
        yAxisID: "y",
      },
      {
        type: "line",
        label: "ADR",
        data: [1200, 1300, 1250, 1400, 1350, 1450],
        borderColor: "#14b8a6",
        yAxisID: "y1",
      },
    ],
  };
  return (
    <>
      <h2 className="text-sm text-gray-600 mb-2">Occupancy & ADR</h2>
      <div className="h-64">
        <Bar
          data={occupancyADRData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                type: "linear",
                position: "left",
              },
              y1: {
                type: "linear",
                position: "right",
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}
