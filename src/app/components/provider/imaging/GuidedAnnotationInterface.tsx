import React, { useState } from "react";
import { ArrowLeft, Save, Upload, CheckCircle2, ChevronRight, Activity, CircleDot, RefreshCcw, MousePointer2, Hand, ZoomIn, Search, Sun, Type, Ruler, Spline, Scissors, FileText } from "lucide-react";
import type { ReportType } from "./NewReportModal";

interface GuidedAnnotationInterfaceProps {
  reportType: ReportType;
  patientName: string;
  onBack: () => void;
  onSave: () => void;
}

const REPORT_TITLES: Record<string, string> = {
  "cervical-drma": "Cervical Flexion/Extension DRMA",
  "lumbar-flexion": "Lumbar Flexion DRMA",
  "apom": "APOM Analysis",
  "structural": "Structural Integrity Report",
  "posture": "Posture Analysis",
  "cervical-lateral": "Cervical Lateral Analysis",
  "lumbar-lateral": "Lumbar Lateral Analysis",
  "thoracic": "Thoracic AP/Lateral",
  "nasium": "Nasium Analysis",
  "vertex": "Vertex Analysis",
  "pelvic": "Pelvic AP Analysis",
  "scoliosis": "Scoliosis Cobb Angle"
};

const REPORT_CONFIGS: Record<string, { tools: string[], steps: string[] }> = {
  "cervical-drma": {
    tools: ["point", "angle"],
    steps: ["Mark Anterior Superior point of C2", "Mark Anterior Inferior point of C2", "Mark Posterior Superior point of C2", "Mark Posterior Inferior point of C2", "Mark Anterior Superior point of C3", "Mark Anterior Inferior point of C3"]
  },
  "scoliosis": {
    tools: ["cobb", "line"],
    steps: ["Mark superior endplate of upper vertebra", "Mark inferior endplate of lower vertebra", "Mark apex of the curve"]
  },
  "posture": {
    tools: ["point", "line"],
    steps: ["Mark tragus of ear", "Mark acromion process", "Mark greater trochanter", "Mark lateral malleolus"]
  },
  default: {
    tools: ["point"],
    steps: ["Initialize calibration", "Mark reference point A", "Mark reference point B", "Complete analysis bounding box"]
  }
};

const ALL_TOOLS = [
  { id: "cursor", icon: MousePointer2, label: "Select", type: "generic" },
  { id: "pan", icon: Hand, label: "Pan", type: "generic" },
  { id: "zoom", icon: ZoomIn, label: "Zoom", type: "generic" },
  { id: "magnify", icon: Search, label: "Magnifier", type: "generic" },
  { id: "contrast", icon: Sun, label: "Contrast", type: "generic" },
  { id: "text", icon: Type, label: "Text", type: "generic" },
  { id: "point", icon: CircleDot, label: "Point", type: "specific" },
  { id: "line", icon: Ruler, label: "Measure", type: "specific" },
  { id: "angle", icon: Spline, label: "Angle", type: "specific" },
  { id: "cobb", icon: Scissors, label: "Cobb", type: "specific" },
];

