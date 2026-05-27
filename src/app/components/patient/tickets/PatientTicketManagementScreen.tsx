import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { Plus, Search, Filter, ChevronRight, X } from "lucide-react";
import { CreatePatientTicketDrawer } from "./CreatePatientTicketDrawer";

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
  description: string;
  messages: {
    id: string;
    content: string;
    author: string;
    role: "Staff" | "Patient";
    timestamp: string;
    isYou: boolean;
  }[];
}

interface PatientTicketManagementScreenProps {
  onNavigate: (screen: any) => void;
  onViewTicket: (ticketId: string) => void;
  onLogout?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  onNavigateToProfile?: () => void;
  tickets: Ticket[];
  onCreateTicket?: (ticket: any) => void;
}

export function PatientTicketManagementScreen({
  onNavigate,
  onViewTicket,
  onLogout,
  currentEntity,
  onEntitySwitch,
  onNavigateToProfile,
  tickets,
  onCreateTicket
}: PatientTicketManagementScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "updated">("newest");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, dateFrom, dateTo]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  let filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

    let matchesDate = true;
    if (dateFrom || dateTo) {
      const d = new Date(ticket.createdAt);
      d.setHours(0, 0, 0, 0);
      if (dateFrom) {
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d < from) matchesDate = false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDate;
  });

  filteredTickets.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const activeFilterCount = (statusFilter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const handleCreateTicketSubmit = (ticketData: any) => {
    if (onCreateTicket) {
      onCreateTicket(ticketData);
    }
    setShowCreateDrawer(false);
  };

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  return (
    <>
      <DashboardLayout 
        activeMenu="tickets" 
        onNavigate={onNavigate as any} 
        onLogout={onLogout}
        currentEntity={currentEntity}
        onEntitySwitch={onEntitySwitch}
        onNavigateToProfile={onNavigateToProfile}
      >
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1.5 font-sans">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-medium text-[#0b1c30]">Support Tickets</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-0.5">
                  Support tickets
                </h1>
                <p className="text-sm text-neutral-500">
                  View and manage your support tickets
                </p>
              </div>
              <button
                onClick={() => setShowCreateDrawer(true)}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create ticket
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by ticket number, subject, or category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
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
                <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-4 space-y-4 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</span>
                    <button onClick={() => setShowFilterDropdown(false)} className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="all">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setPriorityFilter("all");
                        setDateFrom("");
                        setDateTo("");
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

          {/* Tickets Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    {["Created Date", "Ticket #", "Subject", "Category", "Status"].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedTickets.length > 0 ? (
                    paginatedTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                        onClick={() => onViewTicket(ticket.id)}
                      >
                        <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                          {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-[#1d77b4]">
                            {ticket.ticketId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-900 dark:text-white font-medium">
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
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border ${getStatusColor(
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
          </div>

          {/* Pagination UI */}
          {filteredTickets.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
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
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredTickets.length)} of {filteredTickets.length} tickets
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
      </DashboardLayout>
      {showCreateDrawer && (
        <CreatePatientTicketDrawer
          onClose={() => setShowCreateDrawer(false)}
          onSubmit={handleCreateTicketSubmit}
        />
      )}
    </>
  );
}