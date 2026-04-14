import { useState } from "react";
import { X } from "lucide-react";

interface CreateTicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: {
    category: string;
    subject: string;
    description: string;
    priority: string;
  }) => void;
}

const ticketCategories = [
  "Technical Issue",
  "Billing",
  "Account Request",
  "Scheduling",
  "Maintenance",
  "Feature Request",
  "Bug Report",
  "General Inquiry",
  "Security Concern",
  "Training Request",
];

const priorities = ["Low", "Medium", "High", "Urgent"];

export function CreateTicketDrawer({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketDrawerProps) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!category) newErrors.category = "Please select a category";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority,
      });
      // Reset form
      setCategory("");
      setSubject("");
      setDescription("");
      setPriority("Medium");
      setErrors({});
    }
  };

  const handleClose = () => {
    setCategory("");
    setSubject("");
    setDescription("");
    setPriority("Medium");
    setErrors({});
    onClose();
  };

  const isFormValid = category && subject.trim() && description.trim();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Create new ticket
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Submit a support request or issue
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6">
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
              className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                errors.category
                  ? "border-destructive"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <option value="">Select category</option>
              {ticketCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
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
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    priority === p
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {p}
                </button>
              ))}
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
              placeholder="Brief description of the issue"
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
              placeholder="Provide detailed information about your request or issue..."
              rows={8}
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

          {/* Info Box */}
          <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              <span className="font-semibold">Note:</span> Once submitted, your ticket will be
              assigned to the appropriate team. You'll receive updates via email and can track
              the progress in the ticket management system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            Create ticket
          </button>
        </div>
      </div>
    </>
  );
}
