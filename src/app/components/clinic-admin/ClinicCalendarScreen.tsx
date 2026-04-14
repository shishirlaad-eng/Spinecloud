import { useState, useMemo } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Users, X, Plus, Filter, List } from "lucide-react";
import { AppointmentOverflowPopup } from "./AppointmentOverflowPopup";
import { BookAppointmentDrawer } from "./BookAppointmentDrawer";
import { Pagination } from "../shared/Pagination";
import { AppointmentDetailDrawer, AppointmentStatus, AppointmentDetail } from "../shared/AppointmentDetailDrawer";

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
  workingHours?: {
    [key: string]: { start: string; end: string }[]; // day: [{start: "09:00", end: "17:00"}]
  };
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

interface ClinicCalendarScreenProps {
  locations: Location[];
  providers: Provider[];
  appointments: Appointment[];
  patients?: any[]; // Add patients for booking drawer
  services: any[];
  rooms?: any[]; // Add rooms for booking drawer
  onNavigate: (menu: string) => void;
  onViewAppointment?: (appointmentId: string) => void;
  onCreateAppointment?: (date: string, time: string, providerId: string, locationId: string) => void;
  onRescheduleAppointment?: (appointmentId: string, newDate: string, newTime: string, newProviderId: string) => void;
  onBookAppointment?: (appointment: {
    patientId: string;
    serviceId: string;
    date: string;
    time: string;
    roomId: string;
    providerId: string;
  }) => void;
  onLogout?: () => void;
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
  "#6366F1", // Indigo
  "#84CC16", // Lime
];

