import { LayoutDashboard, Building2, X, Shield, Users, ClipboardList, UserCheck, FileText, UserCog, Settings, CreditCard, Calendar, Receipt, DollarSign, BarChart3, FileCheck, ShieldAlert, DoorClosed, Activity, Stethoscope, Mail, Building, Ticket, ChevronDown, ChevronRight, CalendarOff } from "lucide-react";
import { useState } from "react";

interface ClinicAdminSidebarProps {
  isExpanded: boolean;
  onClose: () => void;
  activeMenu: string;
  onNavigate: (menu: string) => void;
}

export function ClinicAdminSidebar({ 
  isExpanded, 
  onClose, 
  activeMenu, 
  onNavigate 
}: ClinicAdminSidebarProps) {
  const [isTicketsExpanded, setIsTicketsExpanded] = useState(
    activeMenu === "tickets" || activeMenu === "raise-ticket"
  );
  const [isMasterExpanded, setIsMasterExpanded] = useState(
    activeMenu === "carePlanMaster" || activeMenu === "financialPlanMaster"
  );

  const menuItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "calendar" as const,
      label: "Appointments",
      icon: Calendar,
    },
    {
      id: "holidays" as const,
      label: "Holidays",
      icon: CalendarOff,
    },
    {
      id: "branches" as const,
      label: "Branches",
      icon: Building2,
    },
    {
      id: "patients" as const,
      label: "Patients",
      icon: UserCog,
    },
    {
      id: "questionnaires" as const,
      label: "Questionnaires",
      icon: ClipboardList,
    },
    {
      id: "providers" as const,
      label: "Providers",
      icon: UserCheck,
    },
    {
      id: "consentForms" as const,
      label: "Consent forms",
      icon: FileText,
    },
    {
      id: "services" as const,
      label: "Services",
      icon: Settings,
    },
    {
      id: "roles" as const,
      label: "Roles",
      icon: Shield,
    },
    {
      id: "users" as const,
      label: "Users",
      icon: Users,
    },
    {
      id: "subscription" as const,
      label: "Subscription",
      icon: CreditCard,
    },
    {
      id: "invoices" as const,
      label: "Invoices",
      icon: Receipt,
    },
    {
      id: "payments" as const,
      label: "Payments",
      icon: DollarSign,
    },
    {
      id: "reports" as const,
      label: "Reports",
      icon: BarChart3,
    },
    {
      id: "activityLog" as const,
      label: "Activity Log",
      icon: FileCheck,
    },
    {
      id: "auditLog" as const,
      label: "Audit Log",
      icon: ShieldAlert,
    },
    {
      id: "rooms" as const,
      label: "Rooms",
      icon: DoorClosed,
    },
    {
      id: "spineCloud" as const,
      label: "SpineCloud Index",
      icon: Activity,
    },
    {
      id: "soapMaster" as const,
      label: "SOAP Master",
      icon: Stethoscope,
    },
    {
      id: "email-management" as const,
      label: "Email Management",
      icon: Mail,
    },
    {
      id: "clinic-settings" as const,
      label: "Clinic Settings",
      icon: Building,
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
        className={`fixed top-16 left-0 bottom-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-40 transition-all duration-300 flex flex-col ${
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

        {/* Menu Items - Scrollable */}
        <nav className="p-2 space-y-1 overflow-y-auto flex-1">
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

          {/* Care Plans Master */}
          <button
            onClick={() => {
              onNavigate("carePlanMaster");
              if (window.innerWidth < 768) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-colors ${
              activeMenu === "carePlanMaster"
                ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
            title={!isExpanded ? "Care Plans Master" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium truncate flex-1 text-left">Care Plans Master</span>
            )}
          </button>

          {/* Ticket Management Submenu */}
          <div>
            {/* Submenu Header */}
            <button
              onClick={() => {
                setIsTicketsExpanded(!isTicketsExpanded);
                // On collapsed sidebar, expand sidebar when clicking
                if (!isExpanded && !isTicketsExpanded) {
                  setIsTicketsExpanded(true);
                }
              }}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-colors ${
                activeMenu === "tickets" || activeMenu === "raise-ticket"
                  ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
              title={!isExpanded ? "Ticket Management" : undefined}
            >
              <Ticket className="w-5 h-5 shrink-0" />
              {isExpanded && (
                <>
                  <span className="text-sm font-medium truncate flex-1 text-left">Ticket Management</span>
                  {isTicketsExpanded ? (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 shrink-0" />
                  )}
                </>
              )}
            </button>

            {/* Submenu Items */}
            {isExpanded && isTicketsExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                <button
                  onClick={() => {
                    onNavigate("tickets");
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 h-9 rounded-lg transition-colors text-sm ${
                    activeMenu === "tickets"
                      ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  Tickets received
                </button>

                <button
                  onClick={() => {
                    onNavigate("raise-ticket");
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center gap-2 px-3 h-9 rounded-lg transition-colors text-sm ${
                    activeMenu === "raise-ticket"
                      ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  Raise a ticket
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}