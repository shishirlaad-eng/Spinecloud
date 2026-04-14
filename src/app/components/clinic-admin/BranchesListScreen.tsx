import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Building2, Filter, X, Download } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { TooltipBubble } from "../shared/TooltipBubble";
import { isStepCompleted } from "../shared/walkthroughUtils";

interface WorkingHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

interface Branch {
  id: string;
  name: string;
  clinicName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  status: "Active" | "Inactive";
  workingHours: WorkingHours;
}

interface BranchesListScreenProps {
  branches: Branch[];
  onNavigate: (menu: string) => void;
  onAddBranch: () => void;
  onViewBranch: (branchId: string) => void;
  onLogout?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export function BranchesListScreen({
  branches,
  onNavigate,
  onAddBranch,
  onViewBranch,
  onLogout,
  onNavigateToNotifications,
  unreadNotificationsCount,
}: BranchesListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "city" | "status">("name");
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
    setBubbleDismissed(localStorage.getItem("spinecloud_bubble_dismissed_branches") === "true");
  }, []);

  const handleDismissBubble = () => {
    setBubbleDismissed(true);
    localStorage.setItem("spinecloud_bubble_dismissed_branches", "true");
  };

  // Filter branches
  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      searchQuery === "" ||
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || branch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort branches
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "city") {
      return sortOrder === "asc"
        ? a.city.localeCompare(b.city)
        : b.city.localeCompare(a.city);
    } else {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
  });

  const handleSort = (field: "name" | "city" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = (statusFilter !== "all" ? 1 : 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedBranches.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClinicAdminLayout activeMenu="branches" onNavigate={onNavigate} onLogout={onLogout} onNavigateToNotifications={onNavigateToNotifications} unreadNotificationsCount={unreadNotificationsCount}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Branches Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your clinic branch locations
            </p>
          </div>
          {/* Add Branch button with guided tooltip bubble */}
          <div className="relative">
            <button
              onClick={onAddBranch}
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Branch
            </button>
            <TooltipBubble
              step="Step 1"
              title="Add your first branch"
              description="Click 'Add Branch' to set up your first clinic location. You'll enter the name, address, and working hours."
              side="left"
              visible={!bubbleDismissed && (activeGuide === "branches" || (!isStepCompleted("branches") && activeGuide !== "skipped"))}
              onDismiss={handleDismissBubble}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => console.log("Exporting branches...")}
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

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Status
                      </label>
                      <div className="space-y-2">
                        {["all", "Active", "Inactive"].map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="status"
                              checked={statusFilter === status}
                              onChange={() => setStatusFilter(status)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {status === "all" ? "All Statuses" : status}
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
        </div>

        {/* Branches Table */}
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
                        Branch Name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Clinic
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("city")}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {sortBy === "city" && (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((branch) => (
                    <tr
                      key={branch.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewBranch(branch.id)}
                          className="flex items-center gap-3 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {branch.name}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {branch.clinicName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {branch.city}, {branch.state}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                            branch.status === "Active"
                              ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                          }`}
                        >
                          {branch.status}
                        </span>
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
              <Building2 className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No branches found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first branch"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <button
                onClick={onAddBranch}
                className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Branch
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {sortedBranches.length > 0 && (
          <Pagination
            totalItems={sortedBranches.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={Math.ceil(sortedBranches.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </ClinicAdminLayout>
  );
}