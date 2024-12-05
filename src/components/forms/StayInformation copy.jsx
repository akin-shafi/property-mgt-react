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
  const [discount, setDiscount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(1000);

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

  // Add a discount
  const applyDiscount = (value) => {
    const discountedPrice = totalPrice - value;
    setDiscount(value);
    setTotalPrice(discountedPrice > 0 ? discountedPrice : 0);
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
            id="check-in"
            className="w-full"
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Select Date & Time"
            onChange={handleCheckInChange}
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
            id="check-out"
            className="w-full"
            showTime
            format="DD/MM/YYYY HH:mm"
            placeholder="Select Date & Time"
            onChange={handleCheckOutChange}
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
        <div key={room.id} className="grid grid-cols-6 gap-4 items-end mb-4">
          <div>
            <label
              htmlFor={`room-type-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Room Type
            </label>
            <Select
              id={`room-type-${room.id}`}
              className="w-full"
              placeholder="Select Room Type"
              options={[
                { value: "standard", label: "Standard" },
                { value: "deluxe", label: "Deluxe" },
                { value: "suite", label: "Suite" },
                { value: "family_room", label: "Family Room" },
                { value: "studio", label: "Studio" },
                { value: "villa", label: "Villa" },
              ]}
            />
          </div>
          <div>
            <label
              htmlFor={`rate-type-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Rate Type
            </label>
            <Select
              id={`rate-type-${room.id}`}
              className="w-full"
              placeholder="Select Rate Type"
              options={[
                {
                  value: "flexible",
                  label: "Flexible",
                  description: "Allows changes or cancellations",
                },
                {
                  value: "non_refundable",
                  label: "Non-Refundable",
                  description: "Lower price but no changes/cancellations",
                },
                {
                  value: "advance_purchase",
                  label: "Advance Purchase",
                  description: "Discount for early booking",
                },
                {
                  value: "pay_at_hotel",
                  label: "Pay at Hotel",
                  description: "Pay upon arrival",
                },
                {
                  value: "corporate",
                  label: "Corporate Rate",
                  description: "Discounted rate for business bookings",
                },
                {
                  value: "promotional",
                  label: "Promotional Rate",
                  description: "Seasonal or special discounts",
                },
              ]}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div className="p-2 text-gray-500 text-sm">
                    {
                      menu?.props?.options?.find(
                        (option) => option.value === menu?.props?.value
                      )?.description
                    }
                  </div>
                </div>
              )}
            />
          </div>
          <div>
            <label
              htmlFor={`room-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <Select
              id={`room-${room.id}`}
              className="w-full"
              placeholder="Select Room"
              options={[
                { value: "room101", label: "Room 101" },
                { value: "room102", label: "Room 102" },
                { value: "room103", label: "Room 103" },
                { value: "room104", label: "Room 104" },
                { value: "room105", label: "Room 105" },
                { value: "room201", label: "Room 201" },
                { value: "room202", label: "Room 202" },
                { value: "room203", label: "Room 203" },
              ]}
            />
          </div>
          <div>
            <label
              htmlFor={`maturity-${room.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              Maturity
            </label>
            <Select
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
          <div>
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

          {/* <div className="flex items-center">
            <Button
              type="danger"
              onClick={() => removeRoom(room.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Room
            </Button>
          </div> */}
          {rooms.length > 1 && (
            <div className="flex items-center">
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
      {/* <Button type="primary" onClick={addRoom}>
        Add Room
      </Button> */}

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
      {/* Add Room and Add Discount */}
      <div className="flex space-x-4 mb-4">
        <Input
          type="number"
          placeholder="Enter Discount"
          onChange={(e) => applyDiscount(Number(e.target.value))}
          className="w-1/3"
        />
        <span className="text-gray-700">Discount Applied: ${discount}</span>
      </div>

      {/* Total Price */}
      <div>
        <p className="text-lg font-medium">Total Price: ${totalPrice}</p>
      </div>
    </div>
  );
};

export default StayInformation;




