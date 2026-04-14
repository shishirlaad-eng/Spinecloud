import { ArrowLeft, UserPlus, Link as LinkIcon } from "lucide-react";

interface AddPatientSelectionScreenProps {
  onBack: () => void;
  onSelectManualAdd: () => void;
  onSelectGenerateLink: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function AddPatientSelectionScreen({
  onBack,
  onSelectManualAdd,
  onSelectGenerateLink,
  onNavigate,
  onLogout,
}: AddPatientSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to patients</span>
              </button>
            </div>
            <button
              onClick={onLogout}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
            Add patient
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose how you would like to add a new patient to the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual Add Option */}
          <button
            onClick={onSelectManualAdd}
            className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-primary-500 transition-all text-left group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/50 transition-colors">
                <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Add patient details
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Manually enter patient information and create their account
              </p>
            </div>
          </button>

          {/* Generate Link Option */}
          <button
            onClick={onSelectGenerateLink}
            className="p-6 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-primary-500 transition-all text-left group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/50 transition-colors">
                <LinkIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Generate sign-up link
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Send a secure registration link to the patient's email
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
