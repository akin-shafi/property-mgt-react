import { useState } from "react";
import { Form, Button, Tabs, Card } from "antd";
import OtherInformation from "./OtherInformation";
import BillingInformation from "./BillingInformation";
// import GuestListTable from "./GuestListTable";
import PrintOptions from "./PrintOptions";
import GuestInformation from "./GuestInformation";
import StayInformation from "./StayInformation";
// import ContactInformation from "./ContactInformation";

const { TabPane } = Tabs;

export const ReservationForm = ({ onChange }) => {
  const [form] = Form.useForm();

  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    nights: 0,
    rooms: [],
  });

  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  return (
    <form>
      <Card>
        <h3 className="text-2xl border-b">Walk In / Reservation</h3>

        <div className="p-4 ">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Column 1: Takes up full width on small screens, 9 out of 12 parts on large screens */}
            <div className="col-span-1 lg:col-span-9  rounded-md">
              <div className="">
                {/* <StayInformation onChange={onChange} /> */}

                {/* <BillingInformation selectedRoomType="deluxe" /> */}

                <StayInformation onFormDataChange={handleFormDataChange} />

                <hr />
                <GuestInformation onChange={onChange} />
              </div>
            </div>

            {/* Column 2: Takes up full width on small screens, 3 out of 12 parts on large screens */}
            <div className="col-span-1 lg:col-span-3  ">
              <Tabs
                defaultActiveKey="billing"
                className="custom-tabs bg-white"
                tabBarStyle={{
                  borderBottom: "1px solid #002B4D",
                }}
                size="small"
              >
                <TabPane
                  tab="Billing Information"
                  key="billing"
                  className="p-1 rounded-md shadow-sm"
                >
                  {/* <BillingInformation form={form} /> */}
                  <BillingInformation formData={formData} />
                </TabPane>

                <TabPane
                  tab="Other Information"
                  key="other"
                  className="p-1 rounded-md shadow-sm"
                >
                  <OtherInformation form={form} />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </Card>
      <Card>
        {/* <GuestListTable /> */}
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
            className=" bg-appBlue hover:bg-appBlueLight"
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
