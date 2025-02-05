"use client";
import { Form, Input, DatePicker, InputNumber, Select, Button } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import ReservationLayout from "../../components/utils/ReservationLayout";
// import { useSession } from "@/hooks/useSession";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

export default function HotelReservationEdit() {
  //   const { session } = useSession();
  //   const token = session?.token;
  //   const hotelId = session?.user?.hotelId;
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Form values:", values);
    // Here you would typically send the form data to your backend
  };

  return (
    <ReservationLayout>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="p-8 w-full">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
                Edit Reservation
              </div>
              <h2 className="text-2xl leading-7 font-bold text-gray-900 mb-5">
                Update Your Booking Details
              </h2>
              <Form
                form={form}
                name="hotel-reservation"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-6"
              >
                <Form.Item
                  name="guestName"
                  label="Guest Name"
                  rules={[
                    { required: true, message: "Please input the guest name!" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="dateRange"
                  label="Check-in / Check-out"
                  rules={[
                    {
                      required: true,
                      message: "Please select the date range!",
                    },
                  ]}
                >
                  <RangePicker
                    className="w-full rounded-md"
                    prefix={<CalendarOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="guests"
                  label="Number of Guests"
                  rules={[
                    {
                      required: true,
                      message: "Please input the number of guests!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={10}
                    className="w-full rounded-md"
                    prefix={<TeamOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="roomType"
                  label="Room Type"
                  rules={[
                    { required: true, message: "Please select a room type!" },
                  ]}
                >
                  <Select
                    className="w-full rounded-md"
                    prefix={<HomeOutlined className="text-gray-400" />}
                  >
                    <Option value="standard">Standard</Option>
                    <Option value="deluxe">Deluxe</Option>
                    <Option value="suite">Suite</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="specialRequests" label="Special Requests">
                  <TextArea rows={4} className="rounded-md" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-md"
                  >
                    Update Reservation
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </ReservationLayout>
  );
}
