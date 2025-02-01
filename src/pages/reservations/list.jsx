"use client";

import { useState, useEffect } from "react";
import { DatePicker, Table, Button, Input, Select, Checkbox } from "antd";
import {
  EditOutlined,
  FileTextOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Layout from "../../components/utils/Layout";
import { useSession } from "@/hooks/useSession";
import { fetchReservationByHotelId } from "@/hooks/useReservation";
import ReceiptModal from "@/components/modals/ReceiptModal";

const { Option } = Select;

const ReservationTable = () => {
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;
  const [startDate, setStartDate] = useState(new Date("2024-03-23"));
  const [endDate, setEndDate] = useState(new Date("2024-03-29"));
  const [showCancelled, setShowCancelled] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (token && hotelId) {
        const data = await fetchReservationByHotelId(hotelId, token);
        setReservations(data);
      }
    }
    fetchData();
  }, [token, hotelId]);

  const handleViewReceipt = (reservationId) => {
    setSelectedReservationId(reservationId);
    setIsReceiptVisible(true);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Dates",
      dataIndex: "dates",
      key: "dates",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Rooms",
      dataIndex: "rooms",
      key: "rooms",
      render: (rooms) => (
        <ul>
          {rooms.map((room, index) => (
            <li
              key={index}
            >{`Room: ${room.roomName}, Adults: ${room.numberOfAdults}, Children: ${room.numberOfChildren}, Price: ₹${room.roomPrice}`}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Special Requests",
      dataIndex: "specialRequests",
      key: "specialRequests",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" icon={<EditOutlined />} />
          <Button
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => handleViewReceipt(record.id)}
          />
          <Button size="small" icon={<DeleteOutlined />} />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow text-xs">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-semibold">Reservation Data</h1>
              <div className="flex gap-2">
                <Button type="primary" size="small">
                  Create Reservation
                </Button>
                <Button type="primary" size="small">
                  Complimentary
                </Button>
                <Button type="primary" size="small">
                  Out Of Order
                </Button>
                <Button type="primary" size="small">
                  Groups
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs mb-1">From Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className="w-full p-1 border rounded text-xs"
                  format="DD-MM-YYYY"
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">To Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  className="w-full p-1 border rounded text-xs"
                  format="DD-MM-YYYY"
                  size="small"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Filter Options:</label>
                <Select
                  className="w-full p-1 border rounded text-xs"
                  size="small"
                >
                  <Option value="bookingDate">Booking Date</Option>
                  <Option value="checkInDate">Check-in Date</Option>
                  <Option value="checkOutDate">Check-out Date</Option>
                </Select>
              </div>
              <div className="flex items-end gap-4">
                <Button type="primary" size="small">
                  Submit
                </Button>
                <div className="flex items-center">
                  <Checkbox
                    id="cancelled"
                    checked={showCancelled}
                    onChange={(e) => setShowCancelled(e.target.checked)}
                    size="small"
                  >
                    Cancelled bookings
                  </Checkbox>
                </div>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex justify-between items-center">
              <Input
                placeholder="Search..."
                className="p-1 border rounded w-64 text-xs"
                size="small"
              />
              <div className="flex gap-2">
                <Button type="primary" size="small">
                  Download
                </Button>
                <Button type="primary" size="small">
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table dataSource={reservations} columns={columns} size="small" />
          </div>
        </div>
      </div>
      <ReceiptModal
        visible={isReceiptVisible}
        onClose={() => setIsReceiptVisible(false)}
        reservationId={selectedReservationId}
      />
    </Layout>
  );
};

export default ReservationTable;
