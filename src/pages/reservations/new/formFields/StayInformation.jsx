import { useState, useEffect, useCallback, useRef } from "react";
import { DatePicker, Select, Input, Spin, Checkbox } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import dayjs from "dayjs";
import {
  fetchHotelRoomsWithPrice,
  verifyDiscountCode,
} from "@/hooks/useAction";
import { useSession } from "@/hooks/useSession";

const StayInformation = ({ data, onChange }) => {
  const roomNameFromUrl = data.roomName;
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;

  const [formState, setFormState] = useState({
    checkIn: data.startDate ? dayjs(data.startDate) : null,
    checkOut: data.endDate ? dayjs(data.endDate) : null,
    nights: 0,
    rooms: [{ id: 1, adultCount: 1, childCount: 0, price: 0 }],
    roomOptions: [],
    loading: false,
    error: null,
    totalPrice: 0,
    originalTotalPrice: 0,
    discountCode: "",
    discountType: "",
    discount: 0,
    isAddTax: false,
    promotionError: "",
    isDiscountLoading: false,
    grandTotal: 0,
  });

  const firstRender = useRef(true);

  const taxRate = 0.075; // 7.5%

  const addTax = () => {
    setFormState((prevState) => {
      const newStatus = !prevState.isAddTax;
      const newTotalPrice = newStatus
        ? prevState.originalTotalPrice * (1 + taxRate)
        : prevState.originalTotalPrice;
      const updatedState = {
        ...prevState,
        isAddTax: newStatus,
        totalPrice: newTotalPrice,
      };
      onChange(updatedState); // Notify parent of state change
      return updatedState;
    });
  };

  const calculateNights = useCallback((inDate, outDate) => {
    if (inDate && outDate) {
      const diff = dayjs(outDate).diff(dayjs(inDate), "day");
      setFormState((prevState) => ({
        ...prevState,
        nights: diff > 0 ? diff : 0,
      }));
    }
  }, []);

  const calculateTotalPrice = useCallback(() => {
    const total = formState.rooms.reduce(
      (sum, room) => sum + room.price * formState.nights,
      0
    );
    const finalPrice = formState.isAddTax ? total * (1 + taxRate) : total;
    setFormState((prevState) => ({
      ...prevState,
      originalTotalPrice: total,
      grandTotal: total,
      totalPrice: finalPrice - prevState.discount,
    }));
  }, [formState.rooms, formState.nights, formState.isAddTax, taxRate]);

  useEffect(() => {
    const fetchRooms = async () => {
      setFormState((prevState) => ({ ...prevState, loading: true }));
      try {
        const data = await fetchHotelRoomsWithPrice(hotelId, token);
        const formattedOptions = data.map((room) => ({
          value: room.id,
          label: `${room.roomName} - ${room.price} `,
          price: room.price,
          roomName: room.roomName,
        }));

        setFormState((prevState) => ({
          ...prevState,
          roomOptions: formattedOptions,
          error: null,
        }));

        if (roomNameFromUrl) {
          const matchingRoom = formattedOptions.find(
            (option) => option.roomName === roomNameFromUrl
          );
          if (matchingRoom) {
            setFormState((prevState) => ({
              ...prevState,
              rooms: prevState.rooms.map((room, index) =>
                index === 0
                  ? {
                      ...room,
                      price: matchingRoom.price,
                      roomId: matchingRoom.value,
                    }
                  : room
              ),
            }));
          }
        }
      } catch (err) {
        setFormState((prevState) => ({
          ...prevState,
          error: `${err} Failed to fetch room data`,
        }));
      } finally {
        setFormState((prevState) => ({ ...prevState, loading: false }));
      }
    };
    fetchRooms();
  }, [hotelId, token, roomNameFromUrl]);

  useEffect(() => {
    if (data.startDate && !formState.checkIn)
      setFormState((prevState) => ({
        ...prevState,
        checkIn: dayjs(data.startDate),
      }));
    if (data.endDate && !formState.checkOut)
      setFormState((prevState) => ({
        ...prevState,
        checkOut: dayjs(data.endDate),
      }));
  }, [data.startDate, data.endDate, formState.checkIn, formState.checkOut]);

  useEffect(() => {
    calculateNights(formState.checkIn, formState.checkOut);
  }, [formState.checkIn, formState.checkOut, calculateNights]);

  useEffect(() => {
    calculateTotalPrice();
  }, [
    formState.rooms,
    formState.nights,
    formState.discount,
    formState.isAddTax,
    calculateTotalPrice,
  ]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
  }, []);

  const handleCheckInChange = (date) => {
    const updatedState = { ...formState, checkIn: date };
    setFormState(updatedState);
    calculateNights(date, formState.checkOut);
    onChange(updatedState); // Notify parent of state change
  };

  const handleCheckOutChange = (date) => {
    const updatedState = { ...formState, checkOut: date };
    setFormState(updatedState);
    calculateNights(formState.checkIn, date);
    onChange(updatedState); // Notify parent of state change
  };

  const addRoom = () => {
    setFormState((prevState) => {
      const updatedRooms = [
        ...prevState.rooms,
        {
          id: prevState.rooms.length + 1,
          adultCount: 1,
          childCount: 0,
          price: 0,
        },
      ];
      const updatedState = { ...prevState, rooms: updatedRooms };
      onChange(updatedState); // Notify parent of state change
      return updatedState;
    });
  };

  const removeRoom = (id) => {
    setFormState((prevState) => {
      const updatedRooms = prevState.rooms.filter((room) => room.id !== id);
      const updatedState = { ...prevState, rooms: updatedRooms };
      onChange(updatedState); // Notify parent of state change
      return updatedState;
    });
  };

  const handleRoomChange = (id, field, value) => {
    setFormState((prevState) => {
      const updatedRooms = prevState.rooms.map((room) =>
        room.id === id ? { ...room, [field]: value } : room
      );
      const updatedState = { ...prevState, rooms: updatedRooms };
      onChange(updatedState); // Notify parent of state change
      return updatedState;
    });
  };

  const handleRoomSelect = (id, value) => {
    const selectedRoom = formState.roomOptions.find(
      (room) => room.value === value
    );
    if (selectedRoom) {
      handleRoomChange(id, "price", selectedRoom.price);
    }
    onChange(selectedRoom);
  };

  const handleDiscountCodeChange = async (e) => {
    const code = e.target.value;
    setFormState((prevState) => ({ ...prevState, discountCode: code }));
    onChange({ ...formState, discountCode: code }); // Notify parent of state change

    if (code.length === 6) {
      setFormState((prevState) => ({ ...prevState, isDiscountLoading: true }));
      try {
        const data = await verifyDiscountCode(code, token);
        let discountValue = 0;
        if (data.status === 200) {
          if (data.result.type === "percentage") {
            discountValue =
              (formState.originalTotalPrice * data.result.amount) / 100;
          } else if (data.result.type === "value") {
            discountValue = data.result.amount;
          }
          const updatedState = {
            ...formState,
            discount: discountValue,
            discountType: data.result.type,
            promotionError: "",
          };
          setFormState(updatedState);
          onChange(updatedState); // Notify parent of state change
          calculateTotalPrice();
        } else {
          const updatedState = {
            ...formState,
            promotionError: data.message || "Promotion not found",
            discount: 0,
          };
          setFormState(updatedState);
          onChange(updatedState); // Notify parent of state change
        }
      } catch (err) {
        const updatedState = {
          ...formState,
          promotionError: err.message || "Promotion not found",
          discount: 0,
        };
        setFormState(updatedState);
        onChange(updatedState); // Notify parent of state change
      } finally {
        setFormState((prevState) => ({
          ...prevState,
          isDiscountLoading: false,
        }));
        onChange({ ...formState, isDiscountLoading: false }); // Notify parent of state change
      }
    } else {
      setFormState((prevState) => ({ ...prevState, promotionError: "" }));
      onChange({ ...formState, promotionError: "" }); // Notify parent of state change
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    onChange({ ...formState, [name]: value }); // Notify parent of state change
  };

  return (
    // Your JSX here
    <div className="p-6 bg-gray-100 rounded-md w-full mb-4">
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
            value={formState.checkIn}
            onChange={(date) => {
              handleCheckInChange(date);
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
            value={formState.checkOut}
            onChange={(date) => {
              handleCheckOutChange(date);
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
            onChange={handleChange}
            value={`${formState.nights} Nights`}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      {/* Room Details */}
      {formState.loading ? (
        <Spin size="large" />
      ) : formState.error ? (
        <p className="text-red-500">{formState.error}</p>
      ) : (
        formState.rooms.map((room) => (
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
                options={formState.roomOptions}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                value={
                  formState.roomOptions.find(
                    (option) => option.price === room.price
                  )?.value || null
                }
                onChange={(value) => handleRoomSelect(room.id, value)}
              />
            </div>
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
            {formState.rooms.length > 1 && (
              <div className="col-span-12 md:col-span-4 lg:col-span-2 flex justify-end items-center">
                <div
                  className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => removeRoom(room.id)}
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
          onClick={addRoom}
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
            value={formState.discountCode}
            onChange={handleDiscountCodeChange}
            maxLength={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={formState.isDiscountLoading}
            suffix={formState.isDiscountLoading && <Spin />}
          />
        </div>
        <div className="w-1/2 text-right">
          <label
            htmlFor="totalPrice"
            className="block text-sm font-medium text-gray-700"
          >
            Total Room Price/Night: ({formState.totalPrice.toFixed(2)})
          </label>
          <Input
            id="totalPrice"
            value={`${formState.totalPrice.toFixed(2)}`}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      {formState.discountType && (
        <div className="flex justify-between mt-4">
          <div>
            <table>
              <tr>
                <td>Discount Value:</td>
                <td>{formState.discount}</td>
              </tr>
              <tr>
                <td>Discount Type:</td>
                <td>{formState.discountType}</td>
              </tr>
            </table>
          </div>
          <table>
            <tr>
              <td>Grand Total:</td>
              <td>{formState.grandTotal}</td>
            </tr>
            <tr>
              <td>Final Total:</td>
              <td>{formState.totalPrice}</td>
            </tr>
          </table>
          {formState.promotionError && (
            <div style={{ color: "red" }}>{formState.promotionError}</div>
          )}
        </div>
      )}
      <div className="mt-4">
        <label className="flex items-center space-x-2">
          <Checkbox checked={formState.isAddTax} onChange={addTax} />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Include Tax
          </span>
        </label>
      </div>
    </div>
  );
};

export default StayInformation;
