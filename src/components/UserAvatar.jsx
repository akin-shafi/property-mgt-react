import { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi"; // Assuming you have an AuthContext for managing auth
import { useAuth } from "../context/AuthContext"; // Import AuthContext

export default function UserAvatar() {
  const { logout } = useAuth(); // Destructure logout function from context
  const [user, setUser] = useState(null); // State to store user info

  // Fetch user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state from localStorage
    }
  }, []);

  if (!user) return null; // If no user is logged in, return null or a fallback UI

  const { email, firstName, lastName } = user;

  const handleLogout = () => {
    logout(); // Call the logout function from context
    localStorage.removeItem("user"); // Clear user data from localStorage
    setUser(null); // Reset user state
  };

  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  return (
    <div className="w-full h-[40px] grid md:grid-cols-[40px_1fr_30px] grid-cols-[30px_1fr_20px] items-center gap-3">
      <div className="w-[30px] md:w-[40px] h-[30px] md:h-[40px] rounded-full bg-[#FFECE5] grid place-content-center text-[14px] md:text-[16px] text-primary relative uppercase">
        {initials}
        <span className="absolute bottom-0 right-0 w-[13px] h-[13px] bg-[#04802E] border border-white rounded-full" />
      </div>
      <div>
        <div className="text-[12px] md:text-[14px] text-white">
          {firstName} {lastName}
        </div>
        <div className="text-[12px] md:text-[14px] text-white">{email}</div>
      </div>
      <FiLogOut
        onClick={handleLogout}
        className="cursor-pointer text-[17px] md:text-[20px] text-white flex item-center justify-self-end"
      />
    </div>
  );
}
