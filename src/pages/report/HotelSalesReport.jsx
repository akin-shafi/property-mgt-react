// import React from "react";
import { Table } from "antd";

const HotelSalesReport = () => {
  // Data for the report
  const reportData = {
    period: "01 Mar 2024 to 29 Mar 2024",
    roomNightsSold: 410,
    occupancy: "50%",
    arr: "1,607",
    totalRevenues: "663,924",
    revenuesBreakdown: {
      rooms: "663,924",
      extraCharges: "4,543",
      roomService: "400",
    },
    sourceOfBusiness: [
      {
        source: "Meal Plans",
        revenue: "629,849",
        rns: 390,
        arr: "1,614",
      },
      {
        source: "EP",
        revenue: "629,849",
        rns: 390,
        arr: "1,614",
      },
      {
        source: "OTA",
        revenue: "387,723",
        rns: 230,
        arr: "1,685",
      },
      {
        source: "Goibibo",
        revenue: "64,705",
        rns: 41,
        arr: "1,578",
      },
      {
        source: "MakeMyTrip",
        revenue: "219,622",
        rns: 130,
        arr: "1,689",
      },
      {
        source: "Booking.com",
        revenue: "103,395",
        rns: 59,
        arr: "1,752",
      },
      {
        source: "Absell BE",
        revenue: "211,291",
        rns: 145,
        arr: "1,457",
      },
      {
        source: "Walk-in",
        revenue: "59,966",
        rns: 35,
        arr: "1,713",
      },
      {
        source: "PMS",
        revenue: "59,966",
        rns: 35,
        arr: "1,713",
      },
    ],
  };

  // Columns for the source of business table
  const sourceColumns = [
    {
      title: "Source of Business",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Revenue (INR)",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "RNs",
      dataIndex: "rns",
      key: "rns",
    },
    {
      title: "ARR",
      dataIndex: "arr",
      key: "arr",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hotel Sales Report</h1>
      <p className="mb-4">{reportData.period}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Room Nights Sold</p>
          <p className="text-2xl">{reportData.roomNightsSold}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Occupancy</p>
          <p className="text-2xl">{reportData.occupancy}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">ARR (INR)</p>
          <p className="text-2xl">{reportData.arr}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <p className="font-semibold">Total Revenues (INR)</p>
          <p className="text-2xl">{reportData.totalRevenues}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Revenues Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Rooms</p>
            <p className="text-xl">{reportData.revenuesBreakdown.rooms}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Extra Charges</p>
            <p className="text-xl">
              {reportData.revenuesBreakdown.extraCharges}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Room Service</p>
            <p className="text-xl">
              {reportData.revenuesBreakdown.roomService}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Source of Business</h2>
        <Table
          columns={sourceColumns}
          dataSource={reportData.sourceOfBusiness}
          pagination={false}
          rowKey="source"
        />
      </div>
    </div>
  );
};

export default HotelSalesReport;
