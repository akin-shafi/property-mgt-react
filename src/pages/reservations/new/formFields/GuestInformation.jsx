"use client";
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const GuestForm = ({ handleFormChange }) => {
  const [guests, setGuests] = useState([
    {
      id: 1,
      idProof: null,
      guestName: "",
      mobile: "",
      email: "",
      address: "",
      country: "India",
      state: "",
      city: "",
      zip: "",
    },
  ]);

  const updateGuests = (updatedGuests) => {
    setGuests(updatedGuests);
    handleFormChange({ guests: updatedGuests });
  };

  const handleChange = (id, field, value) => {
    const updatedGuests = guests.map((guest) =>
      guest.id === id ? { ...guest, [field]: value } : guest
    );
    updateGuests(updatedGuests);
  };

  const handleFileUpload = (event, id) => {
    const file = event.target.files[0];
    handleChange(id, "idProof", file ? file.name : null);
  };

  const triggerFileInput = (id) => {
    document.getElementById(`file-input-${id}`).click();
  };

  const addGuest = () => {
    const newGuest = {
      id: guests.length + 1,
      idProof: null,
      guestName: "",
      mobile: "",
      email: "",
      address: "",
      country: "India",
      state: "",
      city: "",
      zip: "",
    };
    updateGuests([...guests, newGuest]);
  };

  const removeGuest = (id) => {
    const updatedGuests = guests.filter((guest) => guest.id !== id);
    updateGuests(updatedGuests);
  };

  return (
    <div className="mt-3 space-y-4">
      {guests.map((guest, index) => (
        <div
          key={guest.id}
          className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2 relative"
        >
          <h3 className="text-lg font-medium">Guest {index + 1}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div>
              <label className="block font-medium mb-1">Guest Name</label>
              <div className="flex items-center space-x-1">
                <select
                  className="border border-gray-300 rounded-md p-2 w-16"
                  value={guest.title || "Mr."}
                  onChange={(e) =>
                    handleChange(guest.id, "title", e.target.value)
                  }
                >
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Mrs.</option>
                </select>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border border-gray-300 rounded-md p-2 flex-1"
                  value={guest.guestName}
                  onChange={(e) =>
                    handleChange(guest.id, "guestName", e.target.value)
                  }
                />
                <button
                  onClick={() => triggerFileInput(guest.id)}
                  title="Upload identity card"
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
            <div>
              <label className="block font-medium mb-1">Mobile</label>
              <input
                type="text"
                placeholder="Mobile"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.mobile}
                onChange={(e) =>
                  handleChange(guest.id, "mobile", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.email}
                onChange={(e) =>
                  handleChange(guest.id, "email", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Address"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.address}
                onChange={(e) =>
                  handleChange(guest.id, "address", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Country</label>
              <select
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.country}
                onChange={(e) =>
                  handleChange(guest.id, "country", e.target.value)
                }
              >
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
                value={guest.state}
                onChange={(e) =>
                  handleChange(guest.id, "state", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">City</label>
              <input
                type="text"
                placeholder="City"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.city}
                onChange={(e) => handleChange(guest.id, "city", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Zip</label>
              <input
                type="text"
                placeholder="Zip"
                className="border border-gray-300 rounded-md p-2 w-full"
                value={guest.zip}
                onChange={(e) => handleChange(guest.id, "zip", e.target.value)}
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
