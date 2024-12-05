// ViewReservationModal.tsx
import { useEffect, useState } from "react";
import { Modal } from "antd";

const ViewReservationModal = ({ visible, onCancel, resourceId }) => {
  const [reservationDetails, setReservationDetails] = useState(null);

  useEffect(() => {
    if (visible && resourceId) {
      // Fetch reservation details using the resourceId
      // Example: Replace with actual API call to fetch reservation data
      setReservationDetails(`Reservation details for resource ${resourceId}`);
    }
  }, [visible, resourceId]);

  return (
    <Modal
      title="View Reservation"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div>{reservationDetails}</div>
    </Modal>
  );
};

export default ViewReservationModal;
