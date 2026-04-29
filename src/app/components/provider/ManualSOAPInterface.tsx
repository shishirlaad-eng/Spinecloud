import { useState } from "react";
import { Plus, Trash2, X, Download, Save, Lock, FileUp } from "lucide-react";
import type { SOAPCategory, SOAPSubcategory } from "@/app/components/clinic-admin/soap-master/SOAPMasterScreen";
import { CumulativeICDCPTDrawer } from "./CumulativeICDCPTDrawer";
import { CumulativeICDCPTCodesSection, ICDCPTCode, LinkedCodeGroup } from "./CumulativeICDCPTCodesSection";

interface SOAPBlock {
  id: string;
  section: "subjective" | "objective" | "assessment" | "plan";
  categoryId: string;
  subcategoryId: string;
  categoryName: string;
  subcategoryName: string;
  value: any;
}

interface ManualSOAPInterfaceProps {
  categories: SOAPCategory[];
  appointmentId: string;
  onSave: (blocks: SOAPBlock[]) => void;
  initialBlocks?: SOAPBlock[];
}

export function ManualSOAPInterface({
  categories,
  appointmentId,
  onSave,
  initialBlocks = [],
}: ManualSOAPInterfaceProps) {
  const [blocks, setBlocks] = useState<SOAPBlock[]>(initialBlocks);
  const [linkedCodeGroups, setLinkedCodeGroups] = useState<LinkedCodeGroup[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);


  const handleAddBlockComplete = (newBlock: SOAPBlock) => {
    setBlocks([...blocks, newBlock]);
  };

  const handleUpdateBlock = (blockId: string, value: any) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, value } : block
    ));
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(blocks);
    alert("SOAP note saved successfully!");
  };

  const handleFinalize = () => {
    if (blocks.length === 0) {
      alert("Cannot finalize empty SOAP note. Please add blocks first.");
      return;
    }
    // TODO: Implement finalize logic
    alert("SOAP note finalized successfully!");
  };

  const handleExport = () => {
    if (blocks.length === 0) {
      alert("No SOAP data to export. Please add blocks first.");
      return;
    }

    const preview = generatePreview();
    
    // Generate formatted text for PDF/Download
    let textContent = "SOAP NOTE - Manual Documentation\n";
    textContent += "=" + "=".repeat(50) + "\n\n";
    textContent += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    // Add each section
    (["subjective", "objective", "assessment", "plan"] as const).forEach((section) => {
      const sectionLabel = getSectionLabel(section);
      textContent += `${sectionLabel.toUpperCase()}\n`;
      textContent += "-".repeat(sectionLabel.length) + "\n";
      
      if (preview[section].length > 0) {
        preview[section].forEach((sentence) => {
          textContent += `• ${sentence}\n`;
        });
      } else {
        textContent += "(No data)\n";
      }
      
      textContent += "\n";
    });
    
    // Create and download file
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SOAP_Manual_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert("SOAP note exported successfully!");
  };

  // Get category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  // Get subcategory by IDs
  const getSubcategoryById = (categoryId: string, subcategoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.subcategories.find(sub => sub.id === subcategoryId);
  };

  // Generate live preview text
  const generatePreview = () => {
    const sections: Record<string, string[]> = {
      subjective: [],
      objective: [],
      assessment: [],
      plan: [],
    };

    blocks.forEach(block => {
      const subcategory = getSubcategoryById(block.categoryId, block.subcategoryId);

      if (subcategory && block.value !== null && block.value !== "") {
        const section = block.section;
        let sentence = "";

        switch (subcategory.inputType) {
          case "text":
          case "textarea":
            sentence = `${block.subcategoryName}: ${block.value}`;
            break;
          case "slider":
            sentence = `${block.subcategoryName}: ${block.value}${subcategory.unit || ""}`;
            break;
          case "checkbox":
            if (Array.isArray(block.value) && block.value.length > 0) {
              sentence = `${block.subcategoryName}: ${block.value.join(", ")}`;
            }
            break;
          case "radio":
          case "dropdown":
            sentence = `${block.subcategoryName}: ${block.value}`;
            break;
          case "bodychart":
            sentence = `${block.subcategoryName}: Marked on body chart`;
            break;
        }

        if (sentence) {
          sections[section].push(sentence);
        }
      }
    });

    return sections;
  };

  const preview = generatePreview();

  const getSectionLabel = (section: string) => {
    switch (section) {
      case "subjective": return "Subjective";
      case "objective": return "Objective";
      case "assessment": return "Assessment";
      case "plan": return "Plan";
      default: return section;
    }
  };

  const canExport = blocks.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Manual SOAP Note
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Add blocks and fill in details from configured templates
          </p>
        </div>
      </div>

      {/* Two Column Layout: Input Area (60%) + Preview (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side - Input Area (Takes 3/5 = 60%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* SOAP Sections */}
          {(["subjective", "objective", "assessment", "plan"] as const).map((section) => (
            <SOAPSection
              key={section}
              section={section}
              categories={categories.filter(cat => cat.section === section)}
              blocks={blocks.filter(b => b.section === section)}
              onAddBlock={handleAddBlockComplete}
              onUpdateBlock={handleUpdateBlock}
              onDeleteBlock={handleDeleteBlock}
              getCategoryById={getCategoryById}
              getSubcategoryById={getSubcategoryById}
            />
          ))}

          {/* ICD-CPT Codes Section */}
          <div className="pt-4">
            <CumulativeICDCPTCodesSection
              soapData={{
                subjective: preview.subjective.join(". "),
                objective: preview.objective.join(". "),
                assessment: preview.assessment.join(". "),
                plan: preview.plan.join(". "),
              }}
              onSave={(linkedGroups) => {
                setLinkedCodeGroups(linkedGroups);
              }}
              initialLinkedGroups={linkedCodeGroups}
            />
          </div>
        </div>

        {/* Right Side - Live Preview (Takes 2/5 = 40%) */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-4">
            {/* Preview Panel */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950">
              <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  SOAP Preview
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Real-time preview of your SOAP note
                </p>
              </div>

              <div className="p-5 max-h-[calc(100vh-300px)] overflow-y-auto">
                {blocks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No data added yet
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                      Add blocks to see preview here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(["subjective", "objective", "assessment", "plan"] as const).map((section) => (
                      preview[section].length > 0 && (
                        <div key={section}>
                          <h5 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                            {getSectionLabel(section)}
                          </h5>
                          <div className="space-y-1 pl-3">
                            {preview[section].map((sentence, idx) => (
                              <p key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                                • {sentence}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Attachments Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 p-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Attachments
                </label>
                <div className="space-y-2">
                  <label className="group relative flex items-center justify-center gap-2 h-20 px-4 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-all">
                    <FileUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg group"
                    >
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-destructive transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save draft
              </button>
              <button
                onClick={handleFinalize}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                Finalize
              </button>
              <button
                onClick={handleExport}
                disabled={!canExport}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SOAP Section Component
interface SOAPSectionProps {
  section: "subjective" | "objective" | "assessment" | "plan";
  categories: SOAPCategory[];
  blocks: SOAPBlock[];
  onAddBlock: (block: SOAPBlock) => void;
  onUpdateBlock: (blockId: string, value: any) => void;
  onDeleteBlock: (blockId: string) => void;
  getCategoryById: (categoryId: string) => SOAPCategory | undefined;
  getSubcategoryById: (categoryId: string, subcategoryId: string) => SOAPSubcategory | undefined;
}

function SOAPSection({
  section,
  categories,
  blocks,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  getCategoryById,
  getSubcategoryById,
}: SOAPSectionProps) {
  const [showModal, setShowModal] = useState(false);

  const getSectionLabel = (section: string) => {
    switch (section) {
      case "subjective": return "Subjective";
      case "objective": return "Objective";
      case "assessment": return "Assessment";
      case "plan": return "Plan";
      default: return section;
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case "subjective": return "Patient's description of symptoms, pain history, and concerns";
      case "objective": return "Observable findings and measurements";
      case "assessment": return "Clinical evaluation and diagnosis";
      case "plan": return "Treatment plan and recommendations";
      default: return "";
    }
  };

  const handleBlockAdded = (block: SOAPBlock) => {
    onAddBlock(block);
    setShowModal(false);
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg">
      {/* Section Header */}
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              {getSectionLabel(section)}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
              {getSectionDescription(section)}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 h-9 px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add block
          </button>
        </div>
      </div>

      {/* Blocks */}
      <div className="p-5">
        {blocks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              No information added yet
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Click "Add Block" to get started
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                onUpdateBlock={onUpdateBlock}
                onDeleteBlock={onDeleteBlock}
                getSubcategoryById={getSubcategoryById}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      {showModal && (
        <AddBlockModal
          section={section}
          categories={categories}
          onClose={() => setShowModal(false)}
          onAddBlock={handleBlockAdded}
        />
      )}
    </div>
  );
}

// Add Block Modal Component
interface AddBlockModalProps {
  section: "subjective" | "objective" | "assessment" | "plan";
  categories: SOAPCategory[];
  onClose: () => void;
  onAddBlock: (block: SOAPBlock) => void;
}

function AddBlockModal({ section, categories, onClose, onAddBlock }: AddBlockModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  const selectedSubcategory = selectedCategory?.subcategories.find(sub => sub.id === selectedSubcategoryId);

  const handleAddBlock = () => {
    if (!selectedCategoryId || !selectedSubcategoryId || !selectedCategory || !selectedSubcategory) return;

    const newBlock: SOAPBlock = {
      id: `block-${Date.now()}`,
      section: section,
      categoryId: selectedCategoryId,
      subcategoryId: selectedSubcategoryId,
      categoryName: selectedCategory.name,
      subcategoryName: selectedSubcategory.name,
      value: selectedSubcategory.inputType === "checkbox" ? [] : (selectedSubcategory.inputType === "slider" ? (selectedSubcategory.min || 0) : null),
    };

    onAddBlock(newBlock);
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-950 rounded-lg shadow-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Add new block
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Select a category and option to add to the {getSectionLabel(section)} section.
          </p>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                setSelectedSubcategoryId("");
              }}
              className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Option
              </label>
              <select
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
              >
                <option value="">Select an option</option>
                {selectedCategory.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Input Type Display */}
          {selectedSubcategory && (
            <div className="px-3 py-2 bg-neutral-100 dark:bg-neutral-900 rounded text-sm text-neutral-600 dark:text-neutral-400">
              Input type: <span className="font-medium">{selectedSubcategory.inputType}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAddBlock}
            disabled={!selectedCategoryId || !selectedSubcategoryId}
            className="h-9 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add block
          </button>
        </div>
      </div>
    </div>
  );
}

// Block Card Component
interface BlockCardProps {
  block: SOAPBlock;
  onUpdateBlock: (blockId: string, value: any) => void;
  onDeleteBlock: (blockId: string) => void;
  getSubcategoryById: (categoryId: string, subcategoryId: string) => SOAPSubcategory | undefined;
}

function BlockCard({ block, onUpdateBlock, onDeleteBlock, getSubcategoryById }: BlockCardProps) {
  const subcategory = getSubcategoryById(block.categoryId, block.subcategoryId);

  if (!subcategory) return null;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
            {block.categoryName} - {block.subcategoryName}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Input type: {subcategory.inputType}
          </p>
        </div>
        <button
          onClick={() => onDeleteBlock(block.id)}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
          title="Delete block"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </button>
      </div>

      {/* Input Field */}
      <InputField
        subcategory={subcategory}
        value={block.value}
        onChange={(value) => onUpdateBlock(block.id, value)}
      />
    </div>
  );
}

// Input Field Component - Renders different input types
interface InputFieldProps {
  subcategory: SOAPSubcategory;
  value: any;
  onChange: (value: any) => void;
}

function InputField({ subcategory, value, onChange }: InputFieldProps) {
  switch (subcategory.inputType) {
    case "text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${subcategory.name.toLowerCase()}`}
          className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
        />
      );

    case "textarea":
      return (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${subcategory.name.toLowerCase()}`}
          rows={3}
          className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] resize-none"
        />
      );

    case "slider":
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={subcategory.min || 0}
            max={subcategory.max || 10}
            value={value || subcategory.min || 0}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>{subcategory.min || 0}{subcategory.unit || ""}</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {value || subcategory.min || 0}{subcategory.unit || ""}
            </span>
            <span>{subcategory.max || 10}{subcategory.unit || ""}</span>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-2">
          {(subcategory.options || []).map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(value || []).includes(option)}
                onChange={(e) => {
                  const currentValues = value || [];
                  if (e.target.checked) {
                    onChange([...currentValues, option]);
                  } else {
                    onChange(currentValues.filter((v: string) => v !== option));
                  }
                }}
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 rounded focus:ring-2 focus:ring-primary-500/10"
              />
              <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
            </label>
          ))}
        </div>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {(subcategory.options || []).map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                checked={value === option}
                onChange={() => onChange(option)}
                className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-primary-500/10"
              />
              <span className="text-sm text-neutral-900 dark:text-white">{option}</span>
            </label>
          ))}
        </div>
      );

    case "dropdown":
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
        >
          <option value="">Select option</option>
          {(subcategory.options || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case "bodychart":
      return (
        <div className="p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Body chart interface would go here
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
            (Interactive body diagram for marking pain locations)
          </p>
        </div>
      );

    default:
      return null;
  }
}