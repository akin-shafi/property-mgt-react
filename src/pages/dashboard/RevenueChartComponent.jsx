import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { RevenueChart } from "@/components/dashboard-analytics/revenue-chart";
import { OccupancyADRChart } from "@/components/dashboard-analytics/occupancy-chart";
import { fetchYearBasedMetrics } from "@/hooks/useMetrics";

function RevenueChartComponent() {
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;

  const [yearlyMetrics, setYearlyMetrics] = useState({
    yearlyRevenue: [],
    yearlyOccupancyAndADR: {
      monthlyOccupancy: [],
      monthlyADR: [],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch yearly metrics data
  useEffect(() => {
    const fetchYearlyData = async () => {
      try {
        const currentYear = new Date().getFullYear(); // Get the current year
        const data = await fetchYearBasedMetrics(token, hotelId, currentYear);

        // Update state with fetched data
        setYearlyMetrics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token && hotelId) {
      fetchYearlyData();
    }
  }, [token, hotelId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow flex">
        <div className="flex-1 p-2">
          {/* Pass yearlyRevenue data to RevenueChart */}
          <RevenueChart yearlyRevenue={yearlyMetrics.yearlyRevenue} />
        </div>
        <div className="flex-1 p-2">
          {/* Pass yearlyOccupancyAndADR data to OccupancyADRChart */}
          <OccupancyADRChart
            monthlyOccupancy={
              yearlyMetrics.yearlyOccupancyAndADR.monthlyOccupancy
            }
            monthlyADR={yearlyMetrics.yearlyOccupancyAndADR.monthlyADR}
          />
        </div>
      </div>
    </>
  );
}

export default RevenueChartComponent;
