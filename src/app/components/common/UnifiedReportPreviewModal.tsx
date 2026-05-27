import { Printer, Download, X, Link2 } from "lucide-react";
import { KDTReportPreview } from "../provider/KDTReportPreview";
import { DicomReportPreview } from "./DicomReportPreview";
import type { LinkedCodeGroup } from "../provider/CumulativeICDCPTCodesSection";
import { SpiderChart, getScoreCategory } from "../shared/SpineCloudResultsView";

export interface SOAPNoteReportData {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  linkedCodeGroups?: LinkedCodeGroup[];
  finalizedAt?: string;
  finalizedBy?: string;
  status: string;
}

interface UnifiedReportPreviewModalProps {
  type: string;
  data: any;
  patientName: string;
  onClose: () => void;
  onSave?: () => void;
}

export function UnifiedReportPreviewModal({ type, data, patientName, onClose, onSave }: UnifiedReportPreviewModalProps) {
  if (type === "kdt") return <KDTReportPreview report={data} onClose={onClose} />;
  if (type === "dicom") return (
    <DicomReportPreview
      data={data}
      patientName={patientName}
      onClose={onClose}
      onSave={onSave}
    />
  );

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_Report_${patientName.replace(/ /g, "_")}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl relative flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-neutral-100 dark:border-neutral-800 print:hidden sticky top-0 bg-white dark:bg-neutral-900 z-10">
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Report Body */}
      <div className="flex-1 p-8 print:p-0">
        {/* Report Header */}
        <div className="border-b-4 border-primary-600 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
              {type === "soapNote"
                ? "SOAP Clinical Note"
                : type.replace(/([A-Z])/g, " $1").toUpperCase()}
            </h1>
            <p className="text-neutral-500 font-bold tracking-widest uppercase text-xs mt-1">
              Official SpineCloudIQ Clinical Record
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-neutral-900 dark:text-white">SpineCloudIQ</p>
            <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
              Medical Documentation
            </p>
          </div>
        </div>

        {/* Patient Meta */}
        <div className="grid grid-cols-2 gap-8 mb-10 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700">
          <div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Patient</span>
            <p className="font-bold text-neutral-900 dark:text-white">{patientName}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
              {type === "soapNote" && data?.finalizedAt ? "Finalized On" : "Date Generated"}
            </span>
            <p className="font-bold text-neutral-900 dark:text-white">
              {type === "soapNote" && data?.finalizedAt
                ? new Date(data.finalizedAt).toLocaleDateString()
                : new Date().toLocaleDateString()}
            </p>
          </div>
          {type === "soapNote" && data?.finalizedBy && (
            <div>
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Attending Provider</span>
              <p className="font-bold text-neutral-900 dark:text-white">{data.finalizedBy}</p>
            </div>
          )}
        </div>

        {/* SOAP Note Report */}
        {type === "soapNote" && data && (
          <div className="space-y-8">
            {/* SOAP Sections */}
            {(["subjective", "objective", "assessment", "plan"] as const).map((section) => (
              <section key={section} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary-700 dark:text-primary-400">
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </h3>
                </div>
                <div className="p-5 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/30 text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {data[section] || <span className="italic text-neutral-400">Not documented.</span>}
                </div>
              </section>
            ))}

            {/* ICD-CPT Code Linkages */}
            {data.linkedCodeGroups && data.linkedCodeGroups.length > 0 && (
              <section className="space-y-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-400">
                    ICD–CPT Code Linkages
                  </h3>
                </div>
                <div className="space-y-3">
                  {data.linkedCodeGroups.map((group: LinkedCodeGroup, idx: number) => (
                    <div
                      key={group.id}
                      className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800/30"
                    >
                      <div className="md:w-1/2 space-y-2">
                        {group.icdCodes.map((icd) => (
                          <div key={icd.code} className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">ICD</span>
                            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">{icd.code}</span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{icd.description}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <Link2 className="w-4 h-4 text-primary-500" />
                      </div>
                      <div className="md:w-1/2 space-y-2">
                        {group.cptCodes.map((cpt) => (
                          <div key={cpt.code} className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <span className="text-[10px] font-black bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded">CPT</span>
                            <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">{cpt.code}</span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">{cpt.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Signature Block */}
            <div className="pt-10 mt-6 border-t border-neutral-200 dark:border-neutral-700 grid grid-cols-2 gap-10">
              <div>
                <div className="h-16 border-b border-neutral-400 mb-2 flex items-end justify-center pb-1">
                  {data.finalizedBy && (
                    <span className="font-serif italic text-lg text-primary-700 dark:text-primary-400">
                      {data.finalizedBy}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Provider Signature
                </span>
              </div>
              <div>
                <div className="h-16 border-b border-neutral-400 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Patient Acknowledgment
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Care Plan Report */}
        {type === "carePlan" && data && (
          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-600">Recommended Action Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Treatment Base</span>
                  <p className="text-sm font-medium mt-1">{data.basedOn?.join(", ") || "Clinical Assessment"}</p>
                </div>
                <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Action Protocol</span>
                  <p className="text-sm font-medium mt-1">{data.actionPlan?.join(", ") || "Standard Corrective Care"}</p>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-600">Treatment Schedule</h3>
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left">Frequency</th>
                      <th className="px-4 py-3 text-left">Duration</th>
                      <th className="px-4 py-3 text-right">Visits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {data.scheduleRows?.map((row: any) => (
                      <tr key={row.id}>
                        <td className="px-4 py-3">{row.timesPerWeek}x per week</td>
                        <td className="px-4 py-3">{row.durationWeeks} weeks</td>
                        <td className="px-4 py-3 text-right font-bold">{row.timesPerWeek * row.durationWeeks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary-600">Additional Recommendations</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/30">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Nutritional Supplements</span>
                  <p className="text-sm font-medium mt-1">{data.nutritionalSupplements || "None specified"}</p>
                </div>
                <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/30">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Patient Responsibility</span>
                  <p className="text-sm font-medium mt-1">{data.patientResponsibility || "Standard protocols"}</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Financial Plan Report */}
        {type === "financialPlan" && data && (
          <div className="space-y-10">
            <div className="flex justify-between items-center p-8 bg-neutral-900 text-white rounded-3xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Investment</span>
                <h2 className="text-4xl font-black">${data.totalInvestment?.toLocaleString()}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Payment Option</span>
                <h2 className="text-xl font-bold uppercase tracking-tight">{data.selectedPaymentMode?.replace("-", " ")}</h2>
              </div>
            </div>
            <div className="p-6 border border-neutral-100 dark:border-neutral-800 rounded-xl">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-3">Payment Terms</h4>
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                {data.selectedPaymentMode === "one-time"
                  ? `One-time payment with ${data.discountPercentage}% discount`
                  : data.selectedPaymentMode === "monthly"
                  ? `$${(data.totalInvestment / data.monthlyMonths).toFixed(2)} monthly for ${data.monthlyMonths} months`
                  : `Financing over ${data.financingMonths} months`}
              </p>
              {data.splitDetails && (
                <div className="mt-4 p-4 bg-amber-50/30 border border-amber-100 rounded-lg text-sm italic text-neutral-700">
                  {data.splitDetails}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Structural Integrity Report */}
        {type === "structuralIntegrity" && data && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden relative group border-2 border-neutral-200 dark:border-neutral-700">
                <img src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-80" alt="Front Profile" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <span className="text-white font-bold text-sm">Front Profile Analysis</span>
                </div>
              </div>
              <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden relative group border-2 border-neutral-200 dark:border-neutral-700">
                <img src="https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-80" alt="Side Profile" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <span className="text-white font-bold text-sm">Side Profile Analysis</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {data.findings && Object.entries(data.findings).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">{key}</span>
                  <span className="text-lg font-black text-primary-600">{value}</span>
                </div>
              ))}
            </div>

            <div className="p-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-2xl">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary-600 mb-2">Clinical Assessment</h4>
              <p className="text-sm text-primary-900 dark:text-primary-100 italic font-medium leading-relaxed">
                {data?.notes || "No additional notes provided."}
              </p>
            </div>
          </div>
        )}

        {/* SpineCloud Wellness Report */}
        {type === "spineCloud" && data && (
          <div className="space-y-10">
            {/* Wellness Score Card */}
            <div className={`p-10 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center ${getScoreCategory(data.score).bgColor.replace('bg-', 'bg-opacity-10 bg-')}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-4">SpineCloud Wellness Index</span>
              <div className="relative">
                <div className={`text-8xl font-black ${getScoreCategory(data.score).color}`}>
                  {data.score || 0}
                </div>
                <div className="absolute -top-2 -right-8 text-2xl font-bold text-neutral-400 opacity-50">/100</div>
              </div>
              <h3 className={`text-2xl font-black mt-4 uppercase tracking-tight ${getScoreCategory(data.score).color}`}>
                {getScoreCategory(data.score).label}
              </h3>
              <p className="text-sm font-medium text-neutral-500 mt-2 max-w-md">
                {getScoreCategory(data.score).description}
              </p>
            </div>

            {/* Functional Domain Analysis (Spider Graph) */}
            <div className="bg-white dark:bg-neutral-800 border-2 border-neutral-100 dark:border-neutral-700 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 dark:text-white">Functional Domain Analysis</h3>
              </div>
              <div className="max-w-md mx-auto aspect-square">
                <SpiderChart 
                  categoryScores={data.categoryScores || data.metrics || {}} 
                  previousScores={data.previousCategoryScores}
                />
              </div>
              <div className="mt-8 flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Current Assessment</span>
                </div>
                {data.previousCategoryScores && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Previous Baseline</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl bg-neutral-50/30">
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">Provider Recommendations & Clinical Notes</h4>
              <p className="text-lg text-neutral-800 dark:text-neutral-200 font-medium leading-relaxed italic">
                "{data.recommendations || "Based on the functional domain analysis, the patient is responding well to corrective care. Continued adherence to the prescribed protocol is recommended to maintain optimal vitality."}"
              </p>
            </div>
          </div>
        )}


        {/* Fallback for unknown types */}
        {!["soapNote","carePlan","financialPlan","structuralIntegrity","spineCloud"].includes(type) && data && (
          <div className="p-6 text-center text-neutral-500 text-sm">
            No preview available for this report type.
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center print:hidden">
          <p className="text-[10px] text-neutral-400 font-medium">DOCUMENT ID: {data?.id || "N/A"}</p>
          <div className="flex gap-4">
            <button
              className="px-8 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold rounded-xl text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-primary-600/20"
              onClick={handlePrint}
            >
              Print Official Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
