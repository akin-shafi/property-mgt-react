import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Access AuthContext
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import publicRoutes from "./publicRoute";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useAuth(); // Auth state: { user, token, isLoading }
  const isPublicRoute = publicRoutes.includes(window.location.pathname); // Check if the route is public

  // Redirect to login if user is not authenticated and not on a public route
  useEffect(() => {
    if (!state.isLoading && !state.token && !isPublicRoute) {
      navigate("/"); // Redirect to login
    }
  }, [state.token, state.isLoading, navigate, isPublicRoute]);

  // Determine user role
  const userRole = state.user?.role;
  const isApplicant = userRole === "applicant";

  // State for the side navigation
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);

  const toggleSideNav = () => setIsSideNavOpen((prev) => !prev);
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
    <div className="w-screen h-screen flex md:flex-row flex-col bg-[#F7F9FC] overflow-hidden">
      {/* Top Navigation */}
      <TopNav onMenuClick={toggleSideNav} />

      {/* Main Layout */}
      <div className="flex w-full h-full">
        {/* Side Navigation */}
        {!isPublicRoute && (
          <SideNav
            isOpen={isSideNavOpen}
            onClose={toggleSideNav}
            ref={sideNavRef}
            isApplicant={isApplicant}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 bg-white w-full h-[92vh] mt-[9vh] overflow-y-auto scroller">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
