// import React from "react";
import { Table } from "antd";

const DateWiseRevenueReport = () => {
  // Sample data for the report
  const reportData = [
    {
      key: "1",
      date: "01/09/2024",
      occupancy: "53%",
      totalRevenue: "24,562",
      posRooms: "24,562",
      ota: "15,409",
      accedUE: "9,062",
      waikers: "0",
      total: "2,947",
      cgst6: "1,473",
      sgst6: "1,473",
      cgst9: "0",
      sgst9: "0",
    },
    {
      key: "2",
      date: "02/09/2024",
      occupancy: "82%",
      totalRevenue: "38,106",
      posRooms: "38,106",
      ota: "23,870",
      accedUE: "12,606",
      waikers: "1,630",
      total: "4,574",
      cgst6: "2,284",
      sgst6: "2,284",
      cgst9: "2",
      sgst9: "2",
    },
    // Add more rows as needed
  ];

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
      title: "Total Revenue/(MtN)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
    },
    {
      title: "POS",
      dataIndex: "posRooms",
      key: "posRooms",
    },
    {
      title: "Segment",
      dataIndex: "ota",
      key: "ota",
    },
    {
      title: "Rooms",
      dataIndex: "accedUE",
      key: "accedUE",
    },
    {
      title: "OTA",
      dataIndex: "ota",
      key: "ota",
    },
    {
      title: "Acced UE",
      dataIndex: "accedUE",
      key: "accedUE",
    },
    {
      title: "Waikers",
      dataIndex: "waikers",
      key: "waikers",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "CGST 6",
      dataIndex: "cgst6",
      key: "cgst6",
    },
    {
      title: "SGST 6",
      dataIndex: "sgst6",
      key: "sgst6",
    },
    {
      title: "CGST 9",
      dataIndex: "cgst9",
      key: "cgst9",
    },
    {
      title: "SGST 9",
      dataIndex: "sgst9",
      key: "sgst9",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Date Wise Revenue Report</h1>
      <Table
        columns={columns}
        dataSource={reportData}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default DateWiseRevenueReport;
