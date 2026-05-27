import { useState } from "react";
import { 
  ClipboardList, Heart, Wallet, Scan, Dumbbell, Activity, Brain, FileText, 
  Search, FolderOpen, Download, Eye, Plus, X, Upload, Mail, AlertCircle, 
  CheckCircle, ExternalLink, RotateCcw, Copy, PenLine, Send
} from "lucide-react";

// ── Shared Types ──

export interface PatientDetailTabsProps {
  patientId?: string;
  patientName: string;
  patientEmail?: string;
}

// ── Shared Mock Data ──

const RECORD_TYPES = [
  { value: "all",                 label: "All types"           },
  { value: "soapNote",            label: "SOAP Notes"          },
  { value: "carePlan",            label: "Care Plans"          },
  { value: "financialPlan",       label: "Financial Plans"     },
  { value: "structuralIntegrity", label: "Structural Integrity"},
  { value: "kdt",                 label: "KDT Reports"         },
  { value: "dicom",               label: "DICOM / Imaging"     },
  { value: "spineCloud",          label: "SpineCloud Wellness" },
];

const TYPE_ICONS: Record<string, any> = {
  soapNote: ClipboardList, carePlan: Heart, financialPlan: Wallet,
  structuralIntegrity: Scan, kdt: Dumbbell, dicom: Activity, spineCloud: Brain,
};

const MOCK_REFERRALS = [
  { id: "ref-1", referredTo: "Dr. Michael Chen", specialty: "Orthopedic Surgery", notes: "Patient evaluated for lumbar disc herniation. Conservative management recommended.", urgency: "Routine" },
  { id: "ref-2", referredTo: "Advanced Imaging Center", specialty: "Radiology", notes: "MRI – Cervical spine assessment for C5-C6 disc herniation.", urgency: "Urgent" },
  { id: "ref-3", referredTo: "Dr. Lisa Park", specialty: "Pain Management", notes: "Chronic lower back pain management – epidural steroid injection performed.", urgency: "Routine" },
];

const URGENCY_STYLES: Record<string, string> = {
  Routine:   "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
  Urgent:    "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400",
  Emergency: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400",
};

const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "Insurance Card (Front).jpg", uploadedDate: "2025-10-12", uploadedBy: "Staff" },
  { id: "doc-2", name: "Initial Scan.pdf", uploadedDate: "2025-10-10", uploadedBy: "Dr. Thompson" },
  { id: "doc-3", name: "X-Ray Lumbar.dcm", uploadedDate: "2025-11-02", uploadedBy: "Radiology" },
];

const MOCK_PATIENT_FORMS = [
  { id: "pf-1", name: "General Intake Form", status: "Completed", assignedDate: "2025-10-12" },
  { id: "pf-2", name: "Neck Pain Index (NDI)", status: "Sent", assignedDate: "2025-10-24" },
  { id: "pf-3", name: "Patient Satisfaction Survey", status: "Opened", assignedDate: "2025-11-01" },
];

const MOCK_CLINIC_FORMS = [
  { id: "cf-1", title: "General Intake Form", category: "General Intake" },
  { id: "cf-2", title: "Neck Pain Index (NDI)", category: "Clinical Assessment" },
  { id: "cf-3", title: "Car Accident Intake Form", category: "Specialty Intake" },
];

const MOCK_AGREEMENTS = [
  { id: "pa-1", name: "HIPAA Privacy Policy", status: "Signed", assignedDate: "2025-10-12" },
  { id: "pa-2", name: "Financial Responsibility", status: "Sent", assignedDate: "2025-10-24" },
];

const MOCK_CLINIC_AGREEMENTS = [
  { id: "ca-1", title: "HIPAA Privacy Policy Acknowledgment", category: "Privacy & Compliance" },
  { id: "ca-2", title: "Consent to Treat", category: "Clinical Consent" },
  { id: "ca-3", title: "Financial Responsibility Agreement", category: "Financial" },
  { id: "ca-4", title: "Cancellation Policy", category: "Administrative" },
];

