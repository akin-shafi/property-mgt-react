import { useEffect, useState, useCallback } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { fetchMaintenanceStatusOptions } from "../../../hooks/useAction"; // Import the hook

export const RoomModal = ({
  visible,
  onClose,
  room,
  mode,
  onSave,
  onDelete,
  token, // Assuming you pass the token as a prop
}) => {
  const [form] = Form.useForm();
  const [maintenanceStatusOptions, setMaintenanceStatusOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMaintenanceOptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMaintenanceStatusOptions(token); // Use the hook to fetch data
      setMaintenanceStatusOptions(data);
    } catch (error) {
      console.error("Error fetching maintenance status options:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (visible && mode === "edit") {
      fetchMaintenanceOptions();
    }
  }, [visible, mode, fetchMaintenanceOptions]);

  useEffect(() => {
    if (mode === "edit" && room) {
      form.setFieldsValue(room);
    } else {
      form.resetFields();
    }
  }, [mode, room, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible} // Changed from visible to open
      title={
        mode === "view"
          ? "View Room"
          : mode === "edit"
          ? "Edit Room"
          : "Delete Room"
      }
      onCancel={onClose}
      footer={
        mode === "view"
          ? null
          : mode === "edit"
          ? [
              <Button key="cancel" onClick={onClose}>
                Cancel
              </Button>,
              <Button key="save" type="primary" onClick={handleSave}>
                Save
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={onClose}>
                Cancel
              </Button>,
              <Button key="delete" type="danger" onClick={onDelete}>
                Delete
              </Button>,
            ]
      }
    >
      {mode === "view" && room && (
        <div>
          <p>Room Number: {room.number}</p>
          <p>Type: {room.type}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Status: {room.status}</p>
          <p>Maintenance Status: {room.maintenanceStatus}</p>
        </div>
      )}

      {mode === "edit" && (
        <Form form={form} layout="vertical">
          {" "}
          {/* Ensure form prop is passed */}
          <Form.Item
            name="number"
            label="Room Number"
            rules={[{ required: true, message: "Room Number is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Room Type is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Capacity is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Status is required" }]}
          >
            <Select>
              <Select.Option value="Available">Available</Select.Option>
              <Select.Option value="Unavailable">Unavailable</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="maintenanceStatus"
            label="Maintenance Status"
            rules={[
              { required: true, message: "Maintenance Status is required" },
            ]}
          >
            <Select loading={loading}>
              {maintenanceStatusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}

      {mode === "delete" && <p>Are you sure you want to delete this room?</p>}
    </Modal>
  );
};
