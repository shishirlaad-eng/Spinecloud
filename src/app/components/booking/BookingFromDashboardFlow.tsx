import { useState } from "react";
import { ArrowLeft, Check, Calendar, Clock, MapPin, User, ChevronRight, Repeat } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availability: string;
}

interface SpineCloudConfig {
  enabled: boolean;
  frequency: {
    visitBased: {
      enabled: boolean;
      visits: number[];
    };
    timeBased: {
      enabled: boolean;
      inactivityMonths: number;
    };
    regularInterval: {
      enabled: boolean;
      everyNVisits: number;
    };
  };
}

interface BookingFromDashboardFlowProps {
  clinics: Clinic[];
  providers: Provider[];
  spineCloudConfig?: SpineCloudConfig;
  patientVisitCount?: number; // How many visits has this patient had
  patientLastVisitDate?: string; // When was the patient's last visit
  patientAge?: number; // Patient's age for scoring
  services: any[];
  onComplete: (bookingData: {
    clinicId: string;
    providerId: string;
    date: string;
    time: string;
    service: string;
    spineCloudResult?: any;
    recurringPattern?: {
      enabled: boolean;
      frequency: "weekly" | "monthly";
      weekInterval?: number; // 1 = every week, 2 = every alternate week
      daysOfWeek?: string[]; // ["Monday", "Wednesday", "Friday"]
      timesPerWeek?: number;
      timesPerMonth?: number;
      duration: number; // Number of weeks/months
    };
  }) => void;
  onCancel: () => void;
}

