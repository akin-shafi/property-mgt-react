import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const GuestForm = () => {
  const [guests, setGuests] = useState([{ id: 1, idProof: null }]);

  const addGuest = () => {
    setGuests([...guests, { id: guests.length + 1, idProof: null }]);
  };

  const removeGuest = (id) => {
    setGuests(guests.filter((guest) => guest.id !== id));
  };

  const handleFileUpload = (event, id) => {
    const file = event.target.files[0];
    setGuests(
      guests.map((guest) =>
        guest.id === id ? { ...guest, idProof: file.name } : guest
      )
    );
  };

  const triggerFileInput = (id) => {
    document.getElementById(`file-input-${id}`).click();
  };

  return (
    <div className="mt-3 space-y-4">
      {guests.map((guest, index) => (
        <div
          key={guest.id}
          className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2 relative"
        >
          <h3 className="text-lg font-medium">Guest {index + 1}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Guest Name</label>
              <div className="flex items-center space-x-1">
                <select className="border border-gray-300 rounded-md p-2 w-16">
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Mrs.</option>
                </select>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md p-2 flex-1"
                />
                {/* <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md">
                  📷
                </button> */}
                <button
                  onClick={() => triggerFileInput(guest.id)}
                  title="upload identity card"
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  🆔
                </button>
                <input
                  id={`file-input-${guest.id}`}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, guest.id)}
                />
              </div>
              {guest.idProof && (
                <p className="text-sm text-gray-600 mt-1">
                  Uploaded: {guest.idProof}
                </p>
              )}
            </div>
            <div className="">
              <label className="block font-medium mb-1">Mobile</label>
              <input
                type="text"
                placeholder="Mobile"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Address"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Country</label>
              <select className="border border-gray-300 rounded-md p-2 w-full">
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
                <option>Australia</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">State</label>
              <input
                type="text"
                placeholder="State"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Zip</label>
              <input
                type="text"
                placeholder="Zip"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          {guests.length > 1 && (
            <div className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              <div
                className="flex items-center text-gray-500 hover:text-red-500 cursor-pointer"
                onClick={() => removeGuest(guest.id)}
              >
                <RiDeleteBin5Line title="Remove" className="mr-2 text-lg" />
                <span className="text-sm font-medium">Remove</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* <button
        onClick={addGuest}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add More Guest
      </button> */}

      <div
        className="w-full flex items-center justify-end gap-2 text-appGreen cursor-pointer text-[14px]"
        onClick={addGuest}
      >
        <FaPlusCircle />
        <span className="mt-1">Add More Guest</span>
      </div>
    </div>
  );
};

export default GuestForm;
