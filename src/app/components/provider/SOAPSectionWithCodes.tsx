import { useState } from "react";
import { FileText, X, Sparkles } from "lucide-react";
import { ICDCPTCodesDrawer } from "./ICDCPTCodesDrawer";

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface SOAPSectionWithCodesProps {
  title: string;
  value: string;
  codes?: ICDCPTCode[]; // Make optional
  onChange: (value: string) => void;
  onCodesChange: (codes: ICDCPTCode[]) => void;
  placeholder: string;
  isReadOnly: boolean;
}

export function SOAPSectionWithCodes({
  title,
  value,
  codes = [], // Add default empty array
  onChange,
  onCodesChange,
  placeholder,
  isReadOnly,
}: SOAPSectionWithCodesProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    if (!isReadOnly) {
      setIsDrawerOpen(true);
    }
  };

  const handleConfirmCodes = (newCodes: ICDCPTCode[]) => {
    onCodesChange(newCodes);
  };

  // Ensure codes is always an array
  const safeCodes = codes || [];

  return (
    <>
      <div
        className={`group relative transition-all ${
          isFocused
            ? "ring-2 ring-primary-500/20 dark:ring-primary-500/30"
            : ""
        }`}
      >
        <div className="absolute -top-2 left-3 px-2 bg-white dark:bg-neutral-900 z-10">
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            {title}
          </label>
        </div>
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isReadOnly}
            rows={6}
            className="w-full px-4 py-4 pb-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all resize-y disabled:opacity-60 disabled:cursor-not-allowed min-h-[140px]"
          />

          {/* ICD-CPT Section */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-xl px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 flex-shrink-0">
                  ICD-CPT:
                </label>
                {safeCodes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    {safeCodes.map((code) => (
                      <div
                        key={code.code}
                        className="inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs"
                      >
                        <span
                          className={`inline-flex items-center justify-center px-1 py-0.5 rounded text-xs font-medium ${
                            code.type === "ICD"
                              ? "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400"
                          }`}
                        >
                          {code.type}
                        </span>
                        <span className="font-mono font-medium text-neutral-900 dark:text-white">
                          {code.code}
                        </span>
                        {!isReadOnly && (
                          <button
                            onClick={() => {
                              onCodesChange(safeCodes.filter((c) => c.code !== code.code));
                            }}
                            className="p-0.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded transition-colors"
                          >
                            <X className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                    No codes added
                  </span>
                )}
              </div>
              {!isReadOnly && (
                <button
                  onClick={handleOpenDrawer}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 h-7 rounded-md bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggest</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ICD-CPT Codes Drawer */}
      <ICDCPTCodesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        soapContent={value}
        sectionName={title as "Subjective" | "Objective" | "Assessment" | "Plan"}
        existingCodes={safeCodes}
        onConfirm={handleConfirmCodes}
      />
    </>
  );
}