import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, Download, Calendar, Clock, User, FileText, X } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  date: string;
  time: string;
  action: string;
  entityType: "Patient" | "Appointment" | "Invoice" | "Session" | "Referral" | "Imaging" | "User";
  entityReference: string;
  performedBy: string;
  userRole: "Provider" | "Clinic Staff" | "Admin";
  location?: string;
}

interface ActivityLogScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "reports") => void;
  onLogout?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function ActivityLogScreen({
  onNavigate,
  onLogout,
  onNavigateToProfile,
  onNavigateToNotifications,
  unreadNotificationsCount,
}: ActivityLogScreenProps) {
  // Mock data
  const allActivities: ActivityLogEntry[] = [
    {
      id: "act-001",
      date: "2026-01-30",
      time: "14:30",
      action: "Appointment created",
      entityType: "Appointment",
      entityReference: "APT-2301 - Sarah Johnson",
      performedBy: "Emily Rodriguez",
      userRole: "Clinic Staff",
      location: "Downtown Clinic",
    },
    {
      id: "act-002",
      date: "2026-01-30",
      time: "14:15",
      action: "Invoice marked as paid",
      entityType: "Invoice",
      entityReference: "INV-1024 - $250.00",
      performedBy: "Michael Chen",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "act-003",
      date: "2026-01-30",
      time: "13:45",
      action: "Session marked as completed",
      entityType: "Session",
      entityReference: "APT-2299 - James Wilson",
      performedBy: "Dr. Sarah Thompson",
      userRole: "Provider",
      location: "Westside Branch",
    },
    {
      id: "act-004",
      date: "2026-01-30",
      time: "13:20",
      action: "Patient intake submitted",
      entityType: "Patient",
      entityReference: "PT-4562 - Maria Garcia",
      performedBy: "Maria Garcia",
      userRole: "Patient" as any,
      location: "Downtown Clinic",
    },
    {
      id: "act-005",
      date: "2026-01-30",
      time: "12:50",
      action: "Referral created",
      entityType: "Referral",
      entityReference: "REF-892 - Orthopedic Specialist",
      performedBy: "Dr. David Kim",
      userRole: "Provider",
      location: "Eastside Clinic",
    },
    {
      id: "act-006",
      date: "2026-01-30",
      time: "11:30",
      action: "Imaging uploaded",
      entityType: "Imaging",
      entityReference: "IMG-445 - X-Ray Lumbar Spine",
      performedBy: "Emily Rodriguez",
      userRole: "Clinic Staff",
      location: "Downtown Clinic",
    },
    {
      id: "act-007",
      date: "2026-01-30",
      time: "11:00",
      action: "Appointment rescheduled",
      entityType: "Appointment",
      entityReference: "APT-2295 - John Smith",
      performedBy: "John Smith",
      userRole: "Patient" as any,
      location: "Westside Branch",
    },
    {
      id: "act-008",
      date: "2026-01-30",
      time: "10:15",
      action: "Invoice created",
      entityType: "Invoice",
      entityReference: "INV-1025 - $180.00",
      performedBy: "System",
      userRole: "Admin",
      location: "Downtown Clinic",
    },
    {
      id: "act-009",
      date: "2026-01-30",
      time: "09:45",
      action: "Provider logged in",
      entityType: "User",
      entityReference: "Dr. Michael Chen",
      performedBy: "Dr. Michael Chen",
      userRole: "Provider",
      location: "Downtown Clinic",
    },
    {
      id: "act-010",
      date: "2026-01-30",
      time: "09:30",
      action: "Patient profile created",
      entityType: "Patient",
      entityReference: "PT-4563 - Emma Davis",
      performedBy: "Emily Rodriguez",
      userRole: "Clinic Staff",
      location: "Downtown Clinic",
    },
    {
      id: "act-011",
      date: "2026-01-29",
      time: "16:20",
      action: "Appointment cancelled",
      entityType: "Appointment",
      entityReference: "APT-2290 - Robert Brown",
      performedBy: "Robert Brown",
      userRole: "Patient" as any,
      location: "Eastside Clinic",
    },
    {
      id: "act-012",
      date: "2026-01-29",
      time: "15:40",
      action: "Session marked as completed",
      entityType: "Session",
      entityReference: "APT-2288 - Linda Martinez",
      performedBy: "Dr. Sarah Thompson",
      userRole: "Provider",
      location: "Westside Branch",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");
  const [selectedUserRole, setSelectedUserRole] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("today");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const entityTypes = Array.from(new Set(allActivities.map((a) => a.entityType))).sort();
  const userRoles = Array.from(new Set(allActivities.map((a) => a.userRole))).sort();
  const locations = Array.from(
    new Set(allActivities.map((a) => a.location).filter((l): l is string => !!l))
  ).sort();

  // Filter activities
  const filteredActivities = allActivities.filter((activity) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.entityReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    // Entity type filter
    const matchesEntityType =
      selectedEntityType === "all" || activity.entityType === selectedEntityType;

    // User role filter
    const matchesUserRole = selectedUserRole === "all" || activity.userRole === selectedUserRole;

    // Location filter
    const matchesLocation =
      selectedLocation === "all" || activity.location === selectedLocation;

    // Date range filter
    let matchesDateRange = true;
    const today = new Date();
    const activityDate = new Date(activity.date);

    if (dateRange === "today") {
      matchesDateRange =
        activityDate.toDateString() === today.toDateString();
    } else if (dateRange === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesDateRange = activityDate >= weekAgo;
    } else if (dateRange === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDateRange = activityDate >= monthAgo;
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
    const rows = filteredActivities.map((activity) => [
      activity.date,
      activity.time,
      activity.action,
      activity.entityType,
      activity.entityReference,
      activity.performedBy,
      activity.userRole,
      activity.location || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
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
      case "Session":
        return "bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300";
      case "Referral":
        return "bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-300";
      case "Imaging":
        return "bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300";
      case "User":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
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
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            Activity Log
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Monitor day-to-day operations and activities across your clinic
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search activities, users, or references..."
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
            Showing <span className="font-medium text-neutral-900 dark:text-white">{filteredActivities.length}</span> of{" "}
            <span className="font-medium text-neutral-900 dark:text-white">{allActivities.length}</span> activities
          </p>
        </div>

        {/* Activity Log Table */}
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
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No activities found
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                        Try adjusting your filters or search query
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white whitespace-nowrap">
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {activity.time}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white font-medium">
                        {activity.action}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getEntityTypeColor(activity.entityType)}`}>
                          {activity.entityType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {activity.entityReference}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-900 dark:text-white">
                        {activity.performedBy}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getUserRoleColor(activity.userRole)}`}>
                          {activity.userRole}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                        {activity.location || "—"}
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
