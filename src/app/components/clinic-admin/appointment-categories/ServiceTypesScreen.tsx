import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { Plus, Search, Filter, ArrowUpDown, X, FolderOpen } from "lucide-react";
import { AddEditServiceTypeDrawer } from "./AddEditServiceTypeDrawer";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface ServiceTypesScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function ServiceTypesScreen({
  onNavigate,
  onLogout,
}: ServiceTypesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "createdAt" | "updatedAt">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);

  // Mock data - replace with actual data from backend
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([
    {
      id: "type-1",
      name: "Initial consultation",
      description: "First-time patient visit for assessment and diagnosis",
      status: "Active",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "type-2",
      name: "Follow-up",
      description: "Subsequent visit to monitor progress and adjust treatment",
      status: "Active",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "type-3",
      name: "Therapy session",
      description: "Therapeutic treatment sessions",
      status: "Active",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "type-4",
      name: "Chiropractic adjustment",
      description: "Chiropractic adjustment sessions",
      status: "Active",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "type-5",
      name: "X-ray imaging",
      description: "Diagnostic X-ray imaging service",
      status: "Active",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  // Filter service types
  const filteredTypes = serviceTypes.filter((type) => {
    const matchesSearch =
      searchQuery === "" ||
      type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      type.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || type.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort filtered types
  const sortedTypes = [...filteredTypes].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;
      case "createdAt":
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
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

  const handleAdd = () => {
    setSelectedType(null);
    setShowDrawer(true);
  };

  const handleEdit = (type: ServiceType) => {
    setSelectedType(type);
    setShowDrawer(true);
  };

  const handleSave = (data: Partial<ServiceType>) => {
    if (selectedType) {
      // Update existing
      setServiceTypes((prev) =>
        prev.map((t) =>
          t.id === selectedType.id
            ? {
                ...t,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      // Add new
      setServiceTypes((prev) => [
        ...prev,
        {
          id: `type-${Date.now()}`,
          ...data,
          status: data.status || "Active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as ServiceType,
      ]);
    }
    setShowDrawer(false);
  };

  const handleToggleStatus = (id: string) => {
    setServiceTypes((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Active" ? "Inactive" : "Active",
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ClinicAdminLayout activeMenu="master" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Service types
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Configure available service types for bookings
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search service types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 outline-none transition-[border-color,box-shadow]"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg font-medium text-sm transition-colors ${
              showFilters
                ? "bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400"
                : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add service type
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setShowFilters(false);
                }}
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20"
                >
                  <option value="all">All statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Service Types List */}
        {sortedTypes.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-12">
            <div className="text-center">
              <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                No service types found
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first service type"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Service name
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("updatedAt")}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Last updated
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {sortedTypes.map((type) => (
                    <tr
                      key={type.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">
                          {type.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {type.description}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(type.id)}
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                            type.status === "Active"
                              ? "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800 hover:bg-success-100 dark:hover:bg-success-950/50"
                              : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                          }`}
                        >
                          {type.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(type.updatedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(type)}
                          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Drawer */}
      <AddEditServiceTypeDrawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setSelectedType(null);
        }}
        onSave={handleSave}
        serviceType={selectedType}
      />
    </ClinicAdminLayout>
  );
}
