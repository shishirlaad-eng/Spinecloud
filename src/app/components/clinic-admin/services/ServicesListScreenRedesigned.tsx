import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { 
  Plus, 
  Search, 
  FolderOpen, 
  MapPin, 
  Calendar,
  ChevronDown,
  Filter,
  X
} from "lucide-react";
import { Pagination } from "@/app/components/shared/Pagination";

interface ProcedurePhase {
  id: string;
  duration: number; // in minutes
  providerRequired: boolean; // true = ACTIVE, false = PASSIVE
}

interface BookingWindow {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  slotCapacity: number;
}

interface Service {
  id: string;
  name: string;
  roomId: string; // Room selection
  phases: ProcedurePhase[]; // Procedure phases
  price: number;
  providerIds: string[];
  locationIds: string[]; // Changed from locationId to locationIds (array)
  allowOnlineBooking: boolean;
  bookingStartTime: string; // HH:MM format
  bookingEndTime: string; // HH:MM format
  bookingWindows?: BookingWindow[]; // Support for multiple windows
  slotCapacity: number;
  isActive: boolean;
  questionnaireId?: string; // Attached questionnaire
  createdAt: string;
  updatedAt: string;
}

interface Questionnaire {
  id: string;
  categoryName: string;
}

interface Location {
  id: string;
  name: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
}

interface Room {
  id: string;
  roomId: string; // Room identifier like "R-001", "R-002"
  roomName: string;
  roomType: string;
  cleanupTime: number; // in minutes
  status: "Active" | "Inactive";
  notes?: string;
}

interface ServicesListScreenRedesignedProps {
  services: Service[];
  locations: Location[];
  providers: Provider[];
  rooms: Room[]; // Add rooms prop
  questionnaires: Questionnaire[]; // New prop for questionnaires
  onNavigate: (menu: string) => void;
  onAddService: () => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
  onLogout?: () => void;
}

export function ServicesListScreenRedesigned({
  services,
  locations,
  providers,
  rooms,
  questionnaires,
  onNavigate,
  onAddService,
  onEditService,
  onDeleteService,
  onLogout,
}: ServicesListScreenRedesignedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<"name" | "price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const getLocationNames = (locationIds: string[]) => {
    return locationIds
      .map((id) => locations.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || (statusFilter === "Active" ? service.isActive : !service.isActive);
    
    const matchesLocation = locationFilter === "all" || service.locationIds.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedServices = sortedServices.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field: "name" | "price" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    (locationFilter !== "all" ? 1 : 0);

  return (
    <ClinicAdminLayout activeMenu="services" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Services
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Manage clinical services, pricing structures, and branch assignments
                </p>
              </div>
              <button
                onClick={onAddService}
                className="inline-flex items-center gap-2 h-10 px-5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:scale-95 transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
              >
                <Plus className="w-4 h-4" />
                Add service
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search by service name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-all"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 h-11 border rounded-xl transition-all font-bold text-sm ${
                    activeFilterCount > 0
                      ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {showFilters && (
                  <div className="absolute right-0 top-13 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                          Filters
                        </h3>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {/* Status Filter */}
                        <div>
                          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block mb-2">
                            Status
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["all", "Active", "Inactive"].map((status) => (
                              <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  statusFilter === status
                                    ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-950/30 dark:border-primary-800 dark:text-primary-400"
                                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                                }`}
                              >
                                {status === "all" ? "All" : status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Location Filter */}
                        <div>
                          <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider block mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <select
                              value={locationFilter}
                              onChange={(e) => setLocationFilter(e.target.value)}
                              className="w-full h-10 px-3 pr-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                            >
                              <option value="all">All locations</option>
                              {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>
                                  {loc.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => {
                            setStatusFilter("all");
                            setLocationFilter("all");
                          }}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-bold transition-colors"
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
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-8">
          {paginatedServices.length === 0 ? (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-20 text-center shadow-sm">
              <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {searchQuery ? "No services found" : "No services yet"}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-xs mx-auto">
                {searchQuery
                  ? "Try adjusting your search query or filters to find the service you're looking for."
                  : "Get started by creating your first clinical service to manage appointments and pricing."}
              </p>
              {!searchQuery && (
                <button
                  onClick={onAddService}
                  className="inline-flex items-center gap-2 h-11 px-6 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-95 transition-all font-bold text-sm shadow-lg shadow-primary-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Add new service
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th 
                      className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        Created Date
                        {sortBy === "createdAt" && (
                          <span className="text-primary-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Service
                        {sortBy === "name" && (
                          <span className="text-primary-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-2">
                        Price
                        {sortBy === "price" && (
                          <span className="text-primary-600">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Location
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {paginatedServices.map((service) => (
                    <tr
                      key={service.id}
                      className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors cursor-pointer"
                      onClick={() => onEditService(service.id)}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                          <Calendar className="w-4 h-4 opacity-50" />
                          {formatDate(service.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                          {service.name}
                        </p>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50">
                          {formatPrice(service.price)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400 max-w-[150px] truncate">
                            {service.locationIds.length > 0
                              ? getLocationNames(service.locationIds)
                              : "No locations assigned"}
                          </span>
                          {service.locationIds.length > 1 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-bold text-neutral-500">
                              +{service.locationIds.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            service.isActive
                              ? "bg-success-50 text-success-700 border border-success-100 dark:bg-success-950/30 dark:text-success-400 dark:border-success-900/50"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                totalItems={sortedServices.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                totalPages={Math.ceil(sortedServices.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>
    </ClinicAdminLayout>
  );
}