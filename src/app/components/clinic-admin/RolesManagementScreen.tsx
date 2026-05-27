import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Shield, Users, Filter, X, HelpCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { TooltipBubble } from "../shared/TooltipBubble";
import { isStepCompleted } from "../shared/walkthroughUtils";

// Permission types for each module
type PermissionActions = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

type ModulePermissions = {
  dashboard: { view: boolean };
  branches: PermissionActions;
  patients: PermissionActions;
  questionnaires: PermissionActions;
  providers: PermissionActions;
  consentForms: PermissionActions;
  master: PermissionActions;
  roles: PermissionActions;
  users: PermissionActions;
  subscription: PermissionActions;
};

interface Role {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  permissions: ModulePermissions;
}

interface RolesManagementScreenProps {
  roles: Role[];
  userCounts: Record<string, number>;
  onNavigate: (menu: string) => void;
  onAddRole: () => void;
  onEditRole: (roleId: string) => void;
  onLogout?: () => void;
}

export function RolesManagementScreen({
  roles,
  userCounts,
  onNavigate,
  onAddRole,
  onEditRole,
  onLogout,
}: RolesManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "users" | "permissions" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    setActiveGuide(localStorage.getItem("spinecloud_active_guide"));
    setBubbleDismissed(localStorage.getItem("spinecloud_bubble_dismissed_roles") === "true");
  }, []);

  const handleDismissBubble = () => {
    setBubbleDismissed(true);
    localStorage.setItem("spinecloud_bubble_dismissed_roles", "true");
  };

  // Count total permissions for a role
  const countPermissions = (role: Role): number => {
    let count = 0;
    if (role.permissions.dashboard?.view) count++;
    if (role.permissions.branches) {
      count += Object.values(role.permissions.branches).filter(Boolean).length;
    }
    if (role.permissions.patients) {
      count += Object.values(role.permissions.patients).filter(Boolean).length;
    }
    if (role.permissions.questionnaires) {
      count += Object.values(role.permissions.questionnaires).filter(Boolean).length;
    }
    if (role.permissions.providers) {
      count += Object.values(role.permissions.providers).filter(Boolean).length;
    }
    if (role.permissions.consentForms) {
      count += Object.values(role.permissions.consentForms).filter(Boolean).length;
    }
    if (role.permissions.master) {
      count += Object.values(role.permissions.master).filter(Boolean).length;
    }
    if (role.permissions.roles) {
      count += Object.values(role.permissions.roles).filter(Boolean).length;
    }
    if (role.permissions.users) {
      count += Object.values(role.permissions.users).filter(Boolean).length;
    }
    if (role.permissions.subscription) {
      count += Object.values(role.permissions.subscription).filter(Boolean).length;
    }
    return count;
  };

  // Get top permission modules for display
  const getTopModules = (role: Role): string[] => {
    const modules = [];
    
    if (role.permissions.dashboard?.view) modules.push("Dashboard");
    if (role.permissions.branches && Object.values(role.permissions.branches).some(Boolean)) modules.push("Branches");
    if (role.permissions.patients && Object.values(role.permissions.patients).some(Boolean)) modules.push("Patients");
    if (role.permissions.questionnaires && Object.values(role.permissions.questionnaires).some(Boolean)) modules.push("Questionnaires");
    if (role.permissions.providers && Object.values(role.permissions.providers).some(Boolean)) modules.push("Providers");
    if (role.permissions.consentForms && Object.values(role.permissions.consentForms).some(Boolean)) modules.push("Consent Forms");
    if (role.permissions.master && Object.values(role.permissions.master).some(Boolean)) modules.push("Master");
    if (role.permissions.roles && Object.values(role.permissions.roles).some(Boolean)) modules.push("Roles");
    if (role.permissions.users && Object.values(role.permissions.users).some(Boolean)) modules.push("Users");
    if (role.permissions.subscription && Object.values(role.permissions.subscription).some(Boolean)) modules.push("Subscription");
    
    return modules;
  };

  const filteredRoles = (roles || []).filter((role) => {
    const matchesSearch =
      searchQuery === "" ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || role.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "status") {
      const statusA = a.status || "";
      const statusB = b.status || "";
      return sortOrder === "asc"
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    } else {
      const aPerms = countPermissions(a);
      const bPerms = countPermissions(b);
      return sortOrder === "asc" ? aPerms - bPerms : bPerms - aPerms;
    }
  });

  const handleSort = (field: "name" | "users" | "permissions" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage);
  const currentRoles = sortedRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ClinicAdminLayout activeMenu="roles" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            Roles Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Create and manage user roles with custom permissions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                  activeFilterCount > 0
                    ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                title="Filters"
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950">
                    {activeFilterCount}
                  </span>
                )}
              </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Status
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "all", label: "All" },
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="status"
                              checked={statusFilter === option.value}
                              onChange={() => setStatusFilter(option.value)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                      }}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
              <button
                onClick={onAddRole}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
              <TooltipBubble
                step="Step 2"
                title="Configure user roles"
                description="Click 'Add role' to define permissions for your staff members. You can control which modules they have access to."
                side="left"
                visible={!bubbleDismissed && (activeGuide === "roles" || (!isStepCompleted("roles") && activeGuide !== "skipped"))}
                onDismiss={handleDismissBubble}
              />
            </div>
          </div>
        </div>

        {/* Roles Table */}
        {sortedRoles.length > 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Role Name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortBy === "status" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Description
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("permissions")}
                    >
                      <div className="flex items-center gap-2">
                        Permissions
                        {sortBy === "permissions" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("users")}
                    >
                      <div className="flex items-center gap-2">
                        Assigned Users
                        {sortBy === "users" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentRoles.map((role) => {
                    const userCount = userCounts[role.name] || 0;
                    return (
                      <tr
                        key={role.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onEditRole(role.id)}
                            className="flex items-center gap-3 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {role.name}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          role.status === "Active" 
                            ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                        }`}>
                          {role.status || "Inactive"}
                        </span>
                      </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 max-w-md">
                            {role.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {getTopModules(role).slice(0, 3).map((permission, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300"
                              >
                                {permission}
                              </span>
                            ))}
                            {getTopModules(role).length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-950/30 text-xs text-primary-700 dark:text-primary-400 font-medium">
                                +{getTopModules(role).length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {userCount} {userCount === 1 ? 'user' : 'users'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedRoles.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No roles found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "Get started by creating your first role"}
            </p>
            {!searchQuery && activeFilterCount === 0 && (
              <button
                onClick={onAddRole}
                className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            )}
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}