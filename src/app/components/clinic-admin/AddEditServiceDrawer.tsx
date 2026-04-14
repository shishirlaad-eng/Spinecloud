import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  clinicLocations: string[]; // List of location IDs
  addedDate: string;
  lastUpdated: string;
  status: "Active" | "Inactive";
}

interface AddEditServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, "id" | "addedDate" | "lastUpdated">) => void;
  service?: Service | null;
  branches: { id: string; name: string }[];
}

export function AddEditServiceDrawer({
  isOpen,
  onClose,
  onSave,
  service,
  branches,
}: AddEditServiceDrawerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!service;
  const isViewMode = false; // Add state for view mode if needed

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setDuration(service.duration);
      setPrice(service.price);
      setStatus(service.status);
      setSelectedBranches(service.clinicLocations);
    } else {
      setName("");
      setDescription("");
      setDuration(30);
      setPrice(0);
      setStatus("Active");
      setSelectedBranches([]);
    }
    setErrors({});
  }, [service, isOpen]);

  const toggleBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      setSelectedBranches(selectedBranches.filter((id) => id !== branchId));
    } else {
      setSelectedBranches([...selectedBranches, branchId]);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (selectedBranches.length === 0) {
      newErrors.branches = "At least one branch must be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        name,
        description,
        duration,
        price,
        clinicLocations: selectedBranches,
        status,
      });
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white dark:bg-neutral-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            {isEditMode ? (isViewMode ? "Service details" : "Edit service") : "Add service"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Service Name */}
          <div>
            <label htmlFor="name" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Service name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isViewMode}
              className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter service name"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
              The public name for this service.
            </p>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Duration (minutes) <span className="text-destructive">*</span>
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                disabled={isViewMode}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="price" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                Price ($) <span className="text-destructive">*</span>
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                disabled={isViewMode}
                className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Branches */}
          <div>
            <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
              Available in branches <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {branches.map((branch) => (
                <label
                  key={branch.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedBranches.includes(branch.id)
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => toggleBranch(branch.id)}
                    disabled={isViewMode}
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    selectedBranches.includes(branch.id)
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                  }`}>
                    {selectedBranches.includes(branch.id) && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{branch.name}</span>
                </label>
              ))}
            </div>
            {errors.branches && (
              <p className="text-xs text-destructive mt-1">{errors.branches}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isViewMode}
              rows={4}
              className="flex min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Add a description for this service"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">Active status</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Inactive services cannot be selected for new appointments
              </p>
            </div>
            <button
              onClick={() => setStatus(status === "Active" ? "Inactive" : "Active")}
              disabled={isViewMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 ${
                status === "Active" ? "bg-primary-600" : "bg-neutral-200 dark:bg-neutral-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  status === "Active" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        {!isViewMode && (
          <div className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-end gap-3 z-10">
            <button
              onClick={handleClose}
              className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              {isEditMode ? "Save changes" : "Add service"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
