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
            setAmountPaid(billingDetails.amountPaid || "N/A");
            setBalance(billingDetails.balance || "N/A");
            setBilling(billingDetails || "N/A");
            setGuest(guestDetails || "N/A");
            setRoomName(room.roomName || "N/A");
            setRoomPrice(parseFloat(room.roomPrice) || 0);
            setNumberOfNights(details.numberOfNights || 0);
            setGrandTotal(parseFloat(billingDetails.grandTotal) || 0);

            setReservationDetails(details);
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

  const filteredData = reservationDetails
    ? {
        createdAt: dayjs(reservationDetails.createdAt).format(
          "MMM DD, YYYY HH:mm:ss"
        ),
        checkInDate: dayjs(reservationDetails.checkInDate).format(
          "MMM DD, YYYY"
        ),
        checkOutDate: dayjs(reservationDetails.checkOutDate).format(
          "MMM DD, YYYY"
        ),
        reservationType: reservationDetails.reservationType,
        reservationStatus: reservationDetails.reservationStatus,
      }
    : {};

  const normalizeCurrency = (value) =>
    parseFloat(value.replace(/[^0-9.-]+/g, ""));

  const normalizedBalance = normalizeCurrency(
    reservationDetails?.totalBalance || "0"
  );
  const normalizedTotalPaid = normalizeCurrency(
    reservationDetails?.totalPaid || "0"
  );
  const normalizedGrandTotal = normalizeCurrency(
    reservationDetails?.grandTotal || "0"
  );

  // Format amounts to currency
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const formattedGrandTotal = formatter.format(normalizedGrandTotal);
  const formattedTotalPaid = formatter.format(normalizedTotalPaid);
  const formattedTotalBalance = formatter.format(normalizedBalance);
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

        <div className="flex justify-between items-center mb-1">
          <div className="text-left">
            <h3>{guest.fullName}</h3>
            <p>
              <b>Date:</b> {filteredData?.createdAt}
            </p>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600">#INV-{resourceId}</p>
          </div>
        </div>

        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold mb-4">Reservation Details</h2> */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="mr-2 text-gray-600" />
              <span>{filteredData?.reservationType || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 text-gray-600" />
              <span>Check-in: {filteredData?.checkInDate || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-600" />
              <span>Room - {roomName || "Room Info Unavailable"}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 text-gray-600" />
              <span>Check-out: {filteredData?.checkOutDate || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-medium">Charges</h2>
          <table className="" style={{ width: "50%" }}>
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
              <tr className="border-b">
                <td className="py-2">Grand Total</td>
                <td className="text-right">{formattedGrandTotal} </td>
              </tr>
            </tbody>
          </table>
          <p className="text-xl font-semibold mb-4 text-center mt-4">
            Payment Record
          </p>
          {reservationDetails && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="py-2 px-2 text-left">S/N</th>
                  <th className="py-2 px-2 text-left">Payment Mode</th>
                  <th className="py-2 px-2 text-left">Amount Paid</th>
                  <th className="py-2 px-2 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {reservationDetails?.billing?.map((bill, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-2 border-b">{index + 1}</td>
                    <td className="py-2 px-2 border-b">
                      {bill.payment_method}
                    </td>
                    <td className="py-2 px-2 border-b">{bill.amountPaid}</td>
                    <td className="py-2 px-2 border-b">{bill.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* <div className="flex justify-between items-center font-bold text-xl">
          <span>Grand Total</span>
          <span>NGN {grandTotal.toFixed(2)}</span>
        </div> */}

        <div className="grid grid-cols-1 gap-2 ">
          {/* <div className="flex justify-between">
            <span className="font-semibold">Grand Total</span>
            <span className="font-semibold">: {formattedGrandTotal}</span>
          </div> */}
          <div className="flex justify-between">
            <span className="font-semibold">Total Paid</span>
            <span className="font-semibold">: {formattedTotalPaid}</span>
          </div>

          {normalizedBalance !== 0 && (
            <div className="flex justify-between">
              <span className="font-semibold">Total Balance</span>
              <span className="font-semibold">: {formattedTotalBalance}</span>
            </div>
          )}
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
