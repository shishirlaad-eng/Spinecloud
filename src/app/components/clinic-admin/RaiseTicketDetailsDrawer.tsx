import { useState } from "react";
import { X, Clock, MessageSquare } from "lucide-react";

interface RaiseTicketDetailsDrawerProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
}

export function RaiseTicketDetailsDrawer({
  isOpen,
  ticketId,
  onClose,
}: RaiseTicketDetailsDrawerProps) {
  // Mock ticket data - in real app would fetch by ticketId
  const [ticket] = useState({
    id: ticketId,
    ticketId: "SA-TKT-2026-001",
    subject: "Request for multi-branch support feature",
    category: "Feature Request",
    priority: "Medium",
    status: "In Progress",
    createdAt: "2026-02-15T10:30:00",
    updatedAt: "2026-02-18T14:20:00",
    description:
      "We need functionality to manage multiple branch locations under one clinic account. This would include separate scheduling, staff management, and reporting for each branch. Our clinic is expanding to 3 new locations and we need a way to manage all of them from a single admin portal while maintaining separate data and operations for each branch.",
    superAdminResponse: {
      author: "Super Admin Team",
      timestamp: "2026-02-18T14:20:00",
      message:
        "Thank you for your feature request. We've reviewed your requirements and this aligns with our upcoming roadmap. Our development team is currently working on a comprehensive multi-branch management system that will include:\n\n1. Centralized admin portal with branch-specific views\n2. Individual scheduling systems per branch\n3. Separate staff and provider management\n4. Branch-level reporting and analytics\n5. Unified billing across all branches\n\nWe expect to roll out this feature in phases starting Q2 2026. We'll keep you updated on the progress and reach out if we need any additional input for the implementation.",
    },
  });

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

  const formatFullDateTime = (dateString: string) => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`;
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatFullDateTime(dateString);
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[700px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {ticket.ticketId}
              </h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getPriorityColor(
                  ticket.priority
                )}`}
              >
                {ticket.priority}
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Created on {formatFullDateTime(ticket.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Ticket Details */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              {ticket.subject}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Ticket Information */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Ticket information
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                    Category
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {ticket.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                    Priority
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                    Last updated
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white">
                    {formatFullDateTime(ticket.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Super Admin Response */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Response from super admin
              </h3>
            </div>

            {ticket.superAdminResponse ? (
              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {ticket.superAdminResponse.author}
                    </p>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400">
                      Super Admin
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{formatTimestamp(ticket.superAdminResponse.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                  {ticket.superAdminResponse.message}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No response from super admin yet
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Your ticket is being reviewed
                </p>
              </div>
            )}
          </div>

          {/* Read-only Notice */}
          <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Note:</span> This is a read-only view. Tickets raised to super admin cannot be edited. If you need to provide additional information, please create a new ticket or contact super admin support directly.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