export function GuidedAnnotationInterface({
  reportType,
  patientName,
  onBack,
  onSave,
}: GuidedAnnotationInterfaceProps) {
  const [hasImage, setHasImage] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTool, setActiveTool] = useState("cursor");
  const [previewMode, setPreviewMode] = useState(false);

  const config = REPORT_CONFIGS[reportType] || REPORT_CONFIGS["default"];
  const steps = config.steps;
  const activeReportTitle = REPORT_TITLES[reportType] || "Report Analysis";

  if (previewMode) {
    return (
      <div className="flex flex-col h-full absolute inset-0 bg-neutral-50 dark:bg-neutral-900 z-40">
        <div className="h-16 px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setPreviewMode(false)} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
               <h1 className="font-semibold text-neutral-900 dark:text-white">Report Preview: {activeReportTitle}</h1>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setPreviewMode(false)} className="px-4 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
               Edit
             </button>
             <button onClick={onSave} className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
               <Save className="w-4 h-4" /> Save to Patient Record
             </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-4xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-700 pb-4">
              <FileText className="w-8 h-8 text-primary-600" />
              <div>
                 <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">{activeReportTitle}</h2>
                 <p className="text-sm text-neutral-500">Patient: {patientName} • Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 flex items-center justify-center p-4">
                 <div className="relative w-full aspect-[3/4] bg-neutral-800 border border-neutral-700 rounded-lg shadow-inner flex items-center justify-center">
                    <Activity className="w-32 h-32 text-neutral-700 opacity-50" />
                    {steps.map((_, i) => (
                      <div key={i} className={`absolute w-2 h-2 bg-red-500 rounded-full border border-white`} style={{ top: `${25 + (i * 10)}%`, left: `${40 + (i % 2 === 0 ? 0 : 20)}%` }} />
                    ))}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-mono">Annotated X-Ray</p>
                    </div>
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Findings & Analysis</h3>
                 <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Measured Values</h4>
                      <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1.5 list-disc pl-4">
                        <li>C2-C3 Angle: 12.4° (Normal: &gt;10°)</li>
                        <li>C3-C4 Angle: -2.1° (Abnormal Flexion)</li>
                        <li>Overall Lordosis: 24° (Normal: 35-45°)</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Clinical Impression</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Significant reduction in cervical lordosis with apparent hypomobility at C3-C4 segments during flexion/extension views. Findings are consistent with early degenerative disc disease and biomechanical stress.
                      </p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full absolute inset-0 bg-neutral-50 dark:bg-neutral-900 z-40">
      {/* Top Header */}
      <div className="h-16 px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-semibold text-neutral-900 dark:text-white">{activeReportTitle}</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Patient: <span className="font-medium text-neutral-700 dark:text-neutral-300">{patientName}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setHasImage(false)} className="inline-flex items-center gap-2 px-3 h-9 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <RefreshCcw className="w-4 h-4" /> Reset Image
          </button>
          <button onClick={() => setPreviewMode(true)} disabled={currentStep < steps.length && hasImage} className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: DICOM Viewer */}
        <div className="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden">
          {!hasImage ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-neutral-700 m-6 rounded-2xl">
              <Upload className="w-12 h-12 text-neutral-500 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Upload DICOM Image</h3>
              <p className="text-sm text-neutral-400 max-w-md mb-6">Drag and drop your X-ray/DICOM file here, or click to browse.</p>
              <button onClick={() => setHasImage(true)} className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white rounded-lg text-sm font-medium transition-colors">
                Browse Files
              </button>
            </div>
           ) : (
             <div className="flex-1 flex items-center justify-center p-6 relative group">
               <div 
                 onClick={() => {
                   if (currentStep < steps.length) {
                     setCurrentStep((prev) => prev + 1);
                   }
                 }}
                 className="relative w-full max-w-lg aspect-[3/4] bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl flex items-center justify-center overflow-hidden cursor-crosshair hover:ring-2 hover:ring-primary-500/50 transition-all"
               >
                  <Activity className="w-32 h-32 text-neutral-700 opacity-50 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 pointer-events-none">
                    <p className="text-white text-xs font-mono">XRAY_IMAGE.DCM</p>
                  </div>
                  
                  {Array.from({ length: currentStep }).map((_, i) => (
                    <div key={i} className="absolute w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)] pointer-events-none" style={{ top: `${25 + (i * 10)}%`, left: `${40 + (i % 2 === 0 ? 0 : 20)}%` }} />
                  ))}
               </div>
             </div>
          )}
        </div>

        {/* Right Panel: Tools & Guided Checklist */}
        <div className="w-[440px] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex shrink-0">
          
          {/* Tools Toolbar Column */}
          <div className="w-16 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center py-4 gap-2 shrink-0 overflow-y-auto">
            {ALL_TOOLS.map(tool => {
              const Icon = tool.icon;
              const isSpecific = tool.type === "specific";
              const isEnabled = !isSpecific || config.tools.includes(tool.id);
              const isActive = activeTool === tool.id;

              return (
                <button
                  key={tool.id}
                  disabled={!isEnabled}
                  onClick={() => setActiveTool(tool.id)}
                  title={`${tool.label}${!isEnabled ? " (Not required for this report)" : ""}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    !isEnabled 
                      ? "opacity-30 cursor-not-allowed text-neutral-400" 
                      : isActive
                        ? "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>

          {/* Guide Column */}
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900">
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Annotation Guide</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Follow {steps.length} steps to calculate {activeReportTitle.replace("Report", "").trim()}.
              </p>
              
              <div className="mt-4">
                 <div className="flex items-center justify-between text-xs mb-1.5">
                   <span className="font-medium text-neutral-700 dark:text-neutral-300">Progress</span>
                   <span className="text-primary-600 dark:text-primary-400 font-medium">{Math.round((currentStep / steps.length) * 100)}%</span>
                 </div>
                 <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300" 
                     style={{ width: `${(currentStep / steps.length) * 100}%` }}
                   />
                 </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-6 bg-neutral-100 dark:bg-neutral-800/50 overflow-y-auto w-full">
              {!hasImage ? (
                <div className="flex-1 flex items-center justify-center text-center text-neutral-500 dark:text-neutral-400 px-4">
                   <p className="text-sm">Upload an image to view guidance.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center h-full w-full">
                  <div className="w-full p-4 mb-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm text-center">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wider mb-1">
                      {currentStep < steps.length ? `Step ${currentStep + 1} of ${steps.length}` : "Finished"}
                    </p>
                    <h3 className="text-sm font-bold text-primary-700 dark:text-primary-400 leading-snug px-2">
                      {currentStep < steps.length ? steps[currentStep] : "Annotation Complete - Ready to Generate!"}
                    </h3>
                  </div>
                  
                  <div className="relative flex-1 w-full max-w-[220px] bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-inner overflow-hidden flex items-center justify-center my-4 mx-auto shrink-0 min-h-[300px]">
                    <img src="https://placehold.co/220x500/f5f5f5/a3a3a3?text=Skeletal\nIllustration" alt="Skeleton Guide" className="w-full h-full object-cover opacity-80" />
                    {currentStep < steps.length && (
                      <>
                        <div className="absolute w-5 h-5 bg-red-500/30 rounded-full animate-ping" style={{ top: '35%', left: '50%', transform: "translate(-50%, -50%)" }} />
                        <div className="absolute w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-[0_0_12px_rgba(220,38,38,1)]" style={{ top: '35%', left: '50%', transform: "translate(-50%, -50%)" }} />
                      </>
                    )}
                    {currentStep >= steps.length && (
                      <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center">
                        <div className="bg-success-100 dark:bg-success-900/50 text-success-700 dark:text-success-400 p-4 rounded-full shadow-lg">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full mt-auto flex items-center gap-2 pt-4">
                    <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="px-3 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors disabled:opacity-50 shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))} disabled={currentStep >= steps.length} className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm">
                      {currentStep < steps.length ? "Simulate Mark Point" : "Completed"}
                      {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
