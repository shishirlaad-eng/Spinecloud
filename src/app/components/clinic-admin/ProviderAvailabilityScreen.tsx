import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Save, Plus, X, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Branch {
  id: string;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isWorking: boolean;
  slots: TimeSlot[];
}

interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface BlackoutPeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface ProviderAvailabilityScreenProps {
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    branches: string[];
  };
  availableBranches: Branch[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers") => void;
  onBack: () => void;
  onSaveAvailability: (availability: any) => void;
  onLogout?: () => void;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

const DEFAULT_DAY_SCHEDULE: DaySchedule = {
  isWorking: false,
  slots: [],
};

const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: DEFAULT_DAY_SCHEDULE,
  tuesday: DEFAULT_DAY_SCHEDULE,
  wednesday: DEFAULT_DAY_SCHEDULE,
  thursday: DEFAULT_DAY_SCHEDULE,
  friday: DEFAULT_DAY_SCHEDULE,
  saturday: DEFAULT_DAY_SCHEDULE,
  sunday: DEFAULT_DAY_SCHEDULE,
};

export function ProviderAvailabilityScreen({
  provider,
  availableBranches,
  onNavigate,
  onBack,
  onSaveAvailability,
  onLogout,
}: ProviderAvailabilityScreenProps) {
  // Section 1: Weekly Working Hours
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(DEFAULT_WEEKLY_SCHEDULE);

  // Section 2: Appointment Buffers
  const [bufferBefore, setBufferBefore] = useState(5);
  const [bufferAfter, setBufferAfter] = useState(10);

  // Section 3: Blackout Dates
  const [blackoutPeriods, setBlackoutPeriods] = useState<BlackoutPeriod[]>([]);
  const [showAddBlackout, setShowAddBlackout] = useState(false);
  const [newBlackout, setNewBlackout] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Section 4: Self-Booking Rules
  const [selfBookingEnabled, setSelfBookingEnabled] = useState(false);
  const [minimumNotice, setMinimumNotice] = useState(24);
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(0);

  const handleToggleDay = (day: keyof WeeklySchedule) => {
    const currentDay = weeklySchedule[day];
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...currentDay,
        isWorking: !currentDay.isWorking,
        slots: !currentDay.isWorking && currentDay.slots.length === 0
          ? [{ startTime: "09:00", endTime: "17:00" }]
          : currentDay.slots,
      },
    });
  };

  const handleAddTimeSlot = (day: keyof WeeklySchedule) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        slots: [
          ...weeklySchedule[day].slots,
          { startTime: "09:00", endTime: "17:00" },
        ],
      },
    });
  };

  const handleRemoveTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        slots: weeklySchedule[day].slots.filter((_, i) => i !== index),
      },
    });
  };

  const handleUpdateTimeSlot = (
    day: keyof WeeklySchedule,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updatedSlots = [...weeklySchedule[day].slots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setWeeklySchedule({
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        slots: updatedSlots,
      },
    });
  };

  const handleAddBlackoutPeriod = () => {
    if (newBlackout.startDate && newBlackout.endDate) {
      setBlackoutPeriods([
        ...blackoutPeriods,
        {
          id: `blackout-${Date.now()}`,
          ...newBlackout,
        },
      ]);
      setNewBlackout({ startDate: "", endDate: "", reason: "" });
      setShowAddBlackout(false);
    }
  };

  const handleRemoveBlackoutPeriod = (id: string) => {
    setBlackoutPeriods(blackoutPeriods.filter((b) => b.id !== id));
  };

  const handleCopySchedule = (fromDay: keyof WeeklySchedule) => {
    const sourceSchedule = weeklySchedule[fromDay];
    const updatedSchedule = { ...weeklySchedule };

    DAYS_OF_WEEK.forEach(({ key }) => {
      if (key !== fromDay && updatedSchedule[key].isWorking) {
        updatedSchedule[key] = {
          ...updatedSchedule[key],
          slots: sourceSchedule.slots.map((slot) => ({ ...slot })),
        };
      }
    });

    setWeeklySchedule(updatedSchedule);
  };

  const handleSaveAvailability = () => {
    const availabilityData = {
      providerId: provider.id,
      weeklySchedule,
      bufferBefore,
      bufferAfter,
      blackoutPeriods,
      selfBookingRules: {
        enabled: selfBookingEnabled,
        minimumNoticeHours: minimumNotice,
        maxBookingsPerDay: maxBookingsPerDay || null,
      },
    };

    onSaveAvailability(availabilityData);
  };

  const hasScheduleConfigured = () => {
    return DAYS_OF_WEEK.some(({ key }) => weeklySchedule[key].isWorking);
  };

  const getNext7DaysPreview = () => {
    const today = new Date();
    const preview = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as keyof WeeklySchedule;
      const daySchedule = weeklySchedule[dayName];

      preview.push({
        date: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        isWorking: daySchedule.isWorking,
        slots: daySchedule.slots,
      });
    }

    return preview;
  };

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="providers"
      onLogout={onLogout}
    >
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to provider details</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                Provider availability & scheduling rules
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {provider.firstName} {provider.lastName} • {provider.specialty}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION 1: Weekly Working Hours */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Weekly Working Hours
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Set provider's working days and time slots
                </p>
              </div>
              <div className="p-6 space-y-4">
                {DAYS_OF_WEEK.map(({ key, label }) => {
                  const daySchedule = weeklySchedule[key];
                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={daySchedule.isWorking}
                            onChange={() => handleToggleDay(key)}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                          />
                          <span className="text-sm font-medium text-neutral-900 dark:text-white min-w-[100px]">
                            {label}
                          </span>
                        </label>
                        {daySchedule.isWorking && daySchedule.slots.length > 0 && (
                          <button
                            onClick={() => handleCopySchedule(key)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            Copy to all working days
                          </button>
                        )}
                      </div>

                      {daySchedule.isWorking && (
                        <div className="ml-7 space-y-2">
                          {daySchedule.slots.map((slot, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  handleUpdateTimeSlot(key, index, "startTime", e.target.value)
                                }
                                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                              />
                              <span className="text-neutral-400">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  handleUpdateTimeSlot(key, index, "endTime", e.target.value)
                                }
                                className="h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                              />
                              {daySchedule.slots.length > 1 && (
                                <button
                                  onClick={() => handleRemoveTimeSlot(key, index)}
                                  className="p-1 text-neutral-400 hover:text-destructive transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddTimeSlot(key)}
                            className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add time slot
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Appointment Buffers */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Appointment Buffers
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Add buffer time before and after appointments
                </p>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Buffer before (minutes)
                  </label>
                  <select
                    value={bufferBefore}
                    onChange={(e) => setBufferBefore(Number(e.target.value))}
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Buffer after (minutes)
                  </label>
                  <select
                    value={bufferAfter}
                    onChange={(e) => setBufferAfter(Number(e.target.value))}
                    className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Blackout Dates / Time Off */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                      Blackout Dates / Time Off
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Block out periods when provider is unavailable
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddBlackout(true)}
                    className="inline-flex items-center gap-1.5 px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add period
                  </button>
                </div>
              </div>
              <div className="p-6">
                {showAddBlackout && (
                  <div className="mb-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                          Start date
                        </label>
                        <input
                          type="date"
                          value={newBlackout.startDate}
                          onChange={(e) =>
                            setNewBlackout({ ...newBlackout, startDate: e.target.value })
                          }
                          className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                          End date
                        </label>
                        <input
                          type="date"
                          value={newBlackout.endDate}
                          onChange={(e) =>
                            setNewBlackout({ ...newBlackout, endDate: e.target.value })
                          }
                          className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Reason (optional)
                      </label>
                      <input
                        type="text"
                        value={newBlackout.reason}
                        onChange={(e) =>
                          setNewBlackout({ ...newBlackout, reason: e.target.value })
                        }
                        placeholder="e.g., Vacation, Conference"
                        className="w-full h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddBlackoutPeriod}
                        className="px-3 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddBlackout(false);
                          setNewBlackout({ startDate: "", endDate: "", reason: "" });
                        }}
                        className="px-3 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {blackoutPeriods.length > 0 ? (
                  <div className="space-y-2">
                    {blackoutPeriods.map((period) => (
                      <div
                        key={period.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {new Date(period.startDate).toLocaleDateString()} -{" "}
                            {new Date(period.endDate).toLocaleDateString()}
                          </p>
                          {period.reason && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {period.reason}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveBlackoutPeriod(period.id)}
                          className="p-1 text-neutral-400 hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  !showAddBlackout && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                      No blackout periods configured
                    </p>
                  )
                )}
              </div>
            </div>

            {/* SECTION 4: Patient Self-Booking Rules */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                  Patient Self-Booking Rules
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Configure restrictions for patient-facing booking
                </p>
              </div>
              <div className="p-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfBookingEnabled}
                    onChange={(e) => setSelfBookingEnabled(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white block">
                      Allow patient self-booking for this provider
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      Patients can book appointments with this provider online
                    </span>
                  </div>
                </label>

                {selfBookingEnabled && (
                  <div className="ml-7 space-y-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Minimum notice period (hours)
                      </label>
                      <select
                        value={minimumNotice}
                        onChange={(e) => setMinimumNotice(Number(e.target.value))}
                        className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                      >
                        <option value={0}>No minimum</option>
                        <option value={4}>4 hours</option>
                        <option value={12}>12 hours</option>
                        <option value={24}>24 hours (1 day)</option>
                        <option value={48}>48 hours (2 days)</option>
                        <option value={72}>72 hours (3 days)</option>
                      </select>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Patients must book at least this far in advance
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Maximum bookings per day (optional)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={maxBookingsPerDay}
                        onChange={(e) => setMaxBookingsPerDay(Number(e.target.value))}
                        placeholder="No limit"
                        className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                      />
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                        Leave empty for no limit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 5: Slot Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sticky top-6">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Schedule preview
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Next 7 days
                </p>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {hasScheduleConfigured() ? (
                  getNext7DaysPreview().map((day, index) => (
                    <div
                      key={index}
                      className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        {day.date}
                      </p>
                      {day.isWorking && day.slots.length > 0 ? (
                        <div className="space-y-1">
                          {day.slots.map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400"
                            >
                              <Clock className="w-3 h-3" />
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Not working
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Configure working hours to preview schedule
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <button
            onClick={onBack}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAvailability}
            className="inline-flex items-center gap-2 px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
          >
            <Save className="w-4 h-4" />
            Save availability
          </button>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
