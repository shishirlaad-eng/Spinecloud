import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, X, Plus, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { RaiseTicketDrawer } from "./RaiseTicketDrawer";
import { RaiseTicketDetailsDrawer } from "./RaiseTicketDetailsDrawer";

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
  onLogout?: () => void;
}

export function RaiseTicketScreen({
  onNavigate,
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
      updatedAt: "2026-02-14T09:00:00",
      description: "We need updated HIPAA compliance documentation and BAA for our records.",
      status: "Closed",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const itemsPerPage = 10;

  // Get unique values for filters
  const categories = Array.from(new Set(tickets.map(t => t.category)));
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];
  const priorities = ["Low", "Medium", "High", "Urgent"];

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      !searchQuery ||
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch = filterStatus.length === 0 || filterStatus.includes(ticket.status);
    const priorityMatch = filterPriority.length === 0 || filterPriority.includes(ticket.priority);
    const categoryMatch = filterCategory.length === 0 || filterCategory.includes(ticket.category);

    return searchMatch && statusMatch && priorityMatch && categoryMatch;
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

  const toggleStatus = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const togglePriority = (priority: string) => {
    if (filterPriority.includes(priority)) {
      setFilterPriority(filterPriority.filter((p) => p !== priority));
    } else {
      setFilterPriority([...filterPriority, priority]);
    }
  };

  const toggleCategory = (category: string) => {
    if (filterCategory.includes(category)) {
      setFilterCategory(filterCategory.filter((c) => c !== category));
    } else {
      setFilterCategory([...filterCategory, category]);
    }
  };

  const clearFilters = () => {
    setFilterStatus([]);
    setFilterPriority([]);
    setFilterCategory([]);
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCreateTicket = (ticketData: { category: string; subject: string; description: string; priority: string }) => {
    console.log("Creating ticket for super admin:", ticketData);
    // Here you would typically call an API to create the ticket
    setShowCreateDrawer(false);
  };

  return (
    <>
      <ClinicAdminLayout activeMenu="raise-ticket" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Raise a ticket
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Submit tickets to super admin for support and assistance
              </p>
            </div>
            <button
              onClick={() => setShowCreateDrawer(true)}
              className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Create ticket
            </button>
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
                  placeholder="Search by ticket ID, subject, or category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                    showFilters || filterStatus.length > 0 || filterPriority.length > 0 || filterCategory.length > 0
                      ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(filterStatus.length > 0 || filterPriority.length > 0 || filterCategory.length > 0) && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs">
                      {filterStatus.length + filterPriority.length + filterCategory.length}
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
                        {/* Status Filter */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Status
                          </label>
                          <div className="space-y-2">
                            {statuses.map((status) => (
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

                        {/* Priority Filter */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Priority
                          </label>
                          <div className="space-y-2">
                            {priorities.map((priority) => (
                              <label key={priority} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterPriority.includes(priority)}
                                  onChange={() => togglePriority(priority)}
                                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <span className="text-sm text-neutral-900 dark:text-white">
                                  {priority}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Category
                          </label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {categories.map((category) => (
                              <label key={category} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterCategory.includes(category)}
                                  onChange={() => toggleCategory(category)}
                                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <span className="text-sm text-neutral-900 dark:text-white">
                                  {category}
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
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
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
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Created at
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        onClick={() => {
                          setSelectedTicketId(ticket.id);
                          setShowDetailsDrawer(true);
                        }}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                      >
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
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {ticket.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
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
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-neutral-900 dark:text-white">
                              {formatDate(ticket.createdAt)}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {formatTime(ticket.createdAt)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          No tickets found matching your criteria
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of{" "}
                  {filteredTickets.length} tickets
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-2 px-3 h-9 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary-600 text-white"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-2 px-3 h-9 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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

      {/* Ticket Details Drawer */}
      {showDetailsDrawer && (
        <RaiseTicketDetailsDrawer
          isOpen={showDetailsDrawer}
          ticketId={selectedTicketId}
          onClose={() => {
            setShowDetailsDrawer(false);
            setSelectedTicketId("");
          }}
        />
      )}
    </>
  );
}
