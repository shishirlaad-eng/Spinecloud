import { ReactNode } from "react";
import { ClinicStaffHeader } from "./ClinicStaffHeader";
import { ClinicStaffSidebar } from "./ClinicStaffSidebar";

interface ClinicStaffLayoutProps {
  children: ReactNode;
  activeMenu: "calendar" | "patients" | "dashboard" | "questionnaires" | "consentForms" | "referrals";
  onNavigate: (menu: "calendar" | "patients" | "dashboard" | "questionnaires" | "consentForms" | "referrals") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ClinicStaffLayout({
  children,
  activeMenu,
  onNavigate,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount = 0,
}: ClinicStaffLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <ClinicStaffHeader 
        onLogout={onLogout} 
        onNavigateToProfile={onNavigateToProfile} 
        onNavigateToNotifications={onNavigateToNotifications}
        unreadNotificationsCount={unreadNotificationsCount}
      />
      <div className="flex">
        <ClinicStaffSidebar activeMenu={activeMenu} onNavigate={onNavigate} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}