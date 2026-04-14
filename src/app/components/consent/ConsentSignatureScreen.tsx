import { useState, useRef, useEffect } from "react";
import { ChevronLeft, CheckCircle, Pen, Type } from "lucide-react";

interface ConsentSignatureScreenProps {
  onBack: () => void;
  onComplete: (signature: {
    type: "draw" | "type";
    data: string;
    timestamp: string;
    consentAccepted: {
      terms: boolean;
      privacy: boolean;
      hipaa: boolean;
      consentToTreat: boolean;
    };
  }) => void;
}

export function ConsentSignatureScreen({ onBack, onComplete }: ConsentSignatureScreenProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [hipaaAccepted, setHipaaAccepted] = useState(false);
  const [consentToTreat, setConsentToTreat] = useState(false);
  
  const [signatureType, setSignatureType] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const isAllAccepted = termsAccepted && privacyAccepted && hipaaAccepted && consentToTreat;
  const hasSignature = signatureType === "type" ? typedName.trim() !== "" : true;
  const isFormValid = isAllAccepted && hasSignature;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth / 2}px`;
    canvas.style.height = `${canvas.offsetHeight / 2}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "#171717";
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    let signatureData = "";
    if (signatureType === "draw") {
      signatureData = canvasRef.current?.toDataURL() || "";
    } else {
      signatureData = typedName;
    }

    onComplete({
      type: signatureType,
      data: signatureData,
      timestamp: new Date().toISOString(),
      consentAccepted: {
        terms: termsAccepted,
        privacy: privacyAccepted,
        hipaa: hipaaAccepted,
        consentToTreat,
      },
    });
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
                  Review and sign consent forms
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Please review, accept and sign the following documents to confirm your appointment
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Terms and Conditions */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Terms and conditions
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>1. Acceptance of Terms</strong>
                    <br />
                    By accessing and using the SpineCloudIQ Patient Portal, you accept and agree to be bound by these terms and conditions.
                    <br />
                    <br />
                    <strong>2. Patient Responsibilities</strong>
                    <br />
                    You agree to provide accurate, current, and complete information during registration and appointment booking. You are responsible for maintaining the confidentiality of your account credentials.
                    <br />
                    <br />
                    <strong>3. Appointment Policy</strong>
                    <br />
                    Please arrive 15 minutes before your scheduled appointment. Cancellations must be made at least 24 hours in advance. Late cancellations or no-shows may incur a fee.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    I have read and agree to the Terms and Conditions
                  </span>
                </label>
              </div>

              {/* Privacy Policy */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Privacy policy
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>1. Information Collection</strong>
                    <br />
                    We collect personal and health information necessary to provide quality care. This includes demographic data, medical history, and appointment details.
                    <br />
                    <br />
                    <strong>2. Use of Information</strong>
                    <br />
                    Your information is used solely for treatment, payment processing, and healthcare operations. We do not sell or share your data with third parties for marketing purposes.
                    <br />
                    <br />
                    <strong>3. Data Security</strong>
                    <br />
                    We implement industry-standard security measures to protect your personal and health information from unauthorized access, disclosure, or destruction.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    I have read and agree to the Privacy Policy
                  </span>
                </label>
              </div>

              {/* HIPAA Authorization */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  HIPAA authorization
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>Authorization for Use and Disclosure of Protected Health Information</strong>
                    <br />
                    <br />
                    I authorize SpineCloudIQ and its healthcare providers to use and disclose my protected health information (PHI) for the purposes of treatment, payment, and healthcare operations as described in the Notice of Privacy Practices.
                    <br />
                    <br />
                    This authorization includes the use of electronic health records and secure communication through the patient portal. I understand that I have the right to revoke this authorization at any time by providing written notice.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hipaaAccepted}
                    onChange={(e) => setHipaaAccepted(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    I authorize the use and disclosure of my PHI as described above
                  </span>
                </label>
              </div>

              {/* Consent to Treat */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Consent to treat
                </h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 max-h-32 overflow-y-auto mb-4">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <strong>Informed Consent for Treatment</strong>
                    <br />
                    <br />
                    I consent to receive chiropractic and related healthcare services from SpineCloudIQ and its authorized providers. I understand that treatment may include:
                    <br />
                    • Chiropractic adjustments and manipulations
                    <br />
                    • Physical therapy modalities
                    <br />
                    • Soft tissue techniques
                    <br />
                    • Rehabilitative exercises
                    <br />
                    • Other related therapeutic procedures
                    <br />
                    <br />
                    I understand the potential benefits and risks associated with chiropractic care. I have had the opportunity to ask questions and have them answered to my satisfaction.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={consentToTreat}
                    onChange={(e) => setConsentToTreat(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    I consent to receive treatment as described above
                  </span>
                </label>
              </div>
            </div>

            {/* Digital Signature Section */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                  Digital signature
                </h4>
                
                {/* Signature Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSignatureType("draw")}
                    className={`flex-1 h-10 px-4 rounded-lg border transition-colors font-medium inline-flex items-center justify-center gap-2 ${
                      signatureType === "draw"
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Pen className="w-4 h-4" />
                    Draw signature
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignatureType("type")}
                    className={`flex-1 h-10 px-4 rounded-lg border transition-colors font-medium inline-flex items-center justify-center gap-2 ${
                      signatureType === "type"
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    Type name
                  </button>
                </div>

                {/* Draw Signature */}
                {signatureType === "draw" && (
                  <div>
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-40 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg cursor-crosshair bg-white dark:bg-neutral-950"
                    />
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      Clear signature
                    </button>
                  </div>
                )}

                {/* Type Signature */}
                {signatureType === "type" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Type your full name"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                    {typedName && (
                      <div className="mt-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Signature preview:</p>
                        <p className="text-2xl font-serif italic text-neutral-900 dark:text-white">{typedName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  Accept and confirm appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
