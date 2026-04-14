import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { Plus, Search, Edit2, Trash2, FolderOpen } from "lucide-react";

interface AppointmentCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentCategoriesScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function AppointmentCategoriesScreen({
  onNavigate,
  onLogout,
}: AppointmentCategoriesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AppointmentCategory | null>(null);

  // Mock data - replace with actual data from backend
  const [categories, setCategories] = useState<AppointmentCategory[]>([
    {
      id: "cat-1",
      name: "Initial Consultation",
      description: "First-time patient visit for assessment and diagnosis",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cat-2",
      name: "Follow-up",
      description: "Subsequent visit to monitor progress and adjust treatment",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cat-3",
      name: "Therapy",
      description: "Therapeutic treatment sessions",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "cat-4",
      name: "Adjustment",
      description: "Chiropractic adjustment sessions",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setFormData({ name: "", description: "" });
    setFormErrors({ name: "", description: "" });
    setShowCreateModal(true);
  };

  const handleEditClick = (category: AppointmentCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setFormErrors({ name: "", description: "" });
    setShowEditModal(true);
  };

  const handleDeleteClick = (category: AppointmentCategory) => {
    setSelectedCategory(category);
    setShowDeleteDialog(true);
  };

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const newCategory: AppointmentCategory = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCategories([newCategory, ...categories]);
    setShowCreateModal(false);
  };

  const handleUpdate = () => {
    if (!validateForm() || !selectedCategory) return;

    setCategories(
      categories.map((cat) =>
        cat.id === selectedCategory.id
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              updatedAt: new Date().toISOString(),
            }
          : cat
      )
    );
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;
    setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ClinicAdminLayout activeMenu="appointment-categories" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Service categories
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Define services and their purpose
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Create category
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
          {filteredCategories.length === 0 ? (
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
              <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                {searchQuery ? "No categories found" : "No categories yet"}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first service category to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <span>Created {formatDate(category.createdAt)}</span>
                    {category.createdAt !== category.updatedAt && (
                      <span>• Updated {formatDate(category.updatedAt)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Create service category
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Category name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={validateForm}
                  placeholder="e.g., Initial Consultation"
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  onBlur={validateForm}
                  placeholder="Describe the purpose of this service"
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
                />
                {formErrors.description && (
                  <p className="text-xs text-destructive mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Create category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Edit service category
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Category name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onBlur={validateForm}
                  placeholder="e.g., Initial Consultation"
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
                {formErrors.name && (
                  <p className="text-xs text-destructive mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  onBlur={validateForm}
                  placeholder="Describe the purpose of this service"
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
                />
                {formErrors.description && (
                  <p className="text-xs text-destructive mt-1">{formErrors.description}</p>
                )}
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Delete service category
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Are you sure you want to delete <span className="font-medium text-neutral-900 dark:text-white">{selectedCategory.name}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm"
              >
                Delete category
              </button>
            </div>
          </div>
        </div>
      )}
    </ClinicAdminLayout>
  );
}
