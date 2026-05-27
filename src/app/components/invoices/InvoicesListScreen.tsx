import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { FileText, Download, CreditCard, X, Check, Search, Filter, ChevronRight, ChevronDown } from "lucide-react";
import { useRef } from "react";

interface Invoice {
  id: string;
  invoiceId: string;
  appointmentId: string;
  date: string;
  totalAmount: number;
  paymentType: string;
  paymentStatus: "Paid" | "Unpaid";
}

interface InvoicesListScreenProps {
  invoices: Invoice[];
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings" | "tickets" | "clinicalRecords" | "spineCloud") => void;
  onLogout?: () => void;
  onViewAppointment?: (appointmentId: string) => void;
  onPaymentComplete?: (invoiceId: string) => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  onNavigateToProfile?: () => void;
}

export function InvoicesListScreen({
  invoices,
  onNavigate,
  onLogout,
  onViewAppointment,
  onPaymentComplete,
  currentEntity,
  onEntitySwitch,
  onNavigateToProfile,
}: InvoicesListScreenProps) {
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Paid" | "Unpaid">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [paymentType, setPaymentType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, fromDate, toDate, paymentType]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      searchQuery === "" ||
      invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.appointmentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      invoice.paymentStatus === statusFilter;
      
    const matchesType = paymentType === "all" || invoice.paymentType === paymentType;
    
    let matchesDate = true;
    if (fromDate || toDate) {
      const d = new Date(invoice.date); d.setHours(0,0,0,0);
      if (fromDate) {
        const from = new Date(fromDate); from.setHours(0,0,0,0);
        if (d < from) matchesDate = false;
      }
      if (toDate) {
        const to = new Date(toDate); to.setHours(23,59,59,999);
        if (d > to) matchesDate = false;
      }
    }
      
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const activeFilterCount = (statusFilter !== "all" ? 1 : 0) + (paymentType !== "all" ? 1 : 0) + (fromDate || toDate ? 1 : 0);
  
  const uniquePaymentTypes = ["all", ...Array.from(new Set(invoices.map(i => i.paymentType)))];

  const totalPages = Math.ceil(filteredInvoices.length / pageSize);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewPDF = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPDFViewer(true);
  };

  const handlePayment = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
    setShowPaymentPopup(true);
    setPaymentSuccess(false);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Call the payment complete callback
      if (paymentInvoice && onPaymentComplete) {
        onPaymentComplete(paymentInvoice.id);
      }
      
      // Close popup after showing success
      setTimeout(() => {
        setShowPaymentPopup(false);
        setPaymentInvoice(null);
        setPaymentSuccess(false);
      }, 2000);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <DashboardLayout 
      activeMenu="invoices" 
      onNavigate={onNavigate as any} 
      onLogout={onLogout}
      currentEntity={currentEntity}
      onEntitySwitch={onEntitySwitch}
      onNavigateToProfile={onNavigateToProfile}
    >
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1.5">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-[#0b1c30]">Invoices</span>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-0.5">
            Invoices
          </h1>
          <p className="text-sm text-neutral-500">
            View and manage all your invoices
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Invoice ID or Appointment ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4] transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterDropdown(v => !v)}
              className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-all ${
                activeFilterCount > 0
                  ? "bg-[#eff4ff] dark:bg-primary-950/30 border-[#1d77b4] text-[#005e93] dark:text-primary-300"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#1d77b4] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</span>
                  <button onClick={() => setShowFilterDropdown(false)} className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Payment Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as "all" | "Paid" | "Unpaid")}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4]"
                  >
                    <option value="all">All</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Payment Type</label>
                  <select
                    value={paymentType}
                    onChange={e => setPaymentType(e.target.value)}
                    className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4]"
                  >
                    {uniquePaymentTypes.map(pt => (
                      <option key={pt} value={pt}>{pt === "all" ? "All Types" : pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Invoice Date</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-medium text-neutral-500 block mb-1">From</label>
                      <input
                        type="date"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                        className="w-full h-9 px-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-medium text-neutral-500 block mb-1">To</label>
                      <input
                        type="date"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                        className="w-full h-9 px-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4]"
                      />
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setFromDate("");
                      setToDate("");
                      setPaymentType("all");
                    }}
                    className="w-full h-9 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {[
                    "Invoice Date",
                    "Invoice ID",
                    "Appointment ID",
                    "Total Amount",
                    "Payment Type",
                    "Payment Status",
                    "Actions"
                  ].map((col) => (
                    <th
                      key={col}
                      className={`px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${
                        col === "Actions" ? "text-right" : ""
                      }`}
                    >
                      <div className={`flex items-center gap-1 ${col === "Actions" ? "justify-end" : ""}`}>
                        {col}
                        {col !== "Actions" && (
                          <div className="flex flex-col scale-75 opacity-40">
                            <ChevronDown className="w-3 h-3 -mb-1 rotate-180" />
                            <ChevronDown className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {searchQuery ? "No invoices found matching your search" : "No invoices found"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium">
                        {invoice.invoiceId}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => onViewAppointment?.(invoice.appointmentId)}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          {invoice.appointmentId}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {invoice.paymentType}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                            invoice.paymentStatus === "Paid"
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* PDF Download Icon */}
                          <button
                            onClick={() => handleViewPDF(invoice)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            title="View Invoice PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination UI */}
        {filteredInvoices.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="h-9 px-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-[#1d77b4] focus:ring-1 focus:ring-[#1d77b4]"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredInvoices.length)} of {filteredInvoices.length} invoices
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-[#1d77b4] text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedInvoice && (
        <div className="fixed inset-0 bg-neutral-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Invoice {selectedInvoice.invoiceId}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {formatDate(selectedInvoice.date)}
                </p>
              </div>
              <button
                onClick={() => setShowPDFViewer(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-white border border-neutral-200 rounded-lg p-8 space-y-6">
                {/* Invoice Header */}
                <div className="flex items-start justify-between pb-6 border-b border-neutral-200">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">SpineCloudIQ</h2>
                    <p className="text-sm text-neutral-600 mt-2">
                      123 Main Street, Suite 400<br />
                      New York, NY 10001<br />
                      Phone: (555) 123-4567
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">INVOICE</p>
                    <p className="text-sm text-neutral-600 mt-1">
                      {selectedInvoice.invoiceId}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Date: {formatDate(selectedInvoice.date)}
                    </p>
                  </div>
                </div>

                {/* Bill To */}
                <div>
                  <p className="text-sm font-semibold text-neutral-900 mb-2">Bill To:</p>
                  <p className="text-sm text-neutral-600">
                    Emma Wilson<br />
                    456 Oak Avenue<br />
                    New York, NY 10002
                  </p>
                </div>

                {/* Invoice Items */}
                <div>
                  <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-900">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-neutral-600">
                          Chiropractic Consultation<br />
                          <span className="text-neutral-500">Appointment: {selectedInvoice.appointmentId}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900 text-right font-medium">
                          {formatCurrency(selectedInvoice.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="flex justify-end pt-6 border-t border-neutral-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-12">
                      <span className="text-sm font-semibold text-neutral-900">Total:</span>
                      <span className="text-lg font-bold text-neutral-900">
                        {formatCurrency(selectedInvoice.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-12">
                      <span className="text-sm text-neutral-600">Payment Type:</span>
                      <span className="text-sm text-neutral-900">{selectedInvoice.paymentType}</span>
                    </div>
                    <div className="flex items-center gap-12">
                      <span className="text-sm text-neutral-600">Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedInvoice.paymentStatus === "Paid"
                            ? "text-success-700"
                            : "text-neutral-700"
                        }`}
                      >
                        {selectedInvoice.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && paymentInvoice && (
        <div className="fixed inset-0 bg-neutral-950/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {paymentSuccess ? "Payment Successful" : "Payment Details"}
              </h3>
              {!isProcessing && !paymentSuccess && (
                <button
                  onClick={() => setShowPaymentPopup(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-success-100 dark:bg-success-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-success-600 dark:text-success-400" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                    Payment processed successfully!
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Your payment of {formatCurrency(paymentInvoice.totalAmount)} has been confirmed.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Invoice Summary */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Invoice ID:</span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {paymentInvoice.invoiceId}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Amount Due:</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(paymentInvoice.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Card Details (Dummy) */}
                  <div className="space-y-4">
                    <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900 rounded-lg p-4">
                      <p className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
                        Demo Payment Information:
                      </p>
                      <div className="space-y-1 text-sm text-primary-700 dark:text-primary-300">
                        <p>Card Number: 4242 4242 4242 4242</p>
                        <p>Expiry: 12/25</p>
                        <p>CVV: 123</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value="4242 4242 4242 4242"
                        readOnly
                        className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value="12/25"
                          readOnly
                          className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="text"
                          value="123"
                          readOnly
                          className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Process Payment Button */}
                  <button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    {isProcessing ? "Processing..." : `Pay ${formatCurrency(paymentInvoice.totalAmount)}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}