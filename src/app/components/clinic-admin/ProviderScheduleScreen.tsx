import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Clock, Plus, Trash2, MapPin } from "lucide-react";

interface Branch {
  id: string;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  branchId: string;
}

interface DaySchedule {
  isWorking: boolean;
  timeSlots: TimeSlot[];
}

interface Schedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  schedule: Schedule;
}

interface ProviderScheduleScreenProps {
  provider: Provider;
  availableBranches: Branch[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers") => void;
  onBack: () => void;
  onSave: (providerId: string, schedule: Schedule) => void;
  onLogout?: () => void;
}

const defaultTimeSlot = (branchId: string): TimeSlot => ({
  startTime: "09:00",
  endTime: "12:00",
  branchId: branchId || "",
});

const defaultDaySchedule: DaySchedule = {
  isWorking: false,
  timeSlots: [],
};

export function ProviderScheduleScreen({
  provider,
  availableBranches,
  onNavigate,
  onBack,
  onSave,
  onLogout,
}: ProviderScheduleScreenProps) {
  const [schedule, setSchedule] = useState<Schedule>(() => {
    // Initialize schedule with proper structure
    const days: (keyof Schedule)[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const initialSchedule = {} as Schedule;
    
    days.forEach(day => {
      const providerDay = provider.schedule?.[day];
      if (providerDay && 'timeSlots' in providerDay && Array.isArray(providerDay.timeSlots)) {
        // Check if timeSlots have branchId (new structure)
        const hasNewStructure = providerDay.timeSlots.length === 0 || 
          providerDay.timeSlots.some((slot: any) => 'branchId' in slot);
        
        if (hasNewStructure) {
          initialSchedule[day] = {
            isWorking: providerDay.isWorking,
            timeSlots: providerDay.timeSlots.map((slot: any) => ({
              startTime: slot.startTime || "09:00",
              endTime: slot.endTime || "12:00",
              branchId: slot.branchId || "",
            })),
          };
        } else {
          // Old structure with branchId at day level - migrate
          const dayBranchId = (providerDay as any).branchId || "";
          initialSchedule[day] = {
            isWorking: providerDay.isWorking,
            timeSlots: providerDay.timeSlots.map((slot: any) => ({
              startTime: slot.startTime || "09:00",
              endTime: slot.endTime || "12:00",
              branchId: dayBranchId,
            })),
          };
        }
      } else {
        // Old structure or missing - use default
        initialSchedule[day] = { ...defaultDaySchedule };
      }
    });
    
    return initialSchedule;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const days: (keyof Schedule)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const dayLabels: Record<keyof Schedule, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const toggleDayWorking = (day: keyof Schedule) => {
    const isCurrentlyWorking = schedule[day].isWorking;
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        isWorking: !isCurrentlyWorking,
        timeSlots: !isCurrentlyWorking 
          ? [defaultTimeSlot(availableBranches.length > 0 ? availableBranches[0].id : "")] 
          : [],
      },
    });
  };

  const addTimeSlot = (day: keyof Schedule) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: [
          ...schedule[day].timeSlots, 
          defaultTimeSlot(availableBranches.length > 0 ? availableBranches[0].id : "")
        ],
      },
    });
  };

  const removeTimeSlot = (day: keyof Schedule, index: number) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  const updateTimeSlot = (
    day: keyof Schedule,
    index: number,
    field: "startTime" | "endTime" | "branchId",
    value: string
  ) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const hasWorkingDay = days.some((day) => schedule[day].isWorking);
    if (!hasWorkingDay) {
      newErrors.schedule = "At least one working day must be selected";
    }

    // Validate each working day
    days.forEach((day) => {
      if (schedule[day].isWorking) {
        // Check if at least one time slot exists
        if (schedule[day].timeSlots.length === 0) {
          newErrors[`${day}-slots`] = "At least one time slot required";
        }

        // Validate each time slot
        schedule[day].timeSlots.forEach((slot, index) => {
          // Check if branch is selected
          if (!slot.branchId) {
            newErrors[`${day}-slot-${index}-branch`] = "Branch must be selected";
          }
          // Check time range
          if (slot.startTime >= slot.endTime) {
            newErrors[`${day}-slot-${index}-time`] = "End time must be after start time";
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave(provider.id, schedule);
  };

  return (
    <ClinicAdminLayout activeMenu="providers" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to providers
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                  {provider.firstName[0]}
                  {provider.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                  {provider.firstName} {provider.lastName}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {provider.specialty}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Working Schedule */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white tracking-wide">
                  Weekly Schedule
                </h2>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Configure working days with multiple time slots and branch locations
              </p>

              {errors.schedule && (
                <p className="text-xs text-destructive mb-4">{errors.schedule}</p>
              )}

              <div className="space-y-4">
                {days.map((day) => (
                  <div
                    key={day}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden"
                  >
                    {/* Day Header */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule[day].isWorking}
                          onChange={() => toggleDayWorking(day)}
                          className="w-4 h-4 rounded text-primary-600 border-neutral-300 dark:border-neutral-700"
                        />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {dayLabels[day]}
                        </span>
                      </label>

                      {schedule[day].isWorking && (
                        <button
                          type="button"
                          onClick={() => addTimeSlot(day)}
                          className="inline-flex items-center gap-1.5 px-3 h-8 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add time slot
                        </button>
                      )}
                    </div>

                    {/* Day Content */}
                    {schedule[day].isWorking && (
                      <div className="p-4">
                        {errors[`${day}-slots`] && (
                          <p className="text-xs text-destructive mb-3">
                            {errors[`${day}-slots`]}
                          </p>
                        )}
                        <div className="space-y-3">
                          {schedule[day].timeSlots.map((slot, index) => (
                            <div
                              key={index}
                              className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                            >
                              {/* Branch Selection */}
                              <div className="mb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Branch location
                                  </label>
                                </div>
                                <select
                                  value={slot.branchId}
                                  onChange={(e) => updateTimeSlot(day, index, "branchId", e.target.value)}
                                  className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                >
                                  <option value="">Select branch</option>
                                  {availableBranches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                      {branch.name}
                                    </option>
                                  ))}
                                </select>
                                {errors[`${day}-slot-${index}-branch`] && (
                                  <p className="text-xs text-destructive mt-1">
                                    {errors[`${day}-slot-${index}-branch`]}
                                  </p>
                                )}
                              </div>

                              {/* Time Range */}
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                    From:
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.startTime}
                                    onChange={(e) =>
                                      updateTimeSlot(day, index, "startTime", e.target.value)
                                    }
                                    className="h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                  />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                  <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                    To:
                                  </label>
                                  <input
                                    type="time"
                                    value={slot.endTime}
                                    onChange={(e) =>
                                      updateTimeSlot(day, index, "endTime", e.target.value)
                                    }
                                    className="h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTimeSlot(day, index)}
                                  disabled={schedule[day].timeSlots.length === 1}
                                  className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {errors[`${day}-slot-${index}-time`] && (
                                <p className="text-xs text-destructive mt-1">
                                  {errors[`${day}-slot-${index}-time`]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!schedule[day].isWorking && (
                      <div className="p-4 text-center">
                        <span className="text-sm text-neutral-400 italic">Not working</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-11 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                Save schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
