import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyTwoFactor from "./pages/auth/VerifyTwoFactor";
import FrontOffice from "./pages/frontOffice";
import Rooms from "./pages/rooms";
import Guests from "./pages/guests";
import Reservations from "./pages/reservations";
import NewReservations from "./pages/reservations/new";
import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";

// Define routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/verify",
      element: <VerifyTwoFactor />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/front-office",
      element: <FrontOffice />,
    },
    {
      path: "/reservations",
      element: <Reservations />,
    },
    {
      path: "/reservations/new",
      element: <NewReservations />,
    },

    {
      path: "/onboarding",
      element: <Onboarding />,
    },

    {
      path: "/rooms",
      element: <Rooms />,
    },

    {
      path: "/guests",
      element: <Guests />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enable the relative splat path flag
      v7_startTransition: true, // Enable the startTransition future flag
    },
  }
);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
