import { useState, useEffect } from "react";
import { X, Search, Sparkles, Loader2, Plus, Check } from "lucide-react";

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface ICDCPTCodesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  soapContent: string;
  sectionName: "Subjective" | "Objective" | "Assessment" | "Plan";
  existingCodes: ICDCPTCode[];
  onConfirm: (codes: ICDCPTCode[]) => void;
}

// Mock data for auto-suggestions
const MOCK_ICD_CODES = [
  { code: "M54.5", description: "Low back pain", type: "ICD" as const },
  { code: "M54.2", description: "Cervicalgia (neck pain)", type: "ICD" as const },
  { code: "M79.1", description: "Myalgia (muscle pain)", type: "ICD" as const },
  { code: "M25.511", description: "Pain in right shoulder", type: "ICD" as const },
  { code: "M25.512", description: "Pain in left shoulder", type: "ICD" as const },
  { code: "M54.6", description: "Pain in thoracic spine", type: "ICD" as const },
  { code: "M54.89", description: "Other dorsalgia", type: "ICD" as const },
  { code: "M62.81", description: "Muscle weakness", type: "ICD" as const },
  { code: "M25.561", description: "Pain in right knee", type: "ICD" as const },
  { code: "M99.03", description: "Segmental and somatic dysfunction of cervical region", type: "ICD" as const },
];

const MOCK_CPT_CODES = [
  { code: "98940", description: "Chiropractic manipulative treatment (spinal, 1-2 regions)", type: "CPT" as const },
  { code: "98941", description: "Chiropractic manipulative treatment (spinal, 3-4 regions)", type: "CPT" as const },
  { code: "98942", description: "Chiropractic manipulative treatment (spinal, 5 regions)", type: "CPT" as const },
  { code: "97110", description: "Therapeutic exercises", type: "CPT" as const },
  { code: "97112", description: "Neuromuscular reeducation", type: "CPT" as const },
  { code: "97140", description: "Manual therapy techniques", type: "CPT" as const },
  { code: "97530", description: "Therapeutic activities", type: "CPT" as const },
  { code: "97035", description: "Ultrasound therapy", type: "CPT" as const },
  { code: "99202", description: "Office visit, new patient (20-29 minutes)", type: "CPT" as const },
  { code: "99212", description: "Office visit, established patient (10-19 minutes)", type: "CPT" as const },
];

