import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { CreateLocationStep } from "./steps/CreateLocationStep";
import { CreateProviderStep } from "./steps/CreateProviderStep";
import { InviteStaffStep } from "./steps/InviteStaffStep";
import { SetupCompleteStep } from "./steps/SetupCompleteStep";

export interface WizardData {
  // Step 1
  location: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    timezone: string;
    workingHours: any;
    selfBookingEnabled: boolean;
    allowPatientCancel: boolean;
    allowPatientReschedule: boolean;
    minNoticeHours: number;
    maxFutureDays: number;
    cancellationWindow: number;
    rescheduleWindow: number;
    allowStaffOverrides: boolean;
  } | null;

  // Step 2
  provider: {
    firstName: string;
    lastName: string;
    email: string;
    specialty: string;
    assignedLocations: string[];
    workingHours: any;
    selfBookable: boolean;
  } | null;

  // Step 3
  staff: {
    email: string;
    role: string;
    locations: string[];
  }[];
}

interface SetupWizardProps {
  onComplete: (data: WizardData) => void;
  onLogout: () => void;
  existingData?: Partial<WizardData>;
}

const steps = [
  { id: 1, name: "First location", key: "location" },
  { id: 2, name: "First provider", key: "provider" },
  { id: 3, name: "Invite staff", key: "staff" },
];

export function SetupWizard({ onComplete, onLogout, existingData }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    location: existingData?.location || null,
    provider: existingData?.provider || null,
    staff: existingData?.staff || [],
  });

  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSaveAndExit = () => {
    // Save progress to local storage or backend
    localStorage.setItem("setupWizardProgress", JSON.stringify({ currentStep, wizardData }));
    onLogout();
  };

  const handleComplete = () => {
    localStorage.removeItem("setupWizardProgress");
    onComplete(wizardData);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                SpineCloudIQ
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Initial setup wizard
              </p>
            </div>
            <button
              onClick={handleSaveAndExit}
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Save & exit
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {currentStep <= steps.length && (
        <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        currentStep > step.id
                          ? "bg-success-500 text-white"
                          : currentStep === step.id
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="hidden md:block">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.id
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {step.name}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id
                          ? "bg-success-500"
                          : "bg-neutral-200 dark:bg-neutral-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {currentStep === 1 && (
          <CreateLocationStep
            data={wizardData}
            onNext={(data) => {
              updateWizardData(data);
              handleNext();
            }}
            onSkip={handleSkip}
            onBack={handleBack}
            onSaveAndExit={handleSaveAndExit}
          />
        )}

        {currentStep === 2 && (
          <CreateProviderStep
            data={wizardData}
            onNext={(data) => {
              updateWizardData(data);
              handleNext();
            }}
            onSkip={handleSkip}
            onBack={handleBack}
            onSaveAndExit={handleSaveAndExit}
          />
        )}

        {currentStep === 3 && (
          <InviteStaffStep
            data={wizardData}
            onNext={(data) => {
              updateWizardData(data);
              handleNext();
            }}
            onSkip={handleSkip}
            onBack={handleBack}
            onSaveAndExit={handleSaveAndExit}
          />
        )}

        {currentStep === 4 && (
          <SetupCompleteStep
            data={wizardData}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}