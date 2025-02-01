export function RoomCard({ number, guest, status, onClick }) {
  const statusStyles = {
    available: "bg-white",
    occupied: "bg-green-600",
    maintenance: "bg-red-600",
    "out-of-order": "bg-gray-400",
    "checking-out": "bg-pink-100",
  };

  return (
    <div className="custom-card" onClick={onClick}>
      <div className={`custom-card-header ${statusStyles[status]}`}>
        <span className="custom-card-number">{number}</span>
        <div className="custom-card-icons">
          <span className="custom-icon-lightning">⚡</span>
          <span className="custom-icon-sparkles">✨</span>
        </div>
      </div>
      <div className="custom-card-footer">{guest}</div>
    </div>
  );
}
