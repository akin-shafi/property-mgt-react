import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Spin } from "antd"; // Ant Design components
import {
  // LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import AuthAside from "@/components/AuthAside";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function Register() {
  const navigate = useNavigate();
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(`/verify-twofactor?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-12">
      <div className="flex items-center justify-center p-8 lg:col-span-6">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center">
            <Logo />
            <h2 className="text-2xl font-semibold tracking-tight">Register</h2>
            <p className="text-sm text-muted-foreground">
              Create your account by entering your details below.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p
                className={`text-center mb-4 ${
                  error.includes("Successful")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {error}
              </p>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">
                Password
                {/* <span className="text-red-600 ml-2">
                  <LockOutlined />
                </span> */}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-2 top-2 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? <Spin /> : "Register"}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                Already have an account?{" "}
                <span className="text-orange-500">Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:block bg-appBlue p-12 xl:p-20 text-white relative lg:col-span-6">
        <AuthAside />
      </div>
    </div>
  );
}
