// import React from "react";
import { Table } from "antd";

const DailyForecastReport = () => {
  // Data for the daily forecast report
  const reportData = [
    {
      key: "1",
      date: "Fri 29-03-2024",
      occupancy: "92%",
      occupied: 26,
      available: -1,
      complementary: 0,
      maintenance: 0,
      revenue: "42,977",
      ahr: "1,652",
      pms: 3,
      alcoatlBE: 10,
      bookingCom: 2,
      robbio: 4,
      makeVWTP: 7,
    },
    {
      key: "2",
      date: "Sat 30-03-2024",
      occupancy: "46%",
      occupied: 13,
      available: 12,
      complementary: 0,
      maintenance: 0,
      revenue: "22,311",
      ahr: "1,716",
      pms: 0,
      alcoatlBE: 3,
      bookingCom: 2,
      robbio: 4,
      makeVWTP: 4,
    },
    // Add more rows as needed
  ];

  // Columns for the table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Occupancy",
      dataIndex: "occupancy",
      key: "occupancy",
    },
    {
      title: "Occupied",
      dataIndex: "occupied",
      key: "occupied",
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
    },
    {
      title: "Complementary",
      dataIndex: "complementary",
      key: "complementary",
    },
    {
      title: "Maintenance",
      dataIndex: "maintenance",
      key: "maintenance",
    },
    {
      title: "Revenue (N/R)",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "AHR (N/R)",
      dataIndex: "ahr",
      key: "ahr",
    },
    {
      title: "PMS",
      dataIndex: "pms",
      key: "pms",
    },
    // {
    //   title: "Alcoatl BE",
    //   dataIndex: "alcoatlBE",
    //   key: "alcoatlBE",
    // },
    {
      title: "Booking.com",
      dataIndex: "bookingCom",
      key: "bookingCom",
    },
    // {
    //   title: "Robbio",
    //   dataIndex: "robbio",
    //   key: "robbio",
    // },
    // {
    //   title: "MakeVWTP",
    //   dataIndex: "makeVWTP",
    //   key: "makeVWTP",
    // },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Daily Forecast Report</h1>
      <Table
        columns={columns}
        dataSource={reportData}
        pagination={false}
        scroll={{ x: true }}
        className="small-font-table"
      />
    </div>
  );
};

export default DailyForecastReport;
