import { ProviderLayout } from "./layout/ProviderLayout";
import { Calendar, Plus, Edit, Trash2, AlertCircle, X, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { LeaveDetailsDrawer } from "./LeaveDetailsDrawer";

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

interface LeaveManagementScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  leaves: Leave[];
  conflictingAppointments: Appointment[];
  availableProviders: Provider[];
  onAddLeave: (leave: Omit<Leave, "id" | "createdAt" | "status">) => void;
  onUpdateLeave: (id: string, leave: Omit<Leave, "id" | "createdAt" | "status">) => void;
  onCancelLeave: (id: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReassignAppointment: (appointmentId: string, newProviderId: string) => void;
}

export function LeaveManagementScreen({
  onNavigate,
  onLogout,
  leaves,
  conflictingAppointments,
  availableProviders,
  onAddLeave,
  onUpdateLeave,
  onCancelLeave,
  onCancelAppointment,
  onReassignAppointment,
}: LeaveManagementScreenProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [viewingLeave, setViewingLeave] = useState<Leave | null>(null);

  const handleAddClick = () => {
    setEditingLeave(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (leave: Leave) => {
    setEditingLeave(leave);
    setIsDrawerOpen(true);
  };

  const handleViewClick = (leave: Leave) => {
    setViewingLeave(leave);
  };

  const handleCancelClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmCancel = () => {
    if (deleteConfirmId) {
      onCancelLeave(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const sortedLeaves = [...leaves].sort((a, b) =>
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const upcomingLeaves = sortedLeaves.filter(
    (l) => new Date(l.endDate) >= new Date() && l.status !== "Cancelled"
  );

  const pastLeaves = sortedLeaves.filter(
    (l) => new Date(l.endDate) < new Date() || l.status === "Cancelled"
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success-50 text-success-700 border-success-200";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  return (
    <ProviderLayout
      activeMenu="leaves"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Leave management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage your time off and handle appointment conflicts
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add leave
          </button>
        </div>

        {/* Upcoming Leaves */}
        {upcomingLeaves.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Upcoming leaves
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {upcomingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors cursor-pointer"
                  onClick={() => handleViewClick(leave)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                            {leave.reason}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDateRange(leave.startDate, leave.endDate)}
                          </p>
                        </div>
                      </div>
                      {leave.conflictingAppointmentsCount && leave.conflictingAppointmentsCount > 0 && (
                        <div className="ml-15">
                          <div className="inline-flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4" />
                            {leave.conflictingAppointmentsCount} conflicting appointment
                            {leave.conflictingAppointmentsCount > 1 ? "s" : ""}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(leave);
                        }}
                        className="inline-flex items-center justify-center w-9 h-9 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        aria-label="Edit leave"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelClick(leave.id);
                        }}
                        className="inline-flex items-center justify-center w-9 h-9 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Cancel leave"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Leaves */}
        {pastLeaves.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Past leaves
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:border-neutral-800">
              {pastLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="px-6 py-4 opacity-60 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                              {leave.reason}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                                leave.status
                              )}`}
                            >
                              {leave.status}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDateRange(leave.startDate, leave.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {leaves.length === 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                No leaves added
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Add your first leave to block bookings on specific dates
              </p>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add leave
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Leave Drawer */}
      {isDrawerOpen && (
        <AddEditLeaveDrawer
          leave={editingLeave}
          appointments={conflictingAppointments}
          providers={availableProviders}
          onClose={() => setIsDrawerOpen(false)}
          onSave={(leaveData) => {
            if (editingLeave) {
              onUpdateLeave(editingLeave.id, leaveData);
            } else {
              onAddLeave(leaveData);
            }
            setIsDrawerOpen(false);
          }}
          onCancelAppointment={onCancelAppointment}
          onReassignAppointment={onReassignAppointment}
        />
      )}

      {/* Leave Details Drawer */}
      {viewingLeave && (
        <LeaveDetailsDrawer
          leave={viewingLeave}
          appointments={conflictingAppointments}
          providers={availableProviders}
          onClose={() => setViewingLeave(null)}
          onEdit={(leave) => {
            setViewingLeave(null);
            handleEditClick(leave);
          }}
          onCancel={(id) => {
            setViewingLeave(null);
            handleCancelClick(id);
          }}
        />
      )}

      {/* Cancel Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Cancel leave
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Are you sure you want to cancel this leave? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
              >
                Keep leave
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                Cancel leave
              </button>
            </div>
          </div>
        </div>
      )}
    </ProviderLayout>
  );
}

// Add/Edit Leave Drawer Component
interface AddEditLeaveDrawerProps {
  leave: Leave | null;
  appointments: Appointment[];
  providers: Provider[];
  onClose: () => void;
  onSave: (leave: Omit<Leave, "id" | "createdAt" | "status">) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onReassignAppointment: (appointmentId: string, providerId: string, providerName: string) => void;
}

function AddEditLeaveDrawer({ 
  leave, 
  appointments,
  providers,
  onClose, 
  onSave,
  onCancelAppointment,
  onReassignAppointment
}: AddEditLeaveDrawerProps) {
  const [startDate, setStartDate] = useState(leave?.startDate || "");
  const [endDate, setEndDate] = useState(leave?.endDate || "");
  const [reason, setReason] = useState(leave?.reason || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [conflicts, setConflicts] = useState<(Appointment & { assignedName?: string })[]>([]);
  const [reassignedProviders, setReassignedProviders] = useState<Record<string, string>>({});
  const [bulkProviderId, setBulkProviderId] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      const conflictingAppts = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return aptDate >= start && aptDate <= end;
      });
      setConflicts(conflictingAppts);
    } else {
      setConflicts([]);
      setReassignedProviders({});
      setBulkProviderId("");
    }
  }, [startDate, endDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      startDate,
      endDate,
      reason: reason.trim(),
      reassignments: Object.keys(reassignedProviders).reduce((acc, aptId) => {
        const provider = providers.find(p => p.id === reassignedProviders[aptId]);
        if (provider) {
          acc[aptId] = { providerId: provider.id, providerName: provider.name };
        }
        return acc;
      }, {} as Record<string, { providerId: string; providerName: string }>)
    });
  };

  const handleBulkAssign = () => {
    if (!bulkProviderId) return;
    
    const provider = providers.find(p => p.id === bulkProviderId);
    if (!provider) return;

    const newAssignments: Record<string, string> = {};
    conflicts.forEach(apt => {
      newAssignments[apt.id] = bulkProviderId;
      onReassignAppointment(apt.id, bulkProviderId, provider.name);
    });
    
    setReassignedProviders(newAssignments);
    setConflicts(conflicts.map(apt => ({ ...apt, assignedName: provider.name, assignedProviderId: bulkProviderId })));
  };

  const handleIndividualReassign = (appointmentId: string, providerId: string) => {
    if (!providerId) return;
    
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    onReassignAppointment(appointmentId, providerId, provider.name);
    setReassignedProviders(prev => ({ ...prev, [appointmentId]: providerId }));
    setConflicts(conflicts.map(apt => 
      apt.id === appointmentId ? { ...apt, assignedName: provider.name, assignedProviderId: providerId } : apt
    ));
  };

  const handleCancelAppointment = (appointmentId: string) => {
    onCancelAppointment(appointmentId);
    setConflicts(conflicts.filter(apt => apt.id !== appointmentId));
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

  const isFormValid =
    startDate !== "" &&
    endDate !== "" &&
    reason.trim() !== "" &&
    new Date(endDate) >= new Date(startDate);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {leave ? "Edit leave" : "Add leave"}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {leave
                  ? "Update leave information"
                  : "Add time off and manage conflicts"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="startDate"
                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
              >
                Start date <span className="text-destructive">*</span>
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
              {errors.startDate && (
                <p className="text-xs text-destructive mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
              >
                End date <span className="text-destructive">*</span>
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
              {errors.endDate && (
                <p className="text-xs text-destructive mt-1">{errors.endDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="reason"
                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
              >
                Reason <span className="text-destructive">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Personal leave, Medical leave, Vacation"
                rows={3}
                className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] resize-none"
              />
              {errors.reason && (
                <p className="text-xs text-destructive mt-1">{errors.reason}</p>
              )}
            </div>
          </div>

          {conflicts.length > 0 && (
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      {conflicts.length} conflicting appointment{conflicts.length > 1 ? "s" : ""} found
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      The following appointments are scheduled during your leave. Reassign or cancel them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Assign all to one provider
                  </h4>
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="bulkProvider"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Select provider
                    </label>
                    <select
                      id="bulkProvider"
                      value={bulkProviderId}
                      onChange={(e) => setBulkProviderId(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                    >
                      <option value="">Select provider</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name} - {provider.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleBulkAssign}
                    disabled={!bulkProviderId}
                    className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                  >
                    Assign to all
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Or assign individually
                </h4>
                
                <div className="space-y-3">
                  {conflicts.map((appointment) => {
                    const { date, time } = formatDateTime(appointment.date, appointment.time);
                    const assignedProviderId = reassignedProviders[appointment.id];
                    
                    return (
                      <div
                        key={appointment.id}
                        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                                Patient ID
                              </div>
                              <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {appointment.patientId}
                              </div>
                            </div>
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

                          {appointment.assignedName && (
                            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
                                <UserCheck className="w-4 h-4 text-success-600 dark:text-success-400" />
                                <span className="text-sm text-success-700 dark:text-success-300">
                                  Reassigned to {appointment.assignedName}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex-1">
                              <label
                                htmlFor={`provider-${appointment.id}`}
                                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                              >
                                Reassign to
                              </label>
                              <select
                                id={`provider-${appointment.id}`}
                                value={assignedProviderId || ""}
                                onChange={(e) => {
                                  const newProviderId = e.target.value;
                                  setReassignedProviders(prev => ({
                                    ...prev,
                                    [appointment.id]: newProviderId
                                  }));
                                }}
                                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                              >
                                <option value="">Select provider</option>
                                {providers.map((provider) => (
                                  <option key={provider.id} value={provider.id}>
                                    {provider.name} - {provider.specialty}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => handleIndividualReassign(appointment.id, assignedProviderId || "")}
                              disabled={!assignedProviderId}
                              className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="px-4 h-10 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onClose}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {leave ? "Update leave" : "Add leave"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
