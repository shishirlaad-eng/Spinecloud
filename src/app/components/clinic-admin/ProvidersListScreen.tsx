import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { UserPlus, Search, Stethoscope, MoreVertical, Edit2, UserCheck, Filter, X, Plus, Lock, Download } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { TooltipBubble } from "../shared/TooltipBubble";
import { isStepCompleted } from "../shared/walkthroughUtils";

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty: string;
  branches: string[];
  status: "Invited" | "Active" | "Suspended";
  accountStatus: "Invited" | "Active" | "Suspended";
  availabilityStatus: "Configured" | "Not Configured";
  selfBookingEligible: boolean;
  hasSchedule: boolean;
  hasVisitTypes: boolean;
  invitationSent?: boolean;
  invitationDate?: string;
}

interface ProvidersListScreenProps {
  providers: Provider[];
  onNavigate: (menu: any) => void;
  onViewProvider: (providerId: string) => void;
  onAddProvider: () => void;
  onResendInvitation?: (providerId: string) => void;
  onSuspendProvider?: (providerId: string) => void;
  onActivateProvider?: (providerId: string) => void;
  onLogout?: () => void;
}

export function ProvidersListScreen({
  providers,
  onNavigate,
  onViewProvider,
  onAddProvider,
  onResendInvitation,
  onSuspendProvider,
  onActivateProvider,
  onLogout,
}: ProvidersListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [selfBookableFilter, setSelfBookableFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "specialty" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, branchFilter, specialtyFilter, selfBookableFilter, availabilityFilter]);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    setActiveGuide(localStorage.getItem("spinecloud_active_guide"));
    setBubbleDismissed(localStorage.getItem("spinecloud_bubble_dismissed_providers") === "true");
  }, []);

  const handleDismissBubble = () => {
    setBubbleDismissed(true);
    localStorage.setItem("spinecloud_bubble_dismissed_providers", "true");
  };

  // Get unique values for filters
  const allBranches = Array.from(
    new Set((providers || []).flatMap((p) => p.branches))
  );
  const allSpecialties = Array.from(
    new Set((providers || []).map((p) => p.specialty))
  );

  const filteredProviders = (providers || []).filter((provider) => {
    const fullName = `${provider.firstName} ${provider.lastName}`.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || provider.accountStatus === statusFilter;

    const matchesBranch =
      branchFilter === "all" || provider.branches.includes(branchFilter);

    const matchesSpecialty =
      specialtyFilter === "all" || provider.specialty === specialtyFilter;

    const matchesSelfBookable =
      selfBookableFilter === "all" ||
      (selfBookableFilter === "yes" && provider.selfBookingEligible) ||
      (selfBookableFilter === "no" && !provider.selfBookingEligible);

    const matchesAvailability =
      availabilityFilter === "all" || provider.availabilityStatus === availabilityFilter;

    return matchesSearch && matchesStatus && matchesBranch && matchesSpecialty && matchesSelfBookable && matchesAvailability;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === "name") {
      const aName = `${a.firstName} ${a.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;
      return sortOrder === "asc"
        ? aName.localeCompare(bName)
        : bName.localeCompare(aName);
    } else if (sortBy === "specialty") {
      return sortOrder === "asc"
        ? a.specialty.localeCompare(b.specialty)
        : b.specialty.localeCompare(a.specialty);
    } else {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
  });

  const handleSort = (field: "name" | "specialty" | "status") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (branchFilter !== "all" ? 1 : 0) +
    (specialtyFilter !== "all" ? 1 : 0) +
    (selfBookableFilter !== "all" ? 1 : 0) +
    (availabilityFilter !== "all" ? 1 : 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProviders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Provider Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage provider schedules, branches, and availability
            </p>
          </div>
          {/* Add Provider button with guided tooltip bubble */}
          <div className="relative">
            <button
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              onClick={onAddProvider}
            >
              <Plus className="w-4 h-4" />
              Add provider
            </button>
            <TooltipBubble
              step="Step 3"
              title="Add providers"
              description="Click 'Add Provider' to add doctors or therapists to your clinic. They will be assigned to specific branches and services."
              side="left"
              visible={!bubbleDismissed && (activeGuide === "providers" || (!isStepCompleted("providers") && activeGuide !== "skipped"))}
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
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Export Button */}
          <button
            onClick={() => console.log("Exporting providers...")}
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
                        {["all", "Active", "Suspended"].map((status) => (
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

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Branch
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="branch"
                            checked={branchFilter === "all"}
                            onChange={() => setBranchFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All Branches
                          </span>
                        </label>
                        {allBranches.map((branch) => (
                          <label
                            key={branch}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="branch"
                              checked={branchFilter === branch}
                              onChange={() => setBranchFilter(branch)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {branch}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Specialty
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="specialty"
                            checked={specialtyFilter === "all"}
                            onChange={() => setSpecialtyFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All Specialties
                          </span>
                        </label>
                        {allSpecialties.map((specialty) => (
                          <label
                            key={specialty}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="specialty"
                              checked={specialtyFilter === specialty}
                              onChange={() => setSpecialtyFilter(specialty)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {specialty}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Self-Bookable
                      </label>
                      <div className="space-y-2">
                        {["all", "yes", "no"].map((selfBookable) => (
                          <label
                            key={selfBookable}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="selfBookable"
                              checked={selfBookableFilter === selfBookable}
                              onChange={() => setSelfBookableFilter(selfBookable)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {selfBookable === "all"
                                ? "All"
                                : selfBookable === "yes"
                                ? "Yes"
                                : "No"}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Availability
                      </label>
                      <div className="space-y-2">
                        {["all", "Configured", "Not Configured"].map((availability) => (
                          <label
                            key={availability}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="availability"
                              checked={availabilityFilter === availability}
                              onChange={() => setAvailabilityFilter(availability)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {availability === "all"
                                ? "All"
                                : availability}
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
                        setBranchFilter("all");
                        setSpecialtyFilter("all");
                        setSelfBookableFilter("all");
                        setAvailabilityFilter("all");
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

        {/* Providers Table */}
        {sortedProviders.length > 0 ? (
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
                        Provider name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("specialty")}
                    >
                      <div className="flex items-center gap-2">
                        Specialty
                        {sortBy === "specialty" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Assigned locations
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Self-booking
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Account status
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
                  {currentItems.map((provider) => {
                    return (
                      <tr
                        key={provider.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={() => onViewProvider(provider.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                {provider.firstName[0]}
                                {provider.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {provider.firstName} {provider.lastName}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {provider.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300">
                            {provider.specialty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950/30 text-sm font-medium text-primary-600 dark:text-primary-400">
                              {provider.branches.length}
                            </span>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {provider.branches.length > 0
                                ? provider.branches.slice(0, 1).join(", ") +
                                  (provider.branches.length > 1
                                    ? ` +${provider.branches.length - 1}`
                                    : "")
                                : "None"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {provider.selfBookingEligible ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-success-100 dark:bg-success-950/30 text-sm text-success-700 dark:text-success-400">
                              Enabled
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <Lock className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                Disabled
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                              provider.accountStatus === "Active"
                                ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                                : provider.accountStatus === "Invited"
                                ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {provider.accountStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedProviders.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedProviders.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No providers found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "No medical staff found in the system"}
            </p>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}