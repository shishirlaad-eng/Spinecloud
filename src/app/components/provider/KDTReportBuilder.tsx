import { useState, useEffect } from "react";
import { ArrowLeft, Save, Printer, User, Activity, Edit3, X, ChevronRight, ChevronLeft, FileText } from "lucide-react";

export interface KDTReport {
  id: string;
  patientId: string;
  patientName: string;
  protocolType: 'Cervical' | 'Lumbar';
  selectedCondition: string;
  conditionCategory: string;
  dateCreated: string;
  patientWeight: number;
  pullWeight: number;
  targetWeight: number;
  angulation: number;
  duration: number;
  status: 'Active' | 'Completed';
  clinicalJustification: string;
  treatmentSetup: {
    position: string;
    angle: number;
    setupTitle: string;
  };
  patientEmail?: string;
  branch?: string;
  providerName?: string;
}

interface KDTReportBuilderProps {
  patientId: string;
  patientName: string;
  existingReportId?: string | null;
  isReadOnly?: boolean;
  onSave: (report: KDTReport) => void;
  onCancel: () => void;
}

interface ConditionCard {
  id: string;
  category: string;
  movement: string;
  borderColor: "green" | "yellow" | "red";
  justificationTemplate: string;
  setup: {
    title: string;
    position: string;
    angle: number;
  };
}

const CATEGORIES = ["Flexion", "Extension", "Frontal Plane", "Supine Relief", "Prone Relief"];

