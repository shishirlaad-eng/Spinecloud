import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  FileText, 
  Filter, 
  X, 
  Eye, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  ArrowLeft,
  ChevronDown,
  MoreVertical,
  Library,
  HelpCircle,
  BookOpen,
  ChevronUp,
  BarChart3,
  RefreshCw,
  Upload,
  Download,
  Printer,
  LayoutGrid,
  List,
  Table2,
  ArrowUpDown,
  Edit2,
  Check,
  Save
} from "lucide-react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Pagination } from "../shared/Pagination";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  text: string;
  type: "radio" | "checkbox" | "text" | "textarea" | "slider" | "number";
  options?: string[];
  min?: number;
  max?: number;
  required: boolean;
}

interface PatientForm {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
  updatedAt: string;
  questions: Question[];
  isFromTemplate?: boolean;
}

interface FormTemplate {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface PatientFormsListScreenProps {
  onNavigate: (menu: string) => void;
  onLogout?: () => void;
}

type ViewMode = "grid" | "list" | "table";
type PatientFormColumnId = "title" | "questions" | "status" | "updatedAt" | "actions";

// ── Mock Data ──────────────────────────────────────────────────────────────────

const FORM_TEMPLATES: FormTemplate[] = [
  { 
    id: "tpl-1", 
    title: "Neck / Shoulder Pain", 
    description: "Detailed intake for upper body pain symptoms.",
    questions: [
      { id: "q1", text: "How long have you had this pain?", type: "radio", options: ["Less than 1 week", "1-4 weeks", "1-3 months", "More than 3 months"], required: true },
      { id: "q2", text: "Rate your pain from 1-10", type: "slider", min: 1, max: 10, required: true }
    ]
  },
  { 
    id: "tpl-2", 
    title: "Low Back Assessment", 
    description: "Specific questionnaire for lumbar and sciatic issues.",
    questions: [
      { id: "q1", text: "Does the pain radiate down your leg?", type: "radio", options: ["Yes, left leg", "Yes, right leg", "Yes, both legs", "No radiation"], required: true }
    ]
  },
  { 
    id: "tpl-3", 
    title: "Headache History", 
    description: "Clinical history for migraine and tension headaches.",
    questions: []
  },
  { 
    id: "tpl-4", 
    title: "Activities of Daily Living", 
    description: "Functional assessment of daily patient activities.",
    questions: []
  },
];

const INITIAL_FORMS: PatientForm[] = [
  { 
    id: "frm-1", 
    title: "New Patient Intake", 
    description: "General medical history and contact information.", 
    status: "Active", 
    updatedAt: "2026-04-15",
    questions: [
      { id: "q1", text: "What brings you in today?", type: "textarea", required: true },
      { id: "q2", text: "Current medications", type: "textarea", required: false }
    ]
  },
  { 
    id: "frm-2", 
    title: "System Review", 
    description: "Comprehensive review of body systems.", 
    status: "Active", 
    updatedAt: "2026-04-20",
    questions: []
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export function PatientFormsListScreen({
  onNavigate,
  onLogout,
}: PatientFormsListScreenProps) {
  const [activeTab, setActiveTab] = useState<"library" | "myForms">("myForms");
  const [selectedForm, setSelectedForm] = useState<PatientForm | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PatientForm["status"]>("all");
  const [addedTemplates, setAddedTemplates] = useState<string[]>(["tpl-1", "tpl-2"]);
  const [myForms, setMyForms] = useState<PatientForm[]>(INITIAL_FORMS);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const [showHeaderSearch, setShowHeaderSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnsPanel, setShowColumnsPanel] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"title" | "updatedAt">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<Record<PatientFormColumnId, boolean>>({
    title: true,
    questions: true,
    status: true,
    updatedAt: true,
    actions: true,
  });

  // Editor State
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);
  const [editStatus, setEditStatus] = useState<"Active" | "Inactive">("Active");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

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
        <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:!bg-neutral-900 border-l border-neutral-200 dark:!border-neutral-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800 bg-primary-50 dark:bg-primary-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">Patient Form Management</p>
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
                title: "What is Patient Form Management?",
                content: (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    The <strong className="text-neutral-800 dark:text-neutral-200">Patient Form Management</strong> module helps your clinic digitize physical intake packets. Forms can be sent to patients via email to complete in the patient portal before their visit, or completed in-clinic using a tablet/kiosk. This speeds up physical check-ins and saves clinic staff time by populating patient records automatically.
                  </p>
                ),
              },
              {
                id: "management",
                title: "My Forms vs. Template Library",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">My Forms Tab</p>
                      <p>Displays all questionnaires that have been configured and are active in your clinic. From this tab, you can view existing forms, edit their questions/structure, or build new custom forms from scratch.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">Template Library Tab</p>
                      <p>Provides pre-built intake templates designed for chiropractic clinics (e.g., Neck/Shoulder Pain, Low Back Assessment, Headache History). You can preview any template or click <strong className="text-neutral-700 dark:text-neutral-300">Add to Forms</strong> to import it into your clinic's forms list where it can be further edited.</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "builder",
                title: "Questionnaire Builder & Input Types",
                content: (
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                    <p>When creating or editing a form, you can add questions and choose the best format for patients to answer:</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Single Choice (Radio)</p>
                        <p>Allows patients to select one option from a predefined list. Best for binary questions (Yes/No) or mutually exclusive options (e.g., "How long has it been?").</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Multiple Choice (Checkbox)</p>
                        <p>Allows patients to select one or more choices. Best for lists of symptoms, daily activities, or previous treatment histories.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Short Text</p>
                        <p>A single-line input field. Perfect for short, factual details (e.g., emergency contact name, referring doctor).</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Long Text (Textarea)</p>
                        <p>A larger paragraph entry field. Best for descriptive responses like detailed pain history or accident narratives.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Slider (1-10)</p>
                        <p>A visual rating bar. Commonly used for pain scale assessments, allowing patients to select their current discomfort level from 1 to 10.</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-neutral-200">Number Input</p>
                        <p>A field restricted to numeric values. Good for entering specific measurements, weight, or duration in months.</p>
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
          <div className="px-5 py-4 border-t border-neutral-200 dark:!border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
              This guide reflects the current capabilities of the Patient Forms module in SpineCloudIQ.
            </p>
          </div>
        </div>
      </>
    );
  };

  const handleOpenEditor = (form: PatientForm) => {
    setEditTitle(form.title);
    setEditDescription(form.description);
    setEditQuestions([...form.questions]);
    setEditStatus(form.status);
    setSelectedForm(form);
  };

  const handleCreateForm = () => {
    const newForm: PatientForm = {
      id: `frm-${Date.now()}`,
      title: "New Custom Form",
      description: "Description of the new form",
      status: "Active",
      updatedAt: new Date().toISOString().split("T")[0],
      questions: [
        { id: `q-${Date.now()}`, text: "First question", type: "text", required: true }
      ]
    };
    handleOpenEditor(newForm);
  };

  const handleSaveFormChanges = () => {
    if (!selectedForm) return;
    const updated: PatientForm = {
      ...selectedForm,
      title: editTitle,
      description: editDescription,
      questions: editQuestions,
      status: editStatus,
      updatedAt: new Date().toISOString().split("T")[0],
    };
    
    // Check if it's a new form or updating existing
    const exists = myForms.find(f => f.id === selectedForm.id);
    if (exists) {
      setMyForms(myForms.map(f => f.id === selectedForm.id ? updated : f));
    } else {
      setMyForms([updated, ...myForms]);
    }
    setSelectedForm(null);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      type: "radio",
      options: ["Option 1", "Option 2"],
      required: true,
    };
    setEditQuestions([...editQuestions, newQuestion]);
  };

