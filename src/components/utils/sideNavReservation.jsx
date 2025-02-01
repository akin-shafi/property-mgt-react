import {
  CalendarDays,
  Globe,
  Home,
  Building2,
  // Plus,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "../framework/ui/sidebar";
import UserAvatar from "../UserAvatar";
import { RoomIcon } from "../Icon";
import WhiteLogo from "../WhiteLogo";
import { useLocation } from "react-router-dom"; // Using react-router-dom instead of next/link and next/router

// import { usePathname } from "next/navigation";

export function SideNav() {
  const location = useLocation(); // Get the current location (path)
  const currentPath = location.pathname;

  const getLinkClass = (path) => {
    return currentPath === path
      ? "bg-white/10 hover:bg-white/20"
      : "hover:bg-white/20";
  };

  return (
    <SidebarProvider>
      <Sidebar
        className="h-full h-full w-64 bg-[#032541] text-white "
        collapsible="none"
      >
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-2">
            {/* <div className="h-8 w-8 rounded-full bg-blue-500" /> */}
            {/* <span className="font-semibold">Grand Lorem Resort</span> */}
            <div className="flex justify-between mt-4 mb-4">
              <a href="/">
                <WhiteLogo />
              </a>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className={getLinkClass("/dashboard")}>
                    <Home className="h-4 w-4 mr-2" />
                    <a href="/dashboard">Dashboard</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={getLinkClass("/front-office")}>
                    <Building2 className="h-4 w-4 mr-2" />
                    <a href="/front-office">Stay view</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={getLinkClass("/rooms")}>
                    <RoomIcon />

                    <a href="/rooms">Room view</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={getLinkClass("/guests")}>
                    <Users className="h-4 w-4 mr-2" />

                    <a href="/guests">Guests</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className={getLinkClass("/reservations")}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <a href="/reservations">Reservations</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>
              <a href="/settings">Settings</a>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className=" hover:bg-white/20">
                    <Settings className="h-4 w-4 mr-2" />

                    <a href="/resort-settings"> Resort Settings</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton className=" hover:bg-white/20">
                    <Globe className="h-4 w-4 mr-2" />

                    <a href="/language"> Language</a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="w-full flex flex-col gap-3"></div>
        <div className="p-4">
          <UserAvatar />
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}
