import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Plus, FolderOpen, DollarSign, Clock, Users, MapPin, Globe, Search, Filter, X, ChevronDown, Calendar, HelpCircle, BookOpen, ChevronUp } from "lucide-react";
import { Pagination } from "../shared/Pagination";

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

interface ServiceDuration {
  id: string;
  duration: number; // in minutes
  recoveryTime: number; // buffer time in minutes
  price: number;
}

interface Service {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  durations: ServiceDuration[];
  locationIds: string[];
  providerIds: string[];
  allowOnlineBooking: boolean;
  isActive: boolean;
  createdAt?: string;
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

interface ServicesListScreenProps {
  categories: ServiceCategory[];
  services: Service[];
  locations: Location[];
  providers: Provider[];
  onNavigate: (menu: string) => void;
  onAddCategory: () => void;
  onEditCategory: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAddService: (categoryId: string) => void;
  onEditService: (serviceId: string) => void;
  onDeleteService: (serviceId: string) => void;
  onLogout?: () => void;
}

export function ServicesListScreen({
  categories,
  services,
  locations,
  providers,
  onNavigate,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddService,
  onEditService,
  onDeleteService,
  onLogout,
}: ServicesListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, locationFilter]);

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getLocationNames = (locationIds: string[]) => {
    return locationIds
      .map((id) => locations.find((l) => l.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const getMinPrice = (durations: ServiceDuration[]) => {
    if (durations.length === 0) return 0;
    return Math.min(...durations.map((d) => d.price));
  };

  const getMaxPrice = (durations: ServiceDuration[]) => {
    if (durations.length === 0) return 0;
    return Math.max(...durations.map((d) => d.price));
  };

  const formatPriceRange = (service: Service) => {
    const min = getMinPrice(service.durations);
    const max = getMaxPrice(service.durations);
    
    const format = (price: number) => 
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

    if (min === max) {
      return format(min);
    }
    return `${format(min)} - ${format(max)}`;
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
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(service.categoryId).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : 
      (statusFilter === "Active" && service.isActive) || 
      (statusFilter === "Inactive" && !service.isActive);
    
    const matchesLocation = locationFilter === "all" ? true :
      service.locationIds.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "price") {
      const priceA = getMinPrice(a.durations);
      const priceB = getMinPrice(b.durations);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
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
    <ClinicAdminLayout onNavigate={onNavigate} activeMenu="master" onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Services</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage clinical services, pricing structures, and branch assignments
            </p>
          </div>
          <button
            onClick={() => onAddService("")}
            className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add service
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by service name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
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
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Status Filter */}
                    <div>
                      <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["all", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              statusFilter === status
                                ? "bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400"
                                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50"
                            }`}
                          >
                            {status === "all" ? "All" : status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest block mb-2">
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
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Table */}
        {paginatedServices.length > 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
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
                        Service Name
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
                        Price Range
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                          <Calendar className="w-4 h-4 opacity-50" />
                          {formatDate(service.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {service.name}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5 line-clamp-1">
                            {getCategoryName(service.categoryId)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg">
                          {formatPriceRange(service)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            service.isActive
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 border border-success-100 dark:border-success-900/50"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedServices.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedServices.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-16 text-center">
            <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              No services found
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Get started by adding your first clinical service to the system"}
            </p>
            {!searchQuery && activeFilterCount === 0 && (
              <button
                onClick={() => onAddService("")}
                className="inline-flex items-center gap-2 h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-primary-500/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add new service
              </button>
            )}
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}