"use client";

import { Sheet, SheetContent, SheetTrigger } from "../framework/ui/sheet";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Plus,
  UserCircle,
} from "lucide-react";

import { Button } from "../framework/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../framework/ui/dropdown-menu";
import { Input } from "../framework/ui/input";
import { SideNav } from "./sideNavReservation";
// import { RoomIcon } from "../Icon";

export default function Nav() {
  return (
    <header className="flex h-16 w-full items-center gap-4 border-b bg-white px-4 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 ">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SideNav />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-500" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden items-center gap-2 lg:flex"
            >
              Grand Lorem Resort and Casino
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[240px]">
            <DropdownMenuItem>View Resort Details</DropdownMenuItem>
            <DropdownMenuItem>Switch Resort</DropdownMenuItem>
            <DropdownMenuItem>Resort Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative flex-1">
        <Input
          className="w-full max-w-xl bg-gray-50"
          placeholder="Search reservations, guests, and more"
          type="search"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add new</span>
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0">
          <CalendarDays className="h-5 w-5" />
          <span className="sr-only">Calendar</span>
        </Button>
        {/* <Button variant="ghost" size="icon" className="hidden shrink-0 lg:flex">
          <RoomIcon />
          <span className="sr-only">Rooms</span>
        </Button> */}
        <Button variant="ghost" size="icon" className="shrink-0">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {/* <Button variant="ghost" size="icon" className="hidden shrink-0 lg:flex">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Language</span>
        </Button> */}
        <Button variant="ghost" size="icon" className="shrink-0">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  );
}
