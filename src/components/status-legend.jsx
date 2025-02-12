const statuses = [
  { label: "Pending Arrival", color: "bg-pink-100" },
  { label: "Check-in", color: "bg-green-500" },
  { label: "Check-out", color: "bg-red-200" },
  { label: "Due-out", color: "bg-gray-300" },
  { label: "Booking", color: "bg-yellow-100" },
  { label: "Request Cancellation", color: "bg-gray-600" },
  { label: "Cancelled", color: "bg-black" },
];

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-4">
      {statuses.map((status) => (
        <div key={status.label} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded ${status.color}`} />
          <span className="text-sm text-gray-600">{status.label}</span>
        </div>
      ))}
    </div>
  );
}
