import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Filter, X, Mail, AlertCircle, FileText, Clock, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { Pagination } from "../shared/Pagination";

interface Patient {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  primaryLocation: string;
  assignedProvider?: string;
  status: "Draft" | "Invited" | "Active" | "Inactive";
  intakeStatus: "Not Started" | "In Progress" | "Complete";
  insuranceStatus: "Missing" | "Provided";
  nextAppointment?: string;
  balanceDue?: number;
  registeredDate: string;
  lastUpdated?: string;
}

interface EnhancedPatientsListScreenProps {
  patients: Patient[];
  locations: { id: string; name: string }[];
  providers: { id: string; name: string }[];
  onNavigate: (menu: string) => void;
  onViewPatient: (patientId: string) => void;
  onAddPatient?: () => void;
  onResendInvitation?: (patientId: string) => void;
  onBookAppointment?: (patientId: string) => void;
  onLogout?: () => void;
}

export function EnhancedPatientsListScreen({
  patients,
  locations,
  providers,
  onNavigate,
  onViewPatient,
  onAddPatient,
  onResendInvitation,
  onBookAppointment,
  onLogout,
}: EnhancedPatientsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Draft" | "Invited" | "Active" | "Inactive">("all");
  const [intakeFilter, setIntakeFilter] = useState<"all" | "Not Started" | "In Progress" | "Complete">("all");
  const [insuranceFilter, setInsuranceFilter] = useState<"all" | "Missing" | "Provided">("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "email" | "location" | "lastUpdated" | "balanceDue">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery) ||
      patient.patientId.includes(searchQuery);

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    const matchesIntake = intakeFilter === "all" || patient.intakeStatus === intakeFilter;
    const matchesInsurance = insuranceFilter === "all" || patient.insuranceStatus === insuranceFilter;
    const matchesLocation = locationFilter === "all" || patient.primaryLocation === locationFilter;
    const matchesProvider = providerFilter === "all" || patient.assignedProvider === providerFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesIntake &&
      matchesInsurance &&
      matchesLocation &&
      matchesProvider
    );
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "name":
        compareValue = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        break;
      case "email":
        compareValue = a.email.localeCompare(b.email);
        break;
      case "location":
        compareValue = a.primaryLocation.localeCompare(b.primaryLocation);
        break;
      case "lastUpdated":
        compareValue = new Date(a.lastUpdated || a.registeredDate).getTime() - new Date(b.lastUpdated || b.registeredDate).getTime();
        break;
      case "balanceDue":
        compareValue = (a.balanceDue || 0) - (b.balanceDue || 0);
        break;
    }

    return sortDirection === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedPatients.slice(indexOfFirstItem, indexOfLastItem);

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (intakeFilter !== "all" ? 1 : 0) +
    (insuranceFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0) +
    (providerFilter !== "all" ? 1 : 0);

  const getStatusBadgeColor = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Invited":
        return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "Draft":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
      case "Inactive":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400";
    }
  };

  const getIntakeStatusBadgeColor = (status: Patient["intakeStatus"]) => {
    switch (status) {
      case "Complete":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "In Progress":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
      case "Not Started":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400";
    }
  };

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Patient Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage patient records, intake status, and appointments
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
            onClick={onAddPatient}
          >
            <Plus className="w-4 h-4" />
            Add patient
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                activeFilterCount > 0
                  ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10 max-h-[600px] overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Patient Status Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Patient status
                      </label>
                      <div className="space-y-2">
                        {(["all", "Draft", "Invited", "Active", "Inactive"] as const).map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={statusFilter === status}
                              onChange={() => setStatusFilter(status)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {status === "all" ? "All statuses" : status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Intake Status Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Intake status
                      </label>
                      <div className="space-y-2">
                        {(["all", "Not Started", "In Progress", "Complete"] as const).map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="intakeStatus"
                              checked={intakeFilter === status}
                              onChange={() => setIntakeFilter(status)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {status === "all" ? "All statuses" : status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Insurance Status Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Insurance status
                      </label>
                      <div className="space-y-2">
                        {(["all", "Missing", "Provided"] as const).map((status) => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="insuranceStatus"
                              checked={insuranceFilter === status}
                              onChange={() => setInsuranceFilter(status)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {status === "all" ? "All statuses" : status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Primary location
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="location"
                            checked={locationFilter === "all"}
                            onChange={() => setLocationFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All locations
                          </span>
                        </label>
                        {locations.map((location) => (
                          <label key={location.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="location"
                              checked={locationFilter === location.name}
                              onChange={() => setLocationFilter(location.name)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {location.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Provider Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Assigned provider
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="provider"
                            checked={providerFilter === "all"}
                            onChange={() => setProviderFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All providers
                          </span>
                        </label>
                        {providers.map((provider) => (
                          <label key={provider.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="provider"
                              checked={providerFilter === provider.name}
                              onChange={() => setProviderFilter(provider.name)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {provider.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setIntakeFilter("all");
                        setInsuranceFilter("all");
                        setLocationFilter("all");
                        setProviderFilter("all");
                      }}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {sortedPatients.length} of {patients.length} patients
          </p>
        </div>

        {/* Patients Table */}
        {sortedPatients.length > 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Patient name
                        {sortField === "name" && (
                          <span className="text-neutral-400">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Primary location
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Assigned provider
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Patient status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Intake status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Next appointment
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((patient) => {
                    const hasWarnings =
                      patient.intakeStatus !== "Complete" ||
                      patient.insuranceStatus === "Missing" ||
                      patient.status === "Invited" ||
                      (patient.balanceDue && patient.balanceDue > 0);

                    return (
                      <tr
                        key={patient.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onViewPatient(patient.id)}
                            className="flex items-center gap-3 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                {patient.firstName[0]}
                                {patient.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {patient.firstName} {patient.lastName}
                                </p>
                                {hasWarnings && (
                                  <div className="flex items-center gap-1">
                                    {patient.intakeStatus !== "Complete" && (
                                      <span title="Intake pending"><AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /></span>
                                    )}
                                    {patient.insuranceStatus === "Missing" && (
                                      <span title="Missing insurance"><FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /></span>
                                    )}
                                    {patient.status === "Invited" && (
                                      <span title="Invitation pending"><Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /></span>
                                    )}
                                    {patient.balanceDue && patient.balanceDue > 0 && (
                                      <span title="Balance due"><DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /></span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                ID: {patient.patientId}
                              </p>
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {patient.primaryLocation}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {patient.assignedProvider || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${getStatusBadgeColor(
                              patient.status
                            )}`}
                          >
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${getIntakeStatusBadgeColor(
                              patient.intakeStatus
                            )}`}
                          >
                            {patient.intakeStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {patient.nextAppointment ? (
                            <div className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                              <Calendar className="w-4 h-4 text-neutral-400" />
                              <span>{new Date(patient.nextAppointment).toLocaleDateString()}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onViewPatient(patient.id)}
                              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                            >
                              View
                            </button>
                            {patient.status === "Invited" && onResendInvitation && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onResendInvitation(patient.id);
                                }}
                                className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                              >
                                <Mail className="w-4 h-4" />
                                Resend
                              </button>
                            )}
                            {onBookAppointment && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onBookAppointment(patient.id);
                                }}
                                className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                              >
                                <Calendar className="w-4 h-4" />
                                Book
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedPatients.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedPatients.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No patients found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "No patients found in the system"}
            </p>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
