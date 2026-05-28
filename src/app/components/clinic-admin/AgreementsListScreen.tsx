import { useState, useRef, useMemo, useEffect } from "react";
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
  ShieldCheck,
  Library,
  ChevronDown,
  PenLine,
  Save,
  BookOpen,
  ChevronUp,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  LayoutGrid,
  List,
  Table2,
  Edit2,
  Check,
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

type ViewMode = "grid" | "list" | "table";
type AgreementColumnId = "title" | "subject" | "requiresSignature" | "status" | "updatedAt" | "actions";
type AgreementSortField = Exclude<AgreementColumnId, "actions">;

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
    requiresSignature: true,
  },
  {
    id: "tpl-2",
    title: "HIPAA Acknowledgement",
    subject: "Notice of Privacy Practices",
    description: "Acknowledgment of clinic's HIPAA privacy practices and patient rights.",
    content: "This notice describes how medical information about you may be used...",
    requiresSignature: true,
  },
  {
    id: "tpl-3",
    title: "Cancellation Policy",
    subject: "Appointment Attendance & Cancellation Policy",
    description: "Clinic policy regarding missed appointments and cancellation fees.",
    content: "We strive to provide excellent care to all our patients...",
    requiresSignature: true,
  },
];

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: "agr-1",
    title: "Consent to Treat",
    subject: "Informed Consent for Chiropractic Care",
    description: "Standard chiropractic consent form.",
    content: "I hereby authorize the clinical staff to perform chiropractic examinations and treatment as deemed necessary.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-04-15",
  },
  {
    id: "agr-2",
    title: "Financial Responsibility",
    subject: "Agreement to Pay for Services",
    description: "Standard financial agreement for all patients.",
    content: "I agree to be financially responsible for all charges incurred during my treatment.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-05-02",
  },
  {
    id: "agr-3",
    title: "HIPAA Privacy Notice",
    subject: "Notice of Privacy Practices",
    description: "Acknowledgment of HIPAA privacy practices and patient rights.",
    content: "This notice describes how medical information about you may be used and disclosed and how you can get access to this information.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-03-10",
  },
  {
    id: "agr-4",
    title: "Cancellation & No-Show Policy",
    subject: "Appointment Attendance & Cancellation Policy",
    description: "Clinic policy regarding missed appointments and cancellation fees.",
    content: "We require 24 hours notice for cancellations. A $50 fee will be charged for missed appointments without notice.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-04-22",
  },
  {
    id: "agr-5",
    title: "Release of Medical Records",
    subject: "Authorization to Release Health Information",
    description: "Patient authorization to release medical records to third parties.",
    content: "I authorize the release of my medical records to the parties specified in this agreement.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-05-10",
  },
  {
    id: "agr-6",
    title: "Telemedicine Consent",
    subject: "Consent for Telehealth Services",
    description: "Consent for participation in telemedicine and virtual care services.",
    content: "I consent to participate in telehealth services and understand the limitations and benefits of virtual care.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-02-28",
  },
  {
    id: "agr-7",
    title: "Photography & Media Release",
    subject: "Consent for Use of Patient Images",
    description: "Authorization to use patient images for educational or marketing purposes.",
    content: "I grant permission to use photographs or videos taken during my treatment for educational and promotional purposes.",
    status: "Inactive",
    requiresSignature: true,
    updatedAt: "2026-01-15",
  },
  {
    id: "agr-8",
    title: "Spinal Adjustment Risk Disclosure",
    subject: "Risks & Benefits of Chiropractic Manipulation",
    description: "Disclosure of risks associated with spinal manipulation and adjustments.",
    content: "I acknowledge that I have been informed of the risks and benefits associated with spinal manipulation therapy.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-04-05",
  },
  {
    id: "agr-9",
    title: "Insurance Assignment of Benefits",
    subject: "Direct Payment Authorization to Provider",
    description: "Authorization to bill insurance directly and assign benefits to the clinic.",
    content: "I hereby authorize my insurance carrier to pay directly to this clinic benefits otherwise payable to me.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-03-20",
  },
  {
    id: "agr-10",
    title: "Research Participation Consent",
    subject: "Voluntary Research & Data Use Agreement",
    description: "Optional consent for anonymized data use in clinical research.",
    content: "I voluntarily agree to allow my anonymized health data to be used for research purposes.",
    status: "Inactive",
    requiresSignature: false,
    updatedAt: "2026-01-30",
  },
  {
    id: "agr-11",
    title: "Minor Patient Guardian Consent",
    subject: "Parent / Guardian Authorization for Minor Treatment",
    description: "Parental consent for treatment of patients under 18 years of age.",
    content: "As the parent or legal guardian, I authorize treatment for the minor patient named in this agreement.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-05-18",
  },
  {
    id: "agr-12",
    title: "Dry Needling Consent",
    subject: "Consent for Dry Needling Therapy",
    description: "Informed consent for dry needling and trigger point therapy procedures.",
    content: "I consent to dry needling therapy and acknowledge the associated risks including soreness and bruising.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-04-28",
  },
  {
    id: "agr-13",
    title: "Social Media Disclaimer",
    subject: "Patient Confidentiality on Social Media",
    description: "Agreement acknowledging clinic social media privacy policy.",
    content: "I understand that the clinic will not share any identifiable patient information on social media platforms.",
    status: "Inactive",
    requiresSignature: false,
    updatedAt: "2026-02-14",
  },
  {
    id: "agr-14",
    title: "Decompression Therapy Agreement",
    subject: "Spinal Decompression Treatment Consent",
    description: "Consent form for spinal decompression traction therapy.",
    content: "I consent to spinal decompression therapy and acknowledge that results may vary.",
    status: "Active",
    requiresSignature: true,
    updatedAt: "2026-05-05",
  },
  {
    id: "agr-15",
    title: "Email & SMS Communication Consent",
    subject: "Authorization for Digital Communications",
    description: "Patient consent to receive appointment reminders and health updates via email and SMS.",
    content: "I consent to receive appointment reminders, health tips, and clinic updates via email and SMS.",
    status: "Active",
    requiresSignature: false,
    updatedAt: "2026-05-20",
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export function AgreementsListScreen({
  onNavigate,
  onLogout,
}: AgreementsListScreenProps) {
  const [activeTab, setActiveTab] = useState<"library" | "myAgreements">("myAgreements");
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Agreement["status"]>("all");
  const [addedTemplates, setAddedTemplates] = useState<string[]>(["tpl-1"]);
  const [myAgreements, setMyAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Knowledge panel
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  // Toolbar / UI state
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterRows, setFilterRows] = useState<{ id: number; field: string; value: string }[]>([
    { id: 1, field: "status", value: "all" },
  ]);
  const [nextFilterId, setNextFilterId] = useState(2);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedAgreementIds, setSelectedAgreementIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<AgreementSortField>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showCardMenu, setShowCardMenu] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Record<AgreementColumnId, boolean>>({
    title: true,
    subject: true,
    requiresSignature: true,
    status: true,
    updatedAt: true,
    actions: true,
  });

  // Editor State
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editRequiresSignature, setEditRequiresSignature] = useState(true);
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Sync pending filter rows each time the panel opens
  useEffect(() => {
    if (showFilters) {
      setFilterRows([{ id: 1, field: "status", value: statusFilter }]);
      setNextFilterId(2);
    }
  }, [showFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter row helpers ────────────────────────────────────────────────────────
  const addFilterRow = () => {
    setFilterRows((prev) => [...prev, { id: nextFilterId, field: "status", value: "all" }]);
    setNextFilterId((n) => n + 1);
  };

  const removeFilterRow = (id: number) => {
    setFilterRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  const updateFilterRowValue = (id: number, value: string) => {
    setFilterRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  };

  const applyFilters = () => {
    const statusRow = [...filterRows].reverse().find((r) => r.field === "status" && r.value !== "all");
    setStatusFilter((statusRow?.value ?? "all") as "all" | Agreement["status"]);
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setFilterRows([{ id: 1, field: "status", value: "all" }]);
    setNextFilterId(2);
    setStatusFilter("all");
  };

  // ── Knowledge Panel ────────────────────────────────────────────────────────────
  const renderKnowledgePanel = () => {
    if (!showKnowledgePanel) return null;
    return (
      <>
        <div className="fixed inset-0 bg-neutral-950/40 z-40" onClick={() => setShowKnowledgePanel(false)} />
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
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
          <div className="flex-1 overflow-y-auto text-left">
            {[
              {
                id: "overview",
                title: "What is Agreements & Consent?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The{" "}
                    <strong className="text-neutral-800 dark:text-neutral-200">Agreements & Consent Management</strong>{" "}
                    module is used to design legal waivers, practice policies, and consent disclosures that patients must
                    electronically sign before receiving care.
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
                      <p>Lists the active consent agreements that can currently be assigned or pushed to patients.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">Template Library Tab</p>
                      <p>
                        Provides pre-written regulatory disclosures such as HIPAA Privacy Disclosures and Informed
                        Consent for Chiropractic Treatment.
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                id: "variables",
                title: "Agreement Editor & Dynamic Variables",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                    <p>
                      Insert variable placeholders that resolve to real-time clinic or patient data when patients view
                      the form.
                    </p>
                    <div className="space-y-2">
                      {["{{patient_name}}", "{{clinic_name}}", "{{branch_name}}", "{{current_date}}"].map((v) => (
                        <div key={v}>
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">{v}</p>
                        </div>
                      ))}
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
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && <div className="px-5 pb-5 pt-1">{section.content}</div>}
                </div>
              );
            })}
          </div>
          <div className="px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              This guide reflects the current capabilities of the Agreements module in SpineCloudIQ.
            </p>
          </div>
        </div>
      </>
    );
  };

  // ── Agreement handlers ────────────────────────────────────────────────────────
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
    const exists = myAgreements.find((a) => a.id === selectedAgreement.id);
    if (exists) {
      setMyAgreements(myAgreements.map((a) => (a.id === selectedAgreement.id ? updated : a)));
    } else {
      setMyAgreements([updated, ...myAgreements]);
    }
    setSelectedAgreement(null);
  };

  const handleInsertVariable = (variable: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) editor.insertText(range.index, variable);
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
    setMyAgreements((prev) => [newAgreement, ...prev]);
    setAddedTemplates((prev) => [...prev, template.id]);
    setActiveTab("myAgreements");
  };

  const toggleAgreementStatus = (agreementId: string) => {
    setMyAgreements((agreements) =>
      agreements.map((a) =>
        a.id === agreementId ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a
      )
    );
  };

  const toggleAgreementSelection = (agreementId: string) => {
    setSelectedAgreementIds((current) =>
      current.includes(agreementId)
        ? current.filter((id) => id !== agreementId)
        : [...current, agreementId]
    );
  };

  // ── Columns ──────────────────────────────────────────────────────────────────
  const agreementColumns: { id: AgreementColumnId; label: string }[] = [
    { id: "title", label: "Agreement Title" },
    { id: "subject", label: "Subject Line" },
    { id: "requiresSignature", label: "Signature" },
    { id: "status", label: "Status" },
    { id: "updatedAt", label: "Last Updated" },
    { id: "actions", label: "Actions" },
  ];

  const toggleColumn = (columnId: AgreementColumnId) => {
    setVisibleColumns((current) => {
      const activeCount = agreementColumns.filter((c) => current[c.id]).length;
      if (current[columnId] && activeCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const activeColumnCount = agreementColumns.filter((c) => visibleColumns[c.id]).length;

  // ── Sort ─────────────────────────────────────────────────────────────────────
  const handleSort = (field: AgreementSortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const renderSortIndicator = (field: AgreementSortField) =>
    sortField === field ? (
      sortDirection === "asc" ? (
        <ArrowUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
      ) : (
        <ArrowDown className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
      )
    ) : (
      <ArrowUpDown className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600" />
    );

  // ── Filtering / sorting / pagination ──────────────────────────────────────────
  const filteredAgreements = myAgreements.filter((a) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      a.title.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      (a.subject || "").toLowerCase().includes(query) ||
      a.status.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedAgreements = [...filteredAgreements].sort((a, b) => {
    const getSortValue = (agr: Agreement): string | number => {
      if (sortField === "requiresSignature") return agr.requiresSignature ? 1 : 0;
      if (sortField === "updatedAt") return new Date(agr.updatedAt).getTime();
      return String((agr as Record<string, unknown>)[sortField] ?? "").toLowerCase();
    };
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDirection === "asc" ? cmp : -cmp;
  });

  const paginatedAgreements = sortedAgreements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const allCurrentSelected =
    paginatedAgreements.length > 0 &&
    paginatedAgreements.every((a) => selectedAgreementIds.includes(a.id));

  const toggleCurrentPageSelection = () => {
    if (allCurrentSelected) {
      setSelectedAgreementIds((current) =>
        current.filter((id) => !paginatedAgreements.some((a) => a.id === id))
      );
    } else {
      setSelectedAgreementIds((current) =>
        Array.from(new Set([...current, ...paginatedAgreements.map((a) => a.id)]))
      );
    }
  };

  // ── Summary counts ───────────────────────────────────────────────────────────
  const activeCount = myAgreements.filter((a) => a.status === "Active").length;
  const inactiveCount = myAgreements.filter((a) => a.status === "Inactive").length;
  const sigRequiredCount = myAgreements.filter((a) => a.requiresSignature).length;
  const activeFilterCount = statusFilter !== "all" ? 1 : 0;

  const ViewIcon = viewMode === "grid" ? LayoutGrid : viewMode === "list" ? List : Table2;
  const showTableColumnControl = viewMode === "table";

  // ── Quill config ─────────────────────────────────────────────────────────────
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  // ── Status badge ─────────────────────────────────────────────────────────────
  const statusBadge = (status: Agreement["status"]) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-neutral-400"}`} />
      {status}
    </span>
  );

  // ── Row actions (table view) ─────────────────────────────────────────────────
  const renderRowActions = (agreement: Agreement) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleAgreementStatus(agreement.id);
        }}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          agreement.status === "Active"
            ? "text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30"
            : "text-neutral-400 hover:bg-neutral-100 hover:text-primary-600 dark:hover:bg-neutral-800 dark:hover:text-primary-400"
        }`}
        title={agreement.status === "Active" ? "Deactivate" : "Activate"}
      >
        {agreement.status === "Active" ? (
          <ToggleRight className="w-4 h-4" />
        ) : (
          <ToggleLeft className="w-4 h-4" />
        )}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleOpenEditor(agreement);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleOpenEditor(agreement);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
        title="Edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>
    </div>
  );

  // ── Card menu (grid + list views) ────────────────────────────────────────────
  const renderCardMenu = (agreement: Agreement) => (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCardMenu(showCardMenu === agreement.id ? null : agreement.id);
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-primary-400 transition-colors"
        title="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {showCardMenu === agreement.id && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={(e) => {
              e.stopPropagation();
              setShowCardMenu(null);
            }}
          />
          <div className="absolute right-0 top-9 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditor(agreement);
                setShowCardMenu(null);
              }}
              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditor(agreement);
                setShowCardMenu(null);
              }}
              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleAgreementStatus(agreement.id);
                setShowCardMenu(null);
              }}
              className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
            >
              {agreement.status === "Active" ? (
                <ToggleLeft className="w-4 h-4" />
              ) : (
                <ToggleRight className="w-4 h-4" />
              )}
              {agreement.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ── View option helper ───────────────────────────────────────────────────────
  const renderViewOption = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      onClick={() => {
        setViewMode(mode);
        if (mode !== "table") setShowColumnsPanel(false);
        setShowViewMenu(false);
      }}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm transition-colors ${
        viewMode === mode
          ? "bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  // ── Detail View / Editor ─────────────────────────────────────────────────────
  const editContentText = editContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const editStatusBadgeClass =
    editStatus === "Active"
      ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-950/30 dark:text-success-400"
      : "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

  if (selectedAgreement) {
    return (
      <ClinicAdminLayout
        activeMenu="consentForms"
        onNavigate={onNavigate}
        onLogout={onLogout}
        onOpenHelpGuide={() => setShowKnowledgePanel(true)}
      >
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
                    <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                      Clinic Admin
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                      Base Setup
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span
                      onClick={() => setSelectedAgreement(null)}
                      className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors"
                    >
                      Agreements
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">/</span>
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      Edit Consent / Agreement
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1
                      className="font-semibold text-neutral-900 dark:text-white"
                      style={{ fontSize: "18px", lineHeight: "24px" }}
                    >
                      Edit Consent / Agreement
                    </h1>
                    <span
                      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium ${editStatusBadgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          editStatus === "Active" ? "bg-success-500" : "bg-neutral-400"
                        }`}
                      />
                      {editStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Update agreement templates and public subject lines
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAgreement(null)}
                    className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
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

            {/* Overview strip */}
            <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Overview</h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Current document settings and signature behavior
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "Title", value: editTitle || "Untitled agreement" },
                  { label: "Subject", value: editSubject || "Not set" },
                  { label: "Signature", value: editRequiresSignature ? "Required" : "Optional" },
                  {
                    label: "Content",
                    value: editContentText ? `${editContentText.length} characters` : "Not started",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40"
                  >
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-neutral-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {/* Agreement Information */}
              <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-5">
                  <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Information</h2>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Internal title, public subject line, and agreement availability
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Title <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Internal document name"
                      className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Subject Line <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      placeholder="Public name seen by patient"
                      className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as "Active" | "Inactive")}
                        className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-[border-color,box-shadow] focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 dark:!border-neutral-800 dark:!bg-neutral-900 dark:text-neutral-100"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        Signature Requirement
                      </label>
                      <div className="flex h-10 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 dark:!border-neutral-800 dark:!bg-neutral-900">
                        <input
                          type="checkbox"
                          checked={editRequiresSignature}
                          onChange={(e) => setEditRequiresSignature(e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                          Require Patient Signature
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ReactQuill Editor */}
              <section className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Agreement Content</h2>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Compose patient-facing legal language and insert supported variables
                    </p>
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
                          {PATIENT_VARIABLES.map((v) => (
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
                <label className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Content <span className="text-destructive">*</span>
                </label>
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

              {/* Sticky footer */}
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
          .agreement-editor .ql-toolbar { border:0; border-bottom:1px solid rgb(229 229 229); background:rgb(250 250 250); }
          .agreement-editor .ql-container { min-height:360px; border:0; background:transparent; font-size:14px; }
          .agreement-editor .ql-editor { min-height:360px; font-family:Inter,ui-sans-serif,system-ui,sans-serif; }
          .dark .agreement-editor .ql-toolbar { border-bottom-color:rgb(38 38 38); background:rgb(23 23 23); }
          .dark .agreement-editor .ql-editor { color:rgb(245 245 245); }
        `}</style>
      </ClinicAdminLayout>
    );
  }

  // ── Listing View ─────────────────────────────────────────────────────────────
  return (
    <ClinicAdminLayout
      activeMenu="consentForms"
      onNavigate={onNavigate}
      onLogout={onLogout}
      onOpenHelpGuide={() => setShowKnowledgePanel(true)}
    >
      <div className="p-6">
        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Agreements &amp; Consents
            </h1>
            <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                Clinic Admin
              </span>
              <span>/</span>
              <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">
                Base Setup
              </span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white">Agreements</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage legal consents, office policies, and patient clinical agreements
            </p>
          </div>

          {/* ── Header Action Cluster ── */}
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "myAgreements" && (
              <>
                {/* Search — compact icon or expanded inline bar */}
                {showHeaderSearch ? (
                  <div className="relative">
                    <div className="h-10 w-[min(400px,calc(100vw-3rem))] flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-sm px-3">
                      <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search agreements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="min-w-0 flex-1 h-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                      />
                      <button
                        onClick={() => setShowFilters((v) => !v)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors relative ${
                          activeFilterCount > 0
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                            : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        }`}
                        title="Filters"
                      >
                        <Filter className="w-4 h-4" />
                        {activeFilterCount > 0 && (
                          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary-600 text-white text-[10px] font-bold">
                            {activeFilterCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowHeaderSearch(false);
                          setShowFilters(false);
                          setShowColumnsPanel(false);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                        title="Close search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Filter By popover */}
                    {showFilters && (
                      <div className="absolute right-0 top-full mt-3 w-[500px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                        <div className="px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Filter By</h3>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="px-5 py-5 space-y-3">
                          {filterRows.map((row, index) => (
                            <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                              <div>
                                {index === 0 && (
                                  <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                    Where
                                  </label>
                                )}
                                <div className="relative">
                                  <select
                                    value={row.field}
                                    onChange={() => undefined}
                                    className="w-full h-10 px-3 pr-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                                  >
                                    <option value="status">Status</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                                </div>
                              </div>
                              <div>
                                {index === 0 && (
                                  <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">
                                    What
                                  </label>
                                )}
                                <div className="relative">
                                  <select
                                    value={row.value}
                                    onChange={(e) => updateFilterRowValue(row.id, e.target.value)}
                                    className="w-full h-10 px-3 pr-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                                  >
                                    <option value="all">Select...</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                                </div>
                              </div>
                              <button
                                onClick={() => removeFilterRow(row.id)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors ${
                                  index === 0 ? "mt-5" : ""
                                }`}
                                title="Remove filter"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addFilterRow}
                            className="mx-auto flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors pt-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Filter
                          </button>
                        </div>
                        <div className="px-5 py-4 border-t border-neutral-200 dark:!border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                          <button
                            onClick={clearAllFilters}
                            className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            Clear All
                          </button>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setShowFilters(false)}
                              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={applyFilters}
                              className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHeaderSearch(true)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}

                {/* Customized Columns — Table view only */}
                {!showHeaderSearch && showTableColumnControl && (
                  <div className="relative">
                    <button
                      onClick={() => setShowColumnsPanel((v) => !v)}
                      className={`inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border rounded-lg transition-all ${
                        showColumnsPanel
                          ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500"
                      }`}
                      title="Customized columns"
                    >
                      <Table2 className="w-5 h-5" />
                    </button>
                    {showColumnsPanel && (
                      <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                        <div className="px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Table2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Columns</h3>
                          </div>
                          <button
                            onClick={() => setShowColumnsPanel(false)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="p-3 space-y-2">
                          {agreementColumns.map((column) => (
                            <button
                              key={column.id}
                              onClick={() => toggleColumn(column.id)}
                              className={`w-full px-3 py-3 rounded-lg transition-colors flex items-center justify-between text-left ${
                                visibleColumns[column.id]
                                  ? "bg-primary-50 dark:bg-primary-950/30 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                                  : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                    visibleColumns[column.id]
                                      ? "bg-primary-600 border-primary-600 text-white"
                                      : "border-neutral-300 dark:border-neutral-700"
                                  }`}
                                >
                                  {visibleColumns[column.id] && <Check className="w-3.5 h-3.5" />}
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    visibleColumns[column.id]
                                      ? "text-primary-700 dark:text-primary-400"
                                      : "text-neutral-700 dark:text-neutral-300"
                                  }`}
                                >
                                  {column.label}
                                </span>
                              </span>
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  visibleColumns[column.id]
                                    ? "bg-primary-600 dark:bg-primary-400"
                                    : "bg-neutral-900 dark:bg-white"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="px-5 py-3 border-t border-neutral-200 dark:!border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {activeColumnCount} of {agreementColumns.length} active
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary action */}
                <button
                  onClick={handleCreateAgreement}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Create Agreement
                </button>

                {/* Summary toggle */}
                <button
                  onClick={() => setShowSummary((v) => !v)}
                  className={`inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border rounded-lg transition-all ${
                    showSummary
                      ? "border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500"
                  }`}
                  title="Summary"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>

                {/* Refresh */}
                <button
                  onClick={() => setCurrentPage(1)}
                  className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                {/* More options */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu((v) => !v)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                    title="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-20">
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Import
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print
                      </button>
                    </div>
                  )}
                </div>

                {/* View mode switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowViewMenu((v) => !v)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-600 dark:hover:border-primary-500 transition-all"
                    title="View mode"
                  >
                    <ViewIcon className="w-5 h-5" />
                  </button>
                  {showViewMenu && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-20">
                      {renderViewOption("grid", "Grid View", LayoutGrid)}
                      {renderViewOption("list", "List View", List)}
                      {renderViewOption("table", "Table View", Table2)}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {renderKnowledgePanel()}

        {/* ── Tabs ── */}
        <div className="flex items-center gap-6 border-b border-neutral-200 dark:!border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab("myAgreements")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "myAgreements"
                ? "text-primary-600 dark:text-primary-400"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            My Agreements ({myAgreements.length})
            {activeTab === "myAgreements" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "library"
                ? "text-primary-600 dark:text-primary-400"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Template Library
            {activeTab === "library" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
            )}
          </button>
        </div>

        {/* ── My Agreements Tab ── */}
        {activeTab === "myAgreements" && (
          <div className="animate-in fade-in duration-300">
            {/* Summary cards */}
            {showSummary && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Total Agreements", value: myAgreements.length, icon: FileText },
                  { label: "Active", value: activeCount, icon: CheckCircle2 },
                  { label: "Inactive", value: inactiveCount, icon: X },
                  { label: "Require Signature", value: sigRequiredCount, icon: PenLine },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold text-neutral-900 dark:text-white">{item.value}</p>
                        <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-white">{item.label}</p>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Active filter chips */}
            {(searchQuery || statusFilter !== "all") && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
                  >
                    Search: {searchQuery} <X className="w-3 h-3" />
                  </button>
                )}
                {statusFilter !== "all" && (
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
                  >
                    Status: {statusFilter} <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Clear all
                </button>
              </div>
            )}

            {paginatedAgreements.length > 0 ? (
              <>
                {/* ── Grid View ── */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {paginatedAgreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        onClick={() => handleOpenEditor(agreement)}
                        className="group bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                              {agreement.title}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                              {agreement.subject || agreement.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedAgreementIds.includes(agreement.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleAgreementSelection(agreement.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                              aria-label={`Select ${agreement.title}`}
                            />
                            {renderCardMenu(agreement)}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:!border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                            <PenLine className="w-3.5 h-3.5" />
                            {agreement.requiresSignature ? "Signature required" : "Optional"}
                          </span>
                          {statusBadge(agreement.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── List View ── */}
                {viewMode === "list" && (
                  <div className="space-y-2">
                    {paginatedAgreements.map((agreement) => (
                      <div
                        key={agreement.id}
                        onClick={() => handleOpenEditor(agreement)}
                        className="group bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedAgreementIds.includes(agreement.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggleAgreementSelection(agreement.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-1 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                              aria-label={`Select ${agreement.title}`}
                            />
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {agreement.title}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {agreement.subject || agreement.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                              <PenLine className="w-3.5 h-3.5" />
                              {agreement.requiresSignature ? "Required" : "Optional"}
                            </span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {new Date(agreement.updatedAt).toLocaleDateString()}
                            </span>
                            {statusBadge(agreement.status)}
                            {renderCardMenu(agreement)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Table View ── */}
                {viewMode === "table" && (
                  <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:!border-neutral-800">
                          <tr>
                            {/* Fixed checkbox column */}
                            <th className="w-12 px-5 py-3">
                              <input
                                type="checkbox"
                                checked={allCurrentSelected}
                                onChange={toggleCurrentPageSelection}
                                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                                aria-label="Select all"
                              />
                            </th>
                            {visibleColumns.title && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("title")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Agreement Title {renderSortIndicator("title")}
                                </button>
                              </th>
                            )}
                            {visibleColumns.subject && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("subject")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Subject Line {renderSortIndicator("subject")}
                                </button>
                              </th>
                            )}
                            {visibleColumns.requiresSignature && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("requiresSignature")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Signature {renderSortIndicator("requiresSignature")}
                                </button>
                              </th>
                            )}
                            {visibleColumns.status && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("status")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Status {renderSortIndicator("status")}
                                </button>
                              </th>
                            )}
                            {visibleColumns.updatedAt && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("updatedAt")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Last Updated {renderSortIndicator("updatedAt")}
                                </button>
                              </th>
                            )}
                            {visibleColumns.actions && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 text-right">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {paginatedAgreements.map((agreement) => (
                            <tr
                              key={agreement.id}
                              className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                              onClick={() => handleOpenEditor(agreement)}
                            >
                              <td className="px-5 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedAgreementIds.includes(agreement.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleAgreementSelection(agreement.id);
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                                  aria-label={`Select ${agreement.title}`}
                                />
                              </td>
                              {visibleColumns.title && (
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {agreement.title}
                                      </p>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[220px] line-clamp-1">
                                        {agreement.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              )}
                              {visibleColumns.subject && (
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400 max-w-[200px] line-clamp-1 block">
                                    {agreement.subject || "—"}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.requiresSignature && (
                                <td className="px-6 py-4">
                                  {agreement.requiresSignature ? (
                                    <span className="inline-flex items-center gap-1.5 text-xs text-primary-600 dark:text-primary-400 font-medium">
                                      <PenLine className="w-3.5 h-3.5" /> Required
                                    </span>
                                  ) : (
                                    <span className="text-xs text-neutral-400">Optional</span>
                                  )}
                                </td>
                              )}
                              {visibleColumns.status && (
                                <td className="px-6 py-4">{statusBadge(agreement.status)}</td>
                              )}
                              {visibleColumns.updatedAt && (
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {new Date(agreement.updatedAt).toLocaleDateString()}
                                  </span>
                                </td>
                              )}
                              {visibleColumns.actions && (
                                <td className="px-6 py-4 text-right">{renderRowActions(agreement)}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <Pagination
                  totalItems={sortedAgreements.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  totalPages={Math.ceil(sortedAgreements.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </>
            ) : (
              /* Empty state */
              <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No agreements found</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create a custom agreement or add one from the template library"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={handleCreateAgreement}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Agreement
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Template Library Tab ── */}
        {activeTab === "library" && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AGREEMENT_TEMPLATES.map((template) => {
                const isAdded = addedTemplates.includes(template.id);
                return (
                  <div
                    key={template.id}
                    className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                        <Library className="w-5 h-5" />
                      </div>
                      {isAdded && (
                        <span className="flex items-center gap-1 text-success-600 dark:text-success-400 text-xs font-semibold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> Added
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-2">{template.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-2 h-10">
                      {template.description}
                    </p>
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
