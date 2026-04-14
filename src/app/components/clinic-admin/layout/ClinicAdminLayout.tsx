import { useState, ReactNode } from "react";
import { ClinicAdminHeader } from "./ClinicAdminHeader";
import { ClinicAdminSidebar } from "./ClinicAdminSidebar";
import { WalkthroughPanel } from "../../shared/WalkthroughPanel";

interface ClinicAdminLayoutProps {
  children: ReactNode;
  activeMenu: string;
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ClinicAdminLayout({ 
  children, 
  activeMenu, 
  onNavigate, 
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount = 0
}: ClinicAdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <ClinicAdminHeader 
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToNotifications={onNavigateToNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Sidebar */}
      <ClinicAdminSidebar
        isExpanded={isSidebarExpanded}
        onClose={() => setIsSidebarExpanded(false)}
        activeMenu={activeMenu}
        onNavigate={onNavigate}
      />

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarExpanded ? "md:pl-64" : "pl-16"
        }`}
      >
        {children}
      </main>

      {/* Global Walkthrough floating icon */}
      <WalkthroughPanel onNavigate={onNavigate} activeMenu={activeMenu} />
    </div>
  );
}