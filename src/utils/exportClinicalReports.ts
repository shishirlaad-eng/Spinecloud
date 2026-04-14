interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  subjectiveCodes?: ICDCPTCode[];
  objectiveCodes?: ICDCPTCode[];
  assessmentCodes?: ICDCPTCode[];
  planCodes?: ICDCPTCode[];
  status: "draft" | "final";
  finalizedAt?: string;
  finalizedBy?: string;
}

interface PARTNote {
  presentation: string;
  assessment: string;
  results: string;
  treatment: string;
  status: "draft" | "final";
  finalizedAt?: string;
  finalizedBy?: string;
}

interface ImagingData {
  images: Array<{
    id: string;
    url: string;
    name: string;
    type: string;
    uploadedAt: string;
    notes?: string;
  }>;
}

interface PatientInfo {
  name: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AppointmentInfo {
  date: string;
  time: string;
  service: string;
  location?: string;
  provider: string;
}

// Helper function to format codes
function formatICDCPTCodes(codes: ICDCPTCode[] | undefined): string {
  if (!codes || codes.length === 0) return "  None recorded\n";
  
  return codes.map(code => `  • ${code.type} ${code.code}: ${code.description}`).join("\n") + "\n";
}

// Export SOAP Notes
export function exportSOAPReport(
  soapNote: SOAPNote,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
): void {
  const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         SOAP CLINICAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION
──────────────────────────────────────────────────────────────────
Patient Name:        ${patientInfo.name}
${patientInfo.dateOfBirth ? `Date of Birth:       ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}` : ""}
${patientInfo.gender ? `Gender:              ${patientInfo.gender}` : ""}

APPOINTMENT INFORMATION
──────────────────────────────────────────────────────────────────
Date:                ${new Date(appointmentInfo.date).toLocaleDateString()}
Time:                ${appointmentInfo.time}
Service:             ${appointmentInfo.service}
${appointmentInfo.location ? `Location:            ${appointmentInfo.location}` : ""}
Provider:            ${appointmentInfo.provider}

DOCUMENT STATUS
──────────────────────────────────────────────────────────────────
Status:              ${soapNote.status === "final" ? "Finalized" : "Draft"}
${soapNote.finalizedAt ? `Finalized On:        ${new Date(soapNote.finalizedAt).toLocaleString()}` : ""}
${soapNote.finalizedBy ? `Finalized By:        ${soapNote.finalizedBy}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           SOAP NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBJECTIVE
──────────────────────────────────────────────────────────────────
${soapNote.subjective || "No subjective notes recorded."}

ICD-CPT Codes (Subjective):
${formatICDCPTCodes(soapNote.subjectiveCodes)}

OBJECTIVE
──────────────────────────────────────────────────────────────────
${soapNote.objective || "No objective notes recorded."}

ICD-CPT Codes (Objective):
${formatICDCPTCodes(soapNote.objectiveCodes)}

ASSESSMENT
──────────────────────────────────────────────────────────────────
${soapNote.assessment || "No assessment notes recorded."}

ICD-CPT Codes (Assessment):
${formatICDCPTCodes(soapNote.assessmentCodes)}

PLAN
──────────────────────────────────────────────────────────────────
${soapNote.plan || "No plan notes recorded."}

ICD-CPT Codes (Plan):
${formatICDCPTCodes(soapNote.planCodes)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    END OF SOAP CLINICAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toLocaleString()}
`;

  downloadTextFile(
    content,
    `SOAP_Notes_${patientInfo.name.replace(/\s+/g, "_")}_${new Date(appointmentInfo.date).toISOString().split("T")[0]}.txt`
  );
}

// Export P.A.R.T. Notes
export function exportPARTReport(
  partNote: PARTNote,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
): void {
  const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         P.A.R.T. CLINICAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION
──────────────────────────────────────────────────────────────────
Patient Name:        ${patientInfo.name}
${patientInfo.dateOfBirth ? `Date of Birth:       ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}` : ""}
${patientInfo.gender ? `Gender:              ${patientInfo.gender}` : ""}

APPOINTMENT INFORMATION
──────────────────────────────────────────────────────────────────
Date:                ${new Date(appointmentInfo.date).toLocaleDateString()}
Time:                ${appointmentInfo.time}
Service:             ${appointmentInfo.service}
${appointmentInfo.location ? `Location:            ${appointmentInfo.location}` : ""}
Provider:            ${appointmentInfo.provider}

DOCUMENT STATUS
──────────────────────────────────────────────────────────────────
Status:              ${partNote.status === "final" ? "Finalized" : "Draft"}
${partNote.finalizedAt ? `Finalized On:        ${new Date(partNote.finalizedAt).toLocaleString()}` : ""}
${partNote.finalizedBy ? `Finalized By:        ${partNote.finalizedBy}` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           P.A.R.T. NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRESENTATION
──────────────────────────────────────────────────────────────────
${partNote.presentation || "No presentation notes recorded."}

ASSESSMENT
──────────────────────────────────────────────────────────────────
${partNote.assessment || "No assessment notes recorded."}

RESULTS
──────────────────────────────────────────────────────────────────
${partNote.results || "No results notes recorded."}

TREATMENT
──────────────────────────────────────────────────────────────────
${partNote.treatment || "No treatment notes recorded."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    END OF P.A.R.T. CLINICAL NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toLocaleString()}
`;

  downloadTextFile(
    content,
    `PART_Notes_${patientInfo.name.replace(/\s+/g, "_")}_${new Date(appointmentInfo.date).toISOString().split("T")[0]}.txt`
  );
}

// Export Imaging Report
export function exportImagingReport(
  imagingData: ImagingData,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
): void {
  const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         IMAGING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION
──────────────────────────────────────────────────────────────────
Patient Name:        ${patientInfo.name}
${patientInfo.dateOfBirth ? `Date of Birth:       ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}` : ""}
${patientInfo.gender ? `Gender:              ${patientInfo.gender}` : ""}

APPOINTMENT INFORMATION
──────────────────────────────────────────────────────────────────
Date:                ${new Date(appointmentInfo.date).toLocaleDateString()}
Time:                ${appointmentInfo.time}
Service:             ${appointmentInfo.service}
${appointmentInfo.location ? `Location:            ${appointmentInfo.location}` : ""}
Provider:            ${appointmentInfo.provider}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           IMAGING FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${imagingData.images.length === 0 ? "No imaging files recorded." : ""}
${imagingData.images.map((img, index) => `
Image ${index + 1}:
  File Name:         ${img.name}
  Type:              ${img.type}
  Uploaded:          ${new Date(img.uploadedAt).toLocaleString()}
  ${img.notes ? `Notes:             ${img.notes}` : ""}
  URL:               ${img.url}
`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        END OF IMAGING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toLocaleString()}
`;

  downloadTextFile(
    content,
    `Imaging_Report_${patientInfo.name.replace(/\s+/g, "_")}_${new Date(appointmentInfo.date).toISOString().split("T")[0]}.txt`
  );
}

// Export Combined Report
export function exportCombinedReport(
  soapNote: SOAPNote | null,
  partNote: PARTNote | null,
  imagingData: ImagingData | null,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
): void {
  const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    COMPREHENSIVE CLINICAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT INFORMATION
──────────────────────────────────────────────────────────────────
Patient Name:        ${patientInfo.name}
${patientInfo.dateOfBirth ? `Date of Birth:       ${new Date(patientInfo.dateOfBirth).toLocaleDateString()}` : ""}
${patientInfo.gender ? `Gender:              ${patientInfo.gender}` : ""}

APPOINTMENT INFORMATION
──────────────────────────────────────────────────────────────────
Date:                ${new Date(appointmentInfo.date).toLocaleDateString()}
Time:                ${appointmentInfo.time}
Service:             ${appointmentInfo.service}
${appointmentInfo.location ? `Location:            ${appointmentInfo.location}` : ""}
Provider:            ${appointmentInfo.provider}

${soapNote ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           SOAP NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${soapNote.status === "final" ? "Finalized" : "Draft"}
${soapNote.finalizedAt ? `Finalized On: ${new Date(soapNote.finalizedAt).toLocaleString()}` : ""}
${soapNote.finalizedBy ? `Finalized By: ${soapNote.finalizedBy}` : ""}

SUBJECTIVE
──────────────────────────────────────────────────────────────────
${soapNote.subjective || "No subjective notes recorded."}

ICD-CPT Codes (Subjective):
${formatICDCPTCodes(soapNote.subjectiveCodes)}

OBJECTIVE
──────────────────────────────────────────────────────────────────
${soapNote.objective || "No objective notes recorded."}

ICD-CPT Codes (Objective):
${formatICDCPTCodes(soapNote.objectiveCodes)}

ASSESSMENT
──────────────────────────────────────────────────────────────────
${soapNote.assessment || "No assessment notes recorded."}

ICD-CPT Codes (Assessment):
${formatICDCPTCodes(soapNote.assessmentCodes)}

PLAN
──────────────────────────────────────────────────────────────────
${soapNote.plan || "No plan notes recorded."}

ICD-CPT Codes (Plan):
${formatICDCPTCodes(soapNote.planCodes)}
` : ""}

${partNote ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           P.A.R.T. NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${partNote.status === "final" ? "Finalized" : "Draft"}
${partNote.finalizedAt ? `Finalized On: ${new Date(partNote.finalizedAt).toLocaleString()}` : ""}
${partNote.finalizedBy ? `Finalized By: ${partNote.finalizedBy}` : ""}

PRESENTATION
──────────────────────────────────────────────────────────────────
${partNote.presentation || "No presentation notes recorded."}

ASSESSMENT
──────────────────────────────────────────────────────────────────
${partNote.assessment || "No assessment notes recorded."}

RESULTS
──────────────────────────────────────────────────────────────────
${partNote.results || "No results notes recorded."}

TREATMENT
──────────────────────────────────────────────────────────────────
${partNote.treatment || "No treatment notes recorded."}
` : ""}

${imagingData && imagingData.images.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           IMAGING FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${imagingData.images.map((img, index) => `
Image ${index + 1}:
  File Name:         ${img.name}
  Type:              ${img.type}
  Uploaded:          ${new Date(img.uploadedAt).toLocaleString()}
  ${img.notes ? `Notes:             ${img.notes}` : ""}
  URL:               ${img.url}
`).join("\n")}
` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              END OF COMPREHENSIVE CLINICAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated: ${new Date().toLocaleString()}
`;

  downloadTextFile(
    content,
    `Combined_Report_${patientInfo.name.replace(/\s+/g, "_")}_${new Date(appointmentInfo.date).toISOString().split("T")[0]}.txt`
  );
}

// Helper function to download text file
function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
