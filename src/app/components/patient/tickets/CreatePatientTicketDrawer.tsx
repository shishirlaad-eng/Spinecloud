import { useState, useRef } from "react";
import { X, Paperclip, AlertCircle, ChevronDown } from "lucide-react";

interface CreatePatientTicketDrawerProps {
  onClose: () => void;
  onSubmit: (ticketData: {
    category: string;
    subject: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    attachments?: File[];
  }) => void;
}

const CATEGORIES = [
  "Appointment",
  "Billing",
  "Technical",
  "Medical Records",
  "General Inquiry",
  "Other",
];

const PRIORITIES: { value: "Low" | "Medium" | "High"; label: string; color: string }[] = [
  { value: "Low",    label: "Low",    color: "text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400" },
  { value: "Medium", label: "Medium", color: "text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400" },
  { value: "High",   label: "High",   color: "text-red-700 bg-red-50 dark:bg-red-950/30 dark:text-red-400" },
];

export function CreatePatientTicketDrawer({
  onClose,
  onSubmit,
}: CreatePatientTicketDrawerProps) {
  const [category,    setCategory]    = useState("");
  const [subject,     setSubject]     = useState("");
  const [description, setDescription] = useState("");
  const [priority,    setPriority]    = useState<"Low" | "Medium" | "High">("Medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState({ category: "", subject: "", description: "" });

  const validateForm = () => {
    const newErrors = { category: "", subject: "", description: "" };
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
      onSubmit({ category, subject, description, priority, attachments });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => {
      const combined = [...prev, ...files];
      // Limit to 5 files
      return combined.slice(0, 5);
    });
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isFormValid = category && subject.trim() && description.trim();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Category + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrors({ ...errors, category: "" });
                  }}
                  onBlur={() => {
                    if (!category) setErrors({ ...errors, category: "This field is required" });
                  }}
                  className={`w-full h-10 pl-3 pr-8 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none appearance-none transition-[border-color,box-shadow] ${
                    errors.category ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              </div>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.category}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Priority
              </label>
              <div className="flex gap-1.5">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 h-10 rounded-lg text-xs font-semibold border transition-all ${
                      priority === p.value
                        ? `${p.color} border-current ring-2 ring-offset-1 ring-current/20`
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors({ ...errors, subject: "" });
              }}
              onBlur={() => {
                if (!subject.trim()) setErrors({ ...errors, subject: "This field is required" });
              }}
              placeholder="Enter ticket subject"
              className={`w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] ${
                errors.subject ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
              }`}
            />
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.subject}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              onBlur={() => {
                if (!description.trim()) setErrors({ ...errors, description: "This field is required" });
              }}
              placeholder="Describe your issue in detail"
              rows={5}
              className={`w-full px-3 py-2.5 bg-neutral-50 dark:bg-neutral-900 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none ${
                errors.description ? "border-red-500" : "border-neutral-200 dark:border-neutral-800"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Attachments
              <span className="ml-1.5 text-xs font-normal text-neutral-400">(optional, max 5 files)</span>
            </label>

            {/* Drop zone / click to upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= 5}
              className="w-full flex items-center gap-3 px-4 py-3 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/50 transition-colors">
                <Paperclip className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {attachments.length >= 5 ? "Maximum files reached" : "Click to attach files"}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  PNG, JPG, PDF, DOCX — up to 10 MB each
                </p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Attachment chips */}
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="flex-1 text-xs text-neutral-700 dark:text-neutral-300 truncate font-medium">
                      {file.name}
                    </span>
                    <span className="text-xs text-neutral-400 shrink-0">
                      {formatFileSize(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="w-5 h-5 flex items-center justify-center rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
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
            className="h-10 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary-600/20"
          >
            Create ticket
          </button>
        </div>
      </div>
    </>
  );
}
