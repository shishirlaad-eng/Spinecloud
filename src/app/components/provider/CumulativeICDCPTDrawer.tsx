import { useState } from "react";
import { X, Search, Sparkles, Loader2, Plus, Check, Trash2 } from "lucide-react";

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface CumulativeICDCPTDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  soapData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  onConfirm: (icdCodes: ICDCPTCode[], cptCodes: ICDCPTCode[]) => void;
}

// Mock data for auto-suggestions (expanded list)
const MOCK_ICD_CODES: ICDCPTCode[] = [
  { code: "M54.5", description: "Low back pain", type: "ICD" },
  { code: "M79.1", description: "Myalgia (muscle pain)", type: "ICD" },
  { code: "M99.03", description: "Segmental dysfunction", type: "ICD" },
  { code: "M25.511", description: "Pain in right shoulder", type: "ICD" },
  { code: "M25.512", description: "Pain in left shoulder", type: "ICD" },
  { code: "M47.816", description: "Cervical spondylosis", type: "ICD" },
  { code: "M51.26", description: "Lumbar disc herniation", type: "ICD" },
  { code: "M62.81", description: "Muscle weakness", type: "ICD" },
  { code: "M53.2X7", description: "Spinal instability", type: "ICD" },
  { code: "G89.29", description: "Chronic pain syndrome", type: "ICD" },
];

const MOCK_CPT_CODES: ICDCPTCode[] = [
  { code: "98941", description: "Chiropractic manipulative treatment (CMT) 3-4 regions", type: "CPT" },
  { code: "98940", description: "Chiropractic manipulative treatment (CMT) 1-2 regions", type: "CPT" },
  { code: "97110", description: "Therapeutic exercises", type: "CPT" },
  { code: "97140", description: "Manual therapy techniques", type: "CPT" },
  { code: "97530", description: "Therapeutic activities", type: "CPT" },
  { code: "97112", description: "Neuromuscular reeducation", type: "CPT" },
  { code: "97035", description: "Ultrasound therapy", type: "CPT" },
  { code: "97032", description: "Electrical stimulation", type: "CPT" },
  { code: "99213", description: "Office visit, established patient (20-29 minutes)", type: "CPT" },
  { code: "99212", description: "Office visit, established patient (10-19 minutes)", type: "CPT" },
];

