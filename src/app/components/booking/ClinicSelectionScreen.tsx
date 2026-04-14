import { useState } from "react";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  workingHours: string;
}

interface ClinicSelectionScreenProps {
  clinics: Clinic[];
  onContinue: (clinicId: string) => void;
  onBack?: () => void;
}

export function ClinicSelectionScreen({ clinics, onContinue, onBack }: ClinicSelectionScreenProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (!selectedClinicId) {
      setShowError(true);
      return;
    }
    onContinue(selectedClinicId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-4xl">
        {/* Logo - Outside Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Back Button */}
          {onBack && (
            <div className="px-6 pt-6">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back
              </button>
            </div>
          )}

          {/* Header */}
          <div className="px-6 pt-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              Select clinic
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
              Choose your preferred clinic location for the appointment
            </p>
          </div>

          {/* Clinic Cards */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clinics.map((clinic) => (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => {
                    setSelectedClinicId(clinic.id);
                    setShowError(false);
                  }}
                  className={`relative border rounded-lg p-5 text-left transition-all ${
                    selectedClinicId === clinic.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 ring-2 ring-primary-500/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                >
                  {/* Selection Indicator */}
                  {selectedClinicId === clinic.id && (
                    <div className="absolute top-3 right-3 flex items-center justify-center size-5 rounded-full bg-primary-600 dark:bg-primary-500">
                      <div className="size-2 rounded-full bg-white" />
                    </div>
                  )}

                  {/* Clinic Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-900 dark:text-white pr-6">
                      {clinic.name}
                    </h4>
                    
                    <div className="flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{clinic.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{clinic.workingHours}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {showError && (
              <p className="text-xs text-destructive">
                Please select a clinic to continue
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedClinicId}
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