import { X, UserPlus, Link as LinkIcon } from "lucide-react";

interface AddPatientSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectManualAdd: () => void;
  onSelectGenerateLink: () => void;
}

export function AddPatientSelectionDrawer({
  isOpen,
  onClose,
  onSelectManualAdd,
  onSelectGenerateLink,
}: AddPatientSelectionDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 z-50 overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Add patient
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            Choose how you would like to add a new patient to the system
          </p>

          <div className="space-y-3">
            {/* Manual Add Option */}
            <button
              onClick={onSelectManualAdd}
              className="w-full p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-primary-500 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/50 transition-colors">
                  <UserPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    Add patient details
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Manually enter patient information and create their account
                  </p>
                </div>
              </div>
            </button>

            {/* Generate Link Option */}
            <button
              onClick={onSelectGenerateLink}
              className="w-full p-5 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-950 hover:border-primary-500 transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-950/50 transition-colors">
                  <LinkIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                    Generate sign-up link
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Send a secure registration link to the patient's email
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
