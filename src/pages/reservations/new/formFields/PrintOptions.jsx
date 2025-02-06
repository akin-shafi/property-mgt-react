/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";

const PrintOptions = ({ onChange }) => {
  const [options, setOptions] = useState({
    // printGuestCard: false,
    // suppressRate: false,
    // printFolio: false,
    printInvoice: true,
  });

  useEffect(() => {
    if (onChange) {
      onChange("printOptions", options);
    }
  }, [options]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setOptions((prevOptions) => ({ ...prevOptions, [name]: checked }));
  };

  return (
    <div className="flex justify-between w-[70%]">
      {Object.keys(options).map((key) => (
        <div key={key}>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={key}
              checked={options[key]}
              onChange={handleChange}
              className="accent-appOrange rounded border-gray-300 text-blue-600 shadow-sm focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            />
            <span>
              {key === "printFolio" ? "Print Folio" : "Print Invoice"}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default PrintOptions;
