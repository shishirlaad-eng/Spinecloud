import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, User, Calendar as CalendarIcon, Clock, Save, ChevronLeft, ChevronRight, Plus, Trash2, MapPin, Coffee, Plane } from "lucide-react";

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

interface BreakPeriod {
  id: string;
  startDate: string;
  endDate: string;
  type: "Break" | "On Leave";
  reason: string;
  createdAt: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  specialty: string;
  branches: string[];
  status: "Active" | "Inactive";
  schedule: Schedule;
  breakPeriods?: BreakPeriod[];
  selfBookable?: boolean;
}

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

interface ProviderDetailsScreenProps {
  provider: Provider;
  appointments: Appointment[];
  availableBranches: Branch[];
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers") => void;
  onBack: () => void;
  onUpdateProvider: (provider: Provider) => void;
  onSaveSchedule: (providerId: string, schedule: Schedule) => void;
  onLogout?: () => void;
}

type Tab = "basic" | "calendar" | "schedule";

const defaultTimeSlot = (branchId: string): TimeSlot => ({
  startTime: "09:00",
  endTime: "12:00",
  branchId: branchId || "",
});

const defaultDaySchedule: DaySchedule = {
  isWorking: false,
  timeSlots: [],
};

export function ProviderDetailsScreen({
  provider,
  appointments,
  availableBranches,
  onNavigate,
  onBack,
  onUpdateProvider,
  onSaveSchedule,
  onLogout,
}: ProviderDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  
  // Basic info state
  const [firstName, setFirstName] = useState(provider.firstName);
  const [lastName, setLastName] = useState(provider.lastName);
  const [email, setEmail] = useState(provider.email);
  const [specialty, setSpecialty] = useState(provider.specialty);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(provider.branches);
  const [status, setStatus] = useState(provider.status);
  const [selfBookable, setSelfBookable] = useState(provider.selfBookable ?? false);
  const [basicInfoErrors, setBasicInfoErrors] = useState<Record<string, string>>({});
  
  // Breaks/On-Leave state
  const [breakPeriods, setBreakPeriods] = useState<BreakPeriod[]>(provider.breakPeriods || []);
  const [showAddBreak, setShowAddBreak] = useState(false);
  const [newBreak, setNewBreak] = useState({
    startDate: "",
    endDate: "",
    type: "Break" as "Break" | "On Leave",
    reason: "",
  });
  
  // Schedule state
  const [schedule, setSchedule] = useState<Schedule>(() => {
    const days: (keyof Schedule)[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const initialSchedule = {} as Schedule;
    
    days.forEach(day => {
      const providerDay = provider.schedule?.[day];
      if (providerDay && 'timeSlots' in providerDay && Array.isArray(providerDay.timeSlots)) {
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
        initialSchedule[day] = defaultDaySchedule;
      }
    });
    
    return initialSchedule;
  });
  
  // Calendar state
  const [view, setView] = useState<"week" | "day" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Break period handlers
  const handleAddBreakPeriod = () => {
    if (!newBreak.startDate || !newBreak.endDate) return;

    const newBreakPeriod: BreakPeriod = {
      id: `break-${Date.now()}`,
      startDate: newBreak.startDate,
      endDate: newBreak.endDate,
      type: newBreak.type,
      reason: newBreak.reason,
      createdAt: new Date().toISOString(),
    };

    setBreakPeriods([...breakPeriods, newBreakPeriod]);
    setNewBreak({ startDate: "", endDate: "", type: "Break", reason: "" });
    setShowAddBreak(false);
  };

  const handleRemoveBreakPeriod = (id: string) => {
    setBreakPeriods(breakPeriods.filter((bp) => bp.id !== id));
  };

  const getDaysCount = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const validateBasicInfo = () => {
    const errors: Record<string, string> = {};
    
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }
    
    if (!specialty.trim()) {
      errors.specialty = "Specialty is required";
    }
    
    if (selectedBranches.length === 0) {
      errors.branches = "Select at least one branch";
    }
    
    setBasicInfoErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveBasicInfo = () => {
    if (!validateBasicInfo()) {
      return;
    }
    
    const updatedProvider: Provider = {
      ...provider,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      specialty: specialty.trim(),
      branches: selectedBranches,
      status,
      selfBookable,
    };
    
    onUpdateProvider(updatedProvider);
  };

  const handleToggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter(id => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  // Schedule functions
  const handleToggleDay = (day: keyof Schedule) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        isWorking: !schedule[day].isWorking,
      },
    });
  };

  const handleAddTimeSlot = (day: keyof Schedule) => {
    const defaultBranchId = availableBranches[0]?.id || "";
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: [...schedule[day].timeSlots, defaultTimeSlot(defaultBranchId)],
      },
    });
  };

  const handleRemoveTimeSlot = (day: keyof Schedule, index: number) => {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  const handleUpdateTimeSlot = (
    day: keyof Schedule,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const newSlots = [...schedule[day].timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: newSlots,
      },
    });
  };

  const handleSaveSchedule = () => {
    onSaveSchedule(provider.id, schedule);
  };

  // Calendar functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const getAppointmentsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getFullYear() === year && aptDate.getMonth() === month;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                First name <span className="text-destructive">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="Enter first name"
              />
              {basicInfoErrors.firstName && (
                <p className="text-xs text-destructive mt-1">{basicInfoErrors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Last name <span className="text-destructive">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="Enter last name"
              />
              {basicInfoErrors.lastName && (
                <p className="text-xs text-destructive mt-1">{basicInfoErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Specialty and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="specialty" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Specialty <span className="text-destructive">*</span>
              </label>
              <select
                id="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              >
                <option value="">Select specialty</option>
                <option value="Chiropractor">Chiropractor</option>
                <option value="Physical Therapist">Physical Therapist</option>
                <option value="Spine Surgeon">Spine Surgeon</option>
                <option value="Pain Management Specialist">Pain Management Specialist</option>
                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                <option value="Sports Medicine">Sports Medicine</option>
                <option value="Other">Other</option>
              </select>
              {basicInfoErrors.specialty && (
                <p className="text-xs text-destructive mt-1">{basicInfoErrors.specialty}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                placeholder="email@example.com"
              />
              {basicInfoErrors.email && (
                <p className="text-xs text-destructive mt-1">{basicInfoErrors.email}</p>
              )}
            </div>
          </div>

          {/* Branches */}
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Branches <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableBranches.map((branch) => (
                <label
                  key={branch.id}
                  className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => handleToggleBranch(branch.id)}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-900 dark:text-white">{branch.name}</span>
                </label>
              ))}
            </div>
            {basicInfoErrors.branches && (
              <p className="text-xs text-destructive mt-1">{basicInfoErrors.branches}</p>
            )}
          </div>

          {/* Status and Self-Bookable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Status <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Active"}
                    onChange={() => setStatus("Active")}
                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-900 dark:text-white">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === "Inactive"}
                    onChange={() => setStatus("Inactive")}
                    className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-900 dark:text-white">Inactive</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Self-bookable
              </label>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg h-10">
                <span className="text-sm text-neutral-900 dark:text-white">Allow patients to book online</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfBookable}
                    onChange={(e) => setSelfBookable(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleSaveBasicInfo}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = Array.from({ length: 12 }, (_, i) => {
      const hour = i + 8;
      return `${hour.toString().padStart(2, "0")}:00`;
    });

    return (
      <div className="space-y-6">
        {/* Calendar Controls */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateDate("prev")}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white min-w-48 text-center">
                {view === "month" ? formatMonthYear(currentDate) : formatDate(currentDate)}
              </h3>
              <button
                onClick={() => navigateDate("next")}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={goToToday}
                className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
              >
                Today
              </button>
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setView("day")}
                  className={`h-8 px-3 rounded text-sm font-medium transition-colors ${
                    view === "day"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView("week")}
                  className={`h-8 px-3 rounded text-sm font-medium transition-colors ${
                    view === "week"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView("month")}
                  className={`h-8 px-3 rounded text-sm font-medium transition-colors ${
                    view === "month"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          {view === "week" && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-8 bg-neutral-50 dark:bg-neutral-950">
                <div className="p-3 border-r border-neutral-200 dark:border-neutral-800" />
                {getWeekDays(currentDate).map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={index}
                      className={`p-3 text-center border-r border-neutral-200 dark:border-neutral-800 last:border-r-0 ${
                        isToday ? "bg-primary-50 dark:bg-primary-950/30" : ""
                      }`}
                    >
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        {weekDays[day.getDay()]}
                      </div>
                      <div
                        className={`text-sm font-semibold mt-1 ${
                          isToday
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 min-h-16">
                    <div className="p-3 border-r border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                      {time}
                    </div>
                    {getWeekDays(currentDate).map((day, dayIndex) => {
                      const dayAppointments = getAppointmentsForDate(day);
                      const timeAppointments = dayAppointments.filter((apt) =>
                        apt.time.startsWith(time.substring(0, 2))
                      );
                      return (
                        <div
                          key={dayIndex}
                          className="p-2 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
                        >
                          {timeAppointments.map((apt) => (
                            <div
                              key={apt.id}
                              className={`p-2 rounded text-xs mb-1 border-l-2 ${
                                apt.status === "Confirmed"
                                  ? "bg-success-50 dark:bg-success-950/30 border-success-600 dark:border-success-400"
                                  : apt.status === "Pending"
                                  ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600"
                                  : apt.status === "Cancelled"
                                  ? "bg-destructive/10 dark:bg-destructive/20 border-destructive"
                                  : "bg-primary-50 dark:bg-primary-950/30 border-primary-600 dark:border-primary-400"
                              }`}
                            >
                              <div className="font-medium text-neutral-900 dark:text-white truncate">
                                {apt.patientName}
                              </div>
                              <div className="text-neutral-600 dark:text-neutral-400 truncate">
                                {apt.service}
                              </div>
                              <div className="mt-1">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                    apt.status === "Confirmed"
                                      ? "bg-success-100 dark:bg-success-950/50 text-success-700 dark:text-success-300"
                                      : apt.status === "Pending"
                                      ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                                      : apt.status === "Cancelled"
                                      ? "bg-destructive/20 dark:bg-destructive/30 text-destructive"
                                      : "bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300"
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "day" && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatDate(currentDate)}
                </div>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {timeSlots.map((time) => {
                  const dayAppointments = getAppointmentsForDate(currentDate);
                  const timeAppointments = dayAppointments.filter((apt) =>
                    apt.time.startsWith(time.substring(0, 2))
                  );
                  return (
                    <div key={time} className="flex min-h-16">
                      <div className="w-20 p-3 border-r border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                        {time}
                      </div>
                      <div className="flex-1 p-3">
                        {timeAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-3 border-l-2 rounded mb-2 ${
                              apt.status === "Confirmed"
                                ? "bg-success-50 dark:bg-success-950/30 border-success-600 dark:border-success-400"
                                : apt.status === "Pending"
                                ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600"
                                : apt.status === "Cancelled"
                                ? "bg-destructive/10 dark:bg-destructive/20 border-destructive"
                                : "bg-primary-50 dark:bg-primary-950/30 border-primary-600 dark:border-primary-400"
                            }`}
                          >
                            <div className="font-medium text-sm text-neutral-900 dark:text-white">
                              {apt.patientName}
                            </div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                              {apt.time} • {apt.service}
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  apt.status === "Confirmed"
                                    ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                                    : apt.status === "Pending"
                                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                    : apt.status === "Cancelled"
                                    ? "bg-destructive/10 dark:bg-destructive/20 text-destructive"
                                    : "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === "month" && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-neutral-50 dark:bg-neutral-950">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {getDaysInMonth(currentDate).map((day, index) => {
                  if (!day) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-24 p-2 bg-neutral-50 dark:bg-neutral-950 border-r border-b border-neutral-200 dark:border-neutral-800"
                      />
                    );
                  }
                  const isToday = day.toDateString() === new Date().toDateString();
                  const dayAppointments = getAppointmentsForDate(day);
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border-r border-b border-neutral-200 dark:border-neutral-800 ${
                        isToday ? "bg-primary-50 dark:bg-primary-950/30" : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-2 ${
                          isToday
                            ? "text-primary-600 dark:text-primary-400"
                            : "text-neutral-900 dark:text-white"
                        }`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-1 rounded truncate border-l-2 ${
                              apt.status === "Confirmed"
                                ? "bg-success-50 dark:bg-success-950/30 border-success-600 dark:border-success-400"
                                : apt.status === "Pending"
                                ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600"
                                : apt.status === "Cancelled"
                                ? "bg-destructive/10 dark:bg-destructive/20 border-destructive"
                                : "bg-primary-100 dark:bg-primary-950/50 border-primary-600 dark:border-primary-400"
                            }`}
                          >
                            <div className="font-medium text-neutral-900 dark:text-white truncate">
                              {apt.time}
                            </div>
                            <div className="text-neutral-600 dark:text-neutral-400 truncate">
                              {apt.patientName}
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            +{dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSchedule = () => {
    const days: { key: keyof Schedule; label: string }[] = [
      { key: "monday", label: "Monday" },
      { key: "tuesday", label: "Tuesday" },
      { key: "wednesday", label: "Wednesday" },
      { key: "thursday", label: "Thursday" },
      { key: "friday", label: "Friday" },
      { key: "saturday", label: "Saturday" },
      { key: "sunday", label: "Sunday" },
    ];

    return (
      <div className="space-y-6">
        {days.map((day) => (
          <div
            key={day.key}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule[day.key].isWorking}
                    onChange={() => handleToggleDay(day.key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {day.label}
                </h3>
              </div>
              {schedule[day.key].isWorking && (
                <button
                  onClick={() => handleAddTimeSlot(day.key)}
                  className="h-9 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add time slot
                </button>
              )}
            </div>

            {schedule[day.key].isWorking && (
              <div className="space-y-3">
                {schedule[day.key].timeSlots.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                    No time slots added. Click "Add time slot" to create one.
                  </p>
                ) : (
                  schedule[day.key].timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-950"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1.5">
                            Start time
                          </label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleUpdateTimeSlot(day.key, index, "startTime", e.target.value)
                            }
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1.5">
                            End time
                          </label>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleUpdateTimeSlot(day.key, index, "endTime", e.target.value)
                            }
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-600 dark:text-neutral-400 block mb-1.5">
                            Branch
                          </label>
                          <select
                            value={slot.branchId}
                            onChange={(e) =>
                              handleUpdateTimeSlot(day.key, index, "branchId", e.target.value)
                            }
                            className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
                          >
                            <option value="">Select branch</option>
                            {availableBranches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTimeSlot(day.key, index)}
                        className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSchedule}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save schedule
          </button>
        </div>
      </div>
    );
  };

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="providers"
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to providers</span>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              {provider.firstName} {provider.lastName}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {provider.specialty} • {provider.role}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-800">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("basic")}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Basic information</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === "calendar"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Calendar</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`pb-4 border-b-2 transition-colors ${
                activeTab === "schedule"
                  ? "border-primary-600 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Schedule</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "basic" && renderBasicInfo()}
        {activeTab === "calendar" && renderCalendar()}
        {activeTab === "schedule" && renderSchedule()}
      </div>
    </ClinicAdminLayout>
  );
}