import { useState, useEffect } from "react";
import { X, Calendar, MapPin, Stethoscope, ChevronRight, Check, AlertCircle, Clock, ChevronDown, CheckCircle2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  durations?: { duration: number }[];
  bookingStartTime?: string;
  bookingEndTime?: string;
}

interface Branch {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
}

interface ScheduleRow {
  id: string;
  timesPerWeek: number;
  durationWeeks: number;
}

interface BookTreatmentScheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  scheduleRows: ScheduleRow[];
  services: Service[];
  branches: Branch[];
  providers: Provider[];
  onConfirmBooking: (appointments: any[]) => void;
}

interface GeneratedAppointment {
  id: string;
  phaseIndex: number;
  weekIndex: number; // 0-based index within the phase
  absoluteWeek: number; // 1-based week overall
  dayName: string;
  dateStr: string;
  time: string;
  available: boolean;
  overrideTime?: string;
}

export function BookTreatmentScheduleDrawer({
  isOpen,
  onClose,
  patientId,
  patientName,
  scheduleRows,
  services,
  branches,
  providers,
  onConfirmBooking,
}: BookTreatmentScheduleDrawerProps) {
  // Step tracking
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Phase selection state
  // Map of phase.id -> array of selected day names (e.g. ["Monday", "Wednesday", "Friday"])
  const [phaseDays, setPhaseDays] = useState<Record<string, string[]>>({});
  
  // Input fields
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [preferredTime, setPreferredTime] = useState("09:00");

  // Dynamic booking matrix
  const [appointments, setAppointments] = useState<GeneratedAppointment[]>([]);

  // Initialize phase days selection when schedule rows change or drawer opens
  useEffect(() => {
    if (isOpen && scheduleRows.length > 0) {
      const initialDays: Record<string, string[]> = {};
      scheduleRows.forEach((row) => {
        // Default select first N working days depending on timesPerWeek
        const defaults = ["Monday", "Wednesday", "Friday", "Tuesday", "Thursday", "Saturday", "Sunday"];
        initialDays[row.id] = defaults.slice(0, Math.min(row.timesPerWeek, 7));
      });
      setPhaseDays(initialDays);
      
      // Default selections if available
      if (services.length > 0) setSelectedServiceId(services[0].id);
      if (branches.length > 0) setSelectedBranchId(branches[0].id);
    }
  }, [isOpen, scheduleRows, services, branches]);

  if (!isOpen) return null;

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Toggle selected day for a phase
  const toggleDay = (phaseId: string, day: string, maxDays: number) => {
    const currentSelected = phaseDays[phaseId] || [];
    if (currentSelected.includes(day)) {
      setPhaseDays((prev) => ({
        ...prev,
        [phaseId]: prev[phaseId].filter((d) => d !== day),
      }));
    } else {
      if (currentSelected.length >= maxDays) {
        // Replace the last one or do nothing
        return;
      }
      setPhaseDays((prev) => ({
        ...prev,
        [phaseId]: [...(prev[phaseId] || []), day],
      }));
    }
  };

  const handleNextToMatrix = () => {
    // Validation
    if (!selectedServiceId) {
      alert("Please select a treatment service.");
      return;
    }
    if (!selectedBranchId) {
      alert("Please select a preferred branch.");
      return;
    }

    // Check if days selected match timesPerWeek for each phase
    for (const row of scheduleRows) {
      const selected = phaseDays[row.id] || [];
      if (selected.length !== row.timesPerWeek) {
        alert(
          `For Phase ${scheduleRows.indexOf(row) + 1} (${row.timesPerWeek}x/week), please select exactly ${
            row.timesPerWeek
          } day(s). Currently selected: ${selected.length}`
        );
        return;
      }
    }

    // Generate appointment slots
    const generated: GeneratedAppointment[] = [];
    let currentBaseDate = new Date(startDate);
    let absoluteWeekCounter = 1;

    scheduleRows.forEach((row, phaseIdx) => {
      const selectedDays = phaseDays[row.id] || [];
      // Sort days based on standard weekday order so they are chronologically scheduled within the week
      const sortedDays = [...selectedDays].sort((a, b) => weekdays.indexOf(a) - weekdays.indexOf(b));

      for (let w = 0; w < row.durationWeeks; w++) {
        // Calculate the base start date of this week
        // Each week begins 7 days after the previous base date (or same for the first week)
        const weekStartDate = new Date(currentBaseDate);
        if (w > 0 || phaseIdx > 0) {
          weekStartDate.setDate(currentBaseDate.getDate() + 7);
        }
        
        sortedDays.forEach((dayName) => {
          // Find the next occurrence of this dayName on or after weekStartDate
          const targetDayIndex = weekdays.indexOf(dayName);
          const currentDayIndex = weekStartDate.getDay();
          
          let dayOffset = targetDayIndex - currentDayIndex;
          if (dayOffset < 0) {
            // If the day has already passed in this week, move to the next week's day
            dayOffset += 7;
          }

          const aptDate = new Date(weekStartDate);
          aptDate.setDate(weekStartDate.getDate() + dayOffset);

          // Availability simulation (90% available, random simulated conflict for visual wow factor)
          const isConflictSimulated = Math.random() < 0.15;

          generated.push({
            id: `gen-${phaseIdx}-${w}-${dayName}`,
            phaseIndex: phaseIdx,
            weekIndex: w,
            absoluteWeek: absoluteWeekCounter,
            dayName,
            dateStr: aptDate.toISOString().split("T")[0],
            time: preferredTime,
            available: !isConflictSimulated,
          });
        });

        // Set base date to the current week's start date for next iteration calculation
        currentBaseDate = weekStartDate;
        absoluteWeekCounter++;
      }
    });

    setAppointments(generated);
    setCurrentStep(2);
  };

  // Change individual slot time
  const handleOverrideTime = (slotId: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === slotId ? { ...apt, time: newTime, overrideTime: newTime, available: true } : apt))
    );
  };

  const handleBook = () => {
    // Generate raw appointments matching the format required in App.tsx
    const finalAppointments = appointments.map((apt, index) => {
      const selectedService = services.find((s) => s.id === selectedServiceId);
      const selectedBranch = branches.find((b) => b.id === selectedBranchId);
      const selectedProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];

      // Calculate endTime (usually +30 mins or duration)
      const duration = selectedService?.durations?.[0]?.duration || 30;
      const [startHour, startMin] = apt.time.split(":").map(Number);
      const totalMin = startHour * 60 + startMin + duration;
      const endHour = Math.floor(totalMin / 60);
      const endMin = totalMin % 60;
      const endTimeStr = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

      return {
        id: `apt-cp-${Date.now()}-${index}`,
        patientId,
        patientName,
        providerId: selectedProvider?.id || "user-1",
        locationId: selectedBranch?.id || "branch-1",
        date: apt.dateStr,
        startTime: apt.time,
        endTime: endTimeStr,
        service: selectedService?.name || "Spinal Adjustment",
        status: "Confirmed",
      };
    });

    onConfirmBooking(finalAppointments);
    setCurrentStep(3);
  };

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const selectedProvider = providers.find((p) => p.id === selectedProviderId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-4xl h-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-6 py-4.5 bg-neutral-50 dark:bg-neutral-950">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Book Care Plan Treatment Schedule</h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Patient: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{patientName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full text-neutral-500 hover:text-neutral-700 transition duration-150">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Bar */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 py-3 text-xs font-semibold select-none">
          <div className={`flex items-center gap-2 flex-1 pb-1 border-b-2 transition-colors ${currentStep >= 1 ? "border-primary-600 text-primary-700 dark:text-primary-400" : "border-transparent text-neutral-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-500"}`}>1</span>
            Preferences & Days
          </div>
          <div className={`flex items-center gap-2 flex-1 pb-1 border-b-2 transition-colors ${currentStep >= 2 ? "border-primary-600 text-primary-700 dark:text-primary-400" : "border-transparent text-neutral-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-500"}`}>2</span>
            Booking Matrix Override
          </div>
          <div className={`flex items-center gap-2 flex-1 pb-1 border-b-2 transition-colors ${currentStep >= 3 ? "border-primary-600 text-primary-700 dark:text-primary-400" : "border-transparent text-neutral-400"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? "bg-primary-600 text-white" : "bg-neutral-200 text-neutral-500"}`}>3</span>
            Confirmation
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* STEP 1: PREFERENCES AND DAYS */}
          {currentStep === 1 && (
            <div className="space-y-8">
              
              {/* Preferences Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                {/* Service Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Treatment Plan Service</label>
                  <div className="relative">
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/30 transition duration-150 appearance-none"
                    >
                      <option value="">Select Service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Branch */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Preferred Branch</label>
                  <div className="relative">
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/30 transition duration-150 appearance-none"
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Provider (Optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Preferred Provider (Optional)</label>
                  <div className="relative">
                    <select
                      value={selectedProviderId}
                      onChange={(e) => setSelectedProviderId(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/30 transition duration-150 appearance-none"
                    >
                      <option value="">No Preference / Auto Assign</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>Dr. {provider.firstName} {provider.lastName} ({provider.specialty})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Start Date & Preferred Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white outline-none focus:border-primary-600"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400">Preferred Time</label>
                    <input
                      type="time"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full h-11 px-4 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm text-neutral-800 dark:text-white outline-none focus:border-primary-600"
                    />
                  </div>
                </div>
              </div>

              {/* Day Selection For Each Care Plan Phase */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-neutral-800 pb-2">Select Days for Each Treatment Phase:</h3>
                
                {scheduleRows.map((row, idx) => {
                  const selected = phaseDays[row.id] || [];
                  const diff = row.timesPerWeek - selected.length;
                  return (
                    <div key={row.id} className="bg-white dark:bg-neutral-850 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <span className="text-xs font-bold uppercase text-primary-600 px-2.5 py-1 bg-primary-50 dark:bg-primary-950/40 rounded-full">Phase {idx + 1}</span>
                          <h4 className="text-base font-semibold text-neutral-900 dark:text-white mt-2">
                            {row.timesPerWeek}x Visits/Week for {row.durationWeeks} Weeks ({row.timesPerWeek * row.durationWeeks} Visits Total)
                          </h4>
                        </div>
                        <div className="text-sm">
                          {diff === 0 ? (
                            <span className="text-success-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Perfect alignment</span>
                          ) : diff > 0 ? (
                            <span className="text-neutral-500 italic">Select {diff} more day(s)</span>
                          ) : (
                            <span className="text-red-500">Too many days selected (Deselect {-diff})</span>
                          )}
                        </div>
                      </div>

                      {/* Day Grid Buttons */}
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const isSelected = selected.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => toggleDay(row.id, day, row.timesPerWeek)}
                              className={`h-11 rounded-xl text-sm font-medium transition duration-200 border ${
                                isSelected
                                  ? "bg-primary-600 text-white border-primary-600 shadow-sm shadow-primary-500/20"
                                  : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-800"
                              }`}
                            >
                              {day.slice(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* STEP 2: INTERACTIVE BOOKING MATRIX */}
          {currentStep === 2 && (
            <div className="space-y-6">
              
              {/* Matrix Information Summary */}
              <div className="flex items-center justify-between bg-primary-50/50 dark:bg-primary-950/20 p-4 rounded-xl border border-primary-100 dark:border-primary-900/30">
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                  Total Scheduled: <span className="font-bold text-primary-700 dark:text-primary-400">{appointments.length} Visits</span> across {scheduleRows.reduce((a, r) => a + r.durationWeeks, 0)} weeks.
                </div>
                <div className="text-xs text-neutral-500 italic">
                  * Conflicts are highlighted. Use drop-downs to change specific times.
                </div>
              </div>

              {/* Interactive Booking Matrix Table */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 font-bold border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-6 py-4">Visit ID</th>
                      <th className="px-6 py-4">Week & Day</th>
                      <th className="px-6 py-4">Target Date</th>
                      <th className="px-6 py-4">Slot Status</th>
                      <th className="px-6 py-4">Time Customization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {appointments.map((apt, index) => {
                      const displayDate = new Date(apt.dateStr).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      });
                      
                      return (
                        <tr key={apt.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition">
                          <td className="px-6 py-4 font-semibold text-neutral-500">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-neutral-900 dark:text-white">Week {apt.absoluteWeek}</div>
                            <div className="text-xs text-neutral-500">{apt.dayName}</div>
                          </td>
                          <td className="px-6 py-4 text-neutral-700 dark:text-neutral-300">
                            {displayDate}
                          </td>
                          <td className="px-6 py-4">
                            {apt.available ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200 dark:bg-success-950/20 dark:text-success-400 dark:border-success-900/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 animate-pulse">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Conflicting Slot
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {/* Fast Inline Selection dropdown to change timings */}
                            <select
                              value={apt.time}
                              onChange={(e) => handleOverrideTime(apt.id, e.target.value)}
                              className={`h-9 px-3 bg-neutral-50 dark:bg-neutral-950 border rounded-lg text-xs font-semibold outline-none focus:border-primary-600 transition ${
                                apt.overrideTime
                                  ? "border-primary-500 text-primary-700 dark:text-primary-400"
                                  : apt.available
                                  ? "border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                                  : "border-red-400 text-red-700 dark:text-red-400 bg-red-50/20"
                              }`}
                            >
                              <option value="08:00">08:00 AM</option>
                              <option value="08:30">08:30 AM</option>
                              <option value="09:00">09:00 AM</option>
                              <option value="09:30">09:30 AM</option>
                              <option value="10:00">10:00 AM</option>
                              <option value="10:30">10:30 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="11:30">11:30 AM</option>
                              <option value="12:00">12:00 PM</option>
                              <option value="12:30">12:30 PM</option>
                              <option value="13:00">01:00 PM</option>
                              <option value="13:30">01:30 PM</option>
                              <option value="14:00">02:00 PM</option>
                              <option value="14:30">02:30 PM</option>
                              <option value="15:00">03:00 PM</option>
                              <option value="15:30">03:30 PM</option>
                              <option value="16:00">04:00 PM</option>
                              <option value="16:30">04:30 PM</option>
                              <option value="17:00">05:00 PM</option>
                              <option value="17:30">05:30 PM</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* STEP 3: BOOKING CONFIRMATION SCREEN */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 text-center">
              <div className="w-16 h-16 bg-success-50 dark:bg-success-950/40 rounded-full flex items-center justify-center border border-success-200 dark:border-success-900/30 text-success-600 dark:text-success-400">
                <Check className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Care Plan Booked Successfully!</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-md">
                  We have registered all <span className="font-semibold text-neutral-800 dark:text-neutral-200">{appointments.length} appointments</span> to the patient's Clinical Treatment plan records.
                </p>
              </div>

              {/* Summary card */}
              <div className="w-full max-w-md p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Service:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Branch Location:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{selectedBranch?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Practitioner:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">Dr. {selectedProvider?.firstName} {selectedProvider?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Start Date:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{new Date(startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3 font-semibold text-base text-neutral-900 dark:text-white">
                  <span>Total Visits:</span>
                  <span className="text-primary-600 dark:text-primary-400">{appointments.length} Visits</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
              >
                Return to Care Plan Builder
              </button>
            </div>
          )}

        </div>

        {/* Drawer Footer Buttons */}
        {currentStep !== 3 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 px-8 py-5 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between">
            {currentStep === 2 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Back to Days Selection
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
            )}

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNextToMatrix}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-1.5"
              >
                Generate Booking Matrix <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBook}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Confirm Bulk Booking ({appointments.length} Visits)
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
