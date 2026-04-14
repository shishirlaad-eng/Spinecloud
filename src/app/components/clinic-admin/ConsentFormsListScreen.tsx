import { useState, useEffect } from "react";
import { Search, Plus, FileText, Calendar, Filter, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { TooltipBubble } from "../shared/TooltipBubble";
import { isStepCompleted } from "../shared/walkthroughUtils";
import { Pagination } from "../shared/Pagination";

interface ConsentForm {
  id: string;
  title: string;
  content: string;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

interface ConsentFormsListScreenProps {
  forms: ConsentForm[];
  onNavigate: (menu: string) => void;
  onAdd: () => void;
  onEdit: (form: ConsentForm) => void;
  onLogout?: () => void;
}

export function ConsentFormsListScreen({
  forms,
  onNavigate,
  onAdd,
  onEdit,
  onLogout,
}: ConsentFormsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateAddedRange, setDateAddedRange] = useState<string>("all");
  const [updatedDateRange, setUpdatedDateRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"title" | "status" | "createdAt" | "updatedAt">("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateAddedRange, updatedDateRange]);

  useEffect(() => {
    setActiveGuide(localStorage.getItem("spinecloud_active_guide"));
    setBubbleDismissed(localStorage.getItem("spinecloud_bubble_dismissed_consents") === "true");
  }, []);

  const handleDismissBubble = () => {
    setBubbleDismissed(true);
    localStorage.setItem("spinecloud_bubble_dismissed_consents", "true");
  };

  // Filter forms
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;

    // Date added filter
    let matchesDateAdded = true;
    if (dateAddedRange !== "all") {
      const createdDate = new Date(form.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateAddedRange === "7days") matchesDateAdded = daysDiff <= 7;
      else if (dateAddedRange === "30days") matchesDateAdded = daysDiff <= 30;
      else if (dateAddedRange === "90days") matchesDateAdded = daysDiff <= 90;
    }

    // Updated date filter
    let matchesUpdatedDate = true;
    if (updatedDateRange !== "all") {
      const updatedDate = new Date(form.updatedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (updatedDateRange === "7days") matchesUpdatedDate = daysDiff <= 7;
      else if (updatedDateRange === "30days") matchesUpdatedDate = daysDiff <= 30;
      else if (updatedDateRange === "90days") matchesUpdatedDate = daysDiff <= 90;
    }

    return matchesSearch && matchesStatus && matchesDateAdded && matchesUpdatedDate;
  });

  // Sort forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortBy === "createdAt") {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "updatedAt") {
      comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedForms = sortedForms.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (field: "title" | "status" | "createdAt" | "updatedAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: "title" | "status" | "createdAt" | "updatedAt") => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (dateAddedRange !== "all" ? 1 : 0) +
    (updatedDateRange !== "all" ? 1 : 0);

  return (
    <ClinicAdminLayout activeMenu="consentForms" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Consent forms
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage agreement templates and consent forms
            </p>
          </div>
          {/* Add consent form button with guided tooltip bubble */}
          <div className="relative">
            <button
              onClick={onAdd}
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add consent form
            </button>
            <TooltipBubble
              step="Step 5"
              title="Configure consent forms"
              description="Click 'Add consent form' to upload or create mandatory consent documents for patient treatments."
              side="left"
              visible={!bubbleDismissed && (activeGuide === "consentForms" || (!isStepCompleted("consentForms") && activeGuide !== "skipped"))}
              onDismiss={handleDismissBubble}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search consent forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600 transition-[border-color,box-shadow]"
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
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Status Filter */}
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600"
                      >
                        <option value="all">All status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Date Added Range */}
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Date added
                      </label>
                      <select
                        value={dateAddedRange}
                        onChange={(e) => setDateAddedRange(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600"
                      >
                        <option value="all">All time</option>
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                      </select>
                    </div>

                    {/* Updated Date Range */}
                    <div>
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                        Last updated
                      </label>
                      <select
                        value={updatedDateRange}
                        onChange={(e) => setUpdatedDateRange(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-600"
                      >
                        <option value="all">All time</option>
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="90days">Last 90 days</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setDateAddedRange("all");
                          setUpdatedDateRange("all");
                        }}
                        className="w-full h-9 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          {paginatedForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mb-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                {searchQuery || activeFilterCount > 0
                  ? "No consent forms match your filters"
                  : "No consent forms created yet"}
              </p>
              {!searchQuery && activeFilterCount === 0 && (
                <button
                  onClick={onAdd}
                  className="mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add consent form
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      <th className="text-left px-6 py-3">
                        <button
                          onClick={() => handleSort("title")}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          Title
                          {getSortIcon("title")}
                        </button>
                      </th>
                      <th className="text-left px-6 py-3">
                        <button
                          onClick={() => handleSort("status")}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          Status
                          {getSortIcon("status")}
                        </button>
                      </th>
                      <th className="text-left px-6 py-3">
                        <button
                          onClick={() => handleSort("createdAt")}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          Date added
                          {getSortIcon("createdAt")}
                        </button>
                      </th>
                      <th className="text-left px-6 py-3">
                        <button
                          onClick={() => handleSort("updatedAt")}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                        >
                          Last updated
                          {getSortIcon("updatedAt")}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedForms.map((form) => (
                      <tr
                        key={form.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onEdit(form)}
                            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                              {form.title}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                              form.status === "Active"
                                ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400"
                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {form.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Calendar className="w-4 h-4" />
                            {formatDate(form.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(form.updatedAt)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                totalItems={sortedForms.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                totalPages={Math.ceil(sortedForms.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          )}
        </div>
      </div>
    </ClinicAdminLayout>
  );
}
