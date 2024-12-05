"use client";
// import { useState } from "react";
import { RoomList } from "./room-list";
import ReservationLayout from "../../components/utils/ReservationLayout";
// import AddRoomModal from "@/components/front-desk/modals/add-room-modal"; // Import AddRoomModal
export default function Rooms() {
  // const [rooms, setRooms] = useState(mockRooms);

  // const [modalVisible, setModalVisible] = useState(false);
  // const handleCloseModal = () => {
  //   setModalVisible(false);
  // };

  // const handleAddNewRoom = (newRoom) => {
  //   setRooms((prevRooms) => [...prevRooms, newRoom]); // Add new room to the list
  // };

  return (
    <ReservationLayout>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Room List</h2>
          <a
            href="/onboarding?step=4"
            className="bg-appGreen text-white py-2 px-4 rounded-lg shadow-md hover:bg-appGreenLight focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 active:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
          >
            Add Room
          </a>
        </div>

        <div className="mt-4">
          <RoomList />
        </div>
      </div>

      {/* <AddRoomModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onAddRoom={handleAddNewRoom}
        token={token}
      /> */}
    </ReservationLayout>
  );
}
