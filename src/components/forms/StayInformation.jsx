import { useState } from "react";
import { DatePicker, Select, Input } from "antd";
import dayjs from "dayjs";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const StayInformation = ({ onFormDataChange }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [nights, setNights] = useState(0);
  const [rooms, setRooms] = useState([{ id: 1, maturity: "adult", count: 1 }]);

  // Handle check-in date change
  const handleCheckInChange = (date) => {
    setCheckIn(date);
    calculateNights(date, checkOut);
  };

  // Handle check-out date change
  const handleCheckOutChange = (date) => {
    setCheckOut(date);
    calculateNights(checkIn, date);
  };

  // Calculate number of nights
  const calculateNights = (inDate, outDate) => {
    if (inDate && outDate) {
      const diff = dayjs(outDate).diff(dayjs(inDate), "day");
      setNights(diff > 0 ? diff : 0);
    }
  };

  // Add a new room row
  const addRoom = () => {
    setRooms([...rooms, { id: rooms.length + 1, maturity: "adult", count: 1 }]);
  };

  // Remove a specific room row
  const removeRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  // Update maturity or count for a room
  const handleRoomChange = (id, field, value) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room))
    );
  };

  // Pass form data to parent component when changes occur
  const handleFormChange = () => {
    const formData = {
      checkIn,
      checkOut,
      nights,
      rooms,
    };
    onFormDataChange(formData); // Pass data to parent
  };

  return (
    <div className="p-6 bg-gray-100 rounded-md max-w-4xl mx-auto">
      {/* Check-in and Check-out */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-1/3">
          <label
            htmlFor="check-in"
            className="block text-sm font-medium text-gray-700"
          >
            Check-in
          </label>
          <DatePicker
            required
            id="check-in"
            className="w-full"
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Select Date & Time"
            onChange={(date) => {
              handleCheckInChange(date);
              handleFormChange();
            }}
          />
        </div>
        <div className="w-1/3">
          <label
            htmlFor="check-out"
            className="block text-sm font-medium text-gray-700"
          >
            Check-out
          </label>
          <DatePicker
            required
            id="check-out"
            className="w-full"
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Select Date & Time"
            onChange={(date) => {
              handleCheckOutChange(date);
              handleFormChange();
            }}
          />
        </div>
        <div className="w-1/3">
          <label
            htmlFor="nights"
            className="block text-sm font-medium text-gray-700"
          >
            Nights
          </label>
          <Input
            id="nights"
            value={`${nights} Nights`}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {/* Room Details */}
      {rooms.map((room) => (
        <div
          key={room.id}
          className="grid grid-cols-12 gap-4 items-end mb-4 bg-white p-4 rounded-md shadow-sm"
        >
          {/* Room */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <label
              htmlFor={`room-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <Select
              required
              id={`room-${room.id}`}
              className="w-full"
              placeholder="Select Room"
              options={[
                { value: "room101", label: "Room 101 - Studio" },
                { value: "room102", label: "Room 102 - Standard" },
                { value: "room103", label: "Room 103 - Deluxe" },
                { value: "room104", label: "Room 104 - Suite" },
                { value: "room105", label: "Room 105 - Family room" },
                { value: "room201", label: "Room 201" },
                { value: "room202", label: "Room 202" },
                { value: "room203", label: "Room 203" },
              ]}
            />
          </div>

          {/* Maturity */}
          <div className="col-span-6 md:col-span-4 lg:col-span-3">
            <label
              htmlFor={`maturity-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Maturity
            </label>
            <Select
              required
              id={`maturity-${room.id}`}
              className="w-full"
              placeholder="Select Maturity"
              defaultValue="adult"
              options={[
                { value: "adult", label: "Adult" },
                { value: "child", label: "Child" },
              ]}
              onChange={(value) => handleRoomChange(room.id, "maturity", value)}
            />
          </div>

          {/* Count */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <label
              htmlFor={`count-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Number
            </label>
            <Input
              id={`count-${room.id}`}
              type="number"
              value={room.count}
              onChange={(e) =>
                handleRoomChange(room.id, "count", Number(e.target.value))
              }
              className="w-full"
            />
          </div>

          {/* Remove */}
          {rooms.length > 1 && (
            <div className="col-span-12 md:col-span-4 lg:col-span-2 flex justify-end items-center">
              <div
                className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={() => {
                  removeRoom(room.id);
                  handleFormChange();
                }}
              >
                <RiDeleteBin5Line title="Remove" className="mr-2 text-lg" />
                <span className="text-sm font-medium">Remove</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <div
        className="w-full flex items-center justify-end gap-2 text-appGreen cursor-pointer text-[14px]"
        onClick={() => {
          addRoom();
          handleFormChange();
        }}
      >
        <FaPlusCircle />
        <span className="mt-1">Add Room</span>
      </div>
    </div>
  );
};

export default StayInformation;
