import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Calendar, Clock, User, DoorClosed, Stethoscope, CheckCircle, Repeat } from "lucide-react";

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProcedurePhase {
  id: string;
  duration: number;
  providerRequired: boolean;
}

interface Service {
  id: string;
  appointmentCategoryId: string;
  name: string;
  roomId: string;
  phases: ProcedurePhase[];
  price: number;
  providerIds: string[];
  locationIds: string[];
  allowOnlineBooking: boolean;
  bookingStartTime: string;
  bookingEndTime: string;
  slotCapacity: number;
  isActive: boolean;
}

interface Room {
  id: string;
  roomId: string;
  roomName: string;
  roomType: string;
  cleanupTime: number;
  status: "Active" | "Inactive";
  notes?: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

interface TimeSlot {
  time: string;
  roomId: string;
  roomName: string;
  providerId: string;
  providerName: string;
  providerSpecialty: string;
  available: boolean;
}

interface BookAppointmentDrawerProps {
  isOpen: boolean;
  patients: Patient[];
  services: Service[];
  rooms: Room[];
  providers: Provider[];
  onClose: () => void;
  onBookAppointment: (appointment: {
    patientId: string;
    serviceId: string;
    date: string;
    time: string;
    roomId: string;
    providerId: string;
    recurringPattern?: {
      enabled: boolean;
      frequency: "weekly" | "monthly";
      weekInterval?: number;
      daysOfWeek?: string[];
      timesPerWeek?: number;
      timesPerMonth?: number;
      duration: number;
    };
  }) => void;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BookAppointmentDrawer({
  isOpen,
  patients,
  services,
  rooms,
  providers,
  onClose,
  onBookAppointment,
}: BookAppointmentDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [recurringPattern, setRecurringPattern] = useState<{
    enabled: boolean;
    frequency: "weekly" | "monthly";
    weekInterval?: number;
    daysOfWeek?: string[];
    timesPerWeek?: number;
    timesPerMonth?: number;
    duration: number;
  }>({
    enabled: false,
    frequency: "weekly",
    duration: 0,
  });

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSelectedPatientId("");
      setPatientSearchQuery("");
      setIsPatientDropdownOpen(false);
      setSelectedServiceId("");
      setSelectedDate("");
      setSelectedTimeSlot(null);
      setSelectedProviderId("");
      setRecurringPattern({
        enabled: false,
        frequency: "weekly",
        duration: 0,
      });
    }
  }, [isOpen]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedRoom = selectedTimeSlot ? rooms.find((r) => r.id === selectedTimeSlot.roomId) : null;
  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  // Calculate total duration including cleanup time
  const getTotalDuration = (service: Service) => {
    const phaseDuration = service.phases.reduce((sum, phase) => sum + phase.duration, 0);
    const room = rooms.find((r) => r.id === service.roomId);
    const cleanupTime = room ? room.cleanupTime : 0;
    return phaseDuration + cleanupTime;
  };

