import { useState } from "react";
import { ClinicAdminLayout } from "@/app/components/clinic-admin/layout/ClinicAdminLayout";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, FolderOpen, Save, X, ChevronRight, GripVertical } from "lucide-react";

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

  // Removed handleSaveAll as we now save immediately on changes

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
      const updatedCategories = localCategories.filter(c => c.id !== categoryId);
      setLocalCategories(updatedCategories);
      onSaveCategories(updatedCategories);
    }
  };

  const handleSaveCategory = (categoryData: Partial<SOAPCategory>) => {
    let updatedCategories: SOAPCategory[];
    if (editingCategory) {
      // Update existing
      updatedCategories = localCategories.map(c => 
        (c.id === editingCategory.id ? { ...c, ...categoryData } as SOAPCategory : c)
      );
    } else {
      // Add new
      const newCategory: SOAPCategory = {
        id: `cat-${Date.now()}`,
        section: selectedSection,
        name: categoryData.name || "",
        subcategories: categoryData.subcategories || [],
      };
      updatedCategories = [...localCategories, newCategory];
    }
    setLocalCategories(updatedCategories);
    onSaveCategories(updatedCategories);
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

  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("Category name is required");
      return;
    }
    onSave(formData);
  };

  const handleAddSubcategory = () => {
    const newSub: SOAPSubcategory = {
      id: `sub-${Date.now()}`,
      name: "",
      inputType: "text",
    };
    setFormData(prev => ({
      ...prev,
      subcategories: [...(prev.subcategories || []), newSub],
    }));
    setExpandedSubId(newSub.id);
  };

  const handleUpdateSubcategory = (subId: string, updates: Partial<SOAPSubcategory>) => {
    setFormData(prev => ({
      ...prev,
      subcategories: (prev.subcategories || []).map(s =>
        s.id === subId ? { ...s, ...updates } : s
      ),
    }));
  };

  const handleDeleteSubcategory = (subId: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: (prev.subcategories || []).filter(s => s.id !== subId),
    }));
    if (expandedSubId === subId) setExpandedSubId(null);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white dark:bg-neutral-950 shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              {category ? "Edit Category" : "Add Category"}
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Configure {section} category and its sub-elements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Category Title <span className="text-destructive font-bold">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Clinical Findings"
              className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-medium text-neutral-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          {/* Subcategories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Sub-categories ({formData.subcategories?.length || 0})
              </label>
              <button
                onClick={handleAddSubcategory}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New
              </button>
            </div>

            <div className="space-y-3">
              {(formData.subcategories || []).length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30">
                  <FolderOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-neutral-400">
                    No sub-categories defined
                  </p>
                </div>
              ) : (
                (formData.subcategories || []).map((sub) => (
                  <SubcategoryInlineItem
                    key={sub.id}
                    subcategory={sub}
                    isExpanded={expandedSubId === sub.id}
                    onToggle={() => setExpandedSubId(expandedSubId === sub.id ? null : sub.id)}
                    onUpdate={(updates) => handleUpdateSubcategory(sub.id, updates)}
                    onDelete={() => handleDeleteSubcategory(sub.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-6 py-5 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-bold text-sm"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] h-11 bg-primary-600 text-white rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-95 transition-all font-bold text-sm"
          >
            {category ? "Confirm Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </>
  );
}

interface SubcategoryInlineItemProps {
  subcategory: SOAPSubcategory;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<SOAPSubcategory>) => void;
  onDelete: () => void;
}

function SubcategoryInlineItem({
  subcategory,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: SubcategoryInlineItemProps) {
  const [optionInput, setOptionInput] = useState("");

  const handleAddOption = () => {
    if (optionInput.trim()) {
      onUpdate({
        options: [...(subcategory.options || []), optionInput.trim()],
      });
      setOptionInput("");
    }
  };

  return (
    <div className={`border transition-all duration-200 ${
      isExpanded 
        ? "border-primary-500/50 shadow-lg shadow-primary-500/5 ring-1 ring-primary-500/10 rounded-2xl bg-white dark:bg-neutral-900" 
        : "border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 hover:border-neutral-300 dark:hover:border-neutral-700"
    }`}>
      {/* Header */}
      <div 
        className={`px-4 py-3 flex items-center gap-3 cursor-pointer select-none ${isExpanded ? "border-b border-neutral-100 dark:border-neutral-800" : ""}`}
        onClick={onToggle}
      >
        <GripVertical className="w-4 h-4 text-neutral-300 cursor-grab active:cursor-grabbing" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
            {subcategory.name || "Untitled Sub-category"}
          </p>
          {!isExpanded && (
            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mt-0.5">
              {subcategory.inputType}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors group"
          >
            <Trash2 className="w-4 h-4 text-neutral-400 group-hover:text-red-500" />
          </button>
          <div className={`p-1 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Settings Form */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-b-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                Field Name
              </label>
              <input
                type="text"
                value={subcategory.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="e.g., Severity"
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                Input Type
              </label>
              <select
                value={subcategory.inputType}
                onChange={(e) => onUpdate({ inputType: e.target.value as any })}
                className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all"
              >
                <option value="text">Short Text</option>
                <option value="textarea">Long Text</option>
                <option value="slider">Range Slider</option>
                <option value="checkbox">Multi-Checkbox</option>
                <option value="radio">Single Radio</option>
                <option value="dropdown">Dropdown List</option>
                <option value="bodychart">Body Anatomy Chart</option>
              </select>
            </div>
          </div>

          {/* Type Specific Config */}
          {subcategory.inputType === "slider" && (
            <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Min</label>
                  <input
                    type="number"
                    value={subcategory.min || 0}
                    onChange={(e) => onUpdate({ min: parseInt(e.target.value) })}
                    className="w-full h-9 px-3 bg-neutral-50 border border-neutral-100 rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Max</label>
                  <input
                    type="number"
                    value={subcategory.max || 10}
                    onChange={(e) => onUpdate({ max: parseInt(e.target.value) })}
                    className="w-full h-9 px-3 bg-neutral-50 border border-neutral-100 rounded text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Unit</label>
                  <input
                    type="text"
                    value={subcategory.unit || ""}
                    onChange={(e) => onUpdate({ unit: e.target.value })}
                    placeholder="e.g., cm"
                    className="w-full h-9 px-3 bg-neutral-50 border border-neutral-100 rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {(subcategory.inputType === "radio" || subcategory.inputType === "dropdown" || subcategory.inputType === "checkbox") && (
            <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block ml-1">
                Configure Options
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddOption()}
                  placeholder="Type an option..."
                  className="flex-1 h-9 px-3 bg-neutral-50 border border-neutral-100 rounded-lg text-sm"
                />
                <button
                  onClick={handleAddOption}
                  className="px-3 h-9 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(subcategory.options || []).map((opt, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-[11px] font-bold text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {opt}
                    <button 
                      onClick={() => onUpdate({ options: subcategory.options?.filter((_, i) => i !== idx) })}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// SubcategoryInlineItem is defined above to keep the drawer component clean and handle internal state.
