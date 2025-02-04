import { useState, useEffect, useRef } from "react";
import { getSession, setSession, clearSession } from "../utils/session";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { publicRoutes } from "./publicRoutes"; // Import public routes

const API_BASE_URL = import.meta.env.VITE_BASE_URL; // Use Vite environment variable

export function useSession() {
  const [session, setSessionState] = useState(getSession());
  const navigate = useNavigate(); // For programmatic navigation
  const location = useLocation(); // Get current route
  const timeoutIdRef = useRef(null); // Using useRef to store timeout ID

  useEffect(() => {
    // Function to reset the inactivity timeout
    const resetTimeout = () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

      // Check if the current route is public
      if (publicRoutes.includes(location.pathname)) {
        return; // Do not set timeout for public routes
      }

      // Set timeout for private routes
      timeoutIdRef.current = setTimeout(() => {
        localStorage.setItem("message", "Session timed out due to inactivity.");
        logout(); // Clear session and redirect
        // }, 120000); // 2-minute session timeout (for testing)
      }, 3600000); // 1-hour session timeout (for production)
    };

    // Add event listeners for user activities
    const handleActivity = () => resetTimeout();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Initial reset of the timeout
    resetTimeout();

    // Clean up event listeners and timeout on component unmount
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [location.pathname]); // Re-run effect when route changes

  useEffect(() => {
    // Redirect to login if session is empty and the route is private
    if (!session && !publicRoutes.includes(location.pathname)) {
      localStorage.setItem("message", "Please login");
      navigate("/login"); // Redirect to login page
      return;
    }
  }, [session, navigate, location.pathname]);

  const login = async (username, password, tenantId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, tenantId }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const userSession = { ...data, username }; // Assuming response contains user data

      // Save session in storage and update state
      setSession(userSession);
      setSessionState(userSession);

      // Return the user data with role and other details for redirection
      return { success: true, data: userSession.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Invalid credentials. Please try again.",
      };
    }
  };

  const logout = () => {
    clearSession(); // Clear session from storage
    setSessionState(null); // Clear state
    window.location.href = "/login"; // Redirect to login
  };

  return {
    session,
    login,
    logout,
    setSession: (user) => {
      setSession(user);
      setSessionState(user);
    },
    clearSession: logout,
  };
}
