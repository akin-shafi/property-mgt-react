"use client";

import { Plus, DollarSign } from "lucide-react";
import { DateNavigation } from "@/components/date-picker";
import { StatusLegend } from "@/components/status-legend";
import { RoomSection } from "@/components/room-section";
import { StatusCounter } from "@/components/status-counter";
import Layout from "@/components/utils/Layout";
// import { fetchHotelRoomsWithPrice } from "../../hooks/useAction";
// import { useSession } from "../../hooks/useSession";

const executiveRooms = [
  { number: "101", guest: "Milan Pal", status: "occupied" },
  { number: "102", guest: "Rashmi B", status: "occupied" },
  { number: "103", status: "out-of-order" },
  { number: "104", status: "out-of-order" },
  { number: "106", status: "maintenance" },
  { number: "107", guest: "Milan Pal", status: "occupied" },
  { number: "201", guest: "Madhuri V", status: "occupied" },
  { number: "202", status: "checking-out" },
  // Add more rooms as needed
];

const familyRooms = [
  { number: "105", status: "out-of-order" },
  { number: "205", guest: "S Akshayaa", status: "checking-out" },
  { number: "305", status: "maintenance" },
  { number: "405", guest: "Meena Ravi", status: "occupied" },
];

export default function RoomsView() {
  // const { session } = useSession();
  // const token = session.token;
  // const hotelId = session?.user?.hotelId;
  // const [hotelRooms, setHotelRooms] = useState([]);

  // useEffect(() => {
  //   const fetchRoomData = async () => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const hotelData = await fetchHotelRoomsWithPrice(hotelId, token);
  //       // console.log("hotelData:--", hotelData);
  //       const formattedRooms = hotelData.map((room) => ({
  //         id: room.roomName,
  //         name: `Room ${room.roomName}`,
  //         status: room.maintenanceStatus,
  //         capacity: room.capacity,
  //         availability: room.isAvailable,
  //       }));

  //       setHotelRooms(formattedRooms);
  //     } catch (err) {
  //       setError(err.message || "Failed to fetch room data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (hotelId && token) {
  //     fetchRoomData();
  //   }
  // }, [hotelId, token]);
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Rooms View</h1>
            <div className="flex gap-4">
              <StatusCounter
                label="Occupied"
                count={29}
                color="text-green-600"
              />
              <StatusCounter
                label="Available"
                count={41}
                color="text-green-600"
              />
              <StatusCounter
                label="Complimentary"
                count={0}
                color="text-blue-600"
              />
              <StatusCounter
                label="Maintenance"
                count={3}
                color="text-red-600"
              />
            </div>
          </div>

          <StatusLegend />

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                <Plus className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                <DollarSign className="w-5 h-5" />
              </button>
            </div>
            <DateNavigation />
          </div>
        </div>

        <RoomSection
          title="Executive"
          stats={{
            occupied: 26,
            available: 22,
            complimentary: 0,
            maintenance: 2,
          }}
          rooms={executiveRooms}
        />

        <RoomSection
          title="Family Room"
          stats={{
            occupied: 3,
            available: 1,
            complimentary: 0,
            maintenance: 1,
          }}
          rooms={familyRooms}
        />
      </div>
    </Layout>
  );
}
