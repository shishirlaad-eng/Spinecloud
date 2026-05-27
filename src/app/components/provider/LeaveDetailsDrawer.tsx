import { X, Calendar, AlertCircle, UserCheck, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Leave {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "Approved" | "Cancelled";
  createdAt: string;
  conflictingAppointmentsCount?: number;
  reassignments?: Record<string, { providerId: string; providerName: string }>;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  branch: string;
  patientPhone?: string;
  patientEmail?: string;
  assignedProviderId?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
}

interface LeaveDetailsDrawerProps {
  leave: Leave;
  appointments: Appointment[];
  providers: Provider[];
  onClose: () => void;
  onEdit: (leave: Leave) => void;
  onCancel: (id: string) => void;
}

export function LeaveDetailsDrawer({
  leave,
  appointments,
  providers,
  onClose,
  onEdit,
  onCancel,
}: LeaveDetailsDrawerProps) {
  const [conflicts, setConflicts] = useState<Appointment[]>([]);

  // Check for conflicts
  useEffect(() => {
    if (leave.startDate && leave.endDate) {
      const conflictingAppts = appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        return aptDate >= start && aptDate <= end;
      });
      setConflicts(conflictingAppts);
    } else {
      setConflicts([]);
    }
  }, [leave.startDate, leave.endDate, appointments]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      weekday: "long",
    });
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return { date: dateStr, time };
  };

  const calculateDuration = () => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days === 1 ? "1 day" : `${days} days`;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                Leave details
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                View leave information and conflicting appointments
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Leave Information Card */}
          <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                  {leave.reason}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {calculateDuration()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  Start date
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(leave.startDate)}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                  End date
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(leave.endDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Conflicting Appointments Section */}
          {conflicts.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      {conflicts.length} conflicting appointment
                      {conflicts.length > 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      The following appointments are scheduled during this leave
                      period
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Appointments
                </h4>

                <div className="space-y-3">
                  {conflicts.map((appointment) => {
                    const { date, time } = formatDateTime(
                      appointment.date,
                      appointment.time
                    );
                    const reassignment = leave.reassignments?.[appointment.id];
                    const assignedProvider = reassignment 
                      ? { id: reassignment.providerId, name: reassignment.providerName }
                      : (appointment.assignedProviderId
                          ? providers.find((p) => p.id === appointment.assignedProviderId)
                          : null);

                    return (
                      <div
                        key={appointment.id}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          {/* Appointment Details */}
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                Patient name
                              </div>
                              <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {appointment.patientName}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                Date & time
                              </div>
                              <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {date}
                              </div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                {time}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {appointment.service || "General Consultation"}
                              </div>
                            </div>
                          </div>

                          {(appointment.patientPhone || appointment.patientEmail) && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1 py-2 px-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800">
                              {appointment.patientPhone && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Phone:</span> {appointment.patientPhone}
                                </p>
                              )}
                              {appointment.patientEmail && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                  <span className="font-medium">Email:</span> {appointment.patientEmail}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Show assigned provider if exists */}
                          {assignedProvider && (
                            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
                                <UserCheck className="w-4 h-4 text-success-600 dark:text-success-400" />
                                <span className="text-sm text-success-700 dark:text-success-300">
                                  Reassigned to {assignedProvider.name}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {conflicts.length === 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <div className="bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-success-600 dark:text-success-400" />
                  <p className="text-sm text-success-700 dark:text-success-300">
                    No conflicting appointments during this leave period
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onClose}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
            >
              Close
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEdit(leave)}
                className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit leave
              </button>
              <button
                onClick={() => onCancel(leave.id)}
                className="inline-flex items-center gap-2 px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Cancel leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
