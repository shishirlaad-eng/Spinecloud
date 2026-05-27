import { X, LayoutDashboard, Calendar, FileText, Bell, Settings, MessageSquare, ClipboardList, Send } from "lucide-react";

interface SidebarProps {
  isExpanded: boolean;
  onClose: () => void;
  activeMenu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings" | "tickets" | "clinicalRecords" | "questionnaires" | "consentForms";
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings" | "tickets" | "clinicalRecords" | "questionnaires" | "consentForms") => void;
}

export function Sidebar({ isExpanded, onClose, activeMenu, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as const,       label: "Dashboard",         icon: LayoutDashboard },
    { id: "appointments" as const,    label: "Appointments",       icon: Calendar        },
    { id: "clinicalRecords" as const, label: "Clinical Records",   icon: ClipboardList   },
    { id: "invoices" as const,        label: "Invoices",           icon: FileText        },
    { id: "tickets" as const,         label: "Support tickets",    icon: MessageSquare   },
    { id: "settings" as const,        label: "Settings",           icon: Settings        },
    { id: "consentForms" as const,    label: "Forms and Agreements", icon: FileText        },
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
        className={`fixed top-16 left-0 bottom-0 bg-white border-r border-[#EFF4FF] z-40 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        }`}
        style={{ fontFamily: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif" }}
      >
        {/* Close Button (Mobile Only) */}
        {isExpanded && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-[#404750] dark:text-neutral-400 hover:bg-[#eff4ff] dark:hover:bg-neutral-800 transition-colors md:hidden"
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
                  if (window.innerWidth < 768) onClose();
                }}
                className={`relative w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-colors overflow-hidden ${
                  isActive
                    ? "bg-[#eff4ff] dark:bg-primary-950/30 text-[#1d77b4] dark:text-primary-300"
                    : "text-[#404750] dark:text-neutral-300 hover:bg-[#f8f9ff] dark:hover:bg-neutral-800"
                }`}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {/* Active Indicator on the Right Edge */}
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#1d77b4] rounded-l-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}