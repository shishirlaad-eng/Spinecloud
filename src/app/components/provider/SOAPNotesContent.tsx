import { useState, useRef, useEffect } from "react";
import { Mic, Save, FileCheck, Upload, X, Download, MessageCircle, FileUp, Lock, Loader2, Pause, Square, Play, CheckCircle2, Sparkles, Clock, User, Activity, ChevronDown, ChevronUp, Calendar, Image as ImageIcon } from "lucide-react";
import { exportSOAPNotes } from "@/utils/exportNotes";
import { SOAPSection } from "./SOAPSection";
import { ManualSOAPInterface } from "./ManualSOAPInterface";
import { CumulativeICDCPTCodesSection, ICDCPTCode, LinkedCodeGroup } from "./CumulativeICDCPTCodesSection";
import { PARTNotesContent } from "./PARTNotesContent";
import type { SOAPCategory } from "@/app/components/clinic-admin/soap-master/SOAPMasterScreen";

interface SOAPNote {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  subjectiveCodes: ICDCPTCode[];
  objectiveCodes: ICDCPTCode[];
  assessmentCodes: ICDCPTCode[];
  planCodes: ICDCPTCode[];
  linkedCodeGroups: LinkedCodeGroup[]; // 1-to-many linked codes
  attachments: File[];
  linkedReports: string[];
  linkedAppointments: string[];
  patientVisibleSummary: boolean;
  status: "draft" | "final";
  finalizedAt?: string;
  finalizedBy?: string;
  patientName?: string;
  patientEmail?: string;
  branch?: string;
  audioRecordingDuration?: number;
}

interface SOAPNotesContentProps {
  appointmentId: string;
  providerName: string;
  isReadOnly?: boolean;
  onSave?: (note: SOAPNote) => void;
  onFinalize?: (note: SOAPNote) => void;
  soapCategories?: SOAPCategory[]; // Add SOAP Master categories
  patientInfo?: {
    name: string;
    dateOfBirth?: string;
    gender?: string;
  };
  appointmentInfo?: {
    date: string;
    time: string;
    service: string;
    location?: string;
    branch?: string;
  };
  patientAppointments?: any[];
}

