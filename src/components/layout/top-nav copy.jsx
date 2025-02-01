import { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, ChevronDown } from "lucide-react";
import { useNavigation } from "../../context/NavigationContext";

export function TopNav() {
  const { toggleSidebar } = useNavigation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);

  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsNotificationOpen(false);
    setIsMessageOpen(false);
  };

  const toggleDropdown = (setter, ref) => {
    closeAllDropdowns();
    setter((prev) => !prev);
    if (!ref.current) return;
    ref.current.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        messageRef.current &&
        !messageRef.current.contains(event.target)
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 left-0 h-14 bg-[#2d3741] text-white px-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-700 rounded"
        >
          <span className="sr-only">Menu</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() =>
              toggleDropdown(setIsNotificationOpen, notificationRef)
            }
            className="p-2 hover:bg-gray-700 rounded"
          >
            <Bell className="w-5 h-5" />
          </button>
          {isNotificationOpen && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 text-gray-700"
            >
              <div className="px-4 py-2 font-semibold border-b">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  New booking: Room 101
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Checkout reminder: Room 205
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Maintenance request: Room 302
                </a>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 border-t"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => toggleDropdown(setIsMessageOpen, messageRef)}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          {isMessageOpen && (
            <div
              ref={messageRef}
              className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 text-gray-700"
            >
              <div className="px-4 py-2 font-semibold border-b">Messages</div>
              <div className="max-h-64 overflow-y-auto">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  John Doe: Can I get a late checkout?
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Jane Smith: Requesting room service
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Front Desk: New guest arriving
                </a>
              </div>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 border-t"
              >
                View all messages
              </a>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => toggleDropdown(setIsProfileOpen, profileRef)}
            className="flex items-center gap-2 ml-4 p-2 hover:bg-gray-700 rounded"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              H
            </div>
            <span className="text-sm">Octave Royal Opera</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {isProfileOpen && (
            <div
              ref={profileRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700"
            >
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Your Profile
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
