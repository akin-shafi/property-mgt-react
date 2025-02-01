import { RoomCard } from "./room-card";
import { StatusCounter } from "./status-counter";

export function RoomSection({ title, stats, rooms }) {
  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button className="text-gray-400">▼</button>
        </div>
        <div className="flex gap-6">
          <StatusCounter
            label="Occupied"
            count={stats.occupied}
            color="text-green-600"
          />
          <StatusCounter
            label="Available"
            count={stats.available}
            color="text-green-600"
          />
          <StatusCounter
            label="Complimentary"
            count={stats.complimentary}
            color="text-blue-600"
          />
          <StatusCounter
            label="Maintenance"
            count={stats.maintenance}
            color="text-red-600"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.number}
            number={room.number}
            guest={room.guest}
            status={room.status}
          />
        ))}
      </div>
    </div>
  );
}