const CONDITIONS: Record<'Cervical' | 'Lumbar', ConditionCard[]> = {
  Lumbar: [
    { id: "l-f-1", category: "Flexion", movement: "Pain w/ Flexion", borderColor: "red", justificationTemplate: "{patientName} presented with acute lumbar pain exacerbated by flexion. Decompression was applied at {angle}° to target posterior disc spacing.", setup: { title: "Supine Flexion", position: "Supine", angle: 25 } },
    { id: "l-f-2", category: "Flexion", movement: "Disc Compression", borderColor: "yellow", justificationTemplate: "Signs of disc compression noted. {pullWeight} lbs of distraction applied.", setup: { title: "Supine Flexion", position: "Supine", angle: 20 } },
    { id: "l-f-3", category: "Flexion", movement: "Flexion Relief", borderColor: "green", justificationTemplate: "Patient reports relief in flexion position. Targeted decompression initiated.", setup: { title: "Supine Flexion", position: "Supine", angle: 30 } },
    { id: "l-f-4", category: "Flexion", movement: "Flexion Bias", borderColor: "green", justificationTemplate: "Flexion bias protocol utilized for neural relief.", setup: { title: "Prone Flexion", position: "Prone", angle: 15 } },
    { id: "l-f-5", category: "Flexion", movement: "Severe Stenosis", borderColor: "red", justificationTemplate: "Severe stenosis indicated. Flexion-based distraction targeted.", setup: { title: "Supine Flexion", position: "Supine", angle: 35 } },
    
    { id: "l-e-1", category: "Extension", movement: "Facet Loading", borderColor: "yellow", justificationTemplate: "Pain with extension indicates facet loading. Adjusted force.", setup: { title: "Prone Neutral", position: "Prone", angle: 5 } },
    { id: "l-e-2", category: "Extension", movement: "Pain w/ Extension", borderColor: "red", justificationTemplate: "Extension provocation noted. Minimized angulation.", setup: { title: "Prone", position: "Prone", angle: 0 } },
    { id: "l-e-3", category: "Extension", movement: "Extension Relief", borderColor: "green", justificationTemplate: "Extension relief protocol utilized for anterior bulge.", setup: { title: "Prone Extension", position: "Prone", angle: 10 } },
    { id: "l-e-4", category: "Extension", movement: "Extension Bias", borderColor: "green", justificationTemplate: "Extension bias therapy focused on lordotic restoration.", setup: { title: "Supine Extension", position: "Supine", angle: -10 } },
    { id: "l-e-5", category: "Extension", movement: "Severe Lordosis", borderColor: "yellow", justificationTemplate: "Addressing hyper-lordosis with extension limits.", setup: { title: "Prone Neutral", position: "Prone", angle: 5 } },
    
    { id: "l-fp-1", category: "Frontal Plane", movement: "Lateral Shift", borderColor: "red", justificationTemplate: "Significant lateral shift addressed with side-lying decompression.", setup: { title: "Side Lying", position: "Side", angle: 0 } },
    { id: "l-fp-2", category: "Frontal Plane", movement: "Sciatica (L)", borderColor: "yellow", justificationTemplate: "Left-sided radiculopathy targeted with lateral bias.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "l-fp-3", category: "Frontal Plane", movement: "Sciatica (R)", borderColor: "yellow", justificationTemplate: "Right-sided radiculopathy targeted with lateral bias.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "l-fp-4", category: "Frontal Plane", movement: "Lateral Antalgia", borderColor: "red", justificationTemplate: "Antalgic lean corrected through axial distraction.", setup: { title: "Side Lying", position: "Side", angle: 0 } },
    { id: "l-fp-5", category: "Frontal Plane", movement: "Sidebent L5", borderColor: "yellow", justificationTemplate: "Targeted correction of L5 lateral listing.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },

    { id: "l-sr-1", category: "Supine Relief", movement: "Neural Relief", borderColor: "green", justificationTemplate: "Supine neutral provides maximal neural canal opening.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "l-sr-2", category: "Supine Relief", movement: "Acute Load", borderColor: "yellow", justificationTemplate: "Acute load management in supine status.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "l-sr-3", category: "Supine Relief", movement: "Disc Bulge", borderColor: "green", justificationTemplate: "Posterior disc bulge addressed in supine neutral.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "l-sr-4", category: "Supine Relief", movement: "Spondylolisthesis", borderColor: "red", justificationTemplate: "Grade 1 spondy managed with supine flexion bias.", setup: { title: "Supine Flexion", position: "Supine", angle: 10 } },
    { id: "l-sr-5", category: "Supine Relief", movement: "Radiculopathy", borderColor: "yellow", justificationTemplate: "Radicular signs centralized in supine position.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },

    { id: "l-pr-1", category: "Prone Relief", movement: "Prone Relief", borderColor: "green", justificationTemplate: "Prone neutral for anterior disc centralization.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "l-pr-2", category: "Prone Relief", movement: "Prone Pain", borderColor: "red", justificationTemplate: "Pain in prone. Adjusted to supine relief.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "l-pr-3", category: "Prone Relief", movement: "Prone Extension", borderColor: "green", justificationTemplate: "Prone extension used for flexion-provoked pain.", setup: { title: "Prone Extension", position: "Prone", angle: 10 } },
    { id: "l-pr-4", category: "Prone Relief", movement: "Foraminal Load", borderColor: "yellow", justificationTemplate: "Addressing foraminal encroachment in prone.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "l-pr-5", category: "Prone Relief", movement: "Facet Syndrome", borderColor: "red", justificationTemplate: "Prone used to minimize facet weight bearing.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
  ],
  Cervical: [
    { id: "c-f-1", category: "Flexion", movement: "Pain w/ Flexion", borderColor: "red", justificationTemplate: "Cervical pain with flexion noted. {pullWeight} lbs applied.", setup: { title: "Supine Flexion", position: "Supine", angle: 25 } },
    { id: "c-f-2", category: "Flexion", movement: "Cervical Relief", borderColor: "green", justificationTemplate: "Cervical relief in flexion.", setup: { title: "Supine Flexion", position: "Supine", angle: 20 } },
    { id: "c-f-3", category: "Flexion", movement: "Radiculopathy", borderColor: "yellow", justificationTemplate: "Cervical radiculopathy targeted.", setup: { title: "Supine Flexion", position: "Supine", angle: 25 } },
    { id: "c-f-4", category: "Flexion", movement: "Disc Bulge", borderColor: "green", justificationTemplate: "Cervical disc bulge management.", setup: { title: "Supine Flexion", position: "Supine", angle: 15 } },
    { id: "c-f-5", category: "Flexion", movement: "Severe Pain", borderColor: "red", justificationTemplate: "Acute cervical pain protocol.", setup: { title: "Supine Flexion", position: "Supine", angle: 25 } },
    
    { id: "c-e-1", category: "Extension", movement: "Extension Pain", borderColor: "red", justificationTemplate: "Pain with cervical extension.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-e-2", category: "Extension", movement: "Extension Relief", borderColor: "green", justificationTemplate: "Relief obtained in extension.", setup: { title: "Supine Extension", position: "Supine", angle: -5 } },
    { id: "c-e-3", category: "Extension", movement: "Lordotic Loss", borderColor: "yellow", justificationTemplate: "Restoring cervical curve.", setup: { title: "Supine Extension", position: "Supine", angle: -10 } },
    { id: "c-e-4", category: "Extension", movement: "Kyphosis", borderColor: "red", justificationTemplate: "Addressing cervical kyphosis.", setup: { title: "Supine Extension", position: "Supine", angle: -15 } },
    { id: "c-e-5", category: "Extension", movement: "Facet Syndrome", borderColor: "yellow", justificationTemplate: "Cervical facet syndrome targeted.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },

    { id: "c-fp-1", category: "Frontal Plane", movement: "Wry Neck", borderColor: "red", justificationTemplate: "Wry neck / Torticollis protocol.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-fp-2", category: "Frontal Plane", movement: "Lateral Pain", borderColor: "yellow", justificationTemplate: "Lateral cervical pain addressed.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-fp-3", category: "Frontal Plane", movement: "Sidebend Shift", borderColor: "yellow", justificationTemplate: "Correcting cervical lateral deviation.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-fp-4", category: "Frontal Plane", movement: "Shoulder Pain", borderColor: "green", justificationTemplate: "Secondary shoulder pain of cervical origin.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-fp-5", category: "Frontal Plane", movement: "Nerve Trap", borderColor: "red", justificationTemplate: "Addressing cervical nerve entrapment.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },

    { id: "c-sr-1", category: "Supine Relief", movement: "Headache", borderColor: "green", justificationTemplate: "Tension headache protocol.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-sr-2", category: "Supine Relief", movement: "Migraine", borderColor: "yellow", justificationTemplate: "Migraine management via decompression.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-sr-3", category: "Supine Relief", movement: "Neuralgia", borderColor: "green", justificationTemplate: "Occipital neuralgia relief.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-sr-4", category: "Supine Relief", movement: "Vertigo", borderColor: "red", justificationTemplate: "Cervicogenic vertigo management.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },
    { id: "c-sr-5", category: "Supine Relief", movement: "Tinnitus", borderColor: "yellow", justificationTemplate: "Tinnitus secondary to cervical load.", setup: { title: "Supine Neutral", position: "Supine", angle: 0 } },

    { id: "c-pr-1", category: "Prone Relief", movement: "Prone Neutral", borderColor: "green", justificationTemplate: "Alternative prone positioning.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "c-pr-2", category: "Prone Relief", movement: "Prone Pain", borderColor: "red", justificationTemplate: "Pain reported in prone.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "c-pr-3", category: "Prone Relief", movement: "Upper Thoracic", borderColor: "yellow", justificationTemplate: "Transition zone therapy.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "c-pr-4", category: "Prone Relief", movement: "Anterior Bulge", borderColor: "green", justificationTemplate: "Addressing anterior cervical bulge.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
    { id: "c-pr-5", category: "Prone Relief", movement: "Neuralgia", borderColor: "red", justificationTemplate: "Brachial neuralgia managed.", setup: { title: "Prone Neutral", position: "Prone", angle: 0 } },
  ]
};

export const KDTReportBuilder = ({ patientId, patientName, existingReportId, isReadOnly, onSave, onCancel }: KDTReportBuilderProps) => {
  const [protocolType, setProtocolType] = useState<'Lumbar' | 'Cervical'>('Lumbar');
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const [patientWeight, setPatientWeight] = useState<number>(0);
  const [pullWeight, setPullWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [angulation, setAngulation] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [clinicalJustification, setClinicalJustification] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const selectedCondition = CONDITIONS[protocolType].find(c => c.id === selectedConditionId);

  // Automatic Calculation Logic
  useEffect(() => {
    if (patientWeight > 0) {
      if (protocolType === 'Lumbar') {
        const pull = Math.round(patientWeight * 0.3);
        setPullWeight(pull);
        setTargetWeight(pull + 10);
      } else {
        const pull = Math.round(patientWeight * 0.1);
        setPullWeight(pull);
        setTargetWeight(pull + 5);
      }
    } else {
      setPullWeight(0);
      setTargetWeight(0);
    }
  }, [patientWeight, protocolType]);

  useEffect(() => {
    if (selectedCondition) {
      setAngulation(selectedCondition.setup.angle);
      setClinicalJustification(selectedCondition.justificationTemplate
        .replace("{patientName}", patientName)
        .replace("{angle}", selectedCondition.setup.angle.toString())
        .replace("{pullWeight}", pullWeight.toString())
      );
    }
  }, [selectedConditionId, pullWeight]);

  const handleGenerateReport = () => {
    if (!selectedCondition) return;
    
    const report: KDTReport = {
      id: existingReportId || `kdt-${Date.now()}`,
      patientId,
      patientName,
      protocolType,
      selectedCondition: selectedCondition.movement,
      conditionCategory: selectedCondition.category,
      dateCreated: new Date().toISOString(),
      patientWeight,
      pullWeight,
      targetWeight,
      angulation,
      duration,
      status: 'Active',
      clinicalJustification,
      treatmentSetup: {
        position: selectedCondition.setup.position,
        angle: angulation,
        setupTitle: selectedCondition.setup.title
      },
      patientEmail: "patient@example.com", // Fallback
      branch: "Main Branch", // Fallback
      providerName: "Dr. David Bohn", // Fallback
    };
    
    onSave(report);
  };
  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950 font-inter overflow-hidden">
      {/* Header */}
      <div className="h-16 px-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight">KDT Report Builder</h1>
            <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest">Clinical Decompression Assessment • {patientName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
           {(['Lumbar', 'Cervical'] as const).map(type => (
             <button
               key={type}
               onClick={() => { setProtocolType(type); setSelectedConditionId(null); }}
               className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${protocolType === type ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-neutral-500'}`}
             >
               {type}
             </button>
           ))}
        </div>
      </div>

      {/* Main Workspace: Side-by-Side */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6">
        
        {/* Left: 5x5 Assessment Grid (approx 35% width) */}
        <div className="w-[400px] flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden shrink-0">
          <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-tight italic">Condition Matrix</h3>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase">{protocolType}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
              {CATEGORIES.map(category => (
                <div key={category} className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{category}</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {CONDITIONS[protocolType].filter(c => c.category === category).map(condition => (
                      <button
                        key={condition.id}
                        onClick={() => setSelectedConditionId(condition.id)}
                        className={`group relative flex items-center gap-3 p-2.5 rounded-xl border-l-4 transition-all hover:translate-x-1 ${
                          selectedConditionId === condition.id 
                            ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-200 shadow-sm' 
                            : 'bg-neutral-50/50 border-neutral-200 hover:bg-white hover:border-neutral-300'
                        }`}
                        style={{ borderLeftColor: selectedConditionId === condition.id ? '' : condition.borderColor === 'red' ? '#ef4444' : condition.borderColor === 'yellow' ? '#f59e0b' : '#10b981' }}
                      >
                        <span className={`text-xs font-bold ${selectedConditionId === condition.id ? 'text-primary-700' : 'text-neutral-600'}`}>{condition.movement}</span>
                        {selectedConditionId === condition.id && <ChevronRight className="w-3.5 h-3.5 text-primary-600 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Metrics, Wizard, and Justification (65% width) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          
          {/* Top: Auto-Calculations and Weight */}
          <div className="grid grid-cols-12 gap-6 shrink-0">
             <div className="col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-4">Patient Metric</label>
                <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 ring-2 ring-transparent focus-within:ring-primary-500 transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-lg shadow-primary-600/20">WT</div>
                  <div className="flex-1">
                    <input 
                      type="number" 
                      placeholder="00" 
                      value={patientWeight || ""} 
                      onChange={(e) => setPatientWeight(Number(e.target.value))}
                      className="w-full text-2xl font-black bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-300"
                    />
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-1">Weight in Lbs</div>
                  </div>
                </div>
             </div>

             <div className="col-span-8 bg-neutral-900 dark:bg-neutral-800 rounded-2xl p-6 shadow-xl flex items-center justify-around relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-emerald-500"></div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Calculated Pull</p>
                   <div className="text-4xl font-black text-white leading-none">
                      {pullWeight} <span className="text-xs text-primary-400 font-bold">LBS</span>
                   </div>
                </div>
                <div className="w-px h-10 bg-neutral-700"></div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Treatment Target</p>
                   <div className="text-4xl font-black text-white leading-none">
                      {targetWeight} <span className="text-xs text-emerald-400 font-bold">LBS</span>
                   </div>
                </div>
                <div className="w-px h-10 bg-neutral-700"></div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Angulation</p>
                   <div className="text-4xl font-black text-white leading-none">
                      {angulation}&deg;
                   </div>
                </div>
             </div>
          </div>

          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Setup Wizard (Visual) */}
            <div className="w-[320px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col shrink-0">
               <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20">
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Setup Wizard
                  </h3>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                  <div className="absolute top-4 left-4 flex flex-col gap-1">
                     <span className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">{selectedCondition?.setup.position} Position</span>
                     <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest italic">{selectedCondition?.setup.title}</span>
                  </div>
                  <svg viewBox="0 0 320 160" className="w-full h-auto">
                    <rect x="30" y="82" width="260" height="10" rx="3" fill="#cbd5e1" className="dark:fill-neutral-700" />
                    <rect x="58" y="92" width="8" height="28" fill="#cbd5e1" className="dark:fill-neutral-700" />
                    <rect x="254" y="92" width="8" height="28" fill="#cbd5e1" className="dark:fill-neutral-700" />
                    <circle cx="80" cy="72" r="10" fill="none" stroke="#64748b" strokeWidth="2" />
                    <line x1="80" y1="82" x2="240" y2="80" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="240" y1="80" x2="260" y2="95" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <rect x="152" y="75" width="26" height="8" rx="3" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3,2" />
                    <ellipse cx="235" cy="82" rx="14" ry="8" fill="none" stroke="#10b981" strokeWidth="2" />
                    <path d="M200 92 A16 16 0 0 0 216 80" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <text x="200" y="110" fill="#f59e0b" fontSize="10" fontWeight="bold">{angulation}&deg;</text>
                  </svg>
                  <p className="mt-8 text-[10px] text-neutral-400 font-bold text-center px-4 leading-relaxed tracking-tight">Anatomical guidance adjusts based on selected condition and weight-force biomechanics.</p>
               </div>
            </div>

            {/* Justification & Protocol */}
            <div className="flex-1 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
               <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/20">
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600" />
                    Clinical Justification
                  </h3>
                  <button 
                    onClick={() => setIsEditable(!isEditable)}
                    className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    {isEditable ? <Save className="w-3.5 h-3.5 text-primary-600" /> : <Edit3 className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{isEditable ? 'Finish' : 'Edit'}</span>
                  </button>
               </div>
               <div className="flex-1 p-6 flex flex-col gap-6">
                  <textarea
                    value={clinicalJustification}
                    onChange={(e) => setClinicalJustification(e.target.value)}
                    readOnly={!isEditable}
                    placeholder="Clinical justification will be generated automatically based on your condition selection and weight..."
                    className={`w-full flex-1 text-sm leading-loose outline-none bg-transparent resize-none border-0 focus:ring-0 ${isEditable ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 font-medium italic'}`}
                  />
                  
                  <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-4 shrink-0">
                     <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Duration</span>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">10:00 Minutes</p>
                     </div>
                     <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Decompression Mode</span>
                        <p className="text-xs font-bold text-neutral-900 dark:text-white">Static / Axial distraction</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-8 py-5 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all">
          Discard Draft
        </button>
        <button 
          onClick={handleGenerateReport}
          disabled={!selectedConditionId || patientWeight <= 0}
          className={`group px-10 py-3 rounded-2xl text-sm font-bold shadow-xl transition-all active:scale-95 flex items-center gap-3 ${selectedConditionId && patientWeight > 0 ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/30' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
        >
          <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Generate Final Report
        </button>
      </div>
    </div>

  );
};
