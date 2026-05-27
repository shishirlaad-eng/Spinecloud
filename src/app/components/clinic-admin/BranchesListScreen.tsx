import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Building2, Filter, X, Download, HelpCircle, BookOpen, Clock, Calendar, Ban, RefreshCw, UserCog, Globe, ChevronDown, ChevronUp, BarChart3, MoreVertical, Upload, Printer, LayoutGrid, List, Table2, Eye, Edit2, MapPin, Check } from "lucide-react";
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

type BranchWithBooking = Branch & { selfBookingEnabled?: boolean };
type ViewMode = "grid" | "list" | "table";
type BranchColumnId = "name" | "city" | "state" | "selfBooking" | "status" | "actions";

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
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const [showSummary, setShowSummary] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Record<BranchColumnId, boolean>>({
    name: true,
    city: true,
    state: true,
    selfBooking: true,
    status: true,
    actions: true,
  });

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
      branch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.state.toLowerCase().includes(searchQuery.toLowerCase());

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

  const activeBranches = filteredBranches.filter((branch) => branch.status === "Active").length;
  const inactiveBranches = filteredBranches.filter((branch) => branch.status === "Inactive").length;
  const selfBookingBranches = filteredBranches.filter((branch) => Boolean((branch as BranchWithBooking).selfBookingEnabled)).length;
  const isAllCurrentSelected = currentItems.length > 0 && currentItems.every((branch) => selectedIds.includes(branch.id));

  const ViewIcon = viewMode === "grid" ? LayoutGrid : viewMode === "list" ? List : Table2;
  const showTableColumnControl = viewMode === "table";
  const branchColumns: { id: BranchColumnId; label: string }[] = [
    { id: "name", label: "Branch Name" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "selfBooking", label: "Self-Booking" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Actions" },
  ];
  const activeColumnCount = branchColumns.filter((column) => visibleColumns[column.id]).length;

  const toggleColumn = (columnId: BranchColumnId) => {
    setVisibleColumns((current) => {
      if (current[columnId] && activeColumnCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const toggleSelectBranch = (branchId: string) => {
    setSelectedIds((current) =>
      current.includes(branchId)
        ? current.filter((id) => id !== branchId)
        : [...current, branchId]
    );
  };

  const toggleSelectAll = () => {
    if (isAllCurrentSelected) {
      setSelectedIds((current) => current.filter((id) => !currentItems.some((branch) => branch.id === id)));
      return;
    }

    setSelectedIds((current) => {
      const pageIds = currentItems.map((branch) => branch.id);
      return Array.from(new Set([...current, ...pageIds]));
    });
  };

  const statusBadge = (status: Branch["status"]) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`} />
      {status}
    </span>
  );

  const selfBookingBadge = (branch: Branch) => {
    const enabled = Boolean((branch as BranchWithBooking).selfBookingEnabled);
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
        <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-[#1766C2]" : "bg-neutral-400"}`} />
        {enabled ? "Enabled" : "Disabled"}
      </span>
    );
  };

  const renderViewOption = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      onClick={() => {
        setViewMode(mode);
        if (mode !== "table") {
          setShowColumnsPanel(false);
        }
        setShowViewMenu(false);
      }}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm transition-colors ${
        viewMode === mode
          ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const renderRowActions = (branch: Branch) => (
    <div className="relative">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpenActionId(openActionId === branch.id ? null : branch.id);
        }}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Branch actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {openActionId === branch.id && (
        <div
          className="absolute right-0 top-9 w-36 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-20"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={() => {
              setOpenActionId(null);
              onViewBranch(branch.id);
            }}
            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => {
              setOpenActionId(null);
              onViewBranch(branch.id);
            }}
            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      )}
    </div>
  );

  return (
    <ClinicAdminLayout activeMenu="branches" onNavigate={onNavigate} onLogout={onLogout} onNavigateToNotifications={onNavigateToNotifications} unreadNotificationsCount={unreadNotificationsCount}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Branches Management
            </h1>
            <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>Clinic Admin</span>
              <span>/</span>
              <span>Base Setup</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white">Branches</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage your clinic branch locations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showHeaderSearch ? (
              <div className="relative">
                <div className="h-12 w-[min(430px,calc(100vw-3rem))] flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm px-3">
                  <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search branches..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="min-w-0 flex-1 h-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  />
                  <button
                    onClick={() => setShowFilters((value) => !value)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors relative ${
                      activeFilterCount > 0
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    }`}
                    title="Filters"
                  >
                    <Filter className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowHeaderSearch(false);
                      setShowFilters(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    title="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {showFilters && (
                  <div className="absolute right-0 top-full mt-3 w-[520px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Filter By</h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="px-5 py-5 space-y-4">
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <div>
                          <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">Where</label>
                          <div className="relative">
                            <select
                              value="status"
                              onChange={() => undefined}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="status">Status</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">What</label>
                          <div className="relative">
                            <select
                              value={statusFilter}
                              onChange={(event) => setStatusFilter(event.target.value)}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="all">Select...</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                          </div>
                        </div>
                        <button
                          onClick={() => setStatusFilter("all")}
                          className="mb-1 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          title="Clear status filter"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="mx-auto flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        <Plus className="w-4 h-4" />
                        Add Filter
                      </button>
                    </div>
                    <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                      <button
                        onClick={() => setStatusFilter("all")}
                        className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        Clear All
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowHeaderSearch(true)}
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            {!showHeaderSearch && showTableColumnControl && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowColumnsPanel((value) => !value);
                    setShowViewMenu(false);
                    setShowMoreMenu(false);
                  }}
                  className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                    showColumnsPanel
                      ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                  title="Customized columns"
                >
                  <Table2 className="w-5 h-5" />
                </button>
                {showColumnsPanel && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowColumnsPanel(false)} />
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-30">
                      <div className="px-4 py-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <Table2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Columns</h3>
                        </div>
                        <button
                          onClick={() => setShowColumnsPanel(false)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                          title="Close columns"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3 space-y-2">
                        {branchColumns.map((column) => (
                          <button
                            key={column.id}
                            onClick={() => toggleColumn(column.id)}
                            className="w-full h-12 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between gap-3 text-left"
                          >
                            <span className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                                  visibleColumns[column.id]
                                    ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white"
                                    : "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700"
                                }`}
                              >
                                {visibleColumns[column.id] && (
                                  <Check className="w-3.5 h-3.5 text-white dark:text-neutral-950" />
                                )}
                              </span>
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                                {column.label}
                              </span>
                            </span>
                            <span className="text-neutral-900 dark:text-neutral-300 text-lg leading-none">·</span>
                          </button>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          {activeColumnCount} of {branchColumns.length} active
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="relative">
              <button
                onClick={onAddBranch}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm whitespace-nowrap"
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
            <button
              onClick={() => setShowSummary(!showSummary)}
              className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                showSummary
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
              title="Summary"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                  showMoreMenu
                    ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-30">
                  <button className="w-full px-4 py-2.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Import</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Export</span>
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    <span className="text-sm">Print</span>
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                title="View options"
              >
                <ViewIcon className="w-5 h-5" />
              </button>
              {showViewMenu && (
                <div className="absolute right-0 top-12 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-30">
                  {renderViewOption("grid", "Grid View", LayoutGrid)}
                  {renderViewOption("list", "List View", List)}
                  {renderViewOption("table", "Table View", Table2)}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowKnowledgePanel(true)}
              title="Module Knowledge Guide"
              className="inline-flex items-center gap-1.5 px-3 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Guide</span>
            </button>
          </div>
        </div>

        {showSummary && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Branches", value: filteredBranches.length, trend: "+12%" },
              { label: "Active", value: activeBranches, trend: "+5%" },
              { label: "Self-Booking", value: selfBookingBranches, trend: "+0%" },
              { label: "Inactive", value: inactiveBranches, trend: "-2%" },
            ].map((item) => (
              <div key={item.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{item.value}</p>
                      <p className={`text-xs font-medium ${item.trend.startsWith("-") ? "text-rose-600" : "text-emerald-600"}`}>
                        {item.trend}
                      </p>
                    </div>
                    <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-white">{item.label}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Knowledge Panel Overlay */}
        {showKnowledgePanel && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-neutral-950/40 z-40"
              onClick={() => setShowKnowledgePanel(false)}
            />
            {/* Slide-in Panel */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
              {/* Panel Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">Branches Management</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Knowledge Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowKnowledgePanel(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Sections */}
                {[
                  {
                    id: "overview",
                    icon: Building2,
                    title: "What is Branches Management?",
                    color: "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30",
                    content: (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        The <strong className="text-neutral-800 dark:text-neutral-200">Branches Management</strong> module allows your clinic to manage one or more physical locations under a single SpineCloudIQ account. Each branch represents a distinct clinic location — with its own address, contact information, operational hours, providers, and booking configuration. You can add as many branches as your subscription allows, making it easy to operate a multi-location practice from one platform.
                      </p>
                    ),
                  },
                  {
                    id: "locations",
                    icon: Globe,
                    title: "Adding & Managing Locations",
                    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                        <p>When you create a new branch, you will be asked to provide:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Branch Name</strong> – Unique name to identify the location</li>
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Full Address</strong> – Street, city, state, ZIP, and country</li>
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Contact Email</strong> – Primary email for this branch</li>
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Status</strong> – Active or Inactive</li>
                        </ul>
                        <p className="mt-2">Once created, a branch can be linked to providers, services, and appointment slots. You can deactivate a branch without losing its historical data.</p>
                      </div>
                    ),
                  },
                  {
                    id: "hours",
                    icon: Clock,
                    title: "Operational Hours",
                    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                        <p>Each branch can have its own operational hours configured per day of the week. You can:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li>Toggle each day as <strong className="text-neutral-700 dark:text-neutral-300">Open</strong> or <strong className="text-neutral-700 dark:text-neutral-300">Closed</strong></li>
                          <li>Set a specific <strong className="text-neutral-700 dark:text-neutral-300">opening</strong> and <strong className="text-neutral-700 dark:text-neutral-300">closing time</strong> per day</li>
                          <li>Configure different hours for weekdays and weekends</li>
                        </ul>
                        <p className="mt-2">These hours inform the appointment booking engine — slots will only be offered within the configured operational window for each branch.</p>
                      </div>
                    ),
                  },
                  {
                    id: "booking",
                    icon: Calendar,
                    title: "Booking Settings",
                    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                        <p>Each branch has its own booking configuration that controls how appointments are scheduled:</p>
                        <div className="space-y-2">
                          <div>
                            <p className="font-medium text-neutral-700 dark:text-neutral-300">Enable Self-Booking</p>
                            <p>When enabled, patients can book appointments for this branch directly from the patient portal — without requiring admin intervention. This toggle only controls <em>patient-initiated</em> booking access; admin and staff can always book manually regardless of this setting.</p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700 dark:text-neutral-300">Minimum Notice Period</p>
                            <p>Defines the minimum number of hours in advance that any appointment must be booked before it begins. For example, a minimum notice of 2 hours means patients cannot book a slot starting within the next 2 hours. This applies to both online and admin bookings.</p>
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700 dark:text-neutral-300">Maximum Future Booking Date</p>
                            <p>Limits how far in advance appointments can be scheduled. For example, setting this to 60 days means no appointment can be booked more than 60 days from today. This helps maintain a controlled and manageable schedule.</p>
                          </div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "cancellation",
                    icon: Ban,
                    title: "Cancellation Policy",
                    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                        <p>You can configure whether cancellations are permitted for this branch, and if so, define the rules:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Allow Cancellations</strong> – Toggle on/off patient-facing cancellation ability</li>
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Cancellation Window</strong> – Minimum hours before the appointment that a cancellation is allowed. For example, a 24-hour window means patients can only cancel at least 24 hours before their scheduled time</li>
                        </ul>
                        <p className="mt-1">Staff and admins can always cancel appointments regardless of this policy. This setting only applies to patient self-cancellation through the portal.</p>
                      </div>
                    ),
                  },
                  {
                    id: "reschedule",
                    icon: RefreshCw,
                    title: "Rescheduling Policy",
                    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                        <p>Similar to cancellations, rescheduling can also be enabled or disabled per branch:</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Allow Rescheduling</strong> – Permits patients to move their appointment to a different time slot</li>
                          <li><strong className="text-neutral-700 dark:text-neutral-300">Rescheduling Window</strong> – Minimum hours in advance required before a reschedule is allowed</li>
                        </ul>
                        <p className="mt-1">When a patient reschedules, the original slot is released and a new one is booked within the same branch rules.</p>
                      </div>
                    ),
                  },
                  {
                    id: "staff-override",
                    icon: UserCog,
                    title: "Staff Override",
                    color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30",
                    content: (
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                        <p>The <strong className="text-neutral-700 dark:text-neutral-300">Staff Override</strong> setting controls whether clinic staff (with appropriate permissions) can bypass standard booking restrictions for this branch — such as the minimum notice period, cancellation window, and maximum future booking date.</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li>When <strong className="text-neutral-700 dark:text-neutral-300">enabled</strong>, staff can book, cancel, or reschedule appointments even if they fall outside the configured patient-facing rules</li>
                          <li>When <strong className="text-neutral-700 dark:text-neutral-300">disabled</strong>, staff are subject to the same restrictions as patients</li>
                        </ul>
                        <p className="mt-1">This is useful for emergency bookings or walk-in patients where normal scheduling rules should not block the clinical team from creating appointments.</p>
                      </div>
                    ),
                  },
                ].map((section) => {
                  const isExpanded = expandedSection === section.id;
                  return (
                    <div key={section.id} className="border-b border-neutral-100 dark:border-neutral-800">
                      <button
                        onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                      >
                        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{section.title}</span>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                      </button>
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1">
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Panel Footer */}
              <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
                  This guide reflects the current configuration capabilities of the Branches module in SpineCloudIQ.
                </p>
              </div>
            </div>
          </>
        )}

        {(statusFilter !== "all" || searchQuery) && (
          <div className="-mt-3 mb-6 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Search: {searchQuery}
                <X className="w-3 h-3" />
              </button>
            )}
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Status: {statusFilter}
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Branches Views */}
        {currentItems.length > 0 ? (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentItems.map((branch) => (
                  <div
                    key={branch.id}
                    onClick={() => onViewBranch(branch.id)}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {branch.name}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 truncate">
                          {branch.email}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(branch.id)}
                        onChange={(event) => {
                          event.stopPropagation();
                          toggleSelectBranch(branch.id);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                        aria-label={`Select ${branch.name}`}
                      />
                      {renderRowActions(branch)}
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-neutral-500" />
                        <span>{branch.city}, {branch.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-neutral-500" />
                        <span>{branch.country}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                      {selfBookingBadge(branch)}
                      {statusBadge(branch.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-2">
                {currentItems.map((branch) => (
                  <div
                    key={branch.id}
                    onClick={() => onViewBranch(branch.id)}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(branch.id)}
                          onChange={(event) => {
                            event.stopPropagation();
                            toggleSelectBranch(branch.id);
                          }}
                          onClick={(event) => event.stopPropagation()}
                          className="mt-1 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                          aria-label={`Select ${branch.name}`}
                        />
                        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {branch.name}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {branch.street}, {branch.city}, {branch.state} {branch.zip}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">{branch.email}</span>
                        {selfBookingBadge(branch)}
                        {statusBadge(branch.status)}
                        {renderRowActions(branch)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "table" && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="w-12 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={isAllCurrentSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                        aria-label="Select all branches on this page"
                      />
                    </th>
                    {visibleColumns.name && <th
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
                    </th>}
                    {visibleColumns.city && <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("city")}
                    >
                      <div className="flex items-center gap-2">
                        City
                        {sortBy === "city" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>}
                    {visibleColumns.state && <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      State
                    </th>}
                    {visibleColumns.selfBooking && <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Self-Booking
                    </th>}
                    {visibleColumns.status && <th
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
                    </th>}
                    {visibleColumns.actions && <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {currentItems.map((branch) => (
                      <tr
                        key={branch.id}
                        className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={() => onViewBranch(branch.id)}
                      >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(branch.id)}
                          onChange={(event) => {
                            event.stopPropagation();
                            toggleSelectBranch(branch.id);
                          }}
                          onClick={(event) => event.stopPropagation()}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                          aria-label={`Select ${branch.name}`}
                        />
                      </td>
                      {visibleColumns.name && <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {branch.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{branch.email}</p>
                          </div>
                        </div>
                      </td>}
                      {visibleColumns.city && <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {branch.city}
                        </p>
                      </td>}
                      {visibleColumns.state && <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {branch.state}
                        </p>
                      </td>}
                      {visibleColumns.selfBooking && <td className="px-6 py-4">
                        {selfBookingBadge(branch)}
                      </td>}
                      {visibleColumns.status && <td className="px-6 py-4">
                        {statusBadge(branch.status)}
                      </td>}
                      {visibleColumns.actions && <td className="px-6 py-4 text-right">
                        {renderRowActions(branch)}
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              </div>
            )}
          </>
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
