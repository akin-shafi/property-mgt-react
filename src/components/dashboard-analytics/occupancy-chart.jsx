// import React from "react";
import { Bar } from "react-chartjs-2";

export function OccupancyADRChart({ monthlyOccupancy, monthlyADR }) {
  // console.log("monthlyOccupancy", monthlyOccupancy);
  // console.log("monthlyADR", monthlyADR);

  const occupancyADRData = {
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
        type: "bar",
        label: "Occupancy",
        data: monthlyOccupancy,
        backgroundColor: "#f87171",
        yAxisID: "y",
      },
      {
        type: "line",
        label: "ADR",
        data: monthlyADR,
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
