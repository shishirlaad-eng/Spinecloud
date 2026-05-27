import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Shield, Check, Building2, Users, FileText, UserCog, FileCheck, Settings, CreditCard, LayoutDashboard, Stethoscope, Lock, ChevronRight, Database, ChevronDown, X, Search, Activity, Mail, SearchCode, Calendar, CalendarOff, Receipt, DollarSign, BarChart3, ShieldAlert, DoorClosed, ClipboardList, FolderOpen, Building, Ticket } from "lucide-react";
import { completeStep, isStepCompleted } from "../shared/walkthroughUtils";

// Permission types for each module
type PermissionActions = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type ModulePermissions = {
  dashboard: { view: boolean };
  calendar: PermissionActions;
  holidays: PermissionActions;
  branches: PermissionActions;
  patients: PermissionActions;
  questionnaires: PermissionActions;
  providers: PermissionActions;
  consentForms: PermissionActions;
  master: PermissionActions;
  roles: PermissionActions;
  users: PermissionActions;
  subscription: PermissionActions;
  invoices: PermissionActions;
  payments: PermissionActions;
  reports: PermissionActions;
  activityLog: { view: boolean };
  auditLog: { view: boolean };
  rooms: PermissionActions;
  soapMaster: PermissionActions;
  clinicalRecords: PermissionActions;
  emailManagement: PermissionActions;
  clinicSettings: PermissionActions;
  tickets: PermissionActions;
  carePlanMaster: PermissionActions;
};

interface Role {
  id?: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  permissions: ModulePermissions;
  branchIds?: string[];
}

interface Branch {
  id: string;
  name: string;
}

interface AddEditRoleScreenProps {
  role?: Role;
  mode: "add" | "edit";
  availableBranches: Branch[];
  onNavigate: (menu: any) => void;
  onBack: () => void;
  onSave: (role: Role) => void;
  onLogout?: () => void;
}

// Module definitions with icons and display names
const modules = [
  { 
    key: "dashboard" as const, 
    name: "Dashboard", 
    icon: LayoutDashboard,
    actions: ["view"] as const,
    description: "View analytics and metrics"
  },
  { 
    key: "calendar" as const, 
    name: "Appointments", 
    icon: Calendar,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage patient appointments"
  },
  { 
    key: "holidays" as const, 
    name: "Holidays", 
    icon: CalendarOff,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage clinic holidays"
  },
  { 
    key: "branches" as const, 
    name: "Branches", 
    icon: Building2,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage branch locations"
  },
  { 
    key: "patients" as const, 
    name: "Patients", 
    icon: Users,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage patient records"
  },
  { 
    key: "questionnaires" as const, 
    name: "Questionnaires", 
    icon: FileText,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Configure intake questionnaires"
  },
  { 
    key: "providers" as const, 
    name: "Providers", 
    icon: Stethoscope,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage healthcare providers"
  },
  { 
    key: "consentForms" as const, 
    name: "Consent Forms", 
    icon: FileCheck,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage consent forms"
  },
  { 
    key: "master" as const, 
    name: "Master (Services)", 
    icon: Settings,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Full access to service management"
  },
  { 
    key: "roles" as const, 
    name: "Roles", 
    icon: Shield,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage user roles and permissions"
  },
  { 
    key: "users" as const, 
    name: "Users", 
    icon: UserCog,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage system users"
  },
  { 
    key: "subscription" as const, 
    name: "Subscription", 
    icon: CreditCard,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage subscription and billing"
  },
  { 
    key: "invoices" as const, 
    name: "Invoices", 
    icon: Receipt,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage billing invoices"
  },
  { 
    key: "payments" as const, 
    name: "Payments", 
    icon: DollarSign,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage patient payments"
  },
  { 
    key: "reports" as const, 
    name: "Reports", 
    icon: BarChart3,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Access administrative reports"
  },
  { 
    key: "activityLog" as const, 
    name: "Activity Log", 
    icon: Activity,
    actions: ["view"] as const,
    description: "View system activity logs"
  },
  { 
    key: "auditLog" as const, 
    name: "Audit Log", 
    icon: ShieldAlert,
    actions: ["view"] as const,
    description: "Access security audit logs"
  },
  { 
    key: "rooms" as const, 
    name: "Rooms", 
    icon: DoorClosed,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage clinic rooms"
  },
  { 
    key: "soapMaster" as const, 
    name: "SOAP Master", 
    icon: ClipboardList,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Configure SOAP note templates"
  },
  { 
    key: "clinicalRecords" as const, 
    name: "Clinical Records", 
    icon: FolderOpen,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage patient clinical documentation"
  },
  { 
    key: "emailManagement" as const, 
    name: "Email Management", 
    icon: Mail,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage automated email templates"
  },
  { 
    key: "clinicSettings" as const, 
    name: "Clinic Settings", 
    icon: Building,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Configure global clinic settings"
  },
  { 
    key: "tickets" as const, 
    name: "Ticket Management", 
    icon: Ticket,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage support and internal tickets"
  },
  { 
    key: "carePlanMaster" as const, 
    name: "Care Plan Master", 
    icon: Database,
    actions: ["view", "create", "edit", "delete"] as const,
    description: "Manage care plan templates"
  },
];

