import { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchReservationById } from "@/hooks/useReservation";

const ReceiptModal = ({ visible, onClose, reservationId, token }) => {
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    if (reservationId) {
      fetchReservationById(reservationId, token)
        .then((data) => {
          console.log("Fetched reservation data: ", data); // Log the API response to confirm data
          setReservationData(data);
        })
        .catch((error) => {
          console.error("Error fetching reservation:", error);
        });
    }
  }, [reservationId, token]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Reservation Receipt", 10, 10);
    doc.autoTable({ html: "#receipt-table" });
    doc.save("receipt.pdf");
  };

  const printReceipt = () => {
    window.print();
  };

  if (!reservationData) {
    return null;
  }

  // Accessing necessary details from reservationData
  const { reservationDetails, guest, billing, bookedRooms } = reservationData;
  const grandTotal = billing?.[0]?.grandTotal || "N/A";
  const amountPaid = billing?.[0]?.amountPaid || "N/A";
  const balanceDue = billing?.[0]?.balance || "N/A";

  console.log("Reservation Data Details: ", reservationDetails); // Log to check if data exists

  return (
    <Modal
      title="Reservation Receipt"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="download" onClick={downloadPDF}>
          Download as PDF
        </Button>,
        <Button key="print" onClick={printReceipt}>
          Print
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div id="receipt-content">
        <h3>Reservation Receipt</h3>

        {/* Reservation Info */}
        <div className="receipt-header">
          <div>
            <p>
              <strong>Reservation No:</strong> {reservationDetails?.id || "N/A"}
            </p>
            <p>
              <strong>Check-In:</strong>{" "}
              {reservationDetails?.checkInDate || "N/A"}
            </p>
            <p>
              <strong>Check-Out:</strong>{" "}
              {reservationDetails?.checkOutDate || "N/A"}
            </p>
          </div>
        </div>

        {/* Guest Information Table */}
        <h4>Guest Information</h4>
        <table style={{ width: "100%", marginBottom: "15px" }}>
          <thead>
            <tr>
              <th>Field</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Full Name</strong>
              </td>
              <td>{guest?.fullName || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Email</strong>
              </td>
              <td>{guest?.email || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Phone</strong>
              </td>
              <td>{guest?.phone || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Address</strong>
              </td>
              <td>{guest?.address || "N/A"}</td>
            </tr>
          </tbody>
        </table>

        {/* Room Information Table */}
        <h4>Room Details</h4>
        <table style={{ width: "100%", marginBottom: "15px" }}>
          <thead>
            <tr>
              <th>Room</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bookedRooms?.length ? (
              bookedRooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.roomName || "Room"}</td>
                  <td>{room.numberOfAdults}</td>
                  <td>{room.numberOfChildren}</td>
                  <td>₹{room.roomPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No rooms booked</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Billing Summary */}
        <div className="receipt-footer">
          <p>
            <strong>Subtotal:</strong> ₹{billing?.[0]?.totalPrice || "N/A"}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹{amountPaid}
          </p>
          <p>
            <strong>Balance Due:</strong> ₹{balanceDue}
          </p>
          <p>
            <strong>Grand Total:</strong> ₹{grandTotal}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
