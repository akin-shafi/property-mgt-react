const statuses = [
  { label: "Assigned", color: "bg-pink-100" },
  { label: "Checked-in", color: "bg-green-500" },
  { label: "Checking out", color: "bg-red-200" },
  { label: "Maintenance", color: "bg-gray-300" },
  { label: "Complimentary", color: "bg-yellow-100" },
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
