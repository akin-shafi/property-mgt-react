/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { DatePicker, Select, Spin } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import dayjs from "dayjs"; // Import dayjs for date manipulation
import { fetchHotelRoomsWithPrice } from "@/hooks/useAction";

const { Option } = Select;

const StayInformation = ({ data, onChange }) => {
  const roomNameFromUrl = data.rooms[0]?.roomName;

  const initialRoom = {
    roomName: "",
    numberOfAdults: 1,
    numberOfChildren: 0,
    roomPrice: 0,
    roomId: "",
  };

  const [numberOfNights, setNumberOfNights] = useState(0);
  const [roomOptions, setRoomOptions] = useState([]);
  const [rooms, setRooms] = useState([initialRoom]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");

  useEffect(() => {
    if (data.checkInDate && data.checkOutDate) {
      const start = new Date(data.checkInDate);
      const end = new Date(data.checkOutDate);
      setNumberOfNights((end - start) / (1000 * 60 * 60 * 24) || 0);
    }
  }, [data.checkInDate, data.checkOutDate]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomData = await fetchHotelRoomsWithPrice(
          data.hotelId,
          data.token
        );
        const formattedOptions = roomData.map((room) => ({
          value: room.id,
          label: `${room.roomName} - ${room.price}`,
          price: room.price,
          roomName: room.roomName,
        }));
        setRoomOptions(formattedOptions);

        if (roomNameFromUrl) {
          const matchingRoom = formattedOptions.find(
            (option) => option.roomName === roomNameFromUrl
          );
          if (matchingRoom) {
            const initialRoomData = {
              roomName: matchingRoom.roomName,
              roomId: matchingRoom.value,
              numberOfAdults: 1,
              numberOfChildren: 0,
              roomPrice: matchingRoom.price,
            };
            setRooms([initialRoomData]);
            onChange("rooms", [initialRoomData]);
          } else {
            setRooms([initialRoom]);
            // onChange("rooms", [initialRoom]);
          }
        } else {
          setRooms([initialRoom]);
          // onChange("rooms", [initialRoom]);
        }
      } catch (err) {
        setError("Failed to fetch room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [data.hotelId, data.token, roomNameFromUrl]);

  useEffect(() => {
    const totalPrice = calculateTotalPrice(rooms, numberOfNights);
    onChange("reservationData", { numberOfNights, totalPrice });
  }, [rooms, numberOfNights]);

  const calculateTotalPrice = (rooms, nights) =>
    rooms.reduce((total, room) => total + room.roomPrice * nights, 0);

  const handleChange = (index, field, value) => {
    const updatedRooms = rooms.map((room, i) =>
      i === index ? { ...room, [field]: value } : room
    );

    setRooms(updatedRooms);
    onChange("rooms", updatedRooms);
  };

  const handleRoomChange = (index, value, option) => {
    const updatedRooms = rooms.map((room, i) => {
      if (i === index) {
        return {
          ...room,
          roomId: value,
          roomName: option.roomName,
          roomPrice: option.price,
        };
      }
      return room;
    });

    setRooms(updatedRooms);
    onChange("rooms", updatedRooms);
  };

  const handleDateChange = (field, date) => {
    const updatedData = {
      ...data,
      [field]: date ? date.toISOString() : null,
    };
    onChange("reservationDetails", updatedData);

    const startDate = field === "checkInDate" ? date : dayjs(data.checkInDate);
    const endDate = field === "checkOutDate" ? date : dayjs(data.checkOutDate);
    if (startDate && endDate) {
      const nights = endDate.diff(startDate, "day");
      setNumberOfNights(nights > 0 ? nights : 0);
    }
  };

  const handleReservationType = (value) => {
    onChange("reservationDetails", { ...data, reservationType: value });
  };

  const handleReservationStatusChange = (value) => {
    setReservationStatus(value);
    onChange("reservationDetails", { ...data, reservationStatus: value });
  };

  const addRoom = () => {
    setRooms([...rooms, { ...initialRoom }]);
  };

  const removeRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
    onChange("rooms", updatedRooms);
  };

  return (
    <div>
      <div className="p-6 bg-gray-100 rounded-md w-full mb-4">
        <h2 className="text-xl font-semibold">Stay Information</h2>

        {/* Additional input fields */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-1/4">
            <label className="block text-sm font-medium">Check-In</label>
            <DatePicker
              required
              className="w-full"
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select Date & Time"
              value={data.checkInDate ? dayjs(data.checkInDate) : null}
              onChange={(date) => handleDateChange("checkInDate", date)}
              disabledDate={(currentDate) => {
                const oneWeekAgo = dayjs().subtract(7, "day").endOf("day");
                return currentDate && currentDate.isBefore(oneWeekAgo);
              }}
            />
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium">Check-Out</label>
            <DatePicker
              required
              className="w-full"
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Select Date & Time"
              value={data.checkOutDate ? dayjs(data.checkOutDate) : null}
              onChange={(date) => handleDateChange("checkOutDate", date)}
              disabledDate={(currentDate) => {
                return (
                  currentDate && currentDate.isBefore(dayjs(data.checkInDate))
                );
              }}
            />
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium">
              Reservation Type
            </label>
            <Select
              className="w-full"
              placeholder="Select Type"
              value={data.reservationType}
              onChange={handleReservationType}
            >
              <Option value="walk_in">Walk In</Option>
              <Option value="online_reservation">Online reservation</Option>
            </Select>
          </div>
          <div className="w-1/4">
            <label className="block text-sm font-medium">
              Reservation Status
            </label>
            <Select
              className="w-full"
              placeholder="Select Status"
              value={reservationStatus}
              onChange={handleReservationStatusChange}
            >
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
            </Select>
          </div>
        </div>

        {rooms.map((room, index) => (
          <div
            className="flex items-center space-x-4 mb-4 bg-white p-4 rounded-md shadow-sm"
            key={index}
          >
            <div className="w-1/3">
              <label className="block text-sm font-medium">Room Name</label>
              {loading ? (
                <Spin size="large" />
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <Select
                  className="w-full"
                  placeholder="Select a room"
                  options={roomOptions}
                  onChange={(value, option) =>
                    handleRoomChange(index, value, option)
                  }
                  value={room.roomId || undefined} // Ensuring the value is not null
                />
              )}
            </div>
            <div className="w-1/4">
              <label className="block text-sm font-medium">
                Number of Adults
              </label>
              <input
                type="number"
                value={room.numberOfAdults}
                onChange={(e) =>
                  handleChange(index, "numberOfAdults", e.target.value)
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-1/4">
              <label className="block text-sm font-medium">
                Number of Children
              </label>
              <input
                type="number"
                value={room.numberOfChildren}
                onChange={(e) =>
                  handleChange(index, "numberOfChildren", e.target.value)
                }
                className="w-full p-2 border rounded"
              />

              <input
                type="hidden"
                value={room.roomPrice}
                onChange={(e) =>
                  handleChange(index, "roomPrice", room.roomPrice)
                }
                className="w-full p-2 border rounded"
              />
            </div>
            {rooms.length > 1 && (
              <div className="flex justify-end items-center">
                <div
                  className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => removeRoom(index)}
                >
                  <RiDeleteBin5Line title="Remove" className="mr-2 text-lg" />
                  <span className="text-sm font-medium">Remove</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="w-full flex items-center justify-end gap-2 text-appOrange text-[14px]">
          <FaPlusCircle />
          <span
            className="cursor-pointer hover:underline hover:text-black"
            onClick={addRoom}
          >
            Add Room
          </span>
        </div>
      </div>
    </div>
  );
};

export default StayInformation;
