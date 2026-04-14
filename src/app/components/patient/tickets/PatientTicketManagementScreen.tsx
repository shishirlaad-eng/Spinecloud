import { useState } from "react";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { Plus, Search, Eye } from "lucide-react";
import { CreatePatientTicketDrawer } from "./CreatePatientTicketDrawer";
import { PatientTicketDetailsDrawer } from "./PatientTicketDetailsDrawer";

interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdDate: string;
  lastUpdated: string;
  description: string;
  responses: {
    id: string;
    message: string;
    author: string;
    role: "Staff" | "Patient";
    timestamp: string;
  }[];
}

interface PatientTicketManagementScreenProps {
  onNavigate: (screen: "dashboard" | "appointments" | "invoices" | "notifications" | "spineCloud" | "tickets") => void;
  onLogout?: () => void;
}

export function PatientTicketManagementScreen({
  onNavigate,
  onLogout,
}: PatientTicketManagementScreenProps) {
  // Mock tickets data
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "ticket-001",
      ticketNumber: "TKT-2026-001",
      subject: "Issue with appointment booking",
      category: "Appointment",
      priority: "High",
      status: "Resolved",
      createdDate: "2026-02-15",
      lastUpdated: "2026-02-18",
      description: "I'm unable to book an appointment for next week. The calendar doesn't show any available slots even though I was told there are openings.",
      responses: [
        {
          id: "resp-001",
          message: "Thank you for reaching out. We're looking into the calendar availability issue. In the meantime, I've checked manually and we do have slots available next Tuesday and Thursday.",
          author: "Sarah Johnson",
          role: "Staff",
          timestamp: "2026-02-15T10:30:00",
        },
        {
          id: "resp-002",
          message: "Thank you! I can see the slots now. I've booked Tuesday at 2 PM.",
          author: "John Smith",
          role: "Patient",
          timestamp: "2026-02-15T14:45:00",
        },
        {
          id: "resp-003",
          message: "Perfect! We've confirmed your appointment. The calendar issue has been fixed. Thank you for your patience!",
          author: "Sarah Johnson",
          role: "Staff",
          timestamp: "2026-02-18T09:15:00",
        },
      ],
    },
    {
      id: "ticket-002",
      ticketNumber: "TKT-2026-002",
      subject: "Question about insurance coverage",
      category: "Billing",
      priority: "Medium",
      status: "In Progress",
      createdDate: "2026-02-18",
      lastUpdated: "2026-02-19",
      description: "I wanted to check if my insurance plan covers the imaging services that were recommended during my last visit.",
      responses: [
        {
          id: "resp-004",
          message: "Thank you for your inquiry. Our billing team is reviewing your insurance plan details. We'll get back to you within 24 hours with specific coverage information for the recommended imaging services.",
          author: "Michael Chen",
          role: "Staff",
          timestamp: "2026-02-18T16:20:00",
        },
      ],
    },
    {
      id: "ticket-003",
      ticketNumber: "TKT-2026-003",
      subject: "Unable to access clinical reports",
      category: "Technical",
      priority: "Low",
      status: "Open",
      createdDate: "2026-02-20",
      lastUpdated: "2026-02-20",
      description: "I'm trying to download my recent lab reports but the download button doesn't seem to work. Can you please help?",
      responses: [],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = (ticketData: { category: string; subject: string; description: string; priority: "Low" | "Medium" | "High" }) => {
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT-2026-${String(tickets.length + 1).padStart(3, "0")}`,
      subject: ticketData.subject,
      category: ticketData.category,
      priority: ticketData.priority,
      status: "Open",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      description: ticketData.description,
      responses: [],
    };

    setTickets([newTicket, ...tickets]);
    setShowCreateDrawer(false);
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailsDrawer(true);
  };

  const handleAddResponse = (ticketId: string, message: string) => {
    setTickets(
      tickets.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            responses: [
              ...ticket.responses,
              {
                id: `resp-${Date.now()}`,
                message,
                author: "John Smith",
                role: "Patient" as const,
                timestamp: new Date().toISOString(),
              },
            ],
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return ticket;
      })
    );

    // Update selected ticket if it's the one being updated
    if (selectedTicket?.id === ticketId) {
      const updatedTicket = tickets.find((t) => t.id === ticketId);
      if (updatedTicket) {
        setSelectedTicket({
          ...updatedTicket,
          responses: [
            ...updatedTicket.responses,
            {
              id: `resp-${Date.now()}`,
              message,
              author: "John Smith",
              role: "Patient" as const,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    }
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
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-amber-600 dark:text-amber-500";
      case "Low":
        return "text-neutral-500";
      default:
        return "text-neutral-500";
    }
  };

  return (
    <>
      <DashboardLayout activeMenu="tickets" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                  My tickets
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  View and manage your support tickets
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by ticket number, subject, or category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              >
                <option value="all">All status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Ticket #
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
                      Last updated
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {ticket.ticketNumber}
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
                          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
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
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {new Date(ticket.lastUpdated).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleViewDetails(ticket)}
                              className="inline-flex items-center gap-1.5 px-3 h-8 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          No tickets found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Create Ticket Drawer */}
      {showCreateDrawer && (
        <CreatePatientTicketDrawer
          onClose={() => setShowCreateDrawer(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {/* Ticket Details Drawer */}
      {showDetailsDrawer && selectedTicket && (
        <PatientTicketDetailsDrawer
          ticket={selectedTicket}
          onClose={() => setShowDetailsDrawer(false)}
          onAddResponse={handleAddResponse}
        />
      )}
    </>
  );
}