export function AddEditRoleScreen({
  role,
  mode,
  availableBranches,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: AddEditRoleScreenProps) {
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  
  // Initialize permissions with default structure
  const getDefaultPermissions = (): ModulePermissions => ({
    dashboard: { view: false },
    calendar: { view: false, create: false, edit: false, delete: false },
    holidays: { view: false, create: false, edit: false, delete: false },
    branches: { view: false, create: false, edit: false, delete: false },
    patients: { view: false, create: false, edit: false, delete: false },
    questionnaires: { view: false, create: false, edit: false, delete: false },
    providers: { view: false, create: false, edit: false, delete: false },
    consentForms: { view: false, create: false, edit: false, delete: false },
    master: { view: false, create: false, edit: false, delete: false },
    roles: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
    subscription: { view: false, create: false, edit: false, delete: false },
    invoices: { view: false, create: false, edit: false, delete: false },
    payments: { view: false, create: false, edit: false, delete: false },
    reports: { view: false, create: false, edit: false, delete: false },
    activityLog: { view: false },
    auditLog: { view: false },
    rooms: { view: false, create: false, edit: false, delete: false },
    soapMaster: { view: false, create: false, edit: false, delete: false },
    clinicalRecords: { view: false, create: false, edit: false, delete: false },
    emailManagement: { view: false, create: false, edit: false, delete: false },
    clinicSettings: { view: false, create: false, edit: false, delete: false },
    tickets: { view: false, create: false, edit: false, delete: false },
    carePlanMaster: { view: false, create: false, edit: false, delete: false },
  });

  const [permissions, setPermissions] = useState<ModulePermissions>(
    role?.permissions || getDefaultPermissions()
  );
  const [status, setStatus] = useState<"Active" | "Inactive">(role?.status || "Active");
  const [assignBranches, setAssignBranches] = useState<"all" | "selected" | "none">(
    role?.branchIds ? (role.branchIds.length === availableBranches.length ? "all" : "selected") : "all"
  );
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    role?.branchIds && role.branchIds.length < availableBranches.length ? role.branchIds : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGuided, setIsGuided] = useState(false);

  useEffect(() => {
    const activeGuide = localStorage.getItem("spinecloud_active_guide");
    const explicitlyGuided = activeGuide === "roles";
    const theoreticallyGuided = !isStepCompleted("roles") && activeGuide !== "skipped";
    setIsGuided((explicitlyGuided || theoreticallyGuided) && mode === "add");
  }, [mode]);

  const togglePermission = (moduleKey: keyof ModulePermissions, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey][action as keyof typeof prev[typeof moduleKey]],
      },
    }));
  };

  const toggleAllForModule = (moduleKey: keyof ModulePermissions) => {
    const module = modules.find(m => m.key === moduleKey);
    if (!module) return;

    const currentPerms = permissions[moduleKey];
    const allEnabled = module.actions.every(action => currentPerms[action as keyof typeof currentPerms]);

    setPermissions((prev) => ({
      ...prev,
      [moduleKey]: module.actions.reduce((acc, action) => ({
        ...acc,
        [action]: !allEnabled
      }), {} as any),
    }));
  };

  const toggleAllForAction = (action: string) => {
    const allEnabled = modules.every(module => {
      if (!module.actions.includes(action as any)) return true;
      return permissions[module.key][action as keyof typeof permissions[typeof module.key]];
    });

    setPermissions((prev) => {
      const newPerms = { ...prev };
      modules.forEach(module => {
        if (module.actions.includes(action as any)) {
          (newPerms as any)[module.key] = {
            ...newPerms[module.key],
            [action]: !allEnabled
          };
        }
      });
      return newPerms;
    });
  };

  const toggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Role name is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    // Check if at least one permission is enabled
    const hasAnyPermission = modules.some(module => 
      module.actions.some(action => 
        permissions[module.key][action as keyof typeof permissions[typeof module.key]]
      )
    );
    
    if (!hasAnyPermission) {
      newErrors.permissions = "At least one permission is required";
    }
    
    if (assignBranches === "selected" && selectedBranches.length === 0) {
      newErrors.branchIds = "At least one branch must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const branchIdsToSave = assignBranches === "all" 
      ? availableBranches.map(b => b.id) 
      : assignBranches === "selected" 
        ? selectedBranches 
        : [];

    const roleData: Role = {
      ...(role?.id && { id: role.id }),
      name,
      description,
      status,
      permissions,
      branchIds: branchIdsToSave,
    };

    if (isGuided) {
      const nextRoute = completeStep("roles");
      onSave(roleData);
      if (nextRoute) {
        setTimeout(() => onNavigate(nextRoute as any), 100);
      }
    } else {
      onSave(roleData);
    }
  };

  // Count enabled permissions
  const permissionCount = modules.reduce((count, module) => 
    count + module.actions.filter(action => 
      permissions[module.key][action as keyof typeof permissions[typeof module.key]]
    ).length
  , 0);

  return (
    <ClinicAdminLayout activeMenu="roles" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to roles
            </button>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              {mode === "add" ? "Add new role" : "Edit role"}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {mode === "add"
                ? "Create a new role with custom permissions"
                : "Update role information and permissions"}
            </p>
          </div>

          {/* Guided setup strip */}
        {isGuided && (
          <div className="mb-6 flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">2</div>
            <div>
              <p className="text-sm font-semibold text-primary-900">Step 2 of 5 — Configure a User Role</p>
              <p className="text-xs text-primary-700 mt-0.5">Select the permissions carefully. The users assigned to this role will ONLY be able to perform these actions and view selected modules. Once saved, you will be redirected to the next step.</p>
            </div>
          </div>
        )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide mb-4">
                BASIC INFORMATION
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Role name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter role name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="description"
                    placeholder="Enter role description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-invalid={!!errors.description}
                    rows={3}
                    className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] aria-[invalid=true]:border-destructive resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Role Status</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Control if this role can currently be assigned to users</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${status === "Active" ? "text-success-600" : "text-neutral-500"}`}>
                        {status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          status === "Active" ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            status === "Active" ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                    PERMISSIONS
                  </h2>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {permissionCount} permission{permissionCount !== 1 ? 's' : ''} selected
                </span>
              </div>

              {errors.permissions && (
                <p className="text-xs text-destructive mb-4">{errors.permissions}</p>
              )}

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left py-3 pr-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 min-w-[200px]">
                        Module
                      </th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 min-w-[80px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>View</span>
                          <button
                            type="button"
                            onClick={() => toggleAllForAction("view")}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Update all
                          </button>
                        </div>
                      </th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 min-w-[80px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Create</span>
                          <button
                            type="button"
                            onClick={() => toggleAllForAction("create")}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Update all
                          </button>
                        </div>
                      </th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 min-w-[80px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Edit</span>
                          <button
                            type="button"
                            onClick={() => toggleAllForAction("edit")}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Update all
                          </button>
                        </div>
                      </th>
                      <th className="text-center py-3 px-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 min-w-[80px]">
                        <div className="flex flex-col items-center gap-1">
                          <span>Delete</span>
                          <button
                            type="button"
                            onClick={() => toggleAllForAction("delete")}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Update all
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {modules.map((module) => {
                      const Icon = module.icon;
                      const modulePerms = permissions[module.key];
                      const hasAnyPermission = module.actions.some(action => 
                        modulePerms[action as keyof typeof modulePerms]
                      );
                      
                      return (
                        <tr 
                          key={module.key}
                          className={hasAnyPermission ? "bg-primary-50/50 dark:bg-primary-950/20" : ""}
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-start gap-3">
                              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {module.name}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => toggleAllForModule(module.key)}
                                    className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                  >
                                    Update all
                                  </button>
                                </div>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          {["view", "create", "edit", "delete"].map((action) => {
                            const hasAction = module.actions.includes(action as any);
                            const isEnabled = hasAction && modulePerms[action as keyof typeof modulePerms];
                            
                            return (
                              <td key={action} className="py-4 px-3">
                                <div className="flex justify-center">
                                  {hasAction ? (
                                    <button
                                      type="button"
                                      onClick={() => togglePermission(module.key, action)}
                                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        isEnabled
                                          ? "bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500"
                                          : "border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-500"
                                      }`}
                                    >
                                      {isEnabled && <Check className="w-3 h-3 text-white" />}
                                    </button>
                                  ) : (
                                    <span className="text-neutral-300 dark:text-neutral-700">—</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Branches */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                    BRANCH ACCESS
                  </h2>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selectedBranches.length} selected
                </span>
              </div>

              {errors.branchIds && (
                <p className="text-xs text-destructive mb-4">{errors.branchIds}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Select which branches this role can access
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedBranches.length === availableBranches.length) {
                        setSelectedBranches([]);
                      } else {
                        setSelectedBranches(availableBranches.map((b) => b.id));
                      }
                    }}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    {selectedBranches.length === availableBranches.length
                      ? "Deselect all"
                      : "Select all"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAssignBranches("all")}
                    className={`flex items-center gap-2 px-3 h-9 rounded-md text-sm transition-colors ${
                      assignBranches === "all"
                        ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    All Branches
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignBranches("selected")}
                    className={`flex items-center gap-2 px-3 h-9 rounded-md text-sm transition-colors ${
                      assignBranches === "selected"
                        ? "bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-medium"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Selected Branches
                  </button>
                </div>

                {assignBranches === "selected" && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableBranches.map((branch) => {
                      const isSelected = selectedBranches.includes(branch.id);
                      return (
                        <button
                          key={branch.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedBranches(selectedBranches.filter(id => id !== branch.id));
                            } else {
                              setSelectedBranches([...selectedBranches, branch.id]);
                            }
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                            isSelected
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                              : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500"
                                  : "border-neutral-300 dark:border-neutral-700"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                isSelected
                                  ? "text-neutral-900 dark:text-white"
                                  : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {branch.name}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                {mode === "add" ? "Add role" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}