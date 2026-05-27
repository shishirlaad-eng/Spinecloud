import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { UserPlus, Search, Stethoscope, MoreVertical, Edit2, UserCheck, Filter, X, Plus, Lock, Download, Calendar, HelpCircle, BookOpen, ChevronUp } from "lucide-react";
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
  createdAt?: string;
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
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "specialty" | "status" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const renderKnowledgePanel = () => {
    if (!showKnowledgePanel) return null;
    return (
      <>
        <div className="fixed inset-0 bg-neutral-950/40 z-40" onClick={() => setShowKnowledgePanel(false)} />
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Providers Management</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Knowledge Guide</p>
              </div>
            </div>
            <button onClick={() => setShowKnowledgePanel(false)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-left">
            {[
              {
                id: "overview",
                title: "What is the Providers Module?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The <strong className="text-neutral-800 dark:text-neutral-200">Providers module</strong> allows clinic administrators to manage all healthcare staff — including chiropractors, physical therapists, and massage therapists — who deliver services across your branches. Each provider profile controls availability, branch assignments, and self-booking eligibility.
                  </p>
                ),
              },
              {
                id: "status",
                title: "Provider Status Types",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <div><p className="font-semibold text-neutral-800 dark:text-neutral-200">Active</p><p>The provider has accepted their invitation and can receive bookings. Their availability schedule is live.</p></div>
                    <div><p className="font-semibold text-neutral-800 dark:text-neutral-200">Invited</p><p>An invitation email has been sent but the provider has not yet accepted or created their account.</p></div>
                    <div><p className="font-semibold text-neutral-800 dark:text-neutral-200">Suspended</p><p>The provider is temporarily deactivated. They cannot log in or receive new bookings, but their records are preserved.</p></div>
                  </div>
                ),
              },
              {
                id: "schedule",
                title: "Availability & Branch Assignments",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>Each provider must have an availability schedule configured before patients can book appointments with them. From the provider detail page you can:</p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Set working hours by day of the week</li>
                      <li>Assign the provider to one or more branches</li>
                      <li>Enable or disable self-booking eligibility for patients</li>
                      <li>Block out leave periods using the leave management tab</li>
                    </ul>
                  </div>
                ),
              },
            ].map((section) => {
              const isExpanded = expandedSection === section.id;
              return (
                <div key={section.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <button type="button" onClick={() => setExpandedSection(isExpanded ? null : section.id)} className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{section.title}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                  </button>
                  {isExpanded && <div className="px-5 pb-5 pt-1">{section.content}</div>}
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">This guide reflects the current capabilities of the Providers module in SpineCloudIQ.</p>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, branchFilter, specialtyFilter, startDateFilter, endDateFilter]);

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

  const allBranches = Array.from(new Set((providers || []).flatMap((p) => p.branches)));
  const allSpecialties = Array.from(new Set((providers || []).map((p) => p.specialty)));

  const filteredProviders = (providers || []).filter((provider) => {
    const fullName = `${provider.firstName} ${provider.lastName}`.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || provider.accountStatus === statusFilter;
    const matchesBranch = branchFilter === "all" || provider.branches.includes(branchFilter);
    const matchesSpecialty = specialtyFilter === "all" || provider.specialty === specialtyFilter;

    let matchesDate = true;
    if (provider.createdAt) {
      const createdDate = new Date(provider.createdAt).getTime();
      if (startDateFilter) {
        matchesDate = matchesDate && createdDate >= new Date(startDateFilter).getTime();
      }
      if (endDateFilter) {
        matchesDate = matchesDate && createdDate <= new Date(endDateFilter).setHours(23, 59, 59, 999);
      }
    }

    return matchesSearch && matchesStatus && matchesBranch && matchesSpecialty && matchesDate;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === "createdAt") {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
    }
    if (sortBy === "name") {
      const aName = `${a.firstName} ${a.lastName}`;
      const bName = `${b.firstName} ${b.lastName}`;
      return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName);
    } else if (sortBy === "specialty") {
      return sortOrder === "asc" ? a.specialty.localeCompare(b.specialty) : b.specialty.localeCompare(a.specialty);
    } else {
      return sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
    }
  });

  const handleSort = (field: "name" | "specialty" | "status" | "createdAt") => {
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
    (startDateFilter || endDateFilter ? 1 : 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProviders.slice(indexOfFirstItem, indexOfLastItem);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {renderKnowledgePanel()}
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Providers
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage medical staff, clinic assignments, and availability schedules
            </p>
          </div>
          <button type="button" onClick={() => setShowKnowledgePanel(true)} title="Module Knowledge Guide" className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg text-xs font-medium transition-colors shadow-sm">
            <HelpCircle className="w-4 h-4" />
            <span>Help Guide</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, email, or specialty"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
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
                <div className="absolute right-0 top-12 w-[360px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10 p-4">
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
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1">
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
                          <option value="Suspended">Suspended</option>
                          <option value="Invited">Invited</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Branch Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1">
                        Branch
                      </label>
                      <div className="relative">
                        <select
                          value={branchFilter}
                          onChange={(e) => setBranchFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                        >
                          <option value="all">All branches</option>
                          {allBranches.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Created Date Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Created Date
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={startDateFilter}
                          onChange={(e) => setStartDateFilter(e.target.value)}
                          className="flex-1 h-8 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none min-w-0"
                        />
                        <span className="text-neutral-500">-</span>
                        <input
                          type="date"
                          value={endDateFilter}
                          onChange={(e) => setEndDateFilter(e.target.value)}
                          className="flex-1 h-8 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none min-w-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setBranchFilter("all");
                        setSpecialtyFilter("all");
                        setStartDateFilter("");
                        setEndDateFilter("");
                      }}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {onAddProvider && (
              <button
                onClick={onAddProvider}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Provider
              </button>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center gap-2">Created Date {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">Provider Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Email Address</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort("specialty")}>
                    <div className="flex items-center gap-2">Specialty {sortBy === "specialty" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Branches</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-2">Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {currentItems.map((provider) => (
                  <tr
                    key={provider.id}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                    onClick={() => onViewProvider(provider.id)}
                  >
                    {/* Created Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(provider.createdAt)}
                      </p>
                    </td>

                    {/* Provider Name */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 text-xs">
                          {provider.firstName[0]}{provider.lastName[0]}
                        </div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {provider.firstName} {provider.lastName}
                        </p>
                      </div>
                    </td>

                    {/* Email Address */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {provider.email}
                      </p>
                    </td>

                    {/* Specialty */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {provider.specialty}
                      </span>
                    </td>

                    {/* Branches */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="relative group/tooltip">
                        <div className="flex items-center gap-2 cursor-help">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-950/30 text-[11px] font-bold text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50">
                            {provider.branches.length}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {provider.branches.length === 1 ? "Location" : "Locations"}
                          </span>
                        </div>
                        {provider.branches.length > 0 && (
                          <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-neutral-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">
                            {provider.branches.join(", ")}
                            <div className="absolute top-full left-4 border-4 border-transparent border-t-neutral-900"></div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                          provider.accountStatus === "Active"
                            ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                            : provider.accountStatus === "Invited"
                            ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {provider.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
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
      </div>
    </ClinicAdminLayout>
  );
}