import React from "react";

export function Select({ children, className, ...props }) {
  return (
    <select
      className={`w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children }) {
  return <div className="relative">{children}</div>;
}

export function SelectContent({ children }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      {children}
    </div>
  );
}

export function SelectItem({ children, value }) {
  return (
    <option
      value={value}
      className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
    >
      {children}
    </option>
  );
}

export function SelectValue({ placeholder }) {
  return <div className="text-gray-500">{placeholder}</div>;
}
