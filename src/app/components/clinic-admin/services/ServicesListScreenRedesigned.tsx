import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import {
  Plus,
  Search,
  FolderOpen,
  MapPin,
  X,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  LayoutGrid,
  List,
  Table2,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Check,
  Edit2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Columns3,
  Filter,
  ChevronDown,
  BookOpen,
  Stethoscope,
  DollarSign,
} from "lucide-react";
import { Pagination } from "@/app/components/shared/Pagination";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ProcedurePhase {
  id: string;
  duration: number;
  providerRequired: boolean;
}

interface BookingWindow {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  slotCapacity: number;
}

interface Service {
  id: string;
  name: string;
  roomId: string;
  phases: ProcedurePhase[];
  price: number;
  providerIds: string[];
  locationIds: string[];
  allowOnlineBooking: boolean;
  bookingStartTime: string;
  bookingEndTime: string;
  bookingWindows?: BookingWindow[];
  slotCapacity: number;
  isActive: boolean;
  questionnaireId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Questionnaire {
  id: string;
  categoryName: string;
}

interface Location {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface Room {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  cleanupTime: number;
  status: "Active" | "Inactive";
  notes?: string;
}

type ViewMode = "grid" | "list" | "table";
type ServiceColumnId = "name" | "price" | "location" | "status" | "createdAt" | "actions";
type ServiceSortField = "name" | "price" | "location" | "status" | "createdAt";

interface FilterRow {
  id: number;
  field: "status" | "location";
  value: string;
}

interface ServicesListScreenRedesignedProps {
  services: Service[];
  locations: Location[];
  providers: Provider[];
  rooms: Room[];
  questionnaires: Questionnaire[];
  onNavigate: (menu: string) => void;
  onAddService: () => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
  onToggleService?: (serviceId: string, isActive: boolean) => void;
  onLogout?: () => void;
  onOpenHelpGuide?: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ServicesListScreenRedesigned({
  services,
  locations,
  providers,
  rooms,
  questionnaires,
  onNavigate,
  onAddService,
  onEditService,
  onDeleteService,
  onToggleService,
  onLogout,
  onOpenHelpGuide,
}: ServicesListScreenRedesignedProps) {
  // ── Existing filter state (preserved) ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ── Knowledge panel ────────────────────────────────────────────────────────
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);

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
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<ServiceSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState<Record<ServiceColumnId, boolean>>({
    name: true,
    price: true,
    location: true,
    status: true,
    createdAt: true,
    actions: true,
  });

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, locationFilter]);

