import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, X, Plus, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { RaiseTicketDrawer } from "./RaiseTicketDrawer";
import { Pagination } from "../shared/Pagination";

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
  description: string;
}

interface RaiseTicketScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "email-management" | "clinic-settings" | "tickets" | "raise-ticket") => void;
  onViewTicket: (ticketId: string) => void;
  onLogout?: () => void;
}

export function RaiseTicketScreen({
  onNavigate,
  onViewTicket,
  onLogout,
}: RaiseTicketScreenProps) {
  // Mock tickets data - tickets raised by clinic admin to super admin
  const [tickets] = useState<Ticket[]>([
    {
      id: "1",
      ticketId: "SA-TKT-2026-001",
      subject: "Request for multi-branch support feature",
      category: "Feature Request",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2026-02-15T10:30:00",
      updatedAt: "2026-02-18T14:20:00",
      description: "We need functionality to manage multiple branch locations under one clinic account. This would include separate scheduling, staff management, and reporting for each branch.",
    },
    {
      id: "2",
      ticketId: "SA-TKT-2026-002",
      subject: "Subscription upgrade not reflecting",
      category: "Billing",
      priority: "High",
      createdAt: "2026-02-18T09:15:00",
      updatedAt: "2026-02-18T16:45:00",
      description: "We upgraded our subscription to Premium plan but the features are not unlocked yet. Payment was processed successfully.",
      status: "Resolved",
    },
    {
      id: "3",
      ticketId: "SA-TKT-2026-003",
      subject: "Custom branding options needed",
      category: "Feature Request",
      priority: "Low",
      createdAt: "2026-02-10T14:00:00",
      updatedAt: "2026-02-10T14:00:00",
      description: "Request to add custom branding options including logo upload and color theme customization for patient portal.",
      status: "Open",
    },
    {
      id: "4",
      ticketId: "SA-TKT-2026-004",
      subject: "System downtime notification",
      category: "Technical Issue",
      priority: "Urgent",
      createdAt: "2026-02-20T08:00:00",
      updatedAt: "2026-02-20T10:30:00",
      description: "Experiencing complete system downtime. Unable to access any modules. This is affecting patient care.",
      status: "In Progress",
    },
    {
      id: "5",
      ticketId: "SA-TKT-2026-005",
      subject: "HIPAA compliance documentation request",
      category: "Compliance",
      priority: "High",
      createdAt: "2026-02-12T11:20:00",
      updatedAt: "2024-02-14T09:00:00",
      description: "We need updated HIPAA compliance documentation and BAA for our records.",
      status: "Closed",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique values for filters
  const categories = Array.from(new Set(tickets.map(t => t.category)));
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      !searchQuery ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = !filterStatus || ticket.status === filterStatus;
    const categoryMatch = !filterCategory || ticket.category === filterCategory;
    
    // Date Filtering
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const ticketDate = new Date(ticket.createdAt);
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (ticketDate < fromDate) dateMatch = false;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (ticketDate > toDate) dateMatch = false;
      }
    }

    return searchMatch && statusMatch && categoryMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800";
      case "In Progress":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      case "Resolved":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Closed":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      case "Low":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const clearFilters = () => {
    setFilterStatus("");
    setFilterCategory("");
    setDateFrom("");
    setDateTo("");
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreateTicket = (ticketData: { 
    category: string; 
    subject: string; 
    description: string; 
    attachments?: File[] 
  }) => {
    console.log("Creating ticket for super admin:", ticketData);
    // Here you would typically call an API to create the ticket
    setShowCreateDrawer(false);
  };

  return (
    <>
      <ClinicAdminLayout activeMenu="raise-ticket" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Raise a ticket
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Submit tickets to super admin for support and assistance
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
            {/* Search and Filter Bar */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, subject, or category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              {/* Create Ticket Button */}
              <button
                onClick={() => setShowCreateDrawer(true)}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Create ticket
              </button>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
                    showFilters || filterStatus || filterCategory || dateFrom || dateTo
                      ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                  title="Filters"
                >
                  <Filter className="w-4 h-4" />
                  {(filterStatus || filterCategory || dateFrom || dateTo) && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950">
                      {[filterStatus, filterCategory, dateFrom, dateTo].filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
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
                        {/* Status Filter */}
                        <div>
                          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                            Status
                          </label>
                          <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                          >
                            <option value="">All Statuses</option>
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                            Category
                          </label>
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full h-9 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Created Date Filter */}
                        <div>
                          <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                            Created Date
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] font-medium text-neutral-400 mb-1 uppercase">From Date</p>
                              <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full h-9 px-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                              />
                            </div>
                            <div>
                              <p className="text-[10px] font-medium text-neutral-400 mb-1 uppercase">To Date</p>
                              <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full h-9 px-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                              />
                            </div>
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
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => {
                          onViewTicket(ticket.id);
                        }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                      >
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {ticket.ticketId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {ticket.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          No tickets found matching your criteria
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTickets.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </ClinicAdminLayout>

      {/* Create Ticket Drawer */}
      {showCreateDrawer && (
        <RaiseTicketDrawer
          isOpen={showCreateDrawer}
          onClose={() => setShowCreateDrawer(false)}
          onSubmit={handleCreateTicket}
        />
      )}
    </>
  );
}
