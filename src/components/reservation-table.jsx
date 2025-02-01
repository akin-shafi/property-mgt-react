"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Edit2, FileText, Trash2 } from "lucide-react";

const sampleData = [
  {
    bookingId: "OCT171170436",
    customerName: "Raju K",
    bookedOn: "29, Mar, 2024, 2:56 PM",
    checkIn: "Mar 29, 24",
    checkOut: "Mar 30, 24",
    source: "Aiosell BE",
    guests: 2,
    rooms: 1,
    nights: 1,
    amount: 2106.72,
    paymentMode: "Postpaid",
    mealPlan: "EP",
    status: "Unassigned",
  },
  // Add more sample data as needed
];

export default function ReservationTable() {
  const [startDate, setStartDate] =
    (useState < Date) | (null > new Date("2024-03-23"));
  const [endDate, setEndDate] =
    (useState < Date) | (null > new Date("2024-03-29"));
  const [showCancelled, setShowCancelled] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Reservation Data</h1>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Create Reservation
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Complimentary
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Out Of Order
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Groups
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">From Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="dd-MM-yyyy"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">To Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="w-full p-2 border rounded"
                dateFormat="dd-MM-yyyy"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Filter Options:</label>
              <select className="w-full p-2 border rounded">
                <option>Booking Date</option>
                <option>Check-in Date</option>
                <option>Check-out Date</option>
              </select>
            </div>
            <div className="flex items-end gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Submit
              </button>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cancelled"
                  checked={showCancelled}
                  onChange={(e) => setShowCancelled(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="cancelled" className="text-sm">
                  Cancelled bookings
                </label>
              </div>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 border rounded w-64"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Download
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Customer Name</th>
                <th className="p-3 text-left">Booked On</th>
                <th className="p-3 text-left">Check-In</th>
                <th className="p-3 text-left">Check-Out</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Guests</th>
                <th className="p-3 text-left">Rooms</th>
                <th className="p-3 text-left">Nights</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Payment Mode</th>
                <th className="p-3 text-left">MealPlan</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((reservation) => (
                <tr
                  key={reservation.bookingId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 text-blue-500">{reservation.bookingId}</td>
                  <td className="p-3">{reservation.customerName}</td>
                  <td className="p-3">{reservation.bookedOn}</td>
                  <td className="p-3">{reservation.checkIn}</td>
                  <td className="p-3">{reservation.checkOut}</td>
                  <td className="p-3">{reservation.source}</td>
                  <td className="p-3">{reservation.guests}</td>
                  <td className="p-3">{reservation.rooms}</td>
                  <td className="p-3">{reservation.nights}</td>
                  <td className="p-3">₹{reservation.amount.toFixed(2)}</td>
                  <td className="p-3">{reservation.paymentMode}</td>
                  <td className="p-3">{reservation.mealPlan}</td>
                  <td className="p-3">{reservation.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit2 size={16} />
                      </button>
                      <button className="text-blue-500 hover:text-blue-700">
                        <FileText size={16} />
                      </button>
                      <button className="text-blue-500 hover:text-blue-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
