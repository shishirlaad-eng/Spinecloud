import { useState } from "react";
import { X, Clock, MessageSquare } from "lucide-react";

interface TicketResponse {
  id: string;
  message: string;
  author: string;
  role: "Staff" | "Patient";
  timestamp: string;
}

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
  responses: TicketResponse[];
}

interface PatientTicketDetailsDrawerProps {
  ticket: Ticket;
  onClose: () => void;
  onAddResponse: (ticketId: string, message: string) => void;
}

export function PatientTicketDetailsDrawer({
  ticket,
  onClose,
  onAddResponse,
}: PatientTicketDetailsDrawerProps) {
  const [replyMessage, setReplyMessage] = useState("");

  const handleSubmitReply = () => {
    if (replyMessage.trim()) {
      onAddResponse(ticket.id, replyMessage);
      setReplyMessage("");
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

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: diffInHours > 8760 ? "numeric" : undefined,
      });
    }
  };

  // Can only reply if ticket is not closed
  const canReply = ticket.status !== "Closed" && ticket.status !== "Resolved";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[600px] bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Ticket details
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {ticket.ticketNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ticket Info Card */}
          <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 space-y-4">
            {/* Subject */}
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Subject
              </p>
              <p className="text-sm text-neutral-900 dark:text-white font-medium">
                {ticket.subject}
              </p>
            </div>

            {/* Category, Priority, Status */}
            <div className="grid grid-cols-3 gap-4">
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
                <p className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Status
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium border ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Created
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {new Date(ticket.createdDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Last updated
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">
                  {new Date(ticket.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                Description
              </p>
              <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Latest response
              </h3>
            </div>

            {ticket.responses.length > 0 ? (
              <div>
                {/* Show only the latest staff response */}
                {(() => {
                  // Find the latest staff response
                  const latestStaffResponse = [...ticket.responses]
                    .reverse()
                    .find((response) => response.role === "Staff");

                  if (latestStaffResponse) {
                    return (
                      <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {latestStaffResponse.author}
                            </p>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-950/50 dark:text-primary-400">
                              Staff
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs">{formatTimestamp(latestStaffResponse.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-900 dark:text-white whitespace-pre-wrap">
                          {latestStaffResponse.message}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No staff response yet
                      </p>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No responses yet
                </p>
              </div>
            )}
          </div>

          {/* Reply Section */}
          {canReply && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Add reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here"
                rows={4}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyMessage.trim()}
                  className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Send reply
                </button>
              </div>
            </div>
          )}

          {!canReply && (
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                This ticket is {ticket.status.toLowerCase()} and no longer accepts replies
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}