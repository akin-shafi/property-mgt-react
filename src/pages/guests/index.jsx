import { useEffect, useState } from "react";
import Layout from "@/components/utils/Layout";
import { useSession } from "../../hooks/useSession";
import {
  Table,
  Button,
  Input,
  Pagination,
  Popconfirm,
  message,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv"; // Import CSVLink for CSV download functionality
import {
  fetchAllGuest,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../../hooks/guests/useGuest";

import { GuestModal } from "@/components/modals/GuestModal";

const Guests = () => {
  const { session } = useSession();
  const token = session?.token;
  const [guests, setGuests] = useState([]); // To hold the guests data
  const [filteredGuests, setFilteredGuests] = useState([]); // To filter the guests
  const [loading, setLoading] = useState(false); // For loading state
  const [searchText, setSearchText] = useState(""); // For search text
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // For view modal visibility
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For edit modal visibility
  const [selectedGuest, setSelectedGuest] = useState(null); // For selected guest
  const [page, setPage] = useState(1); // For current page
  const [pageSize, setPageSize] = useState(10); // For items per page

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchAllGuest(token); // Fetch guests data from API
        console.log("result", result);
        setGuests(result);
        setFilteredGuests(result); // Initialize filtered guests to all guests
      } catch (error) {
        console.error("Failed to fetch guests:", error);
        message.error("Failed to load guests");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();

    const filtered = guests.filter((user) =>
      Object.values(user).some((field) =>
        String(field).toLowerCase().includes(lowercasedValue)
      )
    );

    setFilteredGuests(filtered);
    setPage(1); // Reset to the first page when searching
  };

  const removeDuplicates = (data) => {
    const uniqueData = data.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.photoId === value.photoId)
    );
    return uniqueData;
  };

  const showGuestViewModal = (guest) => {
    setSelectedGuest(guest);
    setIsViewModalVisible(true);
  };

  const showGuestEditModal = (guest) => {
    setSelectedGuest(guest);
    setIsEditModalVisible(true);
  };

  const handleCreateOrEditUser = async (user) => {
    setLoading(true);
    try {
      if (selectedGuest) {
        // Edit user
        await updateGuest(selectedGuest.id, user, token);
        message.success("User updated successfully");
      } else {
        // Create new user
        await createGuest(user, token);
        message.success("User created successfully");
      }

      // Refresh the user list
      const result = await fetchAllGuest(token);
      setGuests(result);
      setFilteredGuests(result);
    } catch (error) {
      console.error("Failed to save user:", error);
      message.error("Failed to save user");
    } finally {
      setLoading(false);
      setIsEditModalVisible(false);
      setSelectedGuest(null);
    }
  };

  const handleDeleteGuest = async (id) => {
    setLoading(true);
    try {
      await deleteGuest(id, token);
      message.success("User deleted successfully");

      // Refresh the user list
      const result = await fetchAllGuest(token);
      setGuests(result);
      setFilteredGuests(result);
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Photo ID",
      dataIndex: "photoId",
      key: "photoId",
      className: "small-font",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      className: "small-font",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      className: "small-font",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: "small-font",
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      className: "small-font",
    },
    {
      title: "Previous Stays",
      dataIndex: "previousStays",
      key: "previousStays",
      className: "small-font",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showGuestViewModal(record)}>
            View Details
          </Button>
          <Button
            type="link"
            primary
            onClick={() => showGuestEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteGuest(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 small-font">Guests</h1>
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: "250px", marginBottom: "20px" }}
            className="small-font"
          />
          <Button
            onClick={() => {
              setSearchText("");
              setFilteredGuests(guests);
            }}
            className="small-font"
          >
            Clear
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const uniqueData = removeDuplicates(filteredGuests);
              console.log(uniqueData); // For testing purposes
              setFilteredGuests(uniqueData);
            }}
            className="small-font bg-appGreen hover:bg-appGreenLight rounded-full"
          >
            Remove Duplicate
          </Button>
          <Button
            type="primary"
            className="small-font hover:bg-appGreen bg-appGreenLight rounded-full"
          >
            <CSVLink data={filteredGuests} filename="guests.csv">
              Download
            </CSVLink>
          </Button>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={filteredGuests}
            loading={loading}
            pagination={{ current: page, pageSize, onChange: setPage }}
            scroll={{ x: true }}
            className="table-small-font"
          />
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filteredGuests.length}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            style={{ marginTop: 20 }}
            className="small-font"
          />
        </div>
        <Modal
          title="Guest Details"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button
              key="close"
              onClick={() => setIsViewModalVisible(false)}
              className="small-font"
            >
              Close
            </Button>,
          ]}
          className="modal-small-font"
        >
          {selectedGuest && (
            <div>
              <p className="small-font">
                <strong>Photo ID:</strong> {selectedGuest.photoId}
              </p>
              <p className="small-font">
                <strong>Name:</strong> {selectedGuest.fullName}
              </p>
              <p className="small-font">
                <strong>Phone:</strong> {selectedGuest.phone}
              </p>
              <p>
                <strong>Previous Stays:</strong> {selectedGuest.previousStays}
              </p>
            </div>
          )}
        </Modal>

        <GuestModal
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSubmit={handleCreateOrEditUser}
          user={selectedGuest}
        />
      </div>
    </Layout>
  );
};

export default Guests;
