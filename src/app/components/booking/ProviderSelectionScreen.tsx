import { useState } from "react";
import { User, Stethoscope, Calendar, ArrowLeft } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availability: string;
}

interface ProviderSelectionScreenProps {
  providers: Provider[];
  clinicName: string;
  onContinue: (providerId: string) => void;
  onBack: () => void;
}

export function ProviderSelectionScreen({ 
  providers, 
  clinicName,
  onContinue, 
  onBack 
}: ProviderSelectionScreenProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (!selectedProviderId) {
      setShowError(true);
      return;
    }
    onContinue(selectedProviderId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-4xl">
        {/* Logo - Outside Card */}


        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Back Button */}
          <div className="px-6 pt-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          </div>

          {/* Header */}
          <div className="px-6 pt-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Select provider
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
              Choose your preferred provider at {clinicName}
            </p>
          </div>

          {/* Provider Cards */}
          <div className="p-6 space-y-4">
            {providers.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No providers available at this location
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => {
                      setSelectedProviderId(provider.id);
                      setShowError(false);
                    }}
                    className={`relative border rounded-lg p-5 text-left transition-all ${
                      selectedProviderId === provider.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                        : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {/* Selection Indicator */}
                    {selectedProviderId === provider.id && (
                      <div className="absolute top-3 right-3 flex items-center justify-center size-5 rounded-full bg-primary-600 dark:bg-primary-500">
                        <div className="size-2 rounded-full bg-white" />
                      </div>
                    )}

                    {/* Provider Info */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-neutral-900 dark:text-white pr-6">
                        {provider.name}
                      </h4>
                      
                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <Stethoscope className="w-4 h-4 shrink-0" />
                        <span>{provider.specialization}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-success-600 dark:text-success-400">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{provider.availability}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Error Message */}
            {showError && (
              <p className="text-xs text-destructive">
                Please select a provider to continue
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-between gap-3">
            <button
              onClick={onBack}
              className="px-6 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedProviderId || providers.length === 0}
              className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}