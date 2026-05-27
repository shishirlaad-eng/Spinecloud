import { useState } from "react";
import { ChevronLeft, CheckCircle, FileText, X } from "lucide-react";

interface ConsentFormsScreenProps {
  onBack: () => void;
  onComplete: () => void;
}

type ConsentType = "terms" | "privacy" | "hipaa" | "treatment";

interface ConsentDocument {
  id: ConsentType;
  title: string;
  icon: typeof FileText;
  content: React.ReactNode;
}

export function ConsentFormsScreen({ onBack, onComplete }: ConsentFormsScreenProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hipaaAccepted, setHipaaAccepted] = useState(false);
  const [treatmentAccepted, setTreatmentAccepted] = useState(false);
  const [openModal, setOpenModal] = useState<ConsentType | null>(null);

  const isAllAccepted = termsAccepted && privacyAccepted && hipaaAccepted && treatmentAccepted;

  const consentDocuments: ConsentDocument[] = [
    {
      id: "terms",
      title: "Terms and conditions",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              1. Acceptance of Terms
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              By accessing and using the SpineCloudIQ Patient Portal ("Portal"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              2. Patient Responsibilities
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              You agree to provide accurate, current, and complete information during registration and appointment booking. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              3. Appointment Policy
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Please arrive 15 minutes before your scheduled appointment time. Cancellations must be made at least 24 hours in advance through the Portal or by calling our office directly. Late cancellations or no-shows may incur a cancellation fee as permitted by law. We reserve the right to refuse service to patients who repeatedly miss appointments without proper notice.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              4. Service Availability
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We strive to maintain continuous service availability but do not guarantee uninterrupted access to the Portal. The Portal may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We are not liable for any loss or damage arising from service interruptions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              5. Limitation of Liability
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              SpineCloudIQ shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Portal.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "privacy",
      title: "Privacy policy",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              1. Information Collection
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We collect personal and health information necessary to provide quality healthcare services. This includes demographic data (name, address, date of birth, contact information), medical history, insurance information, treatment records, and appointment details. We collect this information through forms you complete, during your appointments, and through communications with our staff.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              2. Use of Information
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Your information is used solely for treatment, payment processing, and healthcare operations. We use your information to: schedule and manage appointments, provide medical treatment, process insurance claims, send appointment reminders, communicate about your care, and comply with legal and regulatory requirements. We do not sell or share your data with third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              3. Data Security
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal and health information from unauthorized access, disclosure, alteration, or destruction. This includes encryption of data in transit and at rest, regular security audits, staff training on privacy practices, and strict access controls. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              4. Your Rights
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              You have the right to access, update, or request deletion of your personal information in accordance with applicable laws. You may request a copy of your medical records, request corrections to inaccurate information, and withdraw consent for certain uses of your information (though this may affect our ability to provide services). To exercise these rights, please contact our Privacy Officer.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              5. Cookies and Tracking
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              Our Portal uses cookies and similar tracking technologies to enhance user experience, maintain session information, and analyze Portal usage. You can control cookie settings through your browser, though disabling cookies may affect Portal functionality.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "hipaa",
      title: "HIPAA authorization",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Authorization for Use and Disclosure of Protected Health Information
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I authorize SpineCloudIQ and its healthcare providers, staff, and affiliated entities to use and disclose my protected health information (PHI) as described in this authorization.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              1. Information to be Used or Disclosed
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              This authorization applies to all health information that relates to my past, present, or future physical or mental health condition, healthcare services provided to me, and payment for those services. This includes but is not limited to: medical records, examination findings, test results, diagnoses, treatment plans, medications, and billing information.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              2. Purpose of Use and Disclosure
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              My PHI will be used and disclosed for treatment, payment, and healthcare operations purposes, including: coordinating my care with other healthcare providers, processing insurance claims and payment, quality improvement activities, risk management, compliance with legal requirements, and communication through the patient portal.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              3. Electronic Health Records
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              This authorization includes the use of electronic health records (EHR) and secure communication through the Patient Portal. I understand that my health information will be stored electronically and that I will have access to certain information through the Portal.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              4. Right to Revoke
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I understand that I have the right to revoke this authorization at any time by providing written notice to SpineCloudIQ. I understand that revocation will not affect any actions taken prior to receiving the revocation and that revocation may affect my ability to receive certain services.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              5. Re-disclosure
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I acknowledge that information used or disclosed pursuant to this authorization may be subject to re-disclosure by the recipient and may no longer be protected by federal privacy regulations. However, SpineCloudIQ requires recipients to maintain the confidentiality of PHI to the extent required by law.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              6. Expiration
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              This authorization remains in effect until revoked or until the purpose for which it was given is fulfilled, whichever occurs first. In no event will this authorization remain in effect for more than one year after my last date of service unless otherwise required by law.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "treatment",
      title: "Consent to treat",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Informed Consent for Chiropractic and Related Healthcare Services
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I hereby consent to receive chiropractic and related healthcare services from SpineCloudIQ and its authorized healthcare providers.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              1. Nature of Chiropractic Care
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I understand that chiropractic care involves the diagnosis and treatment of disorders of the musculoskeletal system, particularly the spine, and their effects on the nervous system and general health. Treatment may include:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed ml-4 space-y-1">
              <li>Chiropractic adjustments and spinal manipulations</li>
              <li>Physical therapy modalities (heat, cold, electrical stimulation, ultrasound)</li>
              <li>Soft tissue techniques and massage therapy</li>
              <li>Rehabilitative and therapeutic exercises</li>
              <li>Postural and lifestyle counseling</li>
              <li>Nutritional advice and supplementation recommendations</li>
              <li>Other related therapeutic procedures as deemed appropriate</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              2. Potential Benefits
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              The potential benefits of chiropractic care include: relief from pain and discomfort, improved mobility and range of motion, enhanced physical function and performance, decreased muscle tension and stiffness, improved posture, and overall enhancement in quality of life. However, results are not guaranteed, and individual responses to treatment vary.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              3. Potential Risks and Side Effects
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I understand that, as with any healthcare procedure, there are potential risks and side effects associated with chiropractic care. These may include:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed ml-4 space-y-1">
              <li>Temporary soreness or discomfort following treatment</li>
              <li>Muscle stiffness or fatigue</li>
              <li>Temporary increase in symptoms</li>
              <li>Bruising at treatment sites</li>
              <li>Rare complications such as rib fracture, stroke, or disc herniation</li>
            </ul>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mt-2">
              I understand that serious complications are extremely rare but possible. My provider will use appropriate techniques and precautions to minimize risks.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              4. Alternative Treatments
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I understand that alternative treatments for my condition may include: medical care and prescription medications, physical therapy, surgery, acupuncture, or no treatment at all. I have had the opportunity to discuss these alternatives with my provider.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              5. Acknowledgment
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              I acknowledge that I have had the opportunity to ask questions about my condition, proposed treatment, and the risks and benefits of chiropractic care. My questions have been answered to my satisfaction. I understand that I have the right to refuse any recommended procedure or withdraw consent for treatment at any time.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              6. Consent to Treat
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              By accepting below, I voluntarily consent to receive chiropractic and related healthcare services as deemed appropriate by my healthcare provider. I understand that this consent remains in effect for all future visits unless I revoke it in writing.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const getCheckboxState = (type: ConsentType) => {
    switch (type) {
      case "terms":
        return termsAccepted;
      case "privacy":
        return privacyAccepted;
      case "hipaa":
        return hipaaAccepted;
      case "treatment":
        return treatmentAccepted;
    }
  };

  const toggleCheckbox = (type: ConsentType) => {
    switch (type) {
      case "terms":
        setTermsAccepted(!termsAccepted);
        break;
      case "privacy":
        setPrivacyAccepted(!privacyAccepted);
        break;
      case "hipaa":
        setHipaaAccepted(!hipaaAccepted);
        break;
      case "treatment":
        setTreatmentAccepted(!treatmentAccepted);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAllAccepted) {
      onComplete();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-3xl">
        {/* Logo - Outside Card */}


        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center size-12 rounded-full bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-500 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Review and accept consent forms
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Please read and accept all required documents to confirm your appointment
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {consentDocuments.map((doc) => {
                const Icon = doc.icon;
                const isAccepted = getCheckboxState(doc.id);
                
                return (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-5 transition-colors ${
                      isAccepted
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20"
                        : "border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center size-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {doc.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setOpenModal(doc.id)}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
                        >
                          Click to read full document
                        </button>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAccepted}
                          onChange={() => toggleCheckbox(doc.id)}
                          className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          Accept
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isAllAccepted}
                  className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Accept all and confirm appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal for Reading Full Document */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {consentDocuments.find((d) => d.id === openModal)?.title}
              </h3>
              <button
                onClick={() => setOpenModal(null)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto flex-1">
              {consentDocuments.find((d) => d.id === openModal)?.content}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={getCheckboxState(openModal)}
                  onChange={() => toggleCheckbox(openModal)}
                  className="w-5 h-5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  I have read and accept this document
                </span>
              </label>
              <button
                onClick={() => setOpenModal(null)}
                className="px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
