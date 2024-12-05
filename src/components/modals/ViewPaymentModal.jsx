// ViewPaymentModal.tsx
import { useEffect, useState } from "react";
import { Modal } from "antd";

const ViewPaymentModal = ({ visible, onCancel, resourceId }) => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (visible && resourceId) {
      // Fetch payment details using the resourceId
      // Example: Replace with actual API call to fetch payment data
      setPaymentDetails(`Payment details for resource ${resourceId}`);
    }
  }, [visible, resourceId]);

  return (
    <Modal
      title="View Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <div>{paymentDetails}</div>
    </Modal>
  );
};

export default ViewPaymentModal;
