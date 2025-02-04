import { useState } from "react";
import { Button } from "antd";

import ModalDrawer from "@/components/modals/ModalDrawer";

const DeviceLister = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const [devices, setDevices] = useState([]);

  const handleClick = async () => {
    try {
      // Check if the Web USB API is supported
      if ("usb" in navigator) {
        const deviceList = await navigator.usb.getDevices();
        setDevices(deviceList);
      } else {
        alert("Web USB is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error accessing devices:", error);
      alert("An error occurred while fetching devices.");
    }
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>List Connected Devices</button>
        <ul>
          {devices.length === 0 ? (
            <li>No devices connected.</li>
          ) : (
            devices.map((device, index) => (
              <li key={index}>
                {device.productName} (ID: {device.deviceDescriptor.deviceId})
              </li>
            ))
          )}
        </ul>
      </div>

      <Button variant="outline" type="primary" onClick={toggleDrawer}>
        Find Talent
      </Button>
      <ModalDrawer open={drawerOpen} onClose={toggleDrawer} />
    </>
  );
};

export default DeviceLister;
