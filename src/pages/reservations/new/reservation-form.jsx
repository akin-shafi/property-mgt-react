"use client";
import { useState } from "react";
import { Form, Button, Tabs, Card } from "antd";
import OtherInformation from "./formFields/OtherInformation";
import BillingInformation from "./formFields/BillingInformation";
import PrintOptions from "./formFields/PrintOptions";
import GuestInformation from "./formFields/GuestInformation";
import StayInformation from "./formFields/StayInformation";

export const ReservationForm = ({ startDate, endDate, roomName, onChange }) => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    checkIn: startDate,
    checkOut: endDate,
    nights: 0,
    rooms: [],
  });

  const handleFormDataChange = (data) => {
    setFormData(data);
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
    <form>
      <Card>
        <h3 className="text-2xl border-b">Walk In / Reservation</h3>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Column 1: Takes up full width on small screens, 9 out of 12 parts on large screens */}
            <div className="col-span-1 lg:col-span-9 rounded-md">
              <div>
                <StayInformation
                  onFormDataChange={handleFormDataChange}
                  startDate={startDate}
                  endDate={endDate}
                  roomName={roomName}
                />
                <hr />
                <GuestInformation onChange={onChange} />
              </div>
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
        <PrintOptions form={form} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          <Button htmlType="button">Cancel</Button>
          <Button
            type="primary"
            className="bg-appBlue hover:bg-appBlueLight"
            size="lg"
            htmlType="submit"
          >
            Reserve
          </Button>
        </div>
      </Card>
    </form>
  );
};
