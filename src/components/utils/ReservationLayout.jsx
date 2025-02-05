import { TopNav } from "../../components/layout/top-nav";
// import { SideNav } from "../../components/layout/side-nav";
import { NavigationProvider } from "../../context/NavigationContext";
import { useNavigation } from "../../context/NavigationContext"; // Import useNavigation

export default function Layout({ children }) {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-100">
        <TopNav />
        {/* <SideNav /> */}
        <MainContent>{children}</MainContent>
      </div>
    </NavigationProvider>
  );
}

// MainContent component to handle dynamic margin based on sidebar state
function MainContent({ children }) {
  const { isSidebarExpanded } = useNavigation(); // Get sidebar state

  return (
    <main
      className={`pt-14 transition-all duration-300 ${
        // isSidebarExpanded ? "pl-64" : "pl-16"
        isSidebarExpanded ? "p-4" : "pl-16"
      }`}
    >
      {children}
    </main>
  );
}
