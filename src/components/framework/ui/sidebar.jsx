"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../../lib/utils";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "4rem";

const SidebarContext = React.createContext(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  "relative flex h-screen w-full flex-col overflow-y-auto border-r bg-background",
  {
    variants: {
      collapsed: {
        true: `w-[${SIDEBAR_WIDTH_ICON}]`,
        false: `w-[${SIDEBAR_WIDTH}]`,
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
);

export const Sidebar = React.forwardRef(
  ({ className, collapsible, ...props }, ref) => {
    const { collapsed } = useSidebar();

    return (
      <aside
        ref={ref}
        className={cn(
          sidebarVariants({ collapsed: collapsible && collapsed }),
          className
        )}
        {...props}
      />
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-14 items-center border-b px-4", className)}
      {...props}
    />
  )
);
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    />
  )
);
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-3 py-2", className)} {...props} />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mb-2 px-2 text-xs font-semibold uppercase text-white",
        className
      )}
      {...props}
    />
  )
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-1", className)} {...props} />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-1", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("px-2", className)} {...props} />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      active: {
        true: "bg-accent text-accent-foreground",
        false: "transparent",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export const SidebarMenuButton = React.forwardRef(
  ({ className, active, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(sidebarMenuButtonVariants({ active }), className)}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-border transition-all",
        className
      )}
      onClick={() => setCollapsed(!collapsed)}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";
