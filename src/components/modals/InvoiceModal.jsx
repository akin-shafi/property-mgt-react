import { useState, useEffect, useRef } from "react";
import { Modal, Button, message } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { fetchReservationById } from "@/hooks/useReservation";
import { CalendarDays, MapPin, User } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import { jsPDF } from "jspdf";
import "jspdf-autotable";

const InvoiceModal = ({ visible, onCancel, resourceId, token, hotelName }) => {
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [guest, setGuest] = useState("");
  const [billing, setBilling] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalance] = useState(0);

  const [roomPrice, setRoomPrice] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (visible && resourceId) {
        setLoading(true);
        try {
          const data = await fetchReservationById(resourceId, token);
          if (data && data.reservationDetails) {
            const details = data.reservationDetails;
            const guestDetails = details.guest;
            const billingDetails = details.billing?.[0] || {};
            const room = details.bookedRooms?.[0] || {};
            // console.log("reservationDetails", details.createdAt);
            setAmountPaid(billingDetails.amountPaid || "N/A");
            setBalance(billingDetails.balance || "N/A");
            setBilling(billingDetails || "N/A");
            setGuest(guestDetails || "N/A");
            setRoomName(room.roomName || "N/A");
            setRoomPrice(parseFloat(room.roomPrice) || 0);
            setNumberOfNights(details.numberOfNights || 0);
            setGrandTotal(parseFloat(billingDetails.grandTotal) || 0);

            setReservationDetails({
              createdAt: dayjs(details.createdAt).format(
                "MMM DD, YYYY HH:mm:ss"
              ),
              checkInDate: dayjs(details.checkInDate).format("MMM DD, YYYY"),
              checkOutDate: dayjs(details.checkOutDate).format("MMM DD, YYYY"),
              reservationType: details.reservationType,
              reservationStatus: details.reservationStatus,
            });
          }
        } catch (err) {
          console.error("Error fetching reservation data:", err);
          message.error("Failed to fetch reservation data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReservationDetails();
  }, [visible, resourceId, token]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text(hotelName, 105, 15, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #INV-${resourceId}`, 105, 25, { align: "center" });

    // Guest Information
    doc.text(`Guest: ${guest.fullName || "N/A"}`, 10, 40);
    doc.text(
      `Date Created: ${dayjs(reservationDetails?.createdAt)
        .tz("Africa/Lagos")
        .format("MMM DD, YYYY hh:mm A")}`,
      10,
      45
    );
    doc.text(
      `Reservation Type: ${reservationDetails?.reservationType || "N/A"}`,
      10,
      50
    );
    doc.text(`Check-in: ${reservationDetails?.checkInDate || "N/A"}`, 10, 60);
    doc.text(`Check-out: ${reservationDetails?.checkOutDate || "N/A"}`, 10, 70);
    doc.text(`Room: ${roomName || "N/A"}`, 10, 80);

    // Charges
    const charges = [
      ["Description", "Amount"],
      [`Room Charge (${numberOfNights} nights)`, `NGN ${roomPrice.toFixed(2)}`],
    ];

    if (billing.isAddTax) {
      charges.push(["Taxes", `NGN ${billing.taxValue}`]);
    }

    if (balance !== "0.00") {
      charges.push(["Amount Paid", `NGN ${amountPaid}`]);
      charges.push(["Balance", `NGN ${balance}`]);
    }

    charges.push(["Grand Total", `NGN ${grandTotal.toFixed(2)}`]);

    doc.autoTable({
      startY: 90,
      head: [charges[0]],
      body: charges.slice(1),
      styles: { halign: "right" },
      headStyles: { fillColor: [0, 0, 0] },
    });

    // Footer
    doc.text(
      "Thank you for choosing our hotel!",
      105,
      doc.autoTable.previous.finalY + 20,
      { align: "center" }
    );
    doc.text(
      "For inquiries: reservations@example.com",
      105,
      doc.autoTable.previous.finalY + 30,
      { align: "center" }
    );

    doc.save(`invoice-${resourceId}.pdf`);
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .w-full { width: 100%; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  if (loading) {
    return "Loading...";
  }

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>,
        <Button
          key="download"
          icon={<DownloadOutlined />}
          onClick={downloadPDF}
        >
          Download
        </Button>,
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <div ref={printRef} className="w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          {hotelName}
        </h1>

        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h3>{guest.fullName}</h3>
            <p>
              <b>Date:</b> {reservationDetails?.createdAt}
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600">#INV-{resourceId}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="mr-2 text-gray-600" />
              <span>{reservationDetails?.reservationType || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 text-gray-600" />
              <span>Check-in: {reservationDetails?.checkInDate || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-600" />
              <span>Room - {roomName || "Room Info Unavailable"}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 text-gray-600" />
              <span>
                Check-out: {reservationDetails?.checkOutDate || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Charges</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Room Charge ({numberOfNights} nights)</td>
                <td className="text-right">NGN {roomPrice}</td>
              </tr>
              {billing.isAddTax && (
                <tr className="border-b">
                  <td className="py-2">Taxes</td>
                  <td className="text-right">NGN {billing.taxValue}</td>
                </tr>
              )}

              {balance !== "0.00" && (
                <>
                  <tr className="border-b">
                    <td className="py-2">Amount Paid</td>
                    <td className="text-right">NGN {amountPaid}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Balance </td>
                    <td className="text-right">NGN {balance}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center font-bold text-xl">
          <span>Grand Total</span>
          <span>NGN {grandTotal.toFixed(2)}</span>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Thank you for choosing our hotel. We hope you enjoyed your stay!
          </p>
          <p>
            For any inquiries, please contact us at reservations@example.com
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default InvoiceModal;
