import { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  FileCheck,
  Download,
  Eye,
  ChevronDown,
  ChevronRight,
  CreditCard,
  CheckCircle,
  ClipboardList,
  CheckCircle2,
  Activity,
  TrendingUp,
  ChevronUp
} from "lucide-react";
import { SpineCloudResultsView } from "@/app/components/shared/SpineCloudResultsView";

// Mock X-ray images
const xrayImage1 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Cervical+Spine+Lateral";
const xrayImage2 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Lumbar+Spine+AP";
const xrayImage3 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Thoracic+Spine+Lateral";
const xrayImage4 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Shoulder+AP";

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  service: string;
  clinic?: string;
  status: "Completed" | "Cancelled" | "No-Show" | "Confirmed";
  notes?: string;
  appointmentId?: string;
}

interface ImagingFile {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  description?: string;
}

interface Referral {
  id: string;
  specialty: string;
  providerName: string;
  facility: string;
  reason: string;
  createdAt: string;
}

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  providerName: string;
  finalizedAt: string;
}

interface QuestionResponse {
  questionId: string;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select" | "scale";
  answer: string | string[] | number;
  options?: string[];
}

interface QuestionnaireResponse {
  categoryId: string;
  categoryName: string;
  completedAt: string;
  responses: QuestionResponse[];
}

interface AppointmentDetailsViewProps {
  appointment: Appointment;
  onBack: () => void;
  patientName?: string;
}