export function SOAPNotesContent({
  appointmentId,
  providerName,
  isReadOnly = false,
  onSave,
  onFinalize,
  soapCategories = [], // Default to empty array
  patientInfo,
  appointmentInfo,
  patientAppointments = [],
}: SOAPNotesContentProps) {
  // Mode state - Manual or AI
  const [soapMode, setSOAPMode] = useState<"manual" | "ai">("ai");
  
  // Recording state
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [showRecordingWidget, setShowRecordingWidget] = useState(true);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI conversion state
  const [isConverting, setIsConverting] = useState(false);
  const [hasConvertedAudio, setHasConvertedAudio] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // SOAP note content
  const [soapNote, setSOAPNote] = useState<SOAPNote>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(`soapNote_${appointmentId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        subjectiveCodes: parsed.subjectiveCodes || [],
        objectiveCodes: parsed.objectiveCodes || [],
        assessmentCodes: parsed.assessmentCodes || [],
        planCodes: parsed.planCodes || [],
        linkedCodeGroups: parsed.linkedCodeGroups || [],
        attachments: parsed.attachments || [],
        linkedReports: parsed.linkedReports || [],
        linkedAppointments: parsed.linkedAppointments || [appointmentId]
      };
    }
    
    // If read-only (completed appointment) and no saved data, generate dummy data
    if (isReadOnly) {
      return {
        id: appointmentId,
        subjective: "Patient reports chronic lower back pain radiating to left leg. Pain described as sharp and intermittent, rated 7/10 on pain scale. Symptoms worsened over the past 2 weeks. Reports difficulty sleeping and reduced range of motion. Patient denies numbness or tingling. Previous treatment with physical therapy provided temporary relief.",
        objective: "Vital Signs: BP 120/80, HR 72 bpm, Temp 98.6°F\n\nPhysical Examination:\n- Posture: Forward head carriage noted\n- Gait: Antalgic, favoring right side\n- ROM: Limited lumbar flexion (50% of normal), extension limited to 15 degrees\n- Palpation: Tenderness over L4-L5 region, muscle spasm in paraspinal muscles\n- Neurological: Straight leg raise positive at 45 degrees on left, reflexes intact, motor strength 5/5 bilateral lower extremities",
        assessment: "1. Chronic lumbar radiculopathy, likely L4-L5 disc involvement\n2. Myofascial pain syndrome\n3. Postural dysfunction\n\nDifferential Diagnosis:\n- Lumbar disc herniation\n- Spinal stenosis\n- Facet joint syndrome\n\nPrognosis: Good with conservative treatment and patient compliance",
        plan: "Treatment Plan:\n1. Continue chiropractic adjustments 2x per week for 4 weeks\n2. Prescribe therapeutic exercises focusing on core strengthening\n3. Ice therapy 15-20 minutes post-treatment\n4. Patient education on proper ergonomics and posture\n5. Consider MRI if symptoms persist after 6 weeks\n6. Follow-up in 2 weeks to assess progress\n\nPatient instructions provided verbally and in writing. Questions answered. Patient verbalized understanding.",
        subjectiveCodes: [],
        objectiveCodes: [],
        assessmentCodes: [],
        planCodes: [],
        linkedCodeGroups: [], // Initialize linkedCodeGroups
        attachments: [],
        linkedReports: ["mock-posture-report-1"],
        linkedAppointments: [appointmentId],
        patientVisibleSummary: true,
        status: "final",
        finalizedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        finalizedBy: providerName,
      };
    }
    
    // Default empty state for new drafts
    return {
      id: appointmentId,
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      subjectiveCodes: [],
      objectiveCodes: [],
      assessmentCodes: [],
      planCodes: [],
      linkedCodeGroups: [], // Initialize linkedCodeGroups
      attachments: [],
      linkedReports: [],
      linkedAppointments: [appointmentId], // default to current
      patientVisibleSummary: false,
      status: "draft",
    };
  });

  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPARTExpanded, setIsPARTExpanded] = useState(false);
  const [showLinkReportModal, setShowLinkReportModal] = useState(false);
  const [showLinkApptModal, setShowLinkApptModal] = useState(false);
  
  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(`soapNote_${appointmentId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSOAPNote({
        ...parsed,
        subjectiveCodes: parsed.subjectiveCodes || [],
        objectiveCodes: parsed.objectiveCodes || [],
        assessmentCodes: parsed.assessmentCodes || [],
        planCodes: parsed.planCodes || [],
        linkedCodeGroups: parsed.linkedCodeGroups || [],
        attachments: parsed.attachments || [],
        linkedReports: parsed.linkedReports || [],
        linkedAppointments: parsed.linkedAppointments || [appointmentId]
      });
    }
  }, [appointmentId]);

  // Auto-save effect
  useEffect(() => {
    if (!isReadOnly && soapNote.status === "draft" && (soapNote.subjective || soapNote.objective || soapNote.assessment || soapNote.plan)) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [soapNote.subjective, soapNote.objective, soapNote.assessment, soapNote.plan, isReadOnly]);

  // Recording timer effect
  useEffect(() => {
    if (recordingState === "recording") {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [recordingState]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartRecording = () => {
    setRecordingState("recording");
    setHasRecording(false);
  };

  const handlePauseRecording = () => {
    setRecordingState("paused");
  };

  const handleResumeRecording = () => {
    setRecordingState("recording");
  };

  const handleStopRecording = () => {
    setRecordingState("idle");
    setHasRecording(true);
    setSOAPNote((prev) => ({ ...prev, audioRecordingDuration: recordingTime }));
  };

  const handleConvertAudio = async () => {
    setIsConverting(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const dummySOAPContent = {
      subjective: `Patient presents with chief complaint of lower back pain that started approximately 2 weeks ago. Patient describes the pain as a dull, constant ache in the lumbar region, radiating occasionally to the right hip. Pain intensity is reported as 6/10 at rest and increases to 8/10 with prolonged sitting or bending forward.\n\nPatient states the pain began after helping a friend move furniture. No history of similar episodes. Pain is worse in the morning upon waking and improves slightly with movement throughout the day. Patient reports difficulty sleeping due to discomfort when lying flat.\n\nDenies any numbness, tingling, or weakness in lower extremities. No bowel or bladder dysfunction. Patient has been taking over-the-counter ibuprofen with minimal relief.`,
      
      objective: `General Appearance: Patient appears comfortable at rest, no acute distress noted.\n\nPosture: Slight forward flexion of trunk observed during standing. Patient favors right side when transitioning from sit to stand.\n\nRange of Motion:\n- Lumbar flexion: Limited to 40° (normal 60-90°)\n- Extension: Limited to 15° (normal 25-30°) with reproduction of symptoms\n- Lateral flexion: Right 20°, Left 25° (normal 25-30° bilaterally)\n- Rotation: Right 30°, Left 35° (normal 45° bilaterally)\n\nPalpation: Tenderness noted at L4-L5 paraspinal muscles bilaterally, right greater than left. Moderate muscle spasm present in right lumbar erector spinae.\n\nNeurological: Lower extremity strength 5/5 bilaterally. Sensation intact to light touch. Deep tendon reflexes 2+ and symmetrical at knees and ankles. Negative straight leg raise bilaterally.`,
      
      assessment: `Primary diagnosis: Acute mechanical lower back pain with muscle strain\n\nClinical impression indicates acute lumbar strain secondary to traumatic lifting injury 2 weeks ago. Pain pattern and physical examination findings are consistent with muscular origin without neurological involvement.\n\nPrognosis is favorable with appropriate conservative treatment. Patient is expected to show improvement within 2-3 weeks with physical therapy intervention focusing on pain management, core strengthening, and proper body mechanics education.`,
      
      plan: `Treatment Plan:\n1. Manual Therapy: Soft tissue mobilization to lumbar paraspinal muscles, joint mobilization Grade II-III to L4-L5 segment\n2. Therapeutic Exercise: Core stabilization exercises, lumbar flexion-based exercises, hip flexor and hamstring stretching\n3. Modalities: Electrical stimulation for pain management, ice application post-treatment\n4. Home Exercise Program: 3-4 exercises with written instructions, walking 15-20 minutes daily\n5. Frequency: 2x per week for 3 weeks, then reassess\n\nFollow-up: Reassess in 2 weeks or sooner if symptoms worsen. Patient educated on red flag symptoms requiring immediate medical attention.`,
    };

    setSOAPNote((prev) => ({
      ...prev,
      ...dummySOAPContent,
    }));

    setIsConverting(false);
    setHasConvertedAudio(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && soapNote.status === "draft") {
      const newFiles = Array.from(e.target.files);
      setSOAPNote((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    if (soapNote.status === "draft") {
      setSOAPNote((prev) => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAutoSave = async () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(`soapNote_${appointmentId}`, JSON.stringify(soapNote));
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem(`soapNote_${appointmentId}`, JSON.stringify(soapNote));
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLastSaved(new Date());
    setIsSaving(false);
    if (onSave) {
      onSave(soapNote);
    }
  };

  const handleFinalize = async () => {
    const finalizedNote: SOAPNote = {
      ...soapNote,
      status: "final",
      finalizedAt: new Date().toISOString(),
      finalizedBy: providerName,
      patientName: patientInfo?.name,
      patientEmail: (patientInfo as any)?.email,
      branch: appointmentInfo?.branch || appointmentInfo?.location,
    };
    
    setSOAPNote(finalizedNote);
    // Save to localStorage
    localStorage.setItem(`soapNote_${appointmentId}`, JSON.stringify(finalizedNote));
    
    if (onFinalize) {
      onFinalize(finalizedNote);
    }
  };

  const canConvert = hasRecording && !hasConvertedAudio && soapNote.status === "draft";
  const canSave = soapNote.status === "draft" && (soapNote.subjective || soapNote.objective || soapNote.assessment || soapNote.plan);
  const canFinalize = canSave;
  const canExport = soapNote.subjective || soapNote.objective || soapNote.assessment || soapNote.plan;

  const handleExport = () => {
    if (!canExport) return;
    
    // Default values if not provided
    const patient = patientInfo || { name: "Patient" };
    const appt = appointmentInfo || {
      date: new Date().toISOString(),
      time: "N/A",
      service: "Appointment",
    };
    
    exportSOAPNotes(soapNote, patient, {
      ...appt,
      provider: providerName,
    });
  };

  return (
    <div className="space-y-6 relative">
      {/* Read-only banner */}
      {isReadOnly && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This appointment is completed. SOAP notes cannot be edited.
            </p>
          </div>
        </div>
      )}

      {/* Final Status Banner */}
      {soapNote.status === "final" && !isReadOnly && (
        <div className="bg-gradient-to-r from-success-50 to-success-100/50 dark:from-success-950/30 dark:to-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-success-500 dark:bg-success-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-success-900 dark:text-success-100">
                SOAP note finalized
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-success-700 dark:text-success-300">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>{soapNote.finalizedBy}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(soapNote.finalizedAt!).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switch - Manual or AI */}
      {!isReadOnly && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Documentation mode
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                Choose how you want to document this appointment
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setSOAPMode("manual")}
                className={`px-4 h-8 rounded-md text-sm font-medium transition-colors ${
                  soapMode === "manual"
                    ? "bg-primary-600 text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setSOAPMode("ai")}
                className={`px-4 h-8 rounded-md text-sm font-medium transition-colors ${
                  soapMode === "ai"
                    ? "bg-primary-600 text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Mode - Block-based Interface */}
      {soapMode === "manual" && !isReadOnly && (
        <ManualSOAPInterface
          categories={soapCategories}
          appointmentId={appointmentId}
          onSave={(blocks) => {
            console.log("Manual SOAP blocks saved:", blocks);
            // TODO: Convert blocks to SOAP format and save
          }}
        />
      )}

      {/* AI Mode - Traditional SOAP Interface */}
      {soapMode === "ai" && (
        <>
          {/* SOAP Sections - Clean Grid Layout */}
          <div className="grid gap-4">
            <SOAPSection
              title="Subjective"
              value={soapNote.subjective}
              onChange={(value) => setSOAPNote((prev) => ({ ...prev, subjective: value }))}
              placeholder="Patient's chief complaint, history, and symptoms..."
              isReadOnly={isReadOnly}
            />

            <div className="relative">
              <SOAPSection
                title="Objective"
                value={soapNote.objective}
                onChange={(value) => setSOAPNote((prev) => ({ ...prev, objective: value }))}
                placeholder="Clinical observations, measurements, and examination findings..."
                isReadOnly={isReadOnly}
              />
            </div>

            <div className="mb-4 pl-4 border-l-2 border-primary-200 dark:border-primary-800">
               <button 
                 onClick={() => setIsPARTExpanded(!isPARTExpanded)}
                 className="flex items-center gap-2 w-full text-left"
               >
                 <Activity className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                 <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex-1">
                   P.A.R.T. Evaluation (Objective)
                 </h4>
                 {isPARTExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
               </button>
               
               {isPARTExpanded && (
                 <div className="mt-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                   <PARTNotesContent
                     appointmentId={appointmentId}
                     providerName={providerName}
                     isReadOnly={isReadOnly}
                     onChange={(note) => {
                       // Just capturing upstream
                     }}
                   />
                 </div>
               )}
            </div>

            <SOAPSection
              title="Assessment"
              value={soapNote.assessment}
              onChange={(value) => setSOAPNote((prev) => ({ ...prev, assessment: value }))}
              placeholder="Clinical impressions and diagnosis..."
              isReadOnly={isReadOnly}
              actionButton={
                !isReadOnly ? (
                    <button
                      className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-md text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors shadow-sm"
                      onClick={() => setShowLinkReportModal(true)}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      + Link Report
                    </button>
                ) : undefined
              }
            />

            {soapNote.linkedReports && soapNote.linkedReports.length > 0 && (
              <div className="mt-2 mb-4 p-3 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/50 rounded-xl">
                <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3" /> Linked Clinical Reports
                </p>
                <div className="flex flex-wrap gap-2">
                  {soapNote.linkedReports.map((reportId, idx) => {
                    const isKDT = reportId.startsWith("kdt");
                    const isSI = reportId.startsWith("si");
                    const label = isKDT ? "KDT Report" : isSI ? "Structural Integrity" : "DICOM Report";
                    return (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-sm">
                        <ImageIcon className="w-3 h-3 text-primary-500" />
                        {label} ({reportId})
                        {!isReadOnly && (
                          <button onClick={() => setSOAPNote(prev => ({...prev, linkedReports: prev.linkedReports.filter(id => id !== reportId)}))} className="ml-1 text-neutral-400 hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <SOAPSection
              title="Plan"
              value={soapNote.plan}
              onChange={(value) => setSOAPNote((prev) => ({ ...prev, plan: value }))}
              placeholder="Treatment plan, follow-up, and recommendations..."
              isReadOnly={isReadOnly}
            />
          </div>

          {/* Attachments & Settings Row */}
          {!isReadOnly && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Attachments */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Attachments
                </label>
                <div className="space-y-2">
                  <label className="group relative flex items-center justify-center gap-2 h-20 px-4 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-all">
                    <FileUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </label>
                  {soapNote.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg group"
                    >
                      <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-destructive transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Link Array */}
          <div className="py-2 border-t border-neutral-200 dark:border-neutral-800">
             <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Linked Appointments</h4>
                {!isReadOnly && (
                  <button onClick={() => setShowLinkApptModal(true)} className="text-xs text-primary-600 hover:text-primary-700 font-medium">+ Manage Links</button>
                )}
             </div>
             <div className="flex flex-wrap gap-2">
                {soapNote.linkedAppointments && soapNote.linkedAppointments.map((apptId, i) => {
                    const appt = patientAppointments.find(a => a.id === apptId);
                    return (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full border border-primary-100 dark:border-primary-800">
                        <Calendar className="w-3.5 h-3.5" />
                        {appt ? `${appt.service} (${formatDate(appt.date)})` : `Appt: ${apptId}`}
                        {apptId === appointmentId && " (Current)"}
                      </span>
                    )
                 })}
                {(!soapNote.linkedAppointments || soapNote.linkedAppointments.length === 0) && (
                   <span className="text-xs text-neutral-500">Unlinked (Standalone Note)</span>
                )}
             </div>
          </div>

          {/* Cumulative ICD-CPT Codes Section */}
          <CumulativeICDCPTCodesSection
            soapData={{
              subjective: soapNote.subjective,
              objective: soapNote.objective,
              assessment: soapNote.assessment,
              plan: soapNote.plan,
            }}
            onSave={(linkedGroups) => {
              setSOAPNote((prev) => ({ ...prev, linkedCodeGroups: linkedGroups }));
            }}
            initialLinkedGroups={soapNote.linkedCodeGroups}
          />

          {/* Action Bar */}
          {!isReadOnly && (
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                    <span>Saved {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  disabled={!canSave || isSaving}
                  className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Save draft
                </button>
                <button
                  onClick={handleFinalize}
                  disabled={!canFinalize}
                  className="inline-flex items-center gap-2 px-5 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Lock className="w-4 h-4" />
                  Finalize
                </button>
                <button
                  onClick={handleExport}
                  disabled={!canExport}
                  className="inline-flex items-center gap-2 px-5 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          )}

          {/* Floating Recording Widget */}
          {!isReadOnly && showRecordingWidget && (
            <FloatingRecordingWidget
              recordingState={recordingState}
              recordingTime={recordingTime}
              hasRecording={hasRecording}
              isConverting={isConverting}
              hasConvertedAudio={hasConvertedAudio}
              canConvert={canConvert}
              onStartRecording={handleStartRecording}
              onPauseRecording={handlePauseRecording}
              onResumeRecording={handleResumeRecording}
              onStopRecording={handleStopRecording}
              onConvertAudio={handleConvertAudio}
              onClose={() => setShowRecordingWidget(false)}
              formatTime={formatTime}
            />
          )}

          {/* Reopen Widget Button */}
          {!isReadOnly && !showRecordingWidget && (
            <button
              onClick={() => setShowRecordingWidget(true)}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
            >
              <Mic className="w-6 h-6" />
            </button>
          )}
        </>
      )}

      {/* Modals for Linking */}
      {showLinkReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Link DICOM Report</h3>
              <button onClick={() => setShowLinkReportModal(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Select generated clinical or imaging reports to link with this assessment.</p>
              
              {/* Reports Grid */}
              <div className="space-y-4">
                {/* Diagnostic Imaging Section */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Imaging & DICOM</h4>
                  {["posture-dicom", "cervical-drma"].map(reportType => (
                    <label key={reportType} className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-all">
                        <input 
                          type="checkbox" 
                          checked={soapNote.linkedReports.includes(reportType)}
                          onChange={(e) => {
                            setSOAPNote(prev => {
                              const has = prev.linkedReports.includes(reportType);
                              return {
                                ...prev, 
                                linkedReports: has ? prev.linkedReports.filter(r => r !== reportType) : [...prev.linkedReports, reportType]
                              };
                            })
                          }}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white capitalize">{reportType.replace("-", " ")} Report</p>
                          <p className="text-[10px] text-neutral-500">Diagnostic Imaging</p>
                        </div>
                    </label>
                  ))}
                </div>

                {/* Clinical Reports Section */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Clinical Analysis</h4>
                  {[
                    { id: "kdt-101", label: "KDT Decompression Report", type: "clinical" },
                    { id: "si-202", label: "Structural Integrity Analysis", type: "clinical" }
                  ].map(report => (
                    <label key={report.id} className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-all">
                        <input 
                          type="checkbox" 
                          checked={soapNote.linkedReports.includes(report.id)}
                          onChange={(e) => {
                            setSOAPNote(prev => {
                              const has = prev.linkedReports.includes(report.id);
                              return {
                                ...prev, 
                                linkedReports: has ? prev.linkedReports.filter(r => r !== report.id) : [...prev.linkedReports, report.id]
                              };
                            })
                          }}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{report.label}</p>
                          <p className="text-[10px] text-neutral-500">Patient Case Study</p>
                        </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
               <button onClick={() => setShowLinkReportModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}

      {showLinkApptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Manage Linked Appointments</h3>
              <button onClick={() => setShowLinkApptModal(false)} className="text-neutral-500 hover:text-neutral-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">Select the appointments this SOAP note clinically supports.</p>
              {patientAppointments.length > 0 ? patientAppointments.map(appt => (
                 <label key={appt.id} className="flex items-center gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={soapNote.linkedAppointments?.includes(appt.id) || false}
                      onChange={(e) => {
                        setSOAPNote(prev => {
                          const arr = prev.linkedAppointments || [];
                          const has = arr.includes(appt.id);
                          return {
                            ...prev, 
                            linkedAppointments: has ? arr.filter(a => a !== appt.id) : [...arr, appt.id]
                          };
                        })
                      }}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{appt.service}</p>
                      <p className="text-xs text-neutral-500">{formatDate(appt.date)} {appt.id === appointmentId && "(Current)"}</p>
                    </div>
                </label>
              )) : (
                <div className="py-8 text-center text-neutral-500 italic">No appointments available to link.</div>
              )}
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
               <button onClick={() => setShowLinkApptModal(false)} className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Floating Recording Widget Component
interface FloatingRecordingWidgetProps {
  recordingState: "idle" | "recording" | "paused";
  recordingTime: number;
  hasRecording: boolean;
  isConverting: boolean;
  hasConvertedAudio: boolean;
  canConvert: boolean;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onConvertAudio: () => void;
  onClose: () => void;
  formatTime: (seconds: number) => string;
}

function FloatingRecordingWidget({
  recordingState,
  recordingTime,
  hasRecording,
  isConverting,
  hasConvertedAudio,
  canConvert,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onConvertAudio,
  onClose,
  formatTime,
}: FloatingRecordingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Compact Widget */}
      {!isExpanded && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            {recordingState === "idle" && !hasRecording && (
              <>
                <button
                  onClick={onStartRecording}
                  className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div className="pr-2">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">Record session</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">AI will generate notes</p>
                </div>
              </>
            )}

            {recordingState === "recording" && (
              <>
                <button
                  onClick={onPauseRecording}
                  className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center transition-all shadow-lg animate-pulse"
                >
                  <Pause className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-mono font-semibold text-neutral-900 dark:text-white">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                  <button
                    onClick={onStopRecording}
                    className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </>
            )}

            {recordingState === "paused" && (
              <>
                <button
                  onClick={onResumeRecording}
                  className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-all shadow-lg"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-semibold text-neutral-900 dark:text-white">
                    {formatTime(recordingTime)}
                  </span>
                  <button
                    onClick={onStopRecording}
                    className="w-8 h-8 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </>
            )}

            {hasRecording && recordingState === "idle" && (
              <>
                <button
                  onClick={canConvert ? onConvertAudio : undefined}
                  disabled={!canConvert || isConverting}
                  className="flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Processing...</span>
                    </>
                  ) : hasConvertedAudio ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Converted</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Convert to notes</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}