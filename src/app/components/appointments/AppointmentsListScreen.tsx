import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search, 
  ChevronRight, 
  Plus, 
  LayoutList, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  Filter, 
  X, 
  ChevronDown 
} from "lucide-react";
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
  const [pageSize, setPageSize] = useState(10);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  const handleViewDetails = (id: string) => {
    setSelectedAptId(id);
    setIsDrawerOpen(true);
  };

  const isPast = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };

  const isUpcoming = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date >= today;
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      searchQuery === "" ||
      apt.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

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
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
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

  const formatAppointmentService = (serviceId: string) => {
    const foundService = services.find(s => (s.id === serviceId || s.name === serviceId));
    if (foundService) return foundService.name;
    return serviceId;
  };

  const activeFilterCount = activeFilter !== "all" ? 1 : 0;

  return (
    <>
      <DashboardLayout activeMenu="appointments" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-5 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs & Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1.5 font-sans">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-medium text-[#0b1c30]">Appointments</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white mb-0.5">
                  Appointments
                </h1>
                <p className="text-sm text-neutral-500">
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
                    className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Book Appointment
                  </button>
                )}
              </div>
            </div>
          </div>

          {viewMode === "list" ? (
            <>
              {/* Controls - Similar to Invoices */}
              <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by service, provider, or branch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4] transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400"
                  />
                </div>
                <div className="relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilterDropdown(v => !v)}
                    className={`inline-flex items-center justify-center w-10 h-10 border rounded-lg transition-all ${
                      activeFilterCount > 0
                        ? "bg-[#eff4ff] dark:bg-primary-950/30 border-[#1d77b4] text-[#005e93] dark:text-primary-300"
                        : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#1d77b4] text-white text-[10px] font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-30 p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</span>
                        <button onClick={() => setShowFilterDropdown(false)} className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">Timeframe</label>
                        <select
                          value={activeFilter}
                          onChange={e => setActiveFilter(e.target.value as any)}
                          className="w-full h-9 px-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1d77b4]/20 focus:border-[#1d77b4]"
                        >
                          <option value="all">All Appointments</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past</option>
                        </select>
                      </div>

                      {activeFilter !== "all" && (
                        <button
                          onClick={() => setActiveFilter("all")}
                          className="w-full h-9 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Table - Similar to Invoices */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                      <tr>
                        {["Date", "Time", "Service", "Branch", "Provider", "Status"].map((col) => (
                          <th
                            key={col}
                            className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider"
                          >
                            <div className="flex items-center gap-1">
                              {col}
                              <div className="flex flex-col scale-75 opacity-40">
                                <ChevronDown className="w-3 h-3 -mb-1 rotate-180" />
                                <ChevronDown className="w-3 h-3" />
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {paginatedAppointments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center">
                            <CalendarIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              No appointments found matching your criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                              {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                              {apt.timeSlot.split(" - ")[0]}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => handleViewDetails(apt.id)}
                                className="font-semibold text-[#1d77b4] hover:underline text-left"
                              >
                                {formatAppointmentService(apt.service)}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                              {apt.clinic}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                              {apt.provider}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                                  apt.status === "Confirmed" || apt.status === "Rescheduled"
                                    ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                }`}
                              >
                                {apt.status === "Rescheduled" ? "Confirmed" : apt.status === "No-Show" ? "Cancelled" : apt.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination - Replicated from Invoices */}
              {filteredAppointments.length > 0 && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Rows per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                      className="h-9 px-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:border-[#1d77b4] focus:ring-1 focus:ring-[#1d77b4]"
                    >
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                      Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredAppointments.length)} of {filteredAppointments.length} appointments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans"
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
                              ? "bg-[#1d77b4] text-white shadow-sm"
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
                      className="px-4 h-9 flex items-center justify-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Calendar View - Maintaining original clean style but with updated layout */
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
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
                        <div key={day} className="py-2 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider border-r border-neutral-200 dark:border-neutral-800 last:border-r-0">
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

    {(() => {
        const selectedApt = appointments.find(a => a.id === selectedAptId);
        if (!selectedApt) return null;
        
        // Map list fields to drawer fields
        const timeParts = selectedApt.timeSlot.split(" - ");
        const mappedApt = {
            ...selectedApt,
            startTime: timeParts[0] || selectedApt.timeSlot,
            endTime: timeParts[1] || selectedApt.timeSlot,
            providerName: selectedApt.provider,
            branchName: selectedApt.clinic
        };

        return (
            <AppointmentDetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                appointment={mappedApt}
                onReschedule={(id: string) => {
                    setIsDrawerOpen(false);
                    onReschedule(id);
                }}
                onCancel={(id: string) => {
                    setIsDrawerOpen(false);
                    onCancel(id);
                }}
                onMarkNoShow={() => {}}
                onNavigateToPatient={() => {}}
                userRole="patient"
            />
        );
    })()}
    </>
  );
}