"use client";

import { DonutChart } from "../../components/dashboard-analytics/donut-chart";
import { KPICard } from "../../components/dashboard-analytics/kpi-card";
import { RevenueChart } from "../../components/dashboard-analytics/revenue-chart";
import { OccupancyADRChart } from "../../components/dashboard-analytics/occupancy-chart";
import Layout from "../../components/utils/Layout";

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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // Sample data for charts
  const arrivalData = [
    { name: "Pending", value: 10, color: "#60A5FA" },
    { name: "Arrived", value: 8, color: "#34D399" },
  ];

  const checkoutData = [
    { name: "Pending", value: 8, color: "#60A5FA" },
    { name: "Checked Out", value: 2, color: "#047857" },
  ];

  const roomStatusData = [
    { name: "Available", value: 12, color: "#22c55e" },
    { name: "Occupied", value: 8, color: "#dc2626" },
    { name: "Out of Order", value: 2, color: "#6b7280" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <KPICard
            title="Occupancy (today)"
            value="64%"
            valueClassName="text-emerald-500"
          />
          <KPICard title="ADR (today)" value="₦ 1556.91" />

          <DonutChart title="Arrival" data={arrivalData} />

          <DonutChart title="Checkout" data={checkoutData} />
          <DonutChart title="Room Status" data={roomStatusData} />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm text-gray-600 mb-2">Available Rooms</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Executive</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span>Family Room</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </div>

          <DonutChart
            title="Revenue (today)"
            data={[
              { name: "Revenue", value: 75, color: "#0369a1" },
              { name: "Pending", value: 25, color: "#e5e7eb" },
            ]}
          />

          <KPICard
            title="Balance (Payments)"
            value="₦ 7814.92"
            valueClassName="text-emerald-500"
          />
          <RevenueChart />
        </div>

        {/* Bottom Row */}
        <div className="bg-white p-4 rounded-lg shadow">
          <OccupancyADRChart />
        </div>
      </div>
    </Layout>
  );
}
