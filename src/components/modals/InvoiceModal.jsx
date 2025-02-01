// InvoiceModal.js
// import React from "react";
import { Modal, Descriptions, Button } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";

const InvoiceModal = ({ visible, onClose, invoice }) => {
  console.log("invoice", invoice);
  return (
    <Modal
      title="Invoice Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button
          key="print"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          Print
        </Button>,
        <Button
          key="download"
          icon={<DownloadOutlined />}
          onClick={() => alert("Download functionality")}
        >
          Download
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      {invoice ? (
        <Descriptions
          bordered
          column={1}
          layout="vertical"
          labelStyle={{ fontWeight: "bold" }}
        >
          <Descriptions.Item label="Name">{invoice.name}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">
            {invoice.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{invoice.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{invoice.email}</Descriptions.Item>
          <Descriptions.Item label="Total Value">
            {invoice.totalValue}
          </Descriptions.Item>
          <Descriptions.Item label="Total Billing">
            {invoice.totalBilling}
          </Descriptions.Item>
          <Descriptions.Item label="Total Outstanding">
            {invoice.totalOutstanding}
          </Descriptions.Item>
          <Descriptions.Item label="Invoice">
            {invoice.invoice}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Date">
            {invoice.paymentDate}
          </Descriptions.Item>
          <Descriptions.Item label="Previous Contracts">
            {invoice.previousContracts}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No invoice selected</p>
      )}
    </Modal>
  );
};

export default InvoiceModal;
