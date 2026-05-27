import { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { 
  Search, 
  Plus, 
  FileText, 
  Filter, 
  X, 
  Eye, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Library,
  ChevronDown,
  PenLine,
  Save,
  Trash2,
  HelpCircle,
  BookOpen,
  ChevronUp
} from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Pagination } from "../shared/Pagination";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Agreement {
  id: string;
  title: string;
  subject?: string;
  description: string;
  content: string;
  status: "Active" | "Inactive";
  requiresSignature: boolean;
  isFromTemplate?: boolean;
  updatedAt: string;
}

interface AgreementTemplate {
  id: string;
  title: string;
  subject?: string;
  description: string;
  content: string;
  requiresSignature: boolean;
}

interface AgreementsListScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
}

// ── Patient variables ──
const PATIENT_VARIABLES = [
  { label: "First name", value: "{{firstName}}" },
  { label: "Last name", value: "{{lastName}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Date of birth", value: "{{dateOfBirth}}" },
  { label: "Street address", value: "{{street}}" },
  { label: "City", value: "{{city}}" },
  { label: "State", value: "{{state}}" },
  { label: "Zip code", value: "{{zip}}" },
];

// ── Mock Data ──────────────────────────────────────────────────────────────────

const AGREEMENT_TEMPLATES: AgreementTemplate[] = [
  { 
    id: "tpl-1", 
    title: "Consent to Treat", 
    subject: "Informed Consent for Chiropractic Care",
    description: "General informed consent authorizing chiropractic examination and treatment.", 
    content: "I hereby request and voluntarily consent to the performance of chiropractic adjustments...",
    requiresSignature: true 
  },
  { 
    id: "tpl-2", 
    title: "HIPAA Acknowledgement", 
    subject: "Notice of Privacy Practices",
    description: "Acknowledgment of clinic's HIPAA privacy practices and patient rights.", 
    content: "This notice describes how medical information about you may be used...",
    requiresSignature: true 
  },
  { 
    id: "tpl-3", 
    title: "Cancellation Policy", 
    subject: "Appointment Attendance & Cancellation Policy",
    description: "Clinic policy regarding missed appointments and cancellation fees.", 
    content: "We strive to provide excellent care to all our patients...",
    requiresSignature: true 
  },
];

