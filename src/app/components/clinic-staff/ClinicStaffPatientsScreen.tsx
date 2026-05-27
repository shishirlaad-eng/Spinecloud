import { useState, useEffect } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
import { Search, User, Plus } from "lucide-react";
import { Pagination } from "../shared/Pagination";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalAppointments: number;
}

interface ClinicStaffPatientsScreenProps {
  onNavigate: (menu: string) => void;
  onViewPatient: (patientId: string) => void;
  onAddPatient: () => void;
  patients?: Patient[];
  onLogout?: () => void;
}

export function ClinicStaffPatientsScreen({
  onNavigate,
  onViewPatient,
  onAddPatient,
  patients: propPatients,
  onLogout,
}: ClinicStaffPatientsScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Mock patients data (used if no patients prop provided)
  const mockPatients: Patient[] = [
    {
      id: "PT-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      location: "Downtown Clinic",
      totalAppointments: 5,
    },
    {
      id: "PT-002",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "(555) 234-5678",
      location: "Downtown Clinic",
      totalAppointments: 3,
    },
    {
      id: "PT-003",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "(555) 345-6789",
      location: "Westside Branch",
      totalAppointments: 8,
    },
    {
      id: "PT-004",
      name: "Robert Martinez",
      email: "robert.martinez@email.com",
      phone: "(555) 456-7890",
      location: "Downtown Clinic",
      totalAppointments: 2,
    },
    {
      id: "PT-005",
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      phone: "(555) 567-8901",
      location: "Eastside Clinic",
      totalAppointments: 6,
    },
    {
      id: "PT-006",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "(555) 678-9012",
      location: "Westside Branch",
      totalAppointments: 4,
    },
  ];

  const patients = propPatients || mockPatients;

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClinicStaffLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Patients
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            View patient information and manage invoices
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
            />
          </div>
          <button
            onClick={onAddPatient}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <Plus className="w-4 h-4" />
            Add patient
          </button>
        </div>

        {/* Patients Table */}
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Appointments
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => onViewPatient(patient.id)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900 dark:text-white">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {patient.location}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                        {patient.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white font-medium">
                        {patient.totalAppointments}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <User className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No patients found matching your search
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count and Pagination */}
        <Pagination
          totalItems={filteredPatients.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPatients.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </ClinicStaffLayout>
  );
}