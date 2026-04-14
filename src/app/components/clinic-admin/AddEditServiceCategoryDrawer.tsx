import { useState, useEffect } from "react";
import { X, FolderOpen } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

interface AddEditServiceCategoryDrawerProps {
  isOpen: boolean;
  category?: ServiceCategory | null;
  onClose: () => void;
  onSave: (category: Omit<ServiceCategory, "id"> & { id?: string }) => void;
}

export function AddEditServiceCategoryDrawer({
  isOpen,
  category,
  onClose,
  onSave,
}: AddEditServiceCategoryDrawerProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    } else {
      setName("");
      setDescription("");
    }
    setErrors({});
  }, [category, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Category name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...(category?.id && { id: category.id }),
      name: name.trim(),
      description: description.trim() || undefined,
      order: category?.order || 0,
    });

    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
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
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/30 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                {category ? "Edit category" : "Add category"}
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {category ? "Update category details" : "Create a new service category"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Category Name */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                Category name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateForm}
                placeholder="Enter category name"
                className={`w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow] ${
                  errors.name
                    ? "border-destructive"
                    : "border-neutral-200 dark:border-neutral-700 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
                rows={3}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleClose}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="h-10 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm"
          >
            {category ? "Update category" : "Create category"}
          </button>
        </div>
      </div>
    </>
  );
}
