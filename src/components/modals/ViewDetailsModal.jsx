import { useEffect, useState } from "react";
import { fetchReservationById } from "@/hooks/useReservation";
import { Modal, Spin } from "antd";
import dayjs from "dayjs";

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
    guest,
    checkInDate,
    checkOutDate,
    numberOfNights,
    totalBalance,
    totalPaid,
    grandTotal,
    billing,
    bookedRooms,
    activity,
  } = reservationData;

  const normalizeCurrency = (value) =>
    parseFloat(value.replace(/[^0-9.-]+/g, ""));

  const normalizedBalance = normalizeCurrency(totalBalance || "0");
  const normalizedTotalPaid = normalizeCurrency(totalPaid || "0");
  const normalizedGrandTotal = normalizeCurrency(grandTotal || "0");

  // Format amounts to currency
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const formattedGrandTotal = formatter.format(normalizedGrandTotal);
  const formattedTotalPaid = formatter.format(normalizedTotalPaid);
  const formattedTotalBalance = formatter.format(normalizedBalance);

  // console.log("balanceDue", normalizedBalance);
  const adult = bookedRooms?.[0].numberOfAdults || "N/A";

  const handleButtonClick = (buttonName) => {
    onOtherModal({
      buttonName,
      reservationData: {
        guest,
        checkInDate,
        checkOutDate,
        numberOfNights,
        totalBalance: normalizedBalance,
        totalPaid: normalizedTotalPaid,
        grandTotal: normalizedGrandTotal,
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
        <div className="max-w-4xl mx-auto text-sm">
          <div className="grid grid-cols-[1fr,auto] gap-6">
            <div className="p-6">
              <div className="space-y-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody>
                    <tr>
                      <td className="text-muted-foreground">Guest:</td>
                      <td className="font-medium">{guest.fullName}</td>
                    </tr>
                    <tr>
                      <td className="text-muted-foreground">Check-in/out:</td>
                      <td className="font-medium">
                        {dayjs(checkInDate).format("MMM DD, YYYY")} -{" "}
                        {dayjs(checkOutDate).format("MMM DD, YYYY")}
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
                  </tbody>
                </table>

                <hr className="my-4" />
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="py-2 px-2 text-left">S/N</th>
                      <th className="py-2 px-2 text-left">Payment Mode</th>
                      <th className="py-2 px-2 text-left">Amount Paid</th>
                      <th className="py-2 px-2 text-left">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billing?.map((bill, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-2 border-b">{index + 1}</td>
                        <td className="py-2 px-2 border-b">
                          {bill.payment_method}
                        </td>
                        <td className="py-2 px-2 border-b">
                          {bill.amountPaid}
                        </td>
                        <td className="py-2 px-2 border-b">{bill.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="grid grid-cols-1 gap-2 ">
                  <div className="flex justify-between">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-semibold">
                      : {formattedGrandTotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Paid</span>
                    <span className="font-semibold">
                      : {formattedTotalPaid}
                    </span>
                  </div>

                  {normalizedBalance !== 0 && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Total Balance</span>
                      <span className="font-semibold">
                        : {formattedTotalBalance}
                      </span>
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
                normalizedBalance !== 0 && "Add Payment",
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
                    {/* {activity} */}
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
