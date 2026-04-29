import { useState } from "react";
import { ProviderHeader } from "./ProviderHeader";

interface ProviderLayoutProps {
  children: React.ReactNode;
  activeMenu: "dashboard" | "calendar" | "patients" | "leaves";
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "leaves") => void;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header with Horizontal Navigation */}
      <ProviderHeader
        activeMenu={activeMenu}
        onNavigate={onNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToNotifications={onNavigateToNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Main Content */}
      <main className="pt-16 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
}