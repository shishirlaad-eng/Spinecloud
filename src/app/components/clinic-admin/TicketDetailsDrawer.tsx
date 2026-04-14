import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface TicketDetailsDrawerProps {
  isOpen: boolean;
  ticketId: string;
  onClose: () => void;
}

export function TicketDetailsDrawer({
  isOpen,
  ticketId,
  onClose,
}: TicketDetailsDrawerProps) {
  // Mock ticket data - in real app would fetch by ticketId
  const [ticket] = useState({
    id: ticketId,
    ticketId: "TKT-2026-001",
    subject: "Unable to access patient records",
    category: "Technical Issue",
    priority: "High",
    status: "In Progress",
    createdBy: "Dr. Sarah Johnson",
    createdByRole: "Provider",
    createdByEmail: "sarah.johnson@clinic.com",
    assignedTo: "IT Support Team",
    createdAt: "2026-02-18T09:30:00",
    updatedAt: "2026-02-19T14:20:00",
    description:
      "I'm unable to access patient records in the system. Getting an error message when trying to view patient history. This is affecting my ability to provide care and I need urgent assistance. The error message says 'Unable to load patient data - connection timeout'. I've tried refreshing the page and logging out and back in, but the issue persists.",
  });

  const [selectedStatus, setSelectedStatus] = useState(ticket.status);
  const [selectedPriority, setSelectedPriority] = useState(ticket.priority);
  const [replyMessage, setReplyMessage] = useState("");
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showPriorityUpdate, setShowPriorityUpdate] = useState(false);

  const statuses = ["Open", "In Progress", "Resolved", "Closed"];
  const priorities = ["Low", "Medium", "High", "Urgent"];

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

  const handleUpdateStatus = () => {
    console.log("Updating status to:", selectedStatus);
    setShowStatusUpdate(false);
    onClose();
    // Here you would typically call an API to update the status
  };

  const handleUpdatePriority = () => {
    console.log("Updating priority to:", selectedPriority);
    setShowPriorityUpdate(false);
    onClose();
    // Here you would typically call an API to update the priority
  };

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      console.log("Sending reply to:", ticket.createdByEmail);
      console.log("Reply message:", replyMessage);
      setReplyMessage("");
      onClose();
      // Here you would typically call an API to send the email
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

              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Created by
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">{ticket.createdBy}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {ticket.createdByRole}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {ticket.createdByEmail}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1">
                  Assigned to
                </p>
                <p className="text-sm text-neutral-900 dark:text-white">{ticket.assignedTo}</p>
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

          {/* Update Status */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
              Update status
            </h3>
            <div className="space-y-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setShowStatusUpdate(true);
                  }}
                  className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                    selectedStatus === status
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {status}
                    </span>
                    {selectedStatus === status && (
                      <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {showStatusUpdate && selectedStatus !== ticket.status && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleUpdateStatus}
                  className="w-full h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Confirm status update
                </button>
              </div>
            )}
          </div>

          {/* Update Priority */}
          {ticket.status !== "Closed" && (
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Update priority
              </h3>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setSelectedPriority(priority);
                      setShowPriorityUpdate(true);
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-left transition-all ${
                      selectedPriority === priority
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {priority}
                      </span>
                      {selectedPriority === priority && (
                        <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {showPriorityUpdate && selectedPriority !== ticket.priority && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={handleUpdatePriority}
                    className="w-full h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Confirm priority update
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reply */}
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Reply to ticket
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Your reply will be sent to: <span className="font-medium">{ticket.createdByEmail}</span>
            </p>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              rows={6}
              className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
                className="h-9 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                Send reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}