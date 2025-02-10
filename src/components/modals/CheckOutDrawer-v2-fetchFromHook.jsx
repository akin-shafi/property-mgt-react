/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Form, Input, Spin, message } from "antd";
import { fetchReservationById } from "@/hooks/useReservation";
import dayjs from "dayjs";

export default function ModalDrawer({
  open,
  onClose,
  pageTitle,
  resourceId,
  token, // We'll need the token for fetching the data
  onCheckoutSuccess,
  onOpenAddPaymentModal, // Callback to open the add payment modal in the parent component
}) {
  const showPageTitle = pageTitle ?? "Check-out";
  const [form] = Form.useForm();

  // State variables to hold reservation details
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [numberOfNightsBooked, setNumberOfNightsBooked] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // New state variables
  const [refundAmount, setRefundAmount] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [nightsStayed, setNightsStayed] = useState(0);
  const [earlyCheckout, setEarlyCheckout] = useState(false);

  // Clear previous data when resourceId changes
  useEffect(() => {
    setReservationDetails(null);
    setRoomName("");
    setPricePerNight(0);
    setAmountPaid(0);
    setNumberOfNightsBooked(0);
    setGrandTotal(0);
    setRefundAmount(0);
    setOutstandingBalance(0);
    setNightsStayed(0);
    setEarlyCheckout(false);
  }, [resourceId]);

  // Fetch reservation data using the hook when the drawer is opened
  useEffect(() => {
    if (open && resourceId) {
      setLoading(true);
      fetchReservationById(resourceId, token)
        .then((data) => {
          const reservationData = data.reservation;

          // **Use local variables for calculations**
          const numberOfNightsBooked = reservationData.numberOfNights;
          const pricePerNight = parseFloat(
            reservationData.bookedRooms[0]?.roomPrice || 0
          );
          const amountPaid = parseFloat(reservationData.totalPaid || 0);
          const grandTotal = parseFloat(reservationData.grandTotal || 0);
          const roomName = reservationData.bookedRooms[0]?.roomName || "";

          // Update state variables
          setReservationDetails(reservationData);
          setNumberOfNightsBooked(numberOfNightsBooked);
          setPricePerNight(pricePerNight);
          setAmountPaid(amountPaid);
          setGrandTotal(grandTotal);
          setRoomName(roomName);

          // Calculate nights stayed
          const checkInDate = dayjs(reservationData.checkInDate);
          const checkOutDate = dayjs(reservationData.checkOutDate);
          const currentDate = dayjs();

          // Nights stayed cannot exceed nights booked
          const stayedDays = currentDate.diff(checkInDate, "day");
          const nightsStayed = currentDate.isBefore(checkInDate)
            ? 0
            : Math.min(Math.max(1, stayedDays), numberOfNightsBooked);
          setNightsStayed(nightsStayed);

          // Check for early checkout
          const isEarlyCheckout = currentDate.isBefore(checkOutDate);
          setEarlyCheckout(isEarlyCheckout);

          // **Perform calculations using local variables**
          const totalCost = nightsStayed * pricePerNight;
          const difference = amountPaid - totalCost;

          if (difference > 0) {
            // Guest is entitled to a refund
            setRefundAmount(difference);
            setOutstandingBalance(0);
          } else if (difference < 0) {
            // Guest owes an outstanding balance
            setOutstandingBalance(Math.abs(difference));
            setRefundAmount(0);
          } else {
            // No refund or outstanding balance
            setRefundAmount(0);
            setOutstandingBalance(0);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reservation:", error);
          setLoading(false);
          message.error("Failed to fetch reservation data.");
        });
    }
  }, [open, resourceId, token]);

  // Format money values
  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleCheckout = async () => {
    const values = await form.validateFields();
    const payload = {
      activity: "check_out",
      reservationStatus: "transaction_completed",
      refund: refundAmount,
      nightSpent: nightsStayed,
      additionalNotes: values.additionalNotes || "", // Include additional notes
    };

    console.log("Checkout payload:", payload);
    message.success("Check-out successful");
    onCheckoutSuccess();
    onClose();
  };

  const handleOpenAddPaymentModal = () => {
    onOpenAddPaymentModal(resourceId);
    onClose();
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      title={showPageTitle}
      width="35%"
      className="rounded-md custom-drawer"
      maskClosable={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col gap-2">
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div className="reservation-info" style={{ marginTop: "-20px" }}>
                <h2 className="text-xl font-bold mb-2">
                  {reservationDetails?.guest?.fullName} (Room - {roomName})
                </h2>

                <table className="w-full">
                  <tbody>
                    {reservationDetails && (
                      <tr className="border-b">
                        <td className="py-2">Check-in/out:</td>
                        <td className="text-right">
                          {reservationDetails?.checkInDate} -{" "}
                          {reservationDetails?.checkOutDate}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2">Number of Nights Booked:</td>
                      <td className="text-right"> {numberOfNightsBooked}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Number of Nights Stayed:</td>
                      <td className="text-right"> {nightsStayed}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Price per Night:</td>
                      <td className="text-right">
                        {formatMoney(pricePerNight)}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="py-2">Grand Total:</td>
                      <td className="text-right">{formatMoney(grandTotal)}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="py-2">Amount Paid:</td>
                      <td className="text-right">{formatMoney(amountPaid)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {refundAmount > 0 && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-yellow-800">
                    Guest is eligible for a refund of{" "}
                    {formatMoney(refundAmount)}.
                  </p>
                  <p className="text-yellow-800">
                    <strong>Refund Calculation:</strong>
                    <br />
                    Amount Paid - (Nights Stayed × Price per Night)
                  </p>
                </div>
              )}

              {outstandingBalance > 0 && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
                  <p className="text-red-800">
                    Guest needs to pay the outstanding balance of{" "}
                    {formatMoney(outstandingBalance)} before check-out.
                  </p>
                  <p className="text-red-800">
                    <strong>Outstanding Balance Calculation:</strong>
                    <br />
                    (Nights Stayed × Price per Night) - Amount Paid
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={handleOpenAddPaymentModal}>
                      Add Payment
                    </Button>
                  </div>
                </div>
              )}

              {refundAmount === 0 && outstandingBalance === 0 && (
                <Form form={form} onFinish={handleCheckout}>
                  <Form.Item name="additionalNotes" label="Additional Notes">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <div className="flex justify-end mt-4">
                    <Button type="primary" htmlType="submit">
                      Complete Check-out
                    </Button>
                  </div>
                </Form>
              )}
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
