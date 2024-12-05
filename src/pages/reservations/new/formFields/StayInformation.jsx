"use client";
import { useState, useEffect, useCallback } from "react";
import { DatePicker, Select, Input, Spin, message } from "antd";
import dayjs from "dayjs";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchHotelRoomsWithPrice,
  verifyDiscountCode,
} from "../../../../hooks/useAction";
import { useAuth } from "../../../../context/AuthContext"; // Access AuthContext

const StayInformation = ({
  startDate,
  endDate,
  roomName,
  onFormDataChange,
}) => {
  const { state } = useAuth();
  const token = state.token;
  const hotelId = state?.user?.hotelId;

  const [checkIn, setCheckIn] = useState(startDate ? dayjs(startDate) : null);
  const [checkOut, setCheckOut] = useState(endDate ? dayjs(endDate) : null);
  const [nights, setNights] = useState(0);
  const [rooms, setRooms] = useState([
    { id: 1, adultCount: 1, childCount: 0, price: 0 },
  ]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Calculate Nights
  const calculateNights = useCallback((inDate, outDate) => {
    if (inDate && outDate) {
      const diff = dayjs(outDate).diff(dayjs(inDate), "day");
      setNights(diff > 0 ? diff : 0);
    }
  }, []);

  // Calculate Total Price (Including Nights)
  const calculateTotalPrice = useCallback(() => {
    const total = rooms.reduce((sum, room) => sum + room.price * nights, 0);
    setTotalPrice(total - discount);
  }, [rooms, nights, discount]);

  // Fetch Room Options
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchHotelRoomsWithPrice(hotelId, token);
        const formattedOptions = data.map((room) => ({
          value: room.id,
          label: `${room.roomName} - ${room.price} ${room.currency}`,
          price: room.price,
          roomName: room.roomName, // Add roomName for matching
        }));

        setRoomOptions(formattedOptions);
        setError(null);

        // Pre-select room if roomName is provided
        if (roomName) {
          const matchingRoom = formattedOptions.find(
            (option) => option.roomName === roomName
          );

          if (matchingRoom) {
            setRooms((prevRooms) =>
              prevRooms.map((room, index) =>
                index === 0
                  ? {
                      ...room,
                      price: matchingRoom.price,
                      roomId: matchingRoom.value,
                    }
                  : room
              )
            );
          }
        }
      } catch (err) {
        setError(`${err} Failed to fetch room data`);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [hotelId, token, roomName]);

  // Inside the StayInformation component

  useEffect(() => {
    // Automatically select a room matching the roomName (if provided)
    if (roomName && roomOptions.length > 0) {
      const matchingRoom = roomOptions.find((room) =>
        room.label.toLowerCase().includes(roomName.toLowerCase())
      );
      if (matchingRoom) {
        // Set the selected room price and update the rooms state
        setRooms((prevRooms) =>
          prevRooms.map((room, index) =>
            index === 0 ? { ...room, price: matchingRoom.price } : room
          )
        );
      }
    }
  }, [roomName, roomOptions]);

  // Sync Nights Calculation
  useEffect(() => {
    if (startDate && !checkIn) setCheckIn(dayjs(startDate));
    if (endDate && !checkOut) setCheckOut(dayjs(endDate));
    calculateNights(startDate, endDate);
  }, [startDate, endDate, checkIn, checkOut, calculateNights]);

  // Sync Total Price Calculation
  useEffect(() => {
    calculateTotalPrice();
  }, [rooms, discount, calculateTotalPrice]);

  // Handle Check-In Change
  const handleCheckInChange = (date) => {
    setCheckIn(date);
    calculateNights(date, checkOut);
  };

  // Handle Check-Out Change
  const handleCheckOutChange = (date) => {
    setCheckOut(date);
    calculateNights(checkIn, date);
  };

  // Add Room
  const addRoom = () => {
    setRooms((prevRooms) => [
      ...prevRooms,
      { id: prevRooms.length + 1, adultCount: 1, childCount: 0, price: 0 },
    ]);
  };

  // Remove Room
  const removeRoom = (id) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
  };

  // Handle Room Change
  const handleRoomChange = (id, field, value) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  // Handle Room Select
  const handleRoomSelect = (id, value) => {
    const selectedRoom = roomOptions.find((room) => room.value === value);
    if (selectedRoom) {
      handleRoomChange(id, "price", selectedRoom.price);
    }
  };

  // Handle Discount Code Change
  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value;
    setDiscountCode(code);
    if (code.length === 6) {
      try {
        const { type, amount } = await verifyDiscountCode(code, token);
        let discountValue = 0;
        if (type === "percentage") {
          discountValue = (totalPrice * amount) / 100;
        } else if (type === "value") {
          discountValue = amount;
        }
        setDiscount(discountValue);
      } catch (err) {
        message.error(`${err}: Invalid discount code`);

        setDiscount(0);
      }
    }
  };

  const handleFormChange = () => {
    const formData = {
      checkIn,
      checkOut,
      nights,
      rooms,
      totalPrice,
      discountCode,
      discount,
    };
    onFormDataChange(formData);
  };

  // Update Form Data
  useEffect(() => {
    const formData = {
      checkIn,
      checkOut,
      nights,
      rooms,
      totalPrice,
      discountCode,
      discount,
    };
    onFormDataChange(formData);
  }, [
    checkIn,
    checkOut,
    nights,
    rooms,
    totalPrice,
    discountCode,
    discount,
    onFormDataChange,
  ]);

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
            value={checkIn}
            onChange={(date) => {
              handleCheckInChange(date);
              handleFormChange();
            }}
            disabledDate={(currentDate) => {
              const oneWeekAgo = dayjs().subtract(7, "day").endOf("day");
              return currentDate && currentDate.isBefore(oneWeekAgo);
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
            value={checkOut}
            onChange={(date) => {
              handleCheckOutChange(date);
              handleFormChange();
            }}
            disabledDate={(currentDate) => {
              const oneWeekAgo = dayjs().subtract(7, "day").endOf("day");
              return currentDate && currentDate.isBefore(oneWeekAgo);
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
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room.id}
            className="grid grid-cols-12 gap-4 items-end mb-4 bg-white p-4 rounded-md shadow-sm"
          >
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
                options={roomOptions}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                value={
                  roomOptions.find((option) => option.price === room.price)
                    ?.value || null
                } // Match the selected room's price or set null if not found
                onChange={(value) => {
                  handleRoomSelect(room.id, value);
                  handleFormChange();
                }}
              />
            </div>
            {/* Maturity */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <label
                htmlFor={`adult-count-${room.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Adults
              </label>
              <Input
                id={`adult-count-${room.id}`}
                type="number"
                value={room.adultCount}
                onChange={(e) =>
                  handleRoomChange(
                    room.id,
                    "adultCount",
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            {/* Child Count */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2">
              <label
                htmlFor={`child-count-${room.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Children
              </label>
              <Input
                id={`child-count-${room.id}`}
                type="number"
                value={room.childCount}
                onChange={(e) =>
                  handleRoomChange(
                    room.id,
                    "childCount",
                    Number(e.target.value)
                  )
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
        ))
      )}
      <div className="w-full flex items-center justify-end gap-2 text-appOrange text-[14px]">
        <FaPlusCircle />
        <span
          className="cursor-pointer hover:underline hover:text-black"
          onClick={() => {
            addRoom();
            handleFormChange();
          }}
        >
          Add Room
        </span>
      </div>

      {/* Total Price */}
      <div className="flex items-center justify-between mt-6">
        <div className="w-1/2 mr-4">
          <label
            htmlFor="discountCode"
            className="block text-sm font-medium text-gray-700"
          >
            Discount Code
          </label>
          <Input
            id="discountCode"
            value={discountCode}
            onChange={handleDiscountCodeChange}
            maxLength={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="w-1/2 text-right">
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Total Room Price/Night: ({totalPrice.toFixed(2)})
          </label>
          <Input
            id="totalPrice"
            value={`${totalPrice.toFixed(2)}`}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default StayInformation;
