import React, { useState, useRef } from "react";
import { ArrowLeft, Save, Upload, CheckCircle2, ChevronRight, Activity, Circle, RefreshCw, FileText, Camera, Info, X, ChevronDown, ChevronUp } from "lucide-react";

interface Point {
  id: string;
  label: string;
  x: number;
  y: number;
  view: "front" | "side";
}

interface StructuralIntegrityBuilderProps {
  patientName: string;
  onBack: () => void;
  onSave: (report: any) => void;
}

const FRONT_POINTS = [
  "Center of Head",
  "Left Shoulder",
  "Right Shoulder",
  "Left Hip",
  "Right Hip",
  "Left Knee",
  "Right Knee",
  "Midpoint between Feet"
];

const SIDE_POINTS = [
  "Tragus (Ear)",
  "Acromion (Shoulder)",
  "Greater Trochanter (Hip)",
  "Lateral Malleolus (Ankle)"
];

const QUESTIONNAIRE_STEPS = [
  {
    id: "symptoms",
    title: "Patient Symptoms",
    questions: [
      { id: "pain_level", label: "Current Pain Level (0-10)", type: "range" },
      { id: "headaches", label: "Frequency of headaches", type: "select", options: ["Never", "Rarely", "Occasionally", "Frequently"] },
      { id: "stiffness", label: "Morning stiffness duration", type: "select", options: ["None", "< 30 mins", "30-60 mins", "> 60 mins"] }
    ]
  },
  {
    id: "lifestyle",
    title: "Lifestyle & Workspace",
    questions: [
      { id: "sitting", label: "Hours spent sitting per day", type: "number" },
      { id: "ergonomics", label: "Does patient use ergonomic setup?", type: "boolean" },
      { id: "exercise", label: "Hours of exercise per week", type: "number" }
    ]
  }
];

