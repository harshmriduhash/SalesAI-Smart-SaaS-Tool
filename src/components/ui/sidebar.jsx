// src/components/ui/sidebar.jsx
// src/components/ui/sidebar.jsx
// This component should NOT be using shadcn styling internally, but external classes for layout.
// So, we don't need 'cn' here unless we want to combine classes passed into it.

import React, { useState, createContext, useContext } from "react";
import { cn } from "@/lib/utils"; // Import cn

// Context for sidebar state (e.g., collapsed/expanded)
const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true); // Example state
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, className = "" }) => {
  // const { isOpen } = useContext(SidebarContext); // Use context if you want state-driven sidebar
  return <aside className={cn("flex flex-col h-full", className)}>{children}</aside>;
};

export const SidebarHeader = ({ children, className = "" }) => (
  <div className={cn("p-4", className)}>{children}</div>
);

export const SidebarContent = ({ children, className = "" }) => (
  <div className={cn("flex-1 overflow-y-auto p-4", className)}>{children}</div>
);

export const SidebarGroup = ({ children, className = "" }) => (
  <div className={cn("mb-4", className)}>{children}</div>
);

export const SidebarGroupLabel = ({ children, className = "" }) => (
  <div className={cn("px-3 py-2 text-sm font-medium text-muted-foreground", className)}>{children}</div>
);

export const SidebarGroupContent = ({ children, className = "" }) => (
  <div className={cn("mt-1", className)}>{children}</div>
);

export const SidebarMenu = ({ children, className = "" }) => (
  <nav className={cn("space-y-1", className)}>{children}</nav>
);

export const SidebarMenuItem = ({ children, className = "" }) => (
  <div className={cn("", className)}>{children}</div>
);

export function SidebarMenuButton({ asChild = false, className = "", children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    // This correctly clones the child (the <Link> component) and merges the classNames
    return React.cloneElement(children, {
      className: `block w-full text-left px-3 py-2 rounded-lg transition-colors ${className} ${children.props.className || ''}`,
      ...props,
    });
  }
  
  // This is the default rendering if not using asChild
  return (
    <button
      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const SidebarFooter = ({ children, className = "" }) => (
  <div className={cn("p-4 border-t border-border", className)}>{children}</div>
);

export const SidebarTrigger = ({ className = "", ...props }) => {
  const { toggleSidebar } = useContext(SidebarContext); // Use context if you have a stateful sidebar
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "h-10 w-10", // Default size for an icon button
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      {/* Example icon, replace with a real icon like Menu from Lucide if desired */}
      ☰
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
};