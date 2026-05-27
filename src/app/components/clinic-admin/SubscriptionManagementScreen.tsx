import { useState } from "react";
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter, X } from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Pagination } from "../shared/Pagination";

interface SubscriptionManagementScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription") => void;
  onUpgrade: () => void;
  onCancel: () => void;
  onLogout?: () => void;
}

interface Subscription {
  id: string;
  plan: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  startDate: string;
  expirationDate: string;
  duration: string;
  status: "active" | "expired" | "cancelled";
}

const mockSubscriptions: Subscription[] = [
  {
    id: "sub_001",
    plan: "Professional",
    billingCycle: "monthly",
    amount: 249,
    startDate: "2026-01-22",
    expirationDate: "2027-01-22",
    duration: "12 months",
    status: "active",
  },
  {
    id: "sub_002",
    plan: "Starter",
    billingCycle: "yearly",
    amount: 948,
    startDate: "2025-01-22",
    expirationDate: "2026-01-22",
    duration: "12 months",
    status: "expired",
  },
  {
    id: "sub_003",
    plan: "Starter",
    billingCycle: "monthly",
    amount: 99,
    startDate: "2024-07-15",
    expirationDate: "2024-12-15",
    duration: "5 months",
    status: "cancelled",
  },
];

export function SubscriptionManagementScreen({
  onNavigate,
  onUpgrade,
  onCancel,
  onLogout,
}: SubscriptionManagementScreenProps) {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [billingFilter, setBillingFilter] = useState<string>("all");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const activeSubscription = subscriptions.find((sub) => sub.status === "active");

  const activeFilterCount = [
    statusFilter !== "all",
    billingFilter !== "all",
    startDateFrom !== "",
    startDateTo !== "",
  ].filter(Boolean).length;

  const filteredHistory = subscriptions
    .filter((sub) => sub.status !== "active")
    .filter((sub) => {
      const matchesSearch = sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      const matchesBilling = billingFilter === "all" || sub.billingCycle === billingFilter;
      const subStart = new Date(sub.startDate);
      const matchesFrom = startDateFrom === "" || subStart >= new Date(startDateFrom);
      const matchesTo = startDateTo === "" || subStart <= new Date(startDateTo);
      return matchesSearch && matchesStatus && matchesBilling && matchesFrom && matchesTo;
    });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setBillingFilter("all");
    setStartDateFrom("");
    setStartDateTo("");
  };

  const getStatusBadge = (status: Subscription["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success-50 text-success-700 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-full">
            <Clock className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-destructive-50 text-destructive text-xs font-semibold rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  return (
    <ClinicAdminLayout activeMenu="subscription" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
            Subscription management
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            View and manage your subscription plans
          </p>
        </div>

        {/* Active Subscription — Compact Banner */}
        {activeSubscription && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wide">
                      Current Plan: {activeSubscription.plan}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 text-[10px] font-bold uppercase rounded-md border border-success-200 dark:border-success-800">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Renews on {formatDate(activeSubscription.expirationDate)}
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      ${activeSubscription.amount}/{activeSubscription.billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="h-9 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel subscription
                </button>
                <button
                  onClick={onUpgrade}
                  className="h-9 px-4 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription History — Primary Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col min-h-[500px]">
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Subscription history
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              View and manage your past subscription cycles
            </p>
          </div>

          {/* Search and Filter Toggle Bar */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative inline-flex items-center gap-2 h-10 px-4 border rounded-lg text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Start Date From */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    Start Date From
                  </label>
                  <input
                    type="date"
                    value={startDateFrom}
                    onChange={(e) => { setStartDateFrom(e.target.value); setCurrentPage(1); }}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                {/* Start Date To */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    Start Date To
                  </label>
                  <input
                    type="date"
                    value={startDateTo}
                    onChange={(e) => { setStartDateTo(e.target.value); setCurrentPage(1); }}
                    min={startDateFrom}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                {/* Status Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Billing Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                    Billing Cycle
                  </label>
                  <select
                    value={billingFilter}
                    onChange={(e) => { setBillingFilter(e.target.value); setCurrentPage(1); }}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Cycles</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                <tr>
                  {["Plan", "Billing", "Amount", "Start Date", "Expiration Date", "Duration", "Status"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedHistory.length > 0 ? (
                  paginatedHistory.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-neutral-900 dark:text-white">
                        {subscription.plan}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                        {subscription.billingCycle}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-neutral-900 dark:text-white">
                        ${subscription.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(subscription.startDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(subscription.expirationDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                        {subscription.duration}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(subscription.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">No subscription history found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredHistory.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-md w-full p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-destructive-50 dark:bg-destructive-950/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Cancel subscription
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your current billing period.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Keep subscription
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="h-9 px-4 bg-destructive text-white text-sm font-medium rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Cancel subscription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
