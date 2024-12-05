import ReservationLayout from "../../components/utils/ReservationLayout";
// import { Header } from "../../components/header";
import { RecentBookings } from "../../components/dashboard-analytics/recent-bookings";
import { ReservationChart } from "../../components/dashboard-analytics/reservation-chart";
import { StatCard } from "../../components/dashboard-analytics/stat-card";
import { SummaryStatistics } from "../../components/dashboard-analytics/summary-statistics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/CardComponent";
import { Bed, CalendarRange, DollarSign, Users } from "lucide-react";

export default function Dashoard() {
  return (
    <>
      <ReservationLayout>
        <div className="w-full grid grid-rows-[10%_1fr] md:px-6 px-2 py-5">
          <main className="flex-1">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Reservations"
                value="1,234"
                icon={
                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                }
              />
              <StatCard
                title="Available Rooms"
                value="42"
                icon={<Bed className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Total Revenue"
                value="$12,345"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />
              <StatCard
                title="Total Guests"
                value="2,345"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReservationChart />
                </CardContent>
              </Card>
              <RecentBookings />
            </div>
            <div className="mt-6">
              <SummaryStatistics />
            </div>
          </main>
        </div>
      </ReservationLayout>
    </>
  );
}
