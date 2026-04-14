import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/app/components/layout/DashboardLayout";
import {
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Stethoscope,
  Image as ImageIcon,
  FileCheck,
  FileText,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Eye,
  EyeOff,
  ClipboardList,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock X-ray images
const xrayImage1 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Cervical+Spine+Lateral";
const xrayImage2 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Lumbar+Spine+AP";
const xrayImage3 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Thoracic+Spine+Lateral";
const xrayImage4 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Shoulder+AP";

interface Appointment {
  id: string;
  appointmentId?: string;
  date: string;
  timeSlot: string;
  provider: string;
  clinic: string;
  clinicAddress: string;
  service: string;
  status: "Confirmed" | "Cancelled" | "Completed";
}

interface Annotation {
  id: string;
  type: "draw" | "line" | "rectangle" | "circle" | "text";
  color: string;
  points: { x: number; y: number }[];
  text?: string;
}

interface ImagingFile {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  annotations: Annotation[];
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

interface ViewAppointmentDetailsScreenProps {
  appointment: Appointment;
  questionnaireData?: QuestionnaireResponse[];
  onNavigate: (menu: "dashboard" | "appointments") => void;
  onBack: () => void;
  onReschedule: () => void;
  onCancel: () => void;
  onLogout?: () => void;
}

export function ViewAppointmentDetailsScreen({
  appointment,
  questionnaireData,
  onNavigate,
  onBack,
  onReschedule,
  onCancel,
  onLogout,
}: ViewAppointmentDetailsScreenProps) {
  const [activeTab, setActiveTab] = useState<"questionnaire" | "soap" | "part" | "imaging" | "referrals">("questionnaire");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [patientVisible, setPatientVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Determine if appointment is completed (in the past)
  const isCompleted = appointment.status === "Completed";
  const isUpcoming = appointment.status === "Confirmed";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatAppointmentService = (service: string) => {
    const services: Record<string, string> = {
      initial: "Initial Consultation",
      followup: "Follow-up Visit",
      therapy: "Therapy Session",
    };
    return services[service] || service;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-success-100 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800";
      case "Completed":
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
      case "Cancelled":
        return "bg-destructive/10 dark:bg-destructive/20 text-destructive border-destructive/20";
      default:
        return "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700";
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onCancel();
  };

  const handleDownloadReferral = (referralId: string) => {
    console.log("Download referral:", referralId);
    alert("Downloading referral note...");
  };

  const handlePrintReferral = (referralId: string) => {
    console.log("Print referral:", referralId);
    alert("Printing referral note...");
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Mock SOAP note data (read-only from provider)
  const mockSOAPNote = {
    subjective: "Patient reports reduced lower back pain compared to last visit. Pain level has decreased from 7/10 to 4/10. States that the prescribed exercises have been helpful. Patient mentions pain is worse in the morning and improves throughout the day. No radiating pain down the legs. Sleep has improved with better pain management.",
    objective: "Range of motion: Flexion 80 degrees, Extension 20 degrees, Lateral flexion 25 degrees bilaterally. Reduced muscle spasm in lumbar region. Improved posture noted during gait assessment. Palpation reveals tenderness at L4-L5 level. Straight leg raise test negative bilaterally. Deep tendon reflexes 2+ and symmetric.",
    assessment: "Patient showing positive progress with conservative treatment. Reduced pain levels and improved functionality. Continue current treatment plan. Diagnosis: Acute lumbar strain with muscle spasm, improving. No signs of nerve root compression. Patient is responding well to manual therapy and exercise program.",
    plan: "Continue current exercise regimen 2x daily. Schedule follow-up in 2 weeks. Consider reducing session frequency if improvement continues. Patient education on ergonomics provided. Recommend heat therapy before exercises and ice after activity. May advance to moderate resistance training in 1 week. Continue manual therapy techniques focusing on soft tissue mobilization.",
    providerName: appointment.provider,
    finalizedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Mock P.A.R.T. note data (read-only from provider)
  const mockPARTNote = {
    position: "Patient examined in standing, seated, and supine positions. Standing posture reveals mild forward head posture with rounded shoulders. Seated examination shows tendency to slouch with lumbar lordosis flattening. Supine position allows for complete relaxation and proper spinal alignment. Patient able to maintain neutral spine position with cueing.",
    alignment: "Anterior view shows level shoulders with slight right shoulder elevation. Posterior view reveals balanced pelvis with no significant lateral tilt. Sagittal view demonstrates forward head carriage approximately 2 inches anterior to plumb line. Mild thoracic kyphosis noted. Lumbar lordosis within normal limits when cued to proper posture.",
    rangeOfMotion: "Cervical: Flexion 45°, Extension 50°, Lateral flexion 40° bilateral, Rotation 70° bilateral. Lumbar: Flexion 80° (fingertips to mid-shin), Extension 20°, Lateral flexion 25° bilateral. Thoracic rotation 35° bilateral. All movements performed without reproduction of primary complaint. Mild end-range discomfort noted in lumbar extension.",
    tenderness: "Palpable tenderness at bilateral upper trapezius with moderate trigger points. Paraspinal muscles at L4-L5 level demonstrate increased tone and mild tenderness to deep palpation. Sacroiliac joints non-tender. Piriformis muscle shows slight tenderness on right side. No acute inflammation or swelling noted. Patient reports 4/10 discomfort with deep palpation at affected areas.",
    providerName: appointment.provider,
    finalizedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Mock imaging data with annotations (read-only from provider)
  const [imagingFiles] = useState<ImagingFile[]>([
    {
      id: "img-1",
      url: xrayImage1,
      filename: "Cervical_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [
        {
          id: "ann-1",
          type: "rectangle",
          color: "#EF4444",
          points: [
            { x: 150, y: 200 },
            { x: 250, y: 300 },
          ],
        },
        {
          id: "ann-2",
          type: "text",
          color: "#EF4444",
          points: [{ x: 260, y: 210 }],
          text: "C5-C6",
        },
      ],
    },
    {
      id: "img-2",
      url: xrayImage2,
      filename: "Lumbar_Spine_AP.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [
        {
          id: "ann-3",
          type: "circle",
          color: "#3B82F6",
          points: [
            { x: 200, y: 250 },
            { x: 250, y: 300 },
          ],
        },
      ],
    },
    {
      id: "img-3",
      url: xrayImage3,
      filename: "Thoracic_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
    {
      id: "img-4",
      url: xrayImage4,
      filename: "Shoulder_AP.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [
        {
          id: "ann-4",
          type: "line",
          color: "#EAB308",
          points: [
            { x: 100, y: 150 },
            { x: 300, y: 250 },
          ],
        },
      ],
    },
  ]);

  // Initialize selected image
  useEffect(() => {
    if (imagingFiles.length > 0 && !selectedImageId) {
      setSelectedImageId(imagingFiles[0].id);
    }
  }, [imagingFiles, selectedImageId]);

  const selectedImage = imagingFiles.find((img) => img.id === selectedImageId);

  // Draw annotations on canvas
  useEffect(() => {
    if (!canvasRef.current || !imageRef.current || !selectedImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = imageRef.current;

    const redraw = () => {
      // Set canvas size to match image
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw each annotation
      selectedImage.annotations.forEach((ann) => {
        ctx.strokeStyle = ann.color;
        ctx.fillStyle = ann.color;
        ctx.lineWidth = 3;

        if (ann.type === "draw") {
          ctx.beginPath();
          ann.points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        } else if (ann.type === "line") {
          if (ann.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(ann.points[0].x, ann.points[0].y);
            ctx.lineTo(ann.points[1].x, ann.points[1].y);
            ctx.stroke();
          }
        } else if (ann.type === "rectangle") {
          if (ann.points.length >= 2) {
            const width = ann.points[1].x - ann.points[0].x;
            const height = ann.points[1].y - ann.points[0].y;
            ctx.strokeRect(ann.points[0].x, ann.points[0].y, width, height);
          }
        } else if (ann.type === "circle") {
          if (ann.points.length >= 2) {
            const centerX = (ann.points[0].x + ann.points[1].x) / 2;
            const centerY = (ann.points[0].y + ann.points[1].y) / 2;
            const radiusX = Math.abs(ann.points[1].x - ann.points[0].x) / 2;
            const radiusY = Math.abs(ann.points[1].y - ann.points[0].y) / 2;
            const radius = Math.max(radiusX, radiusY);
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
        } else if (ann.type === "text" && ann.text) {
          ctx.font = "16px Arial";
          ctx.fillText(ann.text, ann.points[0].x, ann.points[0].y);
        }
      });
    };

    if (image.complete) {
      redraw();
    } else {
      image.onload = redraw;
    }
  }, [selectedImage]);

  // Mock referral data (read-only from provider)
  const mockReferrals = [
    {
      id: "ref-1",
      type: "Imaging",
      testName: "MRI Lumbar Spine with and without Contrast",
      reason: "To rule out disc herniation and assess nerve compression. Patient reports intermittent radiating symptoms and imaging will help guide treatment plan.",
      priority: "Routine",
      dateCreated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      referringProvider: appointment.provider,
    },
    {
      id: "ref-2",
      type: "Specialist",
      testName: "Orthopedic Spine Consultation",
      reason: "Persistent symptoms despite 6 weeks of conservative treatment. Seeking specialist evaluation for potential surgical intervention options and comprehensive management plan.",
      priority: "Urgent",
      dateCreated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      referringProvider: appointment.provider,
    },
    {
      id: "ref-3",
      type: "Lab Test",
      testName: "Complete Blood Count (CBC) and Inflammatory Markers",
      reason: "Rule out underlying inflammatory conditions contributing to chronic pain presentation.",
      priority: "Routine",
      dateCreated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      referringProvider: appointment.provider,
    },
  ];

  const formatReferralDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout activeMenu="appointments" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Breadcrumbs */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <button
                onClick={onBack}
                className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Appointments
              </button>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white font-medium">
                Appointment details
              </span>
            </div>
          </div>
        </div>

        {/* Header with Appointment Info */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Appointment details
                </h1>
                {appointment.appointmentId && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {appointment.appointmentId}
                  </p>
                )}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {isCompleted ? "View your completed appointment records" : "View and manage your upcoming appointment"}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </div>
            </div>

            {/* Appointment Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                    Date & time
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {formatDate(appointment.date)}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {appointment.timeSlot}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                    Provider
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {appointment.provider}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {formatAppointmentService(appointment.service)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-1">
                    Clinic location
                  </p>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {appointment.clinic}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                    {appointment.clinicAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information for Upcoming Appointments */}
            {isUpcoming && (
              <div className="mt-6 bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                      Important information
                    </h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      Please arrive 15 minutes before your scheduled appointment time. If you need to reschedule or cancel, please do so at least 24 hours in advance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-5 md:px-6">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("questionnaire")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "questionnaire"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Questionnaire
              </button>
              <button
                onClick={() => setActiveTab("soap")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "soap"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                SOAP notes
              </button>
              <button
                onClick={() => setActiveTab("part")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "part"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <FileText className="w-4 h-4" />
                P.A.R.T.
              </button>
              <button
                onClick={() => setActiveTab("imaging")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "imaging"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Imaging
                {isCompleted && imagingFiles.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-full text-sm">
                    {imagingFiles.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("referrals")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === "referrals"
                    ? "border-primary-600 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <FileCheck className="w-4 h-4" />
                Referrals
                {isCompleted && mockReferrals.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-full text-sm">
                    {mockReferrals.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-5 md:px-6 py-6">
          {/* Questionnaire Tab - View Only */}
          {activeTab === "questionnaire" && (
            <>
              {isCompleted ? (
                <div className="space-y-6">
                  <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                          Questionnaire responses
                        </h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          These are the responses to the questionnaire completed by the patient. If you have questions about any information here, please contact your provider's office.
                        </p>
                      </div>
                    </div>
                  </div>

                  {questionnaireData && questionnaireData.length > 0 ? (
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
                      {questionnaireData.map((category) => (
                        <div key={category.categoryId} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                              {category.categoryName}
                            </h4>
                            <button
                              onClick={() => {
                                const newSet = new Set(expandedCategories);
                                if (newSet.has(category.categoryId)) {
                                  newSet.delete(category.categoryId);
                                } else {
                                  newSet.add(category.categoryId);
                                }
                                setExpandedCategories(newSet);
                              }}
                              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                            >
                              {expandedCategories.has(category.categoryId) ? (
                                <ChevronUp className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              )}
                            </button>
                          </div>
                          {expandedCategories.has(category.categoryId) && (
                            <div className="space-y-4">
                              {category.responses && category.responses.map((response) => (
                                <div key={response.questionId} className="space-y-1">
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                    {response.question}
                                  </p>
                                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                    {Array.isArray(response.answer) ? response.answer.join(", ") : response.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                      <ClipboardList className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        No questionnaire responses
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No questionnaire responses were recorded for this appointment
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                  <ClipboardList className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Questionnaire responses will be available after your appointment is completed
                  </p>
                </div>
              )}
            </>
          )}

          {/* SOAP Notes Tab - View Only */}
          {activeTab === "soap" && (
            <>
              {isCompleted ? (
                <div className="space-y-6">
                  <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                          Notes added by your provider
                        </h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          This is a clinical summary of your appointment prepared by {appointment.provider}. If you have questions about any information here, please contact your provider's office.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
                    {/* Subjective */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Subjective
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockSOAPNote.subjective}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Objective */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Objective
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockSOAPNote.objective}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Assessment */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Assessment
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockSOAPNote.assessment}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Plan */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Plan
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockSOAPNote.plan}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Provider Info */}
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Documented by <span className="font-medium text-neutral-900 dark:text-white">{mockSOAPNote.providerName}</span> on{" "}
                        {new Date(mockSOAPNote.finalizedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                  <Stethoscope className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    SOAP notes will be available after your appointment is completed
                  </p>
                </div>
              )}
            </>
          )}

          {/* P.A.R.T. Notes Tab - View Only */}
          {activeTab === "part" && (
            <>
              {isCompleted ? (
                <div className="space-y-6">
                  <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                          Notes added by your provider
                        </h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300">
                          This is a clinical summary of your appointment prepared by {appointment.provider}. If you have questions about any information here, please contact your provider's office.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 space-y-6">
                    {/* Position */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Position
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockPARTNote.position}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Alignment */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Alignment
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockPARTNote.alignment}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Range of Motion */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Range of Motion
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockPARTNote.rangeOfMotion}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Tenderness */}
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3 uppercase tracking-wide">
                        Tenderness
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {mockPARTNote.tenderness}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200 dark:border-neutral-800" />

                    {/* Provider Info */}
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Documented by <span className="font-medium text-neutral-900 dark:text-white">{mockPARTNote.providerName}</span> on{" "}
                        {new Date(mockPARTNote.finalizedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    P.A.R.T. notes will be available after your appointment is completed
                  </p>
                </div>
              )}
            </>
          )}

          {/* Imaging Tab - View Only with Annotations Visible */}
          {activeTab === "imaging" && (
            <>
              {isCompleted ? (
                <div>
                  {imagingFiles.length > 0 ? (
                    <div className="space-y-6">
                      {/* Info Banner */}
                      <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                              Shared by your provider
                            </h4>
                            <p className="text-sm text-primary-700 dark:text-primary-300">
                              These images were uploaded and annotated by {appointment.provider}. Any markings or notes were added by your provider to help explain findings.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Image Viewer - Similar to Provider Portal */}
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Image Viewer */}
                        <div className="flex-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                          {/* Toolbar */}
                          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-neutral-50 dark:bg-neutral-900">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                {selectedImage?.filename}
                              </span>
                              {selectedImage && selectedImage.annotations.length > 0 && (
                                <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded text-sm">
                                  Annotated by provider
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setPatientVisible(!patientVisible)}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title={patientVisible ? "Hide annotations" : "Show annotations"}
                              >
                                {patientVisible ? (
                                  <EyeOff className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                ) : (
                                  <Eye className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                )}
                              </button>
                              <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700" />
                              <button
                                onClick={handleZoomOut}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Zoom out"
                              >
                                <ZoomOut className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 w-12 text-center">
                                {zoomLevel}%
                              </span>
                              <button
                                onClick={handleZoomIn}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Zoom in"
                              >
                                <ZoomIn className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                              <button
                                onClick={handleResetZoom}
                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Reset zoom"
                              >
                                <RotateCw className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                              </button>
                            </div>
                          </div>

                          {/* Image Display Area */}
                          <div className="relative bg-neutral-900 dark:bg-black p-6 min-h-[500px] flex items-center justify-center overflow-auto">
                            {selectedImage && (
                              <div
                                className="relative"
                                style={{
                                  transform: `scale(${zoomLevel / 100})`,
                                  transition: "transform 0.2s",
                                }}
                              >
                                <img
                                  ref={imageRef}
                                  src={selectedImage.url}
                                  alt={selectedImage.filename}
                                  className="max-w-full h-auto rounded"
                                  crossOrigin="anonymous"
                                />
                                {patientVisible && (
                                  <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    style={{
                                      width: imageRef.current?.clientWidth || "auto",
                                      height: imageRef.current?.clientHeight || "auto",
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Thumbnail Sidebar */}
                        <div className="lg:w-64 space-y-3">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Images ({imagingFiles.length})
                          </h4>
                          <div className="space-y-3">
                            {imagingFiles.map((file) => (
                              <button
                                key={file.id}
                                onClick={() => {
                                  setSelectedImageId(file.id);
                                  setZoomLevel(100);
                                }}
                                className={`w-full text-left border rounded-lg overflow-hidden transition-all ${
                                  selectedImageId === file.id
                                    ? "border-primary-500 ring-2 ring-primary-500/20 bg-primary-50 dark:bg-primary-950/30"
                                    : "border-neutral-300 dark:border-neutral-700 hover:border-primary-400 bg-white dark:bg-neutral-950"
                                }`}
                              >
                                <div className="aspect-video bg-neutral-900 overflow-hidden">
                                  <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-3">
                                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                    {file.filename}
                                  </p>
                                  {file.annotations.length > 0 && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded text-sm">
                                      Annotated
                                    </span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                      <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No imaging files available for this appointment
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                  <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Imaging files will be available after your appointment is completed
                  </p>
                </div>
              )}
            </>
          )}

          {/* Referrals Tab - View Only with Download/Print */}
          {activeTab === "referrals" && (
            <>
              {isCompleted ? (
                <div>
                  {mockReferrals.length > 0 ? (
                    <div className="space-y-6">
                      {/* Info Banner */}
                      <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">
                              Shared by your provider
                            </h4>
                            <p className="text-sm text-primary-700 dark:text-primary-300">
                              These referrals were created by {appointment.provider}. You can download or print them to take to your appointments.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Referrals List - Similar to Provider Portal */}
                      <div className="space-y-4">
                        {mockReferrals.map((referral) => (
                          <div
                            key={referral.id}
                            className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6"
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-sm font-medium">
                                    {referral.type}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                      referral.priority === "Urgent"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                    }`}
                                  >
                                    {referral.priority}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  {referral.testName}
                                </h4>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                  Created on {formatReferralDate(referral.dateCreated)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handlePrintReferral(referral.id)}
                                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                  title="Print"
                                >
                                  <Printer className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                </button>
                                <button
                                  onClick={() => handleDownloadReferral(referral.id)}
                                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                  title="Download"
                                >
                                  <Download className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                                </button>
                              </div>
                            </div>

                            {/* Reason */}
                            {referral.reason && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                                  Reason for referral
                                </h5>
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                  {referral.reason}
                                </p>
                              </div>
                            )}

                            {/* Footer */}
                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <User className="w-4 h-4" />
                                <span>Referred by {referral.referringProvider}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                      <FileCheck className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        No referrals issued for this appointment
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
                  <FileCheck className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Referrals will be available after your appointment is completed
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions Footer - Only for Upcoming Appointments */}
        {isUpcoming && (
          <div className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 px-5 md:px-6 py-4 sticky bottom-0">
            <div className="max-w-7xl mx-auto flex gap-3">
              <button
                onClick={() => setShowCancelDialog(true)}
                className="flex-1 h-10 px-4 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors font-medium text-sm"
              >
                Cancel appointment
              </button>
              <button
                onClick={onReschedule}
                className="flex-1 h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
              >
                Reschedule appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg w-full max-w-md">
            <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Cancel appointment
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </p>
            </div>
            <div className="px-5 pb-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Keep appointment
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 h-10 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors font-medium text-sm"
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}