export function ICDCPTCodesDrawer({
  isOpen,
  onClose,
  soapContent,
  sectionName,
  existingCodes,
  onConfirm,
}: ICDCPTCodesDrawerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedCodes, setSuggestedCodes] = useState<ICDCPTCode[]>([]);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ICDCPTCode[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<ICDCPTCode[]>(existingCodes);

  // Generate AI suggestions when drawer opens
  useEffect(() => {
    if (isOpen && soapContent && suggestedCodes.length === 0) {
      generateAISuggestions();
    }
  }, [isOpen, soapContent]);

  // Reset selected codes when existing codes change
  useEffect(() => {
    setSelectedCodes(existingCodes);
  }, [existingCodes]);

  // Search functionality
  useEffect(() => {
    if (manualSearchQuery.trim()) {
      const query = manualSearchQuery.toLowerCase();
      const allCodes = [...MOCK_ICD_CODES, ...MOCK_CPT_CODES];
      const filtered = allCodes.filter(
        (item) =>
          item.code.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
      setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    } else {
      setSearchResults([]);
    }
  }, [manualSearchQuery]);

  const generateAISuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate smart suggestions based on SOAP content
    const suggestions: ICDCPTCode[] = [];

    const contentLower = soapContent.toLowerCase();

    // ICD Code suggestions based on keywords
    if (contentLower.includes("back pain") || contentLower.includes("lumbar")) {
      suggestions.push({ code: "M54.5", description: "Low back pain", type: "ICD" });
    }
    if (contentLower.includes("neck") || contentLower.includes("cervical")) {
      suggestions.push({ code: "M54.2", description: "Cervicalgia (neck pain)", type: "ICD" });
    }
    if (contentLower.includes("muscle") || contentLower.includes("myalgia")) {
      suggestions.push({ code: "M79.1", description: "Myalgia (muscle pain)", type: "ICD" });
    }
    if (contentLower.includes("shoulder")) {
      suggestions.push({ code: "M25.511", description: "Pain in right shoulder", type: "ICD" });
    }
    if (contentLower.includes("radiculopathy") || contentLower.includes("radiating")) {
      suggestions.push({ code: "M54.16", description: "Radiculopathy, lumbar region", type: "ICD" });
    }
    if (contentLower.includes("spasm")) {
      suggestions.push({ code: "M62.830", description: "Muscle spasm of back", type: "ICD" });
    }

    // CPT Code suggestions based on keywords
    if (contentLower.includes("adjustment") || contentLower.includes("manipulation")) {
      suggestions.push({ code: "98941", description: "Chiropractic manipulative treatment (spinal, 3-4 regions)", type: "CPT" });
    }
    if (contentLower.includes("exercise") || contentLower.includes("therapeutic")) {
      suggestions.push({ code: "97110", description: "Therapeutic exercises", type: "CPT" });
    }
    if (contentLower.includes("manual therapy") || contentLower.includes("soft tissue")) {
      suggestions.push({ code: "97140", description: "Manual therapy techniques", type: "CPT" });
    }
    if (contentLower.includes("ultrasound") || contentLower.includes("modalities")) {
      suggestions.push({ code: "97035", description: "Ultrasound therapy", type: "CPT" });
    }
    if (contentLower.includes("examination") || contentLower.includes("initial consultation")) {
      suggestions.push({ code: "99202", description: "Office visit, new patient (20-29 minutes)", type: "CPT" });
    }

    // If no specific matches, add some generic codes
    if (suggestions.length === 0) {
      suggestions.push(
        { code: "M54.5", description: "Low back pain", type: "ICD" },
        { code: "98941", description: "Chiropractic manipulative treatment (spinal, 3-4 regions)", type: "CPT" }
      );
    }

    setSuggestedCodes(suggestions);
    // Auto-add suggested codes to selected codes if they don't exist
    setSelectedCodes((prev) => {
      const existingCodesSet = new Set(prev.map(c => c.code));
      const newCodes = suggestions.filter(s => !existingCodesSet.has(s.code));
      return [...prev, ...newCodes];
    });
    setIsGenerating(false);
  };

  const handleAddCode = (code: ICDCPTCode) => {
    if (!selectedCodes.find((c) => c.code === code.code)) {
      setSelectedCodes([...selectedCodes, code]);
    }
    setManualSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveCode = (codeToRemove: string) => {
    setSelectedCodes(selectedCodes.filter((c) => c.code !== codeToRemove));
  };

  const handleConfirm = () => {
    onConfirm(selectedCodes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                ICD-CPT Codes
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {sectionName} section
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* AI Suggestions Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                AI suggested codes
              </h3>
            </div>

            {isGenerating ? (
              <div className="flex items-center justify-center gap-3 py-8 text-neutral-600 dark:text-neutral-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Analyzing SOAP notes...</span>
              </div>
            ) : suggestedCodes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {suggestedCodes.map((code) => {
                  const isSelected = selectedCodes.find((c) => c.code === code.code);
                  return (
                    <button
                      key={code.code}
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveCode(code.code);
                        } else {
                          handleAddCode(code);
                        }
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span className="font-mono text-xs">{code.code}</span>
                      <span className="text-xs opacity-75">•</span>
                      <span className="text-xs">{code.description}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4">
                No AI suggestions available. Add codes manually below.
              </p>
            )}
          </div>

          {/* Manual Search Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Add codes manually
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={manualSearchQuery}
                onChange={(e) => setManualSearchQuery(e.target.value)}
                placeholder="Search ICD or CPT codes..."
                className="w-full pl-10 pr-4 h-10 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-700 max-h-64 overflow-y-auto">
                {searchResults.map((code) => {
                  const isSelected = selectedCodes.find((c) => c.code === code.code);
                  return (
                    <button
                      key={code.code}
                      onClick={() => handleAddCode(code)}
                      disabled={!!isSelected}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${
                          code.type === "ICD"
                            ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                            : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                        }`}
                      >
                        {code.type}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white font-mono">
                          {code.code}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {code.description}
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Plus className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Codes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Selected codes ({selectedCodes.length})
            </h3>
            {selectedCodes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedCodes.map((code) => (
                  <div
                    key={code.code}
                    className="inline-flex items-center gap-2 pl-3 pr-2 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                  >
                    <span
                      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium ${
                        code.type === "ICD"
                          ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                          : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                      }`}
                    >
                      {code.type}
                    </span>
                    <span className="text-sm font-mono font-medium text-neutral-900 dark:text-white">
                      {code.code}
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {code.description}
                    </span>
                    <button
                      onClick={() => handleRemoveCode(code.code)}
                      className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4 text-center">
                No codes selected yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Confirm codes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
