import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ServiceType {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

interface AddEditServiceTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ServiceType>) => void;
  serviceType: ServiceType | null;
}

export function AddEditServiceTypeDrawer({
  isOpen,
  onClose,
  onSave,
  serviceType,
}: AddEditServiceTypeDrawerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (serviceType) {
      setName(serviceType.name);
      setDescription(serviceType.description);
      setStatus(serviceType.status);
    } else {
      setName("");
      setDescription("");
      setStatus("Active");
    }
    setErrors({});
  }, [serviceType, isOpen]);

  const validate = () => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        status,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setStatus("Active");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {serviceType ? "Edit service type" : "Add service type"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Service Name */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Service name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={validate}
              placeholder="Enter service name"
              className={`h-10 w-full rounded-lg border ${
                errors.name
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              } bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20`}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={validate}
              placeholder="Enter service description"
              rows={4}
              className={`w-full rounded-lg border ${
                errors.description
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              } bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
              Status <span className="text-destructive">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
              className="h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white transition-[border-color,box-shadow] outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            onClick={handleClose}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            {serviceType ? "Save changes" : "Add service type"}
          </button>
        </div>
      </div>
    </>
  );
}
