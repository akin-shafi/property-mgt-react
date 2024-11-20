import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import OnboardingLayout from "./components/utils/OnboardingLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyTwoFactor from "./pages/auth/VerifyTwoFactor";
import Onboarding from "./pages/onboarding/Onboarding";
import FrontOffice from "./pages/frontOffice";
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
      path: "/frontoffice",
      element: <FrontOffice />,
    },
    {
      path: "/onboarding",
      element: <OnboardingLayout />,
      children: [
        {
          index: true, // This sets the default child route
          element: <Onboarding />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Enable the relative splat path flag
    },
  }
);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
