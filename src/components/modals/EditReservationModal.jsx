// EditReservationModal.tsx
import { useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";

const EditReservationModal = ({ visible, onCancel, resourceId }) => {
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
      title="Edit Reservation"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary">
          Save
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label="Reservation Details">
          <Input.TextArea value={reservationDetails} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditReservationModal;
