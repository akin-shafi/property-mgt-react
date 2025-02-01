export function StatusCounter({ label, count, color }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm">{label}:</span>
      <span className={`${color} text-sm`}>{count}</span>
    </div>
  );
}
