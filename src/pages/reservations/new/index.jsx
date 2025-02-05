"use client";
// import ReservationLayout from "@/components/utils/ReservationLayout";
import Layout from "@/components/utils/Layout";
import { ReservationForm } from "./reservation-form";
import { useSearchParams } from "react-router-dom";

export default function ReservationPage() {
  // Use the useSearchParams hook to get query parameters from the URL
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const roomName = searchParams.get("roomName");

  // If startDate and endDate exist, pass them as props to ReservationForm
  return (
    <Layout>
      <div className="py-1">
        <ReservationForm
          startDate={startDate ? new Date(startDate) : null}
          endDate={endDate ? new Date(endDate) : null}
          roomName={roomName}
        />
      </div>
    </Layout>
  );
}