  const handleAddTemplate = (template: FormTemplate) => {
    if (addedTemplates.includes(template.id)) return;
    
    const newForm: PatientForm = {
      id: `frm-${Date.now()}`,
      title: template.title,
      description: template.description,
      questions: template.questions,
      status: "Active",
      updatedAt: new Date().toISOString().split("T")[0],
      isFromTemplate: true,
    };
    
    setMyForms(prev => [newForm, ...prev]);
    setAddedTemplates(prev => [...prev, template.id]);
    setActiveTab("myForms");
  };

  const filteredMyForms = myForms.filter((form) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      form.title.toLowerCase().includes(query) ||
      form.description.toLowerCase().includes(query) ||
      form.status.toLowerCase().includes(query);
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedMyForms = [...filteredMyForms].sort((a, b) => {
    const comparison =
      sortField === "title"
        ? a.title.localeCompare(b.title)
        : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const paginatedMyForms = sortedMyForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilterCount = statusFilter !== "all" ? 1 : 0;
  const activeFormsCount = myForms.filter((form) => form.status === "Active").length;
  const inactiveFormsCount = myForms.filter((form) => form.status === "Inactive").length;
  const templateFormsCount = myForms.filter((form) => form.isFromTemplate).length;
  const ViewIcon = viewMode === "grid" ? LayoutGrid : viewMode === "list" ? List : Table2;
  const showTableColumnControl = viewMode === "table";
  const allCurrentFormsSelected =
    paginatedMyForms.length > 0 && paginatedMyForms.every((form) => selectedFormIds.includes(form.id));
  const patientFormColumns: { id: PatientFormColumnId; label: string }[] = [
    { id: "title", label: "Form Name" },
    { id: "questions", label: "Questions" },
    { id: "status", label: "Status" },
    { id: "updatedAt", label: "Last Updated" },
    { id: "actions", label: "Actions" },
  ];
  const activeColumnCount = patientFormColumns.filter((column) => visibleColumns[column.id]).length;

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const toggleColumn = (columnId: PatientFormColumnId) => {
    setVisibleColumns((current) => {
      if (current[columnId] && activeColumnCount === 1) return current;
      return { ...current, [columnId]: !current[columnId] };
    });
  };

  const toggleFormSelection = (formId: string) => {
    setSelectedFormIds((current) =>
      current.includes(formId)
        ? current.filter((id) => id !== formId)
        : [...current, formId]
    );
  };

  const toggleCurrentPageSelection = () => {
    if (allCurrentFormsSelected) {
      setSelectedFormIds((current) => current.filter((id) => !paginatedMyForms.some((form) => form.id === id)));
      return;
    }

    setSelectedFormIds((current) => Array.from(new Set([...current, ...paginatedMyForms.map((form) => form.id)])));
  };

  const statusBadge = (status: PatientForm["status"]) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300">
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-neutral-400"}`} />
      {status}
    </span>
  );

  const renderViewOption = (mode: ViewMode, label: string, Icon: typeof LayoutGrid) => (
    <button
      onClick={() => {
        setViewMode(mode);
        if (mode !== "table") {
          setShowColumnsPanel(false);
        }
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

  const renderRowActions = (form: PatientForm) => (
    <div className="relative">
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpenActionId(openActionId === form.id ? null : form.id);
        }}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title="Form actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {openActionId === form.id && (
        <div
          className="absolute right-0 top-9 w-36 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-lg py-1 z-20"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            onClick={() => {
              setOpenActionId(null);
              handleOpenEditor(form);
            }}
            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => {
              setOpenActionId(null);
              handleOpenEditor(form);
            }}
            className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      )}
    </div>
  );

