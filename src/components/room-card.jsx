import { useState } from "react";
import { Modal } from "antd";

export function RoomCard({ number, guest, status, reservations }) {
  console.log("status", guest);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const statusStyles = {
    available: "bg-gray-700",
    pending_arrival: "bg-yellow-600",
    check_in: "bg-green-500",
    check_out: "bg-red-600",
    // occupied: "bg-green-600",
    // maintenance: "bg-red-600",
    // "out-of-order": "bg-gray-400",
    // "checking-out": "bg-pink-100",

    // "due-out": "bg-orange-600",
    // booking: "bg-indigo-600",
    // request_cancellation: "bg-gray-600",
    // cancelled: "bg-black",
  };

  // { label: "Pending Arrival", color: "bg-yellow-600" },
  // { label: "Check-in", color: "bg-green-500" },
  // { label: "Check-out", color: "bg-red-600" },

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="custom-card border" onClick={handleOpenModal}>
        <div className={`custom-card-header bg-gray-100`}>
          <span className="custom-card-number">{number}</span>
          <div className="custom-card-icons">
            <span className="custom-icon-lightning">⚡</span>
            <span className="custom-icon-sparkles">✨</span>
          </div>
        </div>
        <div
          className={`custom-card-footer  ${statusStyles[status]} text-white`}
        >
          {/* {guest}{" "} */}
          {status
            .replace("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}
        </div>
      </div>

      <Modal
        title={`Room ${number} Reservations`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {reservations.length > 0 ? (
          <ul>
            {reservations.map((reservation, index) => (
              <li key={index} className="mb-2">
                <div>Name: {reservation.name}</div>
                <div>Dates: {reservation.dates}</div>
                <div>Status: {reservation.status}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No reservations found for this room.</div>
        )}
      </Modal>
    </>
  );
}
