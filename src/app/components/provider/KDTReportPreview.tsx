import { Printer, Download, X } from "lucide-react";
import { KDTReport } from "./KDTReportBuilder";

interface KDTReportPreviewProps {
  report: KDTReport;
  onClose: () => void;
}

export function KDTReportPreview({ report, onClose }: KDTReportPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto my-10 animate-in fade-in zoom-in duration-300">
      {/* Header Buttons (Non-printing) */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800 print:hidden">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button 
             onClick={() => {
               const content = JSON.stringify(report, null, 2);
               const blob = new Blob([content], { type: 'application/json' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = `KDT_Report_${report.patientName.replace(' ', '_')}.json`;
               a.click();
             }}
             className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Download Data
          </button>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full transition-colors">
          <X className="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-white text-neutral-900 print:p-0 print:overflow-visible">
        <div id="kdt-report-print-area">
          {/* Top Branding Section */}
          <div className="flex justify-between items-start border-b-2 border-primary-600 pb-8 mb-10">
            <div>
              <h1 className="text-3xl font-black text-primary-900 tracking-tight leading-none mb-2 underline decoration-primary-300 decoration-4 underline-offset-4">KDT DECOMPRESSION</h1>
              <h2 className="text-xl font-bold text-neutral-400 tracking-widest uppercase">Clinical Assessment Report</h2>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-neutral-900 tracking-tighter">SpineCloudIQ</div>
              <div className="text-xs font-bold text-primary-600 tracking-widest uppercase">Certified Clinical System</div>
            </div>
          </div>

          {/* Patient Detail Bar */}
          <div className="grid grid-cols-3 gap-8 bg-neutral-50 p-6 rounded-2xl mb-10 border border-neutral-100">
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest block mb-1">Patient Name</span>
              <span className="text-lg font-bold text-neutral-900">{report.patientName}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest block mb-1">Protocol Type</span>
              <span className="text-lg font-bold text-primary-700">{report.protocolType.toUpperCase()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest block mb-1">Date Compiled</span>
              <span className="text-lg font-bold text-neutral-900">{new Date(report.dateCreated).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-10">
            {/* Left Column: Assessment */}
            <div className="col-span-12 lg:col-span-7 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Clinical Assessment</h3>
                </div>
                <div className="p-6 border-2 border-neutral-100 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-50 pb-4">
                    <span className="text-neutral-500 font-medium">Primary Condition:</span>
                    <span className="font-black text-neutral-900 text-lg">{report.selectedCondition}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Category:</span>
                    <span className="font-black text-primary-600 uppercase tracking-widest text-sm">{report.conditionCategory}</span>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Clinical Justification</h3>
                </div>
                <div className="p-8 border-2 border-primary-50 rounded-3xl bg-primary-50/20 italic text-neutral-700 leading-loose text-lg">
                  "{report.clinicalJustification}"
                </div>
              </section>
            </div>

            {/* Right Column: Protocol */}
            <div className="col-span-12 lg:col-span-5 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Setup & Metrics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-neutral-900 text-white rounded-2xl flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Pull Force</span>
                    <span className="text-3xl font-black">{report.pullWeight} <span className="text-xs font-bold text-primary-400">lbs</span></span>
                  </div>
                  <div className="p-5 bg-neutral-100 text-neutral-900 rounded-2xl flex flex-col items-center border border-neutral-200">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Angulation</span>
                    <span className="text-3xl font-black">{report.angulation}&deg;</span>
                  </div>
                </div>

                <div className="p-6 border-2 border-neutral-100 rounded-3xl relative overflow-hidden">
                   <div className="absolute top-4 left-4 text-[9px] font-black uppercase tracking-widest text-neutral-400">Setup Configuration</div>
                   <svg viewBox="0 0 320 160" className="w-full">
                    <rect x="30" y="82" width="260" height="10" rx="3" fill="#cbd5e1" />
                    <rect x="58" y="92" width="8" height="28" fill="#cbd5e1" />
                    <rect x="254" y="92" width="8" height="28" fill="#cbd5e1" />
                    <circle cx="80" cy="72" r="10" fill="none" stroke="#64748b" strokeWidth="2" />
                    <line x1="80" y1="82" x2="240" y2="80" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <line x1="240" y1="80" x2="260" y2="95" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                    <rect x="152" y="75" width="26" height="8" rx="3" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="3,2" />
                    <ellipse cx="235" cy="82" rx="14" ry="8" fill="none" stroke="#10b981" strokeWidth="2" />
                    <path d="M200 92 A16 16 0 0 0 216 80" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <text x="200" y="110" fill="#f59e0b" fontSize="10" fontWeight="bold">{report.angulation}&deg;</text>
                    <text x="160" y="148" textAnchor="middle" fill="#64748b" fontSize="9">{report.treatmentSetup.setupTitle} &#8212; {report.treatmentSetup.position} Pos</text>
                  </svg>
                </div>
              </section>

              <section>
                 <div className="flex items-center gap-3 mb-4">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Treatment Plan</h3>
                </div>
                <div className="p-6 border-2 border-neutral-100 rounded-2xl bg-neutral-50/30">
                  <ul className="space-y-4">
                     <li className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Initial Traction: {report.pullWeight} lbs
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Phase Target: {report.targetWeight} lbs
                     </li>
                     <li className="flex items-center gap-3 text-sm font-bold text-neutral-700">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        Treatment Duration: 10 Minutes
                     </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>

          {/* Footer Fine Print */}
          <div className="mt-20 pt-10 border-t border-neutral-200 grid grid-cols-2 gap-10">
            <div>
               <div className="h-20 w-48 border-b-2 border-neutral-900 mb-2"></div>
               <span className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.3em]">Attending Physician</span>
            </div>
            <div className="text-xs text-neutral-400 text-justify leading-relaxed">
              This clinical decompression report serves as a formal assessment of the patient's biomechanical limit and therapeutic response. The established parameters are based on the KDT decompression protocols for neural centralization and discogenic relief.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
