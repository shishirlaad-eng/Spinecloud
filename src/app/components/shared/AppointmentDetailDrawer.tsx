import { X, Calendar, Clock, MapPin, User, FileText, AlertCircle, CheckCircle, RefreshCw, XCircle, Phone, Mail } from "lucide-react";

export type AppointmentStatus = "Confirmed" | "Cancelled" | "Rescheduled" | "No-Show";

export interface AppointmentDetail {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  providerId: string;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  service: string;
  status: AppointmentStatus;
  locationName?: string;
  branchName?: string;
  notes?: string;
}

interface AppointmentDetailDrawerProps {
  appointment: AppointmentDetail;
  onClose: () => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  onMarkNoShow: (id: string) => void;
  onNavigateToPatient: (patientId: string) => void;
  userRole?: "admin" | "provider" | "patient";
}

export function AppointmentDetailDrawer({
  appointment,
  onClose,
  onCancel,
  onReschedule,
  onMarkNoShow,
  onNavigateToPatient,
  userRole = "admin",
}: AppointmentDetailDrawerProps) {
  const getStatusStyles = (status: AppointmentStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800";
      case "Cancelled":
        return "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "Rescheduled":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "No-Show":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-[70] animate-slide-in-right overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Appointment Details
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(appointment.status)}`}>
                  {appointment.status}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  ID: {appointment.id}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Section */}
          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl p-5 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Patient</p>
                <button
                  onClick={() => onNavigateToPatient(appointment.patientId)}
                  className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline text-left block w-full mt-0.5"
                >
                  {appointment.patientName}
                </button>
                <p className="text-xs text-neutral-500 mt-0.5">ID: {appointment.patientId}</p>
                
                {(appointment.patientPhone || appointment.patientEmail) && (
                  <div className="mt-3 space-y-1.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    {appointment.patientPhone && (
                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {appointment.patientPhone}
                      </div>
                    )}
                    {appointment.patientEmail && (
                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        {appointment.patientEmail}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Date</span>
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{appointment.date}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Time</span>
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {appointment.startTime} - {appointment.endTime}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">Service</span>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{appointment.service}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <User className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">Provider</span>
              </div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{appointment.providerName}</p>
            </div>

            {(appointment.locationName || appointment.branchName) && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium uppercase tracking-wider">Location</span>
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {[appointment.branchName, appointment.locationName].filter(Boolean).join(" - ")}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Notes</h4>
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-800">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {appointment.notes}
                </p>
              </div>
            </div>
          )}

          {/* Actions Section */}
          {userRole !== "provider" && (
            <div className="pt-6 space-y-3">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Quick Actions</h4>
              
              {appointment.status !== "Cancelled" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onReschedule(appointment.id)}
                    className="flex items-center justify-center gap-2 px-4 h-11 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-sm font-semibold active:scale-95 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4 text-amber-500" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => onMarkNoShow(appointment.id)}
                    className="flex items-center justify-center gap-2 px-4 h-11 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-sm font-semibold active:scale-95 shadow-sm"
                  >
                    <AlertCircle className="w-4 h-4 text-neutral-400" />
                    No-Show
                  </button>
                </div>
                
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 h-11 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-semibold active:scale-[0.98]"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Appointment
                </button>
              </>
            )}

              {appointment.status === "Cancelled" && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/50 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    This appointment has been cancelled and cannot be modified.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
