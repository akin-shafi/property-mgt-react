import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext"; // Access AuthContext
import { Spin } from "antd";
import { RiDeleteBin5Line } from "react-icons/ri";
import { fetchHotelDetailsByTenantId } from "../../../hooks/useAction";

const RoomSetup = ({ onChange }) => {
  const { state } = useAuth();
  const token = state.token;
  const tenantId = state?.user?.tenantId;

  const initialRow = {
    roomType: "",
    numRooms: 1,
    currency: "NGN",
    pricePerNight: "",
  };

  const roomTypeOptions = [
    "Studio",
    "Standard",
    "Deluxe",
    "Executive",
    "Junior Suite",
    "Conference Room",
    "Suite",
    "Penthouse",
    "Other",
  ];

  const currencyOptions = ["USD", "EUR", "GBP", "JPY", "AUD", "NGN"];

  const [rows, setRows] = useState([initialRow]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isMounted, setIsMounted] = useState(false);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [error, setError] = useState("");
  const [roomType, setRoomType] = useState(""); // Selected room type

  const [hotelId, setHotelId] = useState(null);

  // Fetch room setup data
  useEffect(() => {
    const fetchRoomSetupData = async () => {
      if (!token || !tenantId || hasFetchedData) return;

      try {
        // Fetch hotel details first to get the hotelId
        const hotelData = await fetchHotelDetailsByTenantId(tenantId, token);
        setHotelId(hotelData.id); // Save hotelId

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/rooms/hotels/${tenantId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch room setup data."
          );
        }

        const roomData = await response.json();
        setRows(roomData.length > 0 ? roomData : [initialRow]);

        // Pass the initial data to the parent component
        onChange({ roomData: roomData, hotelId: hotelData.id });

        setHasFetchedData(true);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    // setIsMounted(true);
    fetchRoomSetupData();
  }, [token, tenantId, hasFetchedData, onChange, initialRow]);

  // Handle row changes
  const handleRowChange = (index, field, value) => {
    // console.log("field", field);
    if (field == "roomType") {
      setRoomType(value);
    }
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);

    // Pass updated rows with hotelId to parent
    onChange({ roomData: updatedRows, hotelId });
  };

  // Add a new row
  const handleAddRow = () => {
    setRows([...rows, initialRow]);
  };

  // Remove a row
  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const renderError = () =>
    error && <p className="text-red-500 text-center mb-4">{error}</p>;

  const renderRows = () =>
    rows.map((row, index) => (
      <div
        key={index}
        className="border p-4 rounded w-full grid md:grid-cols-2 grid-cols-1 gap-3 mb-6"
      >
        {rows.length > 1 && (
          <div className="flex justify-end md:col-span-2 col-span-1">
            <RiDeleteBin5Line
              className="cursor-pointer text-appMuted transition-all duration-300 hover:text-red-500"
              onClick={() => handleRemoveRow(index)}
            />
          </div>
        )}

        <div className="w-full flex flex-col md:col-span-1 col-span-2">
          {/* Room Type */}
          <label className="block text-sm font-medium text-gray-700">
            Room Type <sup className="text-red-500">*</sup>
          </label>
          <select
            value={row.roomType}
            onChange={(e) => handleRowChange(index, "roomType", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="">Select Room Type</option>
            {roomTypeOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col md:col-span-1 col-span-2">
          {/* Number of Rooms */}
          {/* <label className="block text-sm font-medium text-gray-700">
            Number of Rooms <sup className="text-red-500">*</sup>
          </label> */}

          <label
            htmlFor="numRooms"
            className="block text-sm font-medium text-gray-700"
          >
            How many {roomType} rooms do you have?{" "}
            <sup className="text-red-500">*</sup>
          </label>
          <input
            type="number"
            value={row.numRooms}
            onChange={(e) =>
              handleRowChange(index, "numRooms", parseInt(e.target.value, 10))
            }
            className="w-full p-2 border border-gray-300 rounded mt-1"
            min={1}
            disabled={!row.roomType}
          />
        </div>

        <div className="w-full flex flex-col md:col-span-1 col-span-2">
          {/* Currency */}
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            value={row.currency}
            onChange={(e) => handleRowChange(index, "currency", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            {currencyOptions.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col md:col-span-1 col-span-2">
          {/* Price Per Night */}
          <label className="block text-sm font-medium text-gray-700">
            Price Per Night <sup className="text-red-500">*</sup>
          </label>
          <input
            type="number"
            value={row.pricePerNight}
            onChange={(e) =>
              handleRowChange(
                index,
                "pricePerNight",
                parseFloat(e.target.value)
              )
            }
            className="w-full p-2 border border-gray-300 rounded mt-1"
            disabled={!row.currency}
          />
        </div>
      </div>
    ));

  return (
    <>
      {/* {isMounted && (
        <CircleSpinnerOverlay
          loading={isLoading}
          overlayColor="rgba(0,153,255,0.2)"
        />
      )} */}
      <Spin spinning={isLoading}>
        <div className="space-y-6">
          {renderError()}
          {renderRows()}
          <div className="flex items-center justify-end">
            <FaPlusCircle />
            <span
              className="ml-2 text-dark hover:text-appOrange  text-sm cursor-pointer"
              onClick={handleAddRow}
            >
              Add Another Room Type Details
            </span>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default RoomSetup;
