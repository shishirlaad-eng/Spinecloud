import { useState } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
import { ChevronRight, User, Mail, Phone, MapPin, Calendar, Clock, Search, Filter, X, DollarSign, Download, Printer } from "lucide-react";
import { CreateInvoiceDrawer } from "./CreateInvoiceDrawer";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  location: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  service: string; // Renamed from appointmentType
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  hasInvoice?: boolean;
  invoiceAmount?: number;
}

interface ClinicStaffPatientDetailsScreenProps {
  patientId: string;
  onNavigate: (menu: "calendar" | "patients") => void;
  onBackToPatients: () => void;
  onViewAppointment: (appointmentId: string) => void;
  onLogout?: () => void;
}

export function ClinicStaffPatientDetailsScreen({
  patientId,
  onNavigate,
  onBackToPatients,
  onViewAppointment,
  onLogout,
}: ClinicStaffPatientDetailsScreenProps) {
  // Mock patient data
  const patient: Patient = {
    id: patientId,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    address: "123 Main Street, City, State 12345",
    location: "Downtown Clinic",
  };

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "apt-1",
      date: "2026-02-05",
      time: "09:00 AM - 10:00 AM",
      provider: "Dr. Michael Chen",
      service: "Initial Consultation", // Renamed from appointmentType
      location: "Downtown Clinic",
      status: "Scheduled",
    },
    {
      id: "apt-2",
      date: "2026-01-28",
      time: "02:00 PM - 03:00 PM",
      provider: "Dr. Emily Rodriguez",
      service: "Follow-up", // Renamed from appointmentType and value changed
      location: "Downtown Clinic",
      status: "Completed",
      hasInvoice: false,
    },
    {
      id: "apt-3",
      date: "2026-01-15",
      time: "10:30 AM - 11:30 AM",
      provider: "Dr. Michael Chen",
      service: "Therapy Session", // Renamed from appointmentType
      location: "Westside Branch",
      status: "Completed",
      hasInvoice: true,
      invoiceAmount: 150.0,
    },
    {
      id: "apt-4",
      date: "2026-01-08",
      time: "03:00 PM - 04:00 PM",
      provider: "Dr. Sarah Thompson",
      service: "Initial Consultation", // Renamed from appointmentType
      location: "Downtown Clinic",
      status: "Completed",
      hasInvoice: true,
      invoiceAmount: 200.0,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterDateRange, setFilterDateRange] = useState({ start: "", end: "" });
  const [filterAmountRange, setFilterAmountRange] = useState({ min: "", max: "" });
  const [filterTimeRange, setFilterTimeRange] = useState({ start: "", end: "" });
  const [createInvoiceDrawer, setCreateInvoiceDrawer] = useState<{
    isOpen: boolean;
    appointmentId: string;
    patientName: string;
  }>({ isOpen: false, appointmentId: "", patientName: "" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800";
      case "Completed":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const handleGenerateInvoice = (appointmentId: string) => {
    setCreateInvoiceDrawer({ isOpen: true, appointmentId, patientName: patient.name });
  };

  const handleCreateInvoice = (lineItems: any[], total: number) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === createInvoiceDrawer.appointmentId
          ? { ...apt, hasInvoice: true, invoiceAmount: total }
          : apt
      )
    );
    setCreateInvoiceDrawer({ isOpen: false, appointmentId: "", patientName: "" });
  };

  const toggleStatus = (status: string) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const clearFilters = () => {
    setFilterStatus([]);
    setFilterDateRange({ start: "", end: "" });
    setFilterAmountRange({ min: "", max: "" });
    setFilterTimeRange({ start: "", end: "" });
  };

  const applyFilters = () => {
    setShowFilters(false);
    // Filters would be applied to filteredAppointments
  };

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((apt) => {
    // Search filter
    const searchMatch =
      !searchQuery ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.provider.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusMatch = filterStatus.length === 0 || filterStatus.includes(apt.status);

    // Date range filter
    let dateMatch = true;
    if (filterDateRange.start && filterDateRange.end) {
      const aptDate = new Date(apt.date);
      const startDate = new Date(filterDateRange.start);
      const endDate = new Date(filterDateRange.end);
      dateMatch = aptDate >= startDate && aptDate <= endDate;
    }

    // Amount range filter
    let amountMatch = true;
    if (filterAmountRange.min || filterAmountRange.max) {
      const amount = apt.invoiceAmount || 0;
      const min = parseFloat(filterAmountRange.min) || 0;
      const max = parseFloat(filterAmountRange.max) || Infinity;
      amountMatch = amount >= min && amount <= max;
    }

    return searchMatch && statusMatch && dateMatch && amountMatch;
  });

  return (
    <>
      <ClinicStaffLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <button
              onClick={onBackToPatients}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Patients
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 dark:text-white font-medium">{patient.name}</span>
          </nav>

          {/* Patient Information Card */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {patient.name}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Patient ID: {patient.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Email:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white">
                      {patient.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Phone:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white">
                      {patient.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Date of birth:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white">
                      {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                    <span className="ml-2 text-neutral-900 dark:text-white">
                      {patient.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Appointments ({filteredAppointments.length})
              </h3>
            </div>

            {/* Search and Filter Bar */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by patient name or appointment reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                    showFilters
                      ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                      : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Filter Dropdown Popup */}
                {showFilters && (
                  <div className="absolute right-0 top-12 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filter options</h4>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        {/* Date Range */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                            Date range
                          </label>
                          <div className="space-y-2">
                            <input
                              type="date"
                              value={filterDateRange.start}
                              onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                            <input
                              type="date"
                              value={filterDateRange.end}
                              onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                          </div>
                        </div>

                        {/* Invoice Amount Range */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                            Invoice amount range
                          </label>
                          <div className="space-y-2">
                            <input
                              type="number"
                              placeholder="Min amount"
                              value={filterAmountRange.min}
                              onChange={(e) => setFilterAmountRange({ ...filterAmountRange, min: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                            <input
                              type="number"
                              placeholder="Max amount"
                              value={filterAmountRange.max}
                              onChange={(e) => setFilterAmountRange({ ...filterAmountRange, max: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                          </div>
                        </div>

                        {/* Time Range */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                            Time range
                          </label>
                          <div className="space-y-2">
                            <input
                              type="time"
                              value={filterTimeRange.start}
                              onChange={(e) => setFilterTimeRange({ ...filterTimeRange, start: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                            <input
                              type="time"
                              value={filterTimeRange.end}
                              onChange={(e) => setFilterTimeRange({ ...filterTimeRange, end: e.target.value })}
                              className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                            Appointment status
                          </label>
                          <div className="space-y-2">
                            {["Completed", "Scheduled", "Cancelled"].map((status) => (
                              <label key={status} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterStatus.includes(status)}
                                  onChange={() => toggleStatus(status)}
                                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                                />
                                <span className="text-sm text-neutral-900 dark:text-white">{status}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <button
                          onClick={applyFilters}
                          className="flex-1 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          Apply filters
                        </button>
                        <button
                          onClick={clearFilters}
                          className="flex-1 h-9 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => onViewAppointment(appointment.id)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                          {appointment.hasInvoice && (
                            <span className="px-2 py-0.5 rounded text-sm font-medium bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-400">
                              Invoiced ${appointment.invoiceAmount?.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{appointment.provider}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {appointment.service}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                          {appointment.location}
                        </p>
                      </button>

                      {/* Generate Invoice Button - Only for completed appointments without invoice */}
                      {appointment.status === "Completed" && !appointment.hasInvoice && (
                        <button
                          onClick={() => handleGenerateInvoice(appointment.id)}
                          className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors flex-shrink-0"
                        >
                          <DollarSign className="w-4 h-4" />
                          Generate invoice
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    No appointments found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClinicStaffLayout>

      {/* Create Invoice Drawer */}
      <CreateInvoiceDrawer
        isOpen={createInvoiceDrawer.isOpen}
        onClose={() => setCreateInvoiceDrawer({ isOpen: false, appointmentId: "", patientName: "" })}
        onCreateInvoice={handleCreateInvoice}
        appointmentId={createInvoiceDrawer.appointmentId}
        patientName={createInvoiceDrawer.patientName}
        service={appointments.find(a => a.id === createInvoiceDrawer.appointmentId)?.service}
        appointmentDate={appointments.find(a => a.id === createInvoiceDrawer.appointmentId)?.date ? 
          new Date(appointments.find(a => a.id === createInvoiceDrawer.appointmentId)!.date).toLocaleDateString() : 
          new Date().toLocaleDateString()}
        appointmentCost={150.00}
      />
    </>
  );
}