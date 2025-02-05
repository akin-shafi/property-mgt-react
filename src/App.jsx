import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import ListDevice from "./pages/auth/ListDevice";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyTwoFactor from "./pages/auth/VerifyTwoFactor";
import FrontOffice from "./pages/frontOffice";
import Rooms from "./pages/rooms";
import RoomsView from "./pages/rooms/index-2";
import Guests from "./pages/guests";
import Reservations from "./pages/reservations";
import ReservationsList from "./pages/reservations/list";
import NewReservations from "./pages/reservations/new";
import ReservationsEdit from "./pages/reservations/edit";
import NewReservationsTest from "./pages/reservations/new/ReservationInformation";

import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";
import ArrivalReport from "./pages/report";
import Companies from "./pages/companies";

import DashboardPMS from "./pages/dashboard";

// Define routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/list-device",
      element: <ListDevice />,
    },
    {
      path: "/auth/register",
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
      path: "/pms/dashboard",
      element: <DashboardPMS />,
    },

    {
      path: "/pms/arrival-report",
      element: <ArrivalReport />,
    },

    {
      path: "/pms/stay-view",
      element: <FrontOffice />,
    },
    {
      path: "/pms/reservations/new",
      element: <Reservations />,
    },
    {
      path: "/pms/reservations/edit",
      element: <ReservationsEdit />,
    },
    {
      path: "/pms/list-reservations",
      element: <ReservationsList />,
    },
    {
      path: "/reservations/new",
      element: <NewReservations />,
    },

    {
      path: "/reservations/new-test",
      element: <NewReservationsTest />,
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
      path: "/pms/rooms-view",
      element: <RoomsView />,
    },

    {
      path: "/pms/guests",
      element: <Guests />,
    },
    {
      path: "/pms/companies",
      element: <Companies />,
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
