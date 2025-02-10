import { useState, useEffect } from "react";
import { Modal, Button, Select, message, DatePicker, Checkbox } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchReservationById, exchangeRoom } from "@/hooks/useReservation";
import { fetchHotelRoomsWithPrice } from "@/hooks/useAction";
import { useSession } from "@/hooks/useSession";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

const ExchangeRoomModal = ({
  visible,
  onCancel,
  resourceId,
  token,
}) => {
  const { session } = useSession();
  const hotelId = session?.user?.hotelId;

  const [reservationDetails, setReservationDetails] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [newRoom, setNewRoom] = useState(null);

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [retainCurrentRate, setRetainCurrentRate] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (visible && resourceId) {
        setLoading(true);
        try {
          const data = await fetchReservationById(resourceId, token);
          if (data?.reservation) {
            const details = data.reservation;
            setReservationDetails(details);
            setCurrentRoom(details.bookedRooms?.[0] || null);
            setCheckInDate(dayjs(details.checkInDate));
            setCheckOutDate(dayjs(details.checkOutDate));
            setGrandTotal(
              parseFloat(details.grandTotal.replace("₦", "").replace(",", ""))
            );

            const availableRoomsData = await fetchHotelRoomsWithPrice(
              hotelId,
              token
            );
            setAvailableRooms(availableRoomsData);
          }
        } catch (err) {
          console.error("Failed to fetch data:", err);
          message.error("Failed to fetch data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [visible, resourceId, token]);

  const calculateGrandTotal = (selectedRoom, newCheckOut) => {
    const checkInDate = dayjs(reservationDetails?.checkInDate);
    const updatedCheckOut = newCheckOut || checkOutDate;
    const newNumberOfNights = updatedCheckOut.diff(checkInDate, "day");

    const roomPrice = selectedRoom
      ? parseFloat(selectedRoom.price)
      : parseFloat(currentRoom?.roomPrice);
    const newTotal = roomPrice * newNumberOfNights;
    setGrandTotal(newTotal);
  };

  const handleRoomChange = (value) => {
    const selectedRoom = availableRooms.find((room) => room.roomName === value);
    setNewRoom(selectedRoom);
    if (!retainCurrentRate) {
      calculateGrandTotal(selectedRoom, checkOutDate);
    }
  };

  const handleDateChange = (date) => {
    setCheckOutDate(date ? dayjs(date) : null);
    if (!retainCurrentRate) {
      calculateGrandTotal(newRoom, date ? dayjs(date) : null);
    }
  };

  const handleRetainCurrentRateChange = (e) => {
    setRetainCurrentRate(e.target.checked);
    if (e.target.checked) {
      setGrandTotal(
        parseFloat(currentRoom?.roomPrice) * reservationDetails.numberOfNights
      );
    } else {
      calculateGrandTotal(newRoom, checkOutDate);
    }
  };

  const handleExchange = async () => {
    try {
      setLoading(true);
      const payload = {
        reservationId: resourceId,
        roomId: newRoom?.id || currentRoom.id, // Add roomId
        roomName: newRoom?.roomName || currentRoom.roomName,
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
        roomPrice: retainCurrentRate ? currentRoom.roomPrice : newRoom?.price,
        grandTotal: retainCurrentRate
          ? parseFloat(currentRoom?.roomPrice) *
            reservationDetails.numberOfNights
          : grandTotal,
        updatedAt: new Date(), // Add updatedAt
      };
      await exchangeRoom(payload, token);
      message.success("Room exchanged successfully");
      onCancel();
    } catch (err) {
      console.error("Failed to exchange room:", err);
      message.error("Failed to exchange room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Exchange Room"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="exchange"
          type="primary"
          onClick={handleExchange}
          loading={loading}
        >
          Exchange
        </Button>,
      ]}
    >
      {reservationDetails && currentRoom && (
        <form>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2 border-r">
              <h3 className="font-medium">Current Room Details</h3>

              <table style={{ width: "100%" }}>
                <tr>
                  <td>Check-In:</td>
                  <td>{checkInDate.format("MMM DD, YYYY")}</td>
                </tr>
                <tr>
                  <td>Check-Out:</td>
                  <td>{checkOutDate.format("MMM DD, YYYY")}</td>
                </tr>
                <tr>
                  <td>Room:</td>
                  <td>{currentRoom.roomName}</td>
                </tr>
                <tr>
                  <td>Room Price: </td>
                  <td>₦{currentRoom.roomPrice}</td>
                </tr>

                <tr>
                  <td>Number of Nights: </td>
                  <td>{reservationDetails.numberOfNights}</td>
                </tr>

                <tr>
                  <td>Total Paid: </td>
                  <td>{reservationDetails.totalPaid}</td>
                </tr>
                <tr>
                  <td>Total Balance:</td>
                  <td>{reservationDetails.totalBalance}</td>
                </tr>
              </table>
            </div>
            <div className="w-1/2">
              <div className="mb-4 hidden">
                <label className="block text-sm font-medium">Extend stay</label>
                <DatePicker
                  className="w-full"
                  value={checkOutDate ? dayjs(checkOutDate) : null}
                  onChange={handleDateChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Select New Room</h3>
                <Select
                  className="w-full"
                  placeholder="Select New Room"
                  onChange={handleRoomChange}
                >
                  {availableRooms.map((room) => (
                    <Option key={room.roomName} value={room.roomName}>
                      {room.roomName} - ₦{room.price}
                    </Option>
                  ))}
                </Select>
              </div>

              {newRoom && (
                <div className="mt-4">
                  <h3 className="font-medium">New Room Details</h3>
                  <p>Room: {newRoom.roomName}</p>
                  <p>Room Price: ₦{newRoom.price}</p>
                </div>
              )}

              <div className="mt-4">
                <Checkbox onChange={handleRetainCurrentRateChange}>
                  Retain Current Rate
                </Checkbox>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">
              Updated Grand Total: ₦{grandTotal?.toFixed(2)}
            </h3>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ExchangeRoomModal;
