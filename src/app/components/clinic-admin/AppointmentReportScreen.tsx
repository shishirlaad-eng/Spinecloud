import { useState, useMemo } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Filter, X, Download, Calendar as CalendarIcon } from "lucide-react";

interface AppointmentReportRow {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  service: string;
  providerName: string;
  location: string;
  duration: number; // in minutes
  status: "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";
  bookingSource: "Patient" | "Staff";
  createdOn: string;
}

interface AppointmentReportScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
}

export function AppointmentReportScreen({
  onNavigate,
  onLogout,
}: AppointmentReportScreenProps) {
  // Mock data
  const locations = [
    { id: "loc-1", name: "Downtown Clinic" },
    { id: "loc-2", name: "Westside Branch" },
    { id: "loc-3", name: "Eastside Clinic" },
  ];

  const providers = [
    { id: "prov-1", name: "Dr. Sarah Johnson" },
    { id: "prov-2", name: "Dr. Michael Chen" },
    { id: "prov-3", name: "Dr. Emily Rodriguez" },
    { id: "prov-4", name: "Dr. David Kim" },
  ];

  const services = [
    "Initial Consultation",
    "Follow-up",
    "Therapy Session",
    "Adjustment",
    "Checkup",
  ];

  const [appointments] = useState<AppointmentReportRow[]>([
    {
      id: "1",
      appointmentId: "APT-2026-001",
      appointmentDate: "2026-01-30",
      appointmentTime: "09:00",
      patientName: "Sarah Johnson",
      service: "Initial Consultation",
      providerName: "Dr. Sarah Johnson",
      location: "Downtown Clinic",
      duration: 60,
      status: "Confirmed",
      bookingSource: "Patient",
      createdOn: "2026-01-25",
    },
    {
      id: "2",
      appointmentId: "APT-2026-002",
      appointmentDate: "2026-01-30",
      appointmentTime: "10:30",
      patientName: "James Wilson",
      service: "Follow-up",
      providerName: "Dr. Michael Chen",
      location: "Downtown Clinic",
      duration: 30,
      status: "Confirmed",
      bookingSource: "Staff",
      createdOn: "2026-01-26",
    },
    {
      id: "3",
      appointmentId: "APT-2026-003",
      appointmentDate: "2026-01-29",
      appointmentTime: "14:00",
      patientName: "Maria Garcia",
      service: "Therapy Session",
      providerName: "Dr. Emily Rodriguez",
      location: "Westside Branch",
      duration: 45,
      status: "Completed",
      bookingSource: "Patient",
      createdOn: "2026-01-20",
    },
    {
      id: "4",
      appointmentId: "APT-2026-004",
      appointmentDate: "2026-01-28",
      appointmentTime: "11:00",
      patientName: "Robert Chen",
      service: "Adjustment",
      providerName: "Dr. David Kim",
      location: "Eastside Clinic",
      duration: 20,
      status: "Completed",
      bookingSource: "Patient",
      createdOn: "2026-01-22",
    },
    {
      id: "5",
      appointmentId: "APT-2026-005",
      appointmentDate: "2026-01-27",
      appointmentTime: "15:30",
      patientName: "Lisa Anderson",
      service: "Checkup",
      providerName: "Dr. Sarah Johnson",
      location: "Downtown Clinic",
      duration: 30,
      status: "Cancelled",
      bookingSource: "Staff",
      createdOn: "2026-01-18",
    },
    {
      id: "6",
      appointmentId: "APT-2026-006",
      appointmentDate: "2026-01-31",
      appointmentTime: "13:00",
      patientName: "Michael Brown",
      service: "Initial Consultation",
      providerName: "Dr. Michael Chen",
      location: "Westside Branch",
      duration: 60,
      status: "Confirmed",
      bookingSource: "Patient",
      createdOn: "2026-01-28",
    },
    {
      id: "7",
      appointmentId: "APT-2026-007",
      appointmentDate: "2026-01-26",
      appointmentTime: "10:00",
      patientName: "Emily Davis",
      service: "Follow-up",
      providerName: "Dr. David Kim",
      location: "Downtown Clinic",
      duration: 30,
      status: "Rescheduled",
      bookingSource: "Patient",
      createdOn: "2026-01-15",
    },
    {
      id: "8",
      appointmentId: "APT-2026-008",
      appointmentDate: "2026-02-01",
      appointmentTime: "09:30",
      patientName: "David Martinez",
      service: "Therapy Session",
      providerName: "Dr. Emily Rodriguez",
      location: "Eastside Clinic",
      duration: 45,
      status: "Confirmed",
      bookingSource: "Staff",
      createdOn: "2026-01-29",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" });
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800";
      case "Completed":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      case "Rescheduled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const toggleStatus = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  // Filter and search logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          appointment.appointmentId.toLowerCase().includes(query) ||
          appointment.patientName.toLowerCase().includes(query) ||
          appointment.providerName.toLowerCase().includes(query) ||
          appointment.service.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Date range filter
      if (filterDateRange.start && filterDateRange.end) {
        const appointmentDate = new Date(appointment.appointmentDate);
        const startDate = new Date(filterDateRange.start);
        const endDate = new Date(filterDateRange.end);
        if (appointmentDate < startDate || appointmentDate > endDate) return false;
      }

      // Location filter
      if (filterLocation !== "all" && appointment.location !== filterLocation) {
        return false;
      }

      // Provider filter
      if (filterProvider !== "all" && appointment.providerName !== filterProvider) {
        return false;
      }

      // Service filter
      if (filterService !== "all" && appointment.service !== filterService) {
        return false;
      }

      // Status filter
      if (filterStatus.length > 0 && !filterStatus.includes(appointment.status)) {
        return false;
      }

      return true;
    });
  }, [appointments, searchQuery, filterDateRange, filterLocation, filterProvider, filterService, filterStatus]);

  const handleClearFilters = () => {
    setFilterDateRange({ start: "", end: "" });
    setFilterLocation("all");
    setFilterProvider("all");
    setFilterService("all");
    setFilterStatus([]);
  };

  const activeFilterCount =
    (filterDateRange.start && filterDateRange.end ? 1 : 0) +
    (filterLocation !== "all" ? 1 : 0) +
    (filterProvider !== "all" ? 1 : 0) +
    (filterService !== "all" ? 1 : 0) +
    filterStatus.length;

  const handleExport = () => {
    // Export functionality (CSV/PDF)
    console.log("Exporting report...");
  };

  return (
    <ClinicAdminLayout onNavigate={onNavigate} activeMenu="reports" onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Appointment report</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              View and analyze appointment data across all locations and providers
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export report
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by appointment ID, patient name, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border font-medium text-sm transition-colors ${
                showFilters || activeFilterCount > 0
                  ? "bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block font-medium">
                    Date range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={filterDateRange.start}
                      onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                      className="flex-1 h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                    <span className="text-neutral-400 text-sm">to</span>
                    <input
                      type="date"
                      value={filterDateRange.end}
                      onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                      className="flex-1 h-9 px-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block font-medium">
                    Location
                  </label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All locations</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.name}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Provider Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block font-medium">
                    Provider
                  </label>
                  <select
                    value={filterProvider}
                    onChange={(e) => setFilterProvider(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All providers</option>
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.name}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Filter */}
                <div>
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block font-medium">
                    Service
                  </label>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                  >
                    <option value="all">All services</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter (Multi-select chips) */}
                <div className="lg:col-span-2">
                  <label className="text-xs text-neutral-600 dark:text-neutral-400 mb-1.5 block font-medium">
                    Appointment status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Confirmed", "Completed", "Cancelled", "Rescheduled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                          filterStatus.includes(status)
                            ? getStatusColor(status)
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFilterCount > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing <span className="font-medium text-neutral-900 dark:text-white">{filteredAppointments.length}</span> of{" "}
            <span className="font-medium text-neutral-900 dark:text-white">{appointments.length}</span> appointments
          </p>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Appointment ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Time
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Patient name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Service
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Provider
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Duration
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Booking source
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Created on
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        {appointment.appointmentId}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(appointment.appointmentDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatTime(appointment.appointmentTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">
                        {appointment.patientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.providerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.duration} min
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {appointment.bookingSource}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {formatDate(appointment.createdOn)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-3" />
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          No appointments found
                        </p>
                        {(searchQuery || activeFilterCount > 0) && (
                          <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
