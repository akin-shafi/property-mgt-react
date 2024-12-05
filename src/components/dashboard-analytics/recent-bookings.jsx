import { Avatar, AvatarFallback, AvatarImage } from "../ui/AvatarComponent";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/CardComponent";

const recentBookings = [
  {
    id: 1,
    name: "John Doe",
    room: "101",
    checkIn: "2023-07-01",
    checkOut: "2023-07-05",
  },
  {
    id: 2,
    name: "Jane Smith",
    room: "202",
    checkIn: "2023-07-02",
    checkOut: "2023-07-07",
  },
  {
    id: 3,
    name: "Bob Johnson",
    room: "303",
    checkIn: "2023-07-03",
    checkOut: "2023-07-06",
  },
];

export function RecentBookings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/avatars/${booking.id}.png`} alt="Avatar" />
                <AvatarFallback>
                  {booking.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {booking.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Room {booking.room} • {booking.checkIn} to {booking.checkOut}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
