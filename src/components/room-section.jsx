import { RoomCard } from "./room-card";
import { StatusCounter } from "./status-counter";

export function RoomSection({
  title,
  stats,
  rooms,
  reservations,
  isOpen,
  toggleClick,
}) {
  const getRoomReservations = (roomNumber) => {
    return reservations.filter((reservation) =>
      reservation.rooms.some((room) => room.roomName === roomNumber)
    );
  };

  const getActivityForRoom = (roomNumber) => {
    const reservation = reservations.find((reservation) =>
      reservation.rooms.some((room) => room.roomName === roomNumber)
    );
    return reservation ? reservation.activity : "available"; // Default to 'available' if no reservation found
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-6">
      <div
        className="flex justify-between items-center mb-4"
        onClick={() => toggleClick(title)}
      >
        <div className="flex items-center gap-2 cursor-pointer">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className={`text-gray-400 transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </button>
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
      {isOpen && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {rooms.map((room) => {
            const roomReservations = getRoomReservations(room.number);
            const activity = getActivityForRoom(room.number);
            return (
              <RoomCard
                key={room.number}
                number={room.number}
                guest={room.guest}
                status={activity} // Use activity for status
                reservations={roomReservations}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
