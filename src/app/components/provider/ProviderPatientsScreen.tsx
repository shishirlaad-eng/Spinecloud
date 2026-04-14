import { useState, useMemo } from "react";
import { ProviderLayout } from "./layout/ProviderLayout";
import { Search, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

interface Patient {
  id: string;
  patientId: string;
  name: string;
  locationId: string;
  locationName: string;
  email: string;
  phone: string;
  appointmentCount: number;
}

interface ProviderPatientsScreenProps {
  patients: Patient[];
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onViewPatient: (patientId: string) => void;
  onLogout?: () => void;
}

type SortField = "id" | "name" | "locationName" | "email" | "phone" | "appointmentCount";
type SortDirection = "asc" | "desc" | null;

export function ProviderPatientsScreen({
  patients,
  onNavigate,
  onViewPatient,
  onLogout,
}: ProviderPatientsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Get unique locations
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(patients.map((p) => p.locationName))
    ).sort();
    return uniqueLocations;
  }, [patients]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let result = [...patients];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (patient) =>
          patient.patientId.toLowerCase().includes(query) ||
          patient.name.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.phone.includes(query)
      );
    }

    // Apply location filter
    if (locationFilter) {
      result = result.filter((patient) => patient.locationName === locationFilter);
    }

    // Apply sorting
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle string comparison
        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [patients, searchQuery, locationFilter, sortField, sortDirection]);

  // Get sort icon for column
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-neutral-400" />;
    }
    if (sortDirection === "asc") {
      return <ChevronUp className="w-4 h-4 text-primary-600" />;
    }
    return <ChevronDown className="w-4 h-4 text-primary-600" />;
  };

  return (
    <ProviderLayout
      activeMenu="patients"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Patients</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            View and manage patient information
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by patient ID, name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder:text-neutral-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 text-sm"
            />
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter || ""}
            onChange={(e) => setLocationFilter(e.target.value || null)}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600 text-sm font-medium"
          >
            <option key="all-locations" value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* Results count */}
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {filteredAndSortedPatients.length} of {patients.length} patients
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("id")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Patient ID
                      {getSortIcon("id")}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("name")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Patient name
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("locationName")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Location
                      {getSortIcon("locationName")}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("email")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Email
                      {getSortIcon("email")}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("phone")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Contact number
                      {getSortIcon("phone")}
                    </button>
                  </th>
                  <th className="text-left px-6 py-4">
                    <button
                      onClick={() => handleSort("appointmentCount")}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Total appointments
                      {getSortIcon("appointmentCount")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-neutral-500 dark:text-neutral-400">
                        <p className="text-sm font-medium">No patients found</p>
                        <p className="text-sm mt-1">
                          {searchQuery || locationFilter
                            ? "Try adjusting your search or filters"
                            : "No patients available"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedPatients.map((patient, index) => (
                    <tr
                      key={patient.id}
                      className={`border-b border-neutral-200 dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                        index % 2 === 0 ? "" : "bg-neutral-50/50 dark:bg-neutral-800/20"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.patientId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewPatient(patient.id)}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors font-medium text-left"
                        >
                          {patient.name}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.locationName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.appointmentCount}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}