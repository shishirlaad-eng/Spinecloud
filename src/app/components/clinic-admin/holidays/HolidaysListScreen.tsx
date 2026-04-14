import { ClinicAdminLayout } from "../layout/ClinicAdminLayout";
import { Calendar, Plus, Edit, Trash2, Building2 } from "lucide-react";
import { useState } from "react";

interface Branch {
  id: string;
  name: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  branches: string[]; // branch IDs, empty array means all branches
  isRecurring: boolean;
  createdAt: string;
}

interface HolidaysListScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
  branches: Branch[];
  holidays: Holiday[];
  onAddHoliday: (holiday: Omit<Holiday, "id" | "createdAt">) => void;
  onUpdateHoliday: (id: string, holiday: Omit<Holiday, "id" | "createdAt">) => void;
  onDeleteHoliday: (id: string) => void;
}

export function HolidaysListScreen({
  onNavigate,
  onLogout,
  branches,
  holidays,
  onAddHoliday,
  onUpdateHoliday,
  onDeleteHoliday,
}: HolidaysListScreenProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingHoliday(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteHoliday(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getBranchNames = (branchIds: string[]) => {
    if (branchIds.length === 0) return "All branches";
    return branchIds
      .map((id) => branches.find((b) => b.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const upcomingHolidays = sortedHolidays.filter(
    (h) => new Date(h.date) >= new Date()
  );

  const pastHolidays = sortedHolidays.filter(
    (h) => new Date(h.date) < new Date()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ClinicAdminLayout
      onNavigate={onNavigate}
      currentPage="holidays"
      onLogout={onLogout}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Holidays
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage clinic holidays and closures across branches
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add holiday
          </button>
        </div>

        {/* Upcoming Holidays */}
        {upcomingHolidays.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Upcoming holidays
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {upcomingHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-50 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                            {holiday.name}
                            {holiday.isRecurring && (
                              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                                (Recurring)
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(holiday.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-15">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {getBranchNames(holiday.branches)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(holiday)}
                        className="inline-flex items-center justify-center w-9 h-9 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        aria-label="Edit holiday"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(holiday.id)}
                        className="inline-flex items-center justify-center w-9 h-9 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Delete holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Holidays */}
        {pastHolidays.length > 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Past holidays
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {pastHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="px-6 py-4 opacity-60 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                            {holiday.name}
                            {holiday.isRecurring && (
                              <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                                (Recurring)
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {formatDate(holiday.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-15">
                        <Building2 className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          {getBranchNames(holiday.branches)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDeleteClick(holiday.id)}
                        className="inline-flex items-center justify-center w-9 h-9 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Delete holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {holidays.length === 0 && (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                No holidays added
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Add your first holiday to block bookings on specific dates
              </p>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add holiday
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Holiday Drawer */}
      {isDrawerOpen && (
        <AddEditHolidayDrawer
          holiday={editingHoliday}
          branches={branches}
          onClose={() => setIsDrawerOpen(false)}
          onSave={(holidayData) => {
            if (editingHoliday) {
              onUpdateHoliday(editingHoliday.id, holidayData);
            } else {
              onAddHoliday(holidayData);
            }
            setIsDrawerOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Delete holiday
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
              Are you sure you want to delete this holiday? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                Delete holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicAdminLayout>
  );
}

// Add/Edit Holiday Drawer Component
interface AddEditHolidayDrawerProps {
  holiday: Holiday | null;
  branches: Branch[];
  onClose: () => void;
  onSave: (holiday: Omit<Holiday, "id" | "createdAt">) => void;
}

function AddEditHolidayDrawer({
  holiday,
  branches,
  onClose,
  onSave,
}: AddEditHolidayDrawerProps) {
  const [name, setName] = useState(holiday?.name || "");
  const [date, setDate] = useState(holiday?.date || "");
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    holiday?.branches || []
  );
  const [isRecurring, setIsRecurring] = useState(holiday?.isRecurring || false);
  const [applyToAllBranches, setApplyToAllBranches] = useState(
    !holiday || holiday.branches.length === 0
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleToggleBranch = (branchId: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Holiday name is required";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    if (!applyToAllBranches && selectedBranches.length === 0) {
      newErrors.branches = "Select at least one branch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      name: name.trim(),
      date,
      branches: applyToAllBranches ? [] : selectedBranches,
      isRecurring,
    });
  };

  const isFormValid =
    name.trim() !== "" &&
    date !== "" &&
    (applyToAllBranches || selectedBranches.length > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {holiday ? "Edit holiday" : "Add holiday"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {holiday
                ? "Update holiday information"
                : "Add a new holiday to block bookings"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Holiday Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
              >
                Holiday name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Christmas, New Year's Day"
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
              >
                Date <span className="text-destructive">*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow]"
              />
              {errors.date && (
                <p className="text-xs text-destructive mt-1">{errors.date}</p>
              )}
            </div>

            {/* Recurring */}
            <div className="flex items-center gap-2">
              <input
                id="isRecurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="isRecurring"
                className="text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                Recurring annually
              </label>
            </div>

            {/* Branch Selection */}
            <div>
              <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Apply to branches <span className="text-destructive">*</span>
              </label>

              <div className="space-y-3">
                {/* All Branches Option */}
                <label className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors">
                  <input
                    type="checkbox"
                    checked={applyToAllBranches}
                    onChange={(e) => {
                      setApplyToAllBranches(e.target.checked);
                      if (e.target.checked) {
                        setSelectedBranches([]);
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-900 dark:text-white">
                    All branches
                  </span>
                </label>

                {/* Individual Branches */}
                {!applyToAllBranches && (
                  <div className="space-y-2 pl-4 border-l-2 border-neutral-200 dark:border-neutral-800">
                    {branches.map((branch) => (
                      <label
                        key={branch.id}
                        className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => handleToggleBranch(branch.id)}
                          className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-900 dark:text-white">
                          {branch.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {errors.branches && (
                <p className="text-xs text-destructive mt-1">{errors.branches}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onClose}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              {holiday ? "Update holiday" : "Add holiday"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
