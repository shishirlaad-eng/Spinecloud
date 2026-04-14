import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Plus, FolderOpen, Edit, Trash2, DollarSign, Clock, Users, MapPin, Globe, Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
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
  const [bookingFilter, setBookingFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, bookingFilter]);

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

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCategoryName(service.categoryId).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" ? true : 
      (statusFilter === "Active" && service.isActive) || 
      (statusFilter === "Inactive" && !service.isActive);
    const matchesBooking = bookingFilter === "all" ? true : 
      (bookingFilter === "Online" && service.allowOnlineBooking) || 
      (bookingFilter === "In-person" && !service.allowOnlineBooking);

    return matchesSearch && matchesStatus && matchesBooking;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      // Sort by price
      const priceA = getMinPrice(a.durations);
      const priceB = getMinPrice(b.durations);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedServices = sortedServices.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field: "name" | "price") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = 
    (statusFilter !== "all" ? 1 : 0) + 
    (bookingFilter !== "all" ? 1 : 0);

  const toggleExpand = (serviceId: string) => {
    setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
  };

  return (
    <ClinicAdminLayout onNavigate={onNavigate} activeMenu="master" onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Services</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage services, pricing, durations, and provider assignments
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
              placeholder="Search services..."
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
              <div className="absolute right-0 top-12 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
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
                        {["all", "Active", "Inactive"].map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2 cursor-pointer"
                          >
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

                    {/* Booking Type Filter */}
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Booking type
                      </label>
                      <div className="space-y-2">
                        {["all", "Online", "In-person"].map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="booking"
                              checked={bookingFilter === type}
                              onChange={() => setBookingFilter(type)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {type === "all" ? "All types" : type}
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
                        setBookingFilter("all");
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

        {/* Services Table */}
        {paginatedServices.length > 0 ? (
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
                        Service name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-2">
                        Price range
                        {sortBy === "price" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Providers
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Locations
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {paginatedServices.map((service) => {
                    const isExpanded = expandedServiceId === service.id;
                    
                    const rows = [
                      <tr
                        key={service.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleExpand(service.id)}
                              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              )}
                            </button>
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                {service.name}
                              </p>
                              {service.allowOnlineBooking && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium">
                                  <Globe className="w-3 h-3" />
                                  Online booking
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {formatPriceRange(service)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {service.providerIds.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {service.locationIds.length}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${
                              service.isActive
                                ? "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEditService(service.id)}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                              title="Edit service"
                            >
                              <Edit className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                            </button>
                            <button
                              onClick={() => onDeleteService(service.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ];

                    // Add expanded row if service is expanded
                    if (isExpanded) {
                      rows.push(
                        <tr key={`${service.id}-expanded`} className="bg-neutral-50 dark:bg-neutral-950">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="space-y-3">
                              {/* Duration & Pricing Tiers */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                                  Duration & pricing tiers
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {service.durations.map((duration) => (
                                    <div
                                      key={duration.id}
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm"
                                    >
                                      <Clock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                      <span className="text-neutral-900 dark:text-white font-medium">
                                        {duration.duration} min
                                      </span>
                                      {duration.recoveryTime > 0 && (
                                        <span className="text-neutral-600 dark:text-neutral-400">
                                          +{duration.recoveryTime} recovery
                                        </span>
                                      )}
                                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                                        {new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                        }).format(duration.price)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Locations */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                                  Assigned locations
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {service.locationIds.length > 0
                                    ? getLocationNames(service.locationIds)
                                    : "No locations assigned"}
                                </p>
                              </div>

                              {/* Providers */}
                              <div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                                  Assigned providers
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {service.providerIds.length} provider{service.providerIds.length !== 1 ? "s" : ""} assigned
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return rows;
                  })}
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
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12 text-center">
            <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              No services found
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "Get started by creating your first service"}
            </p>
            {!searchQuery && activeFilterCount === 0 && (
              <button
                onClick={() => onAddService("")}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add service
              </button>
            )}
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}