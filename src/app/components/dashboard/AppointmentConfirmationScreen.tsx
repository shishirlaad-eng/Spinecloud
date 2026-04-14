import { CheckCircle, Calendar, Clock, User, MapPin, FileText } from "lucide-react";

interface AppointmentData {
  date: string;
  time: string;
  provider: string;
  clinic: string;
  clinicAddress: string;
  service: string;
}

interface AppointmentConfirmationScreenProps {
  appointmentData: AppointmentData;
  onGoToDashboard: () => void;
}

export function AppointmentConfirmationScreen({
  appointmentData,
  onGoToDashboard,
}: AppointmentConfirmationScreenProps) {
  const formatService = (service: string) => { // Changed function name from formatAppointmentType to formatService, and parameter from type to service
    const types: Record<string, string> = {
      initial: "Initial Consultation",
      followup: "Follow-up Visit",
      therapy: "Therapy Session",
    };
    return types[service] || service; // Changed 'type' to 'service'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full max-w-2xl">
        {/* Success Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center size-12 rounded-full bg-success-100 dark:bg-success-950/30 text-success-600 dark:text-success-500 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Appointment confirmed
              </h3>
              <p className="text-sm text-neutral-500 mt-0.5">
                Your appointment has been successfully booked.
              </p>
            </div>
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="p-5 space-y-4">
          <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide">
            Appointment details
          </h4>

          <div className="space-y-4">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Date</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                  {formatDate(appointmentData.date)}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Time</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                  {appointmentData.time}
                </p>
              </div>
            </div>

            {/* Provider */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Provider</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                  {appointmentData.provider}
                </p>
              </div>
            </div>

            {/* Clinic Location */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Clinic location</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                  {appointmentData.clinic}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {appointmentData.clinicAddress}
                </p>
              </div>
            </div>

            {/* Service */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Service</p> {/* Changed label from 'Appointment type' to 'Service' */}
                <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                  {formatService(appointmentData.service)} {/* Changed formatAppointmentType to formatService and appointmentData.type to appointmentData.service */}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onGoToDashboard}
            className="w-full h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}