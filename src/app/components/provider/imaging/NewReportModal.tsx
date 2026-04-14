import React from "react";
import { X, Activity, Image as ImageIcon, Accessibility, Scaling, Bone, Focus, LocateFixed, Move3d, Network, ScanLine, ScanFace, User } from "lucide-react";

export type ReportType = 
  | "cervical-drma" 
  | "lumbar-flexion" 
  | "apom" 
  | "structural" 
  | "posture" 
  | "cervical-lateral" 
  | "lumbar-lateral" 
  | "thoracic" 
  | "nasium" 
  | "vertex" 
  | "pelvic" 
  | "scoliosis";

interface NewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ReportType) => void;
}

const REPORT_OPTIONS = [
  { id: "cervical-drma" as ReportType, title: "Cervical Flexion/Extension DRMA", description: "Analyze ligament laxity and calculate C1-C7 angles based on dynamic x-rays.", icon: Activity },
  { id: "structural" as ReportType, title: "Structural Integrity Report", description: "Measure overall spinal health combining posture and AP/lateral parameters.", icon: Scaling },
  { id: "apom" as ReportType, title: "APOM (Anterior-Posterior Open Mouth)", description: "Measure shift and lateral tilt of the top two cervical vertebrae.", icon: ScanFace },
  { id: "lumbar-flexion" as ReportType, title: "Lumbar Flexion DRMA", description: "Analyze lower spine mobility and ligament integrity over five levels.", icon: Accessibility },
  { id: "posture" as ReportType, title: "Posture Analysis", description: "Assess full-body alignment and postural deviations from the plumb line.", icon: User },
  { id: "cervical-lateral" as ReportType, title: "Cervical Lateral Analysis", description: "Evaluate cervical lordosis and anterior head weight.", icon: Bone },
  { id: "lumbar-lateral" as ReportType, title: "Lumbar Lateral Analysis", description: "Evaluate lumbar lordosis and sacral base angle.", icon: Move3d },
  { id: "thoracic" as ReportType, title: "Thoracic AP/Lateral", description: "Assess thoracic kyphosis and screen for scoliosis.", icon: Network },
  { id: "nasium" as ReportType, title: "Nasium Analysis", description: "Upper cervical specific analysis for atlas laterality.", icon: LocateFixed },
  { id: "vertex" as ReportType, title: "Vertex Analysis", description: "Measure atlas rotation from the vertex view.", icon: Focus },
  { id: "pelvic" as ReportType, title: "Pelvic AP Analysis", description: "Evaluate pelvic unleveling, femur head heights, and ilium rotation.", icon: ScanLine },
  { id: "scoliosis" as ReportType, title: "Scoliosis Cobb Angle", description: "Measure Cobb angles to quantify scoliosis curvature.", icon: ImageIcon },
];

export function NewReportModal({ isOpen, onClose, onSelect }: NewReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Create New Report</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Select a diagnostic report or analysis to perform.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  className="flex flex-col items-start p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md hover:ring-2 hover:ring-primary-500/20 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">{option.title}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
