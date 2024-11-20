import React from "react";

export function Checkbox({ id, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      className="form-checkbox text-[#208D8E] border-gray-300 rounded focus:ring-[#208D8E]"
      {...props}
    />
  );
}
