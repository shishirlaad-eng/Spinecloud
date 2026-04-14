import { useState } from "react";
import { ProviderHeader } from "./ProviderHeader";
import { ProviderSidebar } from "./ProviderSidebar";

interface ProviderLayoutProps {
  children: React.ReactNode;
  activeMenu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves";
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ProviderLayout({
  children,
  activeMenu,
  onNavigate,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount = 0,
}: ProviderLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <ProviderHeader
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToNotifications={onNavigateToNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Sidebar */}
      <ProviderSidebar
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
    </div>
  );
}