export function CumulativeICDCPTDrawer({
  isOpen,
  onClose,
  soapData,
  onConfirm,
}: CumulativeICDCPTDrawerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ICDCPTCode[]>([]);
  
  // Available codes pool (from AI + manual additions)
  const [availableICDCodes, setAvailableICDCodes] = useState<ICDCPTCode[]>([]);
  const [availableCPTCodes, setAvailableCPTCodes] = useState<ICDCPTCode[]>([]);
  
  // Final selected codes from the available pool
  const [selectedICDCodes, setSelectedICDCodes] = useState<ICDCPTCode[]>([]);
  const [selectedCPTCodes, setSelectedCPTCodes] = useState<ICDCPTCode[]>([]);

  const generateAISuggestions = () => {
    setIsGenerating(true);

    // Simulate AI generation based on all SOAP sections
    setTimeout(() => {
      // Generate ICD codes based on SOAP content
      const icdSuggestions = MOCK_ICD_CODES.slice(0, 5);
      
      // Add to available codes (avoid duplicates)
      const newICDCodes = icdSuggestions.filter(
        newCode => !availableICDCodes.some(existing => existing.code === newCode.code)
      );
      setAvailableICDCodes([...availableICDCodes, ...newICDCodes]);

      // Generate CPT codes based on SOAP content
      const cptSuggestions = MOCK_CPT_CODES.slice(0, 5);
      
      // Add to available codes (avoid duplicates)
      const newCPTCodes = cptSuggestions.filter(
        newCode => !availableCPTCodes.some(existing => existing.code === newCode.code)
      );
      setAvailableCPTCodes([...availableCPTCodes, ...newCPTCodes]);

      setIsGenerating(false);
      alert("AI suggested codes added to available codes pool!");
    }, 2000);
  };

  // Handle manual search - search by both code and description
  const handleSearch = (query: string) => {
    setManualSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Search through all codes
    const allCodes = [...MOCK_ICD_CODES, ...MOCK_CPT_CODES];
    const results = allCodes.filter(code => 
      code.code.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery)
    );

    setSearchResults(results);
  };

  // Add code from manual search to available pool
  const addCodeToAvailable = (code: ICDCPTCode) => {
    if (code.type === "ICD") {
      // Check if already in available
      if (!availableICDCodes.some(c => c.code === code.code)) {
        setAvailableICDCodes([...availableICDCodes, code]);
      }
    } else {
      // Check if already in available
      if (!availableCPTCodes.some(c => c.code === code.code)) {
        setAvailableCPTCodes([...availableCPTCodes, code]);
      }
    }
    
    // Clear search after adding
    setManualSearchQuery("");
    setSearchResults([]);
  };

  // Remove code from available pool
  const removeFromAvailable = (code: ICDCPTCode) => {
    if (code.type === "ICD") {
      setAvailableICDCodes(availableICDCodes.filter(c => c.code !== code.code));
      // Also remove from selected if it was selected
      setSelectedICDCodes(selectedICDCodes.filter(c => c.code !== code.code));
    } else {
      setAvailableCPTCodes(availableCPTCodes.filter(c => c.code !== code.code));
      // Also remove from selected if it was selected
      setSelectedCPTCodes(selectedCPTCodes.filter(c => c.code !== code.code));
    }
  };

  const toggleICDCode = (code: ICDCPTCode) => {
    const isSelected = selectedICDCodes.some(c => c.code === code.code);
    if (isSelected) {
      setSelectedICDCodes(selectedICDCodes.filter(c => c.code !== code.code));
    } else {
      setSelectedICDCodes([...selectedICDCodes, code]);
    }
  };

  const toggleCPTCode = (code: ICDCPTCode) => {
    const isSelected = selectedCPTCodes.some(c => c.code === code.code);
    if (isSelected) {
      setSelectedCPTCodes(selectedCPTCodes.filter(c => c.code !== code.code));
    } else {
      setSelectedCPTCodes([...selectedCPTCodes, code]);
    }
  };

  const isICDCodeSelected = (code: ICDCPTCode) => {
    return selectedICDCodes.some(c => c.code === code.code);
  };

  const isCPTCodeSelected = (code: ICDCPTCode) => {
    return selectedCPTCodes.some(c => c.code === code.code);
  };

  const handleConfirm = () => {
    onConfirm(selectedICDCodes, selectedCPTCodes);
    // Reset state
    resetState();
  };

  const resetState = () => {
    setAvailableICDCodes([]);
    setAvailableCPTCodes([]);
    setSelectedICDCodes([]);
    setSelectedCPTCodes([]);
    setManualSearchQuery("");
    setSearchResults([]);
    setIsGenerating(false);
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  if (!isOpen) return null;

  const hasAvailableCodes = availableICDCodes.length > 0 || availableCPTCodes.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-neutral-950 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Add ICD-CPT Codes
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Use AI suggestions or manual search to add codes
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Selected Codes Summary */}
        {(selectedICDCodes.length > 0 || selectedCPTCodes.length > 0) && (
          <div className="px-6 py-3 bg-primary-50 dark:bg-primary-950/30 border-b border-primary-200 dark:border-primary-800 flex-shrink-0">
            <p className="text-sm text-primary-700 dark:text-primary-400">
              Selected: {selectedICDCodes.length} ICD code{selectedICDCodes.length !== 1 ? 's' : ''}, {selectedCPTCodes.length} CPT code{selectedCPTCodes.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* AI Suggestions Section */}
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    AI Suggestions
                  </h4>
                </div>
                <button
                  onClick={generateAISuggestions}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI suggest codes
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Click to analyze SOAP notes and add suggested codes to available pool
              </p>
            </div>

            {/* Manual Search Section */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                Manual Search
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={manualSearchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by code or description..."
                  className="w-full h-10 pl-10 pr-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-white dark:bg-neutral-950">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 px-2 mb-1">
                    Click to add to available codes
                  </p>
                  {searchResults.map((code) => {
                    const isInAvailable = code.type === "ICD" 
                      ? availableICDCodes.some(c => c.code === code.code)
                      : availableCPTCodes.some(c => c.code === code.code);

                    return (
                      <button
                        key={code.code}
                        onClick={() => addCodeToAvailable(code)}
                        disabled={isInAvailable}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
                          isInAvailable
                            ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 opacity-60 cursor-not-allowed"
                            : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0 ${
                            code.type === "ICD"
                              ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                          }`}>
                            {code.type}
                          </span>
                          <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white flex-shrink-0">
                            {code.code}
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400 text-left truncate">
                            {code.description}
                          </span>
                        </div>
                        {isInAvailable && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                            Added
                          </span>
                        )}
                        {!isInAvailable && (
                          <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {manualSearchQuery && searchResults.length === 0 && (
                <div className="mt-3 px-3 py-8 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No codes found for "{manualSearchQuery}"
                  </p>
                </div>
              )}
            </div>

            {/* Available Codes Pool */}
            {hasAvailableCodes && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                  Available Codes - Select codes to use
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  These codes have been added from AI suggestions or manual search. Select the ones you want to use.
                </p>

                <div className="space-y-4">
                  {/* Available ICD Codes */}
                  {availableICDCodes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                        ICD Codes (Diagnosis)
                      </p>
                      <div className="space-y-2">
                        {availableICDCodes.map((code) => (
                          <div
                            key={code.code}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
                              isICDCodeSelected(code)
                                ? "bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600"
                                : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                            }`}
                          >
                            <button
                              onClick={() => toggleICDCode(code)}
                              className="flex items-center gap-2 flex-1 min-w-0"
                            >
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 flex-shrink-0">
                                ICD
                              </span>
                              <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white flex-shrink-0">
                                {code.code}
                              </span>
                              <span className="text-xs text-neutral-600 dark:text-neutral-400 text-left truncate">
                                {code.description}
                              </span>
                              {isICDCodeSelected(code) && (
                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-auto" />
                              )}
                            </button>
                            <button
                              onClick={() => removeFromAvailable(code)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                              title="Remove from available"
                            >
                              <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available CPT Codes */}
                  {availableCPTCodes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-2">
                        CPT Codes (Procedures)
                      </p>
                      <div className="space-y-2">
                        {availableCPTCodes.map((code) => (
                          <div
                            key={code.code}
                            className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${
                              isCPTCodeSelected(code)
                                ? "bg-purple-50 dark:bg-purple-950/30 border-purple-500 dark:border-purple-600"
                                : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
                            }`}
                          >
                            <button
                              onClick={() => toggleCPTCode(code)}
                              className="flex items-center gap-2 flex-1 min-w-0"
                            >
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 flex-shrink-0">
                                CPT
                              </span>
                              <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white flex-shrink-0">
                                {code.code}
                              </span>
                              <span className="text-xs text-neutral-600 dark:text-neutral-400 text-left truncate">
                                {code.description}
                              </span>
                              {isCPTCodeSelected(code) && (
                                <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 ml-auto" />
                              )}
                            </button>
                            <button
                              onClick={() => removeFromAvailable(code)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                              title="Remove from available"
                            >
                              <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!hasAvailableCodes && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
                <div className="px-3 py-12 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                  <Plus className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    No codes added yet
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Use AI suggestions or manual search to add codes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={handleClose}
            className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedICDCodes.length === 0 && selectedCPTCodes.length === 0}
            className="h-10 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add selected codes
          </button>
        </div>
      </div>
    </div>
  );
}
