// import React from "react";
"use client";
import { Table, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const columns = [
  { title: "Room Type", dataIndex: "roomType", key: "roomType" },
  { title: "Room", dataIndex: "room", key: "room" },
  { title: "Rate Type", dataIndex: "rateType", key: "rateType" },
  { title: "Adult/Child", dataIndex: "adultChild", key: "adultChild" },
  { title: "Guest Name", dataIndex: "guestName", key: "guestName" },
  { title: "Identity Type", dataIndex: "identityType", key: "identityType" },
  { title: "Identity No", dataIndex: "identityNumber", key: "identityNumber" },
];

const data = [
  {
    key: "1",
    roomType: "Standard",
    room: "101",
    rateType: "Normal",
    adultChild: "2/0",
    guestName: "John Doe",
    identityType: "Passport",
    identityNumber: "AB123456",
  },
];

const GuestListTable = () => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <h3>Guest List</h3>
      <Button icon={<PlusOutlined />} type="primary">
        Add Guest
      </Button>
    </div>
    <Table columns={columns} dataSource={data} />
  </div>
);

export default GuestListTable;
