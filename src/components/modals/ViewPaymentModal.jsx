import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
import { fetchReservationById } from "@/hooks/useReservation";
import { Modal } from "antd";
import { Link } from "react-router-dom";

const ViewPaymentModal = ({ visible, onCancel, resourceId, token }) => {
  // const [paymentDetails, setPaymentDetails] = useState(null);
  const [reservationData, setReservationData] = useState(null);

  useEffect(() => {
    if (resourceId) {
      fetchReservationById(resourceId, token)
        .then((data) => {
          // console.log("Fetched reservation data: ", data);
          setReservationData(data.reservationDetails);
        })
        .catch((error) => {
          console.error("Error fetching reservation:", error);
        });
    }
  }, [resourceId, token]);

  if (!reservationData) {
    return null;
  }

  const formatReservationDate = (checkInDate, checkOutDate) => {
    const options = { day: "numeric", month: "short" };
    const yearOptions = { year: "numeric" };

    const formattedCheckInDate = new Date(checkInDate).toLocaleDateString(
      "en-GB",
      options
    );
    const formattedCheckOutDate = new Date(checkOutDate).toLocaleDateString(
      "en-GB",
      options
    );
    const checkInYear = new Date(checkInDate).toLocaleDateString(
      "en-GB",
      yearOptions
    );
    const checkOutYear = new Date(checkOutDate).toLocaleDateString(
      "en-GB",
      yearOptions
    );

    if (checkInYear === checkOutYear) {
      return `${formattedCheckInDate} - ${formattedCheckOutDate}, ${checkInYear}`;
    } else {
      return `${formattedCheckInDate} ${checkInYear} - ${formattedCheckOutDate} ${checkOutYear}`;
    }
  };

  const {
    id,
    checkInDate,
    checkOutDate,
    numberOfNights,
    // guest,
    billing,
    bookedRooms,
  } = reservationData;

  const paymentMethod = billing?.[0]?.payment_method || "N/A";
  const grandTotal = billing?.[0]?.grandTotal || "N/A";
  const amountPaid = billing?.[0]?.amountPaid || "N/A";
  const balanceDue = billing?.[0]?.balance || "N/A";
  const adult = bookedRooms?.[0].numberOfAdults || "N/A";
  const reservationDate = formatReservationDate(checkInDate, checkOutDate);

  return (
    <Modal
      title="Reservation Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {/* <div>{paymentDetails}</div> */}

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-[1fr,auto] gap-6">
          <div className="p-6">
            <div className="space-y-4">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  <tr>
                    <td className="text-muted-foreground">Check-in/out</td>
                    <td className="font-medium">: {reservationDate}</td>
                  </tr>
                  <tr>
                    <td className="text-muted-foreground">Number of Night</td>
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
            <Link to={`/pms/reservations/edit?reservationid=${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Edit
              </a>
            </Link>
            <Link to={`/invoice/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Invoice
              </a>
            </Link>
            <Link href={`/add-service/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Add Service
              </a>
            </Link>
            <Link href={`/add-payment/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Add Payment
              </a>
            </Link>
            <Link href={`/check-out/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Check out
              </a>
            </Link>
            <Link href={`/undo-check-in/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Undo Check in
              </a>
            </Link>
            <Link href={`/exchange-room/${id}`}>
              <a className="w-full justify-center block text-center border border-gray-300 py-2 rounded-md">
                Exchange Room
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPaymentModal;
