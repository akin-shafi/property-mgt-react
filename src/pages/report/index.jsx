import { useState } from "react";
import { Table, Input, DatePicker, Space, Select } from "antd";
import Layout from "../../components/utils/Layout";
import moment from "moment";
import HotelSalesReport from "./HotelSalesReport"; // Existing component
import DailyForecastReport from "./DailyForecastReport"; // Existing component
import DepartureReport from "./DepartureReport"; // New component
import ArrivalReport from "./ArrivalReport"; // New component
import DateWiseRevenueReport from "./DateWiseRevenueReport"; // New component

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Option, OptGroup } = Select;

const Reports = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedReport, setSelectedReport] = useState("Arrival Report");

  const tableData = [
    {
      sn: 1,
      guestName: "Malavika S",
      source: "Goibibo",
      roomNo: 207,
      checkin: "29-03-2024",
      checkout: "29-03-2024",
      pax: 1,
      status: "Checked in",
      amount: "1,300.5",
      tax: "156.06",
      total: "1,456.56",
      payments: "1,456.56",
      folioNo: "F12345",
      mobile: "9876543210",
      email: "malavika@example.com",
    },
    // Add more data as needed
  ];

  const reportTypes = {
    Accounting: [
      "Room Wise Revenue Report",
      "Date Wise Revenue Report", // Added new report
      "Checkout based Accounting Report",
      "Item Consumption Report",
      "Payments Report",
      "POS Report",
      "Payment Void Report",
      "Expense Report",
      "City Ledger Payment Report",
    ],
    Management: [
      "Management Block Report",
      "Out of Order Room Report",
      "No Show Report",
      "Room Status Report",
      "Reviews Tracking Report",
      "IOT Occupancy Issues Report",
      "Maintenance Report",
      "Hotel Sales Report",
      "Daily Forecast Report",
      "Departure Report", // Added new report
      "Arrival Report", // Added new report
    ],
  };

  const columns = [
    {
      title: "SN",
      dataIndex: "sn",
      key: "sn",
      sorter: (a, b) => a.sn - b.sn,
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      sorter: (a, b) => a.guestName.localeCompare(b.guestName),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      sorter: (a, b) => a.source.localeCompare(b.source),
    },
    {
      title: "Room No.",
      dataIndex: "roomNo",
      key: "roomNo",
      sorter: (a, b) => a.roomNo - b.roomNo,
    },
    {
      title: "Checkin",
      dataIndex: "checkin",
      key: "checkin",
      sorter: (a, b) =>
        moment(a.checkin, "DD-MM-YYYY").unix() -
        moment(b.checkin, "DD-MM-YYYY").unix(),
    },
    {
      title: "Checkout",
      dataIndex: "checkout",
      key: "checkout",
      sorter: (a, b) =>
        moment(a.checkout, "DD-MM-YYYY").unix() -
        moment(b.checkout, "DD-MM-YYYY").unix(),
    },
    {
      title: "PAX",
      dataIndex: "pax",
      key: "pax",
      sorter: (a, b) => a.pax - b.pax,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Amount (INR)",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) =>
        parseFloat(a.amount.replace(/,/g, "")) -
        parseFloat(b.amount.replace(/,/g, "")),
    },
    {
      title: "Tax (INR)",
      dataIndex: "tax",
      key: "tax",
      sorter: (a, b) =>
        parseFloat(a.tax.replace(/,/g, "")) -
        parseFloat(b.tax.replace(/,/g, "")),
    },
    {
      title: "Total (INR)",
      dataIndex: "total",
      key: "total",
      sorter: (a, b) =>
        parseFloat(a.total.replace(/,/g, "")) -
        parseFloat(b.total.replace(/,/g, "")),
    },
    {
      title: "Payments (INR)",
      dataIndex: "payments",
      key: "payments",
      sorter: (a, b) =>
        parseFloat(a.payments.replace(/,/g, "")) -
        parseFloat(b.payments.replace(/,/g, "")),
    },
    {
      title: "Folio No.",
      dataIndex: "folioNo",
      key: "folioNo",
      sorter: (a, b) => a.folioNo.localeCompare(b.folioNo),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sorter: (a, b) => a.mobile.localeCompare(b.mobile),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = tableData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleDateChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const filtered = tableData.filter((item) => {
        const checkinDate = moment(item.checkin, "DD-MM-YYYY");
        return checkinDate.isBetween(startDate, endDate, null, "[]");
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
  };

  const handleReportChange = (value) => {
    setSelectedReport(value);
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Reports</h1>

        <Space className="mb-4">
          <Select
            defaultValue="Arrival Report"
            style={{ width: 200 }}
            onChange={handleReportChange}
            showSearch
            placeholder="Select a report"
            optionFilterProp="children"
            filterOption={(input, option) => {
              if (option.children) {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }
              return false;
            }}
          >
            <OptGroup label="Accounting">
              {reportTypes.Accounting.map((report) => (
                <Option key={report} value={report}>
                  {report}
                </Option>
              ))}
            </OptGroup>
            <OptGroup label="Management">
              {reportTypes.Management.map((report) => (
                <Option key={report} value={report}>
                  {report}
                </Option>
              ))}
            </OptGroup>
          </Select>
          <RangePicker onChange={handleDateChange} />
          <Search
            placeholder="Search..."
            onSearch={handleSearch}
            style={{ width: 200 }}
          />
        </Space>

        {/* Conditionally render the selected report */}
        {selectedReport === "Hotel Sales Report" && <HotelSalesReport />}
        {selectedReport === "Daily Forecast Report" && <DailyForecastReport />}
        {selectedReport === "Departure Report" && <DepartureReport />}
        {selectedReport === "Arrival Report" && <ArrivalReport />}
        {selectedReport === "Date Wise Revenue Report" && (
          <DateWiseRevenueReport />
        )}

        {/* Render the default table for other reports */}
        {selectedReport !== "Hotel Sales Report" &&
          selectedReport !== "Daily Forecast Report" &&
          selectedReport !== "Departure Report" &&
          selectedReport !== "Date Wise Revenue Report" &&
          selectedReport !== "Arrival Report" && (
            <Table
              columns={columns}
              dataSource={filteredData.length > 0 ? filteredData : tableData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
              rowKey="sn"
            />
          )}
      </div>
    </Layout>
  );
};

export default Reports;
