// import { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Select, message } from "antd";

const AddPaymentModal = ({ visible, onCancel, resourceId, data, token }) => {
  const [form] = Form.useForm();
  const balance = data?.reservationData?.billing[0]?.balance;
  const amountPaid = data?.reservationData?.billing[0]?.amountPaid;
  const grandTotal = data?.reservationData?.billing[0]?.grandTotal;

  // console.log("balance", balance);
  const handleAddPayment = async (values) => {
    if (parseFloat(values.amountPaid) !== parseFloat(balance)) {
      message.error("The amount entered does not match the balance left");
      return;
    }

    console.log("Payment values:", values);
    // Implement the payment logic here
    // You can make an API call to add the payment
    message.success("Payment added successfully");
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Add Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <table style={{ width: "50%" }} className="mb-4">
        <tbody>
          <tr className="border-b">
            <th className="text-left py-2">Amount Paid:</th>
            <th className="text-right py-2">{amountPaid}</th>
          </tr>
          <tr className="border-b">
            <th className="text-left py-2">Grand Total:</th>
            <th className="text-right py-2">{grandTotal}</th>
          </tr>
          <tr className="border-b">
            <th className="text-left py-2">Balance left:</th>
            <th className="text-right py-2">{balance}</th>
          </tr>
        </tbody>
      </table>
      <Form form={form} onFinish={handleAddPayment}>
        <Form.Item
          name="amountPaid"
          label="Add Amount"
          rules={[{ required: true, message: "Please enter the amount paid" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="paymentMode"
          label="Payment Mode"
          rules={[
            { required: true, message: "Please select the payment mode" },
          ]}
        >
          <Select>
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="bank_transfer">Transfer</Select.Option>
            <Select.Option value="pos">POS Terminal</Select.Option>
            <Select.Option value="others">Others</Select.Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit">
            Add Payment
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddPaymentModal;