export function ClinicCalendarScreen({
  locations,
  providers: allProviders,
  appointments,
  patients,
  services,
  rooms,
  onNavigate,
  onViewAppointment,
  onCreateAppointment,
  onRescheduleAppointment,
  onBookAppointment,
  onLogout,
}: ClinicCalendarScreenProps) {
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all");
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(
    allProviders.slice(0, 3).map((p) => p.id)
  );
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["Confirmed", "Completed"]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [hoveredOverflow, setHoveredOverflow] = useState<string | null>(null); // Track which overflow is being hovered
  const [showBookDrawer, setShowBookDrawer] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

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
  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (date: Date, hour: number, providerId: string) => {
    if (draggedAppointment && onRescheduleAppointment) {
      const newDate = date.toISOString().split("T")[0];
      const newTime = `${hour.toString().padStart(2, "0")}:00`;
      onRescheduleAppointment(draggedAppointment.id, newDate, newTime, providerId);
      setDraggedAppointment(null);
    }
  };

  // Create appointment handler
  const handleCreateAppointment = (date: Date, hour: number, providerId: string) => {
    if (onCreateAppointment) {
      const dateStr = date.toISOString().split("T")[0];
      const timeStr = `${hour.toString().padStart(2, "0")}:00`;
      onCreateAppointment(dateStr, timeStr, providerId, selectedLocationId === "all" ? locations[0]?.id : selectedLocationId);
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

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredAppointments.filter((apt) => apt.date === dateStr);
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

  // Get status color for pills
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400";
      case "No-Show":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";
      case "Cancelled":
        return "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400";
      case "Completed":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400";
    }
  };

  // Get status background for calendar blocks
  const getStatusBlockStyles = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50/80 hover:bg-green-100 dark:bg-green-950/20 dark:hover:bg-green-900/30";
      case "No-Show":
        return "bg-neutral-50/80 hover:bg-neutral-100 dark:bg-neutral-900/20 dark:hover:bg-neutral-800/30";
      case "Cancelled":
        return "bg-red-50/80 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30";
      case "Completed":
        return "bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/30";
      default:
        return "bg-neutral-50/80 hover:bg-neutral-100 dark:bg-neutral-900/20 dark:hover:bg-neutral-800/30";
    }
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
          <div className="w-20 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 sticky left-0">
            <div className="h-14 border-b border-neutral-200 dark:border-neutral-800" />
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
                  <div 
                    className="h-14 border-b border-t-[3px] border-neutral-200 dark:border-neutral-800 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-center"
                    style={{ borderTopColor: provider.color }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: provider.color }}
                        />
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          Dr. {provider.lastName}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate pl-4">
                      {provider.specialty}
                    </p>
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
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(currentDate, hour, provider.id)}
                      >
                        {/* 30-minute divider line */}
                        <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none z-0" />
                        {appointments.map((apt) => (
                          <button
                            key={apt.id}
                            draggable
                            onDragStart={() => handleDragStart(apt)}
                            onClick={() => {
                           setSelectedAppointment(apt);
                           setShowDetailDrawer(true);
                         }}
                            className={`w-full mb-1.5 p-2 rounded-r-md text-left border-l-[3px] transition-all shadow-sm ${getStatusBlockStyles(apt.status)} cursor-move`}
                            style={{
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
                        {appointments.length === 0 && onCreateAppointment && (
                          <button
                            onClick={() => handleCreateAppointment(currentDate, hour, provider.id)}
                            className="absolute inset-0 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors group"
                          >
                            <Plus className="w-4 h-4 text-neutral-300 dark:text-neutral-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
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

  // Render Week View
  const renderWeekView = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const week = getWeekDays(currentDate);

    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex">
          {/* Time Column */}
          <div className="w-20 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 z-10 sticky left-0">
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
                      const appointments = getAppointmentsForDateTime(day, hour);

                      return (
                        <div
                          key={hour}
                          className="h-20 border-b border-neutral-200 dark:border-neutral-800 p-1 relative"
                          onDragOver={handleDragOver}
                        >
                          {/* 30-minute divider line */}
                          <div className="absolute left-0 right-0 top-1/2 border-t border-neutral-100 dark:border-neutral-700 pointer-events-none" />
                          <div className="space-y-1">
                            {appointments.slice(0, 2).map((apt) => {
                              const provider = getProviderById(apt.providerId);
                              if (!provider) return null;

                              // Calculate appointment duration in minutes
                              const [startHour, startMin] = apt.startTime.split(':').map(Number);
                              const [endHour, endMin] = apt.endTime.split(':').map(Number);
                              const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                              const is30MinAppt = durationMinutes <= 30;

                              return (
                                <button
                                  key={apt.id}
                                  draggable
                                  onDragStart={() => handleDragStart(apt)}
                                  onClick={() => {
                               setSelectedAppointment(apt);
                               setShowDetailDrawer(true);
                             }}
                                  className={`w-full p-1.5 rounded-r-md text-left border-l-[3px] transition-all shadow-sm text-xs cursor-move ${getStatusBlockStyles(apt.status)}`}
                                  style={{
                                    borderLeftColor: provider.color,
                                  }}
                                >
                                  <div className="flex items-center gap-1 mb-0.5">
                                    <div
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: provider.color }}
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
                            {appointments.length > 2 && (
                              <div 
                                className="relative"
                                onMouseEnter={() => setHoveredOverflow(`week-${dayIndex}-${hour}`)}
                                onMouseLeave={() => setHoveredOverflow(null)}
                              >
                                <button className="w-full text-xs text-neutral-500 dark:text-neutral-400 text-center py-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
                                  +{appointments.length - 2} more
                                </button>
                                {hoveredOverflow === `week-${dayIndex}-${hour}` && (
                                  <AppointmentOverflowPopup
                                    appointments={appointments.slice(2)}
                                    providers={providers}
                                    getStatusColor={getStatusColor}
                                    onViewAppointment={onViewAppointment}
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
                  {/* Show only first 2 appointments total per day */}
                  {dayAppointments.slice(0, 2).map((apt) => {
                    const provider = getProviderById(apt.providerId);
                    if (!provider) return null;
                    
                    return (
                      <button
                        key={apt.id}
                        onClick={() => onViewAppointment?.(apt.id)}
                        className={`w-full p-1.5 rounded-r-md text-left border-l-[3px] transition-all shadow-sm ${getStatusBlockStyles(apt.status)}`}
                        style={{
                          borderLeftColor: provider.color,
                        }}
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: provider.color }}
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
                      <button className="w-full text-xs text-neutral-500 dark:text-neutral-400 text-center py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors">
                        +{dayAppointments.length - 2} more
                      </button>
                      {hoveredOverflow === `month-${index}` && (
                        <AppointmentOverflowPopup
                          appointments={dayAppointments.slice(2)}
                          providers={providers}
                          getStatusColor={getStatusColor}
                          onViewAppointment={onViewAppointment}
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

    if (currentItems.length === 0 && selectedProviders.length > 0) {
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
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Provider</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Service</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {currentItems.map((apt) => {
                const provider = getProviderById(apt.providerId);
                return (
                  <tr key={apt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">{apt.date}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">{apt.startTime} - {apt.endTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setShowDetailDrawer(true);
                        }}
                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline text-left"
                      >
                        {apt.patientName}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {provider && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: provider.color }} />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{provider.firstName} {provider.lastName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{apt.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${getStatusColor(apt.status as any)}`}>
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
    <ClinicAdminLayout onNavigate={onNavigate} activeMenu="calendar" onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Appointments</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              View and manage appointments across all providers and locations
            </p>
          </div>
          <div className="flex items-center gap-4">
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
            {onBookAppointment && (
              <button
                onClick={() => setShowBookDrawer(true)}
                className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Book appointment
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {/* Filters Row - Compact Design */}
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
                {Array.from(new Set(services.map((s: any) => s.name || s))).filter((t: any) => !selectedServices.includes(t as string)).map((type: any) => (
                  <option key={type as string} value={type as string}>{type as string}</option>
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

        {viewType === "calendar" && (
          <>
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

            {/* Empty State */}
            {filteredAppointments.length === 0 && selectedProviders.length > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
                <CalendarIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                  No appointments scheduled
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  There are no appointments for the selected filters
                </p>
              </div>
            )}
          </>
        )}

        {/* List View */}
        {viewType === "list" && renderListView()}

        {/* Drag Indicator */}
        {draggedAppointment && (
          <div className="fixed bottom-6 right-6 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            Dragging: {draggedAppointment.patientName} - Drop on a time slot to reschedule
          </div>
        )}
      </div>

      {/* Book Appointment Drawer */}
      {showBookDrawer && patients && services && rooms && (
        <BookAppointmentDrawer
          isOpen={showBookDrawer}
          patients={patients}
          services={services}
          rooms={rooms}
          providers={allProviders}
          onClose={() => setShowBookDrawer(false)}
          onBookAppointment={(appointment) => {
            onBookAppointment?.(appointment);
            setShowBookDrawer(false);
          }}
        />
      )}

      {/* Appointment Detail Drawer */}
      {showDetailDrawer && selectedAppointment && (
        <AppointmentDetailDrawer
          appointment={{
            ...selectedAppointment,
            providerName: getProviderById(selectedAppointment.providerId)?.lastName ? `Dr. ${getProviderById(selectedAppointment.providerId)?.lastName}` : 'Provider',
            startTime: selectedAppointment.startTime,
            endTime: selectedAppointment.endTime,
          }}
          onClose={() => setShowDetailDrawer(false)}
          onCancel={(id) => {
            console.log("Cancel", id);
            // Implement cancel logic or call prop
          }}
          onReschedule={(id) => {
            console.log("Reschedule", id);
            // Implement reschedule logic
          }}
          onMarkNoShow={(id) => {
            console.log("No-Show", id);
            // Implement no-show logic
          }}
          onNavigateToPatient={(patientId) => {
            onNavigate("patients"); // Assuming navigation to patients list or specific patient
          }}
        />
      )}
    </ClinicAdminLayout>
  );
}