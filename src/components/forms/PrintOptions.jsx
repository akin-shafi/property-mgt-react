import { useState } from "react";

const PrintOptions = () => {
  const [options, setOptions] = useState({
    printGuestCard: false,
    suppressRate: false,
    printFolio: false,
    printReceipt: false,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setOptions((prevOptions) => ({ ...prevOptions, [name]: checked }));
  };

  return (
    // <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-[70%]">
    <div className="flex justify-between w-[70%]">
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="printGuestCard"
            checked={options.printGuestCard}
            onChange={handleChange}
            className="accent-appOrange rounded border-gray-300 text-blue-600 shadow-sm focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          />
          <span>Print Guest Registration Card</span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="suppressRate"
            checked={options.suppressRate}
            onChange={handleChange}
            className="accent-appOrange rounded border-gray-300 text-blue-600 shadow-sm focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          />
          <span>Suppress Rate on Registration Card</span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="printFolio"
            checked={options.printFolio}
            onChange={handleChange}
            className="accent-appOrange rounded border-gray-300 text-blue-600 shadow-sm focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          />
          <span>Print Folio</span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="printReceipt"
            checked={options.printReceipt}
            onChange={handleChange}
            className="accent-appOrange rounded border-gray-300 text-blue-600 shadow-sm focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          />
          <span>Print Receipt</span>
        </label>
      </div>
    </div>
  );
};

export default PrintOptions;
