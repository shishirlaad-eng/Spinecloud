import { useState } from "react";
import { Search, Filter, X, Clock, FileText, ChevronRight, ArrowLeft, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Lock } from "lucide-react";
import { SOAPNotesContent } from "./SOAPNotesContent";

interface ClinicalNote {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  service: string;
  provider: string;
  createdDate: string;
  status: "draft" | "final";
}

interface ClinicalNotesTabContentProps {
  patientId: string;
  patientName: string;
  patientDateOfBirth: string;
  patientGender: string;
}

export function ClinicalNotesTabContent({
  patientId,
  patientName,
  patientDateOfBirth,
  patientGender,
}: ClinicalNotesTabContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Mock clinical notes data - In real app, fetch from backend based on patientId
  const mockClinicalNotes: ClinicalNote[] = [
    {
      id: "note-1",
      appointmentId: "apt-1",
      appointmentDate: "2025-02-10",
      service: "Initial Consultation",
      provider: "Dr. Sarah Johnson",
      createdDate: "2025-02-10T14:30:00",
      status: "final",
    },
    {
      id: "note-2",
      appointmentId: "apt-2",
      appointmentDate: "2025-02-05",
      service: "Follow-up Visit",
      provider: "Dr. Sarah Johnson",
      createdDate: "2025-02-05T10:15:00",
      status: "final",
    },
    {
      id: "note-3",
      appointmentId: "apt-3",
      appointmentDate: "2025-01-28",
      service: "Physical Therapy Session",
      provider: "Dr. Michael Chen",
      createdDate: "2025-01-28T16:45:00",
      status: "draft",
    },
    {
      id: "note-4",
      appointmentId: "apt-4",
      appointmentDate: "2025-01-22",
      service: "Initial Consultation",
      provider: "Dr. Sarah Johnson",
      createdDate: "2025-01-22T09:30:00",
      status: "final",
    },
  ];

  // Filter clinical notes
  const filteredNotes = mockClinicalNotes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.provider.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || note.status === statusFilter;

    let matchesDateFilter = true;
    if (dateFilter !== "all") {
      const noteDate = new Date(note.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case "this-week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDateFilter = noteDate >= weekAgo && noteDate <= today;
          break;
        }
        case "this-month": {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          matchesDateFilter = noteDate >= startOfMonth && noteDate <= endOfMonth;
          break;
        }
        case "last-3-months": {
          const threeMonthsAgo = new Date(today);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          matchesDateFilter = noteDate >= threeMonthsAgo && noteDate <= today;
          break;
        }
        case "last-6-months": {
          const sixMonthsAgo = new Date(today);
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          matchesDateFilter = noteDate >= sixMonthsAgo && noteDate <= today;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDateFilter;
  }).sort((a, b) => {
    // Sort by appointment date (most recent first)
    return new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

  // Active filter count
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (dateFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter("all");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "final":
        return "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "draft":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
    }
  };

  // If a note is selected, show detail view
  if (selectedNoteId) {
    const selectedNote = mockClinicalNotes.find((n) => n.id === selectedNoteId);
    if (!selectedNote) {
      setSelectedNoteId(null);
      return null;
    }

    return (
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedNoteId(null)}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-6"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to clinical notes
        </button>

        {/* Note Header */}
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                {selectedNote.service}
              </h3>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(selectedNote.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>By {selectedNote.provider}</span>
                </div>
              </div>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                selectedNote.status
              )}`}
            >
              {selectedNote.status === "final" ? (
                <>
                  <Lock className="w-3 h-3 inline mr-1" />
                  Finalized
                </>
              ) : (
                "Draft"
              )}
            </span>
          </div>
        </div>

        {/* SOAP Notes Content */}
        <SOAPNotesContent
          appointmentId={selectedNote.appointmentId}
          providerName={selectedNote.provider}
          isReadOnly={selectedNote.status === "final"}
          patientInfo={{
            name: patientName,
            dateOfBirth: patientDateOfBirth,
            gender: patientGender,
          }}
          appointmentInfo={{
            date: selectedNote.appointmentDate,
            time: "N/A", // Would come from appointment data
            service: selectedNote.service,
          }}
          onSave={(note) => {
            console.log("SOAP note saved:", note);
          }}
          onFinalize={(note) => {
            console.log("SOAP note finalized:", note);
            setSelectedNoteId(null);
          }}
        />
      </div>
    );
  }

  // List view
  return (
    <div className="p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search by service or provider"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
          />
        </div>

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
                      {[
                        { value: "all", label: "All statuses" },
                        { value: "final", label: "Finalized" },
                        { value: "draft", label: "Draft" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="status"
                            checked={statusFilter === option.value}
                            onChange={() => setStatusFilter(option.value)}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Date range
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "All dates" },
                        { value: "this-week", label: "This week" },
                        { value: "this-month", label: "This month" },
                        { value: "last-3-months", label: "Last 3 months" },
                        { value: "last-6-months", label: "Last 6 months" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="dateRange"
                            checked={dateFilter === option.value}
                            onChange={() => setDateFilter(option.value)}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full h-9 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
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

      {/* Clinical Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-900 dark:text-white">
            No clinical notes found
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {searchQuery || activeFilterCount > 0
              ? "Try adjusting your search or filters"
              : "This patient has no clinical notes"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {paginatedNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className="w-full border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all group text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Service & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {note.service}
                      </h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                          note.status
                        )}`}
                      >
                        {note.status === "final" ? (
                          <>
                            <Lock className="w-3 h-3 inline mr-1" />
                            Finalized
                          </>
                        ) : (
                          "Draft"
                        )}
                      </span>
                    </div>

                    {/* Appointment Date */}
                    <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(note.appointmentDate)}</span>
                      </div>
                    </div>

                    {/* Provider & Created Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <FileText className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <span>By {note.provider}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
                        <span>Created {formatDateTime(note.createdDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors shrink-0 mt-1" />
                </div>
              </button>
            ))}</div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-4">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Rows per page:
              </span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-4">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredNotes.length)} of{" "}
                {filteredNotes.length}
              </span>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 h-8 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 h-8 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
