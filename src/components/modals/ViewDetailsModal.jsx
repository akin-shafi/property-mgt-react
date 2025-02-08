import { useEffect, useState } from "react";
import { fetchReservationById } from "@/hooks/useReservation";
import { Modal, Spin } from "antd";

const ViewDetailsModal = ({
  visible,
  onCancel,
  onOtherModal,
  resourceId,
  token,
}) => {
  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && resourceId) {
      setLoading(true);
      fetchReservationById(resourceId, token)
        .then((data) => {
          setReservationData(data.reservationDetails);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reservation:", error);
          setLoading(false);
        });
    }
  }, [visible, resourceId, token]);

  if (!reservationData) {
    return null;
  }

  const {
    checkInDate,
    checkOutDate,
    numberOfNights,
    billing,
    bookedRooms,
    activity,
  } = reservationData;

  const paymentMethod = billing?.[0]?.payment_method || "N/A";
  const grandTotal = billing?.[0]?.grandTotal || "N/A";
  const amountPaid = billing?.[0]?.amountPaid || "N/A";
  const balanceDue = billing?.[0]?.balance || "N/A";
  const adult = bookedRooms?.[0].numberOfAdults || "N/A";

  const handleButtonClick = (buttonName) => {
    onOtherModal({
      buttonName,
      reservationData: {
        checkInDate,
        checkOutDate,
        numberOfNights,
        billing,
        bookedRooms,
        activity,
      },
    });
  };

  return (
    <Modal
      title="Reservation Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin spinning={loading}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-[1fr,auto] gap-6">
            <div className="p-6">
              <div className="space-y-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    <tr>
                      <td className="text-muted-foreground">Check-in/out</td>
                      <td className="font-medium">
                        : {checkInDate} - {checkOutDate}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-muted-foreground">
                        Number of Nights
                      </td>
                      <td className="font-medium">: {numberOfNights}</td>
                    </tr>
                    <tr>
                      <td className="text-muted-foreground">No. of Adults</td>
                      <td className="font-medium">: {adult}</td>
                    </tr>
                    <tr>
                      <td className="text-muted-foreground">Payment Mode</td>
                      <td className="font-medium">: {paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>

                <hr className="my-4" />
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-semibold">: {grandTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Amount Paid</span>
                    <span className="font-semibold">: {amountPaid}</span>
                  </div>

                  {balanceDue !== "0.00" && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Balance</span>
                      <span className="font-semibold">: {balanceDue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 w-32">
              {[
                activity !== "check_in" && "Check-In",
                activity === "check_in" && "Check-Out",
                activity === "check_in" && "Undo Check in",
                "Edit",
                "Invoice",
                "Add Service",
                balanceDue !== "0.00" && "Add Payment",
                "Exchange Room",
              ]
                .filter(Boolean) // Filter out falsey values to remove the buttons conditionally
                .map((buttonName) => (
                  <button
                    key={buttonName}
                    onClick={() => handleButtonClick(buttonName)}
                    disabled={loading}
                    className={`w-full justify-center block text-center border border-gray-300 py-2 rounded-md ${
                      buttonName === "Check-In"
                        ? "bg-teal-700 text-white hover:bg-teal-900"
                        : buttonName === "Check-Out"
                        ? "bg-red-700 text-white hover:bg-red-900"
                        : buttonName === "Undo Check in"
                        ? "bg-yellow-500 text-white hover:bg-yellow-900"
                        : "hover:border-teal-900 hover:text-teal-900"
                    }`}
                  >
                    {buttonName}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default ViewDetailsModal;