// ── Helper Functions ──

function loadPatientRecords(patientName: string) {
  const all: any[] = [];
  const add = (type: string, id: string, date: string, title: string, provider: string, data: any) =>
    all.push({ id, type, date, title, provider, data });

  Object.keys(localStorage).filter(k => k.startsWith("soapNote_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id && d.status === "final") add("soapNote", d.id, d.finalizedAt || new Date().toISOString(), "SOAP Clinical Note", d.finalizedBy || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("carePlan_") && !k.startsWith("carePlan_master")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("carePlan", d.id, d.datePrepared || new Date().toISOString(), "Care Plan", d.providerName || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("financialPlan_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("financialPlan", d.id, d.datePrepared || new Date().toISOString(), "Financial Agreement", d.providerName || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("structuralIntegrity_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("structuralIntegrity", d.id, d.date || new Date().toISOString(), "Structural Integrity Analysis", d.provider || "Provider", d); } catch {}
  });
  Object.keys(localStorage).filter(k => k.startsWith("kdtReport_")).forEach(k => {
    try { const d = JSON.parse(localStorage.getItem(k)!); if (d?.id) add("kdt", d.id, d.dateCreated || new Date().toISOString(), `KDT – ${d.protocolType || "Lumbar"}`, d.providerName || "Provider", d); } catch {}
  });

  all.push(
    { 
      id: "dicom-1", 
      type: "dicom", 
      date: "2025-01-15T10:00:00", 
      title: "Comprehensive Spinal X-Ray Series", 
      provider: "Radiology", 
      data: { 
        id: "dicom-1", 
        images: [
          {
            type: "Cervical Flexion",
            imageUrl: "/assets/clinical/cervical_flexion.png",
            findings: "ABNORMAL: Significant loss of cervical lordosis in flexion. Evidence of mild C5-C6 degenerative disc disease with anterior osteophyte formation. Spinal alignment shows early signs of structural instability."
          },
          {
            type: "Lumbar Lateral",
            imageUrl: "/assets/clinical/lumbar_lateral.png",
            findings: "NORMAL: Well-maintained lumbar lordosis. Vertebral body heights are preserved. Disc spaces are healthy at all levels. No evidence of spondylolisthesis or acute bony injury."
          },
          {
            type: "AP Cervical",
            imageUrl: "/assets/clinical/ap_cervical.png",
            findings: "NORMAL: Spinous processes are midline. No lateral tilt or rotation detected in the cervical vertebrae. Paraspinal soft tissues are within normal limits."
          }
        ]
      } 
    },
    { id: "sc-1", type: "spineCloud", date: "2025-02-10T09:00:00", title: "SpineCloud Wellness Assessment", provider: "SpineCloud AI", data: { id: "sc-1", overallScore: 72 } }
  );

  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Components ──

export function PatientClinicalRecordsTab({ patientName }: { patientName: string }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const records = loadPatientRecords(patientName);

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q);
    const matchType = typeFilter === "all" || r.type === typeFilter;
    let matchDate = true;
    if (dateFilter !== "all") {
      const d = new Date(r.date);
      if (dateFilter === "7d")  { const x = new Date(); x.setDate(x.getDate()-7);   matchDate = d >= x; }
      if (dateFilter === "30d") { const x = new Date(); x.setDate(x.getDate()-30);  matchDate = d >= x; }
      if (dateFilter === "3m")  { const x = new Date(); x.setMonth(x.getMonth()-3); matchDate = d >= x; }
      if (dateFilter === "6m")  { const x = new Date(); x.setMonth(x.getMonth()-6); matchDate = d >= x; }
    }
    return matchSearch && matchType && matchDate;
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400" />
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            {RECORD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <option value="all">All time</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="3m">Last 3 months</option>
            <option value="6m">Last 6 months</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Date", "Type", "Title", "Provider", "Actions"].map(col => (
                <th key={col} className={`px-5 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-white ${col==="Actions"?"text-right":""}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center">
                <FolderOpen className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">No records found</p>
              </td></tr>
            ) : filtered.map(rec => {
              const Icon = TYPE_ICONS[rec.type] || FileText;
              const typeLabel = RECORD_TYPES.find(t => t.value === rec.type)?.label || rec.type;
              return (
                <tr key={rec.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-5 py-3 text-sm text-neutral-900 dark:text-white whitespace-nowrap">{formatDate(rec.date)}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      <Icon className="w-3 h-3" />{typeLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-neutral-900 dark:text-white">{rec.title}</td>
                  <td className="px-5 py-3 text-sm text-neutral-600 dark:text-neutral-400">{rec.provider}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { const b=new Blob([JSON.stringify(rec.data,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${rec.type}_${rec.id}.json`; a.click(); URL.revokeObjectURL(u); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" title="Download"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PatientReferralsTab({ patientName }: { patientName: string }) {
  const [referrals, setReferrals] = useState(MOCK_REFERRALS);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorName, setDoctorName]   = useState("");
  const [notes, setNotes]             = useState("");
  const [urgency, setUrgency]         = useState<"Routine"|"Urgent"|"Emergency">("Routine");
  const PAGE_SIZE = 5;

  const filtered = referrals.filter(r => {
    const q = search.toLowerCase();
    return !q || r.referredTo.toLowerCase().includes(q) || r.notes.toLowerCase().includes(q);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = () => {
    if (!doctorName.trim()) return;
    setReferrals(prev => [{
      id: `ref-${Date.now()}`,
      referredTo: doctorName.trim(),
      specialty: "",
      notes: notes.trim() || "—",
      urgency,
    }, ...prev]);
    setDoctorName(""); setNotes(""); setUrgency("Routine");
    setIsModalOpen(false); setPage(1);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search referrals..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400" />
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap">
          <Plus className="w-4 h-4" /> New Referral
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Referred To", "Notes", "Urgency"].map(col => (
                <th key={col} className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paged.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-12 text-center">
                <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 dark:text-white">No referrals found</p>
              </td></tr>
            ) : paged.map(ref => (
              <tr key={ref.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{ref.referredTo}</p>
                  {ref.specialty && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{ref.specialty}</p>}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{ref.notes}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${URGENCY_STYLES[ref.urgency] || URGENCY_STYLES.Routine}`}>
                    {ref.urgency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">Showing {paged.length} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Previous
            </button>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">New Referral</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">Doctor Name</label>
                <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Miller"
                  className="w-full h-10 px-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">Urgency</label>
                <div className="flex gap-2">
                  {(["Routine", "Urgent", "Emergency"] as const).map(u => (
                    <button key={u} onClick={() => setUrgency(u)}
                      className={`flex-1 h-10 rounded-lg text-sm font-medium border transition-all ${urgency === u ? "bg-primary-600 border-primary-600 text-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-primary-400"}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                  placeholder="Reason for referral..."
                  className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 h-10 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={!doctorName.trim()}
                className="px-5 h-10 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PatientDocumentsTab({ patientId }: { patientId: string }) {
  const [docs, setDocs] = useState(MOCK_DOCUMENTS);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const totalPages = Math.max(1, Math.ceil(docs.length / PAGE_SIZE));
  const paged = docs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e: any) => {
      const files: File[] = Array.from(e.target.files || []);
      const newDocs = files.map((f, i) => ({
        id: `doc-new-${Date.now()}-${i}`,
        name: f.name,
        uploadedDate: new Date().toISOString().split("T")[0],
        uploadedBy: "Staff",
      }));
      setDocs(prev => [...newDocs, ...prev]);
    };
    input.click();
  };

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={handleUpload}
          className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl p-12 text-center">
          <Upload className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No documents yet</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Upload patient files here</p>
          <button onClick={handleUpload} className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {["Name", "Uploaded", "Uploaded by", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paged.map(doc => (
                  <tr key={doc.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span className="text-sm font-medium text-neutral-900 dark:text-white">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(doc.uploadedDate)}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{doc.uploadedBy}</td>
                    <td className="px-6 py-4">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-1">
              <p className="text-sm text-neutral-500">Showing {paged.length} of {docs.length}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Previous
                </button>
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function PatientFormsTab({ patientEmail, patientName }: { patientEmail: string, patientName?: string }) {
  const [forms, setForms] = useState(MOCK_PATIENT_FORMS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"Email" | "Kiosk">("Email");
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [kioskDoc, setKioskDoc] = useState<{title: string} | null>(null);

  const filtered = forms.filter(f => search === "" || f.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusBadge = (s: string) => {
    switch(s) {
      case "Sent": return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "Opened": return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
      case "Completed": return "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400";
      default: return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const handleAssign = () => {
    if (!selectedFormId) return;
    const form = MOCK_CLINIC_FORMS.find(f => f.id === selectedFormId);
    if (!form) return;

    if (deliveryMethod === "Kiosk") {
      setKioskDoc({ title: form.title });
      setIsKioskActive(true);
      setIsAssignOpen(false);
      return;
    }

    setForms(prev => [
      ...prev,
      { id: `pf-${Date.now()}`, name: form.title, status: "Sent", assignedDate: new Date().toISOString().split("T")[0] },
    ]);
    setSelectedFormId("");
    setIsAssignOpen(false);
  };

  const handleKioskComplete = () => {
    if (!kioskDoc) return;
    setForms(prev => [
      ...prev,
      { id: `pf-${Date.now()}`, name: kioskDoc.title, status: "Completed", assignedDate: new Date().toISOString().split("T")[0] },
    ]);
    setIsKioskActive(false);
    setKioskDoc(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search forms..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all" />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setIsAssignOpen(true); }}
          className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap">
          <ClipboardList className="w-4 h-4" /> Assign Form
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Form Name", "Status", "Assigned", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-default">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paged.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center">
                <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 dark:text-white">No forms found</p>
              </td></tr>
            ) : paged.map(f => (
              <tr key={f.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <span 
                    onClick={() => {
                      setKioskDoc({ title: f.name });
                      setIsKioskActive(true);
                    }}
                    className="text-sm font-medium text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                  >
                    {f.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${statusBadge(f.status)}`}>{f.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(f.assignedDate)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <RotateCcw className="w-4 h-4" /> Resend
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">Showing {paged.length} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Previous</button>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Next</button>
          </div>
        </div>
      )}

      {/* ── Assign Form Modal ── */}
      {isAssignOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsAssignOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Assign Patient Form</h3>
                <p className="text-xs text-neutral-500">Send clinical questionnaire to patient</p>
              </div>
              <button onClick={() => setIsAssignOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Form</label>
                <select
                  value={selectedFormId}
                  onChange={e => setSelectedFormId(e.target.value)}
                  className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
                >
                  <option value="">Choose a form from library...</option>
                  {MOCK_CLINIC_FORMS.map(f => (
                    <option key={f.id} value={f.id}>{f.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Method</label>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={() => setDeliveryMethod("Email")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${deliveryMethod === "Email" ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/20" : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200"}`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMethod === "Email" ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                       <Mail className="w-5 h-5" />
                     </div>
                     <div className="text-center">
                       <p className={`text-xs font-bold ${deliveryMethod === "Email" ? "text-primary-600" : "text-neutral-500"}`}>Email Patient</p>
                       <p className="text-[9px] text-neutral-400 mt-0.5">Send link to inbox</p>
                     </div>
                   </button>
                   <button 
                    onClick={() => setDeliveryMethod("Kiosk")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${deliveryMethod === "Kiosk" ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/20" : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200"}`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMethod === "Kiosk" ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                       <Scan className="w-5 h-5" />
                     </div>
                     <div className="text-center">
                       <p className={`text-xs font-bold ${deliveryMethod === "Kiosk" ? "text-primary-600" : "text-neutral-500"}`}>Take Right Now</p>
                       <p className="text-[9px] text-neutral-400 mt-0.5">Open on this device</p>
                     </div>
                   </button>
                </div>
              </div>

              {deliveryMethod === "Email" && (
                <div className="p-4 bg-primary-50/30 dark:bg-primary-950/10 rounded-2xl border border-primary-100 dark:border-primary-900/50 flex items-start gap-3">
                   <AlertCircle className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                   <p className="text-[11px] text-primary-800 dark:text-primary-200 leading-relaxed">
                     This form will be sent to <strong>{patientEmail}</strong>. You'll be notified when they open and complete it.
                   </p>
                </div>
              )}
            </div>
            <div className="px-8 py-6 border-t border-neutral-100 dark:border-neutral-800 flex gap-3 justify-end bg-neutral-50/50 dark:bg-neutral-950/50">
              <button onClick={() => setIsAssignOpen(false)} className="px-6 h-11 text-sm font-bold text-neutral-500 hover:text-neutral-700 transition-colors">Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedFormId}
                className="inline-flex items-center gap-2 px-8 h-11 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20"
              >
                {deliveryMethod === "Email" ? <><Send className="w-4 h-4" /> Send via Email</> : <><ExternalLink className="w-4 h-4" /> Start Completion</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Kiosk Mode Full-Screen Completion Modal ── */}
      {isKioskActive && kioskDoc && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-[200] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="h-20 border-b border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                    <ClipboardList className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{kioskDoc.title}</h2>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-black">Patient: {patientName || "Unknown Patient"}</p>
                    {forms.find(f => f.name === kioskDoc.title)?.status === "Completed" && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-50 text-success-700 text-[10px] font-bold uppercase ml-3">
                        <CheckCircle className="w-3 h-3" /> Submitted
                      </span>
                    )}
                 </div>
              </div>
              <button 
                onClick={() => { setIsKioskActive(false); setKioskDoc(null); }}
                className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900/50 p-12">
              <div className="max-w-4xl mx-auto space-y-12 pb-24">
                 <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-16 shadow-sm">
                    <div className="text-center mb-16">
                       <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{kioskDoc.title}</h1>
                       <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-10">
                       <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif italic text-center px-12">
                         "Please answer the following clinical questions carefully. Your responses will be saved directly to your chart."
                       </p>

                       <div className="h-96 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl flex items-center justify-center">
                          <div className="text-center">
                             <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-neutral-300" />
                             </div>
                             <p className="text-sm font-bold text-neutral-400">Interactive Form Questionnaire Placeholder</p>
                          </div>
                       </div>

                       {forms.find(f => f.name === kioskDoc.title)?.status === "Completed" ? (
                         <div className="p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 italic text-center">This form was completed on Oct 12, 2025. Responses are locked for audit trail.</p>
                         </div>
                       ) : (
                         <div className="p-8 bg-primary-50 dark:bg-primary-950/20 rounded-2xl border border-primary-100 dark:border-primary-900/50">
                            <p className="text-sm text-primary-800 dark:text-primary-200 text-center font-medium">Please fill out the form sections above and click submit below.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className="h-24 border-t border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between bg-white dark:bg-neutral-950 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => { setIsKioskActive(false); setKioskDoc(null); }}
                className="px-8 h-12 text-sm font-bold text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {forms.find(f => f.name === kioskDoc.title)?.status === "Completed" ? "Close Preview" : "Cancel and Exit"}
              </button>
              {forms.find(f => f.name === kioskDoc.title)?.status !== "Completed" && (
                <button 
                  onClick={handleKioskComplete}
                  className="px-10 h-12 bg-success-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-success-700 transition-all shadow-xl shadow-success-600/20 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" /> Submit Form
                </button>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

export function PatientAgreementsTab({ patientEmail, patientName }: { patientEmail: string, patientName?: string }) {
  const [agreements, setAgreements] = useState(MOCK_AGREEMENTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAgreementId, setSelectedAgreementId] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"Email" | "Kiosk">("Email");
  const [isKioskActive, setIsKioskActive] = useState(false);
  const [kioskDoc, setKioskDoc] = useState<{title: string} | null>(null);

  const filtered = agreements.filter(a => search === "" || a.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusBadge = (s: string) => {
    switch(s) {
      case "Sent": return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
      case "Opened": return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
      case "Signed": return "bg-success-50 text-success-700 dark:bg-success-950/30 dark:text-success-400";
      default: return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const handleAssign = () => {
    if (!selectedAgreementId) return;
    const agr = MOCK_CLINIC_AGREEMENTS.find(a => a.id === selectedAgreementId);
    if (!agr) return;

    if (deliveryMethod === "Kiosk") {
      setKioskDoc({ title: agr.title });
      setIsKioskActive(true);
      setIsAssignOpen(false);
      return;
    }

    setAgreements(prev => [
      ...prev,
      { id: `pa-${Date.now()}`, name: agr.title, status: "Sent", assignedDate: new Date().toISOString().split("T")[0] },
    ]);
    setSelectedAgreementId("");
    setIsAssignOpen(false);
  };

  const handleKioskComplete = () => {
    if (!kioskDoc) return;
    setAgreements(prev => [
      ...prev,
      { id: `pa-${Date.now()}`, name: kioskDoc.title, status: "Signed", assignedDate: new Date().toISOString().split("T")[0] },
    ]);
    setIsKioskActive(false);
    setKioskDoc(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input type="text" placeholder="Search agreements..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400 transition-all" />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setIsAssignOpen(true); }}
          className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" /> Assign Agreement
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {["Agreement Name", "Status", "Assigned", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-default">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {paged.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center">
                <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 dark:text-white">No agreements found</p>
              </td></tr>
            ) : paged.map(a => (
              <tr key={a.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                <td className="px-6 py-4">
                  <span 
                    onClick={() => {
                      setKioskDoc({ title: a.name });
                      setIsKioskActive(true);
                    }}
                    className="text-sm font-medium text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                  >
                    {a.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm ${statusBadge(a.status)}`}>{a.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">{formatDate(a.assignedDate)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <RotateCcw className="w-4 h-4" /> Resend
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                    <button className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-neutral-500">Showing {paged.length} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Previous</button>
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm disabled:opacity-40 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">Next</button>
          </div>
        </div>
      )}

      {/* ── Assign Agreement Modal ── */}
      {isAssignOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setIsAssignOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Assign Agreement</h3>
                <p className="text-xs text-neutral-500">Legal consent or office policy</p>
              </div>
              <button onClick={() => setIsAssignOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Agreement</label>
                <select
                  value={selectedAgreementId}
                  onChange={e => setSelectedAgreementId(e.target.value)}
                  className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-bold text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
                >
                  <option value="">Choose an agreement...</option>
                  {MOCK_CLINIC_AGREEMENTS.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Delivery Method</label>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={() => setDeliveryMethod("Email")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${deliveryMethod === "Email" ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/20" : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200"}`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMethod === "Email" ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                       <Mail className="w-5 h-5" />
                     </div>
                     <div className="text-center">
                       <p className={`text-xs font-bold ${deliveryMethod === "Email" ? "text-primary-600" : "text-neutral-500"}`}>Email Patient</p>
                       <p className="text-[9px] text-neutral-400 mt-0.5">Send link to inbox</p>
                     </div>
                   </button>
                   <button 
                    onClick={() => setDeliveryMethod("Kiosk")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${deliveryMethod === "Kiosk" ? "border-primary-600 bg-primary-50/50 dark:bg-primary-950/20" : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-200"}`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deliveryMethod === "Kiosk" ? "bg-primary-600 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}>
                       <Scan className="w-5 h-5" />
                     </div>
                     <div className="text-center">
                       <p className={`text-xs font-bold ${deliveryMethod === "Kiosk" ? "text-primary-600" : "text-neutral-500"}`}>Take Right Now</p>
                       <p className="text-[9px] text-neutral-400 mt-0.5">Open on this device</p>
                     </div>
                   </button>
                </div>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-neutral-100 dark:border-neutral-800 flex gap-3 justify-end bg-neutral-50/50 dark:bg-neutral-950/50">
              <button onClick={() => setIsAssignOpen(false)} className="px-6 h-11 text-sm font-bold text-neutral-500 hover:text-neutral-700 transition-colors">Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedAgreementId}
                className="inline-flex items-center gap-2 px-8 h-11 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20"
              >
                {deliveryMethod === "Email" ? <><Send className="w-4 h-4" /> Send via Email</> : <><ExternalLink className="w-4 h-4" /> Start Completion</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Kiosk Mode Full-Screen Completion Modal ── */}
      {isKioskActive && kioskDoc && (
        <div className="fixed inset-0 bg-white dark:bg-neutral-950 z-[200] flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
           <div className="h-20 border-b border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{kioskDoc.title}</h2>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-black">Patient: {patientName || "Unknown Patient"}</p>
                    {agreements.find(a => a.name === kioskDoc.title)?.status === "Signed" && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-50 text-success-700 text-[10px] font-bold uppercase ml-3">
                        <ShieldCheck className="w-3 h-3" /> Legally Signed
                      </span>
                    )}
                 </div>
              </div>
              <button 
                onClick={() => { setIsKioskActive(false); setKioskDoc(null); }}
                className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900/50 p-12">
              <div className="max-w-4xl mx-auto space-y-12 pb-24">
                 <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] p-16 shadow-sm">
                    <div className="text-center mb-16">
                       <h1 className="text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">{kioskDoc.title}</h1>
                       <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-10">
                       <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif italic text-center px-12">
                         "Please review the following document carefully. By signing or completing this form, you acknowledge that you have read and understood the terms and conditions outlined herein."
                       </p>

                       <div className="h-96 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl flex items-center justify-center">
                          <div className="text-center">
                             <div className="w-16 h-16 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-neutral-300" />
                             </div>
                             <p className="text-sm font-bold text-neutral-400">Interactive Agreement Component Placeholder</p>
                          </div>
                       </div>

                       <div className="pt-10 border-t border-neutral-100 dark:border-neutral-800">
                          <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-6">Patient Signature</p>
                          <div className="h-32 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center cursor-crosshair group relative">
                             {agreements.find(a => a.name === kioskDoc.title)?.status === "Signed" ? (
                               <div className="flex flex-col items-center">
                                 <span className="text-2xl font-serif text-neutral-900 dark:text-white italic">{patientName}</span>
                                 <div className="w-32 h-px bg-neutral-300 mt-2" />
                               </div>
                             ) : (
                               <>
                                 <PenLine className="w-8 h-8 text-neutral-200 dark:text-neutral-800 group-hover:text-primary-400 transition-colors" />
                                 <span className="absolute bottom-4 right-6 text-[10px] font-bold text-neutral-300">Sign here using finger or stylus</span>
                               </>
                             )}
                          </div>
                       </div>

                       {agreements.find(a => a.name === kioskDoc.title)?.status === "Signed" && (
                         <div className="p-8 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 italic text-center">This agreement was signed on Oct 12, 2025. Signature is verified and immutable.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className="h-24 border-t border-neutral-100 dark:border-neutral-800 px-8 flex items-center justify-between bg-white dark:bg-neutral-950 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => { setIsKioskActive(false); setKioskDoc(null); }}
                className="px-8 h-12 text-sm font-bold text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {agreements.find(a => a.name === kioskDoc.title)?.status === "Signed" ? "Close Preview" : "Cancel and Exit"}
              </button>
              {agreements.find(a => a.name === kioskDoc.title)?.status !== "Signed" && (
                <button 
                  onClick={handleKioskComplete}
                  className="px-10 h-12 bg-success-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-success-700 transition-all shadow-xl shadow-success-600/20 flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5" /> Complete and Save
                </button>
              )}
           </div>
        </div>
      )}
    </div>
  );
}

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);
