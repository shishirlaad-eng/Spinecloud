import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  X,
  Download,
  ChevronDown,
  Link,
  Send,
  Check,
  BarChart3,
  RefreshCw,
  MoreVertical,
  Upload,
  Printer,
  LayoutGrid,
  List,
  Table2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Pagination } from "../shared/Pagination";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  registeredDate: string;
  lastVisit: string;
  upcomingAppointment?: string;
  status: "Active" | "Inactive" | "Link sent";
  totalAppointments: number;
  lastUpdated?: string;
  addedDate: string; // NEW: Track when patient was added
  tag: "Staff Added" | "Invited Patient"; // How the patient was added
  insurance?: {
    provider: string;
    policyNumber: string;
  };
}

type ViewMode = "grid" | "list" | "table";
type PatientColumnId =
  | "name"
  | "email"
  | "phone"
  | "city"
  | "state"
  | "createdDate"
  | "lastUpdated"
  | "tag"
  | "status"
  | "action";

interface PatientsListScreenProps {
  patients: Patient[];
  onNavigate: (menu: string) => void;
  onViewPatient: (patientId: string) => void;
  onAddPatient?: () => void;
  onLogout?: () => void;
}

export function PatientsListScreen({
  patients,
  onNavigate,
  onViewPatient,
  onAddPatient,
  onLogout,
}: PatientsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive" | "Link sent">("all");
  const [tagFilter, setTagFilter] = useState<"all" | "Staff Added" | "Invited Patient">("all");
  const [createdDateFrom, setCreatedDateFrom] = useState("");
  const [createdDateTo, setCreatedDateTo] = useState("");
  const [updatedDateFrom, setUpdatedDateFrom] = useState("");
  const [updatedDateTo, setUpdatedDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "email" | "city" | "state" | "lastUpdated" | "addedDate">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resentId, setResentId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showResendModal, setShowResendModal] = useState(false);
  const [patientToResend, setPatientToResend] = useState<Patient | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Record<PatientColumnId, boolean>>({
    name: true,
    email: true,
    phone: true,
    city: true,
    state: true,
    createdDate: true,
    lastUpdated: true,
    tag: true,
    status: true,
    action: true,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter, createdDateFrom, createdDateTo, updatedDateFrom, updatedDateTo]);

  // Filter patients based on search, status, and tag
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    const matchesTag =
      tagFilter === "all" || patient.tag === tagFilter;

    const matchesCreatedDate = (!createdDateFrom || new Date(patient.addedDate) >= new Date(createdDateFrom)) &&
                               (!createdDateTo || new Date(patient.addedDate) <= new Date(createdDateTo));
    
    const matchesUpdatedDate = (!updatedDateFrom || new Date(patient.lastUpdated || patient.registeredDate) >= new Date(updatedDateFrom)) &&
                               (!updatedDateTo || new Date(patient.lastUpdated || patient.registeredDate) <= new Date(updatedDateTo));

    return matchesSearch && matchesStatus && matchesTag && matchesCreatedDate && matchesUpdatedDate;
  });

  // Sort filtered patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortField) {
      case "name":
        compareValue = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        break;
      case "email":
        compareValue = a.email.localeCompare(b.email);
        break;
      case "city":
        compareValue = (a.address?.city || "").localeCompare(b.address?.city || "");
        break;
      case "state":
        compareValue = (a.address?.state || "").localeCompare(b.address?.state || "");
        break;
      case "lastUpdated":
        compareValue = new Date(a.lastUpdated || a.registeredDate).getTime() - new Date(b.lastUpdated || b.registeredDate).getTime();
        break;
      case "addedDate":
        compareValue = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
        break;
    }
    
    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) +
    (tagFilter !== "all" ? 1 : 0) +
    (createdDateFrom || createdDateTo ? 1 : 0) +
    (updatedDateFrom || updatedDateTo ? 1 : 0);

  const patientColumns: { id: PatientColumnId; label: string }[] = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "createdDate", label: "Created Date" },
    { id: "lastUpdated", label: "Last Updated" },
    { id: "tag", label: "Tag" },
    { id: "status", label: "Status" },
    { id: "action", label: "Action" },
  ];
  const activeColumnCount = patientColumns.filter((column) => visibleColumns[column.id]).length;

  const toggleColumn = (columnId: PatientColumnId) => {
    setVisibleColumns((current) => {
      if (current[columnId] && activeColumnCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResend = (patient: Patient) => {
    setPatientToResend(patient);
    setShowResendModal(true);
  };

  const confirmResend = () => {
    if (patientToResend) {
      setResentId(patientToResend.id);
      setTimeout(() => setResentId(null), 2000);
      setShowResendModal(false);
      setPatientToResend(null);
    }
  };

  const ViewIcon = viewMode === "grid" ? LayoutGrid : viewMode === "list" ? List : Table2;
  const showTableColumnControl = viewMode === "table";
  const allCurrentPatientsSelected = currentItems.length > 0 && currentItems.every((patient) => selectedPatientIds.includes(patient.id));

  const togglePatientSelection = (patientId: string) => {
    setSelectedPatientIds((current) =>
      current.includes(patientId)
        ? current.filter((id) => id !== patientId)
        : [...current, patientId]
    );
  };

  const toggleCurrentPageSelection = () => {
    if (allCurrentPatientsSelected) {
      setSelectedPatientIds((current) => current.filter((id) => !currentItems.some((patient) => patient.id === id)));
      return;
    }

    setSelectedPatientIds((current) => Array.from(new Set([...current, ...currentItems.map((patient) => patient.id)])));
  };

  const statusBadge = (patient: Patient) => (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-sm font-medium bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          patient.status === "Active"
            ? "bg-success-500"
            : patient.status === "Link sent"
            ? "bg-warning-500"
            : "bg-error-500"
        }`}
      />
      {patient.status}
    </span>
  );

  const renderViewOption = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      onClick={() => {
        setViewMode(mode);
        if (mode !== "table") {
          setShowColumnsPanel(false);
        }
        setShowViewMenu(false);
      }}
      className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-2 ${
        viewMode === mode
          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      {/* Resend Confirmation Modal */}
      {showResendModal && patientToResend && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600">
                  <Send className="size-5" />
                </div>
                <button 
                  onClick={() => setShowResendModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Resend Invitation Link?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                You are about to resend the invitation link to the following patient.
              </p>
            </div>
            
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Patient Name</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {patientToResend.firstName} {patientToResend.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Email Address</span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {patientToResend.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 flex gap-3">
              <button
                onClick={() => setShowResendModal(false)}
                className="flex-1 h-10 px-4 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResend}
                className="flex-1 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Confirm Resending
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-[32px] leading-[40px] font-semibold text-neutral-900 dark:text-white mb-1">
              Patients
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Clinic Admin</span>
              <ChevronDown className="-rotate-90 w-4 h-4 text-neutral-400 dark:text-neutral-600" />
              <span className="text-neutral-900 dark:text-white">Patients</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Manage and view all patient records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {showHeaderSearch ? (
              <div className="relative">
                <div className="h-12 w-[min(440px,calc(100vw-3rem))] flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm px-3">
                  <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      setShowColumnsPanel(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    title="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {showFilters && (
                  <div className="absolute right-0 top-full mt-3 w-[600px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
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
                              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="all">Select...</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Link sent">Link sent</option>
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
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                        <div>
                          <div className="relative">
                            <select
                              value="tag"
                              onChange={() => undefined}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="tag">Tag</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <div className="relative">
                            <select
                              value={tagFilter}
                              onChange={(e) => setTagFilter(e.target.value as typeof tagFilter)}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="all">Select...</option>
                              <option value="Staff Added">Staff Added</option>
                              <option value="Invited Patient">Invited Patient</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                          </div>
                        </div>
                        <button
                          onClick={() => setTagFilter("all")}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          title="Clear tag filter"
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
                        onClick={() => {
                          setStatusFilter("all");
                          setTagFilter("all");
                          setCreatedDateFrom("");
                          setCreatedDateTo("");
                          setUpdatedDateFrom("");
                          setUpdatedDateTo("");
                        }}
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
                title="Search"
                className="w-10 h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg transition-all"
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
                title="Customized columns"
                className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border rounded-lg transition-all ${
                  showColumnsPanel
                    ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <Table2 className="w-5 h-5" />
              </button>
              {showColumnsPanel && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowColumnsPanel(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-30">
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
                      {patientColumns.map((column) => (
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
                        {activeColumnCount} of {patientColumns.length} active
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            )}
            {showHeaderSearch && showTableColumnControl && showColumnsPanel && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowColumnsPanel(false)} />
                <div className="absolute right-2 top-24 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden z-30">
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
                    {patientColumns.map((column) => (
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
                      {activeColumnCount} of {patientColumns.length} active
                    </p>
                  </div>
                </div>
              </>
            )}
            {onAddPatient && (
              <button
                onClick={onAddPatient}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Patient
              </button>
            )}
            <button
              onClick={() => setShowSummary((value) => !value)}
              title="Summary"
              className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border rounded-lg transition-all ${
                showSummary
                  ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-700"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              title="Refresh"
              className="w-10 h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu((value) => !value)}
                title="More options"
                className={`w-10 h-10 flex items-center justify-center bg-white dark:bg-neutral-950 border rounded-lg transition-all ${
                  showMoreMenu
                    ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-30">
                  <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowViewMenu((value) => !value)}
                title="Change view mode"
                className="w-10 h-10 flex items-center justify-center text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 rounded-lg transition-all"
              >
                <ViewIcon className="w-5 h-5" />
              </button>
              {showViewMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-30">
                  {renderViewOption("grid", "Grid View", LayoutGrid)}
                  {renderViewOption("list", "List View", List)}
                  {renderViewOption("table", "Table View", Table2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {showSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Patients", value: filteredPatients.length, trend: "+12%", tone: "text-success-600 dark:text-success-400" },
              { label: "Active", value: filteredPatients.filter((patient) => patient.status === "Active").length, trend: "+5%", tone: "text-success-600 dark:text-success-400" },
              { label: "Invited", value: filteredPatients.filter((patient) => patient.status === "Link sent").length, trend: "0%", tone: "text-warning-600 dark:text-warning-400" },
              { label: "Inactive", value: filteredPatients.filter((patient) => patient.status === "Inactive").length, trend: "-2%", tone: "text-error-600 dark:text-error-400" },
            ].map((card) => (
              <div key={card.label} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[28px] leading-8 font-semibold text-neutral-900 dark:text-white">{card.value}</div>
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs mb-4">
                  <span className={card.tone}>{card.trend}</span>
                  <span className="text-neutral-500">vs last period</span>
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Patients Table */}
        {sortedPatients.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No patients found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all" || tagFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No patients have been registered yet"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {currentItems.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => onViewPatient(patient.id)}
                  className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer relative group"
                >
                  <div className="absolute top-4 right-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPatientIds.includes(patient.id)}
                      onChange={(event) => {
                        event.stopPropagation();
                        togglePatientSelection(patient.id);
                      }}
                      onClick={(event) => event.stopPropagation()}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                      aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                    />
                    <MoreVertical className="w-5 h-5 text-neutral-500" />
                  </div>
                  <div className="flex items-start gap-3 mb-4 pr-8">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 flex items-center justify-center text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 font-medium transition-all">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{patient.tag}</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Phone className="w-4 h-4" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      {patient.address?.city || "—"}, {patient.address?.state || "—"}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                    {statusBadge(patient)}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              totalItems={sortedPatients.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedPatients.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        ) : viewMode === "list" ? (
          <>
            <div className="space-y-2">
              {currentItems.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => onViewPatient(patient.id)}
                  className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedPatientIds.includes(patient.id)}
                      onChange={(event) => {
                        event.stopPropagation();
                        togglePatientSelection(patient.id);
                      }}
                      onClick={(event) => event.stopPropagation()}
                      className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                      aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                    />
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-medium">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{patient.email}</div>
                    </div>
                    <div className="hidden md:block text-sm text-neutral-600 dark:text-neutral-400">{patient.phone}</div>
                    <div className="hidden lg:block text-sm text-neutral-600 dark:text-neutral-400">
                      {patient.address?.city || "—"}, {patient.address?.state || "—"}
                    </div>
                    {statusBadge(patient)}
                    <MoreVertical className="w-5 h-5 text-neutral-500" />
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              totalItems={sortedPatients.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedPatients.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="w-14 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allCurrentPatientsSelected}
                        onChange={toggleCurrentPageSelection}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                        aria-label="Select all patients on this page"
                      />
                    </th>
                    {visibleColumns.name && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Name
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.email && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("email")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Email
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.phone && <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      Phone
                    </th>}
                    {visibleColumns.city && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("city")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        City
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.state && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("state")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        State
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.createdDate && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("addedDate")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Created Date
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.lastUpdated && <th className="px-4 py-3 text-left whitespace-nowrap">
                      <button
                        onClick={() => handleSort("lastUpdated")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Last Updated
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>}
                    {visibleColumns.tag && <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      Tag
                    </th>}
                    {visibleColumns.status && <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      Status
                    </th>}
                    {visibleColumns.action && <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                      Action
                    </th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {currentItems.map((patient) => (
                      <tr
                        key={patient.id}
                        className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={() => onViewPatient(patient.id)}
                      >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPatientIds.includes(patient.id)}
                          onChange={(event) => {
                            event.stopPropagation();
                            togglePatientSelection(patient.id);
                          }}
                          onClick={(event) => event.stopPropagation()}
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                          aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                        />
                      </td>
                      {/* Name */}
                      {visibleColumns.name && <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {patient.firstName} {patient.lastName}
                          </p>
                        </div>
                      </td>}

                      {/* Email */}
                      {visibleColumns.email && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">
                          {patient.email}
                        </p>
                      </td>}

                      {/* Phone */}
                      {visibleColumns.phone && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.phone}
                        </p>
                      </td>}

                      {/* City */}
                      {visibleColumns.city && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.address?.city || "—"}
                        </p>
                      </td>}

                      {/* State */}
                      {visibleColumns.state && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.address?.state || "—"}
                        </p>
                      </td>}

                      {/* Created Date */}
                      {visibleColumns.createdDate && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDateTime(patient.addedDate)}
                        </p>
                      </td>}

                      {/* Last Updated */}
                      {visibleColumns.lastUpdated && <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDateTime(patient.lastUpdated || patient.registeredDate)}
                        </p>
                      </td>}

                      {/* Tag */}
                      {visibleColumns.tag && <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            patient.tag === "Staff Added"
                              ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {patient.tag}
                        </span>
                      </td>}

                      {/* Status */}
                      {visibleColumns.status && <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            patient.status === "Active"
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>}

                      {/* Action */}
                      {visibleColumns.action && <td className="px-4 py-3 whitespace-nowrap">
                        {patient.tag === "Invited Patient" ? (
                          <div className="flex items-center gap-3">
                            <div className="relative group/copy">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(patient.id);
                                }}
                                className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
                              >
                                {copiedId === patient.id ? (
                                  <Check className="w-4 h-4 text-success-600 font-bold" />
                                ) : (
                                  <Link className="w-4 h-4" />
                                )}
                              </button>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/copy:block px-2 py-1 bg-neutral-800 text-white text-[10px] rounded whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                {copiedId === patient.id ? "Copied!" : "Copy Link"}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
                              </div>
                            </div>

                            <div className="relative group/resend">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResend(patient);
                                }}
                                className="text-neutral-400 hover:text-primary-600 transition-colors p-1"
                              >
                                {resentId === patient.id ? (
                                  <Check className="w-4 h-4 text-success-600" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </button>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/resend:block px-2 py-1 bg-neutral-800 text-white text-[10px] rounded whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                {resentId === patient.id ? "Resent!" : "Resend Link"}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-sm">—</span>
                        )}
                      </td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedPatients.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedPatients.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