export function StructuralIntegrityBuilder({
  patientName,
  onBack,
  onSave,
}: StructuralIntegrityBuilderProps) {
  const [activeStep, setActiveStep] = useState<"upload" | "annotate" | "questionnaire" | "result">("upload");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [sideImage, setSideImage] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentView, setCurrentView] = useState<"front" | "side">("front");
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const containerRef = useRef<HTMLDivElement>(null);

  const targetPoints = currentView === "front" ? FRONT_POINTS : SIDE_POINTS;

  const handleImageUpload = (view: "front" | "side", e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (view === "front") setFrontImage(event.target?.result as string);
        else setSideImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeStep !== "annotate") return;
    if (activePointIndex >= targetPoints.length) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint: Point = {
      id: Math.random().toString(36).substr(2, 9),
      label: targetPoints[activePointIndex],
      x,
      y,
      view: currentView
    };

    setPoints([...points, newPoint]);
    setActivePointIndex(prev => prev + 1);
  };

  const clearPoints = () => {
    setPoints(points.filter(p => p.view !== currentView));
    setActivePointIndex(0);
  };

  const calculateOffsets = () => {
    // Mock logic for skeletal offset calculation
    return {
      shoulderTilt: (Math.random() * 5).toFixed(1),
      pelvicTilt: (Math.random() * 3).toFixed(1),
      headTranslation: (Math.random() * 15).toFixed(1),
    };
  };

  const renderUploadStep = () => (
    <div className="flex-1 flex flex-col items-center justify-start p-8 max-w-4xl mx-auto w-full overflow-y-auto">
      <div className="text-center mb-10 w-full">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Upload Posture Photos</h2>
        <p className="text-neutral-500">Please provide clear front and side profile photos of the patient.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Front View */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Front View</label>
            {frontImage && <span className="flex items-center gap-1 text-xs font-bold text-success-600 uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>}
          </div>
          <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden flex flex-col items-center justify-center p-4 group transition-all hover:border-primary-500 shadow-sm">
            {frontImage ? (
              <>
                <img src={frontImage} className="absolute inset-0 w-full h-full object-cover" alt="Front" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <button onClick={() => setFrontImage(null)} className="p-3 bg-white text-red-600 rounded-full shadow-xl hover:scale-110 transition-transform">
                      <X className="w-6 h-6" />
                   </button>
                </div>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-neutral-300 mb-4" />
                <p className="text-xs text-neutral-500 text-center mb-4">Drag and drop or click to upload front-facing photo</p>
                <input type="file" onChange={(e) => handleImageUpload("front", e)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium pointer-events-none">Select File</button>
              </>
            )}
          </div>
        </div>

        {/* Side View */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Side View</label>
            {sideImage && <span className="flex items-center gap-1 text-xs font-bold text-success-600 uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Ready</span>}
          </div>
          <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden flex flex-col items-center justify-center p-4 group transition-all hover:border-primary-500 shadow-sm">
            {sideImage ? (
              <>
                <img src={sideImage} className="absolute inset-0 w-full h-full object-cover" alt="Side" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <button onClick={() => setSideImage(null)} className="p-3 bg-white text-red-600 rounded-full shadow-xl hover:scale-110 transition-transform">
                      <X className="w-6 h-6" />
                   </button>
                </div>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-neutral-300 mb-4" />
                <p className="text-xs text-neutral-500 text-center mb-4">Drag and drop or click to upload side profile photo</p>
                <input type="file" onChange={(e) => handleImageUpload("side", e)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                <button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium pointer-events-none">Select File</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center gap-4">
        <button 
          onClick={() => setActiveStep("annotate")}
          disabled={!frontImage || !sideImage}
          className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 ${frontImage && sideImage ? "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/30" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"}`}
        >
          Proceed to Analysis <ChevronRight className="w-5 h-5" />
        </button>
        {!frontImage || !sideImage ? (
          <p className="text-xs font-medium text-neutral-400">Please upload both views to continue.</p>
        ) : (
          <p className="text-xs font-bold text-success-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Images verified and ready for analysis.</p>
        )}
      </div>
    </div>
  );

  const renderAnnotationStep = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/50 border border-neutral-700 rounded-full text-xs text-white">
          <Info className="w-3.5 h-3.5" />
          Click on the image to mark the required points
        </div>

        <div 
          onClick={handleCanvasClick}
          className="relative w-full max-w-lg aspect-[3/4] bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden cursor-crosshair group transition-all"
        >
          <img 
            src={currentView === "front" ? frontImage! : sideImage!} 
            className="w-full h-full object-cover" 
            alt="Analysis" 
          />
          
          {/* Linked Lines (Mock Analysis) */}
          {points.filter(p => p.view === currentView).length >= 2 && (
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
                {/* Visualizing simple horizontal lines for shoulder/hip tilt */}
                {currentView === "front" && points.some(p => p.label === "Left Shoulder") && points.some(p => p.label === "Right Shoulder") && (
                   <line 
                     x1={`${points.find(p => p.label === "Left Shoulder")!.x}%`} 
                     y1={`${points.find(p => p.label === "Left Shoulder")!.y}%`}
                     x2={`${points.find(p => p.label === "Right Shoulder")!.x}%`}
                     y2={`${points.find(p => p.label === "Right Shoulder")!.y}%`}
                     stroke="cyan" 
                     strokeWidth="2"
                    />
                )}
             </svg>
          )}

          {/* Points */}
          {points.filter(p => p.view === currentView).map((p, i) => (
            <div 
              key={p.id} 
              className="absolute w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
               <span className="absolute top-5 bg-black text-[10px] text-white px-1 rounded whitespace-nowrap">{p.label}</span>
            </div>
          ))}

          {/* Guide Overlay for next point */}
          {activePointIndex < targetPoints.length && (
             <div className="absolute inset-0 bg-primary-500/5 flex items-center justify-center pointer-events-none">
                <div className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl animate-bounce">
                  Mark {targetPoints[activePointIndex]}
                </div>
             </div>
          )}
        </div>
      </div>

      {/* Sidebar Guide */}
      <div className="w-80 border-l border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col shrink-0">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
           <div className="flex items-center gap-2 mb-4 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <button 
                onClick={() => { setCurrentView("front"); setActivePointIndex(points.filter(p => p.view === "front").length); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${currentView === "front" ? "bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-neutral-500"}`}
              >Front View</button>
              <button 
                onClick={() => { setCurrentView("side"); setActivePointIndex(points.filter(p => p.view === "side").length); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${currentView === "side" ? "bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400" : "text-neutral-500"}`}
              >Side View</button>
           </div>
           
           <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Analysis Checklist</h3>
           <p className="text-xs text-neutral-500 mt-1">{points.filter(p => p.view === currentView).length} of {targetPoints.length} points marked</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {targetPoints.map((label, i) => {
             const isMarked = points.some(p => p.view === currentView && p.label === label);
             return (
               <div key={label} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMarked ? "bg-success-50/50 dark:bg-success-950/20 border-success-200 dark:border-success-800/50" : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isMarked ? "bg-success-500 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"}`}>
                    {isMarked ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${isMarked ? "text-success-800 dark:text-success-400" : "text-neutral-600 dark:text-neutral-400"}`}>{label}</span>
               </div>
             )
           })}
        </div>

        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 flex flex-col gap-3">
          <button onClick={clearPoints} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear points for this view</button>
          <button 
            onClick={() => {
              if (currentView === "front") {
                setCurrentView("side");
                setActivePointIndex(points.filter(p => p.view === "side").length);
              } else {
                setActiveStep("questionnaire");
              }
            }}
            disabled={points.filter(p => p.view === currentView).length < targetPoints.length}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {currentView === "front" ? "Next: Side View" : "Next: Questionnaire"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderQuestionnaireStep = () => (
    <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Structural Questionnaire</h2>
        <p className="text-neutral-500">Please complete the clinical assessment questionnaire.</p>
      </div>

      <div className="space-y-8">
        {QUESTIONNAIRE_STEPS.map(step => (
          <div key={step.id} className="space-y-4">
             <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                   <FileText className="w-4 h-4" />
                </div>
                {step.title}
             </h3>
             <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 grid gap-6">
                {step.questions.map(q => (
                  <div key={q.id}>
                    <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 block mb-3">{q.label}</label>
                    {q.type === "select" ? (
                      <select 
                        className="w-full h-11 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm"
                        value={answers[q.id] || ""}
                        onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                      >
                        <option value="">Select option</option>
                        {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : q.type === "range" ? (
                       <input type="range" min="0" max="10" step="1" className="w-full" onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})} />
                    ) : (
                      <input 
                        type={q.type} 
                        className="w-full h-11 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm"
                        onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                      />
                    )}
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
         <button 
           onClick={() => setActiveStep("result")}
           className="inline-flex items-center gap-2 px-10 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
         >
           Calculate Report <Activity className="w-5 h-5" />
         </button>
      </div>
    </div>
  );

  const renderResultStep = () => {
    const offsets = calculateOffsets();
    return (
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
         <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-primary-600 p-8 text-white">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Structural Integrity</h1>
                    <p className="text-primary-100 font-medium">Patient: {patientName} • {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-widest">
                    Postural Analysis
                  </div>
               </div>
               
               <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-1">Shoulder Offset</p>
                     <p className="text-2xl font-black">{offsets.shoulderTilt}°</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-1">Pelvic Level</p>
                     <p className="text-2xl font-black">{offsets.pelvicTilt}°</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary-200 mb-1">Cranio-Cervical</p>
                     <p className="text-2xl font-black">{offsets.headTranslation}mm</p>
                  </div>
               </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest mb-6">Visual Analysis</h3>
                  <div className="flex gap-4">
                     <div className="flex-1 aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden relative">
                        <img src={frontImage!} className="w-full h-full object-cover grayscale opacity-50" alt="Result Front" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                           <p className="text-white text-[10px] font-bold uppercase tracking-tight">Anterior</p>
                        </div>
                     </div>
                     <div className="flex-1 aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden relative">
                        <img src={sideImage!} className="w-full h-full object-cover grayscale opacity-50" alt="Result Side" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                           <p className="text-white text-[10px] font-bold uppercase tracking-tight">Lateral</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Clinical Impression</h3>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                       <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                         Analysis reveals significant {offsets.shoulderTilt}° lateral deviation in shoulder alignment ... Postural compensations noted in lumbar chain.
                       </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Wellness Metric</h3>
                    <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                       <div className="h-full bg-success-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" style={{ width: '82%' }} />
                       <div className="flex-1 h-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-neutral-400 tracking-tighter">
                       <span>Poor</span>
                       <span>Optimal</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
               <button onClick={() => setActiveStep("questionnaire")} className="text-sm font-bold text-neutral-500 hover:text-neutral-900">Revise Analysis</button>
               <button onClick={() => onSave({
                 id: `si-${Date.now()}`,
                 type: "structural-integrity",
                 date: new Date().toISOString(),
                 offsets,
                 points,
                 images: { front: frontImage, side: sideImage },
                 answers
               })} className="px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95">Save Final Report</button>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] bg-neutral-50 dark:bg-neutral-950 flex flex-col font-inter">
      {/* Header */}
      <div className="h-16 px-6 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />
          <div>
            <h1 className="font-bold text-neutral-900 dark:text-white uppercase tracking-tight">Structural Integrity Builder</h1>
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Patient Assessment • {patientName}</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center gap-8">
           {[
             { id: "upload", label: "Upload" },
             { id: "annotate", label: "Analyze" },
             { id: "questionnaire", label: "Survey" },
             { id: "result", label: "Report" }
           ].map((s, i) => {
             const active = activeStep === s.id;
             return (
               <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 ring-4 ring-primary-500/10" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>{s.label}</span>
                  { i < 3 && <ChevronRight className="w-3 h-3 text-neutral-300" /> }
               </div>
             )
           })}
        </div>

        <button onClick={onBack} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {activeStep === "upload" && renderUploadStep()}
        {activeStep === "annotate" && renderAnnotationStep()}
        {activeStep === "questionnaire" && renderQuestionnaireStep()}
        {activeStep === "result" && renderResultStep()}
      </div>
    </div>
  );
}