export function AppointmentDetailsView({ appointment, onBack, patientName }: AppointmentDetailsViewProps) {
  const [questionnaireExpanded, setQuestionnaireExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [soapExpanded, setSoapExpanded] = useState(false);
  const [partExpanded, setPartExpanded] = useState(false);
  const [imagingExpanded, setImagingExpanded] = useState(false);
  const [referralsExpanded, setReferralsExpanded] = useState(false);
  const [invoiceExpanded, setInvoiceExpanded] = useState(false);
  const [spineCloudExpanded, setSpineCloudExpanded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [invoiceStatus, setInvoiceStatus] = useState<"Paid" | "Unpaid">("Unpaid");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400";
      case "Confirmed":
        return "bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400";
      case "Cancelled":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300";
      case "No-Show":
        return "bg-destructive/10 dark:bg-destructive/20 text-destructive";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300";
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.toLowerCase().includes("neck") || categoryName.toLowerCase().includes("shoulder")) {
      return <Activity className="w-5 h-5" />;
    }
    if (categoryName.toLowerCase().includes("back")) {
      return <TrendingUp className="w-5 h-5" />;
    }
    return <ClipboardList className="w-5 h-5" />;
  };

  // Mock questionnaire data
  const questionnaireResponses: QuestionnaireResponse[] = [
    {
      categoryId: "neck-shoulder",
      categoryName: "Neck / Shoulder",
      completedAt: new Date(appointment.date).toISOString(),
      responses: [
        {
          questionId: "q1",
          question: "Where is your primary area of pain or discomfort?",
          type: "radio",
          answer: "Neck and upper shoulders",
          options: ["Neck only", "Neck and upper shoulders", "Shoulders only", "Upper back"],
        },
        {
          questionId: "q2",
          question: "How long have you been experiencing this pain?",
          type: "radio",
          answer: "2-4 weeks",
          options: ["Less than 1 week", "1-2 weeks", "2-4 weeks", "More than 1 month"],
        },
        {
          questionId: "q3",
          question: "Rate your current pain level",
          type: "scale",
          answer: 7,
        },
        {
          questionId: "q4",
          question: "Which activities are most affected by your pain?",
          type: "checkbox",
          answer: ["Looking up or down", "Turning head side to side", "Sleeping"],
          options: [
            "Looking up or down",
            "Turning head side to side",
            "Reaching overhead",
            "Sleeping",
            "Working at computer",
          ],
        },
        {
          questionId: "q5",
          question: "What makes your pain worse?",
          type: "textarea",
          answer: "Sitting at my desk for extended periods, especially when working on the computer. The pain intensifies when I turn my head to the right side.",
        },
      ],
    },
    {
      categoryId: "lower-back",
      categoryName: "Lower Back",
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      responses: [
        {
          questionId: "q1",
          question: "Where exactly is your lower back pain located?",
          type: "radio",
          answer: "Central lower back",
          options: ["Central lower back", "Left side", "Right side", "Both sides"],
        },
        {
          questionId: "q2",
          question: "How would you describe your pain?",
          type: "checkbox",
          answer: ["Dull ache", "Stiffness"],
          options: ["Sharp/stabbing", "Dull ache", "Burning", "Stiffness", "Throbbing"],
        },
        {
          questionId: "q3",
          question: "Rate your pain when standing",
          type: "scale",
          answer: 4,
        },
        {
          questionId: "q4",
          question: "Does the pain radiate to other areas?",
          type: "radio",
          answer: "Yes, to my buttocks",
          options: ["No radiation", "Yes, to my buttocks", "Yes, down my legs", "Yes, to both buttocks and legs"],
        },
      ],
    },
  ];

  // Mock SOAP note data
  const soapNote: SOAPNote = {
    subjective: "Patient reports reduced lower back pain compared to last visit. Pain level has decreased from 7/10 to 4/10. States that the prescribed exercises have been helpful. Patient mentions pain is worse in the morning and improves throughout the day. No radiating pain down the legs. Sleep has improved with better pain management.",
    objective: "Range of motion: Flexion 80 degrees, Extension 20 degrees, Lateral flexion 25 degrees bilaterally. Reduced muscle spasm in lumbar region. Improved posture noted during gait assessment. Palpation reveals tenderness at L4-L5 level. Straight leg raise test negative bilaterally. Deep tendon reflexes 2+ and symmetric.",
    assessment: "Patient showing positive progress with conservative treatment. Reduced pain levels and improved functionality. Continue current treatment plan. Diagnosis: Acute lumbar strain with muscle spasm, improving. No signs of nerve root compression. Patient is responding well to manual therapy and exercise program.",
    plan: "Continue current exercise regimen 2x daily. Schedule follow-up in 2 weeks. Consider reducing session frequency if improvement continues. Patient education on ergonomics provided. Recommend heat therapy before exercises and ice after activity. May advance to moderate resistance training in 1 week. Continue manual therapy techniques focusing on soft tissue mobilization.",
    providerName: appointment.provider,
    finalizedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Mock imaging files
  const imagingFiles: ImagingFile[] = [
    {
      id: "img-1",
      url: xrayImage1,
      filename: "Cervical_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      description: "Cervical spine lateral view showing C5-C6 disc space",
    },
    {
      id: "img-2",
      url: xrayImage2,
      filename: "Lumbar_Spine_AP.jpg",
      uploadedAt: new Date().toISOString(),
      description: "Lumbar spine anteroposterior view",
    },
    {
      id: "img-3",
      url: xrayImage3,
      filename: "Thoracic_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      description: "Thoracic spine lateral projection",
    },
    {
      id: "img-4",
      url: xrayImage4,
      filename: "Full_Spine_AP.jpg",
      uploadedAt: new Date().toISOString(),
      description: "Full spine anteroposterior view for scoliosis assessment",
    },
  ];

  // Mock referral data (removed clinical notes)
  const referrals: Referral[] = [
    {
      id: "ref-1",
      specialty: "Orthopedic Surgery",
      providerName: "Dr. Michael Chen, MD",
      facility: "City Orthopedic Center",
      reason: "Persistent lower back pain requiring surgical evaluation",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "ref-2",
      specialty: "Physical Therapy",
      providerName: "Sarah Williams, PT, DPT",
      facility: "SpineHealth Physical Therapy",
      reason: "Continuation of strengthening and mobility program",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Appointment Details Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
              {appointment.service}
            </h2>
            {appointment.appointmentId && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                {appointment.appointmentId}
              </p>
            )}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(appointment.date)} at {appointment.time}
            </p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Provider</p>
            </div>
            <p className="text-sm text-neutral-900 dark:text-white ml-7">{appointment.provider}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Service</p>
            </div>
            <p className="text-sm text-neutral-900 dark:text-white ml-7">{appointment.service}</p>
          </div>

          {appointment.clinic && (
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Clinic location</p>
              </div>
              <p className="text-sm text-neutral-900 dark:text-white ml-7">{appointment.clinic}</p>
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Clinical notes</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{appointment.notes}</p>
          </div>
        )}
      </div>

      {/* Questionnaire Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setQuestionnaireExpanded(!questionnaireExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Questionnaire
                {appointment.status === "Completed" && questionnaireResponses.length > 0 && (
                  <span className="ml-2 text-neutral-500 dark:text-neutral-400">({questionnaireResponses.length})</span>
                )}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed" && questionnaireResponses.length > 0
                  ? "Patient responses to questionnaires"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {questionnaireExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {questionnaireExpanded && (
          <div className="px-6 pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" && questionnaireResponses.length > 0 ? (
              <div className="space-y-4">
                {questionnaireResponses.map((response) => (
                  <div
                    key={response.categoryId}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                          {response.categoryName}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Completed on {formatDate(response.completedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCategory(response.categoryId)}
                        className="inline-flex items-center gap-2 px-3 h-8 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                      >
                        {expandedCategories.has(response.categoryId) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {expandedCategories.has(response.categoryId) && (
                      <div className="space-y-4">
                        {response.responses.map((qResponse) => (
                          <div key={qResponse.questionId}>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                              {qResponse.question}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              {qResponse.type === "checkbox"
                                ? (qResponse.answer as string[]).join(", ")
                                : qResponse.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardList className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No questionnaire responses available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {appointment.status === "Completed"
                    ? "No questionnaire responses were recorded for this appointment"
                    : "Questionnaire responses will be available after the appointment is completed"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SOAP Notes Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setSoapExpanded(!soapExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                SOAP notes
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed" 
                  ? "Clinical documentation from this appointment"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {soapExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {soapExpanded && (
          <div className="px-6 pb-6 space-y-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" ? (
              <>
                {/* SOAP Note Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Finalized by {soapNote.providerName} on {formatDate(soapNote.finalizedAt)}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {/* Subjective */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Subjective
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {soapNote.subjective}
                  </p>
                </div>

                {/* Objective */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Objective
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {soapNote.objective}
                  </p>
                </div>

                {/* Assessment */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Assessment
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {soapNote.assessment}
                  </p>
                </div>

                {/* Plan */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Plan
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {soapNote.plan}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No SOAP notes available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  SOAP notes will be available after the appointment is completed
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* P.A.R.T. Notes Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setPartExpanded(!partExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                P.A.R.T. notes
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed" 
                  ? "Position, Alignment, Range of motion, Tenderness documentation"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {partExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {partExpanded && (
          <div className="px-6 pb-6 space-y-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" ? (
              <>
                {/* P.A.R.T. Note Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Finalized by {appointment.provider} on {formatDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString())}
                    </p>
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {/* Position */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Position
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    Patient positioned supine on treatment table with knees slightly flexed. Lumbar support provided for comfort. Patient's head supported in neutral position. Upper extremities resting comfortably at sides. Proper body mechanics maintained throughout examination.
                  </p>
                </div>

                {/* Alignment */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Alignment
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    Visual inspection reveals slight lateral deviation of the spine to the right in the lumbar region. Shoulder heights asymmetrical with right shoulder approximately 1cm higher than left. Pelvic alignment shows mild anterior tilt. Head and neck positioned in forward head posture, approximately 2 inches anterior to shoulders. Overall postural assessment indicates muscle imbalances requiring corrective exercises.
                  </p>
                </div>

                {/* Range of Motion */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Range of motion
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    Cervical ROM: Flexion 45°, Extension 60°, Right lateral flexion 40°, Left lateral flexion 35°, Right rotation 70°, Left rotation 75°. Lumbar ROM: Flexion 80° (normal 90°), Extension 20° (normal 25°), Lateral flexion 25° bilaterally. All movements performed actively. Some restriction noted in lumbar flexion with pain at end range. Patient demonstrates guarding behavior during certain movements.
                  </p>
                </div>

                {/* Tenderness */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                    Tenderness
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    Palpation reveals moderate tenderness at L4-L5 level, rated 6/10 on pain scale. Mild tenderness noted in bilateral paraspinal muscles from T12-L5. Trigger points identified in quadratus lumborum bilaterally. No significant tenderness in cervical region. Sacroiliac joints demonstrate mild tenderness on right side with spring test. Muscle spasm palpable in lower lumbar erector spinae muscles. Patient reports immediate pain relief following gentle pressure release techniques.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No P.A.R.T. notes available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  P.A.R.T. notes will be available after the appointment is completed
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Imaging Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setImagingExpanded(!imagingExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Imaging
                {appointment.status === "Completed" && imagingFiles.length > 0 && (
                  <span className="ml-2 text-neutral-500 dark:text-neutral-400">({imagingFiles.length})</span>
                )}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed" && imagingFiles.length > 0
                  ? "X-rays and diagnostic images"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {imagingExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {imagingExpanded && (
          <div className="px-6 pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" && imagingFiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imagingFiles.map((file) => (
                  <div
                    key={file.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 hover:border-primary-500 transition-colors group"
                  >
                    <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden relative">
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                          <Download className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        {file.filename}
                      </h4>
                      {file.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                          {file.description}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No imaging files available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {appointment.status === "Completed"
                    ? "No imaging files were uploaded for this appointment"
                    : "Imaging files will be available after the appointment is completed"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Referrals Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setReferralsExpanded(!referralsExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Referrals
                {appointment.status === "Completed" && referrals.length > 0 && (
                  <span className="ml-2 text-neutral-500 dark:text-neutral-400">({referrals.length})</span>
                )}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed" && referrals.length > 0
                  ? "Specialist referrals from this appointment"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {referralsExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {referralsExpanded && (
          <div className="px-6 pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                          {referral.specialty}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {referral.providerName} • {referral.facility}
                        </p>
                      </div>
                      <button className="inline-flex items-center gap-2 px-3 h-8 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Reason for referral
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {referral.reason}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        Created on {new Date(referral.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileCheck className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No referrals available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {appointment.status === "Completed"
                    ? "No specialist referrals were created for this appointment"
                    : "Referrals will be available after the appointment is completed"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Invoice Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setInvoiceExpanded(!invoiceExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Invoice
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed"
                  ? "Billing and payment information"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {invoiceExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {invoiceExpanded && (
          <div className="px-6 pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" ? (
              <div className="space-y-6">
                {/* Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Invoice number
                    </p>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      INV-2026-{appointment.id.slice(-3).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Invoice date
                    </p>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {formatDate(appointment.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Total amount
                    </p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      $350.00
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium border ${
                        invoiceStatus === "Paid"
                          ? "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                      }`}
                    >
                      {invoiceStatus === "Paid" && <CheckCircle className="w-4 h-4" />}
                      {invoiceStatus}
                    </span>
                  </div>
                </div>

                {/* ICD-CPT Codes Section */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                    ICD-CPT Codes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ICD Codes */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-3">
                        ICD Codes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-md">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                            ICD
                          </span>
                          <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">
                            M54.5
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Low back pain
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-md">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                            ICD
                          </span>
                          <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">
                            M79.1
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Myalgia
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CPT Codes */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-3">
                        CPT Codes
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-900 border border-purple-200 dark:border-purple-800 rounded-md">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                            CPT
                          </span>
                          <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">
                            98941
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            CMT (3-4 regions)
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-neutral-900 border border-purple-200 dark:border-purple-800 rounded-md">
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                            CPT
                          </span>
                          <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white">
                            97110
                          </span>
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Therapeutic exercises
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Action */}
                {invoiceStatus === "Unpaid" && (
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <CreditCard className="w-4 h-4" />
                      Mark as paid
                    </button>
                  </div>
                )}

                {/* Payment Method Display (if paid) */}
                {invoiceStatus === "Paid" && selectedPaymentMethod && (
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-800 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                        <div>
                          <p className="text-sm font-semibold text-success-900 dark:text-success-300">
                            Payment received
                          </p>
                          <p className="text-sm text-success-700 dark:text-success-400 mt-0.5">
                            Paid via {selectedPaymentMethod} on {formatDate(new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No invoice available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Invoice will be available after the appointment is completed
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SpineCloud Wellness Index Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
        <button
          onClick={() => setSpineCloudExpanded(!spineCloudExpanded)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                SpineCloud Wellness Index
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {appointment.status === "Completed"
                  ? "Wellness assessment and functional health score"
                  : "Available after appointment completion"}
              </p>
            </div>
          </div>
          {spineCloudExpanded ? (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          )}
        </button>

        {spineCloudExpanded && (
          <div className="px-6 pb-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {appointment.status === "Completed" ? (
              <SpineCloudResultsView
                result={{
                  id: "scwi-001",
                  patientId: "patient-123",
                  patientName: patientName || "Sarah Johnson",
                  patientAge: 35,
                  patientDateOfBirth: "1989-03-15",
                  appointmentId: appointment.id,
                  appointmentDate: appointment.date,
                  service: appointment.service,
                  provider: appointment.provider,
                  completedAt: appointment.date,
                  score: 73.5,
                  categoryScores: {
                    neuromuscular: 75,
                    autonomic: 68,
                    structural: 80,
                    metabolic: 70,
                    cognitive: 75,
                  },
                  responses: {
                    Q01: 1,
                    Q02: 2,
                    Q03: 1,
                    Q04: 2,
                    Q05: 2,
                    Q06: 1,
                    Q07: 2,
                    Q08: 1,
                    Q09: 1,
                    Q10: 2,
                    Q11: 1,
                    Q12: 2,
                    Q13: 2,
                    Q14: 1,
                    Q15: 2,
                  },
                }}
                previousResults={[
                  {
                    id: "scwi-000",
                    patientId: "patient-123",
                    patientName: patientName || "Sarah Johnson",
                    patientAge: 35,
                    patientDateOfBirth: "1989-03-15",
                    appointmentId: "prev-apt-id",
                    appointmentDate: "2026-01-15",
                    service: "Initial Consultation",
                    provider: appointment.provider,
                    completedAt: "2026-01-15",
                    score: 68.2,
                    categoryScores: {
                      neuromuscular: 70,
                      autonomic: 65,
                      structural: 72,
                      metabolic: 65,
                      cognitive: 69,
                    },
                    responses: {},
                  },
                ]}
                onExport={(format: "pdf" | "email" | "print") => {
                  console.log(`Exporting SpineCloud results as ${format}`);
                }}
              />
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No SpineCloud Index results available
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  SpineCloud Wellness Index will be available after the appointment is completed
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Mark invoice as paid
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Select the payment method used
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {["Cash", "Card", "Online", "Check"].map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      setSelectedPaymentMethod(method);
                      setInvoiceStatus("Paid");
                      setShowPaymentModal(false);
                    }}
                    className="w-full text-left px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                  >
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {method}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}