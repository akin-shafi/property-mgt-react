/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Row, Col } from "antd";

export function GuestModal({
  visible,
  onClose,
  onSubmit,
  user = null,
  showCloseIcon = true,
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(user);

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        form.setFieldsValue({ ...user });
      } else {
        form.resetFields();
      }
    }
  }, [form, isEdit, user, visible]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
    //   createdBy: "admin",
    };
    onSubmit(payload);
    form.resetFields();
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Guest" : "Create New Guest"}
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showCloseIcon && (
            <Button key="cancel" className="rounded-full" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            key="submit"
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight rounded-full"
            onClick={() => form.submit()}
          >
            {isEdit ? "Save Changes" : "Submit"}
          </Button>
        </div>
      }
      closeIcon={showCloseIcon ? undefined : null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={user || {}}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter the full name" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter a valid email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                { required: true, message: "Please enter a phone number" },
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please enter an address" }]}
            >
              <Input placeholder="Enter address" />
            </Form.Item>
          </Col>
        </Row>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
