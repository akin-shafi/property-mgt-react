"use client";
import { useState, useEffect } from "react";
import { Button, Tabs, Card, message } from "antd";
import { useSession } from "@/hooks/useSession";
import OtherInformation from "./formFields/OtherInformation";
import BillingInformation from "./formFields/BillingInformation";
import PrintOptions from "./formFields/PrintOptions";
// import GuestInformation from "./formFields/GuestInformation";
import GuestInformation from "./formFields/GuestForm";
import StayInformation from "./formFields/StayInformation";

export const ReservationForm = ({ startDate, endDate, roomName }) => {
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;
  const [form] = useState({}); // Placeholder to match the original code structure

  const [formData, setFormData] = useState({
    stayInformation: {
      checkIn: startDate,
      checkOut: endDate,
      roomName: roomName,
      nights: 0,
      rooms: [],
    },
    billing: {},
    other: {},
    printOptions: {},
    guests: [],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get("startDate") || "";
    const endDate = urlParams.get("endDate") || "";
    const roomName = urlParams.get("roomName") || "";

    setFormData((prev) => ({
      ...prev,
      stayInformation: {
        ...prev.stayInformation,
        startDate,
        endDate,
        rooms: prev.stayInformation.rooms.map((room) => ({
          ...room,
          roomName,
        })),
      },
    }));
  }, []);

  const handleFormChange = (updatedFormData) => {
    setFormData((prev) => ({
      ...prev,
      stayInformation: {
        ...prev.stayInformation,
        ...updatedFormData.stayInformation,
      },
      guests: updatedFormData.guests || prev.guests,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic here
    console.log("Form submitted with values: ", formData);
    message.success("Reservation successfully submitted!");
  };

  const tabItems = [
    {
      key: "billing",
      label: "Billing Information",
      children: <BillingInformation formData={formData} />,
    },
    {
      key: "other",
      label: "Other Information",
      children: <OtherInformation form={form} />,
    },
  ];

  return (
    // <form form={form} onSubmit={handleSubmit}>
    <div>
      <Card>
        <h3 className="text-2xl border-b">Walk In / Reservation</h3>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Column 1: Takes up full width on small screens, 9 out of 12 parts on large screens */}
            <div className="col-span-1 lg:col-span-9 rounded-md">
              <StayInformation
                data={{ ...formData.stayInformation, token, hotelId }}
                onChange={handleFormChange}
              />
              <hr />
              <GuestInformation onChange={handleFormChange} />
            </div>

            {/* Column 2: Takes up full width on small screens, 3 out of 12 parts on large screens */}
            <div className="col-span-1 lg:col-span-3">
              <Tabs
                defaultActiveKey="billing"
                className="custom-tabs bg-white"
                tabBarStyle={{
                  borderBottom: "1px solid #002B4D",
                }}
                size="small"
                items={tabItems}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <PrintOptions onChange={handleFormChange} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <Button
            type="primary"
            className="bg-appBlue hover:bg-appBlueLight"
            size="lg"
            onClick={handleSubmit}
          >
            Reserve
          </Button>
        </div>
      </Card>
    </div>
    // </form>
  );
};
