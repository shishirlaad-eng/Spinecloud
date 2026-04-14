import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Pause,
  Play,
  Loader2,
  FileUp,
  X,
} from "lucide-react";

interface PARTNote {
  id: string;
  position: string;
  alignment: string;
  rangeOfMotion: string;
  tenderness: string;
  audioRecordingDuration?: number;
}

interface PARTNotesContentProps {
  appointmentId: string;
  providerName: string;
  isReadOnly?: boolean;
  onChange?: (note: PARTNote) => void;
}

export function PARTNotesContent({
  appointmentId,
  providerName,
  isReadOnly = false,
  onChange,
}: PARTNotesContentProps) {
  // Recording state
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused">("idle");
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [showRecordingWidget, setShowRecordingWidget] = useState(true);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // AI conversion state
  const [isConverting, setIsConverting] = useState(false);
  const [hasConvertedAudio, setHasConvertedAudio] = useState(false);

  // P.A.R.T. note content
  const [partNote, setPARTNote] = useState<PARTNote>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(`partNote_${appointmentId}`);
    if (saved) {
      return JSON.parse(saved);
    }
    
    // If read-only (completed appointment) and no saved data, generate dummy data
    if (isReadOnly) {
      return {
        id: appointmentId,
        position: "Cervical Spine (C1-C7):\\n- Postural observation: Forward head posture noted, approximately 2 inches anterior to plumb line\\n- Shoulder height: Right shoulder elevated 1cm compared to left\\n- Head tilt: Minimal lateral tilt to right side\\n\\nThoracic Spine (T1-T12):\\n- Increased kyphotic curve observed in mid-thoracic region\\n- No visible rotational deformity\\n- Scapular positioning: Both scapulae protracted, right more prominent\\n\\nLumbar Spine (L1-L5):\\n- Reduced lordotic curve\\n- Pelvic positioning: Level, no lateral tilt\\n- Standing posture: Weight distribution appears equal bilaterally",
        alignment: "Static Palpation:\\n- C3-C4: Posterior rotation and left lateral flexion restriction noted\\n- T4-T5: Fixed in flexion, restricted extension\\n- L4-L5: Right rotation restriction, tender to palpation\\n\\nMotion Palpation:\\n- Cervical: Reduced left rotation at C3-C4 level, reproduction of symptoms with end-range motion\\n- Thoracic: Restricted lateral flexion bilaterally in mid-thoracic region\\n- Lumbar: Limited right rotation at L4-L5, compensatory motion observed at L5-S1\\n\\nPostural Analysis:\\n- Forward head carriage measuring 5cm anterior to optimal alignment\\n- Rounded shoulders with internal rotation\\n- Anterior pelvic tilt minimal (5 degrees)",
        rangeOfMotion: "Cervical Spine:\\n- Flexion: 35° (Normal: 45-50°) - Patient reports tightness at end range\\n- Extension: 40° (Normal: 45-55°) - Limited, reproduces neck pain\\n- Left Rotation: 55° (Normal: 70-80°) - Significantly restricted\\n- Right Rotation: 70° (Normal: 70-80°) - Within normal limits\\n- Left Lateral Flexion: 30° (Normal: 40-45°) - Restricted\\n- Right Lateral Flexion: 35° (Normal: 40-45°) - Mildly restricted\\n\\nThoracic Spine:\\n- Flexion: 40° (Normal: 45-50°)\\n- Extension: 20° (Normal: 25-30°)\\n- Rotation: 30° bilateral (Normal: 35-40°)\\n\\nLumbar Spine:\\n- Flexion: 50° (Normal: 60-90°) - Limited by pain\\n- Extension: 15° (Normal: 25-30°) - Reproduces lower back pain\\n- Lateral Flexion: Right 20°, Left 25° (Normal: 25-30°)",
        tenderness: "Palpatory Findings:\\n\\nCervical Region:\\n- Moderate tenderness at C3-C4 facet joints bilaterally (4/10 pain scale)\\n- Upper trapezius: Bilateral muscle spasm and trigger points, right > left\\n- Levator scapulae: Tender to palpation bilaterally, more pronounced on right\\n- Suboccipital muscles: Tight and tender, reproduction of headache symptoms\\n\\nThoracic Region:\\n- T4-T5 spinous processes: Tender to spring testing\\n- Paraspinal muscles: Bilateral hypertonicity in mid-thoracic region\\n- Rhomboid muscles: Tender points noted, right side more affected\\n\\nLumbar Region:\\n- L4-L5 level: Significant tenderness over right facet joint (6/10 pain scale)\\n- Paraspinal muscles: Palpable muscle spasm and guarding, right lumbar erectors\\n- Sacroiliac joint: Tender to palpation on right side with compression test\\n- Quadratus lumborum: Bilateral trigger points identified",
      };
    }
    
    // Default empty state for new drafts
    return {
      id: appointmentId,
      position: "",
      alignment: "",
      rangeOfMotion: "",
      tenderness: "",
    };
  });

  // Report changes upstream when component finishes a logical update (could be debounced instead)
  useEffect(() => {
    if (onChange) {
      onChange(partNote);
    }
  }, [partNote.position, partNote.alignment, partNote.rangeOfMotion, partNote.tenderness]);

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
    if (isReadOnly) return;
    setRecordingState("recording");
    setHasRecording(false);
  };

  const handlePauseRecording = () => {
    if (isReadOnly) return;
    setRecordingState("paused");
  };

  const handleResumeRecording = () => {
    if (isReadOnly) return;
    setRecordingState("recording");
  };

  const handleStopRecording = () => {
    if (isReadOnly) return;
    setRecordingState("idle");
    setHasRecording(true);
    setPARTNote((prev) => ({ ...prev, audioRecordingDuration: recordingTime }));
  };

  const handleConvertAudio = async () => {
    if (isReadOnly) return;
    setIsConverting(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const dummyPARTContent = {
      position: `Patient examined in standing, seated, and supine positions. Standing posture reveals mild forward head posture with rounded shoulders. Seated examination shows tendency to slouch with lumbar lordosis flattening. Supine position allows for complete relaxation and proper spinal alignment. Patient able to maintain neutral spine position with cueing.`,
      
      alignment: `Anterior view shows level shoulders with slight right shoulder elevation. Posterior view reveals balanced pelvis with no significant lateral tilt. Sagittal view demonstrates forward head carriage approximately 2 inches anterior to plumb line. Mild thoracic kyphosis noted. Lumbar lordosis within normal limits when cued to proper posture.`,
      
      rangeOfMotion: `Cervical: Flexion 45°, Extension 50°, Lateral flexion 40° bilateral, Rotation 70° bilateral. Lumbar: Flexion 80° (fingertips to mid-shin), Extension 20°, Lateral flexion 25° bilateral. Thoracic rotation 35° bilateral. All movements performed without reproduction of primary complaint. Mild end-range discomfort noted in lumbar extension.`,
      
      tenderness: `Palpable tenderness at bilateral upper trapezius with moderate trigger points. Paraspinal muscles at L4-L5 level demonstrate increased tone and mild tenderness to deep palpation. Sacroiliac joints non-tender. Piriformis muscle shows slight tenderness on right side. No acute inflammation or swelling noted. Patient reports 4/10 discomfort with deep palpation at affected areas.`,
    };

    setPARTNote((prev) => ({
      ...prev,
      ...dummyPARTContent,
    }));

    setIsConverting(false);
    setHasConvertedAudio(true);
  };

  const canConvert = hasRecording && !hasConvertedAudio && !isReadOnly;

  return (
    <div className="space-y-6 relative">
      {/* Read-only banner */}
      {isReadOnly && (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              This appointment is completed. P.A.R.T. notes cannot be edited.
            </p>
          </div>
        </div>
      )}



      {/* P.A.R.T. Sections - Clean Grid Layout */}
      <div className="grid gap-4">
        <PARTSection
          title="Position"
          value={partNote.position}
          onChange={(value) => setPARTNote((prev) => ({ ...prev, position: value }))}
          placeholder="Patient positioning and postural observations..."
          isReadOnly={isReadOnly}
        />

        <PARTSection
          title="Alignment"
          value={partNote.alignment}
          onChange={(value) => setPARTNote((prev) => ({ ...prev, alignment: value }))}
          placeholder="Postural alignment observations..."
          isReadOnly={isReadOnly}
        />

        <PARTSection
          title="Range of Motion"
          value={partNote.rangeOfMotion}
          onChange={(value) => setPARTNote((prev) => ({ ...prev, rangeOfMotion: value }))}
          placeholder="Range of motion measurements and observations..."
          isReadOnly={isReadOnly}
        />

        <PARTSection
          title="Tenderness"
          value={partNote.tenderness}
          onChange={(value) => setPARTNote((prev) => ({ ...prev, tenderness: value }))}
          placeholder="Areas of tenderness and palpation findings..."
          isReadOnly={isReadOnly}
        />
      </div>



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
    </div>
  );
}

// Clean P.A.R.T. Section Component
interface PARTSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isReadOnly: boolean;
}

function PARTSection({
  title,
  value,
  onChange,
  placeholder,
  isReadOnly,
}: PARTSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={`group relative transition-all ${isFocused ? 'ring-2 ring-primary-500/20 dark:ring-primary-500/30' : ''}`}>
      <div className="absolute -top-2 left-3 px-2 bg-white dark:bg-neutral-900">
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          {title}
        </label>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={isReadOnly}
        rows={6}
        className="w-full px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all resize-y disabled:opacity-60 disabled:cursor-not-allowed min-h-[120px]"
      />
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