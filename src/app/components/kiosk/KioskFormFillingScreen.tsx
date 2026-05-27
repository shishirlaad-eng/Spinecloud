import { useState } from "react";
import { X, ClipboardList, FileSignature, CheckCircle2 } from "lucide-react";
import { SpineCloudQuestionnaire } from "../patient/SpineCloudQuestionnaire";
import { ConsentSignatureScreen } from "../consent/ConsentSignatureScreen";

interface KioskFormFillingScreenProps {
  type: "form" | "agreement";
  documentId: string;
  documentName: string;
  patientName: string;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export function KioskFormFillingScreen({
  type,
  documentId,
  documentName,
  patientName,
  onClose,
  onComplete
}: KioskFormFillingScreenProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = (data: any) => {
    setIsCompleted(true);
    // In a real app, you'd save the data here
    setTimeout(() => {
      onComplete(data);
    }, 2000);
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-[60] flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-950/30 flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-success-600 dark:text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Thank You, {patientName}!</h2>
        <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
          Your {type === "form" ? "form" : "agreement"} has been successfully submitted. 
          Please return the device to the front desk.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-950 z-[60] flex flex-col">
      {/* Kiosk Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center">
            {type === "form" ? (
              <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            ) : (
              <FileSignature className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">{documentName}</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Patient: {patientName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Kiosk Content Area */}
      <div className="flex-1 overflow-y-auto relative">
        {type === "form" ? (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <SpineCloudQuestionnaire 
              onComplete={handleComplete}
              onSkip={onClose}
              patientAge={35} // Mock data
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-8 px-4">
            <ConsentSignatureScreen 
              onBack={onClose}
              onComplete={handleComplete}
            />
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="bg-neutral-50 dark:bg-neutral-900/50 px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 text-center">
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">
          SpineCloudIQ Kiosk Mode • Secure Session
        </p>
      </div>
    </div>
  );
}
