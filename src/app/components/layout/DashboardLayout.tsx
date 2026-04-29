import { useState, ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface Notification {
  id: string;
  type: "reminder" | "alert" | "message" | "action";
  category: "appointment" | "payment" | "document" | "general";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: "dashboard" | "appointments" | "invoices" | "notifications" | "spineCloud" | "tickets" | "settings" | "clinicalRecords";
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "spineCloud" | "tickets" | "settings" | "clinicalRecords") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  onViewNotification?: (notificationId: string) => void;
  notifications?: Notification[];
}

export function DashboardLayout({ 
  children, 
  activeMenu, 
  onNavigate, 
  onLogout, 
  onNavigateToProfile,
  onNavigateToNotifications,
  onViewNotification,
  notifications = []
}: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <Header 
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)} 
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToNotifications={onNavigateToNotifications}
        onViewNotification={onViewNotification}
        notifications={notifications}
      />

      {/* Sidebar */}
      <Sidebar
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
        <div className="p-5 md:p-6">{children}</div>
      </main>
    </div>
  );
}