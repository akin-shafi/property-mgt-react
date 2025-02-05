export function Button({
  loading,
  children,
  className,
  size = "md",
  variant = "filled",
  ...props
}) {
  const variantClass =
    variant === "outline"
      ? "border-2 border-blue-500 text-blue-500"
      : "bg-blue-500 text-white";

  const sizeClass = size === "icon" ? "h-12 w-12" : "py-2 px-4";
  return (
    <button
      {...props}
      // Convert `loading` to a string or omit it if false
      loading={loading ? "true" : undefined}
      className={`rounded-lg font-semibold ${sizeClass} ${variantClass} hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
