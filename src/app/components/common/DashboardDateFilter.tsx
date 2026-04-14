import { useState } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";

export type DateRange = {
  start: Date;
  end: Date;
  label: string;
};

interface DashboardDateFilterProps {
  onChange: (range: DateRange) => void;
  className?: string;
}

const PRESETS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", days: 90 },
];

function getPresetRange(days: number, label: string): DateRange {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end, label };
}

export function DashboardDateFilter({ onChange, className = "" }: DashboardDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("Last 30 days");
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handlePreset = (label: string, days: number) => {
    setActivePreset(label);
    setShowCustom(false);
    onChange(getPresetRange(days, label));
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (!customStart || !customEnd) return;
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (start > end) return;
    const label = `${new Date(customStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(customEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    setActivePreset(label);
    onChange({ start, end, label });
    setIsOpen(false);
    setShowCustom(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 h-9 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <CalendarDays className="w-4 h-4 text-neutral-500" />
        <span className="font-medium">{activePreset}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setIsOpen(false); setShowCustom(false); }} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-20 overflow-hidden">
            {/* Quick Presets */}
            <div className="p-2">
              {PRESETS.map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => handlePreset(label, days)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePreset === label && !showCustom
                      ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 font-medium"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Custom Range Toggle */}
              <button
                onClick={() => setShowCustom(!showCustom)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  showCustom
                    ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 font-medium"
                    : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                Custom range…
              </button>
            </div>

            {/* Custom Date Pickers */}
            {showCustom && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">From</label>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">To</label>
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full h-8 px-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none"
                  />
                </div>
                <button
                  onClick={handleCustomApply}
                  disabled={!customStart || !customEnd}
                  className="w-full h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