type BookingStep = "service" | "clinic" | "provider" | "datetime" | "confirm";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function BookingFromDashboardFlow({
  clinics,
  providers,
  spineCloudConfig,
  patientVisitCount,
  patientLastVisitDate,
  patientAge,
  onComplete,
  onCancel,
  onLogout,
  services,
}: BookingFromDashboardFlowProps & { onLogout?: () => void }) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [selectedService, setSelectedService] = useState("");
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Recurring appointment state
  const [repeatAppointment, setRepeatAppointment] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState<"weekly" | "monthly">("weekly");
  const [weekInterval, setWeekInterval] = useState<number>(1); // 1 = every week, 2 = every alternate week
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState("1");
  const [timesPerMonth, setTimesPerMonth] = useState("1");
  const [duration, setDuration] = useState("4"); // Default 4 weeks/months
  
  const [spineCloudResult, setSpineCloudResult] = useState<any>(null);

  const getAvailabilityBadgeColor = (availability: string) => {
    if (availability.includes("Today")) return "bg-success-100 text-success-700";
    if (availability.includes("Tomorrow")) return "bg-primary-100 text-primary-700";
    return "bg-neutral-100 text-neutral-700";
  };

  const handleBack = () => {
    if (currentStep === "service") {
      onCancel();
    } else if (currentStep === "clinic") {
      setCurrentStep("service");
    } else if (currentStep === "provider") {
      setCurrentStep("clinic");
    } else if (currentStep === "datetime") {
      setCurrentStep("provider");
    } else if (currentStep === "confirm") {
      setCurrentStep("datetime");
    }
  };

  const handleContinue = () => {
    if (currentStep === "service" && selectedService) {
      setCurrentStep("clinic");
    } else if (currentStep === "clinic" && selectedClinic) {
      setCurrentStep("provider");
    } else if (currentStep === "provider" && selectedProvider) {
      setCurrentStep("datetime");
    } else if (currentStep === "datetime" && selectedDate && selectedTime) {
      if (spineCloudConfig?.enabled) {
        setCurrentStep("confirm");
      } else {
        setCurrentStep("confirm");
      }
    } else if (currentStep === "confirm") {
      const recurringPattern = repeatAppointment ? {
        enabled: true,
        frequency: repeatFrequency,
        weekInterval: repeatFrequency === "weekly" ? weekInterval : undefined,
        daysOfWeek: repeatFrequency === "weekly" ? selectedDays : undefined,
        timesPerWeek: repeatFrequency === "weekly" ? parseInt(timesPerWeek) : undefined,
        timesPerMonth: repeatFrequency === "monthly" ? parseInt(timesPerMonth) : undefined,
        duration: parseInt(duration),
      } : undefined;

      onComplete({
        clinicId: selectedClinic,
        providerId: selectedProvider,
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        spineCloudResult,
        recurringPattern,
      });
    }
  };

  const isStepComplete = () => {
    if (currentStep === "service") return !!selectedService;
    if (currentStep === "clinic") return !!selectedClinic;
    if (currentStep === "provider") return !!selectedProvider;
    if (currentStep === "datetime") {
      if (!selectedDate || !selectedTime) return false;
      if (repeatAppointment) {
        if (repeatFrequency === "weekly") {
          // For weekly, must have at least one day selected
          return selectedDays.length > 0 && parseInt(duration) > 0;
        } else {
          // For monthly, must have times per month
          return parseInt(timesPerMonth) > 0 && parseInt(duration) > 0;
        }
      }
      return true;
    }
    if (currentStep === "confirm") return true;
    return false;
  };

  const getStepTitle = () => {
    if (currentStep === "service") return "Select service";
    if (currentStep === "clinic") return "Select clinic";
    if (currentStep === "provider") return "Select provider";
    if (currentStep === "datetime") return "Select date & time";
    if (currentStep === "confirm") return "Confirm appointment";
    return "";
  };

  const getStepDescription = () => {
    if (currentStep === "service") return "What type of service would you like to schedule?";
    if (currentStep === "clinic") return "Choose your preferred clinic location";
    if (currentStep === "provider") return "Choose your healthcare provider";
    if (currentStep === "datetime") return "Pick your preferred appointment slot";
    if (currentStep === "confirm") return "Review your appointment details";
    return "";
  };

  // Generate available dates (next 14 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
        slots.push({ value: time, label });
      }
    }
    return slots;
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const getRecurringSummary = () => {
    if (!repeatAppointment) return null;

    if (repeatFrequency === "weekly") {
      const intervalText = weekInterval === 1 ? "every week" : `every ${weekInterval} weeks`;
      const daysText = selectedDays.length > 0 
        ? selectedDays.join(", ") 
        : "no days selected";
      return `${timesPerWeek} time(s) per week on ${daysText}, ${intervalText} for ${duration} ${duration === "1" ? "week" : "weeks"}`;
    } else {
      return `${timesPerMonth} time(s) per month for ${duration} ${duration === "1" ? "month" : "months"}`;
    }
  };

  const selectedClinicData = clinics.find(c => c.id === selectedClinic);
  const selectedProviderData = providers.find(p => p.id === selectedProvider);
  const selectedServiceData = services.find(s => (s.id || s.name || s) === selectedService);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-5 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {getStepTitle()}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {getStepDescription()}
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            {["service", "clinic", "provider", "datetime", "confirm"].map((step, index) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  step === currentStep
                    ? "bg-primary-600"
                    : index < ["service", "clinic", "provider", "datetime", "confirm"].indexOf(currentStep)
                    ? "bg-primary-600"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          {/* Service Selection */}
          {currentStep === "service" && (
            <div className="space-y-3">
              {services.map((service) => {
                const serviceId = service.id || service.name || service;
                const serviceName = service.name || service;
                const serviceDescription = service.description || "Standard healthcare service";
                
                return (
                  <div
                    key={serviceId}
                    onClick={() => setSelectedService(serviceId)}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedService === serviceId
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {serviceName}
                        </h3>
                        {serviceDescription && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {serviceDescription}
                          </p>
                        )}
                      </div>
                      {selectedService === serviceId && (
                        <div className="size-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Clinic Selection */}
          {currentStep === "clinic" && (
            <div className="space-y-3">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  onClick={() => setSelectedClinic(clinic.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedClinic === clinic.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {clinic.name}
                      </h3>
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {clinic.address}
                        </p>
                      </div>
                    </div>
                    {selectedClinic === clinic.id && (
                      <div className="size-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Provider Selection */}
          {currentStep === "provider" && (
            <div className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProvider === provider.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {provider.specialization}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-medium mt-2 ${getAvailabilityBadgeColor(
                          provider.availability
                        )}`}
                      >
                        {provider.availability}
                      </span>
                    </div>
                    {selectedProvider === provider.id && (
                      <div className="size-5 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Date & Time Selection */}
          {currentStep === "datetime" && (
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Select date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {generateAvailableDates().slice(0, 6).map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedDate === date.value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Select time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {generateTimeSlots().slice(0, 12).map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setSelectedTime(slot.value)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedTime === slot.value
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Repeat Appointment Section */}
              {selectedDate && selectedTime && (
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  {/* Checkbox */}
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="repeatAppointment"
                      checked={repeatAppointment}
                      onChange={(e) => {
                        setRepeatAppointment(e.target.checked);
                        // Reset values when unchecking
                        if (!e.target.checked) {
                          setSelectedDays([]);
                        }
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
                  {repeatAppointment && (
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-4">
                      {/* Frequency Selection */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Repeat frequency
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setRepeatFrequency("weekly")}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              repeatFrequency === "weekly"
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            Weekly
                          </button>
                          <button
                            onClick={() => setRepeatFrequency("monthly")}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              repeatFrequency === "monthly"
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            Monthly
                          </button>
                        </div>
                      </div>

                      {/* Weekly Options */}
                      {repeatFrequency === "weekly" && (
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
                              value={timesPerWeek}
                              onChange={(e) => setTimesPerWeek(e.target.value)}
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
                                onClick={() => setWeekInterval(1)}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  weekInterval === 1
                                    ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                    : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                }`}
                              >
                                Every week
                              </button>
                              <button
                                onClick={() => setWeekInterval(2)}
                                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                  weekInterval === 2
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
                              {daysOfWeek.map((day) => (
                                <button
                                  key={day}
                                  onClick={() => toggleDay(day)}
                                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                    selectedDays.includes(day)
                                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                                      : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                            {selectedDays.length === 0 && (
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
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>
                        </>
                      )}

                      {/* Monthly Options */}
                      {repeatFrequency === "monthly" && (
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
                              value={timesPerMonth}
                              onChange={(e) => setTimesPerMonth(e.target.value)}
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
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="w-full h-10 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                            />
                          </div>
                        </>
                      )}

                      {/* Summary */}
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-start gap-2">
                          <Repeat className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-neutral-900 dark:text-white font-medium">
                            Recurring pattern:
                          </p>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 ml-6">
                          {getRecurringSummary()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {currentStep === "confirm" && (
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Provider</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                      {selectedProviderData?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Clinic</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                      {selectedClinicData?.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {selectedClinicData?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Date & Time</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {generateTimeSlots().find(s => s.value === selectedTime)?.label}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Service</p>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                      {selectedServiceData?.name || selectedService}
                    </p>
                  </div>
                </div>

                {/* Recurring Pattern Display */}
                {repeatAppointment && (
                  <div className="flex items-start gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <Repeat className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Recurring pattern</p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white mt-0.5">
                        {getRecurringSummary()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!isStepComplete()}
              className="flex-1 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors font-medium text-sm inline-flex items-center justify-center gap-2"
            >
              {currentStep === "confirm" ? "Confirm booking" : "Continue"}
              {currentStep !== "confirm" && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
