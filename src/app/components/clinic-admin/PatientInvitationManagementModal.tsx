import { X, Mail, MessageSquare, CheckCircle, Clock, XCircle, Send } from "lucide-react";
import { useState } from "react";

interface InvitationHistory {
  id: string;
  sentDate: string;
  channel: "Email" | "SMS" | "Both";
  status: "Sent" | "Opened" | "Expired" | "Cancelled";
  sentBy: string;
}

interface PatientInvitationManagementModalProps {
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  invitationHistory: InvitationHistory[];
  onClose: () => void;
  onSendInvitation: (channel: "Email" | "SMS" | "Both") => void;
  onResendInvitation: (invitationId: string, channel: "Email" | "SMS" | "Both") => void;
  onCancelInvitation: (invitationId: string) => void;
}

export function PatientInvitationManagementModal({
  patient,
  invitationHistory,
  onClose,
  onSendInvitation,
  onResendInvitation,
  onCancelInvitation,
}: PatientInvitationManagementModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<"Email" | "SMS" | "Both">("Email");
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);

  const activeInvitation = invitationHistory.find(
    (inv) => inv.status === "Sent" || inv.status === "Opened"
  );

  const getStatusIcon = (status: InvitationHistory["status"]) => {
    switch (status) {
      case "Sent":
        return <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "Opened":
        return <CheckCircle className="w-4 h-4 text-success-600 dark:text-success-400" />;
      case "Expired":
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  const getStatusColor = (status: InvitationHistory["status"]) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "Opened":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Expired":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
      case "Cancelled":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    }
  };

  const getChannelIcon = (channel: InvitationHistory["channel"]) => {
    switch (channel) {
      case "Email":
        return <Mail className="w-4 h-4" />;
      case "SMS":
        return <MessageSquare className="w-4 h-4" />;
      case "Both":
        return (
          <>
            <Mail className="w-4 h-4" />
            <MessageSquare className="w-4 h-4" />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Patient invitations
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {patient.firstName} {patient.lastName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Invitation Alert */}
          {activeInvitation && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Active invitation
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Sent via {activeInvitation.channel} on{" "}
                    {new Date(activeInvitation.sentDate).toLocaleDateString()} by {activeInvitation.sentBy}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onResendInvitation(activeInvitation.id, activeInvitation.channel)
                      }
                      className="px-3 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Resend invitation
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(activeInvitation.id)}
                      className="px-3 h-9 border border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                    >
                      Cancel invitation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cancel Confirmation */}
          {showCancelConfirm && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Cancel invitation?
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    This will invalidate the invitation link. The patient will not be able to register using this invitation.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onCancelInvitation(showCancelConfirm);
                        setShowCancelConfirm(null);
                      }}
                      className="px-3 h-9 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      Yes, cancel invitation
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(null)}
                      className="px-3 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                    >
                      Keep invitation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send New Invitation */}
          {!activeInvitation && (
            <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Send new invitation
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">
                    Send via
                  </label>
                  <div className="flex gap-4">
                    {(["Email", "SMS", "Both"] as const).map((channel) => (
                      <label key={channel} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="channel"
                          checked={selectedChannel === channel}
                          onChange={() => setSelectedChannel(channel)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {channel}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Email</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Phone</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {patient.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSendInvitation(selectedChannel)}
                  disabled={
                    (selectedChannel === "Email" && !patient.email) ||
                    (selectedChannel === "SMS" && !patient.phone) ||
                    (selectedChannel === "Both" && (!patient.email || !patient.phone))
                  }
                  className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <Send className="w-4 h-4" />
                  Send invitation
                </button>
              </div>
            </div>
          )}

          {/* Invitation History */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
              Invitation history
            </h3>
            {invitationHistory.length > 0 ? (
              <div className="space-y-2">
                {invitationHistory.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        {getChannelIcon(invitation.channel)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {invitation.channel}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${getStatusColor(
                              invitation.status
                            )}`}
                          >
                            {getStatusIcon(invitation.status)}
                            {invitation.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Sent {new Date(invitation.sentDate).toLocaleDateString()} by {invitation.sentBy}
                        </p>
                      </div>
                    </div>

                    {(invitation.status === "Sent" || invitation.status === "Opened") && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onResendInvitation(invitation.id, invitation.channel)}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                        >
                          Resend
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(invitation.id)}
                          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                No invitation history
              </p>
            )}
          </div>

          {/* Business Rules Info */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Invitation rules
            </h4>
            <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                <span>Only one active invitation allowed at a time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                <span>Invitations expire after 7 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                <span>Sending a new invitation invalidates the previous one</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5">•</span>
                <span>Cancelled invitations cannot be used to register</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
