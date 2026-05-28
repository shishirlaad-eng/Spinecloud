import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  X,
  Eye,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  LayoutGrid,
  List,
  Table2,
  Check,
  Stethoscope,
  UserCheck,
  UserX,
  Mail,
  Users,
  ToggleLeft,
  ToggleRight,
  Edit2,
} from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Pagination } from "../shared/Pagination";

// ── Types ──────────────────────────────────────────────────────────────────────

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
  availabilityStatus?: "Configured" | "Not Configured";
  selfBookingEligible?: boolean;
  hasSchedule?: boolean;
  hasVisitTypes?: boolean;
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

type ViewMode = "grid" | "list" | "table";
type ProviderColumnId =
  | "name"
  | "email"
  | "specialty"
  | "branches"
  | "status"
  | "createdAt"
  | "actions";
type ProviderSortField = "name" | "email" | "specialty" | "branches" | "status" | "createdAt";

interface FilterRow {
  id: number;
  field: "status" | "branch" | "specialty";
  value: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

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
  // ── Existing filter state (preserved) ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── Knowledge panel ────────────────────────────────────────────────────────
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  // ── HB toolbar state ───────────────────────────────────────────────────────
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterRows, setFilterRows] = useState<FilterRow[]>([
    { id: 1, field: "status", value: "all" },
  ]);
  const [nextFilterId, setNextFilterId] = useState(2);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<ProviderSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState<Record<ProviderColumnId, boolean>>({
    name: true,
    email: true,
    specialty: true,
    branches: true,
    status: true,
    createdAt: true,
    actions: true,
  });

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, branchFilter, specialtyFilter]);

  // Sync pending filter rows each time the panel opens
  useEffect(() => {
    if (showFilters) {
      const rows: FilterRow[] = [];
      let id = 1;
      if (statusFilter !== "all") rows.push({ id: id++, field: "status", value: statusFilter });
      if (branchFilter !== "all") rows.push({ id: id++, field: "branch", value: branchFilter });
      if (specialtyFilter !== "all")
        rows.push({ id: id++, field: "specialty", value: specialtyFilter });
      if (rows.length === 0) rows.push({ id: id++, field: "status", value: "all" });
      setFilterRows(rows);
      setNextFilterId(id);
    }
  }, [showFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter row helpers ─────────────────────────────────────────────────────

  const addFilterRow = () => {
    setFilterRows((prev) => [...prev, { id: nextFilterId, field: "status", value: "all" }]);
    setNextFilterId((n) => n + 1);
  };

  const removeFilterRow = (id: number) => {
    setFilterRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateFilterRowField = (id: number, field: FilterRow["field"]) => {
    setFilterRows((prev) => prev.map((r) => (r.id === id ? { ...r, field, value: "all" } : r)));
  };

  const updateFilterRowValue = (id: number, value: string) => {
    setFilterRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const applyFilters = () => {
    let newStatus = "all";
    let newBranch = "all";
    let newSpecialty = "all";
    filterRows.forEach((row) => {
      if (row.value !== "all") {
        if (row.field === "status") newStatus = row.value;
        if (row.field === "branch") newBranch = row.value;
        if (row.field === "specialty") newSpecialty = row.value;
      }
    });
    setStatusFilter(newStatus);
    setBranchFilter(newBranch);
    setSpecialtyFilter(newSpecialty);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setFilterRows([{ id: 1, field: "status", value: "all" }]);
    setNextFilterId(2);
    setStatusFilter("all");
    setBranchFilter("all");
    setSpecialtyFilter("all");
  };

  // ── Derived lists for filter options ──────────────────────────────────────

  const allBranches = Array.from(new Set((providers || []).flatMap((p) => p.branches)));
  const allSpecialties = Array.from(new Set((providers || []).map((p) => p.specialty)));

  const getFilterOptions = (field: FilterRow["field"]) => {
    if (field === "status")
      return [
        { value: "all", label: "Select..." },
        { value: "Active", label: "Active" },
        { value: "Invited", label: "Invited" },
        { value: "Suspended", label: "Suspended" },
      ];
    if (field === "branch")
      return [
        { value: "all", label: "Select..." },
        ...allBranches.map((b) => ({ value: b, label: b })),
      ];
    if (field === "specialty")
      return [
        { value: "all", label: "Select..." },
        ...allSpecialties.map((s) => ({ value: s, label: s })),
      ];
    return [{ value: "all", label: "Select..." }];
  };

  // ── Columns ────────────────────────────────────────────────────────────────

  const providerColumns: { id: ProviderColumnId; label: string }[] = [
    { id: "name", label: "Provider Name" },
    { id: "email", label: "Email Address" },
    { id: "specialty", label: "Specialty" },
    { id: "branches", label: "Branches" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created Date" },
    { id: "actions", label: "Actions" },
  ];

  const toggleColumn = (columnId: ProviderColumnId) => {
    setVisibleColumns((current) => {
      const activeCount = providerColumns.filter((c) => current[c.id]).length;
      if (current[columnId] && activeCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const activeColumnCount = providerColumns.filter((c) => visibleColumns[c.id]).length;

  // ── Sort ───────────────────────────────────────────────────────────────────

  const handleSort = (field: ProviderSortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortIndicator = (field: ProviderSortField) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
      )
    ) : (
      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
    );

  // ── Filter / Sort / Paginate ───────────────────────────────────────────────

  const filteredProviders = (providers || []).filter((provider) => {
    const fullName = `${provider.firstName} ${provider.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      fullName.includes(query) ||
      provider.email.toLowerCase().includes(query) ||
      provider.specialty.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || provider.accountStatus === statusFilter;
    const matchesBranch = branchFilter === "all" || provider.branches.includes(branchFilter);
    const matchesSpecialty = specialtyFilter === "all" || provider.specialty === specialtyFilter;
    return matchesSearch && matchesStatus && matchesBranch && matchesSpecialty;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    const getSortValue = (p: Provider): string | number => {
      if (sortField === "createdAt") return p.createdAt ? new Date(p.createdAt).getTime() : 0;
      if (sortField === "name") return `${p.firstName} ${p.lastName}`.toLowerCase();
      if (sortField === "email") return p.email.toLowerCase();
      if (sortField === "specialty") return p.specialty.toLowerCase();
      if (sortField === "branches") return p.branches.length;
      if (sortField === "status") return p.accountStatus.toLowerCase();
      return "";
    };
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const paginatedProviders = sortedProviders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allCurrentSelected =
    paginatedProviders.length > 0 &&
    paginatedProviders.every((p) => selectedProviderIds.includes(p.id));

  const toggleCurrentPageSelection = () => {
    if (allCurrentSelected) {
      setSelectedProviderIds((current) =>
        current.filter((id) => !paginatedProviders.some((p) => p.id === id))
      );
    } else {
      setSelectedProviderIds((current) =>
        Array.from(new Set([...current, ...paginatedProviders.map((p) => p.id)]))
      );
    }
  };

  const toggleProviderSelection = (providerId: string) => {
    setSelectedProviderIds((current) =>
      current.includes(providerId)
        ? current.filter((id) => id !== providerId)
        : [...current, providerId]
    );
  };

  // ── Summary counts ─────────────────────────────────────────────────────────

  const activeCount = (providers || []).filter((p) => p.accountStatus === "Active").length;
  const invitedCount = (providers || []).filter((p) => p.accountStatus === "Invited").length;
  const suspendedCount = (providers || []).filter((p) => p.accountStatus === "Suspended").length;
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (branchFilter !== "all" ? 1 : 0) +
    (specialtyFilter !== "all" ? 1 : 0);

  // ── Misc helpers ───────────────────────────────────────────────────────────

  const ViewIcon = viewMode === "grid" ? LayoutGrid : viewMode === "list" ? List : Table2;
  const showTableColumnControl = viewMode === "table";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const statusBadge = (status: Provider["accountStatus"]) => {
    const dotColor =
      status === "Active"
        ? "bg-emerald-500"
        : status === "Invited"
        ? "bg-primary-500"
        : "bg-neutral-400";
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        {status}
      </span>
    );
  };

  const getInitials = (p: Provider) =>
    `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();

  // ── Knowledge panel ────────────────────────────────────────────────────────

  const renderKnowledgePanel = () => {
    if (!showKnowledgePanel) return null;
    return (
      <>
        <div
          className="fixed inset-0 bg-neutral-950/40 z-40"
          onClick={() => setShowKnowledgePanel(false)}
        />
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:!bg-neutral-900 border-l border-neutral-200 dark:!border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  Providers Management
                </p>
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
          <div className="flex-1 overflow-y-auto text-left">
            {[
              {
                id: "overview",
                title: "What is the Providers Module?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The{" "}
                    <strong className="text-neutral-800 dark:text-neutral-200">
                      Providers module
                    </strong>{" "}
                    allows clinic administrators to manage all healthcare staff — including
                    chiropractors, physical therapists, and massage therapists — who deliver
                    services across your branches. Each provider profile controls availability,
                    branch assignments, and self-booking eligibility.
                  </p>
                ),
              },
              {
                id: "status",
                title: "Provider Status Types",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Active
                      </p>
                      <p>
                        The provider has accepted their invitation and can receive bookings. Their
                        availability schedule is live.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Invited
                      </p>
                      <p>
                        An invitation email has been sent but the provider has not yet accepted or
                        created their account.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                        Suspended
                      </p>
                      <p>
                        The provider is temporarily deactivated. They cannot log in or receive new
                        bookings, but their records are preserved.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                id: "schedule",
                title: "Availability & Branch Assignments",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                    <p>
                      Each provider must have an availability schedule configured before patients
                      can book appointments with them. From the provider detail page you can:
                    </p>
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
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                  >
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {section.title}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && <div className="px-5 pb-5 pt-1">{section.content}</div>}
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-neutral-200 dark:!border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              This guide reflects the current capabilities of the Providers module in SpineCloudIQ.
            </p>
          </div>
        </div>
      </>
    );
  };

  // ── Row actions (table view only: Toggle + Eye + Edit2) ───────────────────

  const renderRowActions = (provider: Provider) => (
    <div className="flex items-center justify-end gap-2">
      {/* Toggle Activate / Suspend */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (provider.accountStatus === "Active") onSuspendProvider?.(provider.id);
          else if (provider.accountStatus === "Suspended") onActivateProvider?.(provider.id);
        }}
        disabled={provider.accountStatus === "Invited"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          provider.accountStatus === "Active"
            ? "text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30"
            : provider.accountStatus === "Suspended"
            ? "text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 dark:hover:text-primary-400"
            : "text-neutral-300 dark:text-neutral-700 cursor-not-allowed"
        }`}
        title={
          provider.accountStatus === "Active"
            ? "Suspend provider"
            : provider.accountStatus === "Suspended"
            ? "Activate provider"
            : "Invitation pending"
        }
      >
        {provider.accountStatus === "Active" ? (
          <ToggleRight className="w-4 h-4" />
        ) : (
          <ToggleLeft className="w-4 h-4" />
        )}
      </button>
      {/* View */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewProvider(provider.id);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
        title="View provider"
      >
        <Eye className="w-4 h-4" />
      </button>
      {/* Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewProvider(provider.id);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
        title="Edit provider"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );

  // ── Card menu (grid + list views: single MoreVertical) ────────────────────

  const renderCardMenu = (provider: Provider) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCardMenu(showCardMenu === provider.id ? null : provider.id);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {showCardMenu === provider.id && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setShowCardMenu(null);
            }}
          />
          <div className="absolute right-0 top-9 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-lg py-1 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProvider(provider.id);
                setShowCardMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProvider(provider.id);
                setShowCardMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            {provider.accountStatus === "Invited" && onResendInvitation && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResendInvitation(provider.id);
                  setShowCardMenu(null);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Resend Invite
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (provider.accountStatus === "Active") onSuspendProvider?.(provider.id);
                else if (provider.accountStatus === "Suspended") onActivateProvider?.(provider.id);
                setShowCardMenu(null);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              {provider.accountStatus === "Active" ? (
                <ToggleRight className="w-4 h-4 text-primary-600" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              {provider.accountStatus === "Active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ── View option helper ─────────────────────────────────────────────────────

  const renderViewOption = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      onClick={() => {
        setViewMode(mode);
        if (mode !== "table") setShowColumnsPanel(false);
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

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <ClinicAdminLayout
      activeMenu="providers"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onOpenHelpGuide={() => setShowKnowledgePanel(true)}
    >
      <div className="p-5 md:p-6">
        {renderKnowledgePanel()}

        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Providers
            </h1>
            {/* Breadcrumb */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                Clinic Admin
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                Base Setup
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-neutral-900 dark:text-white">Providers</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage medical staff, clinic assignments, and availability schedules
            </p>
          </div>

          {/* ── Header Action Cluster ── */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search — compact icon or expanded inline bar */}
            {showHeaderSearch ? (
              <div className="relative">
                <div className="h-10 w-[min(400px,calc(100vw-3rem))] flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-sm px-3">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-w-0 flex-1 h-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  />
                  <button
                    onClick={() => setShowFilters((v) => !v)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors relative ${
                      activeFilterCount > 0
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
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
                      setShowColumnsPanel(false);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    title="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter By popover */}
                {showFilters && (
                  <div className="absolute right-0 top-full mt-3 w-[520px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Filter By
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="px-5 py-5 space-y-3">
                      {filterRows.map((row, index) => (
                        <div
                          key={row.id}
                          className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end"
                        >
                          <div>
                            {index === 0 && (
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                Where
                              </label>
                            )}
                            <div className="relative">
                              <select
                                value={row.field}
                                onChange={(e) =>
                                  updateFilterRowField(
                                    row.id,
                                    e.target.value as FilterRow["field"]
                                  )
                                }
                                className="w-full h-10 px-3 pr-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                              >
                                <option value="status">Status</option>
                                <option value="branch">Branch</option>
                                <option value="specialty">Specialty</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            {index === 0 && (
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                What
                              </label>
                            )}
                            <div className="relative">
                              <select
                                value={row.value}
                                onChange={(e) => updateFilterRowValue(row.id, e.target.value)}
                                className="w-full h-10 px-3 pr-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                              >
                                {getFilterOptions(row.field).map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                            </div>
                          </div>
                          <button
                            onClick={() => removeFilterRow(row.id)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors ${
                              index === 0 ? "mt-5" : ""
                            }`}
                            title="Remove filter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addFilterRow}
                        className="mx-auto flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors pt-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Filter
                      </button>
                    </div>
                    <div className="px-5 py-4 border-t border-neutral-200 dark:!border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
                          onClick={applyFilters}
                          className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors"
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
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Customized Columns — Table view only */}
            {!showHeaderSearch && showTableColumnControl && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnsPanel((v) => !v)}
                  className={`inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border rounded-lg transition-all ${
                    showColumnsPanel
                      ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500"
                  }`}
                  title="Customized columns"
                >
                  <Table2 className="w-5 h-5" />
                </button>
                {showColumnsPanel && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                    <div className="px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Table2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                          Columns
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowColumnsPanel(false)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {providerColumns.map((column) => (
                        <button
                          key={column.id}
                          onClick={() => toggleColumn(column.id)}
                          className={`w-full px-3 py-3 rounded-lg transition-colors flex items-center justify-between text-left ${
                            visibleColumns[column.id]
                              ? "bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                              : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                visibleColumns[column.id]
                                  ? "bg-primary-600 border-primary-600 text-white"
                                  : "border-neutral-300 dark:border-neutral-700"
                              }`}
                            >
                              {visibleColumns[column.id] && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                visibleColumns[column.id]
                                  ? "text-primary-700 dark:text-primary-400"
                                  : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {column.label}
                            </span>
                          </span>
                          <span
                            className={`w-1 h-1 rounded-full ${
                              visibleColumns[column.id]
                                ? "bg-primary-600 dark:bg-primary-400"
                                : "bg-neutral-900 dark:bg-white"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="px-5 py-3 border-t border-neutral-200 dark:!border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {activeColumnCount} of {providerColumns.length} active
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary action — Add Provider */}
            <button
              onClick={onAddProvider}
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </button>

            {/* Summary toggle */}
            <button
              onClick={() => setShowSummary((v) => !v)}
              className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                showSummary
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
              title="Summary"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* Refresh */}
            <button
              onClick={() => setCurrentPage(1)}
              className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* More options */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu((v) => !v)}
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                  showMoreMenu
                    ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-20">
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              )}
            </div>

            {/* View mode switcher */}
            <div className="relative">
              <button
                onClick={() => setShowViewMenu((v) => !v)}
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                title="View mode"
              >
                <ViewIcon className="w-5 h-5" />
              </button>
              {showViewMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-20">
                  {renderViewOption("grid", "Grid View", LayoutGrid)}
                  {renderViewOption("list", "List View", List)}
                  {renderViewOption("table", "Table View", Table2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        {showSummary && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Total Providers", value: (providers || []).length, icon: Users },
              { label: "Active", value: activeCount, icon: UserCheck },
              { label: "Invited", value: invitedCount, icon: Mail },
              { label: "Suspended", value: suspendedCount, icon: UserX },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white">
                      {item.value}
                    </p>
                    <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-white">
                      {item.label}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Active filter chips ── */}
        {(searchQuery || statusFilter !== "all" || branchFilter !== "all" || specialtyFilter !== "all") && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Search: {searchQuery} <X className="w-3 h-3" />
              </button>
            )}
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Status: {statusFilter} <X className="w-3 h-3" />
              </button>
            )}
            {branchFilter !== "all" && (
              <button
                onClick={() => setBranchFilter("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Branch: {branchFilter} <X className="w-3 h-3" />
              </button>
            )}
            {specialtyFilter !== "all" && (
              <button
                onClick={() => setSpecialtyFilter("all")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
              >
                Specialty: {specialtyFilter} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* ── Grid View ── */}
        {viewMode === "grid" && (
          <div className="animate-in fade-in duration-300">
            {paginatedProviders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-xl">
                <Stethoscope className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  No providers found
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {paginatedProviders.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => onViewProvider(provider.id)}
                    className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <input
                        type="checkbox"
                        checked={selectedProviderIds.includes(provider.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleProviderSelection(provider.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 accent-primary-600 cursor-pointer mt-0.5"
                      />
                      {renderCardMenu(provider)}
                    </div>
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-sm mb-2">
                        {getInitials(provider)}
                      </div>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                        {provider.firstName} {provider.lastName}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                        {provider.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 truncate max-w-[60%]">
                          {provider.specialty}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
                          {provider.branches.length}{" "}
                          {provider.branches.length === 1 ? "branch" : "branches"}
                        </span>
                      </div>
                      <div className="flex justify-center">{statusBadge(provider.accountStatus)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
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
        )}

        {/* ── List View ── */}
        {viewMode === "list" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-xl overflow-hidden shadow-sm">
              {paginatedProviders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Stethoscope className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    No providers found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {paginatedProviders.map((provider) => (
                    <div
                      key={provider.id}
                      onClick={() => onViewProvider(provider.id)}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProviderIds.includes(provider.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleProviderSelection(provider.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 accent-primary-600 cursor-pointer shrink-0"
                      />
                      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-xs shrink-0">
                        {getInitials(provider)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                          {provider.firstName} {provider.lastName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {provider.email}
                        </p>
                      </div>
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                        {provider.specialty}
                      </span>
                      <span className="hidden md:block text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
                        {provider.branches.length}{" "}
                        {provider.branches.length === 1 ? "branch" : "branches"}
                      </span>
                      <div className="shrink-0">{statusBadge(provider.accountStatus)}</div>
                      <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                        {renderCardMenu(provider)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4">
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
        )}

        {/* ── Table View ── */}
        {viewMode === "table" && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      {/* Fixed checkbox column */}
                      <th className="w-10 pl-5 pr-2 py-3.5">
                        <input
                          type="checkbox"
                          checked={allCurrentSelected}
                          onChange={toggleCurrentPageSelection}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 accent-primary-600 cursor-pointer"
                        />
                      </th>

                      {visibleColumns.name && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-1.5">
                            Provider Name {renderSortIndicator("name")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.email && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center gap-1.5">
                            Email Address {renderSortIndicator("email")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.specialty && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("specialty")}
                        >
                          <div className="flex items-center gap-1.5">
                            Specialty {renderSortIndicator("specialty")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.branches && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("branches")}
                        >
                          <div className="flex items-center gap-1.5">
                            Branches {renderSortIndicator("branches")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.status && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1.5">
                            Status {renderSortIndicator("status")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.createdAt && (
                        <th
                          className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center gap-1.5">
                            Created Date {renderSortIndicator("createdAt")}
                          </div>
                        </th>
                      )}

                      {visibleColumns.actions && (
                        <th className="text-right px-4 py-3.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {paginatedProviders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={providerColumns.filter((c) => visibleColumns[c.id]).length + 1}
                          className="px-6 py-20 text-center"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Stethoscope className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mb-4" />
                            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                              No providers found
                            </p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedProviders.map((provider) => (
                        <tr
                          key={provider.id}
                          onClick={() => onViewProvider(provider.id)}
                          className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                        >
                          {/* Checkbox */}
                          <td className="pl-5 pr-2 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedProviderIds.includes(provider.id)}
                              onChange={() => toggleProviderSelection(provider.id)}
                              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 accent-primary-600 cursor-pointer"
                            />
                          </td>

                          {/* Provider Name */}
                          {visibleColumns.name && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-xs shrink-0">
                                  {getInitials(provider)}
                                </div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {provider.firstName} {provider.lastName}
                                </p>
                              </div>
                            </td>
                          )}

                          {/* Email */}
                          {visibleColumns.email && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {provider.email}
                              </p>
                            </td>
                          )}

                          {/* Specialty */}
                          {visibleColumns.specialty && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                {provider.specialty}
                              </span>
                            </td>
                          )}

                          {/* Branches */}
                          {visibleColumns.branches && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
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
                                  <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-neutral-900 dark:bg-neutral-800 text-white text-[10px] rounded-lg shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">
                                    {provider.branches.join(", ")}
                                    <div className="absolute top-full left-4 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-800" />
                                  </div>
                                )}
                              </div>
                            </td>
                          )}

                          {/* Status */}
                          {visibleColumns.status && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              {statusBadge(provider.accountStatus)}
                            </td>
                          )}

                          {/* Created Date */}
                          {visibleColumns.createdAt && (
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {formatDate(provider.createdAt)}
                              </p>
                            </td>
                          )}

                          {/* Actions */}
                          {visibleColumns.actions && (
                            <td
                              className="px-4 py-3.5 whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {renderRowActions(provider)}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
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
        )}
      </div>
    </ClinicAdminLayout>
  );
}
