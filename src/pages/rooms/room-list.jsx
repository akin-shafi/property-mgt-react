import { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  fetchCompleteRoomTypeDetailsByHotelId,
  fetchHotelDetailsByTenantId,
  fetchHotelRoomsByHotelId,
} from "../../hooks/useAction";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext
import { RoomModal } from "../../components/front-desk/modals/room-modal";

export function RoomList() {
  const { state } = useAuth(); // Destructure logout function from context
  const token = state.token;
  const tenantId = state?.user?.tenantId;

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("view");
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch hotel data to get the hotelId
        const hotelData = await fetchHotelDetailsByTenantId(tenantId, token);
        const hotelId = hotelData?.id;

        if (hotelId) {
          // Fetch room types and rooms in parallel
          const [roomTypes, roomData] = await Promise.all([
            fetchCompleteRoomTypeDetailsByHotelId(hotelId, token),
            fetchHotelRoomsByHotelId(hotelId, token),
          ]);

          // Map room types to an object for quick lookup
          const roomTypeDetailsMap = roomTypes.reduce((acc, roomType) => {
            acc[roomType.roomType] = {
              price: roomType.pricePerNight,
              currency: roomType.currency,
              capacity: roomType.capacity,
            };
            return acc;
          }, {});

          // Map room data to include prices
          const mappedRooms = roomData.map((room) => {
            const roomTypeDetails = roomTypeDetailsMap[room.roomType];
            return {
              key: room.id,
              number: room.roomName,
              type: room.roomType,
              capacity: roomTypeDetails?.capacity || "N/A",
              price: roomTypeDetails
                ? `${roomTypeDetails.currency} ${roomTypeDetails.price}`
                : "N/A",
              status: room.isAvailable ? "Available" : "Occupied",
              maintenanceStatus: room.maintenanceStatus,
            };
          });

          setRooms(mappedRooms);
          setFilteredRooms(mappedRooms);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch room data.");
      } finally {
        setLoading(false);
      }
    };

    if (tenantId && token) {
      fetchRoomData();
    }
  }, [tenantId, token]);

  const handleSearch = (value) => {
    setSearchValue(value);
    const filteredData = rooms.filter(
      (room) =>
        room.number.toLowerCase().includes(value.toLowerCase()) ||
        room.type.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRooms(filteredData);
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setModalMode("view");
    setModalVisible(true);
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setModalMode("delete");
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedRoom(null);
  };

  const handleModalSave = (updatedRoom) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.key === selectedRoom.key ? { ...room, ...updatedRoom } : room
      )
    );
    handleModalClose();
  };

  const handleModalDelete = () => {
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.key !== selectedRoom.key)
    );
    handleModalClose();
  };

  const columns = [
    {
      title: "Room Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Maintenance Status",
      dataIndex: "maintenanceStatus",
      key: "maintenanceStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, room) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(room)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(room)}
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(room)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by room number or type"
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredRooms}
        loading={loading}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
      <RoomModal
        visible={modalVisible}
        onClose={handleModalClose}
        room={selectedRoom}
        mode={modalMode}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />
    </div>
  );
}
