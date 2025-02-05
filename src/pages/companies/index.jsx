import { useState } from "react";
import { Table, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv"; // Import CSVLink for CSV download functionality
import Layout from "@/components/utils/Layout";
import InvoiceModal from "@/components/modals/InvoiceModal"; // Import the new InvoiceModal component

const Companies = () => {
  const [filterText, setFilterText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);

  // Sample data for the companies list
  const companyData = [
    {
      key: "1",
      name: "Tech Corp",
      contactPerson: "John Doe",
      phone: "123-456-7890",
      email: "john.doe@techcorp.com",
      totalBilling: "€150,000.00",
      totalPaid: "€100,000.00",
      totalOutstanding: "€50,000.00",
      invoice: "INV-12345",
      paymentDate: "2023-05-01",
      previousContracts: "✓",
    },
    {
      key: "2",
      name: "Innovate LLC",
      contactPerson: "Jane Smith",
      phone: "987-654-3210",
      email: "jane.smith@innovate.com",
      totalBilling: "€120,000.00",
      totalPaid: "€100,000.00",
      totalOutstanding: "€20,000.00",
      invoice: "INV-12346",
      paymentDate: "2023-06-01",
      previousContracts: "✓",
    },
    // Add more rows as needed
  ];

  const removeDuplicates = (data) => {
    const uniqueData = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.email === value.email)
    );
    return uniqueData;
  };

  const filteredData = companyData.filter(
    (company) =>
      company.name.toLowerCase().includes(filterText.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(filterText.toLowerCase()) ||
      company.email.toLowerCase().includes(filterText.toLowerCase()) ||
      company.phone.includes(filterText)
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Total Billing",
      dataIndex: "totalBilling",
      key: "totalBilling",
    },
    {
      title: "Total Paid",
      dataIndex: "totalPaid",
      key: "totalPaid",
    },
    {
      title: "Total Outstanding",
      dataIndex: "totalOutstanding",
      key: "totalOutstanding",
    },
    {
      title: "Invoice",
      dataIndex: "invoice",
      key: "invoice",
      render: (text, record) => (
        <Button type="link" onClick={() => showInvoiceModal(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Previous Contracts",
      dataIndex: "previousContracts",
      key: "previousContracts",
    },
  ];

  const showInvoiceModal = (record) => {
    setCurrentInvoice(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentInvoice(null);
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Companies</h1>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
          />
          <Button
            onClick={() => {
              setFilterText("");
            }}
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const uniqueData = removeDuplicates(filteredData);
              console.log(uniqueData); // For testing purposes
            }}
          >
            Remove Duplicate
          </Button>
          <Button type="primary">
            <CSVLink
              data={filteredData}
              headers={columns}
              filename="companies.csv"
            >
              Download
            </CSVLink>
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={false}
          scroll={{ x: true }}
        />
        <InvoiceModal
          visible={isModalVisible}
          onClose={handleCancel}
          invoice={currentInvoice}
        />
      </div>
    </Layout>
  );
};

export default Companies;
