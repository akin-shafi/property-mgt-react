import { useSession } from "../hooks/useSession";

export default function UserProfile({ isSidebarExpanded }) {
  const { session } = useSession();

  // Check if session or session.user is null or undefined
  if (!session || !session.user) {
    return null; // Or you can return a fallback UI, like a loading spinner or message
  }

  const { hotelName, tenantId } = session.user;

  // Extract initials from the first two words of the hotel name
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    const firstInitial = words[0]?.charAt(0) || "";
    const secondInitial = words[1]?.charAt(0) || "";
    return `${firstInitial}${secondInitial}`.toUpperCase();
  };

  const initials = getInitials(hotelName);
  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold">
            {initials}
          </div>
          {isSidebarExpanded && ( // Only show hotel name and subtitle if sidebar is expanded
            <div>
              <div className="font-semibold text-white">{hotelName}</div>
              <div className="text-xs">TenantID: {tenantId}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