  // ── Detail View / Builder ──
  if (selectedForm) {
    return (
      <ClinicAdminLayout activeMenu="questionnaires" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-5 md:p-6">
          <div className="max-w-[100%] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedForm(null)}
                className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Patient Forms
              </button>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Clinic Admin</span>
                    <span>/</span>
                    <span>Base Setup</span>
                    <span>/</span>
                    <span>Patient Forms</span>
                    <span>/</span>
                    <span className="text-neutral-900 dark:text-white">Edit Patient Form</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[18px] leading-6 font-semibold text-neutral-900 dark:text-white">
                      {editTitle || "Edit Patient Form"}
                    </h1>
                    {statusBadge(editStatus)}
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    Update patient form information and questions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKnowledgePanel(true)}
                    title="Module Knowledge Guide"
                    className="inline-flex items-center gap-2 h-9 px-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Help Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedForm(null)}
                    className="h-9 px-4 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveFormChanges}
                    className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {renderKnowledgePanel()}

            <div className="mb-6 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex gap-3 md:col-span-2">
                  <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Form description</p>
                    <p className="text-sm text-neutral-900 dark:text-white font-medium line-clamp-2">
                      {editDescription || "No description provided"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Questions</p>
                    <p className="text-sm text-neutral-900 dark:text-white font-medium">{editQuestions.length}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Status</p>
                    <div>{statusBadge(editStatus)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title Information */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Title information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter form title"
                    className="h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                    Short description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter short description"
                    rows={2}
                    className="w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Questions Builder */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Questions
                </h2>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center gap-2 px-3 h-9 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-950/50 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {editQuestions.map((q, idx) => (
                  <div key={q.id} className="border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-neutral-400 mt-2 cursor-move" />
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                            Question {idx + 1} <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={q.text}
                            onChange={(e) => setEditQuestions(editQuestions.map(item => item.id === q.id ? { ...item, text: e.target.value } : item))}
                            className="h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">Answer type</label>
                            <select
                              value={q.type}
                              onChange={(e) => setEditQuestions(editQuestions.map(item => item.id === q.id ? { ...item, type: e.target.value as any } : item))}
                              className="h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm outline-none focus:border-primary-500 transition-all"
                            >
                              <option value="radio">Single choice (radio)</option>
                              <option value="checkbox">Multiple choice (checkbox)</option>
                              <option value="text">Short text</option>
                              <option value="textarea">Long text</option>
                              <option value="slider">Slider (1-10)</option>
                              <option value="number">Number input</option>
                            </select>
                          </div>
                          <div className="flex items-end pb-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={q.required}
                                  onChange={(e) => setEditQuestions(editQuestions.map(item => item.id === q.id ? { ...item, required: e.target.checked } : item))}
                                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500" 
                                />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Required</span>
                             </label>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditQuestions(editQuestions.filter(item => item.id !== q.id))}
                        className="p-2 text-neutral-400 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Status
              </h2>
              <div className="max-w-xs">
                <label className="text-xs text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Form status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="h-10 w-full rounded-lg border border-neutral-200 dark:!border-neutral-800 bg-white dark:!bg-neutral-900 px-3 py-1 text-sm outline-none focus:border-primary-500 transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </ClinicAdminLayout>
    );
  }

  return (
    <ClinicAdminLayout activeMenu="questionnaires" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Patient Form Management
            </h1>
            <div className="mb-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>Clinic Admin</span>
              <span>/</span>
              <span>Base Setup</span>
              <span>/</span>
              <span className="text-neutral-900 dark:text-white">Patient Forms</span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Create and manage clinical intake questionnaires and forms
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "myForms" && (
              <>
                {showHeaderSearch ? (
                  <div className="relative">
                    <div className="h-12 w-[min(430px,calc(100vw-3rem))] flex items-center gap-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-sm px-3">
                      <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search forms..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="min-w-0 flex-1 h-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                      />
                      <button
                        onClick={() => setShowFilters((value) => !value)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors relative ${
                          activeFilterCount > 0
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
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
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                        title="Close search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {showFilters && (
                      <div className="absolute right-0 top-full mt-3 w-[520px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
                        <div className="px-5 py-4 border-b border-neutral-200 dark:!border-neutral-800">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">Filter By</h3>
                            <button
                              onClick={() => setShowFilters(false)}
                              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="px-5 py-5 space-y-4">
                          <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">Where</label>
                              <div className="relative">
                                <select
                                  value="status"
                                  onChange={() => undefined}
                                  className="w-full h-10 px-3 pr-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 outline-none appearance-none"
                                >
                                  <option value="status">Status</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400 block mb-1">What</label>
                              <div className="relative">
                                <select
                                  value={statusFilter}
                                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
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
                              onClick={() => setStatusFilter("all")}
                              className="mb-1 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                              title="Clear status filter"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <button className="mx-auto flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                            <Plus className="w-4 h-4" />
                            Add Filter
                          </button>
                        </div>
                        <div className="px-5 py-4 border-t border-neutral-200 dark:!border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                          <button
                            onClick={() => setStatusFilter("all")}
                            className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
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
                              onClick={() => setShowFilters(false)}
                              className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
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
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    title="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}

                {!showHeaderSearch && showTableColumnControl && (
                  <div className="relative">
                    <button
                      onClick={() => setShowColumnsPanel((value) => !value)}
                      className={`inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border rounded-lg transition-colors ${
                        showColumnsPanel
                          ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`}
                      title="Customized columns"
                    >
                      <Table2 className="w-5 h-5" />
                    </button>
                    {showColumnsPanel && (
                      <div className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-2xl z-30 overflow-hidden">
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
                          {patientFormColumns.map((column) => (
                            <button
                              key={column.id}
                              onClick={() => toggleColumn(column.id)}
                              className="w-full px-3 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between text-left"
                            >
                              <span className="flex items-center gap-3">
                                <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                  visibleColumns[column.id]
                                    ? "bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-950"
                                    : "border-neutral-300 dark:border-neutral-700"
                                }`}>
                                  {visibleColumns[column.id] && <Check className="w-3.5 h-3.5" />}
                                </span>
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{column.label}</span>
                              </span>
                              <span className="w-1 h-1 rounded-full bg-neutral-900 dark:bg-white" />
                            </button>
                          ))}
                        </div>
                        <div className="px-5 py-3 border-t border-neutral-200 dark:!border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {activeColumnCount} of {patientFormColumns.length} active
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleCreateForm}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Create Custom Form
                </button>
                <button
                  onClick={() => setShowSummary((value) => !value)}
                  className={`inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border rounded-lg transition-colors ${
                    showSummary
                      ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                      : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  }`}
                  title="Summary"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu((value) => !value)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-neutral-950 border border-neutral-200 dark:!border-neutral-800 rounded-lg shadow-xl py-1 z-20">
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Import
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowViewMenu((value) => !value)}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
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
            <button
              type="button"
              onClick={() => setShowKnowledgePanel(true)}
              title="Module Knowledge Guide"
              className="flex items-center gap-1.5 px-3 h-10 bg-white dark:!bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Guide</span>
            </button>
          </div>
        </div>

        {renderKnowledgePanel()}

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-neutral-200 dark:!border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab("myForms")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "myForms" ? "text-primary-600 dark:text-primary-400" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            My Forms ({myForms.length})
            {activeTab === "myForms" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />}
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

        {/* ── My Forms Tab ── */}
        {activeTab === "myForms" && (
          <div className="animate-in fade-in duration-300">
            {showSummary && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Total Forms", value: myForms.length, icon: FileText },
                  { label: "Active", value: activeFormsCount, icon: CheckCircle2 },
                  { label: "Inactive", value: inactiveFormsCount, icon: X },
                  { label: "From Templates", value: templateFormsCount, icon: Library },
                ].map((item) => (
                  <div key={item.label} className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 shadow-sm">
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

            {(searchQuery || statusFilter !== "all") && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
                  >
                    Search: {searchQuery}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {statusFilter !== "all" && (
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:!bg-neutral-900 text-xs text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-600"
                  >
                    Status: {statusFilter}
                    <X className="w-3 h-3" />
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

            {paginatedMyForms.length > 0 ? (
              <>
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedMyForms.map((form) => (
                      <div
                        key={form.id}
                        onClick={() => handleOpenEditor(form)}
                        className="group bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {form.title}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                              {form.description}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedFormIds.includes(form.id)}
                            onChange={(event) => {
                              event.stopPropagation();
                              toggleFormSelection(form.id);
                            }}
                            onClick={(event) => event.stopPropagation()}
                            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                            aria-label={`Select ${form.title}`}
                          />
                          {renderRowActions(form)}
                        </div>
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:!border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{form.questions.length} questions</span>
                          {statusBadge(form.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === "list" && (
                  <div className="space-y-2">
                    {paginatedMyForms.map((form) => (
                      <div
                        key={form.id}
                        onClick={() => handleOpenEditor(form)}
                        className="group bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedFormIds.includes(form.id)}
                              onChange={(event) => {
                                event.stopPropagation();
                                toggleFormSelection(form.id);
                              }}
                              onClick={(event) => event.stopPropagation()}
                              className="mt-1 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                              aria-label={`Select ${form.title}`}
                            />
                            <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {form.title}
                              </p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                {form.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{form.questions.length} questions</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{new Date(form.updatedAt).toLocaleDateString()}</span>
                            {statusBadge(form.status)}
                            {renderRowActions(form)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {viewMode === "table" && (
                  <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:!border-neutral-800">
                          <tr>
                            <th className="w-12 px-5 py-3">
                              <input
                                type="checkbox"
                                checked={allCurrentFormsSelected}
                                onChange={toggleCurrentPageSelection}
                                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                                aria-label="Select all patient forms on this page"
                              />
                            </th>
                            {visibleColumns.title && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("title")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Form Name
                                  <ArrowUpDown className="w-4 h-4" />
                                </button>
                              </th>
                            )}
                            {visibleColumns.questions && <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Questions</th>}
                            {visibleColumns.status && <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Status</th>}
                            {visibleColumns.updatedAt && (
                              <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                <button
                                  onClick={() => handleSort("updatedAt")}
                                  className="inline-flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  Last Updated
                                  <ArrowUpDown className="w-4 h-4" />
                                </button>
                              </th>
                            )}
                            {visibleColumns.actions && <th className="px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {paginatedMyForms.map((form) => (
                            <tr
                              key={form.id}
                              className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                              onClick={() => handleOpenEditor(form)}
                            >
                              <td className="px-5 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedFormIds.includes(form.id)}
                                  onChange={(event) => {
                                    event.stopPropagation();
                                    toggleFormSelection(form.id);
                                  }}
                                  onClick={(event) => event.stopPropagation()}
                                  className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600"
                                  aria-label={`Select ${form.title}`}
                                />
                              </td>
                              {visibleColumns.title && (
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                      <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {form.title}
                                      </p>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 max-w-[260px]">{form.description}</p>
                                    </div>
                                  </div>
                                </td>
                              )}
                              {visibleColumns.questions && (
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {form.questions.length} questions
                                  </span>
                                </td>
                              )}
                              {visibleColumns.status && (
                                <td className="px-6 py-4">
                                  {statusBadge(form.status)}
                                </td>
                              )}
                              {visibleColumns.updatedAt && (
                                <td className="px-6 py-4">
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400">{new Date(form.updatedAt).toLocaleDateString()}</span>
                                </td>
                              )}
                              {visibleColumns.actions && (
                                <td className="px-6 py-4 text-right">
                                  {renderRowActions(form)}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <Pagination
                  totalItems={sortedMyForms.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  totalPages={Math.ceil(sortedMyForms.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </>
            ) : (
              <div className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  No patient forms found
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create a custom form or add one from the template library"}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <button
                    onClick={handleCreateForm}
                    className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create Custom Form
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Library Tab ── */}
        {activeTab === "library" && (
          <div className="animate-in fade-in duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {FORM_TEMPLATES.map(template => {
                 const isAdded = addedTemplates.includes(template.id);
                 return (
                   <div key={template.id} className="bg-white dark:!bg-neutral-900 border border-neutral-200 dark:!border-neutral-800 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                        <button 
                          className="flex-1 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                        >
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
                          {isAdded ? "Added" : "Add to Forms"}
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
