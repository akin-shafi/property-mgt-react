/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState } from "react";
import { Select, Input, Radio } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

const { Option } = Select;

const GuestForm = ({ onChange }) => {
  const [guestDetails, setGuests] = useState([
    {
      id: 1,
      idProof: null,
      fullName: "",
      phone: "",
      email: "",
      address: "",
      identityType: null,
      identityNumber: "",
      nationality: null,
      gender: null,
    },
  ]);

  const updateGuests = (updatedGuests) => {
    setGuests(updatedGuests);
    if (onChange) {
      onChange("guestDetails", updatedGuests);
    }
  };

  const handleChange = (id, field, value) => {
    const updatedGuests = guestDetails.map((guest) =>
      guest.id === id ? { ...guest, [field]: value } : guest
    );
    updateGuests(updatedGuests);
  };

  const handleFileUpload = (event, id) => {
    const file = event.target.files[0];
    handleChange(id, "idProof", file ? file.name : null);
    event.target.value = null; // Reset file input value to allow re-upload
  };

  const handleRemoveFile = (id) => {
    handleChange(id, "idProof", null);
  };

  const triggerFileInput = (id) => {
    document.getElementById(`file-input-${id}`).click();
  };

  const addGuest = () => {
    const newGuest = {
      id: guestDetails.length + 1,
      idProof: null,
      fullName: "",
      phone: "",
      email: "",
      address: "",
      identityType: null,
      identityNumber: "",
      nationality: null,
      gender: null,
    };
    updateGuests([...guestDetails, newGuest]);
  };

  const removeGuest = (id) => {
    const updatedGuests = guestDetails.filter((guest) => guest.id !== id);
    updateGuests(updatedGuests);
  };

  return (
    <div className="mt-3 space-y-4">
      {guestDetails.map((guest, index) => (
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
                  value={guest.fullName}
                  onChange={(e) =>
                    handleChange(guest.id, "fullName", e.target.value)
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
                  key={guest.idProof} // Add key to force re-render
                  id={`file-input-${guest.id}`}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, guest.id)}
                />
              </div>
              {guest.idProof && (
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <p>Uploaded: {guest.idProof}</p>
                  <RiDeleteBin5Line
                    className="ml-2 text-red-500 cursor-pointer"
                    onClick={() => handleRemoveFile(guest.id)}
                    title="Remove file"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium mb-1">phone</label>
                <Input
                  placeholder="phone"
                  value={guest.phone}
                  onChange={(e) =>
                    handleChange(guest.id, "phone", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <Input
                  placeholder="Email"
                  value={guest.email}
                  onChange={(e) =>
                    handleChange(guest.id, "email", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="w-full">
              <div>
                <label className="block font-medium mb-1">Gender</label>
                <Radio.Group
                  value={guest.gender}
                  onChange={(e) =>
                    handleChange(guest.id, "gender", e.target.value)
                  }
                >
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </div>
              <div className="mt-4">
                <label className="block font-medium mb-1">Address</label>
                <Input
                  placeholder="Address"
                  value={guest.address}
                  onChange={(e) =>
                    handleChange(guest.id, "address", e.target.value)
                  }
                />
              </div>

              {guest.idProof && (
                <>
                  <div>
                    <label className="block font-medium mb-1">
                      Identity Number
                    </label>
                    <Input
                      placeholder="Enter Identity Number"
                      value={guest.identityNumber}
                      onChange={(e) =>
                        handleChange(guest.id, "identityNumber", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Identity Type
                    </label>
                    <Select
                      className="w-full"
                      placeholder="Select Identity Type"
                      value={guest.identityType}
                      onChange={(value) =>
                        handleChange(guest.id, "identityType", value)
                      }
                    >
                      <Option value="passport">Passport</Option>
                      <Option value="driving">Driving License</Option>
                      <Option value="national">National ID</Option>
                    </Select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Nationality
                    </label>
                    <Select
                      className="w-full"
                      placeholder="Select Nationality"
                      value={guest.nationality}
                      onChange={(value) =>
                        handleChange(guest.id, "nationality", value)
                      }
                    >
                      <Option value="us">American</Option>
                      <Option value="uk">British</Option>
                      <Option value="ca">Canadian</Option>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>
          {guestDetails.length > 1 && (
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
        className="hidden w-full flex items-center justify-end gap-2 text-appGreen cursor-pointer text-[14px]"
        onClick={addGuest}
      >
        <FaPlusCircle />
        <span className="mt-1">Add More Guest</span>
      </div>
    </div>
  );
};

export default GuestForm;
