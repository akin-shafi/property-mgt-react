// components/DashboardLayout.js
"use client";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Access AuthContext
import TopNavReservation from "./TopNavReservation";
import publicRoutes from "./publicRoute";

const ReservationLayout = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useAuth(); // Auth state: { user, token, isLoading }
  const isPublicRoute = publicRoutes.includes(window.location.pathname); // Check if the route is public

  // Redirect to login if user is not authenticated and not on a public route
  useEffect(() => {
    if (!state.isLoading && !state.token && !isPublicRoute) {
      navigate("/"); // Redirect to login
    }
  }, [state.token, state.isLoading, navigate, isPublicRoute]);

  // State for the side navigation
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  // const toggleSideNav = () => setIsSideNavOpen((prev) => !prev);
  const closeSideNav = () => setIsSideNavOpen(false);

  // Close SideNav when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        closeSideNav();
      }
    };

    if (isSideNavOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideNavOpen]);

  // Show loading state while session is being initialized
  if (state.isLoading) {
    return <div>Loading...</div>; // Customize your loading spinner or component
  }
  return (
    <div className="w-screen bg-[#FFFFFF] overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <TopNavReservation />
      </div>

      <div className=" w-full h-[92vh] mt-[9vh] overflow-y-auto">
        <div className="my-4 mx-4">{children}</div>
      </div>
    </div>
  );
};

export default ReservationLayout;
