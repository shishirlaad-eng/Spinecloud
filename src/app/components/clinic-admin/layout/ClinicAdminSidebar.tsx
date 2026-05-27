import {
  BarChart3,
  Building,
  Building2,
  Calendar,
  CalendarOff,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cog,
  CreditCard,
  DollarSign,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Mail,
  Menu,
  Receipt,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Sliders,
  Stethoscope,
  Ticket,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../../../assets/spinecloud-logo.png";

interface ClinicAdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeMenu: string;
  onNavigate: (menu: string) => void;
}

const baseSetupItems = [
  { id: "branches", label: "Branches", icon: Building2 },
  { id: "questionnaires", label: "Patient Forms", icon: ClipboardList },
  { id: "consentForms", label: "Agreements", icon: FileText },
  { id: "providers", label: "Providers", icon: UserCheck },
  { id: "services", label: "Services", icon: Settings },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "users", label: "Users", icon: Users },
];

const primaryItems = [
  { id: "calendar", label: "Appointments", icon: Calendar },
  { id: "holidays", label: "Holidays", icon: CalendarOff },
  { id: "patients", label: "Patients", icon: UserCog },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "auditLog", label: "Audit Log", icon: ShieldAlert },
  { id: "clinicalRecords", label: "Clinical Records", icon: FolderOpen },
];

const configurationItems = [
  { id: "soapMaster", label: "SOAP Master", icon: Stethoscope },
  { id: "carePlanMaster", label: "Care Plans Master", icon: Settings },
  { id: "clinic-settings", label: "Clinic Settings", icon: Building },
  { id: "email-management", label: "Email Management", icon: Mail },
];

function isActiveGroup(activeMenu: string, ids: string[]) {
  return ids.includes(activeMenu);
}

export function ClinicAdminSidebar({
  isCollapsed,
  onToggleCollapse,
  activeMenu,
  onNavigate,
}: ClinicAdminSidebarProps) {
  const [isTicketsExpanded, setIsTicketsExpanded] = useState(
    activeMenu === "tickets" || activeMenu === "raise-ticket",
  );
  const [isBaseSetupExpanded, setIsBaseSetupExpanded] = useState(
    isActiveGroup(activeMenu, ["baseSetup", ...baseSetupItems.map((item) => item.id)]),
  );
  const [isConfigurationsExpanded, setIsConfigurationsExpanded] = useState(
    isActiveGroup(activeMenu, configurationItems.map((item) => item.id)),
  );

  useEffect(() => {
    if (isActiveGroup(activeMenu, ["baseSetup", ...baseSetupItems.map((item) => item.id)])) {
      setIsBaseSetupExpanded(true);
    }
    if (isActiveGroup(activeMenu, configurationItems.map((item) => item.id))) {
      setIsConfigurationsExpanded(true);
    }
    if (["tickets", "raise-ticket"].includes(activeMenu)) {
      setIsTicketsExpanded(true);
    }
  }, [activeMenu]);

  const navItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-3 h-10 rounded-lg transition-colors ${
      active
        ? "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
    } ${isCollapsed ? "justify-center" : ""}`;

  const subItemClass = (active: boolean) =>
    `w-full flex items-center gap-2 px-3 h-9 rounded-lg transition-colors text-sm ${
      active
        ? "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400 font-semibold"
        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 z-40 transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className={`h-12 px-3 flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <img src={logo} alt="SpineCloud IQ" className="h-8 w-auto object-contain shrink-0" />
            <span className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
              Clinic Admin
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <nav className="px-2 py-2 space-y-1 overflow-y-auto overflow-x-hidden flex-1">
        <button
          onClick={() => onNavigate("dashboard")}
          className={navItemClass(activeMenu === "dashboard")}
          title={isCollapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium truncate">Dashboard</span>}
        </button>

        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate("baseSetup");
                return;
              }
              setIsBaseSetupExpanded((value) => !value);
            }}
            className={navItemClass(
              isActiveGroup(activeMenu, ["baseSetup", ...baseSetupItems.map((item) => item.id)]),
            )}
            title={isCollapsed ? "Base Setup" : undefined}
          >
            <Sliders className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium truncate flex-1 text-left">Base Setup</span>
                {isBaseSetupExpanded ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
              </>
            )}
          </button>

          {!isCollapsed && isBaseSetupExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {baseSetupItems.map((subItem) => {
                const SubIcon = subItem.icon;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                    className={subItemClass(activeMenu === subItem.id)}
                  >
                    <SubIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={navItemClass(activeMenu === item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          );
        })}

        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate("clinic-settings");
                return;
              }
              setIsConfigurationsExpanded((value) => !value);
            }}
            className={navItemClass(isActiveGroup(activeMenu, configurationItems.map((item) => item.id)))}
            title={isCollapsed ? "Configurations" : undefined}
          >
            <Cog className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <>
                <span className="text-sm font-medium truncate flex-1 text-left">Configurations</span>
                {isConfigurationsExpanded ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
              </>
            )}
          </button>

          {!isCollapsed && isConfigurationsExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              {configurationItems.map((subItem) => {
                const SubIcon = subItem.icon;
                return (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                    className={subItemClass(activeMenu === subItem.id)}
                  >
                    <SubIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{subItem.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                onNavigate("tickets");
                return;
              }
              setIsTicketsExpanded((value) => !value);
            }}
            className={navItemClass(["tickets", "raise-ticket"].includes(activeMenu))}
            title={isCollapsed ? "Ticket Management" : undefined}
          >
            <Ticket className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
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

          {!isCollapsed && isTicketsExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              <button onClick={() => onNavigate("tickets")} className={subItemClass(activeMenu === "tickets")}>
                <Send className="w-4 h-4 shrink-0" />
                <span className="truncate">Tickets received</span>
              </button>
              <button
                onClick={() => onNavigate("raise-ticket")}
                className={subItemClass(activeMenu === "raise-ticket")}
              >
                <Ticket className="w-4 h-4 shrink-0" />
                <span className="truncate">Raise a ticket</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
