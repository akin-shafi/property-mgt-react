"use client";
import { useState, useEffect } from "react";
import { DatePicker, Select, Input, Spin } from "antd";
import dayjs from "dayjs";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  fetchHotelRoomsWithPrice,
  verifyDiscountCode,
} from "@/hooks/useAction";
import { useSession } from "next-auth/react";
import { useSessionContext } from "@/context/SessionContext";

const StayInformation = ({
  startDate,
  endDate,
  roomName,
  onFormDataChange,
}) => {
  const { data: session } = useSession();
  const { token } = useSessionContext();
  const hotelId = session?.user?.hotelId;

  const [checkIn, setCheckIn] = useState(startDate ? dayjs(startDate) : null);
  const [checkOut, setCheckOut] = useState(endDate ? dayjs(endDate) : null);
  const [nights, setNights] = useState(0);
  const [rooms, setRooms] = useState([
    { id: 1, maturity: "adult", count: 1, price: 0 },
  ]);
  const [roomOptions, setRoomOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // Track the total price
  const [discountCode, setDiscountCode] = useState(""); // Track the discount code
  const [discount, setDiscount] = useState(0); // Track the discount amount

  // Fetch room options
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchHotelRoomsWithPrice(hotelId, token);
        const formattedOptions = data.map((room) => ({
          value: room.id,
          label: `${room.roomName} - ${room.price} ${room.currency}`,
          price: room.price,
        }));
        setRoomOptions(formattedOptions);
        setError(null);
      } catch (err) {
        setError("Failed to fetch room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [hotelId, token]);

  useEffect(() => {
    if (startDate && !checkIn) setCheckIn(dayjs(startDate));
    if (endDate && !checkOut) setCheckOut(dayjs(endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    calculateTotalPrice();
  }, [rooms, discount]); // Recalculate the total price when rooms or discount change

  const calculateTotalPrice = () => {
    const totalRoomPrice = rooms.reduce(
      (total, room) => total + room.price * room.count,
      0
    );
    const discountedPrice = totalRoomPrice - discount;
    setTotalPrice(discountedPrice >= 0 ? discountedPrice : 0); // Ensure the total doesn't go negative
  };

  const handleCheckInChange = (date) => {
    setCheckIn(date);
    calculateNights(date, checkOut);
  };

  const handleCheckOutChange = (date) => {
    setCheckOut(date);
    calculateNights(checkIn, date);
  };

  const calculateNights = (inDate, outDate) => {
    if (inDate && outDate) {
      const diff = dayjs(outDate).diff(dayjs(inDate), "day");
      setNights(diff > 0 ? diff : 0);
    }
  };

  const addRoom = () => {
    setRooms([
      ...rooms,
      { id: rooms.length + 1, maturity: "adult", count: 1, price: 0 },
    ]);
  };

  const removeRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const handleRoomChange = (id, field, value) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room))
    );
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value;
    setDiscountCode(code);

    // Trigger the API call to verify the discount code
    if (code.length === 6) {
      try {
        const discountData = await verifyDiscountCode(code, hotelId, token);
        if (discountData) {
          if (discountData.type === "percentage") {
            const discountAmount = (totalPrice * discountData.amount) / 100;
            setDiscount(discountAmount);
          } else if (discountData.type === "value") {
            setDiscount(discountData.amount);
          }
        } else {
          setDiscount(0); // Reset discount if the code is invalid
        }
      } catch (error) {
        setDiscount(0); // Reset discount on API error
        setError("Failed to apply discount code");
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
    };
    onFormDataChange(formData);
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
            value={checkIn}
            onChange={(date) => {
              handleCheckInChange(date);
              handleFormChange();
            }}
            disabledDate={(currentDate) => {
              // Disable dates that are more than 7 days in the past
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
              // Disable dates that are more than 7 days in the past
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
                onChange={(value) => {
                  const selectedRoom = roomOptions.find(
                    (room) => room.value === value
                  );
                  handleRoomChange(room.id, "price", selectedRoom?.price || 0);
                  handleRoomChange(room.id, "maturity", "adult"); // Reset to adult for now
                  handleFormChange();
                }}
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
                options={[
                  { label: "Adult", value: "adult" },
                  { label: "Child", value: "child" },
                ]}
                defaultValue={room.maturity}
                onChange={(value) =>
                  handleRoomChange(room.id, "maturity", value)
                }
              />
            </div>
            {/* Room Count */}
            <div className="col-span-3">
              <label
                htmlFor={`count-${room.id}`}
                className="block text-sm font-medium text-gray-700"
              >
                Room Count
              </label>
              <Input
                required
                type="number"
                min={1}
                id={`count-${room.id}`}
                value={room.count}
                onChange={(e) =>
                  handleRoomChange(room.id, "count", parseInt(e.target.value))
                }
              />
            </div>
            {/* Delete Room */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeRoom(room.id)}
                className="text-red-500 hover:text-red-700"
              >
                <RiDeleteBin5Line size={24} />
              </button>
            </div>
          </div>
        ))
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={addRoom}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <FaPlusCircle />
          <span>Add Room</span>
        </button>
      </div>

      {/* Discount Code */}
      <div className="mt-6">
        <label
          htmlFor="discount-code"
          className="block text-sm font-medium text-gray-700"
        >
          Discount Code
        </label>
        <Input
          id="discount-code"
          value={discountCode}
          onChange={handleDiscountCodeChange}
          placeholder="Enter discount code"
        />
      </div>

      {/* Total Price */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Total Price
        </label>
        <Input
          disabled
          value={`$${totalPrice.toFixed(2)}`}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
    </div>
  );
};

export default StayInformation;
