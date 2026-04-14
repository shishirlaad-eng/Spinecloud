import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, Filter, ArrowUpDown, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Pagination } from "../shared/Pagination";

interface Patient {
  id: string;
  patientId: string; // Sequential ID like 00001, 00002
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  registeredDate: string;
  lastVisit: string;
  upcomingAppointment?: string;
  status: "Active" | "Inactive" | "Link sent";
  totalAppointments: number;
  outstandingAmount?: number;
  lastUpdated?: string;
  addedDate: string; // NEW: Track when patient was added
  tag: "staff" | "self-signup" | "link-sent"; // How the patient was added
  insurance?: {
    provider: string;
    policyNumber: string;
  };
}

interface PatientsListScreenProps {
  patients: Patient[];
  onNavigate: (menu: string) => void;
  onViewPatient: (patientId: string) => void;
  onAddPatient?: () => void;
  onLogout?: () => void;
}

export function PatientsListScreen({
  patients,
  onNavigate,
  onViewPatient,
  onAddPatient,
  onLogout,
}: PatientsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive" | "Link sent">("all");
  const [tagFilter, setTagFilter] = useState<"all" | "staff" | "self-signup" | "link-sent">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "email" | "location" | "lastUpdated" | "outstandingAmount" | "addedDate">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, tagFilter]);

  // Filter patients based on search, status, and tag
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchQuery === "" ||
      `${patient.firstName} ${patient.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || patient.status === statusFilter;

    const matchesTag =
      tagFilter === "all" || patient.tag === tagFilter;

    return matchesSearch && matchesStatus && matchesTag;
  });

  // Sort filtered patients
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
        compareValue = `${a.address?.city || ""}, ${a.address?.state || ""}`.localeCompare(`${b.address?.city || ""}, ${b.address?.state || ""}`);
        break;
      case "lastUpdated":
        compareValue = new Date(a.lastUpdated || a.registeredDate).getTime() - new Date(b.lastUpdated || b.registeredDate).getTime();
        break;
      case "addedDate":
        compareValue = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
        break;
      case "outstandingAmount":
        compareValue = (a.outstandingAmount || 0) - (b.outstandingAmount || 0);
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
    (tagFilter !== "all" ? 1 : 0);

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <ClinicAdminLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
                Patients
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manage and view all patient records
              </p>
            </div>
            {onAddPatient && (
              <button
                onClick={onAddPatient}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add patient
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={() => console.log("Exporting patients...")}
              className="inline-flex items-center gap-2 h-10 px-4 border rounded-lg font-medium transition-colors text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 h-10 px-4 border rounded-lg font-medium transition-colors text-sm ${
                  activeFilterCount > 0
                    ? "bg-primary-50 dark:bg-primary-950/30 border-primary-600 text-primary-700 dark:text-primary-300"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
                <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
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
                      {/* Status Filter */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                          Status
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: "all", label: "All statuses" },
                            { value: "Active", label: "Active" },
                            { value: "Inactive", label: "Inactive" },
                            { value: "Link sent", label: "Link sent" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="status"
                                checked={statusFilter === option.value}
                                onChange={() =>
                                  setStatusFilter(option.value as typeof statusFilter)
                                }
                                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                              />
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tag Filter */}
                      <div>
                        <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                          Tag
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: "all", label: "All tags" },
                            { value: "staff", label: "Added by staff" },
                            { value: "self-signup", label: "Self-signup" },
                            { value: "link-sent", label: "Link sent" },
                          ].map((option) => (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="tag"
                                checked={tagFilter === option.value}
                                onChange={() =>
                                  setTagFilter(option.value as typeof tagFilter)
                                }
                                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                              />
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                {option.label}
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
                          setTagFilter("all");
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
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Showing {sortedPatients.length} of {patients.length} patients
          </p>
        </div>

        {/* Patients Table */}
        {sortedPatients.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No patients found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              {searchQuery || statusFilter !== "all" || tagFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No patients have been registered yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Name
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("email")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Email
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("location")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Location
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("outstandingAmount")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Outstanding amount
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("addedDate")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Added date
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("lastUpdated")}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        Last update
                        <ArrowUpDown className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                      Tag
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                    >
                      {/* Patient ID */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {patient.patientId}
                        </p>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onViewPatient(patient.id)}
                          className="text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">
                            {patient.firstName} {patient.lastName}
                          </p>
                        </button>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-[200px]">
                          {patient.email}
                        </p>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.phone}
                        </p>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {patient.address?.city && patient.address?.state 
                            ? `${patient.address.city}, ${patient.address.state}` 
                            : "N/A"}
                        </p>
                      </td>

                      {/* Outstanding Amount */}
                      <td className="px-6 py-4">
                        <p className={`text-sm font-medium ${
                          (patient.outstandingAmount || 0) > 0
                            ? "text-destructive"
                            : "text-neutral-600 dark:text-neutral-400"
                        }`}>
                          {formatCurrency(patient.outstandingAmount)}
                        </p>
                      </td>

                      {/* Added Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(patient.addedDate)}
                        </p>
                      </td>

                      {/* Last Updated */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(patient.lastUpdated || patient.registeredDate)}
                        </p>
                      </td>

                      {/* Tag */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            patient.tag === "staff"
                              ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                              : patient.tag === "link-sent"
                              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              : "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                          }`}
                        >
                          {patient.tag === "staff" 
                            ? "Added by staff" 
                            : patient.tag === "link-sent"
                            ? "Link sent"
                            : "Self-signup"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                            patient.status === "Active"
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-300"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
        )}
      </div>
    </ClinicAdminLayout>
  );
}