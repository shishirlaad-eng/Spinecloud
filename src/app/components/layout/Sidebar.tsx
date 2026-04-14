import { X, LayoutDashboard, Calendar, User, FileText, Bell, Settings, Activity, MessageSquare } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  onClose: () => void;
  activeMenu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings" | "spineCloud" | "tickets";
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings" | "spineCloud" | "tickets") => void;
}

export function Sidebar({ isExpanded, onClose, activeMenu, onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "appointments" as const,
      label: "Appointments",
      icon: Calendar,
    },
    {
      id: "spineCloud" as const,
      label: "SpineCloud Index",
      icon: Activity,
    },
    {
      id: "invoices" as const,
      label: "Invoices",
      icon: FileText,
    },
    {
      id: "tickets" as const,
      label: "Support tickets",
      icon: MessageSquare,
    },
    {
      id: "settings" as const,
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-neutral-950/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
      >
        {/* Close Button (Mobile Only) */}
        {isExpanded && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Menu Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}