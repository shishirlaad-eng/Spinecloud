import { CheckCircle, MapPin, UserPlus, Users, ArrowRight } from "lucide-react";
import type { WizardData } from "../SetupWizard";

interface SetupCompleteStepProps {
  data: WizardData;
  onComplete: () => void;
}

export function SetupCompleteStep({ data, onComplete }: SetupCompleteStepProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
      {/* Success Icon */}
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-success-50 dark:bg-success-950/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-success-600 dark:text-success-400" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-3">
        Setup complete!
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-12 max-w-lg mx-auto">
        Congratulations! You've successfully configured your clinic. Here's what you've set up:
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
        {/* Location */}
        {data.location && (
          <div className="p-6 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-100">
                Location created
              </h3>
            </div>
            <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
              {data.location.name}
            </p>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              {data.location.city}, {data.location.state}
            </p>
          </div>
        )}

        {/* Provider */}
        {data.provider && (
          <div className="p-6 bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900/50 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <h3 className="text-sm font-semibold text-success-900 dark:text-success-100">
                Provider added
              </h3>
            </div>
            <p className="text-sm font-medium text-success-800 dark:text-success-200">
              Dr. {data.provider.firstName} {data.provider.lastName}
            </p>
            <p className="text-sm text-success-700 dark:text-success-300 mt-1">
              {data.provider.specialty}
            </p>
          </div>
        )}

        {/* Staff */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Staff invited
            </h3>
          </div>
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {data.staff.length} {data.staff.length === 1 ? "member" : "members"}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            {data.staff.length > 0 ? "Invitations sent" : "You can add staff later"}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-12 text-left max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 text-center">
          What's next?
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Explore the dashboard
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Familiarize yourself with the clinic management tools
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Configure additional settings
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Set up questionnaires, consent forms, and services
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 text-sm font-medium">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                Start accepting appointments
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Begin scheduling and managing patient appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onComplete}
        className="inline-flex items-center gap-2 h-11 px-8 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors"
      >
        Go to dashboard
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
