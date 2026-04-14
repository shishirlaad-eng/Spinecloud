import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, FolderOpen, Save } from "lucide-react";

export interface SOAPSubcategory {
  id: string;
  name: string;
  inputType: "text" | "textarea" | "slider" | "checkbox" | "radio" | "dropdown" | "bodychart";
  options?: string[]; // For radio, dropdown, checkbox
  min?: number; // For slider
  max?: number; // For slider
  unit?: string; // For slider (e.g., "cm", "kg", "°")
}

export interface SOAPCategory {
  id: string;
  section: "subjective" | "objective" | "assessment" | "plan";
  name: string;
  subcategories: SOAPSubcategory[];
}

interface SOAPMasterScreenProps {
  categories: SOAPCategory[];
  onNavigate: (menu: string) => void;
  onSaveCategories: (categories: SOAPCategory[]) => void;
  onLogout?: () => void;
}

export function SOAPMasterScreen({
  categories,
  onNavigate,
  onSaveCategories,
  onLogout,
}: SOAPMasterScreenProps) {
  const [localCategories, setLocalCategories] = useState<SOAPCategory[]>(categories);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<SOAPCategory | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<"subjective" | "objective" | "assessment" | "plan">("subjective");

  const handleSaveAll = () => {
    onSaveCategories(localCategories);
    alert("SOAP configuration saved successfully!");
  };

  const handleAddCategory = (section: "subjective" | "objective" | "assessment" | "plan") => {
    setSelectedSection(section);
    setEditingCategory(null);
    setIsAddCategoryOpen(true);
  };

  const handleEditCategory = (category: SOAPCategory) => {
    setEditingCategory(category);
    setIsAddCategoryOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category and all its subcategories?")) {
      setLocalCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData: Partial<SOAPCategory>) => {
    if (editingCategory) {
      // Update existing
      setLocalCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, ...categoryData } : c))
      );
    } else {
      // Add new
      const newCategory: SOAPCategory = {
        id: `cat-${Date.now()}`,
        section: selectedSection,
        name: categoryData.name || "",
        subcategories: categoryData.subcategories || [],
      };
      setLocalCategories(prev => [...prev, newCategory]);
    }
    setIsAddCategoryOpen(false);
    setEditingCategory(null);
  };

  const toggleExpand = (categoryId: string) => {
    setExpandedCategoryId(prev => (prev === categoryId ? null : categoryId));
  };

  // Group categories by section
  const categoriesBySection = {
    subjective: localCategories.filter(c => c.section === "subjective"),
    objective: localCategories.filter(c => c.section === "objective"),
    assessment: localCategories.filter(c => c.section === "assessment"),
    plan: localCategories.filter(c => c.section === "plan"),
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case "subjective": return "Subjective";
      case "objective": return "Objective";
      case "assessment": return "Assessment";
      case "plan": return "Plan";
      default: return section;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case "subjective": return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300";
      case "objective": return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300";
      case "assessment": return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300";
      case "plan": return "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300";
      default: return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300";
    }
  };

  return (
    <ClinicAdminLayout
      activeMenu="soapMaster"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  SOAP Master
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Configure SOAP note categories, subcategories, and input types
                </p>
              </div>
              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                Save configuration
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6 space-y-6">
          {/* SOAP Sections */}
          {(["subjective", "objective", "assessment", "plan"] as const).map((section) => (
            <div key={section} className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-md text-sm font-semibold ${getSectionColor(section)}`}>
                      {getSectionLabel(section).charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        {getSectionLabel(section)}
                      </h2>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {categoriesBySection[section].length} {categoriesBySection[section].length === 1 ? "category" : "categories"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddCategory(section)}
                    className="inline-flex items-center gap-2 h-9 px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add category
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {categoriesBySection[section].length === 0 ? (
                  <div className="p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                      No categories yet
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Add your first category for {getSectionLabel(section).toLowerCase()}
                    </p>
                    <button
                      onClick={() => handleAddCategory(section)}
                      className="inline-flex items-center gap-2 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add category
                    </button>
                  </div>
                ) : (
                  categoriesBySection[section].map((category) => {
                    const isExpanded = expandedCategoryId === category.id;

                    return (
                      <div key={category.id}>
                        {/* Category Row */}
                        <div className="px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleExpand(category.id)}
                              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors mt-0.5"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              )}
                            </button>
                            <div className="flex-1">
                              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                                {category.name}
                              </h3>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                {category.subcategories.length} {category.subcategories.length === 1 ? "subcategory" : "subcategories"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                title="Edit category"
                              >
                                <Edit2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                title="Delete category"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Subcategories */}
                        {isExpanded && (
                          <div className="px-6 pb-4 bg-neutral-50 dark:bg-neutral-900/30">
                            <div className="ml-8 space-y-2">
                              {category.subcategories.length === 0 ? (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 py-2">
                                  No subcategories configured
                                </p>
                              ) : (
                                category.subcategories.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                          {sub.name}
                                        </p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                          Input type: <span className="font-medium capitalize">{sub.inputType}</span>
                                          {sub.inputType === "slider" && sub.min !== undefined && sub.max !== undefined && (
                                            <> • Range: {sub.min} - {sub.max}{sub.unit && ` ${sub.unit}`}</>
                                          )}
                                          {(sub.inputType === "radio" || sub.inputType === "dropdown" || sub.inputType === "checkbox") && sub.options && (
                                            <> • Options: {sub.options.join(", ")}</>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Drawer */}
      {isAddCategoryOpen && (
        <AddEditCategoryDrawer
          category={editingCategory}
          section={editingCategory?.section || selectedSection}
          onClose={() => {
            setIsAddCategoryOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}
    </ClinicAdminLayout>
  );
}

// Add/Edit Category Drawer Component
interface AddEditCategoryDrawerProps {
  category: SOAPCategory | null;
  section: "subjective" | "objective" | "assessment" | "plan";
  onClose: () => void;
  onSave: (category: Partial<SOAPCategory>) => void;
}

function AddEditCategoryDrawer({
  category,
  section,
  onClose,
  onSave,
}: AddEditCategoryDrawerProps) {
  const [formData, setFormData] = useState<Partial<SOAPCategory>>({
    name: category?.name || "",
    section: category?.section || section,
    subcategories: category?.subcategories || [],
  });

  const [editingSubcategory, setEditingSubcategory] = useState<SOAPSubcategory | null>(null);
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("Category name is required");
      return;
    }
    onSave(formData);
  };

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setIsAddSubcategoryOpen(true);
  };

  const handleEditSubcategory = (sub: SOAPSubcategory) => {
    setEditingSubcategory(sub);
    setIsAddSubcategoryOpen(true);
  };

  const handleDeleteSubcategory = (subId: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      setFormData(prev => ({
        ...prev,
        subcategories: (prev.subcategories || []).filter(s => s.id !== subId),
      }));
    }
  };

  const handleSaveSubcategory = (subData: SOAPSubcategory) => {
    if (editingSubcategory) {
      // Update existing
      setFormData(prev => ({
        ...prev,
        subcategories: (prev.subcategories || []).map(s =>
          s.id === editingSubcategory.id ? subData : s
        ),
      }));
    } else {
      // Add new
      setFormData(prev => ({
        ...prev,
        subcategories: [...(prev.subcategories || []), subData],
      }));
    }
    setIsAddSubcategoryOpen(false);
    setEditingSubcategory(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {category ? "Edit category" : "Add category"}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              Configure category and subcategories for {section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Category name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pain Location"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
          </div>

          {/* Subcategories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Subcategories
              </label>
              <button
                onClick={handleAddSubcategory}
                className="inline-flex items-center gap-2 h-9 px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add subcategory
              </button>
            </div>

            <div className="space-y-2">
              {(formData.subcategories || []).length === 0 ? (
                <div className="p-6 text-center border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900/50">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    No subcategories yet
                  </p>
                  <button
                    onClick={handleAddSubcategory}
                    className="inline-flex items-center gap-2 h-9 px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add subcategory
                  </button>
                </div>
              ) : (
                (formData.subcategories || []).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          {sub.name}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          <span className="capitalize">{sub.inputType}</span>
                          {sub.inputType === "slider" && sub.min !== undefined && sub.max !== undefined && (
                            <> • {sub.min} - {sub.max}{sub.unit && ` ${sub.unit}`}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSubcategory(sub)}
                          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(sub.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            {category ? "Save changes" : "Add category"}
          </button>
        </div>
      </div>

      {/* Add/Edit Subcategory Drawer */}
      {isAddSubcategoryOpen && (
        <AddEditSubcategoryDrawer
          subcategory={editingSubcategory}
          onClose={() => {
            setIsAddSubcategoryOpen(false);
            setEditingSubcategory(null);
          }}
          onSave={handleSaveSubcategory}
        />
      )}
    </>
  );
}

// Add/Edit Subcategory Drawer Component
interface AddEditSubcategoryDrawerProps {
  subcategory: SOAPSubcategory | null;
  onClose: () => void;
  onSave: (subcategory: SOAPSubcategory) => void;
}

function AddEditSubcategoryDrawer({
  subcategory,
  onClose,
  onSave,
}: AddEditSubcategoryDrawerProps) {
  const [formData, setFormData] = useState<Partial<SOAPSubcategory>>({
    name: subcategory?.name || "",
    inputType: subcategory?.inputType || "text",
    options: subcategory?.options || [],
    min: subcategory?.min,
    max: subcategory?.max,
    unit: subcategory?.unit || "",
  });

  const [optionInput, setOptionInput] = useState("");

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("Subcategory name is required");
      return;
    }

    const newSubcategory: SOAPSubcategory = {
      id: subcategory?.id || `sub-${Date.now()}`,
      name: formData.name,
      inputType: formData.inputType || "text",
      ...(formData.options && formData.options.length > 0 && { options: formData.options }),
      ...(formData.min !== undefined && { min: formData.min }),
      ...(formData.max !== undefined && { max: formData.max }),
      ...(formData.unit && { unit: formData.unit }),
    };

    onSave(newSubcategory);
  };

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), optionInput.trim()],
      }));
      setOptionInput("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: (prev.options || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-neutral-950 shadow-xl z-[60] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {subcategory ? "Edit subcategory" : "Add subcategory"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-6">
          {/* Subcategory Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Subcategory name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Pain Intensity"
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            />
          </div>

          {/* Input Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Input type <span className="text-destructive">*</span>
            </label>
            <select
              value={formData.inputType}
              onChange={(e) =>
                setFormData({ ...formData, inputType: e.target.value as SOAPSubcategory["inputType"] })
              }
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="slider">Slider</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="dropdown">Dropdown</option>
              <option value="bodychart">Body Chart</option>
            </select>
          </div>

          {/* Slider Configuration */}
          {formData.inputType === "slider" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Min value
                  </label>
                  <input
                    type="number"
                    value={formData.min || 0}
                    onChange={(e) => setFormData({ ...formData, min: parseInt(e.target.value) })}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Max value
                  </label>
                  <input
                    type="number"
                    value={formData.max || 10}
                    onChange={(e) => setFormData({ ...formData, max: parseInt(e.target.value) })}
                    className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Unit (optional)
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., cm, kg, °"
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>
            </>
          )}

          {/* Options Configuration */}
          {(formData.inputType === "radio" || formData.inputType === "dropdown" || formData.inputType === "checkbox") && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Options
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                  placeholder="Add option"
                  className="flex-1 h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
                <button
                  onClick={handleAddOption}
                  className="h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {(formData.options || []).map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                  >
                    <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
                    <button
                      onClick={() => handleDeleteOption(index)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            {subcategory ? "Save changes" : "Add subcategory"}
          </button>
        </div>
      </div>
    </>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
