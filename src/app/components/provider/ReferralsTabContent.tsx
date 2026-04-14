import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Printer, X, Download } from "lucide-react";

interface Referral {
  id: string;
  type: "Imaging" | "Lab Test" | "Specialist" | "Other";
  testName: string;
  reason: string;
  priority: "Routine" | "Urgent";
  dateCreated: string;
}

interface ReferralsTabContentProps {
  appointmentId: string;
  patientName: string;
  appointmentDate: string;
  providerName: string;
}

export function ReferralsTabContent({
  appointmentId,
  patientName,
  appointmentDate,
  providerName,
}: ReferralsTabContentProps) {
  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: "ref-1",
      type: "Imaging",
      testName: "Lumbar Spine X-Ray",
      reason: "Chronic lower back pain, assess spinal alignment",
      priority: "Routine",
      dateCreated: new Date().toISOString(),
    },
    {
      id: "ref-2",
      type: "Specialist",
      testName: "Orthopedic Consultation",
      reason: "Persistent shoulder pain, potential rotator cuff injury",
      priority: "Urgent",
      dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedReferralId, setExpandedReferralId] = useState<string | null>(null);

  // Form state for new/editing referral
  const [formType, setFormType] = useState<"Imaging" | "Lab Test" | "Specialist" | "Other">("Imaging");
  const [formTestName, setFormTestName] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formPriority, setFormPriority] = useState<"Routine" | "Urgent">("Routine");

  const handleAddReferral = () => {
    setIsAddingNew(true);
    setExpandedReferralId(null); // Collapse any expanded referral
    // Reset form
    setFormType("Imaging");
    setFormTestName("");
    setFormReason("");
    setFormPriority("Routine");
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setFormType("Imaging");
    setFormTestName("");
    setFormReason("");
    setFormPriority("Routine");
  };

  const handleSaveNew = () => {
    if (!formTestName.trim()) return;

    const newReferral: Referral = {
      id: `ref-${Date.now()}`,
      type: formType,
      testName: formTestName,
      reason: formReason,
      priority: formPriority,
      dateCreated: new Date().toISOString(),
    };

    setReferrals([newReferral, ...referrals]);
    setIsAddingNew(false);
    handleCancelAdd();
  };

  const handleExpandReferral = (id: string) => {
    if (expandedReferralId === id) {
      setExpandedReferralId(null);
    } else {
      setIsAddingNew(false); // Collapse add form
      setExpandedReferralId(id);
      
      // Load referral data into form
      const referral = referrals.find((r) => r.id === id);
      if (referral) {
        setFormType(referral.type);
        setFormTestName(referral.testName);
        setFormReason(referral.reason);
        setFormPriority(referral.priority);
      }
    }
  };

  const handleSaveEdit = () => {
    if (!formTestName.trim() || !expandedReferralId) return;

    setReferrals(
      referrals.map((ref) =>
        ref.id === expandedReferralId
          ? { ...ref, type: formType, testName: formTestName, reason: formReason, priority: formPriority }
          : ref
      )
    );
    setExpandedReferralId(null);
  };

  const handlePrint = (referral: Referral) => {
    // In real app, would open print dialog or generate PDF
    console.log("Print referral:", referral);
    alert(`Printing referral for ${referral.testName}`);
  };

  const handleDownload = (referral: Referral) => {
    // In real app, would generate and download PDF
    console.log("Download referral:", referral);
    alert(`Downloading referral note for ${referral.testName}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-end">
        {!isAddingNew && (
          <button
            onClick={handleAddReferral}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add referral
          </button>
        )}
      </div>

      {/* Add New Referral Form (Inline Expanded) */}
      {isAddingNew && (
        <div className="pb-6 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
          {/* Form Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              New referral
            </h3>
            <button
              onClick={handleCancelAdd}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>

          {/* Auto-filled Read-only Fields */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400 w-32 flex-shrink-0">
                Referral created on
              </span>
              <span className="text-neutral-900 dark:text-white font-medium">
                {formatAppointmentDate(appointmentDate)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4" />

          {/* Editable Fields */}
          <div className="space-y-4">
            {/* Referral Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Referral type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as typeof formType)}
                className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
              >
                <option value="Imaging">Imaging</option>
                <option value="Lab Test">Lab Test</option>
                <option value="Specialist">Specialist</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Test / Service Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Test / Service name
              </label>
              <input
                type="text"
                value={formTestName}
                onChange={(e) => setFormTestName(e.target.value)}
                placeholder="e.g., MRI Cervical Spine, Blood Panel, Cardiology Consultation"
                className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
              />
            </div>

            {/* Reason for Referral */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Reason for referral
              </label>
              <textarea
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                placeholder="Describe the clinical reason for this referral"
                rows={3}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none resize-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Priority
              </label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as typeof formPriority)}
                className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
              >
                <option value="Routine">Routine</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleCancelAdd}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNew}
              disabled={!formTestName.trim()}
              className="px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              Save referral
            </button>
          </div>
        </div>
      )}

      {/* Referrals List */}
      {referrals.length === 0 && !isAddingNew ? (
        <div className="text-center py-12">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            No referrals yet. Click "Add referral" to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div key={referral.id}>
              {/* Collapsed View */}
              {expandedReferralId !== referral.id && (
                <div className="py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {referral.type} • {referral.testName}
                      </h4>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Created {formatDate(referral.dateCreated)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExpandReferral(referral.id)}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handlePrint(referral)}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                      title="Print referral"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(referral)}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors"
                      title="Download referral"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Expanded Edit View */}
              {expandedReferralId === referral.id && (
                <div className="py-4 border-b border-neutral-200 dark:border-neutral-800 space-y-4">
                  {/* Form Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Edit referral
                    </h3>
                    <button
                      onClick={() => setExpandedReferralId(null)}
                      className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      title="Collapse"
                    >
                      <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    </button>
                  </div>

                  {/* Auto-filled Read-only Fields */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <span className="text-neutral-500 dark:text-neutral-400 w-32 flex-shrink-0">
                        Referral created on
                      </span>
                      <span className="text-neutral-900 dark:text-white font-medium">
                        {formatAppointmentDate(appointmentDate)}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4" />

                  {/* Editable Fields */}
                  <div className="space-y-4">
                    {/* Referral Type */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Referral type
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as typeof formType)}
                        className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
                      >
                        <option value="Imaging">Imaging</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Specialist">Specialist</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Test / Service Name */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Test / Service name
                      </label>
                      <input
                        type="text"
                        value={formTestName}
                        onChange={(e) => setFormTestName(e.target.value)}
                        placeholder="e.g., MRI Cervical Spine, Blood Panel, Cardiology Consultation"
                        className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
                      />
                    </div>

                    {/* Reason for Referral */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Reason for referral
                      </label>
                      <textarea
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        placeholder="Describe the clinical reason for this referral"
                        rows={3}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none resize-none"
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Priority
                      </label>
                      <select
                        value={formPriority}
                        onChange={(e) => setFormPriority(e.target.value as typeof formPriority)}
                        className="w-full h-10 px-3 py-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-[border-color,box-shadow] outline-none"
                      >
                        <option value="Routine">Routine</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handlePrint(referral)}
                      className="inline-flex items-center gap-2 px-3 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedReferralId(null)}
                        className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={!formTestName.trim()}
                        className="px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                      >
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}