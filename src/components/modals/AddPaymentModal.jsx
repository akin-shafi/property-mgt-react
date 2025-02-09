import { Modal, Button, Form, Input, Select, message } from "antd";
import { addPayment } from "@/hooks/useReservation";

const AddPaymentModal = ({ visible, onCancel, resourceId, data, token }) => {
  const [form] = Form.useForm();
  const balance = data?.reservationData?.totalBalance || "0";
  const amountPaid = data?.reservationData?.totalPaid || "0";
  const grandTotal = data?.reservationData?.grandTotal || "0";
  const roomName = data?.reservationData?.bookedRooms?.[0]?.roomName || "N/A";
  const guestDetails = data?.reservationData?.guest;

  // Function to remove currency formatting
  // const normalizeCurrency = (value) =>
  //   parseFloat(value.replace(/[^0-9.-]+/g, ""));

  // const normalizedBalance = normalizeCurrency(balance);

  const handleAddPayment = async (values) => {
    // if (parseFloat(values.amountPaid) !== normalizedBalance) {
    //   message.error("The amount entered does not match the balance left");
    //   return;
    // }

    try {
      const response = await addPayment(
        resourceId,
        values.amountPaid,
        values.payment_method,
        token
      );
      message.success(response.message);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.log(error);
      message.error("Failed to add payment. Please try again.");
    }
  };

  return (
    <Modal
      title="Add Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div className="">
        <strong>Reservation: {guestDetails?.fullName || "N/A"} | </strong>
        <span>RoomName: {roomName}</span>
      </div>

      <table style={{ width: "50%" }} className="mb-4">
        <tbody>
          <tr className="border-b">
            <th className="text-left py-2">Amount Paid:</th>
            <td className="text-right py-2">{amountPaid}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left py-2">Grand Total:</th>
            <td className="text-right py-2">{grandTotal}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left py-2">Balance left:</th>
            <td className="text-right py-2">{balance}</td>
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
          name="payment_method"
          label="Payment Mode"
          rules={[
            { required: true, message: "Please select the payment mode" },
          ]}
        >
          <Select>
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="bank_transfer">Transfer</Select.Option>
            <Select.Option value="pos_terminal">POS Terminal</Select.Option>
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
