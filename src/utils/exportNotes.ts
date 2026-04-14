// Export utility for SOAP and P.A.R.T. notes
// This creates a downloadable text/HTML file with formatted notes

interface SOAPNote {
  id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: "draft" | "final";
  finalizedAt?: string;
  finalizedBy?: string;
}

interface PARTNote {
  id: string;
  progress: string;
  activities: string;
  response: string;
  treatment: string;
  status: "draft" | "final";
  finalizedAt?: string;
  finalizedBy?: string;
}

interface PatientInfo {
  name: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AppointmentInfo {
  date: string;
  time: string;
  type: string;
  provider: string;
  location?: string;
}

export const exportSOAPNotes = (
  soapNote: SOAPNote,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>SOAP Notes - ${patientInfo.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #171717;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      border-bottom: 3px solid #2563EB;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #2563EB;
      font-size: 28px;
    }
    .header .subtitle {
      color: #525252;
      font-size: 14px;
      margin: 5px 0;
    }
    .info-section {
      background: #F5F5F5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: 600;
      color: #404040;
      min-width: 140px;
    }
    .info-value {
      color: #171717;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #404040;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E5E5E5;
    }
    .section-content {
      color: #171717;
      white-space: pre-wrap;
      line-height: 1.8;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-draft {
      background: #FEF3C7;
      color: #92400E;
    }
    .status-final {
      background: #D1FAE5;
      color: #065F46;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #E5E5E5;
      text-align: center;
      color: #A3A3A3;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SOAP Notes</h1>
    <div class="subtitle">Clinical Documentation</div>
  </div>

  <div class="info-section">
    <div class="info-row">
      <div class="info-label">Patient:</div>
      <div class="info-value">${patientInfo.name}</div>
    </div>
    ${patientInfo.dateOfBirth ? `
    <div class="info-row">
      <div class="info-label">Date of Birth:</div>
      <div class="info-value">${formatDate(patientInfo.dateOfBirth)}</div>
    </div>
    ` : ''}
    ${patientInfo.gender ? `
    <div class="info-row">
      <div class="info-label">Gender:</div>
      <div class="info-value">${patientInfo.gender}</div>
    </div>
    ` : ''}
    <div class="info-row">
      <div class="info-label">Appointment Date:</div>
      <div class="info-value">${formatDate(appointmentInfo.date)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Appointment Time:</div>
      <div class="info-value">${appointmentInfo.time}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Service:</div>
      <div class="info-value">${appointmentInfo.type}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Provider:</div>
      <div class="info-value">${appointmentInfo.provider}</div>
    </div>
    ${appointmentInfo.location ? `
    <div class="info-row">
      <div class="info-label">Location:</div>
      <div class="info-value">${appointmentInfo.location}</div>
    </div>
    ` : ''}
    <div class="info-row">
      <div class="info-label">Status:</div>
      <div class="info-value">
        <span class="status-badge status-${soapNote.status}">
          ${soapNote.status === "final" ? "Finalized" : "Draft"}
        </span>
      </div>
    </div>
    ${soapNote.finalizedAt ? `
    <div class="info-row">
      <div class="info-label">Finalized At:</div>
      <div class="info-value">${formatDate(soapNote.finalizedAt)} ${formatTime(soapNote.finalizedAt)}</div>
    </div>
    ` : ''}
    ${soapNote.finalizedBy ? `
    <div class="info-row">
      <div class="info-label">Finalized By:</div>
      <div class="info-value">${soapNote.finalizedBy}</div>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <div class="section-title">Subjective</div>
    <div class="section-content">${soapNote.subjective || 'No subjective notes recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Objective</div>
    <div class="section-content">${soapNote.objective || 'No objective findings recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Assessment</div>
    <div class="section-content">${soapNote.assessment || 'No assessment recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Plan</div>
    <div class="section-content">${soapNote.plan || 'No treatment plan recorded.'}</div>
  </div>

  <div class="footer">
    <p>Exported on ${formatDate(new Date().toISOString())} ${formatTime(new Date().toISOString())}</p>
    <p>SpineCloudIQ - Patient Portal</p>
  </div>
</body>
</html>
  `;

  // Create a Blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `SOAP_Notes_${patientInfo.name.replace(/\s+/g, "_")}_${appointmentInfo.date}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportPARTNotes = (
  partNote: PARTNote,
  patientInfo: PatientInfo,
  appointmentInfo: AppointmentInfo
) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>P.A.R.T. Notes - ${patientInfo.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #171717;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      border-bottom: 3px solid #2563EB;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #2563EB;
      font-size: 28px;
    }
    .header .subtitle {
      color: #525252;
      font-size: 14px;
      margin: 5px 0;
    }
    .info-section {
      background: #F5F5F5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      font-weight: 600;
      color: #404040;
      min-width: 140px;
    }
    .info-value {
      color: #171717;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #404040;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E5E5E5;
    }
    .section-content {
      color: #171717;
      white-space: pre-wrap;
      line-height: 1.8;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-draft {
      background: #FEF3C7;
      color: #92400E;
    }
    .status-final {
      background: #D1FAE5;
      color: #065F46;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #E5E5E5;
      text-align: center;
      color: #A3A3A3;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>P.A.R.T. Notes</h1>
    <div class="subtitle">Progress, Activities, Response & Treatment Documentation</div>
  </div>

  <div class="info-section">
    <div class="info-row">
      <div class="info-label">Patient:</div>
      <div class="info-value">${patientInfo.name}</div>
    </div>
    ${patientInfo.dateOfBirth ? `
    <div class="info-row">
      <div class="info-label">Date of Birth:</div>
      <div class="info-value">${formatDate(patientInfo.dateOfBirth)}</div>
    </div>
    ` : ''}
    ${patientInfo.gender ? `
    <div class="info-row">
      <div class="info-label">Gender:</div>
      <div class="info-value">${patientInfo.gender}</div>
    </div>
    ` : ''}
    <div class="info-row">
      <div class="info-label">Appointment Date:</div>
      <div class="info-value">${formatDate(appointmentInfo.date)}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Appointment Time:</div>
      <div class="info-value">${appointmentInfo.time}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Service:</div>
      <div class="info-value">${appointmentInfo.type}</div>
    </div>
    <div class="info-row">
      <div class="info-label">Provider:</div>
      <div class="info-value">${appointmentInfo.provider}</div>
    </div>
    ${appointmentInfo.location ? `
    <div class="info-row">
      <div class="info-label">Location:</div>
      <div class="info-value">${appointmentInfo.location}</div>
    </div>
    ` : ''}
    <div class="info-row">
      <div class="info-label">Status:</div>
      <div class="info-value">
        <span class="status-badge status-${partNote.status}">
          ${partNote.status === "final" ? "Finalized" : "Draft"}
        </span>
      </div>
    </div>
    ${partNote.finalizedAt ? `
    <div class="info-row">
      <div class="info-label">Finalized At:</div>
      <div class="info-value">${formatDate(partNote.finalizedAt)} ${formatTime(partNote.finalizedAt)}</div>
    </div>
    ` : ''}
    ${partNote.finalizedBy ? `
    <div class="info-row">
      <div class="info-label">Finalized By:</div>
      <div class="info-value">${partNote.finalizedBy}</div>
    </div>
    ` : ''}
  </div>

  <div class="section">
    <div class="section-title">Progress</div>
    <div class="section-content">${partNote.progress || 'No progress notes recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Activities</div>
    <div class="section-content">${partNote.activities || 'No activities recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Response</div>
    <div class="section-content">${partNote.response || 'No response recorded.'}</div>
  </div>

  <div class="section">
    <div class="section-title">Treatment</div>
    <div class="section-content">${partNote.treatment || 'No treatment recorded.'}</div>
  </div>

  <div class="footer">
    <p>Exported on ${formatDate(new Date().toISOString())} ${formatTime(new Date().toISOString())}</p>
    <p>SpineCloudIQ - Patient Portal</p>
  </div>
</body>
</html>
  `;

  // Create a Blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `PART_Notes_${patientInfo.name.replace(/\s+/g, "_")}_${appointmentInfo.date}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
