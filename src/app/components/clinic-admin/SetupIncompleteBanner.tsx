import { AlertCircle, ArrowRight } from "lucide-react";

interface SetupIncompleteBannerProps {
  onResumeSetup: () => void;
}

export function SetupIncompleteBanner({ onResumeSetup }: SetupIncompleteBannerProps) {
  return (
    <div className="bg-primary-600 dark:bg-primary-700 border-b border-primary-700 dark:border-primary-800">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">
                Complete your clinic setup to get started
              </p>
              <p className="text-sm text-primary-100">
                Finish configuring your locations, providers, and preferences
              </p>
            </div>
          </div>
          <button
            onClick={onResumeSetup}
            className="inline-flex items-center gap-2 h-9 px-4 bg-white text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0"
          >
            Resume setup
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
