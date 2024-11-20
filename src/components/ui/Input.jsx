import React from "react";

export function Input({ id, type = "text", className, ...props }) {
  return (
    <input
      id={id}
      type={type}
      className={`w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
