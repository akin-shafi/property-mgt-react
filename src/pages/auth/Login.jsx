import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import {
  // LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Button } from "@/components/ui/button";
import { Spin } from "antd"; // Import Spin for loading spinner
import AuthAside from "@/components/AuthAside"; // Adjust the path based on your folder structure
import Logo from "@/components/Logo"; // Adjust the path based on your folder structure
// import { Checkbox } from "@/components/ui/Checkbox"; // Adjust paths as needed
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function LoginPage() {
  const [message, setMessage] = useState(""); // State for messages
  const [username, setUsername] = useState("standford001"); // State for username
  const [tenantId, setTenantId] = useState("adm-8B36D103"); // State for tenantId
  const [password, setPassword] = useState("Test@123");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // State to track processing status
  // const [rememberMe, setRememberMe] = useState(false);
  const { login } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the message from localStorage
    const storedMessage = localStorage.getItem("message");
    if (storedMessage) {
      setMessage(storedMessage);
      localStorage.removeItem("message"); // Clear the message after showing it
    }
  }, []);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    setIsProcessing(true);

    const result = await login(username, password, tenantId);

    setIsProcessing(false);

    if (result.success === true) {
      const { data } = result;
      const role = data.role;
      if (role) {
        // Store session in localStorage or sessionStorage based on rememberMe
        // if (rememberMe) {
        //   localStorage.setItem("userSession", JSON.stringify(data));
        // } else {
        //   sessionStorage.setItem("userSession", JSON.stringify(data));
        // }
        sessionStorage.setItem("userSession", JSON.stringify(data));
        navigate("/pms/dashboard");
      }
    } else {
      setMessage(result.message);
    }
  };

  // Checkbox handler
  // const handleRememberMeChange = (e) => {
  //   setRememberMe(e.target.checked);
  // };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="grid min-h-screen lg:grid-cols-12">
        <div className="flex items-center justify-center p-8 lg:col-span-6">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <Logo />
              <h2 className="text-2xl font-semibold tracking-tight">Login</h2>
              {/* <p className="text-sm text-muted-foreground">
                Welcome back! Please enter your details.
              </p> */}
            </div>
            <Spin spinning={isProcessing} size="small" className="mr-2">
              <form onSubmit={handleLogin} className="space-y-4">
                {message && (
                  <p
                    className={`text-center mb-4 ${
                      message ===
                      "Verification Successful. Please login to get started."
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {message}
                  </p>
                )}
                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="username">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="password">
                    Password
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

                <div className="space-y-2">
                  <Label className="text-muted-foreground" htmlFor="tenantId">
                    Property Code
                  </Label>
                  <Input
                    id="tenantId"
                    placeholder="Enter your tenant ID"
                    required
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                >
                  Login
                </Button>
                <div className="flex items-center justify-end">
                  {/* <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <label
                      className="text-sm text-muted-foreground"
                      htmlFor="remember"
                    >
                      Remember for 30 days
                    </label>
                  </div> */}
                  <Link
                    to="/forgot-password"
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Forgot password
                  </Link>
                </div>
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
            </Spin>
          </div>
        </div>
        <div className="hidden lg:block bg-appBlue p-12 xl:p-20 text-white relative lg:col-span-6">
          <AuthAside />
        </div>
      </div>
    </>
  );
}