  useEffect(() => {
    if (showFilters) {
      const rows: FilterRow[] = [];
      let id = 1;
      if (statusFilter !== "all") rows.push({ id: id++, field: "status", value: statusFilter });
      if (locationFilter !== "all") rows.push({ id: id++, field: "location", value: locationFilter });
      if (rows.length === 0) rows.push({ id: id++, field: "status", value: "all" });
      setFilterRows(rows);
      setNextFilterId(id);
    }
  }, [showFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (viewMode !== "table") setShowColumnsPanel(false);
  }, [viewMode]);

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
    let newLocation = "all";
    filterRows.forEach((row) => {
      if (row.value !== "all") {
        if (row.field === "status") newStatus = row.value;
        if (row.field === "location") newLocation = row.value;
      }
    });
    setStatusFilter(newStatus);
    setLocationFilter(newLocation);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setFilterRows([{ id: 1, field: "status", value: "all" }]);
    setNextFilterId(2);
    setStatusFilter("all");
    setLocationFilter("all");
  };

  const getFilterOptions = (field: FilterRow["field"]) => {
    if (field === "status")
      return [
        { value: "all", label: "Select..." },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ];
    if (field === "location")
      return [
        { value: "all", label: "Select..." },
        ...locations.map((l) => ({ value: l.id, label: l.name })),
      ];
    return [{ value: "all", label: "Select..." }];
  };

  // ── Columns ────────────────────────────────────────────────────────────────

  const serviceColumns: { id: ServiceColumnId; label: string }[] = [
    { id: "name", label: "Service Name" },
    { id: "price", label: "Price" },
    { id: "location", label: "Location" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Created Date" },
    { id: "actions", label: "Actions" },
  ];

  const toggleColumn = (columnId: ServiceColumnId) => {
    setVisibleColumns((current) => {
      const activeCount = serviceColumns.filter((c) => current[c.id]).length;
      if (current[columnId] && activeCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const activeColumnCount = serviceColumns.filter((c) => visibleColumns[c.id]).length;

  // ── Sort ───────────────────────────────────────────────────────────────────

  const handleSort = (field: ServiceSortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortIndicator = (field: ServiceSortField) =>
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

  const filteredServices = (services || []).filter((service) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      service.name.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Active" && service.isActive) ||
      (statusFilter === "Inactive" && !service.isActive);
    const matchesLocation =
      locationFilter === "all" || service.locationIds.includes(locationFilter);
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    const getSortValue = (s: Service): string | number => {
      if (sortField === "createdAt") return s.createdAt ? new Date(s.createdAt).getTime() : 0;
      if (sortField === "name") return s.name.toLowerCase();
      if (sortField === "price") return s.price;
      if (sortField === "location") return s.locationIds.length;
      if (sortField === "status") return s.isActive ? "active" : "inactive";
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

  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allCurrentSelected =
    paginatedServices.length > 0 &&
    paginatedServices.every((s) => selectedServiceIds.includes(s.id));

  const toggleCurrentPageSelection = () => {
    if (allCurrentSelected) {
      setSelectedServiceIds((current) =>
        current.filter((id) => !paginatedServices.some((s) => s.id === id))
      );
    } else {
      setSelectedServiceIds((current) =>
        Array.from(new Set([...current, ...paginatedServices.map((s) => s.id)]))
      );
    }
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServiceIds((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId]
    );
  };

  // ── Summary counts ─────────────────────────────────────────────────────────

  const totalCount = (services || []).length;
  const activeCount = (services || []).filter((s) => s.isActive).length;
  const inactiveCount = (services || []).filter((s) => !s.isActive).length;

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0);

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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const getLocationNames = (locationIds: string[]) =>
    locationIds
      .map((id) => locations.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ── Row actions (table) ────────────────────────────────────────────────────

  const renderRowActions = (service: Service) => (
    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
      {/* Toggle active/inactive */}
      <button
        onClick={() => onToggleService?.(service.id, !service.isActive)}
        title={service.isActive ? "Deactivate service" : "Activate service"}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          service.isActive
            ? "text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30"
            : "text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 dark:hover:text-primary-400"
        }`}
      >
        {service.isActive ? (
          <ToggleRight className="w-4 h-4" />
        ) : (
          <ToggleLeft className="w-4 h-4" />
        )}
      </button>
      {/* View */}
      <button
        onClick={() => onEditService(service.id)}
        title="View service"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      {/* Edit */}
      <button
        onClick={() => onEditService(service.id)}
        title="Edit service"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );

  // ── Card/list menu (grid + list) ───────────────────────────────────────────

  const renderCardMenu = (service: Service) => (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setShowCardMenu(showCardMenu === service.id ? null : service.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {showCardMenu === service.id && (
        <div className="absolute right-0 top-9 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 py-1">
          <button
            onClick={() => { onEditService(service.id); setShowCardMenu(null); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-neutral-400" />Edit service
          </button>
          {onToggleService && (
            <button
              onClick={() => { onToggleService(service.id, !service.isActive); setShowCardMenu(null); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {service.isActive ? (
                <ToggleLeft className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <ToggleRight className="w-3.5 h-3.5 text-primary-500" />
              )}
              {service.isActive ? "Deactivate" : "Activate"}
            </button>
          )}
          <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
          <button
            onClick={() => { onDeleteService(service.id); setShowCardMenu(null); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />Delete
          </button>
        </div>
      )}
    </div>
  );

  // ── Renders ────────────────────────────────────────────────────────────────

  const renderStatusBadge = (isActive: boolean) => (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isActive ? "bg-success-500" : "bg-neutral-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {paginatedServices.map((service) => (
        <div
          key={service.id}
          onClick={() => onEditService(service.id)}
          className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-600 dark:hover:border-primary-500 transition-colors cursor-pointer"
        >
          {/* Header row: avatar + name/price + checkbox + menu */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center font-bold text-primary-600 dark:text-primary-400 text-sm shrink-0">
              {getInitials(service.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                {service.name}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {formatPrice(service.price)}
              </p>
            </div>
            <div
              className="flex items-center gap-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => toggleServiceSelection(service.id)}
                className="cursor-pointer"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  selectedServiceIds.includes(service.id)
                    ? "bg-primary-600 border-primary-600"
                    : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                }`}>
                  {selectedServiceIds.includes(service.id) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </div>
              {renderCardMenu(service)}
            </div>
          </div>

          {/* Metadata rows */}
          <div className="mt-4 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>{formatPrice(service.price)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span className="truncate">
                {service.locationIds.length === 0
                  ? "No locations"
                  : service.locationIds.length === 1
                  ? getLocationNames(service.locationIds)
                  : `${service.locationIds.length} Locations`}
              </span>
            </div>
          </div>

          {/* Bottom badges */}
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span className={`w-1.5 h-1.5 rounded-full ${service.allowOnlineBooking ? "bg-primary-600" : "bg-neutral-400"}`} />
              {service.allowOnlineBooking ? "Online booking" : "No online booking"}
            </span>
            {renderStatusBadge(service.isActive)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      {paginatedServices.map((service, idx) => (
        <div
          key={service.id}
          onClick={() => onEditService(service.id)}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group ${
            idx < paginatedServices.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""
          }`}
        >
          {/* Checkbox */}
          <div
            className="shrink-0"
            onClick={(e) => { e.stopPropagation(); toggleServiceSelection(service.id); }}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              selectedServiceIds.includes(service.id)
                ? "bg-primary-600 border-primary-600"
                : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
            }`}>
              {selectedServiceIds.includes(service.id) && <Check className="w-2.5 h-2.5 text-white" />}
            </div>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-400 shrink-0">
            {getInitials(service.name)}
          </div>

          {/* Name + location */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
              {service.name}
            </p>
            {service.locationIds.length > 0 && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                {getLocationNames(service.locationIds)}
              </p>
            )}
          </div>

          {/* Price */}
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 shrink-0">
            {formatPrice(service.price)}
          </span>

          {/* Status */}
          <div className="shrink-0">{renderStatusBadge(service.isActive)}</div>

          {/* Menu */}
          <div className="shrink-0">{renderCardMenu(service)}</div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {/* Checkbox column (fixed) */}
              <th className="pl-4 pr-2 py-3 w-10">
                <div
                  onClick={toggleCurrentPageSelection}
                  className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                    allCurrentSelected
                      ? "bg-primary-600 border-primary-600"
                      : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  }`}
                >
                  {allCurrentSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
              </th>

              {visibleColumns.name && (
                <th
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1.5">
                    SERVICE NAME {renderSortIndicator("name")}
                  </div>
                </th>
              )}
              {visibleColumns.price && (
                <th
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center gap-1.5">
                    PRICE {renderSortIndicator("price")}
                  </div>
                </th>
              )}
              {visibleColumns.location && (
                <th
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleSort("location")}
                >
                  <div className="flex items-center gap-1.5">
                    LOCATION {renderSortIndicator("location")}
                  </div>
                </th>
              )}
              {visibleColumns.status && (
                <th
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1.5">
                    STATUS {renderSortIndicator("status")}
                  </div>
                </th>
              )}
              {visibleColumns.createdAt && (
                <th
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1.5">
                    CREATED DATE {renderSortIndicator("createdAt")}
                  </div>
                </th>
              )}
              {visibleColumns.actions && (
                <th className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-right">
                  ACTIONS
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {paginatedServices.map((service) => (
              <tr
                key={service.id}
                className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors cursor-pointer"
                onClick={() => onEditService(service.id)}
              >
                {/* Checkbox */}
                <td
                  className="pl-4 pr-2 py-3"
                  onClick={(e) => { e.stopPropagation(); toggleServiceSelection(service.id); }}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedServiceIds.includes(service.id)
                      ? "bg-primary-600 border-primary-600"
                      : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  }`}>
                    {selectedServiceIds.includes(service.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </td>

                {visibleColumns.name && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-400 shrink-0">
                        {getInitials(service.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {service.name}
                        </p>
                        {service.allowOnlineBooking && (
                          <p className="text-[11px] text-neutral-400 mt-0.5">Online booking</p>
                        )}
                      </div>
                    </div>
                  </td>
                )}

                {visibleColumns.price && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {formatPrice(service.price)}
                    </span>
                  </td>
                )}

                {visibleColumns.location && (
                  <td className="px-4 py-3">
                    {service.locationIds.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                          <MapPin className="w-3 h-3" />
                          {service.locationIds.length}
                          {service.locationIds.length === 1 ? " Location" : " Locations"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 italic">No location</span>
                    )}
                  </td>
                )}

                {visibleColumns.status && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    {renderStatusBadge(service.isActive)}
                  </td>
                )}

                {visibleColumns.createdAt && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(service.createdAt)}
                  </td>
                )}

                {visibleColumns.actions && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {renderRowActions(service)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalItems={sortedServices.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        totalPages={Math.ceil(sortedServices.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-16 text-center">
      <div className="w-14 h-14 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-4">
        <FolderOpen className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
        No services found
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-xs mx-auto">
        {searchQuery || activeFilterCount > 0
          ? "Try adjusting your search or filters to find what you're looking for"
          : "Get started by adding your first clinical service"}
      </p>
      {!searchQuery && activeFilterCount === 0 && (
        <button
          onClick={onAddService}
          className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add service
        </button>
      )}
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ClinicAdminLayout
      activeMenu="services"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onOpenHelpGuide={onOpenHelpGuide ?? (() => setShowKnowledgePanel(true))}
    >
      <div
        className="p-5 md:p-6 space-y-5"
        onClick={() => {
          if (showMoreMenu) setShowMoreMenu(false);
          if (showViewMenu) setShowViewMenu(false);
          if (showCardMenu) setShowCardMenu(null);
        }}
      >
        {/* ── Page header ────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Services
            </h1>
            {/* ── Breadcrumb ───────────────────────────────────────────────── */}
            <div className="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Clinic Admin</span>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">Base Setup</span>
              <span className="text-neutral-300 dark:text-neutral-700">/</span>
              <span className="text-neutral-900 dark:text-white">Services</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage clinical services, pricing structures, and branch assignments
            </p>
          </div>

          {/* ── Header action cluster ─────────────────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Inline search (expanded) */}
            {showHeaderSearch ? (
              <div className="flex items-center gap-1.5 h-9 px-2.5 border border-primary-600 dark:border-primary-500 bg-white dark:bg-neutral-900 rounded-lg shadow-sm min-w-[240px]">
                <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services..."
                  className="flex-1 text-sm bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1 rounded transition-colors ${
                    activeFilterCount > 0
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  }`}
                  title="Filters"
                >
                  <Filter className="w-3.5 h-3.5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary-600 text-white text-[8px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setShowHeaderSearch(false); setSearchQuery(""); }}
                  className="p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowHeaderSearch(true)}
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white transition-all"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Columns panel toggle (table only) */}
            {showTableColumnControl && (
              <div className="relative">
                <button
                  onClick={() => setShowColumnsPanel(!showColumnsPanel)}
                  className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-all ${
                    showColumnsPanel
                      ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400"
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                  title="Customize columns"
                >
                  <Columns3 className="w-5 h-5" />
                </button>

                {showColumnsPanel && (
                  <div
                    className="absolute right-0 top-11 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-white">Columns</span>
                      <button onClick={() => setShowColumnsPanel(false)} className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="py-2 px-2">
                      {serviceColumns.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => toggleColumn(col.id)}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            visibleColumns[col.id]
                              ? "bg-primary-600 border-primary-600"
                              : "border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                          }`}>
                            {visibleColumns[col.id] && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{col.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                      {activeColumnCount} of {serviceColumns.length} active
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary action */}
            <button
              onClick={onAddService}
              className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add service
            </button>

            {/* Summary */}
            <button
              onClick={() => setShowSummary(!showSummary)}
              title="Summary"
              className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-all ${
                showSummary
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-600 dark:bg-primary-950/30 dark:text-primary-400"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* Refresh */}
            <button
              title="Refresh"
              className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* More options */}
            <div className="relative">
              <button
                onClick={() => { setShowMoreMenu(!showMoreMenu); setShowViewMenu(false); }}
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-all ${
                  showMoreMenu
                    ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
                title="More options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMoreMenu && (
                <div
                  className="absolute right-0 top-11 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { icon: Upload, label: "Import" },
                    { icon: Download, label: "Export" },
                    { icon: Printer, label: "Print" },
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => setShowMoreMenu(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-neutral-400" />{label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View mode switcher */}
            <div className="relative">
              <button
                onClick={() => { setShowViewMenu(!showViewMenu); setShowMoreMenu(false); }}
                className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:border-primary-600 dark:hover:border-primary-500 hover:text-neutral-900 dark:hover:text-white transition-all"
                title="View mode"
              >
                <ViewIcon className="w-5 h-5" />
              </button>
              {showViewMenu && (
                <div
                  className="absolute right-0 top-11 w-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[
                    { mode: "grid" as ViewMode, icon: LayoutGrid, label: "Grid View" },
                    { mode: "list" as ViewMode, icon: List, label: "List View" },
                    { mode: "table" as ViewMode, icon: Table2, label: "Table View" },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => { setViewMode(mode); setShowViewMenu(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        viewMode === mode
                          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />{label}
                      {viewMode === mode && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Summary cards ─────────────────────────────────────────────── */}
        {showSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Services", value: totalCount, color: "text-neutral-900 dark:text-white" },
              { label: "Active", value: activeCount, color: "text-success-700 dark:text-success-400" },
              { label: "Inactive", value: inactiveCount, color: "text-neutral-600 dark:text-neutral-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
                <p className={`text-2xl font-semibold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter by modal ────────────────────────────────────────────── */}
        {showFilters && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            onClick={() => setShowFilters(false)}
          >
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
            <div
              className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filter By</h3>
                <button onClick={() => setShowFilters(false)} className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter rows */}
              <div className="px-5 py-4 space-y-3">
                {filterRows.map((row, idx) => (
                  <div key={row.id} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 w-10 shrink-0">
                      {idx === 0 ? "Where" : "And"}
                    </span>
                    <select
                      value={row.field}
                      onChange={(e) => updateFilterRowField(row.id, e.target.value as FilterRow["field"])}
                      className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      <option value="status">Status</option>
                      <option value="location">Location</option>
                    </select>
                    <select
                      value={row.value}
                      onChange={(e) => updateFilterRowValue(row.id, e.target.value)}
                      className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    >
                      {getFilterOptions(row.field).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {filterRows.length > 1 && (
                      <button onClick={() => removeFilterRow(row.id)} className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addFilterRow}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Filter
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
                >
                  Clear All
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="h-9 px-4 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyFilters}
                    className="h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Active filter chips ────────────────────────────────────────── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">Active filters:</span>
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter("all")} className="hover:text-primary-900 dark:hover:text-primary-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {locationFilter !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                Location: {locations.find((l) => l.id === locationFilter)?.name ?? locationFilter}
                <button onClick={() => setLocationFilter("all")} className="hover:text-primary-900 dark:hover:text-primary-200">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────────────── */}
        {paginatedServices.length === 0
          ? renderEmptyState()
          : viewMode === "grid"
          ? renderGridView()
          : viewMode === "list"
          ? renderListView()
          : renderTableView()}

        {/* Pagination for grid/list */}
        {paginatedServices.length > 0 && viewMode !== "table" && (
          <Pagination
            totalItems={sortedServices.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={Math.ceil(sortedServices.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </ClinicAdminLayout>
  );
}
