// EditReservationModal.tsx
import { useState, useEffect } from "react";
import { Modal, Button, DatePicker, Select, message } from "antd";
import { fetchReservationById } from "@/hooks/useReservation";
import dayjs from "dayjs";

const { Option } = Select;

const EditReservationModal = ({ visible, onCancel, resourceId, token }) => {
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (visible && resourceId) {
        setLoading(true);
        try {
          const data = await fetchReservationById(resourceId, token);
          const reservationDetails = data.reservationDetails;
          const billing = data.reservationDetails.billing[0];
          const roomDetails = data.reservationDetails.bookedRooms[0];

          setRoomName(roomDetails.roomName);
          setRoomPrice(parseFloat(roomDetails.roomPrice));
          setNumberOfNights(reservationDetails.numberOfNights);
          setGrandTotal(parseFloat(billing.grandTotal));

          const filteredData = {
            checkInDate: dayjs(reservationDetails.checkInDate).format(
              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            ),
            checkOutDate: dayjs(reservationDetails.checkOutDate).format(
              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            ),
            reservationType: reservationDetails.reservationType,
            reservationStatus: reservationDetails.reservationStatus,
          };

          setReservationDetails(filteredData);
        } catch (err) {
          console.log(err, "Failed to fetch reservation data");
          message.error("Failed to fetch reservation data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReservationDetails();
  }, [visible, resourceId, token]);

  const calculateTotalPrice = (checkInDate, checkOutDate, roomPrice) => {
    const checkIn = dayjs(checkInDate);
    const checkOut = dayjs(checkOutDate);
    const nights = checkOut.diff(checkIn, "day");
    const totalPrice = nights * roomPrice;
    setNumberOfNights(nights);
    setGrandTotal(totalPrice);
  };

  const handleDateChange = (field, date) => {
    const updatedDetails = {
      ...reservationDetails,
      [field]: date,
    };
    setReservationDetails(updatedDetails);

    if (field === "checkInDate" || field === "checkOutDate") {
      const { checkInDate, checkOutDate } = updatedDetails;
      if (checkInDate && checkOutDate) {
        calculateTotalPrice(checkInDate, checkOutDate, roomPrice);
      }
    }
  };

  const handleReservationTypeChange = (value) => {
    setReservationDetails({
      ...reservationDetails,
      reservationType: value,
    });
  };

  const handleReservationStatusChange = (value) => {
    setReservationDetails({
      ...reservationDetails,
      reservationStatus: value,
    });
  };

  const handleSave = () => {
    const payload = {
      checkInDate: reservationDetails.checkInDate,
      checkOutDate: reservationDetails.checkOutDate,
      grandTotal,
      numberOfNights,
      reservationStatus: reservationDetails.reservationStatus,
      reservationType: reservationDetails.reservationType,
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    console.log("Payload to be sent:", payload);
    // Save logic here
  };

  return (
    <Modal
      title="Edit Reservation"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          Save
        </Button>,
      ]}
    >
      {reservationDetails && (
        <form>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Check-In</label>
              <DatePicker
                required
                className="w-full"
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Select Date & Time"
                value={
                  reservationDetails.checkInDate
                    ? dayjs(reservationDetails.checkInDate)
                    : null
                }
                onChange={(date) => handleDateChange("checkInDate", date)}
                disabledDate={(currentDate) => {
                  const oneWeekAgo = dayjs().subtract(7, "day").endOf("day");
                  return currentDate && currentDate.isBefore(oneWeekAgo);
                }}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Check-Out</label>
              <DatePicker
                required
                className="w-full"
                showTime
                format="DD/MM/YYYY HH:mm"
                placeholder="Select Date & Time"
                value={
                  reservationDetails.checkOutDate
                    ? dayjs(reservationDetails.checkOutDate)
                    : null
                }
                onChange={(date) => handleDateChange("checkOutDate", date)}
                disabledDate={(currentDate) => {
                  return (
                    currentDate &&
                    currentDate.isBefore(dayjs(reservationDetails.checkInDate))
                  );
                }}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                Reservation Type
              </label>
              <Select
                className="w-full"
                placeholder="Select Type"
                value={reservationDetails.reservationType}
                onChange={handleReservationTypeChange}
              >
                <Option value="walk_in">Walk In</Option>
                <Option value="online_reservation">Online reservation</Option>
              </Select>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">
                Reservation Status
              </label>
              <Select
                className="w-full"
                placeholder="Select Status"
                value={reservationDetails.reservationStatus}
                onChange={handleReservationStatusChange}
              >
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
              </Select>
            </div>
          </div>

          <table>
            <tr>
              <td>
                <b>Room Name:</b>
              </td>
              <td className="pl-2">{roomName}</td>
            </tr>
            <tr>
              <td>Room Price:</td>
              <td className="pl-2">{roomPrice}</td>
            </tr>
            <tr>
              <td>Number of Nights:</td>
              <td className="pl-2">{numberOfNights}</td>
            </tr>
            <tr>
              <td>Grand Total:</td>
              <td className="pl-2">{grandTotal}</td>
            </tr>
          </table>
        </form>
      )}
    </Modal>
  );
};

export default EditReservationModal;
