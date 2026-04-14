import { useState } from "react";
import { X, Save, Info } from "lucide-react";

interface SpineCloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  currentConfig?: {
    enabled: boolean;
    frequencyType: "everyNVisits" | "disabled";
    everyNVisits: number;
  };
  onSave: (config: {
    enabled: boolean;
    frequencyType: "everyNVisits" | "disabled";
    everyNVisits: number;
  }) => void;
}

export function SpineCloudConfigModal({
  isOpen,
  onClose,
  patientName,
  currentConfig = {
    enabled: false,
    frequencyType: "disabled",
    everyNVisits: 4,
  },
  onSave,
}: SpineCloudConfigModalProps) {
  const [enabled, setEnabled] = useState(currentConfig.enabled);
  const [everyNVisits, setEveryNVisits] = useState(currentConfig.everyNVisits);

  const handleSave = () => {
    onSave({
      enabled,
      frequencyType: enabled ? "everyNVisits" : "disabled",
      everyNVisits,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
              SpineCloud Index Configuration
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Configure frequency for {patientName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Info Banner */}
          <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-300 mb-1">
                  Per-Patient Configuration
                </p>
                <p className="text-sm text-primary-700 dark:text-primary-400">
                  This configuration is specific to this patient and overrides the global inactivity period setting.
                </p>
              </div>
            </div>
          </div>

          {/* Enable Toggle */}
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <label htmlFor="enableConfig" className="text-sm font-semibold text-neutral-900 dark:text-white block mb-2 cursor-pointer">
                  Enable visit-based frequency
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  When enabled, patient will be prompted to complete the SpineCloud Index at specific visit intervals
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="enableConfig"
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {/* Frequency Configuration */}
          {enabled && (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-4">
              <div>
                <label htmlFor="everyNVisits" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                  Complete SpineCloud Index every N visits
                </label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Patient will be prompted to complete the questionnaire at every Nth visit
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Every</span>
                  <input
                    type="number"
                    id="everyNVisits"
                    min="1"
                    max="50"
                    value={everyNVisits}
                    onChange={(e) => setEveryNVisits(parseInt(e.target.value) || 4)}
                    className="w-24 h-10 px-3 py-1 border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none text-center"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    visit{everyNVisits !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Example Scenarios */}
              <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Example:
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  If set to <strong>every {everyNVisits} visits</strong>, the patient will complete the SpineCloud Index during their {everyNVisits === 1 ? "1st" : everyNVisits === 2 ? "2nd" : everyNVisits === 3 ? "3rd" : `${everyNVisits}th`} visit, then again on their {everyNVisits * 2 === 1 ? "1st" : everyNVisits * 2 === 2 ? "2nd" : everyNVisits * 2 === 3 ? "3rd" : `${everyNVisits * 2}th`} visit, and so on.
                </p>
              </div>

              {/* Common Configurations */}
              <div>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Common configurations:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[4, 6, 8, 12].map((value) => (
                    <button
                      key={value}
                      onClick={() => setEveryNVisits(value)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        everyNVisits === value
                          ? "bg-primary-50 dark:bg-primary-950/30 border-primary-600 text-primary-700 dark:text-primary-300"
                          : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`}
                    >
                      Every {value} visits
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Disabled State Message */}
          {!enabled && (
            <div className="bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                When disabled, this patient will follow the global inactivity period setting configured by the clinic administrator.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-neutral-900">
          <button
            onClick={onClose}
            className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save configuration
          </button>
        </div>
      </div>
    </div>
  );
}
