import { useState, useEffect } from "react";
import { ProviderLayout } from "./layout/ProviderLayout";
import { ArrowLeft, Search, Filter, Clock, MapPin, Stethoscope, ChevronRight, X, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Calendar, User, Image as ImageIcon, FileText, Activity, Printer, Download } from "lucide-react";
import { SpineCloudResultsView } from "../shared/SpineCloudResultsView";
import { NewReportModal, type ReportType } from "./imaging/NewReportModal";
import { GuidedAnnotationInterface } from "./imaging/GuidedAnnotationInterface";
import { SOAPNotesContent } from "./SOAPNotesContent";
import { ClipboardList, Wallet } from "lucide-react";
import { CarePlanBuilder, type CarePlan } from "./CarePlanBuilder";
import { FinancialPlanBuilder, type FinancialPlan } from "./FinancialPlanBuilder";
import { StructuralIntegrityBuilder } from "./imaging/StructuralIntegrityBuilder";
import { KDTReportsTabContent } from "./KDTReportsTabContent";
import { KDTReportBuilder, type KDTReport } from "./KDTReportBuilder";
import { StructuralIntegrityTabContent } from "./StructuralIntegrityTabContent";
import { UnifiedReportPreviewModal } from "../common/UnifiedReportPreviewModal";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: string | null;
  
  // Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyCountryCode: string;
  emergencyContact: string;
  
  // Insurance
  insuranceProvider: string;
  planNetworkName: string;
  policyNumber: string;
  groupNumber: string;
  policyHolderName: string;
  policyHolderDOB: string;
  relationshipToPolicyholder: string;
  
  // Appointments
  appointments: Appointment[];
}

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  location: string;
  provider: string;
}

interface ProviderPatientDetailsScreenProps {
  patient: PatientDetails;
  onNavigate: (menu: "dashboard" | "calendar" | "patients" | "spineCloud" | "leaves") => void;
  onBack: () => void;
  onViewAppointment?: (appointmentId: string) => void;
  onLogout?: () => void;
  soapCategories?: SOAPCategory[]; // Add SOAP Master categories
}

