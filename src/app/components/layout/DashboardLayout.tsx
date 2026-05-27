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
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "spineCloud" | "tickets" | "settings" | "clinicalRecords" | string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  onViewNotification?: (notificationId: string) => void;
  notifications?: Notification[];
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
}

export function DashboardLayout({ 
  children, 
  activeMenu, 
  onNavigate, 
  onLogout, 
  onNavigateToProfile,
  onNavigateToNotifications,
  onViewNotification,
  notifications = [],
  currentEntity,
  onEntitySwitch
}: DashboardLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarExpanded");
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    return false;
  });

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((prev: boolean) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebarExpanded", JSON.stringify(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FF", fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif" }}>
      {/* Header */}
      <Header 
        onToggleSidebar={handleToggleSidebar} 
        onLogout={onLogout}
        onNavigateToProfile={onNavigateToProfile}
        currentEntity={currentEntity}
        onEntitySwitch={onEntitySwitch}
      />

      {/* Sidebar */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onClose={() => {
          setIsSidebarExpanded(false);
          if (typeof window !== "undefined") {
            localStorage.setItem("sidebarExpanded", JSON.stringify(false));
          }
        }}
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