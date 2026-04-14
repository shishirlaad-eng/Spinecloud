import { useState, useEffect } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { Calendar, Clock, MapPin, User, Search, ChevronRight, Plus, LayoutList, Calendar as CalendarIcon, ChevronLeft } from "lucide-react";
import { AppointmentDetailDrawer } from "@/app/components/shared/AppointmentDetailDrawer";

interface Appointment {
  id: string;
  appointmentId?: string;
  date: string;
  timeSlot: string;
  provider: string;
  clinic: string;
  clinicAddress: string;
  service: string;
  status: "Confirmed" | "Cancelled" | "Completed" | "Rescheduled" | "No-Show";
}

interface AppointmentsListScreenProps {
  appointments: Appointment[];
  onNavigate: (menu: "dashboard" | "appointments" | "invoices" | "notifications" | "settings") => void;
  onReschedule: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onLogout?: () => void;
  onBookAppointment?: () => void;
  services?: any[];
}

export function AppointmentsListScreen({
  appointments,
  onNavigate,
  onReschedule,
  onCancel,
  onLogout,
  onBookAppointment,
  services = [],
}: AppointmentsListScreenProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleViewDetails = (id: string) => {
    setSelectedAptId(id);
    setIsDrawerOpen(true);
  };

  // Helper function to check if date is in the past
  const isPast = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };

  // Helper function to check if date is in the future or today
  const isUpcoming = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date >= today;
  };

  // Filter appointments based on active filter
  const filteredAppointments = appointments.filter((apt) => {
    // Apply search filter
    const matchesSearch =
      searchQuery === "" ||
      apt.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Apply date filter
    switch (activeFilter) {
      case "upcoming":
        return isUpcoming(apt.date);
      case "past":
        return isPast(apt.date);
      case "all":
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Add padding for start of month
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
        days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getDate() === date.getDate() &&
               aptDate.getMonth() === date.getMonth() &&
               aptDate.getFullYear() === date.getFullYear();
    });
  };

  const upcomingCount = appointments.filter((apt) => isUpcoming(apt.date)).length;
  const pastCount = appointments.filter((apt) => isPast(apt.date)).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if it's today
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }

    // Check if it's tomorrow
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return "Tomorrow";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAppointmentService = (serviceId: string) => {
    const foundService = services.find(s => s.id === serviceId);
    if (foundService) return foundService.name;
    
    // Fallback mapping for legacy mock data IDs
    const legacyServices: Record<string, string> = {
      initial: "Initial Consultation",
      followup: "Follow-up Visit",
      therapy: "Therapy Session",
    };
    return legacyServices[serviceId] || serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Cancelled":
        return "bg-destructive/10 dark:bg-destructive/20 text-destructive";
      case "Completed":
        return "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <button
      onClick={() => handleViewDetails(appointment.id)}
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:border-primary-500 dark:hover:border-primary-600 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {formatAppointmentService(appointment.service)}
            </h3>
            <div className={`px-2 py-1 rounded-md text-sm ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </div>
          </div>
          {appointment.appointmentId && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              {appointment.appointmentId}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <CalendarIcon className="w-4 h-4" />
            <span className="font-medium">{formatDate(appointment.date)}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{appointment.timeSlot}</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {appointment.provider}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {appointment.clinic}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              {appointment.clinicAddress}
            </p>
          </div>
        </div>
      </div>
    </button>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <CalendarIcon className="w-8 h-8 text-neutral-400" />
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
    </div>
  );

  return (
    <>
      <DashboardLayout activeMenu="appointments" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
                Appointments
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                View and manage all your appointments
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "calendar"
                      ? "bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
              {onBookAppointment && (
                <button
                  onClick={onBookAppointment}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Book Appointment
                </button>
              )}
            </div>
          </div>

          {viewMode === "list" ? (
            <>
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-4 h-9 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                      activeFilter === "all"
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    All
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                      activeFilter === "all" 
                        ? "bg-white/20" 
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}>
                      {appointments.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveFilter("upcoming")}
                    className={`px-4 h-9 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                      activeFilter === "upcoming"
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Upcoming
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                      activeFilter === "upcoming" 
                        ? "bg-white/20" 
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}>
                      {upcomingCount}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveFilter("past")}
                    className={`px-4 h-9 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                      activeFilter === "past"
                        ? "bg-primary-600 text-white shadow-sm"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Past
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-sm ${
                      activeFilter === "past" 
                        ? "bg-white/20" 
                        : "bg-neutral-100 dark:bg-neutral-800"
                    }`}>
                      {pastCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* Appointments Grid */}
              {filteredAppointments.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paginatedAppointments.map((apt) => (
                      <AppointmentCard key={apt.id} appointment={apt} />
                    ))}
                  </div>

                  {/* Pagination UI */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-6">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * pageSize, filteredAppointments.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredAppointments.length}</span> appointments
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                                currentPage === i + 1
                                  ? "bg-primary-600 text-white shadow-sm"
                                  : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <EmptyState
                    message={
                      searchQuery
                        ? "No appointments found matching your search"
                        : activeFilter === "upcoming"
                        ? "No upcoming appointments"
                        : activeFilter === "past"
                        ? "No past appointments"
                        : "No appointments found"
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                        >
                            Today
                        </button>
                        <button 
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-2 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 border-r border-neutral-200 dark:border-neutral-800 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {getDaysInMonth(currentDate).map((date, i) => (
                        <div 
                            key={i} 
                            className={`min-h-[120px] p-2 border-r border-b border-neutral-200 dark:border-neutral-800 last:border-r-0 ${
                                !date ? 'bg-neutral-50/50 dark:bg-neutral-900/50' : ''
                            }`}
                        >
                            {date && (
                                <>
                                    <div className={`text-sm font-medium mb-2 ${
                                        date.toDateString() === new Date().toDateString()
                                            ? 'w-7 h-7 flex items-center justify-center bg-primary-600 text-white rounded-full'
                                            : 'text-neutral-900 dark:text-white'
                                    }`}>
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {getAppointmentsForDay(date).map(apt => (
                                            <button
                                                key={apt.id}
                                                onClick={() => handleViewDetails(apt.id)}
                                                className="w-full text-left p-1.5 rounded bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 hover:border-primary-300 transition-colors"
                                            >
                                                <p className="text-[10px] font-bold text-primary-700 dark:text-primary-300 truncate">
                                                    {apt.timeSlot}
                                                </p>
                                                <p className="text-[10px] text-primary-600 dark:text-primary-400 truncate">
                                                    {formatAppointmentService(apt.service)}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>

    <AppointmentDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        appointmentId={selectedAptId}
        onReschedule={(id: string) => {
            setIsDrawerOpen(false);
            onReschedule(id);
        }}
        onCancel={(id: string) => {
            setIsDrawerOpen(false);
            onCancel(id);
        }}
        userRole="patient"
    />
    </>
  );
}