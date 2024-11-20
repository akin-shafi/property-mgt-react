import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Use Link from React Router
import { Spin } from "antd"; // Ant Design components
import { Button } from "../../components/ui/Button";

import {
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import AuthAside from "../../components/AuthAside"; // Adjust the path based on your folder structure
import Logo from "../../components/Logo"; // Adjust the path based on your folder structure
import { Checkbox } from "../../components/ui/Checkbox"; // Adjust paths as needed
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sakinropo@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const message = localStorage.getItem("message");
    if (message === "timeout") {
      setError("Session timed out due to inactivity.");
      localStorage.removeItem("message");
    } else if (message === "Verification Successful") {
      setError("Verification Successful. Please login to get started.");
      localStorage.removeItem("message");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isMounted) return; // Ensure the component is mounted before proceeding

    setLoading(true);

    try {
      const result = await authenticateUser(email, password);

      if (result?.ok) {
        console.log("data", result.data);
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const authenticateUser = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Spin spinning={!isMounted || loading}>
      <div className="grid min-h-screen lg:grid-cols-12">
        <AuthAside />

        <div className="flex items-center justify-center p-8 lg:col-span-8">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <Logo />
              <h2 className="text-2xl font-semibold tracking-tight">Log in</h2>
              <p className="text-sm text-muted-foreground">
                Welcome back! Please enter your details.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p
                  className={`text-center mb-4 ${
                    error ===
                    "Verification Successful. Please login to get started."
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="email">
                  Email
                  <LockOutlined className="text-red-600 ml-2" />
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground" htmlFor="password">
                  Password
                  <LockOutlined className="text-red-600 ml-2" />
                </Label>
                <div className="w-full flex items-center justify-between rounded-lg border py-2 px-4 bg-white border-gray-300 md:h-10 h-9">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="outline-none border-none w-full h-full placeholder:text-gray-400 text-sm text-gray-900 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeInvisibleOutlined className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeOutlined className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    className="text-sm text-muted-foreground"
                    htmlFor="remember"
                  >
                    Remember for 30 days
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Forgot password
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-appOrange hover:bg-appOrangeLight"
                size="lg"
                loading={loading}
              >
                Login
              </Button>
              <div className="text-center">
                <Link
                  to="/auth/register"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {`Don't have an account? `}
                  <span className="text-orange-500">Register</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Spin>
  );
}
