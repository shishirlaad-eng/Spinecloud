import { Calendar, Users, ClipboardList, FileText, Send } from "lucide-react";

interface ClinicStaffSidebarProps {
  activeMenu: "calendar" | "patients" | "questionnaires" | "consentForms" | "referrals";
  onNavigate: (menu: "calendar" | "patients" | "questionnaires" | "consentForms" | "referrals") => void;
}

export function ClinicStaffSidebar({ activeMenu, onNavigate }: ClinicStaffSidebarProps) {
  const menuItems = [
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "patients" as const, label: "Patients", icon: Users },
    { id: "questionnaires" as const, label: "Patient Forms", icon: ClipboardList },
    { id: "consentForms" as const, label: "Agreements", icon: FileText },
    { id: "referrals" as const, label: "Referrals", icon: Send },
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
