import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Users as UsersIcon, Mail, Clock, CheckCircle, XCircle, Filter, X, Download, Link2, RotateCcw, ChevronDown, CheckCircle2, HelpCircle, BookOpen, ChevronUp } from "lucide-react";
import { Pagination } from "../shared/Pagination";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  tag: "Invited" | "Accepted" | "Link Expired" | "Pending";
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
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "role" | "status" | "tag" | "invitedAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userToResend, setUserToResend] = useState<User | null>(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resentId, setResentId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter, roleFilter, dateFrom, dateTo]);

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

    const matchesTag =
      tagFilter === "all" || user.tag === tagFilter;

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesDate = (() => {
      if (!dateFrom && !dateTo) return true;
      const invitedDate = new Date(user.invitedAt).getTime();
      if (dateFrom && invitedDate < new Date(dateFrom).getTime()) return false;
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (invitedDate > toDate.getTime()) return false;
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesTag && matchesRole && matchesDate;
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
    } else if (sortBy === "status") {
      const statusA = a.status || "";
      const statusB = b.status || "";
      return sortOrder === "asc"
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    } else if (sortBy === "tag") {
      const tagA = a.tag || "";
      const tagB = b.tag || "";
      return sortOrder === "asc"
        ? tagA.localeCompare(tagB)
        : tagB.localeCompare(tagA);
    } else {
      return sortOrder === "asc"
        ? new Date(a.invitedAt).getTime() - new Date(b.invitedAt).getTime()
        : new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime();
    }
  });

  const handleSort = (field: "name" | "role" | "status" | "tag" | "invitedAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) +
    (tagFilter !== "all" ? 1 : 0) +
    (roleFilter !== "all" ? 1 : 0) +
    (dateFrom || dateTo ? 1 : 0);

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCopiedId(id);
    // In a real app, copy actual link to clipboard
    navigator.clipboard.writeText(`https://spinecloud.iq/invite/${id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResendClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setUserToResend(user);
    setShowResendModal(true);
  };

  const confirmResend = () => {
    if (userToResend) {
      onResendInvite(userToResend.id);
      setResentId(userToResend.id);
      setTimeout(() => setResentId(null), 2000);
      setShowResendModal(false);
      setUserToResend(null);
    }
  };

  const getStatusBadge = (status: "Active" | "Inactive") => {
    const styles = {
      Active: "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800",
      Inactive: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700",
    };

    const style = styles[status] || styles.Inactive;
    const label = status || "Inactive";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
        {label}
      </span>
    );
  };

  const getTagBadge = (tag: "Invited" | "Accepted" | "Link Expired" | "Pending") => {
    const styles = {
      Invited: "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border-primary-200 dark:border-primary-800",
      Accepted: "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800",
      "Link Expired": "bg-destructive-50 dark:bg-destructive-950/30 text-destructive-700 dark:text-destructive-400 border-destructive-200 dark:border-destructive-800",
      Pending: "bg-warning-50 dark:bg-warning-950/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800",
    };

    const style = styles[tag] || "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
    const label = tag || "Pending";

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
        {label}
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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            User Management
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Invite and manage clinic staff members
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3 items-center">
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
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                        >
                          <option value="all">All statuses</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Tag
                      </label>
                      <div className="relative">
                        <select
                          value={tagFilter}
                          onChange={(e) => setTagFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                        >
                          <option value="all">All tags</option>
                          <option value="Invited">Invited</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Link Expired">Link Expired</option>
                          <option value="Pending">Pending</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Role
                      </label>
                      <div className="relative">
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                        >
                          <option value="all">All roles</option>
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Invited Date
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="flex-1 h-10 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-white focus:border-primary-600 outline-none min-w-0"
                          title="From Date"
                        />
                        <span className="text-neutral-500">-</span>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="flex-1 h-10 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-white focus:border-primary-600 outline-none min-w-0"
                          title="To Date"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setTagFilter("all");
                        setRoleFilter("all");
                        setDateFrom("");
                        setDateTo("");
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

          <button
              onClick={onAddUser}
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Invite User
            </button>
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
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("tag")}
                    >
                      <div className="flex items-center gap-2">
                        Tag
                        {sortBy === "tag" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("invitedAt")}
                    >
                      <div className="flex items-center gap-2">
                        Invited
                        {sortBy === "invitedAt" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((user) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                      onClick={() => onEditUser(user.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
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
                      <td className="px-6 py-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getTagBadge(user.tag)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(user.invitedAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="relative group/tooltip">
                            <button
                              onClick={(e) => handleCopyLink(e, user.id)}
                              className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
                            >
                              {copiedId === user.id ? (
                                <CheckCircle className="w-4 h-4 text-success-500" />
                              ) : (
                                <Link2 className="w-4 h-4" />
                              )}
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block px-2 py-1 bg-neutral-800 text-white text-[10px] rounded whitespace-nowrap z-10">
                              {copiedId === user.id ? "Copied!" : "Copy Link"}
                            </div>
                          </div>

                          <div className="relative group/tooltip">
                            <button
                              onClick={(e) => handleResendClick(e, user)}
                              className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
                            >
                              {resentId === user.id ? (
                                <CheckCircle className="w-4 h-4 text-success-500" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                            </button>
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block px-2 py-1 bg-neutral-800 text-white text-[10px] rounded whitespace-nowrap z-10">
                              {resentId === user.id ? "Resent!" : "Resend Link"}
                            </div>
                          </div>
                        </div>
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

      {/* Resend Confirmation Modal */}
      {showResendModal && userToResend && (
        <div className="fixed inset-0 bg-neutral-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Resend Invitation
                </h3>
                <button
                  onClick={() => setShowResendModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">User Name</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {userToResend.firstName} {userToResend.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">Email</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    {userToResend.email}
                  </span>
                </div>
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                    A new invitation link will be generated and sent to this email address. The previous link will be invalidated.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowResendModal(false)}
                  className="flex-1 h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResend}
                  className="flex-1 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                >
                  Confirm Resend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClinicAdminLayout>
  );
}