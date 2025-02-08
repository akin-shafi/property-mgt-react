/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Drawer, Button, Form, Input, Spin, message } from "antd";

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
  const [balance, setBalance] = useState("0.00");
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
        setAmountPaid(parseFloat(reservationData.billing[0].amountPaid));
        setBalance(reservationData.billing[0].balance);
        setGrandTotal(parseFloat(reservationData.billing[0].grandTotal));
      }
    }
  }, [dataSet]);

  const handleCheckout = async (values) => {
    if (parseFloat(values.amountPaid) !== parseFloat(balance)) {
      message.error("The amount entered does not match the balance left");
      return;
    }

    console.log("Checkout values:", values);
    message.success("Check-out successful");
    onClose();
  };

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      title={showPageTitle}
      width="30%"
      className="rounded-md custom-drawer"
      maskClosable={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col p-2 gap-6">
          {loading ? (
            <Spin size="large" />
          ) : (
            <>
              <div className="reservation-info">
                <h2 className="text-xl font-bold mb-4">Reservation Details</h2>

                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Room:</td>
                      <td className="text-right">{roomName}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Price per night:</td>
                      <td className="text-right">NGN {roomPrice.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Number of nights:</td>
                      <td className="text-right"> {numberOfNights}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Grand Total:</td>
                      <td className="text-right">
                        NGN {grandTotal.toFixed(2)}
                      </td>
                    </tr>
                    {reservationDetails && (
                      <tr className="border-b">
                        <td className="py-2">Check-in/out:</td>
                        <td className="text-right">
                          {reservationDetails.checkInDate} -{" "}
                          {reservationDetails.checkOutDate}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2">Amount Paid:</td>
                      <td className="text-right">NGN {amountPaid}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Balance:</td>
                      <td className="text-right">NGN {balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {balance !== "0.00" && (
                <p>
                  Guest has an outstanding balance. Please process before
                  checkout.
                </p>
              )}

              {balance === "0.00" && (
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
