/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";

const NavigationContext = createContext(undefined);

export const NavigationProvider = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((item) => item !== menu)
        : [...prev, menu]
    );
  };

  return (
    <NavigationContext.Provider
      value={{
        isSidebarExpanded,
        toggleSidebar,
        expandedMenus,
        toggleMenu,
        setExpandedMenus,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
