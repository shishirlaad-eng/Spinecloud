import { useState, useRef } from "react";
import { X, Paperclip, Trash2, FileText } from "lucide-react";

interface RaiseTicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: {
    category: string;
    subject: string;
    description: string;
    attachments?: File[];
  }) => void;
}

const ticketCategories = [
  "Technical Issue",
  "Billing",
  "Feature Request",
  "Bug Report",
  "Compliance",
  "Account Management",
  "Training Request",
  "Security Concern",
  "Data Migration",
  "General Inquiry",
];

export function RaiseTicketDrawer({
  isOpen,
  onClose,
  onSubmit,
}: RaiseTicketDrawerProps) {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!category) newErrors.category = "Please select a category";
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        category,
        subject: subject.trim(),
        description: description.trim(),
        attachments: attachments.length > 0 ? attachments : undefined
      });
      // Reset form
      setCategory("");
      setSubject("");
      setDescription("");
      setAttachments([]);
      setErrors({});
    }
  };

  const handleClose = () => {
    setCategory("");
    setSubject("");
    setDescription("");
    setAttachments([]);
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
              Raise a ticket to super admin
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Submit a support request to the super admin team
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
        <div className="p-5 space-y-6 pb-24">
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

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Attachments
            </label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-primary-600 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all group"
            >
              <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-900 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                <Paperclip className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">Click to upload or drag & drop files</span>
              <span className="text-[10px] text-neutral-400">Max size: 5MB per file</span>
            </button>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="p-1.5 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {file.name}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-neutral-400 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 right-0 w-full md:w-[600px] bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 z-10">
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
            Submit ticket
          </button>
        </div>
      </div>
    </>
  );
}
