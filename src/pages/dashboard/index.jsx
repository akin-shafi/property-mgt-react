/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { DonutChart } from "@/components/dashboard-analytics/donut-chart";
import { KPICard } from "@/components/dashboard-analytics/kpi-card";
import { PaymentCard } from "@/components/dashboard-analytics/payment-card";
import Layout from "@/components/utils/Layout";
import { fetchRoomMetrics, fetchDateBasedMetrics } from "@/hooks/useMetrics";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import RevenueChartComponent from "./RevenueChartComponent";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs"; // Ant Design uses dayjs for date handling

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

export default function Dashboard() {
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;

  const [metricsData, setMetricsData] = useState({});
  const [roomStatusData, setRoomStatusData] = useState([]);
  const [availableRoomsByType, setAvailableRoomsByType] = useState({});
  const [occupiedRoomsByType, setOccupiedRoomsByType] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to today's date

  // Fetch room metrics based on the selected date
  const fetchRoomData = async (date) => {
    try {
      const startDate = date.startOf("day").toISOString();
      const endDate = date.endOf("day").toISOString();
      const status = "available"; // Replace with actual status

      const data = await fetchRoomMetrics(
        token,
        hotelId,
        startDate,
        endDate,
        status
      );

      // Extract roomStatus and format it
      const roomStatus = data.roomStatus;
      const formattedRoomStatusData = [
        { name: "Available", value: roomStatus.available, color: "#22c55e" },
        { name: "Occupied", value: roomStatus.occupied, color: "#dc2626" },
        {
          name: "Out of Order",
          value: roomStatus.outOfOrder,
          color: "#6b7280",
        },
      ];
      setRoomStatusData(formattedRoomStatusData);

      // Extract available and occupied rooms from the nested structure
      setAvailableRoomsByType(data.availableRoomsByType.available || {});
      setOccupiedRoomsByType(data.availableRoomsByType.occupied || {});
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics based on the selected date
  const fetchMetricsData = async (date) => {
    try {
      const data = await fetchDateBasedMetrics(token, hotelId, date.toDate());
      setMetricsData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when the component mounts or the date changes
  useEffect(() => {
    fetchRoomData(selectedDate);
    fetchMetricsData(selectedDate);
  }, [token, hotelId, selectedDate]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle "Find" button click
  const handleFindClick = () => {
    setLoading(true);
    fetchRoomData(selectedDate);
    fetchMetricsData(selectedDate);
  };

  // Sample data for charts
  const reservationStatusData = [
    {
      name: "Awaiting Arrival",
      value: metricsData?.countReservationsByStatus?.pendingArrivalCount,
      color: "#60A5FA",
    },
    {
      name: "Due Out",
      value: metricsData?.dueOutReservations?.length,
      color: "#047857",
    },
  ];

  const revenueData = {
    deposit: metricsData?.adrData?.totalRevenue,
    balance: metricsData?.totalOutstandingBalance,
  };

  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Date Picker and Find Button */}
        <div className="flex items-center gap-4 mb-6">
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            allowClear={false}
          />
          <Button type="primary" onClick={handleFindClick}>
            Find
          </Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <KPICard
                title="Occupancy (today)"
                value={`${metricsData?.occupancyPercentage}%`}
                valueClassName="text-emerald-500"
              />
              <PaymentCard
                title="Revenue (Status)"
                value={revenueData}
                valueClassName="text-emerald-500"
              />
              <DonutChart
                title="Revenue (today)"
                data={[
                  { name: "Revenue", value: 75, color: "#0369a1" },
                  { name: "Pending", value: 25, color: "#e5e7eb" },
                ]}
              />
              <KPICard
                title="Average Daily Revenue (today)"
                // value={metricsData?.adrData?.adr}
                value={currencyFormatter.format(metricsData?.adrData?.adr)}
              />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-sm text-gray-600 mb-2">Available Rooms</h2>
                <div className="space-y-2">
                  {Object.entries(availableRoomsByType).map(([type, count]) => (
                    <div className="flex justify-between" key={type}>
                      <span>{type}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-sm text-gray-600 mb-2">Occupied Rooms</h2>
                <div className="space-y-2">
                  {Object.entries(occupiedRoomsByType).map(([type, count]) => (
                    <div className="flex justify-between" key={type}>
                      <span>{type}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <DonutChart
                title="Reservation Status"
                data={reservationStatusData}
              />
              <DonutChart title="Room Status" data={roomStatusData} />
            </div>

            {/* Bottom Row */}
            <RevenueChartComponent />
          </>
        )}
      </div>
    </Layout>
  );
}
