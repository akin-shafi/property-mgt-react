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
          // console.log("Fetched reservation data: ", data); // Log the API response to confirm data
          setReservationData(data.reservationDetails);
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
  const {
    id,
    checkInDate,
    checkOutDate,
    numberOfNights,
    guest,
    billing,
    bookedRooms,
  } = reservationData;
  const grandTotal = billing?.[0]?.grandTotal || "N/A";
  const amountPaid = billing?.[0]?.amountPaid || "N/A";
  const balanceDue = billing?.[0]?.balance || "N/A";

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
              <strong>Reservation No:</strong> {id || "N/A"}
            </p>
            <p>
              <strong>Check-In:</strong> {checkInDate || "N/A"}
            </p>
            <p>
              <strong>Check-Out:</strong> {checkOutDate || "N/A"}
            </p>
            <p>
              <strong>Number(s) of Night:</strong> {numberOfNights || "N/A"}
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
            {guest ? (
              <>
                <tr>
                  <td>
                    <strong>Full Name</strong>
                  </td>
                  <td>{guest.fullName || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Email</strong>
                  </td>
                  <td>{guest.email || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phone</strong>
                  </td>
                  <td>{guest.phone || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Address</strong>
                  </td>
                  <td>{guest.address || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>ID Proof</strong>
                  </td>
                  <td>{guest.idProof || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Identity Type</strong>
                  </td>
                  <td>{guest.identityType || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Identity Number</strong>
                  </td>
                  <td>{guest.identityNumber || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Nationality</strong>
                  </td>
                  <td>{guest.nationality || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Gender</strong>
                  </td>
                  <td>{guest.gender || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Created At</strong>
                  </td>
                  <td>{guest.createdAt || "N/A"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Updated At</strong>
                  </td>
                  <td>{guest.updatedAt || "N/A"}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2">No guest information available</td>
              </tr>
            )}
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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookedRooms) && bookedRooms.length > 0 ? (
              bookedRooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.roomName || "Room"}</td>
                  <td>{room.numberOfAdults}</td>
                  <td>{room.numberOfChildren}</td>
                  <td>NGN{room.roomPrice}</td>
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
            <strong>Subtotal:</strong> NGN{billing?.[0]?.totalPrice || "N/A"}
          </p>
          <p>
            <strong>Amount Paid:</strong> NGN{amountPaid}
          </p>
          <p>
            <strong>Balance Due:</strong> NGN{balanceDue}
          </p>
          <p>
            <strong>Grand Total:</strong> NGN{grandTotal}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
