import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, Download, Calendar, Clock, User, FileText, Shield, AlertTriangle } from "lucide-react";

interface AuditLogEntry {
  id: string;
  date: string;
  time: string;
  action: string;
  entityType: "Patient" | "Invoice" | "Service" | "User" | "Settings" | "SOAP Note" | "Appointment" | "Payment";
  entityReference: string;
  performedBy: string;
  userRole: "Provider" | "Clinic Staff" | "Admin";
  location?: string;
}

interface AuditLogScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "reports") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function AuditLogScreen({
  onNavigate,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount,
}: AuditLogScreenProps) {
  // Mock data - audit-specific actions focused on compliance
  const allAuditEntries: AuditLogEntry[] = [
    {
      id: "audit-001",
      date: "2026-01-30",
      time: "14:45",
      action: "Invoice payment status changed",
      entityType: "Invoice",
      entityReference: "INV-1024 - $250.00",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-002",
      date: "2026-01-30",
      time: "14:30",
      action: "User role updated",
      entityType: "User",
      entityReference: "USR-025 - Emily Rodriguez",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-003",
      date: "2026-01-30",
      time: "13:50",
      action: "SOAP note finalized",
      entityType: "SOAP Note",
      entityReference: "SOAP-892 - James Wilson",
      performedBy: "Dr. Sarah Thompson",
      userRole: "Provider",
      location: "Westside Branch",
    },
    {
      id: "audit-004",
      date: "2026-01-30",
      time: "13:20",
      action: "Patient email modified",
      entityType: "Patient",
      entityReference: "PT-4562 - Maria Garcia",
      performedBy: "Emily Rodriguez",
      userRole: "Clinic Staff",
      location: "Downtown Clinic",
    },
    {
      id: "audit-005",
      date: "2026-01-30",
      time: "12:15",
      action: "Appointment permanently deleted",
      entityType: "Appointment",
      entityReference: "APT-2275 - John Smith",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-006",
      date: "2026-01-30",
      time: "11:45",
      action: "Patient data exported",
      entityType: "Patient",
      entityReference: "EXPORT-445 - 250 records",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-007",
      date: "2026-01-30",
      time: "11:20",
      action: "User permissions changed",
      entityType: "User",
      entityReference: "USR-028 - David Kim",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-008",
      date: "2026-01-30",
      time: "10:50",
      action: "Invoice amount adjusted",
      entityType: "Invoice",
      entityReference: "INV-1022 - $200.00",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-009",
      date: "2026-01-30",
      time: "10:15",
      action: "System settings modified",
      entityType: "Settings",
      entityReference: "Appointment duration - 45 min",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-010",
      date: "2026-01-30",
      time: "09:45",
      action: "User account locked",
      entityType: "User",
      entityReference: "USR-032 - System Lockout",
      performedBy: "System",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-011",
      date: "2026-01-29",
      time: "16:30",
      action: "Invoice deleted",
      entityType: "Invoice",
      entityReference: "INV-1018 - $150.00",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "audit-012",
      date: "2026-01-29",
      time: "15:20",
      action: "Service deactivated",
      entityType: "Service",
      entityReference: "SVC-045 - Initial Consultation",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");
  const [selectedUserRole, setSelectedUserRole] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("today");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const entityTypes = Array.from(new Set(allAuditEntries.map((a) => a.entityType))).sort();
  const userRoles = Array.from(new Set(allAuditEntries.map((a) => a.userRole))).sort();
  const locations = Array.from(
    new Set(allAuditEntries.map((a) => a.location).filter((l): l is string => !!l))
  ).sort();

  // Filter audit entries
  const filteredEntries = allAuditEntries.filter((entry) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entityReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Entity type filter
    const matchesEntityType =
      selectedEntityType === "all" || entry.entityType === selectedEntityType;

    // User role filter
    const matchesUserRole = selectedUserRole === "all" || entry.userRole === selectedUserRole;

    // Location filter
    const matchesLocation =
      selectedLocation === "all" || entry.location === selectedLocation;

    // Date range filter
    let matchesDateRange = true;
    const today = new Date();
    const entryDate = new Date(entry.date);

    if (dateRange === "today") {
      matchesDateRange =
        entryDate.toDateString() === today.toDateString();
    } else if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesDateRange = entryDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDateRange = entryDate >= monthAgo;
    }

    return matchesSearch && matchesEntityType && matchesUserRole && matchesLocation && matchesDateRange;
  });

  // Get active filter count
  const activeFilterCount =
    (selectedEntityType !== "all" ? 1 : 0) +
    (selectedUserRole !== "all" ? 1 : 0) +
    (selectedLocation !== "all" ? 1 : 0) +
    (dateRange !== "today" ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedEntityType("all");
    setSelectedUserRole("all");
    setSelectedLocation("all");
    setDateRange("today");
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["Date", "Time", "Action", "Entity Type", "Entity Reference", "Performed By", "User Role", "Location"];
    const rows = filteredEntries.map((entry) => [
      entry.date,
      entry.time,
      entry.action,
      entry.entityType,
      entry.entityReference,
      entry.performedBy,
      entry.userRole,
      entry.location || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Get entity type color
  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case "Patient":
        return "bg-primary-100 text-primary-700 dark:bg-primary-950/30 dark:text-primary-300";
      case "Appointment":
        return "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-300";
      case "Invoice":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300";
      case "SOAP Note":
        return "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300";
      case "Payment":
        return "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300";
      case "Service":
        return "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300";
      case "User":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
      case "Settings":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300";
      default:
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  // Get user role color
  const getUserRoleColor = (role: string) => {
    switch (role) {
      case "Provider":
        return "bg-primary-50 text-primary-700 dark:bg-primary-950/20 dark:text-primary-300";
      case "Admin":
        return "bg-destructive-50 text-destructive-700 dark:bg-destructive-950/20 dark:text-destructive-300";
      case "Clinic Staff":
        return "bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-300";
      default:
        return "bg-neutral-50 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  return (
    <ClinicAdminLayout
      activeMenu="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onNavigateToProfile={onNavigateToProfile}
      onNavigateToNotifications={onNavigateToNotifications}
      unreadNotificationsCount={unreadNotificationsCount}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                Audit Log
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Compliance and security trail for all sensitive data modifications
              </p>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                  Restricted Access - Audit Trail
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This log contains sensitive compliance data. All entries are tamper-proof and read-only. 
                  Actions logged here include data modifications, access changes, and security events.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search audit actions, entities, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="h-10 px-4 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {/* Date Range Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Date range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as any)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                {/* Entity Type Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Entity type
                  </label>
                  <select
                    value={selectedEntityType}
                    onChange={(e) => setSelectedEntityType(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All types</option>
                    {entityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* User Role Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    User role
                  </label>
                  <select
                    value={selectedUserRole}
                    onChange={(e) => setSelectedUserRole(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All roles</option>
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters & Clear */}
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {dateRange !== "today" && (
                      <span className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-sm">
                        <Calendar className="w-3 h-3" />
                        {dateRange === "week" ? "Last 7 days" : dateRange === "month" ? "Last 30 days" : "All time"}
                      </span>
                    )}
                    {selectedEntityType !== "all" && (
                      <span className={`inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-sm ${getEntityTypeColor(selectedEntityType)}`}>
                        <FileText className="w-3 h-3" />
                        {selectedEntityType}
                      </span>
                    )}
                    {selectedUserRole !== "all" && (
                      <span className={`inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-sm ${getUserRoleColor(selectedUserRole)}`}>
                        <User className="w-3 h-3" />
                        {selectedUserRole}
                      </span>
                    )}
                    {selectedLocation !== "all" && (
                      <span className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm">
                        {selectedLocation}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing <span className="font-medium text-neutral-900 dark:text-white">{filteredEntries.length}</span> of{" "}
            <span className="font-medium text-neutral-900 dark:text-white">{allAuditEntries.length}</span> audit entries
          </p>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Action / Activity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Entity Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Entity Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Performed By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    User Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <Shield className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No audit entries found
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                        Try adjusting your filters or search query
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {entry.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white font-medium">
                        {entry.action}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getEntityTypeColor(entry.entityType)}`}>
                          {entry.entityType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {entry.entityReference}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {entry.performedBy}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getUserRoleColor(entry.userRole)}`}>
                          {entry.userRole}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {entry.location || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
