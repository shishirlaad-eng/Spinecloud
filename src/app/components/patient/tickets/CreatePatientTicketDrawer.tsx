import { useState } from "react";
import { X } from "lucide-react";

interface CreatePatientTicketDrawerProps {
  onClose: () => void;
  onSubmit: (ticketData: {
    category: string;
    subject: string;
    description: string;
    priority: "Low" | "Medium" | "High";
  }) => void;
}

export function CreatePatientTicketDrawer({
  onClose,
  onSubmit,
}: CreatePatientTicketDrawerProps) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");

  const [errors, setErrors] = useState({
    category: "",
    subject: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      category: "",
      subject: "",
      description: "",
    };

    let isValid = true;

    if (!category) {
      newErrors.category = "This field is required";
      isValid = false;
    }

    if (!subject.trim()) {
      newErrors.subject = "This field is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        category,
        subject,
        description,
        priority,
      });
    }
  };

  const isFormValid =
    category && subject.trim() && description.trim();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Create ticket
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Submit a support request to the clinic
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors({ ...errors, category: "" });
              }}
              onBlur={() => {
                if (!category) {
                  setErrors({ ...errors, category: "This field is required" });
                }
              }}
              className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                errors.category
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <option value="">Select category</option>
              <option value="Appointment">Appointment</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Medical Records">Medical Records</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-xs text-destructive mt-1">{errors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Priority <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPriority("Low")}
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  priority === "Low"
                    ? "bg-neutral-100 border-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setPriority("Medium")}
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  priority === "Medium"
                    ? "bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950/30 dark:border-amber-700 dark:text-amber-400"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setPriority("High")}
                className={`h-10 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  priority === "High"
                    ? "bg-destructive/10 border-destructive text-destructive dark:bg-destructive/20 dark:border-destructive"
                    : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                High
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Subject <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors({ ...errors, subject: "" });
              }}
              onBlur={() => {
                if (!subject.trim()) {
                  setErrors({ ...errors, subject: "This field is required" });
                }
              }}
              placeholder="Enter ticket subject"
              className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                errors.subject
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-destructive mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              onBlur={() => {
                if (!description.trim()) {
                  setErrors({ ...errors, description: "This field is required" });
                }
              }}
              placeholder="Describe your issue in detail"
              rows={6}
              className={`w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none ${
                errors.description
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Create ticket
          </button>
        </div>
      </div>
    </>
  );
}
