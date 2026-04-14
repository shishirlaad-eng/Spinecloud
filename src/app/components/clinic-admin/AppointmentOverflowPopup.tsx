import { Appointment } from "./ClinicCalendarScreen";

interface AppointmentOverflowPopupProps {
  appointments: Appointment[];
  providers?: Array<{ id: string; color: string; firstName: string; lastName: string }>;
  getStatusColor?: (status: string) => string;
  onViewAppointment?: (id: string) => void;
}

export function AppointmentOverflowPopup({
  appointments,
  providers = [],
  getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      Confirmed: "bg-primary-100 text-primary-700",
      Completed: "bg-success-100 text-success-700",
      Pending: "bg-amber-100 text-amber-700",
      Cancelled: "bg-neutral-100 text-neutral-600",
    };
    return statusMap[status] || "bg-neutral-100 text-neutral-600";
  },
  onViewAppointment,
}: AppointmentOverflowPopupProps) {
  if (appointments.length === 0) return null;

  return (
    <div className="absolute z-50 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl p-2 space-y-2 max-h-96 overflow-y-auto">
      {appointments.map((apt) => {
        const provider = providers?.find((p) => p.id === apt.providerId);
        
        return (
          <button
            key={apt.id}
            onClick={() => onViewAppointment?.(apt.id)}
            className="w-full p-2 rounded text-left border-l-2 transition-all hover:shadow-md"
            style={{
              backgroundColor: `${provider?.color || "#3B82F6"}15`,
              borderLeftColor: provider?.color || "#3B82F6",
            }}
          >
            <p className="text-xs font-medium text-neutral-900 dark:text-white">
              {apt.startTime} - {apt.endTime}
            </p>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
              {apt.patientName}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {apt.service}
            </p>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs mt-1 ${getStatusColor(
                apt.status
              )}`}
            >
              {apt.status}
            </span>
          </button>
        );
      })}
    </div>
  );
}