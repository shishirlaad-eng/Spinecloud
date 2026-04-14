import { useState } from "react";
import { X, Plus, Trash2, Download, Mail, Printer } from "lucide-react";

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface LinkedCodeGroup {
  id: string;
  icdCode: ICDCPTCode;
  cptCodes: ICDCPTCode[];
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  locationId: string;
  locationName: string;
  service: string;
  visitRef?: string;
  visitDate?: string;
  invoiceDate: string;
  dueDate?: string;
  totalAmount: number;
  status: "Unpaid" | "Paid";
  linkedCodeGroups?: LinkedCodeGroup[];
  lineItems?: LineItem[];
  paymentMethod?: string;
}

interface CreateInvoiceDrawerProps {
  show: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export function CreateInvoiceDrawer({
  show,
  onClose,
  onInvoiceCreated,
}: CreateInvoiceDrawerProps) {
  const [patientId, setPatientId] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [service, setService] = useState("");
  const [visitRef, setVisitRef] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState<"Unpaid" | "Paid">("Unpaid");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ]);
  const [linkedCodeGroups, setLinkedCodeGroups] = useState<LinkedCodeGroup[]>([]);

  // Mock data
  const patients = [
    { id: "PT-001", name: "Sarah Johnson" },
    { id: "PT-002", name: "James Wilson" },
    { id: "PT-003", name: "Maria Garcia" },
    { id: "PT-004", name: "Robert Chen" },
    { id: "PT-005", name: "Lisa Anderson" },
  ];

  const locations = [
    { id: "loc-1", name: "Downtown Clinic" },
    { id: "loc-2", name: "Westside Branch" },
    { id: "loc-3", name: "Eastside Clinic" },
  ];

  // Mock confirmed appointments with associated details
  const confirmedAppointments = {
    "PT-001": [
      {
        id: "APT-2026-123",
        serviceType: "Initial Consultation",
        date: "2026-01-25",
        locationId: "loc-1",
        locationName: "Downtown Clinic",
        linkedCodeGroups: [
          {
            id: "group-1",
            icdCode: { code: "M54.5", description: "Low back pain", type: "ICD" as const },
            cptCodes: [
              { code: "98941", description: "Chiropractic manipulative treatment (CMT) 3-4 regions", type: "CPT" as const },
              { code: "97010", description: "Hot or cold packs therapy", type: "CPT" as const },
            ],
          },
          {
            id: "group-2",
            icdCode: { code: "M79.1", description: "Myalgia (muscle pain)", type: "ICD" as const },
            cptCodes: [
              { code: "97110", description: "Therapeutic exercises", type: "CPT" as const },
            ],
          },
        ],
        lineItems: [
          { id: "1", description: "Chiropractic Adjustment", quantity: 1, rate: 150.00, amount: 150.00 },
          { id: "2", description: "Therapeutic Exercises", quantity: 1, rate: 100.00, amount: 100.00 },
          { id: "3", description: "Consultation Fee", quantity: 1, rate: 100.00, amount: 100.00 },
        ],
      },
    ],
    "PT-002": [
      {
        id: "APT-2026-124",
        serviceType: "Follow-up Visit",
        date: "2026-01-26",
        locationId: "loc-1",
        locationName: "Downtown Clinic",
        linkedCodeGroups: [
          {
            id: "group-3",
            icdCode: { code: "M99.03", description: "Segmental dysfunction", type: "ICD" as const },
            cptCodes: [
              { code: "98940", description: "Chiropractic manipulative treatment (CMT) 1-2 regions", type: "CPT" as const },
            ],
          },
        ],
        lineItems: [
          { id: "1", description: "Follow-up Adjustment", quantity: 1, rate: 120.00, amount: 120.00 },
          { id: "2", description: "Manual Therapy", quantity: 1, rate: 130.00, amount: 130.00 },
        ],
      },
    ],
    "PT-003": [
      {
        id: "APT-2026-125",
        serviceType: "Physical Therapy",
        date: "2026-01-27",
        locationId: "loc-2",
        locationName: "Westside Branch",
        linkedCodeGroups: [
          {
            id: "group-4",
            icdCode: { code: "M25.511", description: "Pain in right shoulder", type: "ICD" as const },
            cptCodes: [
              { code: "97140", description: "Manual therapy techniques", type: "CPT" as const },
              { code: "97530", description: "Therapeutic activities", type: "CPT" as const },
            ],
          },
        ],
        lineItems: [
          { id: "1", description: "Shoulder Treatment", quantity: 1, rate: 180.00, amount: 180.00 },
        ],
      },
    ],
  };

  // Get appointments for selected patient
  const patientAppointments = patientId
    ? confirmedAppointments[patientId as keyof typeof confirmedAppointments] || []
    : [];

  const handleAppointmentSelection = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    
    // Find the selected appointment
    const appointment = patientAppointments.find((apt) => apt.id === appointmentId);
    
    if (appointment) {
      // Auto-populate all fields
      setLocationId(appointment.locationId);
      setService(appointment.serviceType);
      setVisitRef(appointment.id);
      setVisitDate(appointment.date);
      setLinkedCodeGroups(appointment.linkedCodeGroups);
      setLineItems(appointment.lineItems);
    }
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleUpdateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Calculate amount
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleAddICDCPTGroup = () => {
    setLinkedCodeGroups([
      ...linkedCodeGroups,
      {
        id: Date.now().toString(),
        icdCode: { code: "", description: "", type: "ICD" },
        cptCodes: [{ code: "", description: "", type: "CPT" }],
      },
    ]);
  };

  const handleAddCPTToGroup = (groupId: string) => {
    setLinkedCodeGroups(linkedCodeGroups.map(g =>
      g.id === groupId
        ? { ...g, cptCodes: [...g.cptCodes, { code: "", description: "", type: "CPT" as const }] }
        : g
    ));
  };

  const handleRemoveCPTFromGroup = (groupId: string, cptIndex: number) => {
    setLinkedCodeGroups(linkedCodeGroups.map(g =>
      g.id === groupId
        ? { ...g, cptCodes: g.cptCodes.filter((_, i) => i !== cptIndex) }
        : g
    ));
  };

  const handleRemoveICDCPTGroup = (id: string) => {
    setLinkedCodeGroups(linkedCodeGroups.filter((g) => g.id !== id));
  };

  const handleUpdateGroupICD = (id: string, field: "code" | "description", value: string) => {
    setLinkedCodeGroups(linkedCodeGroups.map(g =>
      g.id === id ? { ...g, icdCode: { ...g.icdCode, [field]: value } } : g
    ));
  };

  const handleUpdateGroupCPT = (id: string, cptIndex: number, field: "code" | "description", value: string) => {
    setLinkedCodeGroups(linkedCodeGroups.map(g =>
      g.id === id
        ? { ...g, cptCodes: g.cptCodes.map((c, i) => i === cptIndex ? { ...c, [field]: value } : c) }
        : g
    ));
  };

  const handleCreateInvoice = () => {
    const patient = patients.find((p) => p.id === patientId);
    const location = locations.find((l) => l.id === locationId);

    if (!patient || !location) {
      alert("Please select patient and location");
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(Date.now()).slice(-3)}`,
      patientId,
      patientName: patient.name,
      locationId,
      locationName: location.name,
      service,
      visitRef,
      visitDate,
      invoiceDate,
      dueDate,
      totalAmount: calculateTotal(),
      status,
      linkedCodeGroups,
      lineItems,
      paymentMethod,
    };

    onInvoiceCreated(newInvoice);
    alert("Invoice created successfully!");
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setPatientId("");
    setLocationId("");
    setService("");
    setVisitRef("");
    setVisitDate("");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setDueDate("");
    setPaymentMethod("");
    setStatus("Unpaid");
    setLineItems([
      {
        id: "1",
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
    setLinkedCodeGroups([]);
    onClose();
  };

  const handleDownloadInvoice = () => {
    const patient = patients.find((p) => p.id === patientId);
    const location = locations.find((l) => l.id === locationId);

    if (!patient || !location) {
      alert("Please select patient and location");
      return;
    }

    let content = `INVOICE\n\n`;
    content += `Invoice Number: INV-2026-${String(Date.now()).slice(-3)}\n`;
    content += `Invoice Date: ${invoiceDate}\n`;
    content += `Due Date: ${dueDate || "N/A"}\n\n`;
    content += `Patient: ${patient.name}\n`;
    content += `Location: ${location.name}\n`;
    content += `Service: ${service}\n`;
    content += `Visit Reference: ${visitRef || "N/A"}\n`;
    content += `Visit Date: ${visitDate || "N/A"}\n\n`;

    if (linkedCodeGroups.length > 0) {
      content += `ICD-CPT CODES:\n`;
      linkedCodeGroups.forEach((group) => {
        content += `  ICD: ${group.icdCode.code} - ${group.icdCode.description}\n`;
        group.cptCodes.forEach(cpt => {
          content += `    CPT: ${cpt.code} - ${cpt.description}\n`;
        });
        content += `\n`;
      });
    }

    content += `\nLINE ITEMS:\n`;
    content += `Description\t\tQuantity\tRate\t\tAmount\n`;
    content += `-----------------------------------------------------------\n`;
    lineItems.forEach((item) => {
      content += `${item.description}\t\t${item.quantity}\t\t$${item.rate.toFixed(2)}\t\t$${item.amount.toFixed(2)}\n`;
    });
    content += `-----------------------------------------------------------\n`;
    content += `Total: $${calculateTotal().toFixed(2)}\n\n`;
    content += `Payment Method: ${paymentMethod || "N/A"}\n`;
    content += `Status: ${status}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleEmailInvoice = () => {
    alert("Email invoice functionality would be implemented here");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
      <div className="w-full max-w-3xl h-full bg-white dark:bg-neutral-950 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Create invoice
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Fill in the details to generate a new invoice
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
              Basic Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Patient <span className="text-destructive">*</span>
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Location <span className="text-destructive">*</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="">Select location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Service <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedAppointmentId}
                  onChange={(e) => handleAppointmentSelection(e.target.value)}
                  disabled={!patientId}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {patientId
                      ? patientAppointments.length > 0
                        ? "Select confirmed appointment"
                        : "No confirmed appointments"
                      : "Select patient first"}
                  </option>
                  {patientAppointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.serviceType} - {appointment.date} ({appointment.locationName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Visit reference
                </label>
                <input
                  type="text"
                  value={visitRef}
                  disabled
                  className="w-full h-10 px-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] opacity-60 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Visit date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Invoice date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                />
              </div>
            </div>
          </div>

          {/* ICD-CPT Codes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                ICD-CPT Codes
              </h4>
              <button
                onClick={handleAddICDCPTGroup}
                className="inline-flex items-center gap-2 px-3 h-8 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add ICD group
              </button>
            </div>

            {linkedCodeGroups.length === 0 ? (
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No ICD-CPT groups added yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkedCodeGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3"
                  >
                    {/* Group header */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                        ICD Code Group
                      </p>
                      <button
                        onClick={() => handleRemoveICDCPTGroup(group.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>

                    {/* ICD Code */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          ICD Code
                        </label>
                        <input
                          type="text"
                          value={group.icdCode.code}
                          onChange={(e) => handleUpdateGroupICD(group.id, "code", e.target.value)}
                          placeholder="e.g., M54.5"
                          className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          ICD Description
                        </label>
                        <input
                          type="text"
                          value={group.icdCode.description}
                          onChange={(e) => handleUpdateGroupICD(group.id, "description", e.target.value)}
                          placeholder="e.g., Low back pain"
                          className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                        />
                      </div>
                    </div>

                    {/* CPT Codes (multiple) */}
                    <div className="space-y-2 pl-3 border-l-2 border-primary-200 dark:border-primary-800">
                      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Linked CPT Codes</p>
                      {group.cptCodes.map((cpt, cptIdx) => (
                        <div key={cptIdx} className="grid grid-cols-2 gap-3 items-start">
                          <div>
                            <input
                              type="text"
                              value={cpt.code}
                              onChange={(e) => handleUpdateGroupCPT(group.id, cptIdx, "code", e.target.value)}
                              placeholder="e.g., 98941"
                              className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={cpt.description}
                              onChange={(e) => handleUpdateGroupCPT(group.id, cptIdx, "description", e.target.value)}
                              placeholder="CPT description"
                              className="flex-1 h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                            />
                            {group.cptCodes.length > 1 && (
                              <button
                                onClick={() => handleRemoveCPTFromGroup(group.id, cptIdx)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddCPTToGroup(group.id)}
                        className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add CPT code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Line Items
              </h4>
              <button
                onClick={handleAddLineItem}
                className="inline-flex items-center gap-2 px-3 h-8 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add item
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Item {index + 1}
                    </p>
                    {lineItems.length > 1 && (
                      <button
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleUpdateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="Enter service description"
                      className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Rate ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleUpdateLineItem(
                            item.id,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Amount ($)
                      </label>
                      <input
                        type="number"
                        value={item.amount.toFixed(2)}
                        disabled
                        className="w-full h-9 px-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow] opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
              Payment Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Payment method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Unpaid" | "Paid")}
                  className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 outline-none transition-[border-color,box-shadow]"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleEmailInvoice}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInvoice}
              disabled={!patientId || !locationId}
              className="h-10 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}