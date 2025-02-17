import {
  // Calendar,
  Building2,
  // TrendingUp,
  PieChart,
  // Building,
  // Star,
  // Target,
  // BookOpen,
  // User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigation } from "../../context/NavigationContext";
import UserProfile from "../UserProfile";

const navItems = [
  // {
  //   icon: <Calendar className="w-5 h-5" />,
  //   label: "Channel Manager & RMS",
  //   hasSubItems: true,
  //   path: "/channel-manager-rms",
  // },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "PMS",
    hasSubItems: true,
    subItems: [
      { label: "Dashboard", path: "/pms/dashboard" },
      { label: "Reservation", path: "/pms/list-reservations" },
      { label: "Stay View", path: "/pms/stay-view" },
      { label: "Rooms View", path: "/pms/rooms-view" },
      { label: "Guests", path: "/pms/guests" },
      // { label: "Companies", path: "/pms/companies" },
      // { label: "Reports", path: "/pms/arrival-report" },
    ],
  },
  // {
  //   icon: <TrendingUp className="w-5 h-5" />,
  //   label: "ERP",
  //   hasSubItems: true,
  //   path: "/erp",
  // },
  {
    icon: <PieChart className="w-5 h-5" />,
    label: "Reports",
    hasSubItems: true,
    path: "/pms/arrival-report",
  },
  // {
  //   icon: <Building className="w-5 h-5" />,
  //   label: "Group Hotels",
  //   hasSubItems: true,
  //   path: "/group-hotels",
  // },
  // {
  //   icon: <Star className="w-5 h-5" />,
  //   label: "Reviews",
  //   hasSubItems: true,
  //   path: "/reviews",
  // },
  // {
  //   icon: <Target className="w-5 h-5" />,
  //   label: "Competition",
  //   hasSubItems: true,
  //   path: "/competition",
  // },
  // {
  //   icon: <BookOpen className="w-5 h-5" />,
  //   label: "Booking Engine",
  //   hasSubItems: true,
  //   path: "/booking-engine",
  // },
  // {
  //   icon: <User className="w-5 h-5" />,
  //   label: "My Aiosell",
  //   hasSubItems: true,
  //   path: "/my-aiosell",
  // },
];

export function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { isSidebarExpanded, expandedMenus, toggleMenu, setExpandedMenus } =
    useNavigation();

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (subItem.path === currentPath) {
            if (!expandedMenus.includes(item.label)) {
              setExpandedMenus((prev) => [...prev, item.label]);
            }
          }
        });
      }
    });
  }, [currentPath, setExpandedMenus]);

  const isActive = (item) =>
    item.subItems?.some((sub) => sub.path === currentPath) ||
    expandedMenus.includes(item.label);

  return (
    <div
      className={`fixed left-0 top-14 bottom-0 bg-[#032541] text-gray-300 transition-all duration-300 ${
        isSidebarExpanded ? "w-64" : "w-16"
      } `}
    >
      {/* Hotel Logo Section */}

      <UserProfile isSidebarExpanded={isSidebarExpanded} />

      {/* Navigation Items */}
      <nav className="py-2">
        {navItems.map((item, index) => (
          <div key={index} className="relative group">
            <Link
              to={item.path}
              onClick={() => item.hasSubItems && toggleMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors
                  ${isActive(item) ? "bg-gray-700" : ""}`}
            >
              {item.icon}
              {isSidebarExpanded && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.hasSubItems && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedMenus.includes(item.label) ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </>
              )}
            </Link>

            {/* Subitems */}
            {isSidebarExpanded &&
              item.subItems &&
              expandedMenus.includes(item.label) && (
                <div className="pl-11 bg-[#252c33]">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`w-full block text-left py-2 px-4 text-sm hover:bg-gray-700 transition-colors
                        ${subItem.path === currentPath ? "bg-gray-700" : ""}`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );
}
