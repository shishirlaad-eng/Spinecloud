import { useState } from "react";
import { DashboardLayout } from "../../layout/DashboardLayout";
import { Search, Plus, ChevronRight, Filter, X } from "lucide-react";
import { CreateTicketDrawer } from "../../clinic-admin/CreateTicketDrawer";

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  description: string;
}

interface ProviderTicketManagementScreenProps {
  onNavigate: (menu: string) => void;
  onViewTicket: (ticketId: string) => void;
  onLogout?: () => void;
  currentEntity?: "patient" | "clinicAdmin" | "provider" | "clinic-staff";
  onEntitySwitch?: (entity: "patient" | "clinicAdmin" | "provider" | "clinic-staff") => void;
  onNavigateToProfile?: () => void;
}

export function ProviderTicketManagementScreen({
  onNavigate,
  onViewTicket,
  onLogout,
  currentEntity,
  onEntitySwitch,
  onNavigateToProfile,
}: ProviderTicketManagementScreenProps) {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      ticketId: "TKT-PRV-2026-001",
      subject: "Request for more medical supplies",
      category: "Supplies",
      status: "In Progress",
      createdAt: "2026-02-15T10:30:00",
      description: "We are running low on basic medical supplies in the west wing. Need a restock by Friday.",
    },
    {
      id: "2",
      ticketId: "TKT-PRV-2026-002",
      subject: "Patient records synchronization error",
      category: "Technical Issue",
      status: "Resolved",
      createdAt: "2026-02-18T09:15:00",
      description: "Some patient records are not syncing correctly between the desktop and tablet apps.",
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleCreateTicket = (data: { category: string; subject: string; description: string }) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      ticketId: `TKT-PRV-2026-${String(tickets.length + 1).padStart(3, "0")}`,
      subject: data.subject,
      category: data.category,
      status: "Open",
      createdAt: new Date().toISOString(),
      description: data.description,
    };
    setTickets([newTicket, ...tickets]);
    setShowCreateDrawer(false);
  };

  return (
    <DashboardLayout
      activeMenu="tickets"
      onNavigate={onNavigate}
      onLogout={onLogout}
      currentEntity={currentEntity}
      onEntitySwitch={onEntitySwitch}
      onNavigateToProfile={onNavigateToProfile}
    >
      <div>
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1.5">
            <span>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-[#0b1c30]">Support Tickets</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Support tickets
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your support requests and issues
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ticket ID or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowCreateDrawer(true)}
            className="h-10 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Raise Ticket
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  onClick={() => onViewTicket(ticket.id)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary-600">{ticket.ticketId}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{ticket.category}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{formatDate(ticket.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTicketDrawer
        isOpen={showCreateDrawer}
        onClose={() => setShowCreateDrawer(false)}
        onSubmit={handleCreateTicket}
      />
    </DashboardLayout>
  );
}
