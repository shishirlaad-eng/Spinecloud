import { useState, ReactNode, CSSProperties } from "react";
import { ClinicAdminHeader } from "./ClinicAdminHeader";
import { ClinicAdminSidebar } from "./ClinicAdminSidebar";

interface ClinicAdminLayoutProps {
  children: ReactNode;
  activeMenu?: string;
  currentPage?: string;
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ClinicAdminLayout({ 
  children, 
  activeMenu,
  currentPage,
  onNavigate, 
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount = 0
}: ClinicAdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("clinic_admin_hb_mode") === "dark";
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window === "undefined") return "ocean";
    return localStorage.getItem("clinic_admin_hb_theme") ?? "ocean";
  });
  const resolvedActiveMenu = activeMenu ?? currentPage ?? "dashboard";
  const themeVars: Record<string, CSSProperties> = {
    black: {
      "--primary": "#111827",
      "--primary-50": "#F3F4F6",
      "--primary-100": "#E5E7EB",
      "--primary-200": "#D1D5DB",
      "--primary-300": "#9CA3AF",
      "--primary-400": "#6B7280",
      "--primary-500": "#374151",
      "--primary-600": "#111827",
      "--primary-700": "#0F172A",
      "--primary-800": "#020617",
      "--primary-900": "#020617",
      "--primary-950": "#020617",
    } as CSSProperties,
    ocean: {
      "--primary": "#1766C2",
      "--primary-50": "#EEF6FF",
      "--primary-100": "#D9EBFF",
      "--primary-200": "#B7D9FF",
      "--primary-300": "#8AC2FF",
      "--primary-400": "#55A1F1",
      "--primary-500": "#2F82D8",
      "--primary-600": "#1766C2",
      "--primary-700": "#1355A1",
      "--primary-800": "#124985",
      "--primary-900": "#123E6E",
      "--primary-950": "#0C2748",
    } as CSSProperties,
    emerald: {
      "--primary": "#10B981",
      "--primary-50": "#ECFDF5",
      "--primary-100": "#D1FAE5",
      "--primary-200": "#A7F3D0",
      "--primary-300": "#6EE7B7",
      "--primary-400": "#34D399",
      "--primary-500": "#10B981",
      "--primary-600": "#059669",
      "--primary-700": "#047857",
      "--primary-800": "#065F46",
      "--primary-900": "#064E3B",
      "--primary-950": "#022C22",
    } as CSSProperties,
    violet: {
      "--primary": "#8B5CF6",
      "--primary-50": "#F5F3FF",
      "--primary-100": "#EDE9FE",
      "--primary-200": "#DDD6FE",
      "--primary-300": "#C4B5FD",
      "--primary-400": "#A78BFA",
      "--primary-500": "#8B5CF6",
      "--primary-600": "#7C3AED",
      "--primary-700": "#6D28D9",
      "--primary-800": "#5B21B6",
      "--primary-900": "#4C1D95",
      "--primary-950": "#2E1065",
    } as CSSProperties,
    amber: {
      "--primary": "#F59E0B",
      "--primary-50": "#FFFBEB",
      "--primary-100": "#FEF3C7",
      "--primary-200": "#FDE68A",
      "--primary-300": "#FCD34D",
      "--primary-400": "#FBBF24",
      "--primary-500": "#F59E0B",
      "--primary-600": "#D97706",
      "--primary-700": "#B45309",
      "--primary-800": "#92400E",
      "--primary-900": "#78350F",
      "--primary-950": "#451A03",
    } as CSSProperties,
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("clinic_admin_hb_theme", theme);
  };

  const handleModeChange = (mode: "light" | "dark") => {
    setIsDarkMode(mode === "dark");
    localStorage.setItem("clinic_admin_hb_mode", mode);
  };

  return (
    <div
      className={`clinic-admin-hb ${isDarkMode ? "dark" : ""} min-h-screen bg-white dark:bg-neutral-950 transition-colors`}
      style={themeVars[currentTheme] ?? themeVars.ocean}
    >
      <ClinicAdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
        activeMenu={resolvedActiveMenu}
        onNavigate={onNavigate}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <ClinicAdminHeader 
          onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)} 
          onLogout={onLogout}
          onNavigateToProfile={onNavigateToProfile}
          onNavigateToNotifications={onNavigateToNotifications}
          unreadNotificationsCount={unreadNotificationsCount}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          mode={isDarkMode ? "dark" : "light"}
          onModeChange={handleModeChange}
        />

        <main className="min-h-[calc(100vh-48px)] bg-white dark:bg-neutral-950">
          {children}
        </main>
      </div>
    </div>
  );
}
