import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, X, Download, CheckCircle, XCircle, RotateCcw, DollarSign } from "lucide-react";

interface Payment {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  method: "Stripe" | "PayPal" | "Cash" | "Check";
  transactionRef?: string;
  status: "Success" | "Failed" | "Refunded";
  locationId: string;
  locationName: string;
}

interface PaymentsOverviewScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments") => void;
  onLogout?: () => void;
}

export function PaymentsOverviewScreen({
  onNavigate,
  onLogout,
}: PaymentsOverviewScreenProps) {
  // Mock data
  const locations = [
    { id: "loc-1", name: "Downtown Clinic" },
    { id: "loc-2", name: "Westside Branch" },
    { id: "loc-3", name: "Eastside Clinic" },
  ];

  const [payments] = useState<Payment[]>([
    {
      id: "pay-001",
      date: "2026-01-29T09:30:00",
      patientId: "PT-001",
      patientName: "Sarah Johnson",
      invoiceId: "inv-001",
      invoiceNumber: "INV-2026-001",
      amount: 150.00,
      method: "Stripe",
      transactionRef: "ch_1234567890abcdef",
      status: "Success",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
    },
    {
      id: "pay-002",
      date: "2026-01-29T10:15:00",
      patientId: "PT-002",
      patientName: "James Wilson",
      invoiceId: "inv-002",
      invoiceNumber: "INV-2026-002",
      amount: 100.00,
      method: "PayPal",
      transactionRef: "PAYID-ABCD1234",
      status: "Success",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
    },
    {
      id: "pay-003",
      date: "2026-01-28T14:20:00",
      patientId: "PT-003",
      patientName: "Maria Garcia",
      invoiceId: "inv-003",
      invoiceNumber: "INV-2026-003",
      amount: 180.00,
      method: "Cash",
      status: "Success",
      locationId: "loc-2",
      locationName: "Westside Branch",
    },
    {
      id: "pay-004",
      date: "2026-01-28T11:45:00",
      patientId: "PT-004",
      patientName: "Robert Chen",
      invoiceId: "inv-004",
      invoiceNumber: "INV-2026-004",
      amount: 75.00,
      method: "Stripe",
      transactionRef: "ch_failed123456",
      status: "Failed",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
    },
    {
      id: "pay-005",
      date: "2026-01-27T16:00:00",
      patientId: "PT-005",
      patientName: "Lisa Anderson",
      invoiceId: "inv-005",
      invoiceNumber: "INV-2026-005",
      amount: 300.00,
      method: "Stripe",
      transactionRef: "ch_refund789012",
      status: "Refunded",
      locationId: "loc-3",
      locationName: "Eastside Clinic",
    },
    {
      id: "pay-006",
      date: "2026-01-27T13:30:00",
      patientId: "PT-006",
      patientName: "David Martinez",
      invoiceId: "inv-006",
      invoiceNumber: "INV-2026-006",
      amount: 220.00,
      method: "Check",
      transactionRef: "CHK-20260127-001",
      status: "Success",
      locationId: "loc-2",
      locationName: "Westside Branch",
    },
    {
      id: "pay-007",
      date: "2026-01-26T10:00:00",
      patientId: "PT-007",
      patientName: "Emily Taylor",
      invoiceId: "inv-007",
      invoiceNumber: "INV-2026-007",
      amount: 125.00,
      method: "Manual",
      status: "Success",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" });
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterMethod, setFilterMethod] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Failed":
        return "bg-destructive-100 text-destructive-700 border-destructive-200 dark:bg-destructive-950/30 dark:text-destructive-400 dark:border-destructive-800";
      case "Refunded":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      case "Refunded":
        return <RotateCcw className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Stripe":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400";
      case "PayPal":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "Cash":
        return "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-400";
      case "Check":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400";
      case "Manual":
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  const toggleMethod = (method: string) => {
    if (filterMethod.includes(method)) {
      setFilterMethod(filterMethod.filter((m) => m !== method));
    } else {
      setFilterMethod([...filterMethod, method]);
    }
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
    setFilterMethod([]);
    setFilterStatus([]);
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    // Search filter
    const searchMatch =
      !searchQuery ||
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionRef?.toLowerCase().includes(searchQuery.toLowerCase());

    // Location filter
    const locationMatch = filterLocation === "all" || payment.locationId === filterLocation;

    // Method filter
    const methodMatch = filterMethod.length === 0 || filterMethod.includes(payment.method);

    // Status filter
    const statusMatch = filterStatus.length === 0 || filterStatus.includes(payment.status);

    // Date range filter
    let dateMatch = true;
    if (filterDateRange.start && filterDateRange.end) {
      const paymentDate = new Date(payment.date);
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      endDate.setHours(23, 59, 59, 999);
      dateMatch = paymentDate >= startDate && paymentDate <= endDate;
    }

    return searchMatch && locationMatch && methodMatch && statusMatch && dateMatch;
  });

  // Calculate summary stats
  const totalPayments = filteredPayments.length;
  const successfulPayments = filteredPayments.filter((p) => p.status === "Success").length;
  const failedPayments = filteredPayments.filter((p) => p.status === "Failed").length;
  const refundedPayments = filteredPayments.filter((p) => p.status === "Refunded").length;
  const totalReceived = filteredPayments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = filteredPayments
    .filter((p) => p.status === "Refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    const headers = ["Date", "Patient", "Invoice #", "Amount", "Method", "Transaction Ref", "Status", "Location"];
    const rows = filteredPayments.map((payment) => [
      formatDateTime(payment.date),
      payment.patientName,
      payment.invoiceNumber,
      formatCurrency(payment.amount),
      payment.method,
      payment.transactionRef || "—",
      payment.status,
      payment.locationName,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ClinicAdminLayout activeMenu="payments" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Payments</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Track and monitor payment activity across all locations
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Total payments</p>
            <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">
              {totalPayments}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Successful</p>
            <p className="text-2xl font-semibold text-success-600 dark:text-success-400 mt-1">
              {successfulPayments}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Failed</p>
            <p className="text-2xl font-semibold text-destructive mt-1">
              {failedPayments}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Refunded</p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mt-1">
              {refundedPayments}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total received</p>
            </div>
            <p className="text-2xl font-semibold text-success-600 dark:text-success-400">
              {formatCurrency(totalReceived)}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <RotateCcw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total refunded</p>
            </div>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {formatCurrency(totalRefunded)}
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
                placeholder="Search by patient, invoice number, or transaction reference..."
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
                  showFilters || filterStatus.length > 0 || filterMethod.length > 0 || filterLocation !== "all"
                    ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                    : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                {(filterStatus.length > 0 || filterMethod.length > 0 || filterLocation !== "all") && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs">
                    {filterStatus.length + filterMethod.length + (filterLocation !== "all" ? 1 : 0)}
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
                          Date range
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

                      {/* Payment Method */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Payment method
                        </label>
                        <div className="space-y-2">
                          {["Stripe", "PayPal", "Cash", "Check"].map((method) => (
                            <label key={method} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={filterMethod.includes(method)}
                                onChange={() => toggleMethod(method)}
                                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                              />
                              <span className="text-sm text-neutral-900 dark:text-white">
                                {method}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Status
                        </label>
                        <div className="space-y-2">
                          {["Success", "Failed", "Refunded"].map((status) => (
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
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Transaction ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {formatDateTime(payment.date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {payment.patientName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {payment.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {formatCurrency(payment.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${getMethodColor(
                            payment.method
                          )}`}
                        >
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                          {payment.transactionRef || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No payments found matching your criteria
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}