import { useState } from "react";
import { Calendar } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface BookingPreferencesStepProps {
  data: WizardData;
  onNext: (data: Partial<WizardData>) => void;
  onSkip: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
}

export function BookingPreferencesStep({
  data,
  onNext,
  onSkip,
  onBack,
  onSaveAndExit,
}: BookingPreferencesStepProps) {
  const [allowStaffOverrides, setAllowStaffOverrides] = useState(
    data.bookingPreferences?.allowStaffOverrides ?? true
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      bookingPreferences: {
        allowStaffOverrides,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
          Booking preferences
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Configure organization-wide booking rules (optional)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Location-specific settings like self-booking, cancellation windows, and rescheduling are configured per location. These organization-wide settings apply across all locations.
          </p>
        </div>

        {/* Staff Overrides */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Allow staff overrides
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Let staff bypass booking restrictions when needed
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allowStaffOverrides}
              onChange={(e) => setAllowStaffOverrides(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-300 dark:bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onBack}
            className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSaveAndExit}
              className="h-10 px-6 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Save & Exit
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="h-10 px-6 text-neutral-600 dark:text-neutral-400 text-sm font-medium hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="h-10 px-6 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
