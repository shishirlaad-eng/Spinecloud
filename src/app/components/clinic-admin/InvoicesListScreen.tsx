import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, X, Download, AlertCircle, CheckCircle, Clock, Plus, Mail, Printer } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { CreateInvoiceDrawer } from "./CreateInvoiceDrawer";
import { ViewInvoiceDrawer } from "./ViewInvoiceDrawer";

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface LinkedCodeGroup {
  id: string;
  icdCode: ICDCPTCode;
  cptCodes: ICDCPTCode[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  locationId: string;
  locationName: string;
  service: string;
  visitRef?: string;
  visitDate?: string;
  invoiceDate: string;
  dueDate?: string;
  totalAmount: number;
  status: "Unpaid" | "Paid";
  linkedCodeGroups?: LinkedCodeGroup[];
  lineItems?: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  paymentMethod?: string;
}

interface InvoicesListScreenProps {
  onNavigate: (menu: string) => void;
  onViewInvoice: (invoiceId: string) => void;
  onLogout?: () => void;
}

export function InvoicesListScreen({
  onNavigate,
  onViewInvoice,
  onLogout,
}: InvoicesListScreenProps) {
  // Mock data
  const locations = [
    { id: "loc-1", name: "Downtown Clinic" },
    { id: "loc-2", name: "Westside Branch" },
    { id: "loc-3", name: "Eastside Clinic" },
  ];

  const [invoices] = useState<Invoice[]>([
    {
      id: "inv-001",
      invoiceNumber: "INV-2026-001",
      patientId: "PT-001",
      patientName: "Sarah Johnson",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Consultation",
      visitRef: "APT-2026-123",
      visitDate: "2026-01-25",
      invoiceDate: "2026-01-25",
      dueDate: "2026-02-25",
      totalAmount: 350.00,
      status: "Unpaid",
      linkedCodeGroups: [
        {
          id: "group-1",
          icdCode: { code: "M54.5", description: "Low back pain", type: "ICD" as const },
          cptCodes: [
            { code: "98941", description: "Chiropractic manipulative treatment (CMT) 3-4 regions", type: "CPT" as const },
            { code: "97010", description: "Hot or cold packs therapy", type: "CPT" as const },
          ],
        },
        {
          id: "group-2",
          icdCode: { code: "M79.1", description: "Myalgia (muscle pain)", type: "ICD" as const },
          cptCodes: [
            { code: "97110", description: "Therapeutic exercises", type: "CPT" as const },
          ],
        },
      ],
      lineItems: [
        { id: "li-1-1", description: "Chiropractic Adjustment", quantity: 1, rate: 150.00, amount: 150.00 },
        { id: "li-1-2", description: "Therapeutic Exercises", quantity: 1, rate: 100.00, amount: 100.00 },
        { id: "li-1-3", description: "Consultation Fee", quantity: 1, rate: 100.00, amount: 100.00 },
      ],
      paymentMethod: "Insurance",
    },
    {
      id: "inv-002",
      invoiceNumber: "INV-2026-002",
      patientId: "PT-002",
      patientName: "James Wilson",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Follow-up",
      visitRef: "APT-2026-124",
      visitDate: "2026-01-26",
      invoiceDate: "2026-01-26",
      dueDate: "2026-02-26",
      totalAmount: 250.00,
      status: "Unpaid",
      linkedCodeGroups: [
        {
          id: "group-3",
          icdCode: { code: "M99.03", description: "Segmental dysfunction", type: "ICD" as const },
          cptCodes: [
            { code: "98940", description: "Chiropractic manipulative treatment (CMT) 1-2 regions", type: "CPT" as const },
          ],
        },
      ],
      lineItems: [
        { id: "li-2-1", description: "Follow-up Adjustment", quantity: 1, rate: 120.00, amount: 120.00 },
        { id: "li-2-2", description: "Manual Therapy", quantity: 1, rate: 130.00, amount: 130.00 },
      ],
      paymentMethod: "Credit Card",
    },
    {
      id: "inv-003",
      invoiceNumber: "INV-2026-003",
      patientId: "PT-003",
      patientName: "Maria Garcia",
      locationId: "loc-2",
      locationName: "Westside Branch",
      service: "Consultation",
      visitRef: "APT-2026-125",
      visitDate: "2026-01-27",
      invoiceDate: "2026-01-27",
      totalAmount: 180.00,
      status: "Paid",
      linkedCodeGroups: [
        {
          id: "group-4",
          icdCode: { code: "M25.511", description: "Pain in right shoulder", type: "ICD" as const },
          cptCodes: [
            { code: "97140", description: "Manual therapy techniques", type: "CPT" as const },
          ],
        },
      ],
      lineItems: [
        { id: "li-3-1", description: "Shoulder Treatment", quantity: 1, rate: 180.00, amount: 180.00 },
      ],
      paymentMethod: "Cash",
    },
    {
      id: "inv-004",
      invoiceNumber: "INV-2026-004",
      patientId: "PT-004",
      patientName: "Robert Chen",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Follow-up",
      visitRef: "APT-2026-126",
      visitDate: "2026-01-15",
      invoiceDate: "2026-01-15",
      dueDate: "2026-01-20",
      totalAmount: 420.00,
      status: "Unpaid",
      linkedCodeGroups: [
        {
          id: "group-5",
          icdCode: { code: "M47.816", description: "Cervical spondylosis", type: "ICD" as const },
          cptCodes: [
            { code: "97530", description: "Therapeutic activities", type: "CPT" as const },
          ],
        },
        {
          id: "group-6",
          icdCode: { code: "M51.26", description: "Lumbar disc herniation", type: "ICD" as const },
          cptCodes: [
            { code: "97035", description: "Ultrasound therapy", type: "CPT" as const },
            { code: "97110", description: "Therapeutic exercises", type: "CPT" as const },
          ],
        },
      ],
      lineItems: [
        { id: "li-4-1", description: "Spinal Decompression", quantity: 2, rate: 150.00, amount: 300.00 },
        { id: "li-4-2", description: "Ultrasound Therapy", quantity: 1, rate: 80.00, amount: 80.00 },
        { id: "li-4-3", description: "Rehabilitation Program", quantity: 1, rate: 40.00, amount: 40.00 },
      ],
      paymentMethod: "Debit Card",
    },
    {
      id: "inv-005",
      invoiceNumber: "INV-2026-005",
      patientId: "PT-005",
      patientName: "Lisa Anderson",
      locationId: "loc-3",
      locationName: "Eastside Clinic",
      service: "Consultation",
      visitRef: "APT-2026-127",
      visitDate: "2026-01-28",
      invoiceDate: "2026-01-28",
      totalAmount: 300.00,
      status: "Paid",
      linkedCodeGroups: [
        {
          id: "group-7",
          icdCode: { code: "M62.81", description: "Muscle weakness", type: "ICD" as const },
          cptCodes: [
            { code: "97112", description: "Neuromuscular reeducation", type: "CPT" as const },
          ],
        },
      ],
      lineItems: [
        { id: "li-5-1", description: "Initial Assessment", quantity: 1, rate: 150.00, amount: 150.00 },
        { id: "li-5-2", description: "Neuromuscular Training", quantity: 1, rate: 150.00, amount: 150.00 },
      ],
      paymentMethod: "Insurance",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" });
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterAmountRange, setFilterAmountRange] = useState({ min: "", max: "" });
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>(invoices);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDateRange, filterLocation, filterStatus, filterAmountRange]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Unpaid":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Unpaid":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isOverdue = (invoice: Invoice) => {
    if (!invoice.dueDate || invoice.status === "Paid") return false;
    const today = new Date();
    const dueDate = new Date(invoice.dueDate);
    return dueDate < today;
  };

  const toggleStatus = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const clearFilters = () => {
    setFilterDateRange({ start: "", end: "" });
    setFilterLocation("all");
    setFilterStatus([]);
    setFilterAmountRange({ min: "", max: "" });
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  // Filter invoices
  const filteredInvoices = invoicesList.filter((invoice) => {
    // Search filter
    const searchMatch =
      !searchQuery ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase());

    // Location filter
    const locationMatch = filterLocation === "all" || invoice.locationId === filterLocation;

    // Status filter
    const statusMatch = filterStatus.length === 0 || filterStatus.includes(invoice.status);

    // Date range filter
    let dateMatch = true;
    if (filterDateRange.start && filterDateRange.end) {
      const invoiceDate = new Date(invoice.invoiceDate);
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      dateMatch = invoiceDate >= startDate && invoiceDate <= endDate;
    }

    // Amount range filter
    let amountMatch = true;
    if (filterAmountRange.min || filterAmountRange.max) {
      const min = parseFloat(filterAmountRange.min) || 0;
      const max = parseFloat(filterAmountRange.max) || Infinity;
      amountMatch = invoice.totalAmount >= min && invoice.totalAmount <= max;
    }

    return searchMatch && locationMatch && statusMatch && dateMatch && amountMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate summary stats
  const totalInvoices = filteredInvoices.length;
  const totalUnpaid = filteredInvoices.filter((inv) => inv.status === "Unpaid").length;
  const totalOverdue = filteredInvoices.filter((inv) => isOverdue(inv)).length;
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalBalance = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleExport = () => {
    // Simple CSV export
    const headers = ["Invoice #", "Patient", "Location", "Invoice Date", "Total", "Balance Due", "Status"];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.patientName,
      inv.locationName,
      formatDate(inv.invoiceDate),
      formatCurrency(inv.totalAmount),
      formatCurrency(inv.totalAmount),
      inv.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ClinicAdminLayout activeMenu="invoices" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Invoices</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Track and manage invoices across all locations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total invoices</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
              {totalInvoices}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Unpaid</p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">
              {totalUnpaid}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Overdue</p>
            <p className="text-2xl font-semibold text-destructive mt-1">
              {totalOverdue}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total amount</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Outstanding balance</p>
            <p className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mt-1">
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {/* Search and Filter Bar */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by invoice number or patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                  showFilters || filterStatus.length > 0 || filterLocation !== "all"
                    ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filterStatus.length > 0 || filterLocation !== "all") && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs">
                    {filterStatus.length + (filterLocation !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Filter options
                      </h4>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Date Range */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Invoice date range
                        </label>
                        <div className="space-y-2">
                          <input
                            type="date"
                            value={filterDateRange.start}
                            onChange={(e) =>
                              setFilterDateRange({ ...filterDateRange, start: e.target.value })
                            }
                            className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                          />
                          <input
                            type="date"
                            value={filterDateRange.end}
                            onChange={(e) =>
                              setFilterDateRange({ ...filterDateRange, end: e.target.value })
                            }
                            className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Location
                        </label>
                        <select
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                        >
                          <option value="all">All locations</option>
                          {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Status
                        </label>
                        <div className="space-y-2">
                          {["Unpaid", "Paid"].map((status) => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filterStatus.includes(status)}
                                onChange={() => toggleStatus(status)}
                                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                              />
                              <span className="text-sm text-neutral-900 dark:text-white">
                                {status}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Amount Range */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Amount range
                        </label>
                        <div className="space-y-2">
                          <input
                            type="number"
                            placeholder="Min amount"
                            value={filterAmountRange.min}
                            onChange={(e) =>
                              setFilterAmountRange({ ...filterAmountRange, min: e.target.value })
                            }
                            className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                          />
                          <input
                            type="number"
                            placeholder="Max amount"
                            value={filterAmountRange.max}
                            onChange={(e) =>
                              setFilterAmountRange({ ...filterAmountRange, max: e.target.value })
                            }
                            className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <button
                        onClick={applyFilters}
                        className="flex-1 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        Apply filters
                      </button>
                      <button
                        onClick={clearFilters}
                        className="flex-1 h-9 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Create Invoice Button */}
            <button
              onClick={() => setShowCreateDrawer(true)}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Invoice date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Balance due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowViewDrawer(true);
                          }}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline"
                        >
                          {invoice.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {invoice.patientName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {invoice.service}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {invoice.locationName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(invoice.invoiceDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(invoice.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {getStatusIcon(invoice.status)}
                            {invoice.status}
                          </span>
                          {isOverdue(invoice) && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-destructive text-white">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No invoices found matching your criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={filteredInvoices.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredInvoices.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </div>

      {/* Create Invoice Drawer */}
      <CreateInvoiceDrawer
        show={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        onInvoiceCreated={(newInvoice) => setInvoicesList([...invoicesList, newInvoice])}
      />

      {/* View Invoice Drawer */}
      <ViewInvoiceDrawer
        show={showViewDrawer}
        onClose={() => {
          setShowViewDrawer(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onUpdate={(updatedInvoice) => {
          setInvoicesList(
            invoicesList.map((inv) =>
              inv.id === updatedInvoice.id ? updatedInvoice : inv
            )
          );
        }}
      />
    </ClinicAdminLayout>
  );
}