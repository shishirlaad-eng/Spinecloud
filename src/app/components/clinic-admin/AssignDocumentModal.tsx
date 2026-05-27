import { useState } from "react";
import { X, Search, FileText, ClipboardList, Mail, Smartphone, Monitor, ChevronRight } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: "form" | "agreement";
  description?: string;
  category?: string;
}

interface AssignDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (data: {
    documentId: string;
    type: "form" | "agreement";
    deliveryMethod: "email" | "sms" | "kiosk";
  }) => void;
  availableDocuments: Document[];
}

export function AssignDocumentModal({
  isOpen,
  onClose,
  onAssign,
  availableDocuments
}: AssignDocumentModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms" | "kiosk">("email");

  if (!isOpen) return null;

  const filteredDocuments = availableDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (selectedDoc) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (selectedDoc) {
      onAssign({
        documentId: selectedDoc.id,
        type: selectedDoc.type,
        deliveryMethod
      });
      onClose();
      // Reset state for next time
      setStep(1);
      setSelectedDoc(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {step === 1 ? "Assign Document" : "Select Delivery Method"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {step === 1 ? "Choose a form or agreement to assign to the patient" : `Assigning: ${selectedDoc?.name}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search forms and agreements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {/* Document List */}
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedDoc?.id === doc.id
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                        : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === "form" 
                          ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
                      }`}>
                        {doc.type === "form" ? <ClipboardList className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">{doc.name}</p>
                        <p className="text-xs text-neutral-500">{doc.category || (doc.type === "form" ? "Clinical Form" : "Legal Agreement")}</p>
                      </div>
                    </div>
                    {selectedDoc?.id === doc.id && (
                      <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
                {filteredDocuments.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No documents found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">How should the patient receive this?</p>
              
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setDeliveryMethod("email")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    deliveryMethod === "email"
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                    <Mail className={`w-5 h-5 ${deliveryMethod === "email" ? "text-primary-600" : "text-neutral-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Send via Email</p>
                    <p className="text-xs text-neutral-500">Patient will receive a secure link to complete remotely</p>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMethod("sms")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    deliveryMethod === "sms"
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                    <Smartphone className={`w-5 h-5 ${deliveryMethod === "sms" ? "text-primary-600" : "text-neutral-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Send via SMS</p>
                    <p className="text-xs text-neutral-500">A text message with a secure link will be sent</p>
                  </div>
                </button>

                <button
                  onClick={() => setDeliveryMethod("kiosk")}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    deliveryMethod === "kiosk"
                      ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                      : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                    <Monitor className={`w-5 h-5 ${deliveryMethod === "kiosk" ? "text-primary-600" : "text-neutral-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Fill Now (Kiosk Mode)</p>
                    <p className="text-xs text-neutral-500">Open document immediately for in-clinic completion</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          <button
            onClick={step === 1 ? handleNext : handleSubmit}
            disabled={!selectedDoc}
            className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {step === 1 ? "Continue" : "Assign Document"}
          </button>
        </div>
      </div>
    </div>
  );
}
