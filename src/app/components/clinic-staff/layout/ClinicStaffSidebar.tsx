import { Calendar, Users } from "lucide-react";

interface ClinicStaffSidebarProps {
  activeMenu: "calendar" | "patients";
  onNavigate: (menu: "calendar" | "patients") => void;
}

export function ClinicStaffSidebar({ activeMenu, onNavigate }: ClinicStaffSidebarProps) {
  const menuItems = [
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "patients" as const, label: "Patients", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 h-10 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
