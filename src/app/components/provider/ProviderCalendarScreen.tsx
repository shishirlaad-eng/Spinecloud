import { useState, useMemo } from "react";
import { ProviderLayout } from "./layout/ProviderLayout";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, X, ChevronDown, List } from "lucide-react";
import { AppointmentOverflowPopup } from "../clinic-admin/AppointmentOverflowPopup";
import { AppointmentDetailDrawer, AppointmentStatus } from "../shared/AppointmentDetailDrawer";
import { Pagination } from "../shared/Pagination";

interface Location {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  locationId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  service: string;
  status: AppointmentStatus;
  notes?: string;
}

interface ProviderCalendarScreenProps {
  locations: Location[];
  appointments: Appointment[];
  services: any[];
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onViewAppointment?: (appointmentId: string) => void;
  onLogout?: () => void;
}

type ViewMode = "day" | "week" | "month";

// Provider color for appointments (single provider view)
const PROVIDER_COLOR = "#3B82F6"; // Primary blue

export function ProviderCalendarScreen({
  locations,
  appointments,
  services,
  onNavigate,
  onViewAppointment,
  onLogout,
}: ProviderCalendarScreenProps) {
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const FILTER_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [hoveredOverflow, setHoveredOverflow] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  const locationColorMap = useMemo(() => {
     let map: Record<string, string> = {};
     selectedLocationIds.forEach((id, idx) => {
       map[id] = FILTER_COLORS[idx % FILTER_COLORS.length];
     });
     return map;
  }, [selectedLocationIds]);

  const serviceColorMap = useMemo(() => {
     let map: Record<string, string> = {};
     selectedServices.forEach((serv, idx) => {
       map[serv] = FILTER_COLORS[(idx + selectedLocationIds.length) % FILTER_COLORS.length];
     });
     return map;
  }, [selectedServices, selectedLocationIds.length]);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const locationMatch = selectedLocationIds.length === 0 || selectedLocationIds.includes(apt.locationId);
      const serviceMatch = selectedServices.length === 0 || selectedServices.includes(apt.service);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(apt.status);
      return locationMatch && serviceMatch && statusMatch;
    });
  }, [appointments, selectedLocationIds, selectedServices, selectedStatuses]);

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

  // Get days in month
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

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => apt.date === dateStr);
  };

  const getAppointmentsForDateTime = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => {
      if (apt.date !== dateStr) return false;
      const aptHour = parseInt(apt.startTime.split(":")[0]);
      return aptHour === hour;
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Cancelled":
        return "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400";
      case "Completed":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";
    }
  };

  const getAppointmentColor = (apt: Appointment) => {
    if (selectedLocationIds.length > 0 && locationColorMap[apt.locationId]) {
      return locationColorMap[apt.locationId];
    }
    if (selectedServices.length > 0 && serviceColorMap[apt.service]) {
      return serviceColorMap[apt.service];
    }
    return PROVIDER_COLOR;
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

  const formatWeekRange = (date: Date) => {
    const week = getWeekDays(date);
    const start = week[0];
    const end = week[6];
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  // Time slots for day/week view (8 AM to 8 PM)
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8);

  // Render Day View
  const renderDayView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {weekDays[currentDate.getDay()]}, {formatDate(currentDate)}
            </h3>
          </div>
        </div>

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

          {/* Appointment Column */}
          <div className="flex-1">
            <div className="h-12 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950" />

            {/* Time Slots */}
            {timeSlots.map((hour) => {
              const hourAppointments = getAppointmentsForDateTime(currentDate, hour);

              return (
                <div
                  key={hour}
                  className="h-24 border-b border-neutral-200 dark:border-neutral-800 p-1 relative"
                >
                  {/* 30-minute divider line */}
                  <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
                  {hourAppointments.map((apt) => {
                    const aptColor = getAppointmentColor(apt);
                    return (
                      <button
                        key={apt.id}
                        onClick={() => onViewAppointment?.(apt.id)}
                        className="w-full mb-1 p-2 rounded text-left border-l-2 transition-all hover:shadow-md cursor-pointer"
                        style={{
                          backgroundColor: `${aptColor}15`,
                          borderLeftColor: aptColor,
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
        </div>
      </div>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const week = getWeekDays(currentDate);

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
            <div className="h-16 border-b border-neutral-200 dark:border-neutral-800" />
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-neutral-200 dark:border-neutral-800 px-2 py-2 text-xs text-neutral-600 dark:text-neutral-400 relative"
              >
                {hour.toString().padStart(2, "0")}:00
                {/* 30-minute divider line */}
                <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Day Columns */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex min-w-full">
              {week.map((day, dayIndex) => {
                const isToday = day.toDateString() === new Date().toDateString();
                const dayAppointments = getAppointmentsForDate(day);

                return (
                  <div
                    key={dayIndex}
                    className="flex-1 min-w-32 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
                  >
                    {/* Day Header */}
                    <div
                      className={`h-16 border-b border-neutral-200 dark:border-neutral-800 px-2 py-2 ${
                        isToday ? "bg-primary-50 dark:bg-primary-950/30" : "bg-neutral-50 dark:bg-neutral-950"
                      }`}
                    >
                      <div className="text-center">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {weekDays[day.getDay()]}
                        </p>
                        <p
                          className={`text-lg font-semibold mt-1 ${
                            isToday
                              ? "text-primary-600 dark:text-primary-400"
                              : "text-neutral-900 dark:text-white"
                          }`}
                        >
                          {day.getDate()}
                        </p>
                      </div>
                    </div>

                    {/* Time Slots */}
                    {timeSlots.map((hour) => {
                      const hourAppointments = getAppointmentsForDateTime(day, hour);

                      return (
                        <div
                          key={hour}
                          className="h-20 border-b border-neutral-200 dark:border-neutral-800 p-1 relative"
                        >
                          {/* 30-minute divider line */}
                          <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none" />
                          <div className="space-y-1">
                            {hourAppointments.slice(0, 2).map((apt) => {
                              // Calculate appointment duration in minutes
                              const [startHour, startMin] = apt.startTime.split(':').map(Number);
                              const [endHour, endMin] = apt.endTime.split(':').map(Number);
                              const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                              const is30MinAppt = durationMinutes <= 30;
                              const aptColor = getAppointmentColor(apt);

                              return (
                                <button
                                  key={apt.id}
                                  onClick={() => onViewAppointment?.(apt.id)}
                                  className="w-full p-1.5 rounded text-left border-l-2 transition-all hover:shadow-md text-xs cursor-pointer"
                                  style={{
                                    backgroundColor: `${aptColor}15`,
                                    borderLeftColor: aptColor,
                                  }}
                                >
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <div
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: aptColor }}
                                    />
                                    <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                                      {apt.startTime}
                                    </p>
                                  </div>
                                  <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                                    {apt.patientName}
                                  </p>
                                  {!is30MinAppt && (
                                    <>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                        {apt.service}
                                      </p>
                                      <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs mt-0.5 ${getStatusColor(apt.status)}`}>
                                        {apt.status}
                                      </span>
                                    </>
                                  )}
                                </button>
                              );
                            })}
                            {hourAppointments.length > 2 && (
                              <div 
                                className="relative"
                                onMouseEnter={() => setHoveredOverflow(`week-${dayIndex}-${hour}`)}
                                onMouseLeave={() => setHoveredOverflow(null)}
                              >
                                <button className="w-full text-xs text-neutral-500 dark:text-neutral-400 text-center py-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
                                  +{hourAppointments.length - 2} more
                                </button>
                                {hoveredOverflow === `week-${dayIndex}-${hour}` && (
                                  <AppointmentOverflowPopup
                                    appointments={hourAppointments.slice(2)}
                                    getStatusColor={getStatusColor}
                                    onViewAppointment={(id) => onViewAppointment?.(id)}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Month View
  const renderMonthView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = getDaysInMonth(currentDate);

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-32 p-2 bg-neutral-50 dark:bg-neutral-950 border-r border-b border-neutral-200 dark:border-neutral-800"
                />
              );
            }

            const isToday = day.toDateString() === new Date().toDateString();
            const dayAppointments = getAppointmentsForDate(day);

            return (
              <div
                key={index}
                className={`min-h-32 p-2 border-r border-b border-neutral-200 dark:border-neutral-800 relative ${
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
                  {dayAppointments.slice(0, 2).map((apt) => {
                    const aptColor = getAppointmentColor(apt);
                    return (
                      <button
                        key={apt.id}
                        onClick={() => onViewAppointment?.(apt.id)}
                        className="w-full p-1.5 rounded text-left border-l-2 transition-all hover:shadow-sm"
                        style={{
                          backgroundColor: `${aptColor}15`,
                          borderLeftColor: aptColor,
                        }}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: aptColor }}
                          />
                          <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                            {apt.startTime}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 truncate">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          {apt.service}
                        </p>
                        <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </button>
                    );
                  })}

                  {dayAppointments.length > 2 && (
                    <div 
                      className="relative"
                      onMouseEnter={() => setHoveredOverflow(`month-${index}`)}
                      onMouseLeave={() => setHoveredOverflow(null)}
                    >
                      <button className="w-full text-xs text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors py-0.5">
                        +{dayAppointments.length - 2} more
                      </button>
                       {hoveredOverflow === `month-${index}` && (
                         <AppointmentOverflowPopup
                           appointments={dayAppointments.slice(2)}
                           getStatusColor={getStatusColor}
                           onViewAppointment={(id) => onViewAppointment?.(id)}
                         />
                       )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render List View
  const renderListView = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);

    if (currentItems.length === 0) {
      return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
          <List className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
            No appointments found
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Date & Time</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Patient</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Location</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Service</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {currentItems.map((apt) => {
                const loc = locations.find(l => l.id === apt.locationId);
                return (
                  <tr key={apt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{apt.date}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{apt.startTime} - {apt.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onViewAppointment?.(apt.id)}
                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline text-left transition-colors"
                      >
                        {apt.patientName}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{loc?.name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{apt.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          totalItems={filteredAppointments.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAppointments.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    );
  };

  return (
    <ProviderLayout activeMenu="calendar" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Appointments</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              View and manage your appointments
            </p>
          </div>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setViewType("calendar")}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewType === "calendar"
                  ? "bg-white dark:bg-neutral-700 shadow text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewType === "list"
                  ? "bg-white dark:bg-neutral-700 shadow text-neutral-900 dark:text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Filters Row */}
          <div className="flex flex-wrap gap-3">
            {/* Location Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLocationDropdown(!showLocationDropdown);
                  setShowServiceDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
              >
                Location
                <ChevronDown className="w-4 h-4" />
              </button>

              {showLocationDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowLocationDropdown(false)}
                  />
                  <div className="absolute left-0 top-12 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedLocationIds([]);
                          setShowLocationDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedLocationIds.length === 0
                            ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-medium"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        All locations
                      </button>
                      {locations.map((location) => {
                         const isSelected = selectedLocationIds.includes(location.id);
                         return (
                           <button
                             key={location.id}
                             onClick={() => {
                               if (isSelected) {
                                  setSelectedLocationIds(prev => prev.filter(id => id !== location.id));
                               } else {
                                  setSelectedLocationIds(prev => [...prev, location.id]);
                               }
                             }}
                             className="w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                           >
                             <div className="flex items-center gap-2">
                               {isSelected && (
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: locationColorMap[location.id] || '#3B82F6' }}></div>
                               )}
                               <span className={isSelected ? "font-medium" : ""}>{location.name}</span>
                             </div>
                             {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                           </button>
                         );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Service Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowServiceDropdown(!showServiceDropdown);
                  setShowLocationDropdown(false);
                  setShowStatusDropdown(false);
                }}
                className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
              >
                Service
                <ChevronDown className="w-4 h-4" />
              </button>

              {showServiceDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowServiceDropdown(false)}
                  />
                  <div className="absolute left-0 top-12 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedServices([]);
                          setShowServiceDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedServices.length === 0
                            ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-medium"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        All services
                      </button>
                      {services.map((service: any) => {
                         const svcName = service.name || service;
                         const isSelected = selectedServices.includes(svcName);
                         return (
                           <button
                             key={svcName}
                             onClick={() => {
                               if (isSelected) {
                                  setSelectedServices(prev => prev.filter(s => s !== svcName));
                               } else {
                                  setSelectedServices(prev => [...prev, svcName]);
                               }
                             }}
                             className="w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                           >
                              <div className="flex items-center gap-2">
                               {isSelected && (
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: serviceColorMap[svcName] || '#10B981' }}></div>
                               )}
                               <span className={isSelected ? "font-medium" : ""}>{svcName}</span>
                             </div>
                             {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                           </button>
                         )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown(!showStatusDropdown);
                  setShowLocationDropdown(false);
                  setShowServiceDropdown(false);
                }}
                className="inline-flex items-center gap-2 h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
              >
                Status
                <ChevronDown className="w-4 h-4" />
              </button>

              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="absolute left-0 top-12 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-20">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedStatuses([]);
                          setShowStatusDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedStatuses.length === 0
                            ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 font-medium"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        All statuses
                      </button>
                      {["Confirmed", "Completed", "Cancelled"].map((status) => {
                         const isSelected = selectedStatuses.includes(status);
                         return (
                           <button
                             key={status}
                             onClick={() => {
                               if (isSelected) {
                                  setSelectedStatuses(prev => prev.filter(s => s !== status));
                               } else {
                                  setSelectedStatuses(prev => [...prev, status]);
                               }
                             }}
                             className="w-full flex items-center justify-between text-left px-3 py-2 text-sm rounded-lg transition-colors text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                           >
                             <span className={isSelected ? "font-medium" : ""}>{status}</span>
                             {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                           </button>
                         )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* View Mode Buttons - Moved to right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 h-9 rounded-lg font-medium transition-colors text-sm ${
                viewMode === "day"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 h-9 rounded-lg font-medium transition-colors text-sm ${
                viewMode === "week"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 h-9 rounded-lg font-medium transition-colors text-sm ${
                viewMode === "month"
                  ? "bg-primary-600 text-white"
                  : "bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Active Filters Chips */}
        {(selectedLocationId || selectedService || selectedStatus) && (
          <div className="flex flex-wrap gap-2">
            {selectedLocationId && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {locations.find((l) => l.id === selectedLocationId)?.name}
                <button
                  onClick={() => setSelectedLocationId(null)}
                  className="hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
             {selectedService && (
               <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                 {selectedService}
                 <button
                   onClick={() => setSelectedService(null)}
                   className="hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-full p-0.5 transition-colors"
                 >
                   <X className="w-3.5 h-3.5" />
                 </button>
               </div>
             )}
            {selectedStatus && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                {selectedStatus}
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Calendar Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white min-w-[280px] text-center">
              {viewMode === "day" && formatDate(currentDate)}
              {viewMode === "week" && formatWeekRange(currentDate)}
              {viewMode === "month" && formatMonthYear(currentDate)}
            </h2>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-4 h-9 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>

        {/* Calendar View */}
        {viewType === "calendar" && (
          <>
            {viewMode === "day" && renderDayView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "month" && renderMonthView()}
          </>
        )}
        
        {/* List View */}
        {viewType === "list" && renderListView()}
      </div>

      {/* Appointment Detail Drawer */}
      {showDetailDrawer && selectedAppointment && (
        <AppointmentDetailDrawer
          appointment={{
            ...selectedAppointment,
            providerName: 'Provider', // In provider portal, it's the current provider
            startTime: selectedAppointment.startTime,
            endTime: selectedAppointment.endTime,
          }}
          userRole="provider"
          onClose={() => setShowDetailDrawer(false)}
          onCancel={(id) => {
            console.log("Cancel", id);
          }}
          onReschedule={(id) => {
            console.log("Reschedule", id);
          }}
          onMarkNoShow={(id) => {
            console.log("No-Show", id);
          }}
          onNavigateToPatient={(patientId) => {
            onNavigate("patients");
          }}
        />
      )}
    </ProviderLayout>
  );
}