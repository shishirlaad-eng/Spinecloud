import { useState, useEffect } from "react";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentBookingScreenProps {
  clinicName: string;
  providerName: string;
  preselectedService?: string;
  onConfirm: (appointmentData: {
    type: string;
    date: string;
    timeSlot: string;
  }) => void;
  onBack: () => void;
}

const serviceTypes = [
  { value: "", label: "Select service type" },
  { value: "initial", label: "Initial consultation" },
  { value: "followup", label: "Follow-up" },
  { value: "therapy", label: "Therapy session" },
  { value: "adjustment", label: "Chiropractic adjustment" },
];

// Mock time slots generator
const generateTimeSlots = (date: string, type: string): TimeSlot[] => {
  if (!date || !type) return [];
  
  const slots: TimeSlot[] = [
    { id: "09:00", time: "9:00 AM", available: true },
    { id: "09:30", time: "9:30 AM", available: true },
    { id: "10:00", time: "10:00 AM", available: false },
    { id: "10:30", time: "10:30 AM", available: true },
    { id: "11:00", time: "11:00 AM", available: true },
    { id: "11:30", time: "11:30 AM", available: true },
    { id: "14:00", time: "2:00 PM", available: true },
    { id: "14:30", time: "2:30 PM", available: false },
    { id: "15:00", time: "3:00 PM", available: true },
    { id: "15:30", time: "3:30 PM", available: true },
    { id: "16:00", time: "4:00 PM", available: true },
    { id: "16:30", time: "4:30 PM", available: true },
  ];
  
  return slots;
};

export function AppointmentBookingScreen({
  clinicName,
  providerName,
  preselectedService,
  onConfirm,
  onBack,
}: AppointmentBookingScreenProps) {
  const [serviceType, setServiceType] = useState(preselectedService || "");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [showNoSlotsMessage, setShowNoSlotsMessage] = useState(false);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (appointmentDate && serviceType) {
      const slots = generateTimeSlots(appointmentDate, serviceType);
      setTimeSlots(slots);
      setSelectedTimeSlot("");
      setShowNoSlotsMessage(slots.filter(s => s.available).length === 0);
    } else {
      setTimeSlots([]);
      setShowNoSlotsMessage(false);
    }
  }, [appointmentDate, serviceType]);

  const handleConfirm = () => {
    if (serviceType && appointmentDate && selectedTimeSlot) {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      onConfirm({
        type: serviceType,
        date: appointmentDate,
        timeSlot: selectedSlot?.time || "",
      });
    }
  };

  const isFormValid = serviceType && appointmentDate && selectedTimeSlot;

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-3xl">
        {/* Logo - Outside Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Back Button */}
          <div className="px-6 pt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Book appointment
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
              Schedule your appointment with {providerName} at {clinicName}
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            {/* Service Type - Only show if not preselected */}
            {!preselectedService && (
              <div>
                <label 
                  htmlFor="serviceType"
                  className="text-sm text-neutral-700 dark:text-neutral-300 block mb-3 font-medium"
                >
                  Service type <span className="text-destructive">*</span>
                </label>
                <select
                  id="serviceType"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-100 transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {preselectedService && (
              <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Selected service</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{preselectedService}</p>
              </div>
            )}

            {/* Appointment Date */}
            <div>
              <label 
                htmlFor="appointmentDate"
                className="text-sm text-neutral-700 dark:text-neutral-300 block mb-1.5 font-medium"
              >
                Appointment date <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="appointmentDate"
                  type="date"
                  min={today}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  disabled={!serviceType}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-neutral-100 transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Available Time Slots */}
            {timeSlots.length > 0 && (
              <div>
                <label className="text-sm text-neutral-700 dark:text-neutral-300 block mb-3 font-medium">
                  Available Time Slots <span className="text-destructive">*</span>
                </label>
                
                {showNoSlotsMessage ? (
                  <div className="text-center py-8 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                    <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No available time slots for this date
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                        disabled={!slot.available}
                        className={`h-10 px-3 text-sm rounded-lg border transition-all font-medium ${
                          selectedTimeSlot === slot.id
                            ? "border-primary-500 bg-primary-600 text-white"
                            : slot.available
                            ? "border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 line-through cursor-not-allowed opacity-50"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-between gap-3">
            <button
              onClick={onBack}
              className="px-6 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isFormValid}
              className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}