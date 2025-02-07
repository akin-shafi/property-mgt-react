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
          const billing = data.reservationDetails.billing[0];
          const roomDetails = data.reservationDetails.bookedRooms[0];

          setRoomName(roomDetails.roomName);
          setRoomPrice(Number.parseFloat(roomDetails.roomPrice));
          setNumberOfNights(reservationDetails.numberOfNights);
          setGrandTotal(Number.parseFloat(billing.grandTotal));

          const filteredData = {
            checkInDate: dayjs(reservationDetails.checkInDate),
            checkOutDate: dayjs(reservationDetails.checkOutDate),
            reservationType: reservationDetails.reservationType,
            reservationStatus: reservationDetails.reservationStatus,
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
                  </tbody>
                </table>
              </div>
              <form className="space-y-4" onSubmit={handleCheckout}>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Check-in Date
                    </label>
                    <input
                      type="text"
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Check-out Date
                    </label>
                    <input
                      type="text"
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Reservation Type
                    </label>
                    <input
                      type="text"
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Reservation Status
                    </label>
                    <select
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
                    >
                      <option value="CHECKED_IN">Checked In</option>
                      <option value="CHECKED_OUT">Checked Out</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full px-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      rows="4"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Complete Check-out
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
