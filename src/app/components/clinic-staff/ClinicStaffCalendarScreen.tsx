import { useState, useMemo } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Users, X, Plus } from "lucide-react";

interface Location {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  color: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  providerId: string;
  locationId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  service: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
}

interface ClinicStaffCalendarScreenProps {
  onNavigate: (menu: "calendar" | "patients" | "dashboard") => void;
  onViewAppointment: (appointmentId: string, patientId: string) => void;
  onBookAppointment?: () => void;
  onLogout?: () => void;
  onNavigateToNotifications?: () => void;
  unreadNotificationsCount?: number;
}

type ViewMode = "day" | "week" | "month";

// Predefined color palette for providers
const PROVIDER_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
];

export function ClinicStaffCalendarScreen({
  onNavigate,
  onViewAppointment,
  onBookAppointment,
  onLogout,
  onNavigateToNotifications,
  unreadNotificationsCount,
}: ClinicStaffCalendarScreenProps) {
  // Mock data
  const locations: Location[] = [
    { id: "loc-1", name: "Downtown Clinic" },
    { id: "loc-2", name: "Westside Branch" },
    { id: "loc-3", name: "Eastside Clinic" },
  ];

  const allProviders: Provider[] = [
    { id: "prov-1", firstName: "Michael", lastName: "Chen", specialty: "Orthopedic", color: PROVIDER_COLORS[0] },
    { id: "prov-2", firstName: "Emily", lastName: "Rodriguez", specialty: "Physical Therapy", color: PROVIDER_COLORS[1] },
    { id: "prov-3", firstName: "Sarah", lastName: "Thompson", specialty: "Sports Medicine", color: PROVIDER_COLORS[2] },
    { id: "prov-4", firstName: "David", lastName: "Kim", specialty: "Chiropractic", color: PROVIDER_COLORS[3] },
  ];

  const appointments: Appointment[] = [
    {
      id: "apt-1",
      patientName: "Sarah Johnson",
      providerId: "prov-1",
      locationId: "loc-1",
      date: "2026-01-29",
      startTime: "09:00",
      endTime: "10:00",
      service: "Initial Consultation",
      status: "Confirmed",
    },
    {
      id: "apt-2",
      patientName: "James Wilson",
      providerId: "prov-2",
      locationId: "loc-1",
      date: "2026-01-29",
      startTime: "10:30",
      endTime: "11:30",
      service: "Follow-up Visit",
      status: "Confirmed",
    },
    {
      id: "apt-3",
      patientName: "Maria Garcia",
      providerId: "prov-1",
      locationId: "loc-2",
      date: "2026-01-28",
      startTime: "14:00",
      endTime: "15:00",
      service: "Therapy Session",
      status: "Completed",
    },
  ];

  const services = ["Initial Consultation", "Follow-up Visit", "Therapy Session", "Checkup"];

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(
    allProviders.slice(0, 3).map((p) => p.id)
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Confirmed", "Completed"]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Assign colors to providers
  const providers = useMemo(() => {
    return allProviders.map((provider, index) => ({
      ...provider,
      color: provider.color || PROVIDER_COLORS[index % PROVIDER_COLORS.length],
    }));
  }, [allProviders]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const locationMatch = selectedLocationId === "all" || apt.locationId === selectedLocationId;
      const providerMatch = selectedProviderIds.includes(apt.providerId);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(apt.status);
      const serviceMatch = selectedServices.length === 0 || selectedServices.includes(apt.service);
      return locationMatch && providerMatch && statusMatch && serviceMatch;
    });
  }, [appointments, selectedLocationId, selectedProviderIds, selectedStatuses, selectedServices]);

  // Get selected providers
  const selectedProviders = useMemo(() => {
    return providers.filter((p) => selectedProviderIds.includes(p.id));
  }, [providers, selectedProviderIds]);

  // Navigation handlers
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Provider selection handlers
  const toggleProvider = (providerId: string) => {
    if (selectedProviderIds.includes(providerId)) {
      setSelectedProviderIds(selectedProviderIds.filter((id) => id !== providerId));
    } else {
      setSelectedProviderIds([...selectedProviderIds, providerId]);
    }
  };

  // Status filter handlers
  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // Service filter handlers
  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Date formatting
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

  // Get week days
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

  // Get appointments for a specific date and time
  const getAppointmentsForDateTime = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.startTime.split(":")[0]);
      return aptHour === hour;
    });
  };

  // Get provider by ID
  const getProviderById = (providerId: string) => {
    return providers.find((p) => p.id === providerId);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-primary-100 text-primary-700 dark:bg-primary-950/30 dark:text-primary-300";
      case "Completed":
        return "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-300";
      case "Pending":
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week = getWeekDays(currentDate);
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Get month calendar days
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => apt.date === dateStr);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected current date
  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Render Day View
  const renderDayView = () => {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-neutral-200 dark:border-neutral-800">
            <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-3 py-2 bg-neutral-50 dark:bg-neutral-950">
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Time</p>
            </div>
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-24 border-b border-neutral-200 dark:border-neutral-800 px-2 py-2 text-xs text-neutral-600 dark:text-neutral-400 relative"
              >
                {hour.toString().padStart(2, "0")}:00
                {/* 30-minute divider line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
              </div>
            ))}
          </div>

          {/* Single Day Column */}
          <div className="flex-1">
            <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-3 py-2 bg-neutral-50 dark:bg-neutral-950 text-center">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {weekDays[currentDate.getDay()]}, {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </p>
            </div>
            {timeSlots.map((hour) => {
              const appointments = getAppointmentsForDateTime(currentDate, hour);

              return (
                <div
                  key={hour}
                  className="h-24 border-b border-neutral-200 dark:border-neutral-800 p-1 relative"
                >
                  {/* 30-minute divider line */}
                  <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
                  {appointments.map((apt) => {
                    const provider = getProviderById(apt.providerId);
                    return (
                      <button
                        key={apt.id}
                        onClick={() => onViewAppointment(apt.id, "PT-001")}
                        className="w-full mb-1 p-2 rounded text-left border-l-2 transition-all hover:shadow-md relative z-10"
                        style={{
                          backgroundColor: provider ? `${provider.color}15` : "#f5f5f5",
                          borderLeftColor: provider?.color || "#a3a3a3",
                        }}
                      >
                        <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {apt.startTime} - {apt.endTime}
                        </p>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {apt.service}
                        </p>
                        {provider && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                            {provider.firstName} {provider.lastName}
                          </p>
                        )}
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
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const monthDays = getMonthDays(currentDate);

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
          {weekDays.map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {monthDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-32 border-r border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50" />;
            }

            const dayAppointments = getAppointmentsForDate(day);
            const isTodayDate = isToday(day);
            const isSelected = isSelectedDate(day);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-32 border-r border-b border-neutral-200 dark:border-neutral-800 p-2 ${
                  isTodayDate ? "bg-primary-50/30 dark:bg-primary-950/20" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <button
                    onClick={() => setCurrentDate(day)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isTodayDate
                        ? "bg-primary-600 text-white"
                        : isSelected
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                  {dayAppointments.length > 0 && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => {
                    const provider = getProviderById(apt.providerId);
                    return (
                      <button
                        key={apt.id}
                        onClick={() => onViewAppointment(apt.id, "PT-001")}
                        className="w-full text-left px-2 py-1 rounded text-xs transition-all hover:shadow-sm border-l-2"
                        style={{
                          backgroundColor: provider ? `${provider.color}10` : "#f5f5f5",
                          borderLeftColor: provider?.color || "#a3a3a3",
                        }}
                      >
                        <p className="font-medium text-neutral-900 dark:text-white truncate text-xs">
                          {apt.startTime}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 truncate text-xs">
                          {apt.patientName}
                        </p>
                      </button>
                    );
                  })}
                  {dayAppointments.length > 3 && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 pl-2">
                      +{dayAppointments.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Week View (simplified version matching Clinic Admin)
  const renderWeekView = () => {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-neutral-200 dark:border-neutral-800">
            <div className="h-12 border-b border-neutral-200 dark:border-neutral-800" />
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-24 border-b border-neutral-200 dark:border-neutral-800 px-2 py-2 text-xs text-neutral-600 dark:text-neutral-400 relative"
              >
                {hour.toString().padStart(2, "0")}:00
                {/* 30-minute divider line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
              </div>
            ))}
          </div>

          {/* Provider Columns */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-full">
              {selectedProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="flex-1 min-w-40 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
                >
                  {/* Provider Header */}
                  <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 px-3 py-2 bg-neutral-50 dark:bg-neutral-950">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: provider.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {provider.firstName} {provider.lastName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {provider.specialty}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  {timeSlots.map((hour) => {
                    const appointments = getAppointmentsForDateTime(currentDate, hour).filter(
                      (apt) => apt.providerId === provider.id
                    );

                    return (
                      <div
                        key={hour}
                        className="h-24 border-b border-neutral-200 dark:border-neutral-800 p-1 relative"
                      >
                        {/* 30-minute divider line */}
                        <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
                        {appointments.map((apt) => (
                          <button
                            key={apt.id}
                            onClick={() => onViewAppointment(apt.id, "PT-001")}
                            className="w-full mb-1 p-2 rounded text-left border-l-2 transition-all hover:shadow-md relative z-10"
                            style={{
                              backgroundColor: `${provider.color}15`,
                              borderLeftColor: provider.color,
                            }}
                          >
                            <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
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
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}

              {selectedProviders.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-20">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Select providers to view their schedules
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClinicStaffLayout activeMenu="calendar" onNavigate={onNavigate} onLogout={onLogout} onNavigateToNotifications={onNavigateToNotifications} unreadNotificationsCount={unreadNotificationsCount}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Calendar</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              View and manage appointments across all providers and locations
            </p>
          </div>
          {onBookAppointment && (
            <button
              onClick={onBookAppointment}
              className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Book appointment
            </button>
          )}
        </div>

        {/* Filters - Compact Design matching Clinic Admin */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
          {/* Dropdowns Row */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Location Dropdown */}
            <div>
              <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">Location</label>
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="all">All Locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>

            {/* Provider Dropdown */}
            <div>
              <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">Providers</label>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedProviderIds.includes(value)) {
                    setSelectedProviderIds([...selectedProviderIds, value]);
                  }
                  e.target.value = "";
                }}
                className="h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="">Select provider</option>
                {providers.filter(p => !selectedProviderIds.includes(p.id)).map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.firstName} {provider.lastName}</option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">Status</label>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedStatuses.includes(value)) {
                    setSelectedStatuses([...selectedStatuses, value]);
                  }
                  e.target.value = "";
                }}
                className="h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="">Select status</option>
                {["Confirmed", "Cancelled", "Completed"].filter(s => !selectedStatuses.includes(s)).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Service Dropdown */}
            <div>
              <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block">Service</label>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value && !selectedServices.includes(value)) {
                    setSelectedServices([...selectedServices, value]);
                  }
                  e.target.value = "";
                }}
                className="h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
              >
                <option value="">Select service</option>
                {services.filter(s => !selectedServices.includes(s)).map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Chips */}
          {(selectedProviderIds.length > 0 || selectedStatuses.length > 0 || selectedServices.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              {/* Provider Chips */}
              {selectedProviderIds.map((providerId) => {
                const provider = providers.find(p => p.id === providerId);
                if (!provider) return null;
                return (
                  <button
                    key={providerId}
                    onClick={() => toggleProvider(providerId)}
                    className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
                    <span>{provider.firstName} {provider.lastName}</span>
                    <X className="w-3 h-3" />
                  </button>
                );
              })}

              {/* Status Chips */}
              {selectedStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={`inline-flex items-center gap-1.5 h-7 px-2 rounded-md text-sm font-medium ${getStatusColor(status as any)}`}
                >
                  <span>{status}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}

              {/* Service Chips */}
              {selectedServices.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className="inline-flex items-center gap-1.5 h-7 px-2 rounded-md bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors"
                >
                  <span>{service}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Calendar Controls */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Date Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateDate("prev")}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white min-w-48 text-center">
                {viewMode === "month" ? formatMonthYear(currentDate) : formatDate(currentDate)}
              </h3>
              <button
                onClick={() => navigateDate("next")}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("day")}
                  className={`h-9 px-3 rounded text-sm font-medium transition-colors ${
                    viewMode === "day"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`h-9 px-3 rounded text-sm font-medium transition-colors ${
                    viewMode === "week"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode("month")}
                  className={`h-9 px-3 rounded text-sm font-medium transition-colors ${
                    viewMode === "month"
                      ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
      </div>
    </ClinicStaffLayout>
  );
}