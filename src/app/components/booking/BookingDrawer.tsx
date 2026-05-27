import { useState } from "react";
import { X, MapPin, User, Calendar, ChevronRight, ArrowLeft, Check, FileText, Clock } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availability: string;
}

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { branchId: string; service: string; providerId: string; date: string; time: string }) => void;
  branches: Branch[];
  providers: Provider[];
  services: any[];
}

type BookingStep = "branch" | "service" | "provider" | "datetime";

export function BookingDrawer({
  isOpen,
  onClose,
  onConfirm,
  branches,
  providers,
  services,
}: BookingDrawerProps) {
  const [step, setStep] = useState<BookingStep>("branch");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBack = () => {
    if (step === "branch") onClose();
    else if (step === "service") setStep("branch");
    else if (step === "provider") setStep("service");
    else if (step === "datetime") setStep("provider");
  };

  const handleNext = () => {
    if (step === "branch" && selectedBranch) setStep("service");
    else if (step === "service" && selectedService) setStep("provider");
    else if (step === "provider" && selectedProvider) setStep("datetime");
  };

  const handleConfirm = () => {
    if (selectedBranch && selectedService && selectedProvider && selectedDate && selectedTime) {
      onConfirm({
        branchId: selectedBranch.id,
        service: selectedService,
        providerId: selectedProvider.id,
        date: selectedDate,
        time: selectedTime,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setStep("branch");
    setSelectedBranch(null);
    setSelectedService("");
    setSelectedProvider(null);
    setSelectedDate("");
    setSelectedTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white dark:bg-neutral-950 shadow-2xl overflow-y-auto z-[101] animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Book Appointment</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {step === "branch" && "Select branch"}
                {step === "service" && "Select service"}
                {step === "provider" && "Select provider"}
                {step === "datetime" && "Select date & time"}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "branch" && (
            <div className="space-y-3">
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => { setSelectedBranch(branch); setStep("service"); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedBranch?.id === branch.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neutral-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 dark:text-white">{branch.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{branch.address}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "service" && (
            <div className="space-y-3">
              {services.map(service => {
                const sName = service.name || service;
                return (
                  <button
                    key={sName}
                    onClick={() => { setSelectedService(sName); setStep("provider"); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedService === sName ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-neutral-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white">{sName}</h4>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {step === "provider" && (
            <div className="space-y-3">
              {providers.map(provider => (
                <button
                  key={provider.id}
                  onClick={() => { setSelectedProvider(provider); setStep("datetime"); }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedProvider?.id === provider.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-neutral-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral-900 dark:text-white">{provider.name}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{provider.specialization}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === "datetime" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm outline-none focus:border-primary-500"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                          selectedTime === t ? "border-primary-500 bg-primary-600 text-white" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 p-6 flex justify-end gap-3 z-10">
          <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            Cancel
          </button>
          {step === "datetime" ? (
            <button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (step === "branch" && !selectedBranch) ||
                (step === "service" && !selectedService) ||
                (step === "provider" && !selectedProvider)
              }
              className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