export function ProviderPatientDetailsScreen({
  patient,
  onNavigate,
  onBack,
  onViewAppointment,
  onLogout,
  soapCategories = [], // Default to empty array
}: ProviderPatientDetailsScreenProps) {
  const [activePatientTab, setActivePatientTab] = useState<"overview" | "appointments" | "soap" | "reports" | "carePlan" | "financialPlans" | "kdtReports" | "structuralIntegrity" | "spineCloud">("overview");
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [selectedDicomIds, setSelectedDicomIds] = useState<string[]>([]);
  const [isComparingDicom, setIsComparingDicom] = useState(false);
  const [activeReportType, setActiveReportType] = useState<ReportType | null>(null);
  const [diagnosticReports, setDiagnosticReports] = useState<Array<{id: string, type: string, date: string, data?: any}>>([
    { 
      id: "dicom-admin-1", 
      type: "Comprehensive Spinal Series", 
      date: "2025-01-15T10:00:00",
      data: { 
        id: "dicom-admin-1", 
        images: [
          {
            type: "Cervical Flexion",
            imageUrl: "/assets/clinical/cervical_flexion.png",
            findings: "ABNORMAL: Significant loss of cervical lordosis in flexion. Evidence of mild C5-C6 degenerative disc disease."
          },
          {
            type: "Lumbar Lateral",
            imageUrl: "/assets/clinical/lumbar_lateral.png",
            findings: "NORMAL: Well-maintained lumbar lordosis. Vertebral body heights are preserved."
          }
        ]
      }
    },
    { 
      id: "mock-1", 
      type: "posture", 
      date: new Date().toISOString(),
      data: {
        id: "mock-1",
        imageUrl: "/assets/clinical/ap_cervical.png",
        type: "Posture Analysis",
        findings: "NORMAL: Spinous processes are midline. No lateral tilt detected."
      }
    },
  ]);
  const [comparisonNote, setComparisonNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // SOAP State
  const [activeSOAPNoteId, setActiveSOAPNoteId] = useState<string | null>(null);
  const [isCreatingSOAP, setIsCreatingSOAP] = useState(false);
  const [soapSearchQuery, setSoapSearchQuery] = useState("");
  const [soapStatusFilter, setSoapStatusFilter] = useState("all");
  const [soapDateFilter, setSoapDateFilter] = useState("all");
  const [savedSOAPNotes, setSavedSOAPNotes] = useState<any[]>([]);
  const [isPreviewingReport, setIsPreviewingReport] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);
  const [selectedReportType, setSelectedReportType] = useState<"kdt" | "carePlan" | "financialPlan" | "structuralIntegrity" | "soapNote" | "spineCloud" | null>(null);

  const handleViewReport = (id: string, type: "kdt" | "carePlan" | "financialPlan" | "structuralIntegrity" | "soapNote" | "dicom" | "spineCloud") => {
    let data = null;
    if (type === "dicom") {
      const report = diagnosticReports.find(r => r.id === id);
      if (report?.data) data = report.data;
      else {
        data = {
          id: id,
          type: report?.type || "DICOM Analysis",
          imageUrl: "/assets/clinical/ap_cervical.png",
          findings: "Standard clinical findings for this study."
        };
      }
    } else if (type === "kdt") {
      const saved = localStorage.getItem(`kdtReport_${id}`);
      if (saved) data = JSON.parse(saved);
    } else if (type === "carePlan") {
      const saved = localStorage.getItem(`carePlan_${id}`);
      if (saved) data = JSON.parse(saved);
    } else if (type === "financialPlan") {
      const saved = localStorage.getItem(`financialPlan_${id}`);
      if (saved) data = JSON.parse(saved);
    } else if (type === "structuralIntegrity") {
      const saved = localStorage.getItem(`structuralIntegrity_${id}`);
      if (saved) data = JSON.parse(saved);
    } else if (type === "soapNote") {
      const saved = localStorage.getItem(`soapNote_${id}`);
      if (saved) data = JSON.parse(saved);
    } else if (type === "spineCloud") {
      const saved = localStorage.getItem(`spineCloud_${id}`);
      if (saved) data = JSON.parse(saved);
      else {
        // Mock fallback
        data = {
          id: id,
          score: 78.5,
          completedAt: new Date().toISOString(),
          categoryScores: {
            neuromuscular: 82,
            autonomic: 75,
            structural: 88,
            metabolic: 72,
            cognitive: 76
          },
          recommendations: "Patient is showing good progress in structural stability. Continue with current protocols."
        };
      }
    }
    
    if (data) {
      setSelectedReportData(data);
      setSelectedReportType(type);
      setIsPreviewingReport(true);
    } else {
      alert("Report data not found.");
    }
  };

  // Reports State
  const [reportsSearchQuery, setReportsSearchQuery] = useState("");
  const [reportsStatusFilter, setReportsStatusFilter] = useState("all");
  const [reportsDateFilter, setReportsDateFilter] = useState("all");

  // Care Plan State
  const [activeCarePlanId, setActiveCarePlanId] = useState<string | null>(null);
  const [isBuildingCarePlan, setIsBuildingCarePlan] = useState(false);
  const [carePlanSearchQuery, setCarePlanSearchQuery] = useState("");
  const [savedCarePlans, setSavedCarePlans] = useState<CarePlan[]>([]);

  // Financial Plan State
  const [activeFinancialPlanId, setActiveFinancialPlanId] = useState<string | null>(null);
  const [isBuildingFinancialPlan, setIsBuildingFinancialPlan] = useState(false);
  const [financialPlanSearchQuery, setFinancialPlanSearchQuery] = useState("");
  const [savedFinancialPlans, setSavedFinancialPlans] = useState<FinancialPlan[]>([]);
  
  // KDT Reports State
  const [savedKDTReports, setSavedKDTReports] = useState<KDTReport[]>([]);
  const [isBuildingKDTReport, setIsBuildingKDTReport] = useState(false);
  const [activeKDTReportId, setActiveKDTReportId] = useState<string | null>(null);
  
  // SpineCloud Wellness State
  const [savedSpineCloudReports, setSavedSpineCloudReports] = useState<any[]>([
    {
      id: "sc-mock-1",
      score: 82.4,
      completedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      status: "final"
    },
    {
      id: "sc-mock-2",
      score: 85.1,
      completedAt: new Date().toISOString(),
      status: "final"
    }
  ]);
  const [spineCloudSearchQuery, setSpineCloudSearchQuery] = useState("");
  const [isCreatingSpineCloud, setIsCreatingSpineCloud] = useState(false);
  
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);
  const [isBuildingStructuralIntegrity, setIsBuildingStructuralIntegrity] = useState(false);

  // Load SOAP notes from local storage
  useEffect(() => {
    if (activePatientTab === "soap") {
       const keys = Object.keys(localStorage).filter(k => k.startsWith("soapNote_"));
       const notes = keys.map(k => {
          try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) { return null; }
       }).filter(n => n && n.id);
       
       // Sort by date descending
       notes.sort((a, b) => {
         const dateA = a.finalizedAt ? new Date(a.finalizedAt).getTime() : 0;
         const dateB = b.finalizedAt ? new Date(b.finalizedAt).getTime() : 0;
         return dateB - dateA;
       });
       
       setSavedSOAPNotes(notes);
    }

    if (activePatientTab === "carePlan") {
       const keys = Object.keys(localStorage).filter(k => k.startsWith("carePlan_"));
       const plans = keys.map(k => {
          try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) { return null; }
       }).filter(n => n && n.id);
       
       plans.sort((a, b) => new Date(b.datePrepared).getTime() - new Date(a.datePrepared).getTime());
       setSavedCarePlans(plans);
    }

    if (activePatientTab === "financialPlans") {
       const keys = Object.keys(localStorage).filter(k => k.startsWith("financialPlan_"));
       const plans = keys.map(k => {
          try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) { return null; }
       }).filter(n => n && n.id);
       
       plans.sort((a, b) => new Date(b.datePrepared).getTime() - new Date(a.datePrepared).getTime());
       setSavedFinancialPlans(plans);
    }
     if (activePatientTab === "kdtReports") {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("kdtReport_"));
        const reports = keys.map(k => {
           try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) { return null; }
        }).filter(n => n && n.id && n.patientId === patient.id);
        
        reports.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        setSavedKDTReports(reports);
      }

      // Load Structural Integrity Reports
      const siKeys = Object.keys(localStorage).filter(k => k.startsWith("structuralIntegrity_"));
      const siReports = siKeys.map(k => {
         try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch(e) { return null; }
      }).filter(n => n && n.id);
      
      setDiagnosticReports(prev => {
        const mockReports = prev.filter(r => !r.id.startsWith("si-") && !r.id.startsWith("mock-si-"));
        const existingIds = new Set(mockReports.map(r => r.id));
        const newSiReports = siReports.filter(r => !existingIds.has(r.id));
        return [...mockReports, ...newSiReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
  }, [activePatientTab, isCreatingSOAP, activeSOAPNoteId, isBuildingCarePlan, activeCarePlanId, isBuildingFinancialPlan, activeFinancialPlanId, isBuildingKDTReport, isBuildingStructuralIntegrity]);

  // Filter SOAP notes
  const filteredSOAPNotes = savedSOAPNotes.filter(note => {
     let matchSearch = true;
     let matchStatus = true;
     if (soapSearchQuery) {
        const query = soapSearchQuery.toLowerCase();
        matchSearch = (note.subjective?.toLowerCase().includes(query) || 
                       note.objective?.toLowerCase().includes(query) || 
                       note.assessment?.toLowerCase().includes(query) || 
                       note.plan?.toLowerCase().includes(query) ||
                       note.id.toLowerCase().includes(query));
     }
     if (soapStatusFilter !== "all") {
        matchStatus = note.status === soapStatusFilter;
     }
     return matchSearch && matchStatus;
  });

  // Filter Reports (mock logic since reports are mock data)
  const filteredReports = diagnosticReports.filter(report => {
     let matchSearch = true;
     if (reportsSearchQuery) {
        matchSearch = report.type.toLowerCase().includes(reportsSearchQuery.toLowerCase());
     }
     let matchStatus = true;
     if (reportsStatusFilter !== "all") {
       matchStatus = reportsStatusFilter === "finalized"; // for mock, all are finalized
     }
     return matchSearch && matchStatus;
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(new Set(patient.appointments.map((apt) => apt.location)));

  // Filter appointments based on search and filters
  const filteredAppointments = patient.appointments.filter((appointment) => {
    const matchesSearch =
      searchQuery === "" ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesLocation = locationFilter === "all" || appointment.location === locationFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRangeFilter !== "all") {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateRangeFilter) {
        case "upcoming":
          matchesDateRange = appointmentDate >= today;
          break;
        case "past":
          matchesDateRange = appointmentDate < today;
          break;
        case "this-week": {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          matchesDateRange = appointmentDate >= today && appointmentDate <= weekFromNow;
          break;
        }
        case "this-month": {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          matchesDateRange = appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
          break;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesLocation && matchesDateRange;
  }).sort((a, b) => {
    // Sort by date (most recent first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Active filter count
  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) +
    (locationFilter !== "all" ? 1 : 0) +
    (dateRangeFilter !== "all" ? 1 : 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800";
      case "Completed":
        return "bg-success-50 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case "male":
        return "Male";
      case "female":
        return "Female";
      case "other":
        return "Other";
      case "prefer-not-to-say":
        return "Prefer not to say";
      default:
        return gender;
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setLocationFilter("all");
    setDateRangeFilter("all");
  };

  if (activeReportType) {
    return (
      <div className="h-screen w-full relative">
        <GuidedAnnotationInterface
          reportType={activeReportType}
          patientName={`${patient.firstName} ${patient.lastName}`}
          onBack={() => setActiveReportType(null)}
          onSave={() => {
            console.log("Report Saved!");
            const newReport = {
              id: Math.random().toString(36).substring(7),
              type: activeReportType || "x-ray",
              date: new Date().toISOString(),
              data: {
                id: Math.random().toString(36).substring(7),
                type: activeReportType || "X-Ray Analysis",
                imageUrl: activeReportType === "lumbar-lateral" 
                  ? "/assets/clinical/lumbar_lateral.png" 
                  : activeReportType === "cervical-drma"
                  ? "/assets/clinical/cervical_flexion.png"
                  : "/assets/clinical/ap_cervical.png",
                findings: activeReportType === "lumbar-lateral"
                  ? "NORMAL: Well-maintained lumbar lordosis. Vertebral body heights are preserved. Disc spaces are healthy."
                  : activeReportType === "cervical-drma"
                  ? "ABNORMAL: Significant loss of cervical lordosis in flexion. Evidence of mild C5-C6 degenerative disc disease."
                  : "NORMAL: Spinous processes are midline. No lateral tilt or rotation detected."
              }
            };
            setDiagnosticReports(prev => [newReport, ...prev]);
            setActiveReportType(null);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <ProviderLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-3 md:p-4 w-full mx-auto flex flex-col lg:flex-row gap-4">
        
        {/* LEFT COLUMN: Main Canvas */}
        <div className="flex-1 min-w-0 order-2 lg:order-1 flex flex-col">
           <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 min-h-[600px] shadow-sm flex-1">

          {/* TAB: OVERVIEW */}
          {activePatientTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-3">Patient Overview</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address Card */}
                <div className="bg-white dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1.5">
                     <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <MapPin className="w-5 h-5" />
                     </div>
                     <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Address details</h4>
                  </div>
                  <div className="space-y-1.5 pl-13">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.street}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{patient.city}, {patient.state} {patient.zipCode}</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{patient.country === "US" ? "United States" : patient.country}</p>
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="bg-white dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-1.5">
                     <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                        <User className="w-5 h-5" />
                     </div>
                     <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Emergency Contact</h4>
                  </div>
                  <div className="space-y-2 pl-13">
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Name</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.emergencyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.emergencyCountryCode} {patient.emergencyContact}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance Card */}
                <div className="bg-white dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <FileText className="w-5 h-5" />
                     </div>
                     <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Primary Insurance</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pl-13">
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Provider / Network</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.insuranceProvider} ({patient.planNetworkName})</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Policy Number</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Group Number</p>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{patient.groupNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activePatientTab === "appointments" && (
            <div>
              {/* Appointments - Search + Filter row */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm outline-none focus:border-primary-600"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${activeFilterCount > 0 ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  {showFilters && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                        <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Status</label>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm outline-none">
                          <option value="all">All</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Location</label>
                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm outline-none">
                          <option value="all">All Locations</option>
                          {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Date Range</label>
                        <select value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)} className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm outline-none">
                          <option value="all">All Time</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past</option>
                          <option value="this-week">This Week</option>
                          <option value="this-month">This Month</option>
                        </select>
                      </div>
                      {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700 font-medium text-left">Clear Filters ({activeFilterCount})</button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Feed List */}
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                  <Calendar className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">No appointments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedAppointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => onViewAppointment && onViewAppointment(appointment.id)}
                      className="w-full flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 transition-all text-left group"
                    >
                      <div className="flex items-center md:flex-col md:items-start md:justify-center shrink-0 md:w-32 md:border-r border-neutral-200 dark:border-neutral-800 md:pr-4 gap-2 md:gap-1">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">{formatDate(appointment.date).split(',')[0]}</span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1"><Clock className="w-3 h-3" />{appointment.time.split(' - ')[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate pr-4">{appointment.service}</h3>
                          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${getStatusColor(appointment.status)}`}>{appointment.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-neutral-600">
                          <span className="flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" />{appointment.provider}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{appointment.location}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 hidden md:block" />
                    </button>
                  ))}
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-4 mt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-sm text-neutral-500">Showing {paginatedAppointments.length} of {filteredAppointments.length}</div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1 border rounded disabled:opacity-50"><ChevronLeftIcon className="w-4 h-4"/></button>
                       <span className="text-xs font-medium px-2">{currentPage} / {totalPages}</span>
                       <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1 border rounded disabled:opacity-50"><ChevronRightIcon className="w-4 h-4"/></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: SOAP */}
          {activePatientTab === "soap" && (
            <div className="-m-6">
              {activeSOAPNoteId || isCreatingSOAP ? (
                <div className="p-6">

                  <div className="w-full">
                     <SOAPNotesContent
                       appointmentId={activeSOAPNoteId || `new-${Date.now()}`} 
                       providerName="Dr. David Bohn" 
                       isReadOnly={false}
                       patientAppointments={patient.appointments}
                       soapCategories={soapCategories}
                       patientInfo={{
                         name: `${patient.firstName} ${patient.lastName}`,
                         email: patient.email,
                       }}
                       appointmentInfo={{
                         date: new Date().toISOString(),
                         time: "10:00 AM",
                         service: "Clinical Visit",
                         branch: "Main Branch"
                       }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* SOAP List View */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search SOAP notes..."
                        value={soapSearchQuery}
                        onChange={(e) => setSoapSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'soap' ? null : 'soap')}
                        className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${activeFilterDropdown === 'soap' ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      {activeFilterDropdown === 'soap' && (
                         <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                               <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                               <button onClick={() => setActiveFilterDropdown(null)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
                            </div>
                            <div>
                               <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Status</label>
                               <select 
                                 value={soapStatusFilter}
                                 onChange={(e) => setSoapStatusFilter(e.target.value)}
                                 className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-700 dark:text-neutral-300 outline-none focus:border-primary-500"
                               >
                                 <option value="all">All</option>
                                 <option value="draft">Draft</option>
                                 <option value="final">Finalized</option>
                               </select>
                            </div>
                            <div>
                               <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Date</label>
                               <select 
                                 value={soapDateFilter}
                                 onChange={(e) => setSoapDateFilter(e.target.value)}
                                 className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-700 dark:text-neutral-300 outline-none focus:border-primary-500"
                               >
                                 <option value="all">All Time</option>
                                 <option value="this-month">This Month</option>
                               </select>
                            </div>
                         </div>
                      )}
                    </div>
                    <button onClick={() => setIsCreatingSOAP(true)} className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                      Create a new SOAP note
                    </button>
                  </div>
                  
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400">
                        <tr>
                          <th className="px-5 py-3 font-medium w-1/4">Date Encountered</th>
                          <th className="px-5 py-3 font-medium">Method</th>
                          <th className="px-5 py-3 font-medium">Provider</th>
                          <th className="px-5 py-3 font-medium">Status</th>
                          <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                         {filteredSOAPNotes.length > 0 ? filteredSOAPNotes.map((note) => (
                           <tr key={note.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                             <td className="px-5 py-4 font-medium flex items-center gap-2 text-neutral-900 dark:text-white">
                               <ClipboardList className="w-4 h-4 text-primary-500"/> 
                               {note.finalizedAt ? formatDate(note.finalizedAt) : "Unsaved Draft"}
                             </td>
                             <td className="px-5 py-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                   Manual
                                </span>
                             </td>
                             <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400">{note.finalizedBy || "Dr. David Bohn"}</td>
                             <td className="px-5 py-4">
                               <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${note.status === 'final' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>
                                 {note.status === 'final' ? 'Finalized' : 'Draft'}
                               </span>
                             </td>
                              <td className="px-5 py-4 text-right whitespace-nowrap">
                               <button onClick={() => handleViewReport(note.id, "soapNote")} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                               <button onClick={() => setActiveSOAPNoteId(note.id)} className="text-neutral-600 dark:text-neutral-400 font-medium hover:underline mr-4">Edit</button>
                               <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline" onClick={() => {
                                 const content = `SOAP NOTE\nPatient: ${patient.firstName} ${patient.lastName}\nDate: ${note.finalizedAt ? formatDate(note.finalizedAt) : "Draft"}\nStatus: ${note.status}\n\nSubjective:\n${note.subjective}\n\nObjective:\n${note.objective}\n\nAssessment:\n${note.assessment}\n\nPlan:\n${note.plan}`;
                                 const blob = new Blob([content], { type: 'text/plain' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `SOAP_Note_${note.id}.txt`;
                                 a.click();
                                 URL.revokeObjectURL(url);
                               }}>Download</button>
                             </td>
                           </tr>
                         )) : (
                           <tr>
                              <td colSpan={5} className="px-5 py-8 text-center text-neutral-500">No SOAP notes found. Create a new one to get started.</td>
                           </tr>
                         )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: REPORTS */}
          {activePatientTab === "reports" && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={reportsSearchQuery}
                    onChange={(e) => setReportsSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'reports' ? null : 'reports')}
                    className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${activeFilterDropdown === 'reports' ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  {activeFilterDropdown === 'reports' && (
                     <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                           <button onClick={() => setActiveFilterDropdown(null)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">Status</label>
                           <select 
                             value={reportsStatusFilter}
                             onChange={(e) => setReportsStatusFilter(e.target.value)}
                             className="w-full h-9 px-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm text-neutral-700 dark:text-neutral-300 outline-none focus:border-primary-500"
                           >
                             <option value="all">All</option>
                             <option value="draft">Draft</option>
                             <option value="finalized">Finalized</option>
                           </select>
                        </div>
                     </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button 
                      className={`px-4 h-10 border rounded-lg text-sm font-medium transition-colors ${selectedDicomIds.length >= 2 ? 'bg-primary-50 border-primary-300 text-primary-700 hover:bg-primary-100' : 'border-neutral-300 text-neutral-400 cursor-not-allowed'}`}
                      onClick={() => selectedDicomIds.length >= 2 && setIsComparingDicom(true)}
                      disabled={selectedDicomIds.length < 2}
                  >
                    Compare ({selectedDicomIds.length})
                  </button>
                   <button onClick={() => setIsNewReportModalOpen(true)} className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                    Analyze New DICOM
                  </button>
                </div>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400">
                    <tr>
                      <th className="px-5 py-3 w-12 text-center">
                        <input 
                           type="checkbox" 
                           className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                           checked={selectedDicomIds.length === diagnosticReports.length && diagnosticReports.length > 0}
                           onChange={(e) => setSelectedDicomIds(e.target.checked ? diagnosticReports.map(r => r.id) : [])}
                        />
                      </th>
                      <th className="px-5 py-3 font-medium">Report Type</th>
                      <th className="px-5 py-3 font-medium">Date Generated</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {diagnosticReports.filter(r => r.type !== "structural-integrity").map(report => (
                      <tr key={report.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        <td className="px-5 py-4 text-center">
                           <input 
                              type="checkbox" 
                              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-600"
                              checked={selectedDicomIds.includes(report.id)}
                              onChange={(e) => {
                                 if (e.target.checked) setSelectedDicomIds(prev => [...prev, report.id]);
                                 else setSelectedDicomIds(prev => prev.filter(id => id !== report.id));
                              }}
                           />
                        </td>
                        <td className="px-5 py-4 font-medium text-neutral-900 dark:text-white capitalize flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary-500" />
                          {report.type.replace("-", " ")} Report
                        </td>
                        <td className="px-5 py-4 text-neutral-600 dark:text-neutral-400">
                          {new Date(report.date).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                            Finalized
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button onClick={() => handleViewReport(report.id, "dicom")} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                          <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {diagnosticReports.filter(r => r.type !== "structural-integrity").length === 0 && (
                  <div className="py-12 text-center text-neutral-500 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">No diagnostic reports generated yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CARE PLANS */}
          {activePatientTab === "carePlan" && (
            <div className="-m-6">
              {isBuildingCarePlan || activeCarePlanId ? (
                 <CarePlanBuilder
                    patientId={patient.id}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    existingPlanId={activeCarePlanId}
                    isReadOnly={!!activeCarePlanId}
                    onSave={(plan) => {
                       setIsBuildingCarePlan(false);
                       setActiveCarePlanId(null);
                       window.dispatchEvent(new Event('storage')); // trigger refresh
                    }}
                    onCancel={() => {
                       setIsBuildingCarePlan(false);
                       setActiveCarePlanId(null);
                    }}
                 />
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                       <input
                         type="text"
                         placeholder="Search care plans..."
                         value={carePlanSearchQuery}
                         onChange={(e) => setCarePlanSearchQuery(e.target.value)}
                         className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                       />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'carePlan' ? null : 'carePlan')}
                        className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${activeFilterDropdown === 'carePlan' ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      {activeFilterDropdown === 'carePlan' && (
                         <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                               <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                               <button onClick={() => setActiveFilterDropdown(null)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-sm text-neutral-500">More filters coming soon.</p>
                         </div>
                      )}
                    </div>
                    <button onClick={() => setIsBuildingCarePlan(true)} className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                      Build New Care Plan
                    </button>
                  </div>
                  
                  {savedCarePlans.length > 0 ? (
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                             <tr>
                                <th className="px-6 py-4 font-medium">Care Plan ID</th>
                                <th className="px-6 py-4 font-medium">Date Prepared</th>
                                <th className="px-6 py-4 font-medium">Total Visits</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                             {savedCarePlans.map(plan => (
                                <tr key={plan.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                   <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-primary-500" />
                                      {plan.id.slice(0, 10)}...
                                   </td>
                                   <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                                      {new Date(plan.datePrepared).toLocaleDateString()}
                                   </td>
                                   <td className="px-6 py-4">
                                      {plan.scheduleRows.reduce((acc, row) => acc + (row.timesPerWeek * row.durationWeeks), 0)} visits
                                   </td>
                                   <td className="px-6 py-4 text-right whitespace-nowrap">
                                       <button onClick={() => handleViewReport(plan.id, "carePlan")} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                                       <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline" onClick={() => {
                                         const content = `CARE PLAN\nID: ${plan.id}\nPatient: ${patient.firstName} ${patient.lastName}\nDate: ${new Date(plan.datePrepared).toLocaleDateString()}`;
                                         const blob = new Blob([content], { type: 'text/plain' });
                                         const url = URL.createObjectURL(blob);
                                         const a = document.createElement('a');
                                         a.href = url;
                                         a.download = `Care_Plan_${plan.id}.txt`;
                                         a.click();
                                         URL.revokeObjectURL(url);
                                       }}>Download</button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/20">
                      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800">
                        <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Care Plans Yet</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                        Construct explicit treatment itineraries and schedules natively decoupled from ordinary SOAP note charting.
                      </p>
                      <button onClick={() => setIsBuildingCarePlan(true)} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Build New Care Plan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: FINANCIAL PLANS */}
          {activePatientTab === "financialPlans" && (
            <div className="-m-6">
              {isBuildingFinancialPlan || activeFinancialPlanId ? (
                 <FinancialPlanBuilder
                    patientId={patient.id}
                    patientName={`${patient.firstName} ${patient.lastName}`}
                    existingPlanId={activeFinancialPlanId}
                    isReadOnly={!!activeFinancialPlanId}
                    onSave={(plan) => {
                       setIsBuildingFinancialPlan(false);
                       setActiveFinancialPlanId(null);
                       window.dispatchEvent(new Event('storage')); // trigger refresh
                    }}
                    onCancel={() => {
                       setIsBuildingFinancialPlan(false);
                       setActiveFinancialPlanId(null);
                    }}
                 />
              ) : (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search financial agreements..."
                        value={financialPlanSearchQuery}
                        onChange={(e) => setFinancialPlanSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'financialPlans' ? null : 'financialPlans')}
                        className={`h-10 w-10 flex items-center justify-center border rounded-lg transition-colors ${activeFilterDropdown === 'financialPlans' ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      {activeFilterDropdown === 'financialPlans' && (
                         <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-4 z-50 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                               <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Filters</h4>
                               <button onClick={() => setActiveFilterDropdown(null)} className="text-neutral-400 hover:text-neutral-600"><X className="w-4 h-4" /></button>
                            </div>
                            <p className="text-sm text-neutral-500">More filters coming soon.</p>
                         </div>
                      )}
                    </div>
                    <button onClick={() => setIsBuildingFinancialPlan(true)} className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
                      New Financial Plan
                    </button>
                  </div>
                  
                  {savedFinancialPlans.length > 0 ? (
                    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                             <tr>
                                <th className="px-6 py-4 font-medium">Agreement ID</th>
                                <th className="px-6 py-4 font-medium">Date Prepared</th>
                                <th className="px-6 py-4 font-medium">Investment</th>
                                <th className="px-6 py-4 font-medium">Payment Mode</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                              {savedFinancialPlans.map(plan => (
                                 <tr key={plan.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                                       <Wallet className="w-4 h-4 text-green-500" />
                                       {plan.id.slice(0, 10)}...
                                    </td>
                                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                                       {new Date(plan.datePrepared).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                       ${plan.totalInvestment.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 capitalize text-neutral-600 dark:text-neutral-400">
                                       {plan.selectedPaymentMode.replace('-', ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                      <button onClick={() => handleViewReport(plan.id, "financialPlan")} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                                      <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline" onClick={() => {
                                        const content = `FINANCIAL PLAN\nID: ${plan.id}\nPatient: ${patient.firstName} ${patient.lastName}\nDate: ${new Date(plan.datePrepared).toLocaleDateString()}\nTotal Investment: $${plan.totalInvestment}\nPayment Mode: ${plan.selectedPaymentMode}`;
                                        const blob = new Blob([content], { type: 'text/plain' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `Financial_Plan_${plan.id}.txt`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                      }}>Download</button>
                                    </td>
                                 </tr>
                              ))}
                          </tbody>
                       </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800/20">
                      <div className="w-16 h-16 bg-green-50 dark:bg-green-900/40 rounded-full flex items-center justify-center mb-4 border border-green-100 dark:border-green-800">
                        <Wallet className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No Financial Plans Yet</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
                        Create customized financial payment structure agreements independent of charting logic.
                      </p>
                      <button onClick={() => setIsBuildingFinancialPlan(true)} className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        New Financial Plan
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: KDT REPORTS */}
          {activePatientTab === "kdtReports" && (
            <div>
              <KDTReportsTabContent 
                reports={savedKDTReports}
                onCreateNew={() => setIsBuildingKDTReport(true)}
                onViewReport={(id) => handleViewReport(id, "kdt")}
              />
            </div>
          )}

          {/* TAB: STRUCTURAL INTEGRITY */}
          {activePatientTab === "structuralIntegrity" && (
            <div>
               <StructuralIntegrityTabContent 
                 reports={diagnosticReports}
                 onCreateNew={() => setIsBuildingStructuralIntegrity(true)}
                onViewReport={(id) => handleViewReport(id, "structuralIntegrity")}
               />
            </div>
          )}

          {/* TAB: SPINECLOUD WELLNESS */}
          {activePatientTab === "spineCloud" && (
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search wellness assessments..."
                    value={spineCloudSearchQuery}
                    onChange={(e) => setSpineCloudSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 outline-none"
                  />
                </div>
                <button 
                  onClick={() => setIsCreatingSpineCloud(true)} 
                  className="px-4 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                >
                  New Wellness Assessment
                </button>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400">
                    <tr>
                      <th className="px-5 py-3 font-medium">Date Completed</th>
                      <th className="px-5 py-3 font-medium">Overall Score</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {savedSpineCloudReports.length > 0 ? (
                      savedSpineCloudReports
                        .filter(report => report.id.toLowerCase().includes(spineCloudSearchQuery.toLowerCase()))
                        .map((report) => (
                          <tr key={report.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <td className="px-5 py-4 font-medium flex items-center gap-2 text-neutral-900 dark:text-white">
                              <Activity className="w-4 h-4 text-primary-500"/> 
                              {formatDate(report.completedAt)}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${report.score >= 80 ? 'text-success-600' : 'text-primary-600'}`}>
                                  {report.score.toFixed(1)}/100
                                </span>
                                <div className="w-24 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${report.score >= 80 ? 'bg-success-500' : 'bg-primary-500'}`} 
                                    style={{ width: `${report.score}%` }} 
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block ${report.status === 'final' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'}`}>
                                {report.status === 'final' ? 'Finalized' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <button onClick={() => handleViewReport(report.id, "spineCloud")} className="text-primary-600 dark:text-primary-400 font-medium hover:underline mr-4">Preview</button>
                              <button className="text-primary-600 dark:text-primary-400 font-medium hover:underline" onClick={() => {
                                 const content = `SPINECLOUD WELLNESS ASSESSMENT\nID: ${report.id}\nPatient: ${patient.firstName} ${patient.lastName}\nDate: ${formatDate(report.completedAt)}\nScore: ${report.score}/100`;
                                 const blob = new Blob([content], { type: 'text/plain' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `Wellness_Index_${report.id}.txt`;
                                 a.click();
                                 URL.revokeObjectURL(url);
                              }}>Download</button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-neutral-500">
                          No wellness assessments found. Start a new evaluation for this patient.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* RIGHT COLUMN: narrow column */}
        <div className="w-full lg:w-64 shrink-0 space-y-3 order-1 lg:order-2">
           {/* Mini Patient Card */}
           <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm flex flex-col items-center">
               <div className="relative mb-3">
                 {patient.profilePicture ? (
                   <img
                     src={patient.profilePicture}
                     alt={`${patient.firstName} ${patient.lastName}`}
                     className="w-16 h-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700 mx-auto"
                   />
                 ) : (
                   <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white mx-auto">
                     <User className="w-8 h-8" />
                   </div>
                 )}
               </div>
               <h3 className="text-base font-semibold text-neutral-900 dark:text-white text-center">{patient.firstName} {patient.lastName}</h3>
               <p className="text-xs text-neutral-500 mb-4 text-center">{calculateAge(patient.dateOfBirth)} yrs • {getGenderDisplay(patient.gender)}</p>
               
               <div className="w-full space-y-1.5 text-xs">
                 <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                    <span className="text-neutral-500">DOB</span>
                    <span className="font-medium text-neutral-900 dark:text-white">{formatDate(patient.dateOfBirth)}</span>
                 </div>
                 <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                    <span className="text-neutral-500">Phone</span>
                    <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[120px]">{patient.phone}</span>
                 </div>
                 <div className="flex justify-between items-start py-1">
                    <span className="text-neutral-500 shrink-0">Email</span>
                    <span className="font-medium text-neutral-900 dark:text-white break-all text-right max-w-[150px] leading-tight">{patient.email}</span>
                 </div>
               </div>
           </div>

           {/* Quick links */}
           <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 shadow-sm flex flex-col gap-1">
              {["overview", "appointments", "soap", "reports", "carePlan", "financialPlans", "kdtReports", "structuralIntegrity", "spineCloud"].map((tab) => {
               let label = tab.charAt(0).toUpperCase() + tab.slice(1);
               if(tab === "carePlan") label = "Care Plans";
               if(tab === "financialPlans") label = "Financial Plans";
               if(tab === "soap") label = "SOAP Notes";
               if(tab === "reports") label = "DICOM Reports";
                if(tab === "kdtReports") label = "KDT Reports";
                if(tab === "structuralIntegrity") label = "Structural Integrity";
                if(tab === "spineCloud") label = "SpineCloud Wellness";
               return (
                 <button
                   key={tab}
                   onClick={() => setActivePatientTab(tab as any)}
                   className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                     activePatientTab === tab
                       ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                       : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
                   }`}
                 >
                   {label}
                 </button>
               )
             })}
           </div>
        </div>
      </div>
      
      {/* Modals */}
      {isComparingDicom && (
        <div className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Comparing DICOM Reports</h2>
                <p className="text-sm text-neutral-500">{selectedDicomIds.length} Reports Selected</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content = selectedDicomIds.map((id, i) => {
                      const report = diagnosticReports.find(r => r.id === id);
                      return `Report ${i + 1}: ${(report?.type || '').replace('-', ' ')} Report\nDate: ${new Date(report?.date || '').toLocaleDateString()}\n\nAnalysis: ${report?.data?.findings || "No findings recorded."}\n`;
                    }).join('\n---\n\n');
                    const blob = new Blob([`DICOM Comparison Report\nPatient: ${patient.firstName} ${patient.lastName}\nGenerated: ${new Date().toLocaleDateString()}\n\nComparison Notes:\n${comparisonNote}\n\n${content}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `DICOM_Comparison_${patient.firstName}_${patient.lastName}_${new Date().toISOString().split('T')[0]}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Download TXT
                </button>
                <button
                  onClick={() => {
                    const selectedReports = selectedDicomIds.map(id => diagnosticReports.find(r => r.id === id)).filter(Boolean);
                    const combinedTitle = selectedReports.map(r => r!.type.replace('-', ' ')).join(' + ');
                    const newReport = {
                      id: `comp-${Date.now()}`,
                      type: "Comparison Report",
                      date: new Date().toISOString(),
                      data: {
                        id: `comp-${Date.now()}`,
                        type: combinedTitle,
                        comparisonNotes: comparisonNote || "Clinical comparison of multiple studies.",
                        images: selectedReports.map(r => ({
                          type: r!.type,
                          imageUrl: r!.data?.imageUrl || (r!.data?.images ? r!.data.images[0].imageUrl : ""),
                          findings: r!.data?.findings || (r!.data?.images ? r!.data.images[0].findings : "")
                        }))
                      }
                    };
                    setDiagnosticReports(prev => [newReport, ...prev]);
                    setIsComparingDicom(false);
                    setSelectedDicomIds([]);
                    setComparisonNote("");
                    // Show the saved report immediately in preview
                    handleViewReport(newReport.id, "dicom");
                  }}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Save to Record
                </button>
                <button 
                  onClick={() => setIsComparingDicom(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-neutral-100 dark:bg-neutral-950">
               <div className="space-y-6">
                 <div className={`grid gap-6 ${selectedDicomIds.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : selectedDicomIds.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {selectedDicomIds.map((id, index) => {
                       const report = diagnosticReports.find(r => r.id === id);
                       const mainImageUrl = report?.data?.imageUrl || (report?.data?.images ? report?.data.images[0].imageUrl : "");
                       const findings = report?.data?.findings || (report?.data?.images ? report?.data.images[0].findings : "");
                       
                       return (
                         <div key={id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden flex flex-col">
                            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex justify-between items-center">
                              <span className="font-bold text-neutral-900 dark:text-white capitalize">{report?.type.replace("-", " ")}</span>
                              <span className="text-xs text-neutral-500 font-medium">{new Date(report?.date || "").toLocaleDateString()}</span>
                            </div>
                            <div className="aspect-[4/3] bg-black w-full relative group">
                               {mainImageUrl ? (
                                 <img src={mainImageUrl} className="w-full h-full object-contain" alt="DICOM" />
                               ) : (
                                 <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-neutral-600 font-mono tracking-widest text-sm opacity-50">DICOM_{index + 1}.dcm</span>
                                 </div>
                               )}
                            </div>
                            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Analysis Findings</h4>
                               <p className="text-sm text-neutral-700 dark:text-neutral-300 italic font-medium leading-relaxed">
                                 {findings || "No specific findings recorded."}
                               </p>
                            </div>
                         </div>
                       );
                    })}
                 </div>

                 {/* Comparison Note Section */}
                 <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                       <FileText className="w-4 h-4 text-primary-500" />
                       Clinical Comparison Notes
                    </h3>
                    <textarea
                       value={comparisonNote}
                       onChange={(e) => setComparisonNote(e.target.value)}
                       placeholder="Enter your clinical summary comparing these studies..."
                       className="w-full h-32 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    />
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      <NewReportModal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        onSelect={(type) => {
          setIsNewReportModalOpen(false);
          setActiveReportType(type);
        }}
      />      {isBuildingStructuralIntegrity && (
         <div className="fixed inset-0 z-[70] bg-white dark:bg-neutral-950 overflow-hidden">
            <StructuralIntegrityBuilder 
               patientName={`${patient.firstName} ${patient.lastName}`}
               onBack={() => setIsBuildingStructuralIntegrity(false)}
               onSave={(report) => {
                  localStorage.setItem(`structuralIntegrity_${report.id}`, JSON.stringify(report));
                  setDiagnosticReports(prev => [report, ...prev]);
                  setIsBuildingStructuralIntegrity(false);
                  handleViewReport(report.id, "structuralIntegrity");
               }}
            />
         </div>
      )}

      {isBuildingKDTReport && (
        <div className="fixed inset-0 z-[80] bg-white dark:bg-neutral-950 overflow-hidden">
          <KDTReportBuilder 
            patientId={patient.id}
            patientName={`${patient.firstName} ${patient.lastName}`}
            existingReportId={activeKDTReportId}
            isReadOnly={!!activeKDTReportId}
            onCancel={() => {
              setIsBuildingKDTReport(false);
              setActiveKDTReportId(null);
            }}
            onSave={(report) => {
              localStorage.setItem(`kdtReport_${report.id}`, JSON.stringify(report));
              setIsBuildingKDTReport(false);
              setActiveKDTReportId(null);
              setSavedKDTReports(prev => [report, ...prev]);
              handleViewReport(report.id, "kdt");
            }}
          />
        </div>
      )}

      {isPreviewingReport && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <UnifiedReportPreviewModal 
            type={selectedReportType!}
            data={selectedReportData}
            patientName={`${patient.firstName} ${patient.lastName}`}
            onClose={() => setIsPreviewingReport(false)}
          />
        </div>
      )}
      </ProviderLayout>
      {isPreviewingReport && selectedReportType && selectedReportData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <UnifiedReportPreviewModal
            type={selectedReportType}
            data={selectedReportData}
            patientName={`${patient.firstName} ${patient.lastName}`}
            onClose={() => setIsPreviewingReport(false)}
          />
        </div>
      )}
    </>
  );
}
