/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Form, Input, Spin, message } from "antd";
import dayjs from "dayjs";

export default function ModalDrawer({
  open,
  onClose,
  pageTitle,
  dataSet, // Receiving the variable containing reservation details
}) {
  const showPageTitle = pageTitle ?? "Check-out";
  const [form] = Form.useForm();

  // State variables to hold reservation details
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0); // State to hold refund amount
  const [earlyCheckout, setEarlyCheckout] = useState(false); // State to indicate early checkout
  const [nightSpent, setNightSpent] = useState(0); // State to hold the number of nights spent
  const [daysRemain, setRemainingDays] = useState(0);

  // Update state when dataSet is received
  useEffect(() => {
    if (dataSet && dataSet.reservationData) {
      const reservationData = dataSet.reservationData;

      setReservationDetails(reservationData);
      setNumberOfNights(reservationData.numberOfNights);

      // Check if bookedRooms and billing exist
      if (reservationData.bookedRooms?.length > 0) {
        setRoomName(reservationData.bookedRooms[0].roomName);
        setRoomPrice(parseFloat(reservationData.bookedRooms[0].roomPrice));
      }

      if (reservationData.billing?.length > 0) {
        setAmountPaid(parseFloat(reservationData.totalPaid));
        setBalance(parseFloat(reservationData.totalBalance));
        setGrandTotal(parseFloat(reservationData.grandTotal));
      }

      // Calculate nights spent
      const checkInDate = dayjs(reservationData.checkInDate);
      const currentDate = dayjs();
      const nightsSpent = currentDate.diff(checkInDate, "day");
      setNightSpent(nightsSpent);

      // Check for early checkout and calculate refund amount
      const checkOutDate = dayjs(reservationData.checkOutDate);
      if (checkInDate.isAfter(currentDate)) {
        // Check-in date is in the future, indicating a reservation not yet booked in
        setRefundAmount(grandTotal);
      } else if (checkOutDate.isAfter(currentDate)) {
        setEarlyCheckout(true);
        const remainingDays = checkOutDate.diff(currentDate, "day");
        setRemainingDays(remainingDays);
        const refundAmount =
          remainingDays * parseFloat(reservationData.bookedRooms[0].roomPrice);
        setRefundAmount(refundAmount);
      } else {
        setEarlyCheckout(false);
        setRefundAmount(0);
      }
    }
  }, [dataSet]);

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
      nightSpent,
      additionalNotes: values.additionalNotes || "", // Include additional notes
    };

    console.log("Checkout payload:", payload);
    message.success("Check-out successful");
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
                      <td className="py-2">Number of nights:</td>
                      <td className="text-right"> {numberOfNights}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Price per night:</td>
                      <td className="text-right">{formatMoney(roomPrice)}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="py-2">Grand Total:</td>
                      <td className="text-right">{formatMoney(grandTotal)}</td>
                    </tr>

                    <tr className="border-b">
                      <td className="py-2">Amount Paid:</td>
                      <td className="text-right">{formatMoney(amountPaid)}</td>
                    </tr>
                    {balance !== 0 && (
                      <tr className="border-b">
                        <td className="py-2">Balance:</td>
                        <td className="text-right">{formatMoney(balance)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {earlyCheckout && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-yellow-800">
                    This is an early checkout. Because the number of days left
                    is {daysRemain}, guest is eligible for a refund of{" "}
                    {formatMoney(refundAmount)}.
                  </p>
                </div>
              )}

              {balance === 0 && (
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
