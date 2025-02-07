/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  message,
} from "antd";
import { fetchReservationById } from "@/hooks/useReservation";
import dayjs from "dayjs";

export default function ModalDrawer({
  open,
  onClose,
  pageTitle,
  resourceId,
  token,
}) {
  const showPageTitle = pageTitle ?? "Check-out";
  const [form] = Form.useForm();
  const [reservationDetails, setReservationDetails] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalance] = useState("0.00");
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      if (open && resourceId) {
        setLoading(true);
        try {
          const data = await fetchReservationById(resourceId, token);
          const reservationDetails = data.reservationDetails;
          const billingDetails = data.reservationDetails.billing[0];
          const roomDetails = data.reservationDetails.bookedRooms[0];

          setAmountPaid(billingDetails.amountPaid || "N/A");
          setBalance(billingDetails.balance || "N/A");
          setRoomName(roomDetails.roomName);
          setRoomPrice(Number.parseFloat(roomDetails.roomPrice));
          setNumberOfNights(reservationDetails.numberOfNights);
          setGrandTotal(Number.parseFloat(billingDetails.grandTotal));

          const filteredData = {
            checkInDate: dayjs(reservationDetails.checkInDate).format(
              "MMM DD, YYYY"
            ),
            checkOutDate: dayjs(reservationDetails.checkOutDate).format(
              "MMM DD, YYYY"
            ),
            reservationType: reservationDetails.reservationType,
            reservationStatus: reservationDetails.reservationStatus,
            additionalNotes: reservationDetails.additionalNotes || "",
          };

          setReservationDetails(filteredData);
          form.setFieldsValue(filteredData);
        } catch (err) {
          console.log(err, "Failed to fetch reservation data");
          message.error("Failed to fetch reservation data");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReservationDetails();
  }, [open, resourceId, token, form]);

  const handleCheckout = async (values) => {
    if (parseFloat(values.amountPaid) !== parseFloat(balance)) {
      message.error("The amount entered does not match the balance left");
      return;
    }

    console.log("Checkout values:", values);
    // Implement the checkout logic here
    // You can make an API call to update the reservation status
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
      styles={{ body: { padding: 0 } }}
      maskClosable={false}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col p-6 gap-6">
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
                      <>
                        <tr className="border-b">
                          <td className="py-2">Check-in Date:</td>
                          <td className="text-right">
                            {reservationDetails.checkInDate}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Check-out Date:</td>
                          <td className="text-right">
                            {reservationDetails.checkOutDate}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Reservation Type:</td>
                          <td className="text-right">
                            {reservationDetails.reservationType}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Reservation Status:</td>
                          <td className="text-right">
                            {reservationDetails.reservationStatus}
                          </td>
                        </tr>
                      </>
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

              <Form form={form} onFinish={handleCheckout}>
                {balance !== "0.00" && (
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full px-2">
                      <Form.Item
                        name="amountPaid"
                        label="Amount Paid"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the amount paid",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full px-2">
                      <Form.Item
                        name="paymentMode"
                        label="Payment Mode"
                        rules={[
                          {
                            required: true,
                            message: "Please select the payment mode",
                          },
                        ]}
                      >
                        <Select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                          <Select.Option value="cash">Cash</Select.Option>
                          <Select.Option value="card">Card</Select.Option>
                          <Select.Option value="transfer">
                            Transfer
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full px-2">
                    <Form.Item name="additionalNotes" label="Additional Notes">
                      <Input.TextArea
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Complete Check-out
                  </Button>
                </div>
              </Form>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
