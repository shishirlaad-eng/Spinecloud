import { Printer, X, Download, User, CalendarDays, Stethoscope, Ruler, FileSearch } from "lucide-react";
import spineCloudLogo from "../../../assets/spinecloud-logo.png";

interface DicomImage {
  type: string;
  imageUrl?: string;
  standardImageUrl?: string;
  findings: string;
  interpretation?: string;
}

interface DicomReportData {
  id: string;
  images?: DicomImage[];
  imageUrl?: string;
  type?: string;
  findings?: string;
  comparisonNotes?: string;
  dateOfAnalysis?: string;
  dateOfImages?: string;
  dateOfInjury?: string;
  referringDoctor?: string;
  clinicName?: string;
  clinicAddress?: string;
}

interface DicomReportPreviewProps {
  data: DicomReportData;
  patientName: string;
  patientDOB?: string;
  onClose: () => void;
  onSave?: () => void;
}

// ── Strict Color System ───────────────────────────────────────────────────────
const COLORS = {
  primaryBlue: "#1d77b4",
  accentGreen: "#8CC63F",
  textDark: "#0b1c30",
  textLight: "#707881",
  divider: "#c0c7d1",
  bgGradientStart: "#f8f9ff",
  bgGradientEnd: "#ffffff",
};

// ── Reusable Footer ───────────────────────────────────────────────────────────
const ReportFooter = ({
  patientName,
  patientDOB,
  dateOfAnalysis,
  provider,
}: {
  patientName: string;
  patientDOB?: string;
  dateOfAnalysis: string;
  provider: string;
}) => (
  <div className="absolute bottom-0 left-0 w-full">
    <div className="px-16 pb-8 pt-4">
      <div className="flex justify-between items-center pb-2 border-t" style={{ borderColor: COLORS.divider, paddingTop: '20px' }}>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 stroke-[2]" style={{ color: COLORS.textLight }} />
          <div>
            <p className="uppercase tracking-wider text-[8px] mb-0.5" style={{ color: COLORS.textLight }}>Patient Name</p>
            <p className="text-[10px] font-semibold" style={{ color: COLORS.textDark }}>{patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 stroke-[2]" style={{ color: COLORS.textLight }} />
          <div>
            <p className="uppercase tracking-wider text-[8px] mb-0.5" style={{ color: COLORS.textLight }}>Date of Birth</p>
            <p className="text-[10px] font-semibold" style={{ color: COLORS.textDark }}>{patientDOB || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="w-4 h-4 stroke-[2]" style={{ color: COLORS.textLight }} />
          <div>
            <p className="uppercase tracking-wider text-[8px] mb-0.5" style={{ color: COLORS.textLight }}>Analysis Date</p>
            <p className="text-[10px] font-semibold" style={{ color: COLORS.textDark }}>{dateOfAnalysis}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 stroke-[2]" style={{ color: COLORS.textLight }} />
          <div>
            <p className="uppercase tracking-wider text-[8px] mb-0.5" style={{ color: COLORS.textLight }}>Provider</p>
            <p className="text-[10px] font-semibold" style={{ color: COLORS.textDark }}>{provider}</p>
          </div>
        </div>
      </div>
    </div>
    <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="w-full h-12 block">
      <path d="M0,6 Q50,16 100,0 L100,12 L0,12 Z" fill={COLORS.primaryBlue} />
      <path d="M0,0 Q50,10 100,-6 L100,6 Q50,16 0,6 Z" fill={COLORS.accentGreen} />
    </svg>
  </div>
);

// ── Reusable Static Header ────────────────────────────────────────────────────
const StaticHeader = ({ rightText }: { rightText?: string }) => (
  <div className="w-full flex justify-between items-start px-16 pt-12 pb-6 z-20 relative">
    <div className="flex flex-col">
      <img src={spineCloudLogo} alt="SpineCloudIQ" className="h-[5.5rem] w-auto max-w-[400px] object-contain object-left" />
    </div>
    {rightText && (
      <h3 className="text-[13px] font-bold tracking-widest uppercase mt-4" style={{ color: COLORS.primaryBlue }}>
        {rightText}
      </h3>
    )}
  </div>
);

// ── Cover Page ─────────────────────────────────────────────────────────────────
function CoverPage({
  data,
  patientName,
  patientDOB,
}: {
  data: DicomReportData;
  patientName: string;
  patientDOB?: string;
}) {
  const dateOfAnalysis = data.dateOfAnalysis
    ? new Date(data.dateOfAnalysis).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const provider = data.referringDoctor || "SpineCloud Provider";
  
  const mainImageTitle = data.images?.[0]?.type || data.type || "SPINAL ANALYSIS";
  const titleWords = mainImageTitle.split(" ");
  const firstWord = titleWords[0] || "";
  const restWords = titleWords.slice(1).join(" ") || "";

  return (
    <div 
      className="report-page w-[794px] h-[1123px] relative flex flex-col shrink-0 overflow-hidden shadow-sm"
      style={{ background: `linear-gradient(135deg, ${COLORS.bgGradientStart} 0%, ${COLORS.bgGradientEnd} 100%)` }}
    >
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[60%] h-[90%] overflow-hidden pointer-events-none z-0">
         <div 
           className="absolute top-[50%] right-[-10%] -translate-y-1/2 w-[650px] h-[650px] rounded-full opacity-20"
           style={{ background: `radial-gradient(circle, ${COLORS.primaryBlue} 0%, transparent 70%)` }}
         ></div>
         <div 
           className="absolute top-0 right-[-10%] w-[90%] h-[100%]"
           style={{
             backgroundImage: 'url(/assets/clinical/spine_bg.png)',
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center right',
             backgroundSize: 'contain',
             opacity: 0.35,
             WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 95%), linear-gradient(to bottom, black 50%, transparent 95%)',
             WebkitMaskComposite: 'source-in',
             maskImage: 'linear-gradient(to left, black 0%, transparent 95%), linear-gradient(to bottom, black 0%, transparent 90%)',
             maskComposite: 'intersect'
           }}
         ></div>
      </div>

      <StaticHeader />

      <div className="flex-1 flex flex-col px-16 z-10 relative">
        {/* Title Area */}
        <div className="mt-8 mb-16">
          <div className="mb-4">
            <h2 className="text-[14px] font-bold tracking-widest uppercase mb-2" style={{ color: COLORS.accentGreen }}>
              THE RESULTS OF
            </h2>
            <div className="h-[4px] w-12" style={{ background: COLORS.accentGreen }}></div>
          </div>
          <h1 className="text-[64px] font-bold leading-[1.05] uppercase max-w-[600px] tracking-tight">
            <span style={{ color: COLORS.textDark, display: 'block' }}>{firstWord}</span>
            <span style={{ 
              background: `linear-gradient(to right, #2F8EDC, ${COLORS.primaryBlue})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: 'block'
            }}>
              {restWords}
            </span>
          </h1>
        </div>

        {/* Patient Info Blocks */}
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ background: '#E6F2FA' }}>
              <User className="w-6 h-6 stroke-[1.5]" style={{ color: COLORS.primaryBlue }} />
            </div>
            <div className="border-l-2 pl-6 py-1" style={{ borderColor: COLORS.divider }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: COLORS.textLight }}>PREPARED FOR</p>
              <p className="text-[22px] font-bold" style={{ color: COLORS.textDark }}>{patientName}</p>
            </div>
          </div>
          <div className="w-64 h-[1px] ml-4" style={{ background: COLORS.divider }}></div>

          <div className="flex items-center gap-6">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0" style={{ background: '#F4F8F0' }}>
              <CalendarDays className="w-6 h-6 stroke-[1.5]" style={{ color: COLORS.accentGreen }} />
            </div>
            <div className="border-l-2 pl-6 py-1" style={{ borderColor: COLORS.divider }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: COLORS.textLight }}>DATE OF ANALYSIS</p>
              <p className="text-[22px] font-bold" style={{ color: COLORS.textDark }}>{dateOfAnalysis}</p>
            </div>
          </div>
          <div className="w-64 h-[1px] ml-4" style={{ background: COLORS.divider }}></div>

          <div className="flex items-center gap-6">
            <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 border" style={{ background: '#F8FAFC', borderColor: COLORS.divider }}>
              <Stethoscope className="w-6 h-6 stroke-[1.5]" style={{ color: '#4B5563' }} />
            </div>
            <div className="border-l-2 pl-6 py-1" style={{ borderColor: COLORS.divider }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: COLORS.textLight }}>REFERRING DOCTOR</p>
              <p className="text-[22px] font-bold" style={{ color: COLORS.textDark }}>{provider}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-auto mb-32 px-4 text-center max-w-[650px] mx-auto">
          <div className="w-full h-[1px] mb-6" style={{ background: COLORS.divider }}></div>
          <p className="text-[11px] leading-[1.7] mb-3" style={{ color: COLORS.textLight }}>
            This report contains important information concerning structural changes that can be affecting your overall level of health and well-being. Spinal stability is a basic requirement for the protection of your nervous structures and the prevention of early mechanical deterioration of your spinal component.
          </p>
          <p className="text-[11px] leading-[1.7] mb-3" style={{ color: COLORS.textLight }}>
            Instability is generally considered to be a global increase in the movements associated with the occurrence of back, neck, and/or nerve root pain. Damage to any spinal structure produces some degree of spinal instability.
          </p>
          <p className="text-[11px] leading-[1.7]" style={{ color: COLORS.textLight }}>
            This computer aided digital analysis is an overview of your current level of spinal stability.
          </p>
        </div>
      </div>

      <ReportFooter
        patientName={patientName}
        patientDOB={patientDOB}
        dateOfAnalysis={dateOfAnalysis}
        provider={provider}
      />
    </div>
  );
}

// ── Analysis Page (one per image) ─────────────────────────────────────────────
function AnalysisPage({
  image,
  patientName,
  patientDOB,
  dateOfAnalysis,
  provider,
  reportTypeTitle,
}: {
  image: DicomImage;
  patientName: string;
  patientDOB?: string;
  dateOfAnalysis: string;
  provider: string;
  reportTypeTitle: string;
}) {
  const isAbnormal = image.findings?.toLowerCase().includes("abnormal") || true; 

  return (
    <div 
      className="report-page w-[794px] h-[1123px] relative flex flex-col shrink-0 page-break-before"
      style={{ background: `linear-gradient(135deg, ${COLORS.bgGradientStart} 0%, ${COLORS.bgGradientEnd} 100%)` }}
    >
      {/* Top Right Green Wave Graphic */}
      <svg className="absolute top-0 right-0 w-[200px] h-[100px] pointer-events-none" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path d="M0,0 L200,0 L200,100 Q100,80 0,0 Z" fill={COLORS.accentGreen} opacity="0.15" />
      </svg>

      <StaticHeader rightText={reportTypeTitle} />
      <div className="w-[calc(100%-128px)] mx-auto h-[1px] mb-8" style={{ background: COLORS.divider }}></div>

      <div className="px-16 flex-1 flex flex-col z-10 relative">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold uppercase tracking-widest mb-3" style={{ color: COLORS.primaryBlue }}>
            {image.type || "LATERAL CERVICAL ATLAS SKULL ANGLE"}
          </h2>
          <div className="flex w-full h-[3px]">
            <div className="w-16" style={{ background: COLORS.accentGreen }}></div>
            <div className="flex-1" style={{ background: COLORS.primaryBlue }}></div>
          </div>
        </div>

        {/* Images Row */}
        <div className="flex gap-6 mb-8 h-[400px]">
          {/* Standard Result */}
          <div className="flex-1 flex flex-col drop-shadow-md rounded-[14px] bg-white overflow-hidden">
            <div className="text-white text-[11px] font-bold py-2.5 px-5 uppercase tracking-wider" style={{ background: COLORS.primaryBlue }}>
              STANDARD RESULT
            </div>
            <div className="flex-1 bg-[#111] flex items-center justify-center relative overflow-hidden" style={{ border: `3px solid ${COLORS.primaryBlue}`, borderTop: 'none', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px' }}>
               {image.standardImageUrl ? (
                 <img src={image.standardImageUrl} alt="Standard" className="w-full h-full object-cover" />
               ) : (
                 <p className="text-neutral-500 text-xs">Standard Reference Not Available</p>
               )}
            </div>
          </div>

          {/* Patient Result */}
          <div className="flex-1 flex flex-col drop-shadow-md rounded-[14px] bg-white overflow-hidden">
            <div className="text-white text-[11px] font-bold py-2.5 px-5 uppercase tracking-wider" style={{ background: COLORS.accentGreen }}>
              PATIENT RESULT
            </div>
            <div className="flex-1 bg-[#111] flex items-center justify-center relative overflow-hidden" style={{ border: `3px solid ${COLORS.accentGreen}`, borderTop: 'none', borderBottomLeftRadius: '14px', borderBottomRightRadius: '14px' }}>
               {image.imageUrl ? (
                 <img src={image.imageUrl} alt="Patient" className="w-full h-full object-cover" />
               ) : (
                 <p className="text-neutral-500 text-xs">Patient Image Not Available</p>
               )}
            </div>
          </div>
        </div>

        {/* Result Box */}
        <div className="rounded-[16px] p-6 flex items-center gap-6 mb-6 shadow-sm" style={{ background: '#F8FAFC', border: `1px solid ${COLORS.divider}` }}>
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 bg-white drop-shadow-sm">
            <Ruler className="w-6 h-6 stroke-[1.5]" style={{ color: COLORS.primaryBlue }} />
          </div>
          <div>
            <p className="font-bold text-[11px] mb-1 uppercase tracking-widest" style={{ color: COLORS.accentGreen }}>RESULT:</p>
            <p className="font-bold text-[15px]" style={{ color: COLORS.primaryBlue }}>
              {image.findings}
            </p>
          </div>
        </div>

        {/* What This Means Box */}
        <div className="rounded-[16px] p-6 flex gap-6 mb-12 shadow-sm" style={{ background: '#F8FAFC', border: `1px solid ${COLORS.divider}` }}>
          <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 bg-white drop-shadow-sm">
            <FileSearch className="w-6 h-6 stroke-[1.5]" style={{ color: COLORS.accentGreen }} />
          </div>
          <div>
            <p className="font-bold text-[11px] mb-2 uppercase tracking-widest" style={{ color: COLORS.accentGreen }}>WHAT THIS MEANS</p>
            <div className="text-[13px] font-medium leading-[1.6] space-y-3" style={{ color: COLORS.textDark }}>
              {image.interpretation?.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              )) || (
                <p>This measurement evaluates the alignment and structural integrity of the specified region. Abnormal findings indicate a deviation from the expected normal biomechanical baseline, which can contribute to spinal stress and nervous system interference.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReportFooter
        patientName={patientName}
        patientDOB={patientDOB}
        dateOfAnalysis={dateOfAnalysis}
        provider={provider}
      />
    </div>
  );
}

// ── Default interpretations (Fallback) ────────────────────────────────────────
const DEFAULT_INTERPRETATIONS: Record<string, string> = {
  "Cervical Flexion": "The cervical flexion view evaluates ligamentous integrity and intersegmental motion.\nNormally this motion is smooth and coordinated.\nHypermobility or excessive translation can indicate instability or ligamentous sub-failure.",
  "Lumbar Lateral": "The lateral lumbar view assesses disc heights, vertebral alignment, and lordosis.\nNormal lordosis ranges from 30–50 degrees.\nReduction of disc height or altered curves indicates degenerative changes or mechanical stress.",
  "Lateral Cervical Atlas Skull Angle": "The Atlas-Skull angle compares the plane line of C1 to the plane line of the skull at the foramen magnum.\nNormally this angle is divergent posteriorly and averages 7.00 degrees.\nIf this angle is substantially increased it can suggest an Alar ligament sub-failure.\nIf the angle is reversed and is divergent to the anterior of the spine an extension subluxation is suggested.",
};

// ── Main component ────────────────────────────────────────────────────────────
export function DicomReportPreview({ data, patientName, patientDOB, onClose, onSave }: DicomReportPreviewProps) {
  const images: DicomImage[] = data.images
    ? data.images.map((img) => ({
        ...img,
        interpretation: img.interpretation || DEFAULT_INTERPRETATIONS[img.type] || DEFAULT_INTERPRETATIONS["Lateral Cervical Atlas Skull Angle"],
      }))
    : [
        {
          type: data.type || "LATERAL CERVICAL ATLAS SKULL ANGLE",
          imageUrl: data.imageUrl,
          findings: data.findings || "Lateral Cervical Atlas Skull Angle : ABNORMAL : -12.55 DEGREES",
          interpretation: DEFAULT_INTERPRETATIONS["Lateral Cervical Atlas Skull Angle"],
        },
      ];

  const dateOfAnalysis = data.dateOfAnalysis
    ? new Date(data.dateOfAnalysis).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  
  const provider = data.referringDoctor || "David A. Bohn, DC";
  const mainImageTitle = data.images?.[0]?.type || data.type || "CERVICAL FLEXION";

  return (
    <>
      <style>{`
        @media print {
          .report-modal-chrome { display: none !important; }
          body * { visibility: hidden; }
          #dicom-report-printable, #dicom-report-printable * { visibility: visible; }
          #dicom-report-printable { 
            position: absolute; left: 0; top: 0; width: 100%; 
            background: white !important;
            padding: 0 !important;
          }
          .report-page { 
            width: 100% !important; 
            height: auto !important;
            min-height: 100vh !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: always;
          }
          .page-break-before { page-break-before: always; }
        }
      `}</style>

      <div className="bg-neutral-100 w-full max-w-[850px] max-h-[90vh] overflow-auto rounded-2xl relative flex flex-col shadow-2xl">
        {/* ── Top Toolbar (Only Print, Download, Close) ── */}
        <div className="report-modal-chrome flex justify-between items-center px-6 py-3 border-b border-neutral-200 sticky top-0 bg-white z-50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-700">Report Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={() => {
                window.print(); 
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <div className="w-px h-5 bg-neutral-200 mx-1"></div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
            {onSave && (
              <>
                <div className="w-px h-5 bg-neutral-200 mx-1"></div>
                <button
                  onClick={onSave}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
                  style={{ background: COLORS.primaryBlue }}
                >
                  Save to Patient Record
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Report Body ── */}
        <div id="dicom-report-printable" className="flex-1 pb-10 bg-neutral-100 flex flex-col items-center gap-8 pt-8 font-sans">
          <CoverPage
            data={data}
            patientName={patientName}
            patientDOB={patientDOB}
          />

          {images.map((img, idx) => (
            <AnalysisPage
              key={idx}
              image={img}
              patientName={patientName}
              patientDOB={patientDOB}
              dateOfAnalysis={dateOfAnalysis}
              provider={provider}
              reportTypeTitle={mainImageTitle}
            />
          ))}
        </div>
      </div>
    </>
  );
}