const INITIAL_AGREEMENTS: Agreement[] = [
  { id: "agr-1", title: "Consent to Treat", subject: "Informed Consent for Chiropractic Care", description: "Standard chiropractic consent form.", content: "I hereby authorize the clinical staff...", status: "Active", requiresSignature: true, updatedAt: "2026-04-15" },
  { id: "agr-2", title: "Financial Responsibility", subject: "Agreement to Pay for Services", description: "Standard financial agreement.", content: "I agree to be financially responsible...", status: "Active", requiresSignature: true, updatedAt: "2026-05-02" },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export function AgreementsListScreen({
  onNavigate,
  onLogout,
}: AgreementsListScreenProps) {
  const [activeTab, setActiveTab] = useState<"library" | "myAgreements">("myAgreements");
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedTemplates, setAddedTemplates] = useState<string[]>(["tpl-1"]);
  const [myAgreements, setMyAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const renderKnowledgePanel = () => {
    if (!showKnowledgePanel) return null;
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-neutral-950/40 z-40"
          onClick={() => setShowKnowledgePanel(false)}
        />
        {/* Slide-in Panel */}
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Agreements Management</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Knowledge Guide</p>
              </div>
            </div>
            <button
              onClick={() => setShowKnowledgePanel(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto text-left">
            {/* Sections */}
            {[
              {
                id: "overview",
                title: "What is Agreements & Consent?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The <strong className="text-neutral-800 dark:text-neutral-200">Agreements & Consent Management</strong> module is used to design legal waivers, practice policies, and consent disclosures that patients must electronically sign before receiving care. Once signed, agreements are securely archived with a digital signature audit trail within the patient's portal history.
                  </p>
                ),
              },
              {
                id: "management",
                title: "My Agreements vs. Template Library",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">My Agreements Tab</p>
                      <p>Lists the active consent agreements that can currently be assigned or pushed to patients. You can build custom policies, edit existing active ones, or set whether signature confirmation is mandatory.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">Template Library Tab</p>
                      <p>Provides pre-written regulatory disclosures such as <strong className="text-neutral-700 dark:text-neutral-300">HIPAA Privacy Disclosures</strong>, <strong className="text-neutral-700 dark:text-neutral-300">Informed Consent for Chiropractic Treatment</strong>, and general clinic financial policies. Use these as a starting baseline by clicking <strong className="text-neutral-700 dark:text-neutral-300">Add to Agreements</strong>.</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "variables",
                title: "Agreement Editor & Dynamic Variables",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                    <p>The system lets you design agreements dynamically. You can type in the editor and click to insert variable placeholders. When the patient views the form, these will be replaced with real-time clinic or patient data:</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{"{{patient_name}}"}</p>
                        <p>Resolves to the patient's full first and last name. Helpful for personalizing agreements.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{"{{clinic_name}}"}</p>
                        <p>Automatically inserts your primary clinic business name.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{"{{branch_name}}"}</p>
                        <p>Resolves to the specific branch location where the patient is checking in or being treated.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">{"{{current_date}}"}</p>
                        <p>Displays the current local date when the patient is reading and executing the signature block.</p>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((section) => {
              const isExpanded = expandedSection === section.id;
              return (
                <div key={section.id} className="border-b border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
                  >
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{section.title}</span>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Panel Footer */}
          <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              This guide reflects the current capabilities of the Agreements module in SpineCloudIQ.
            </p>
          </div>
        </div>
      </>
    );
  };

  // Editor State
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editRequiresSignature, setEditRequiresSignature] = useState(true);
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  const handleOpenEditor = (agreement: Agreement) => {
    setEditTitle(agreement.title);
    setEditSubject(agreement.subject || "");
    setEditContent(agreement.content);
    setEditRequiresSignature(agreement.requiresSignature);
    setEditStatus(agreement.status);
    setSelectedAgreement(agreement);
  };

  const handleCreateAgreement = () => {
    const newAgreement: Agreement = {
      id: `agr-${Date.now()}`,
      title: "New Custom Agreement",
      subject: "Public Subject Line",
      description: "Description of the agreement",
      content: "<p>Write agreement content here...</p>",
      status: "Active",
      requiresSignature: true,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    handleOpenEditor(newAgreement);
  };

  const handleSaveAgreementChanges = () => {
    if (!selectedAgreement) return;
    const updated: Agreement = {
      ...selectedAgreement,
      title: editTitle,
      subject: editSubject,
      content: editContent,
      requiresSignature: editRequiresSignature,
      status: editStatus,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    
    const exists = myAgreements.find(a => a.id === selectedAgreement.id);
    if (exists) {
      setMyAgreements(myAgreements.map(a => a.id === selectedAgreement.id ? updated : a));
    } else {
      setMyAgreements([updated, ...myAgreements]);
    }
    setSelectedAgreement(null);
  };

  const handleInsertVariable = (variable: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        editor.insertText(range.index, variable);
      }
    }
    setShowVariablesDropdown(false);
  };

  const handleAddTemplate = (template: AgreementTemplate) => {
    if (addedTemplates.includes(template.id)) return;
    
    const newAgreement: Agreement = {
      id: `agr-${Date.now()}`,
      title: template.title,
      subject: template.subject,
      description: template.description,
      content: template.content,
      status: "Active",
      requiresSignature: template.requiresSignature,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    
    setMyAgreements(prev => [newAgreement, ...prev]);
    setAddedTemplates(prev => [...prev, template.id]);
    setActiveTab("myAgreements");
  };

  const filteredMyAgreements = myAgreements.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedMyAgreements = filteredMyAgreements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Quill config
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  }), []);

  // ── Detail View / Editor ──
  const editContentText = editContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const editStatusBadgeClass =
    editStatus === "Active"
      ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400"
      : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

  if (selectedAgreement) {
    return (
      <ClinicAdminLayout activeMenu="consentForms" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-5 md:p-6">
          <div>
            {/* Header */}
            <div className="mb-5">
              <button 
                onClick={() => setSelectedAgreement(null)}
                className="group inline-flex h-9 items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
                Back to Agreements
              </button>
              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Clinic Admin</span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span>Base Setup</span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span>Agreements</span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">Edit Consent / Agreement</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className="font-semibold text-neutral-900 dark:text-white"
                      style={{ fontSize: "18px", lineHeight: "24px" }}
                    >
                      Edit Consent / Agreement
                    </h1>
                    <span className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium ${editStatusBadgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${editStatus === "Active" ? "bg-success-500" : "bg-neutral-400"}`} />
                      {editStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Update agreement templates and public subject lines</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKnowledgePanel(true)}
                    title="Module Knowledge Guide"
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Help Guide</span>
                  </button>
                  <button 
                    onClick={() => setSelectedAgreement(null)}
                    className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveAgreementChanges}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {renderKnowledgePanel()}

            <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Overview</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Current document settings and signature behavior</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Title</p>
                  <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">{editTitle || "Untitled agreement"}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Subject</p>
                  <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">{editSubject || "Not set"}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Signature</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{editRequiresSignature ? "Required" : "Optional"}</p>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Content</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-white">{editContentText ? `${editContentText.length} characters` : "Not started"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Information</h2>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Internal title, public subject line, and agreement availability</p>
                </div>
              {/* Title Input */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Title <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Internal document name"
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Subject Line Input */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Subject Line <span className="text-destructive">*</span>
                </label>
                <input 
                  type="text" 
                  value={editSubject}
                  onChange={e => setEditSubject(e.target.value)}
                  placeholder="Public name seen by patient"
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                />
              </div>

              {/* Status and Signature */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">Status</label>
                  <select 
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">Signature Requirement</label>
                  <div className="flex h-10 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 dark:!border-neutral-800 dark:!bg-neutral-900">
                     <input 
                        type="checkbox" 
                        checked={editRequiresSignature}
                        onChange={e => setEditRequiresSignature(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" 
                     />
                     <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Require Patient Signature</span>
                  </div>
                </div>
              </div>
              </section>

              {/* CK Editor (ReactQuill) */}
              <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Content</h2>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Compose patient-facing legal language and insert supported variables</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowVariablesDropdown(!showVariablesDropdown)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-primary-600 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-primary-400 dark:hover:bg-neutral-800"
                    >
                      <Plus className="h-4 w-4" />
                      Insert patient variable <ChevronDown className="h-4 w-4" />
                    </button>
                    {showVariablesDropdown && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowVariablesDropdown(false)} />
                        <div className="absolute right-0 top-full z-20 mt-2 max-h-60 w-64 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
                          {PATIENT_VARIABLES.map(v => (
                            <button 
                              key={v.value} 
                              onClick={() => handleInsertVariable(v.value)}
                              className="w-full px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            >
                              <div className="font-medium">{v.label}</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-500">{v.value}</div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">Content <span className="text-destructive">*</span></label>
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    value={editContent}
                    onChange={setEditContent}
                    modules={modules}
                    placeholder="Write your agreement content here..."
                    className="agreement-editor"
                  />
                </div>
              </section>

              <div className="sticky bottom-0 z-10 flex items-center justify-between border-t border-neutral-200 bg-white/95 px-1 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
                <div className="inline-flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <ShieldCheck className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  Agreement changes remain local until saved
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedAgreement(null)}
                    className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAgreementChanges}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .agreement-editor .ql-toolbar {
            border: 0;
            border-bottom: 1px solid rgb(229 229 229);
            background: rgb(250 250 250);
          }
          .agreement-editor .ql-container {
            min-height: 360px;
            border: 0;
            background: transparent;
            font-size: 14px;
          }
          .agreement-editor .ql-editor {
            min-height: 360px;
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          }
          .dark .agreement-editor .ql-toolbar {
            border-bottom-color: rgb(38 38 38);
            background: rgb(23 23 23);
          }
          .dark .agreement-editor .ql-editor {
            color: rgb(245 245 245);
          }
        `}</style>
      </ClinicAdminLayout>
    );
  }

  return (
    <ClinicAdminLayout activeMenu="consentForms" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">Agreements & Consents</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage legal consents, office policies, and patient clinical agreements</p>
          </div>
          <button
            type="button"
            onClick={() => setShowKnowledgePanel(true)}
            title="Module Knowledge Guide"
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help Guide</span>
          </button>
        </div>

        {renderKnowledgePanel()}

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab("myAgreements")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "myAgreements" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            My Agreements ({myAgreements.length})
            {activeTab === "myAgreements" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "library" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Template Library
            {activeTab === "library" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
          </button>
        </div>

        {/* ── My Agreements Tab ── */}
        {activeTab === "myAgreements" && (
          <div className="animate-in fade-in duration-300">
            {/* Search and Filters */}
            <div className="mb-6 flex gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search agreements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 transition-[border-color,box-shadow] focus:ring-2 focus:ring-primary-500/10"
                />
              </div>
              <button className="inline-flex items-center justify-center w-10 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button 
                onClick={handleCreateAgreement} 
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Create Custom Agreement
              </button>
            </div>

            {/* Agreements Table */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Agreement Title</th>
                      <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Signature</th>
                      <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>
                      <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 text-right">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {paginatedMyAgreements.map(agreement => (
                      <tr 
                        key={agreement.id} 
                        className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                        onClick={() => handleOpenEditor(agreement)}
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {agreement.title}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {agreement.requiresSignature ? (
                            <span className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium">
                              <PenLine className="w-3.5 h-3.5" /> Required
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400">Optional</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            agreement.status === "Active" 
                              ? "bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800" 
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
                          }`}>
                            {agreement.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <span className="text-sm text-neutral-500">{new Date(agreement.updatedAt).toLocaleDateString()}</span>
                             <ChevronRight className="w-4 h-4 text-neutral-300" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
               <Pagination
                 totalItems={filteredMyAgreements.length}
                 itemsPerPage={itemsPerPage}
                 currentPage={currentPage}
                 totalPages={Math.ceil(filteredMyAgreements.length / itemsPerPage)}
                 onPageChange={setCurrentPage}
                 onItemsPerPageChange={setItemsPerPage}
               />
            </div>
          </div>
        )}

        {/* ── Library Tab ── */}
        {activeTab === "library" && (
          <div className="animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {AGREEMENT_TEMPLATES.map(template => {
                 const isAdded = addedTemplates.includes(template.id);
                 return (
                   <div key={template.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow">
                     <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600">
                         <Library className="w-5 h-5" />
                       </div>
                       {isAdded && (
                         <span className="flex items-center gap-1 text-success-600 dark:text-success-400 text-xs font-semibold uppercase tracking-wider">
                           <CheckCircle2 className="w-4 h-4" /> Added
                         </span>
                       )}
                     </div>
                     <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{template.title}</h3>
                     <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-2 h-10">{template.description}</p>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                          Preview
                        </button>
                        <button 
                          onClick={() => handleAddTemplate(template)}
                          disabled={isAdded}
                          className={`flex-1 h-9 rounded-lg text-sm font-medium transition-all ${
                            isAdded 
                              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-default" 
                              : "bg-primary-600 text-white hover:bg-primary-700"
                          }`}
                        >
                          {isAdded ? "Added" : "Add to Agreements"}
                        </button>
                     </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}
