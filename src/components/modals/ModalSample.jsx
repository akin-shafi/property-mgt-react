/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Input, Form, message } from "antd";

const CheckOutModal = ({ visible, onCancel, resourceId, token }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.example.com/checkout/${resourceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      message.success("Checkout successful!");
      onCancel();
    } catch (error) {
      message.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Checkout"
      onCancel={onCancel}
      footer={[
        <Button
          key="submit"
          //   type="primary"
          className="bg-red-700 text-white hover:bg-red-900"
          htmlType="submit"
          loading={loading}
        >
          Checkout
        </Button>,

        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
    >
      <Form layout="vertical" onFinish={handleCheckout}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input type="email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CheckOutModal;
