import { useState, useEffect } from "react";
import { Modal, Button, message, DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchReservationById, exchangeRoom } from "@/hooks/useReservation";

dayjs.extend(utc);
dayjs.extend(timezone);

const ExtendStayModalVisible = ({
  visible,
  onCancel,
  newEndDate,
  resourceId,
  token,
}) => {
  const [reservationDetails, setReservationDetails] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [newNumberOfNights, setNewNumberOfNights] = useState(null);
  const [grandTotal, setGrandTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (visible && resourceId) {
        setLoading(true);
        try {
          const reservationData = await fetchReservationById(resourceId, token);
          if (reservationData?.reservationDetails) {
            const details = reservationData.reservationDetails;
            setReservationDetails(details);
            setCurrentRoom(details.bookedRooms?.[0] || null);
            setCheckInDate(dayjs(details.checkInDate));
            const endDate = newEndDate
              ? dayjs(newEndDate)
              : dayjs(details.checkOutDate);
            setCheckOutDate(endDate);

            const roomPrice = parseFloat(details.bookedRooms?.[0].roomPrice);
            const newNights = endDate.diff(dayjs(details.checkInDate), "day");
            setNewNumberOfNights(newNights);
            setGrandTotal(roomPrice * newNights);
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
  }, [visible, resourceId, token, newEndDate]);

  const handleDateChange = (date) => {
    const newCheckOut = date ? dayjs(date) : checkOutDate;
    setCheckOutDate(newCheckOut);

    const newNights = newCheckOut.diff(checkInDate, "day");
    setNewNumberOfNights(newNights);
    const roomPrice = parseFloat(currentRoom?.roomPrice);
    const newTotal = roomPrice * newNights;
    setGrandTotal(newTotal);
  };

  const handleExtendStay = async () => {
    try {
      setLoading(true);
      const payload = {
        reservationId: resourceId,
        roomId: currentRoom.id,
        roomName: currentRoom.roomName,
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
        numberOfNights: newNumberOfNights, // Add new number of nights
        grandTotal,
        updatedAt: new Date(),
      };
      await exchangeRoom(payload, token);
      message.success("Stay extended successfully");
      onCancel();
    } catch (err) {
      console.error("Failed to extend stay:", err);
      message.error("Failed to extend stay");
    } finally {
      setLoading(false);
    }
  };

  // Function to disable past dates
  const disablePastDates = (current) => {
    // return current && current < dayjs().startOf("day");
    return current && current < checkOutDate.startOf("day");
  };

  return (
    <Modal
      title="Extend Stay"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="extend"
          type="primary"
          onClick={handleExtendStay}
          loading={loading}
        >
          Extend Stay
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
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  New Checkout Date
                </label>
                <DatePicker
                  className="w-full"
                  value={checkOutDate ? dayjs(checkOutDate) : null}
                  onChange={handleDateChange}
                  disabledDate={disablePastDates} // Disable past dates
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  New Number of Nights
                </label>
                <input
                  type="number"
                  value={newNumberOfNights}
                  readOnly
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
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

export default ExtendStayModalVisible;
