/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default function ModalDrawer({ open, onClose, pageTitle, resourceId }) {
  const showPageTitle = pageTitle ?? "Page Title";
  const [reservationDetails, setReservationDetails] = useState(null);

  useEffect(() => {
    if (resourceId) {
      // Fetch reservation details using the resourceId
      // Example: Replace with actual API call to fetch reservation data
      setReservationDetails(`reservation details for resource ${resourceId}`);
    }
  }, [resourceId]);

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      title={showPageTitle} // Add the title here
      width="30%"
      className="rounded-md custom-drawer"
      // closeIcon={<CloseOutlined className="absolute right-4 top-4" />}
      styles={{ body: { padding: 0 } }}
      maskClosable={false} // Add this line to prevent closing on outside click
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col p-6 gap-6">
          <div>{reservationDetails}</div>
          <div className="h-full flex flex-col md:flex-row">Hello world</div>
        </div>
      </div>
    </Drawer>
  );
}
