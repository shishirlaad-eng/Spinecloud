import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Users as UsersIcon, Mail, Clock, CheckCircle, XCircle, Filter, X, Download } from "lucide-react";
import { Pagination } from "../shared/Pagination";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Pending" | "Accepted" | "Expired";
  invitedAt: string;
  acceptedAt?: string;
}

interface UserManagementScreenProps {
  users: User[];
  onNavigate: (menu: string) => void;
  onAddUser: () => void;
  onEditUser: (userId: string) => void;
  onResendInvite: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onLogout?: () => void;
}

export function UserManagementScreen({
  users,
  onNavigate,
  onAddUser,
  onEditUser,
  onResendInvite,
  onDeleteUser,
  onLogout,
}: UserManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "role" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter]);

  // Get unique roles
  const roles = Array.from(new Set((users || []).map((u) => u.role)));

  // Filter users
  const filteredUsers = (users || []).filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      const aName = `${a.firstName} ${a.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;
      return sortOrder === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    } else if (sortBy === "role") {
      return sortOrder === "asc"
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
  });

  const handleSort = (field: "name" | "role" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0);

  const getStatusBadge = (status: "Pending" | "Accepted" | "Expired") => {
    const styles = {
      Pending: "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
      Accepted: "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400",
      Expired: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
    };

    const icons = {
      Pending: Clock,
      Accepted: CheckCircle,
      Expired: XCircle,
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClinicAdminLayout activeMenu="users" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              User Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Invite and manage clinic staff members
            </p>
          </div>
          <button
            onClick={onAddUser}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Invite User
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => console.log("Exporting users...")}
            className="inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                activeFilterCount > 0
                  ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs">
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
                          { value: "all", label: "All Statuses" },
                          { value: "Accepted", label: "Accepted" },
                          { value: "Pending", label: "Pending" },
                          { value: "Expired", label: "Expired" },
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

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Role
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="role"
                            checked={roleFilter === "all"}
                            onChange={() => setRoleFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All Roles
                          </span>
                        </label>
                        {roles.map((role) => (
                          <label
                            key={role}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="role"
                              checked={roleFilter === role}
                              onChange={() => setRoleFilter(role)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {role}
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
                        setRoleFilter("all");
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
        </div>

        {/* Users Table */}
        {currentItems.length > 0 ? (
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
                        Name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Email
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("role")}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {sortBy === "role" && (
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
                      Invited
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onEditUser(user.id)}
                          className="flex items-center gap-3 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(user.invitedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No users found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "Get started by inviting your first user"}
            </p>
            {!searchQuery && activeFilterCount === 0 && (
              <button
                onClick={onAddUser}
                className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Invite User
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {sortedUsers.length > 0 && (
          <Pagination
            totalItems={sortedUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={Math.ceil(sortedUsers.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </ClinicAdminLayout>
  );
}