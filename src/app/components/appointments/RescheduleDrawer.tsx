import { useState } from "react";
import { X, MapPin, User, Calendar, ChevronRight } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  workingHours: string;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availability: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface RescheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { type: string; date: string; timeSlot: string }) => void;
  clinics: Clinic[];
  providers: Provider[];
}

export function RescheduleDrawer({
  isOpen,
  onClose,
  onConfirm,
  clinics,
  providers,
}: RescheduleDrawerProps) {
  const [step, setStep] = useState<"clinic" | "provider" | "appointment">("clinic");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [serviceType, setServiceType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const serviceTypes = [
    { value: "initial", label: "Initial consultation" },
    { value: "followup", label: "Follow-up" },
    { value: "therapy", label: "Therapy session" },
    { value: "adjustment", label: "Chiropractic adjustment" },
  ];

  // Generate time slots based on date and type (matching the initial booking flow)
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

  // Update time slots when date or type changes
  const handleDateOrTypeChange = (date: string, type: string) => {
    const slots = generateTimeSlots(date, type);
    setTimeSlots(slots);
    setSelectedTimeSlot(""); // Reset selected time slot
  };

  const handleConfirm = () => {
    if (serviceType && selectedDate && selectedTimeSlot) {
      onConfirm({
        type: serviceType,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("clinic");
    setSelectedClinic(null);
    setSelectedProvider(null);
    setServiceType("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Side Drawer - Slide in from right */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-950 shadow-2xl overflow-y-auto animate-slide-in-right z-[101]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Reschedule Appointment</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {step === "clinic" && "Select a clinic location"}
              {step === "provider" && "Choose your healthcare provider"}
              {step === "appointment" && "Pick date and time"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 ${
                step === "clinic"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-400 dark:text-neutral-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  selectedClinic || step === "clinic"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                1
              </div>
              <span className="text-sm font-medium">Clinic</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <div
              className={`flex items-center gap-2 ${
                step === "provider"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-400 dark:text-neutral-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  selectedProvider || step === "provider"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium">Provider</span>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <div
              className={`flex items-center gap-2 ${
                step === "appointment"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-400 dark:text-neutral-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === "appointment"
                    ? "bg-primary-600 text-white"
                    : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Date & Time</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Clinic Selection */}
          {step === "clinic" && (
            <div className="space-y-3">
              {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => {
                    setSelectedClinic(clinic);
                    setStep("provider");
                  }}
                  className="w-full text-left bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-white">
                        {clinic.name}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {clinic.address}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {clinic.workingHours}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400 mt-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Provider Selection */}
          {step === "provider" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("clinic")}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                ← Back to Clinic Selection
              </button>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setStep("appointment");
                    }}
                    className="w-full text-left bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                          {provider.name}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          {provider.specialization}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          {provider.availability}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 mt-2" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Appointment Booking */}
          {step === "appointment" && (
            <div className="space-y-4">
              <button
                onClick={() => setStep("provider")}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                ← Back to Provider Selection
              </button>

              {/* Selected Info */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Selected:
                </p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {selectedClinic?.name}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {selectedProvider?.name} - {selectedProvider?.specialization}
                </p>
              </div>

              {/* Service Type */}
              <div>
                <label className="text-xs text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Service type <span className="text-destructive">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => {
                    setServiceType(e.target.value);
                    handleDateOrTypeChange(selectedDate, e.target.value);
                  }}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                  Preferred Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    handleDateOrTypeChange(e.target.value, serviceType);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                />
              </div>

              {/* Time Slot */}
              {selectedDate && (
                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                    Available Time Slots <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        disabled={!slot.available}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedTimeSlot === slot.time
                            ? "bg-primary-600 border-primary-600 text-white"
                            : !slot.available
                            ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-primary-300 dark:hover:border-primary-700"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "appointment" && (
          <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!serviceType || !selectedDate || !selectedTimeSlot}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Confirm Reschedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}