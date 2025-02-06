import { useState, useEffect } from "react";
import { Button, Tabs, Card, message } from "antd";
import { useSession } from "@/hooks/useSession";
import { useNavigate } from "react-router-dom";
import StayInformation from "./formFields/StayInfo";
import GuestForm from "./formFields/GuestForm";
import BillingInformation from "./formFields/BillingInformation";
import PrintOptions from "./formFields/PrintOptions";
import Layout from "@/components/utils/Layout";
import { validateReservationForm } from "@/utils/validation";
import { createReservation } from "@/hooks/useReservation";
import InvoiceModal from "@/components/modals/InvoiceModal";

const ReservationForm = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const token = session?.token;
  const hotelId = session?.user?.hotelId;
  const hotelName = session?.user?.hotelName;
  const userId = session?.user?.userId;
  const role = session?.user?.role;

  const [formData, setFormData] = useState({
    reservationDetails: {
      checkInDate: "",
      checkOutDate: "",
      rooms: [
        {
          roomName: "",
          numberOfAdults: 1,
          numberOfChildren: 0,
          roomPrice: 0,
        },
      ],
      numberOfNights: 0,
      totalPrice: 0,
    },
    guestDetails: [],
    billingDetails: {},
    other: {},
    printOptions: {},
  });

  const [reservationData, setReservationData] = useState(0);
  const [isInvoiceModalVisible, setInvoiceModalVisible] = useState(false); // Modal state
  const [loading, setLoading] = useState(false); // Add loading state
  const [newResourceId, setResourceId] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setFormData((prev) => ({
      ...prev,
      reservationDetails: {
        ...prev.reservationDetails,
        checkInDate: urlParams.get("startDate") || "",
        checkOutDate: urlParams.get("endDate") || "",
        rooms: prev.reservationDetails.rooms.map((room) => ({
          ...room,
          roomName: urlParams.get("roomName") || "",
        })),
      },
    }));
  }, []);

  const handleChange = (section, value) => {
    if (section === "reservationData") {
      setReservationData(value);

      setFormData((prev) => ({
        ...prev,
        reservationDetails: {
          ...prev.reservationDetails,
          numberOfNights: value.numberOfNights,
          totalPrice: value.totalPrice,
        },
      }));
    } else if (section === "rooms") {
      const totalPrice = value.reduce(
        (acc, room) =>
          acc + room.roomPrice * formData.reservationDetails.numberOfNights,
        0
      );
      setFormData((prev) => ({
        ...prev,
        reservationDetails: {
          ...prev.reservationDetails,
          rooms: value,
          totalPrice: totalPrice,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    if (validateReservationForm(formData)) {
      console.log("formData", formData);
      const payload = {
        guestDetails: formData.guestDetails,
        reservationDetails: formData.reservationDetails,
        billingDetails: formData.billingDetails,
        createdBy: userId,
        role: role,
      };

      try {
        const response = await createReservation(payload, token);
        if (response.statusCode === 200) {
          message.success("Reservation successfully submitted!");
          if (formData.printOptions.printInvoice) {
            setResourceId(response.reservationId);
            setInvoiceModalVisible(true);
          } else {
            navigate("/pms/stay-view");
          }
        } else {
          message.error(
            `Error: ${response.message || "Failed to create reservation"}`
          );
        }
      } catch (error) {
        console.error("Error submitting reservation:", error);
        message.error("Error submitting reservation. Please try again.");
      } finally {
        setLoading(false); // Reset loading state after action is complete
      }
    } else {
      setLoading(false); // Reset loading state if validation fails
    }
  };

  const tabItems = [
    {
      key: "billing",
      label: "Billing Information",
      children: (
        <BillingInformation
          onChange={handleChange}
          reservationData={reservationData}
          token={token}
          hotelId={hotelId}
        />
      ),
    },
  ];

  return (
    <Layout>
      <Card>
        <h3 className="text-2xl border-b">Walk In / Reservation</h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-1 lg:col-span-8 rounded-md">
            <StayInformation
              data={{ ...formData.reservationDetails, token, hotelId }}
              onChange={handleChange}
            />
            <hr />
            <GuestForm onChange={handleChange} />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <Tabs
              defaultActiveKey="billing"
              className="custom-tabs bg-white"
              size="small"
              items={tabItems}
            />
          </div>
        </div>
      </Card>
      <Card>
        <PrintOptions onChange={handleChange} />

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
            onClick={handleSubmit}
            disabled={loading} // Disable button when loading
            loading={loading} // Show loading spinner
          >
            {loading ? "Processing..." : "Reserve"} {/* Change button text */}
          </Button>
        </div>
      </Card>
      {/* <InvoiceModal
        visible={isReceiptVisible}
        onClose={() => setIsReceiptVisible(false)}
        reservationData={formData}
      /> */}

      <InvoiceModal
        visible={isInvoiceModalVisible}
        onCancel={() => setInvoiceModalVisible(false)}
        resourceId={newResourceId}
        token={token}
        hotelName={hotelName}
      />
    </Layout>
  );
};

export default ReservationForm;