  // Generate time slots based on service duration and room cleanup time
  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedService) return [];
    const slots: TimeSlot[] = [];
    const totalDuration = getTotalDuration(selectedService);
    const room = rooms.find((r) => r.id === selectedService.roomId);
    
    if (!room) return [];

    // Parse booking time window
    const [startHour, startMin] = selectedService.bookingStartTime.split(":").map(Number);
    const [endHour, endMin] = selectedService.bookingEndTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    // Get available providers for this service
    const availableProviders = providers.filter((p) => selectedService.providerIds.includes(p.id));

    // Generate slots - one slot for each provider at each time
    for (let minutes = startMinutes; minutes + totalDuration <= endMinutes; minutes += totalDuration) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;

      // Create a slot for each available provider
      availableProviders.forEach((provider) => {
        slots.push({
          time: timeStr,
          roomId: room.id,
          roomName: room.roomName,
          providerId: provider.id,
          providerName: `${provider.firstName} ${provider.lastName}`,
          providerSpecialty: provider.specialty,
          available: true, // In real app, check against existing appointments
        });
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedPatientId && selectedServiceId && selectedDate) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedTimeSlot && selectedProviderId) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = () => {
    if (selectedPatientId && selectedServiceId && selectedDate && selectedTimeSlot && selectedProviderId) {
      onBookAppointment({
        patientId: selectedPatientId,
        serviceId: selectedServiceId,
        date: selectedDate,
        time: selectedTimeSlot.time,
        roomId: selectedTimeSlot.roomId,
        providerId: selectedProviderId,
        recurringPattern: recurringPattern.enabled ? recurringPattern : undefined,
      });
      onClose();
    }
  };

  const isStep1Valid = selectedPatientId && selectedServiceId && selectedDate;
  const isStep2Valid = selectedTimeSlot && selectedProviderId;

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
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Book appointment
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Step {currentStep} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    step < currentStep
                      ? "bg-success-600 text-white"
                      : step === currentStep
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                      step < currentStep
                        ? "bg-success-600"
                        : "bg-neutral-200 dark:bg-neutral-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Select details</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Choose slot</p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">Confirm</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step 1: Select Patient, Service, Date */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Patient <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientSearchQuery}
                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                    onFocus={() => setIsPatientDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsPatientDropdownOpen(false), 200)}
                    placeholder="Type patient name or ID to search..."
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                  {isPatientDropdownOpen && patientSearchQuery.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {patients
                        .filter((patient) =>
                          patient.firstName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                          patient.lastName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                          patient.patientId.toLowerCase().includes(patientSearchQuery.toLowerCase())
                        )
                        .length > 0 ? (
                        patients
                          .filter((patient) =>
                            patient.firstName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                            patient.lastName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                            patient.patientId.toLowerCase().includes(patientSearchQuery.toLowerCase())
                          )
                          .map((patient) => (
                            <div
                              key={patient.id}
                              onClick={() => {
                                setSelectedPatientId(patient.id);
                                setPatientSearchQuery(`${patient.firstName} ${patient.lastName} (${patient.patientId})`);
                                setIsPatientDropdownOpen(false);
                              }}
                              className="px-3 py-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm text-neutral-900 dark:text-white transition-colors"
                            >
                              <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400">ID: {patient.patientId}</div>
                            </div>
                          ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 text-center">
                          No patients found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Service <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="">Select service</option>
                  {services
                    .filter((s) => s.isActive)
                    .map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({getTotalDuration(service)} mins - ${service.price})
                      </option>
                    ))}
                </select>
                {selectedService && (
                  <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      <span className="font-semibold">Duration:</span> {getTotalDuration(selectedService)} minutes
                      (includes {rooms.find((r) => r.id === selectedService.roomId)?.cleanupTime || 0} min cleanup)
                    </p>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Appointment date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              {/* Recurring Appointment Section */}
              {selectedDate && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  {/* Checkbox */}
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="repeatAppointment"
                      checked={recurringPattern.enabled}
                      onChange={(e) => {
                        setRecurringPattern({
                          ...recurringPattern,
                          enabled: e.target.checked,
                          daysOfWeek: e.target.checked ? [] : undefined,
                        });
                      }}
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                    />
                    <label
                      htmlFor="repeatAppointment"
                      className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    >
                      Repeat appointment
                    </label>
                  </div>

                  {/* Repeat Configuration */}
                  {recurringPattern.enabled && (
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-4">
                      {/* Frequency Selection */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Repeat frequency
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setRecurringPattern({ ...recurringPattern, frequency: "weekly", daysOfWeek: [] })}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              recurringPattern.frequency === "weekly"
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            Weekly
                          </button>
                          <button
                            type="button"
                            onClick={() => setRecurringPattern({ ...recurringPattern, frequency: "monthly" })}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              recurringPattern.frequency === "monthly"
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            Monthly
                          </button>
                        </div>
                      </div>

                      {/* Weekly Options */}
                      {recurringPattern.frequency === "weekly" && (
                        <>
                          {/* Times per Week */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Number of times per week
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="7"
                              value={recurringPattern.timesPerWeek || 1}
                              onChange={(e) => setRecurringPattern({ ...recurringPattern, timesPerWeek: parseInt(e.target.value) })}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>

                          {/* Week Interval */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Repeat pattern
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setRecurringPattern({ ...recurringPattern, weekInterval: 1 })}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  recurringPattern.weekInterval === 1
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                    : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                }`}
                              >
                                Every week
                              </button>
                              <button
                                type="button"
                                onClick={() => setRecurringPattern({ ...recurringPattern, weekInterval: 2 })}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  recurringPattern.weekInterval === 2
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                    : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                }`}
                              >
                                Alternate weeks
                              </button>
                            </div>
                          </div>

                          {/* Day Selection */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Select days <span className="text-destructive">*</span>
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {daysOfWeek.map((day) => {
                                const isSelected = recurringPattern.daysOfWeek?.includes(day);
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      const days = recurringPattern.daysOfWeek || [];
                                      if (isSelected) {
                                        setRecurringPattern({
                                          ...recurringPattern,
                                          daysOfWeek: days.filter(d => d !== day),
                                        });
                                      } else {
                                        setRecurringPattern({
                                          ...recurringPattern,
                                          daysOfWeek: [...days, day],
                                        });
                                      }
                                    }}
                                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                      isSelected
                                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                        : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                            {recurringPattern.daysOfWeek && recurringPattern.daysOfWeek.length === 0 && (
                              <p className="text-xs text-destructive mt-1">
                                Please select at least one day
                              </p>
                            )}
                          </div>

                          {/* Duration for Weekly */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Duration (weeks)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="52"
                              value={recurringPattern.duration || 4}
                              onChange={(e) => setRecurringPattern({ ...recurringPattern, duration: parseInt(e.target.value) })}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>
                        </>
                      )}

                      {/* Monthly Options */}
                      {recurringPattern.frequency === "monthly" && (
                        <>
                          {/* Times per Month */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Number of times per month
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="31"
                              value={recurringPattern.timesPerMonth || 1}
                              onChange={(e) => setRecurringPattern({ ...recurringPattern, timesPerMonth: parseInt(e.target.value) })}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>

                          {/* Duration for Monthly */}
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              Duration (months)
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={recurringPattern.duration || 4}
                              onChange={(e) => setRecurringPattern({ ...recurringPattern, duration: parseInt(e.target.value) })}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>
                        </>
                      )}

                      {/* Summary */}
                      {(recurringPattern.frequency === "weekly" && recurringPattern.daysOfWeek && recurringPattern.daysOfWeek.length > 0) ||
                       (recurringPattern.frequency === "monthly" && recurringPattern.duration > 0) ? (
                        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-start gap-2">
                            <Repeat className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-neutral-900 dark:text-white font-medium">
                              Recurring pattern:
                            </p>
                          </div>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 ml-6">
                            {recurringPattern.frequency === "weekly" ? (
                              <>
                                {recurringPattern.timesPerWeek || 1} time(s) per week on{" "}
                                {recurringPattern.daysOfWeek.join(", ")},{" "}
                                {recurringPattern.weekInterval === 1 ? "every week" : `every ${recurringPattern.weekInterval} weeks`} for{" "}
                                {recurringPattern.duration || 0} {recurringPattern.duration === 1 ? "week" : "weeks"}
                              </>
                            ) : (
                              <>
                                {recurringPattern.timesPerMonth || 1} time(s) per month for{" "}
                                {recurringPattern.duration || 0} {recurringPattern.duration === 1 ? "month" : "months"}
                              </>
                            )}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Time Slot */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                  Available time slots
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {formatDate(selectedDate)} • {selectedService?.name}
                </p>

                {timeSlots.length === 0 ? (
                  <div className="p-8 text-center border border-neutral-200 dark:border-neutral-800 rounded-lg">
                    <Clock className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      No available time slots for this service
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {timeSlots.map((slot, index) => {
                      const isSelected = selectedTimeSlot?.time === slot.time && selectedTimeSlot?.providerId === slot.providerId;
                      
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedTimeSlot(slot);
                            setSelectedProviderId(slot.providerId);
                          }}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                              : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              {/* Time */}
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {formatTime(slot.time)}
                                </span>
                              </div>
                              
                              {/* Room */}
                              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <DoorClosed className="w-4 h-4" />
                                <span>{slot.roomName}</span>
                              </div>
                              
                              {/* Provider */}
                              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <Stethoscope className="w-4 h-4" />
                                <div>
                                  <span className="font-medium text-neutral-900 dark:text-white">Dr. {slot.providerName}</span>
                                  <span className="text-neutral-500 dark:text-neutral-500"> • {slot.providerSpecialty}</span>
                                </div>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="size-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                                <div className="size-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Appointment Summary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                  Appointment summary
                </h3>

                {/* Patient Details */}
                <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Patient details
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      <span className="font-medium">Name:</span> {selectedPatient?.firstName}{" "}
                      {selectedPatient?.lastName}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Patient ID:</span> {selectedPatient?.patientId}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Email:</span> {selectedPatient?.email}
                    </p>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Appointment details
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      <span className="font-medium">Date:</span> {formatDate(selectedDate)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Time:</span> {selectedTimeSlot && formatTime(selectedTimeSlot.time)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Duration:</span> {selectedService && getTotalDuration(selectedService)}{" "}
                      minutes
                    </p>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Service details
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      <span className="font-medium">Service:</span> {selectedService?.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Provider:</span> Dr. {selectedProvider?.firstName}{" "}
                      {selectedProvider?.lastName} ({selectedProvider?.specialty})
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Price:</span> ${selectedService?.price}
                    </p>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DoorClosed className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                    <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Room details
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-neutral-900 dark:text-white">
                      <span className="font-medium">Room:</span> {selectedRoom?.roomName}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Room ID:</span> {selectedRoom?.roomId}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="font-medium">Type:</span> {selectedRoom?.roomType}
                    </p>
                  </div>
                </div>

                {/* Recurring Pattern Display */}
                {recurringPattern.enabled && (
                  <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Repeat className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                        Recurring pattern
                      </h4>
                    </div>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      {recurringPattern.frequency === "weekly" && recurringPattern.daysOfWeek ? (
                        <>
                          {recurringPattern.timesPerWeek || 1} time(s) per week on{" "}
                          {recurringPattern.daysOfWeek.join(", ")},{" "}
                          {recurringPattern.weekInterval === 1 ? "every week" : `every ${recurringPattern.weekInterval} weeks`} for{" "}
                          {recurringPattern.duration || 0} {recurringPattern.duration === 1 ? "week" : "weeks"}
                        </>
                      ) : (
                        <>
                          {recurringPattern.timesPerMonth || 1} time(s) per month for{" "}
                          {recurringPattern.duration || 0} {recurringPattern.duration === 1 ? "month" : "months"}
                        </>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 justify-between">
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm inline-flex items-center gap-2"
          >
            {currentStep === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Back
              </>
            )}
          </button>
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
              className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              Confirm appointment
            </button>
          )}
        </div>
      </div>
    </>
  );
}