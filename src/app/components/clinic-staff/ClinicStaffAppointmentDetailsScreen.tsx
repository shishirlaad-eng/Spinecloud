import { useState } from "react";
import { ClinicStaffLayout } from "./layout/ClinicStaffLayout";
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  DollarSign,
  Download,
  Printer,
} from "lucide-react";
import { CreateInvoiceDrawer } from "./CreateInvoiceDrawer";

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  service: string;
  location: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  patient: {
    id: string;
    name: string;
  };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  lineItems: InvoiceLineItem[];
  totalAmount: number;
  status: "Paid" | "Unpaid" | "Pending";
}

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  amount: number;
}

interface ClinicStaffAppointmentDetailsScreenProps {
  appointmentId: string;
  patientId: string;
  onNavigate: (menu: string) => void;
  onBackToPatient: () => void;
  onLogout?: () => void;
}

export function ClinicStaffAppointmentDetailsScreen({
  appointmentId,
  patientId,
  onNavigate,
  onBackToPatient,
  onLogout,
}: ClinicStaffAppointmentDetailsScreenProps) {
  // Mock appointment data
  const appointment: Appointment = {
    id: appointmentId,
    date: "2026-01-28",
    time: "02:00 PM - 03:00 PM",
    provider: "Dr. Michael Chen",
    service: "Therapy Session",
    location: "Downtown Clinic",
    status: "Completed",
    patient: {
      id: patientId,
      name: "Sarah Johnson",
    },
  };

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-1",
      invoiceNumber: "INV-2026-001",
      date: "2026-01-28",
      lineItems: [
        {
          id: "li-1",
          description: "Physical Therapy Session",
          quantity: 1,
          amount: 120.0,
        },
        {
          id: "li-2",
          description: "Exercise Equipment Use",
          quantity: 1,
          amount: 30.0,
        },
      ],
      totalAmount: 150.0,
      status: "Paid",
    },
  ]);

  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-400 dark:border-primary-800";
      case "Completed":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Cancelled":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-400";
      case "Unpaid":
        return "bg-destructive/10 text-destructive";
      case "Pending":
        return "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
      default:
        return "bg-neutral-100 text-neutral-700";
    }
  };

  const handleCreateInvoice = (lineItems: any[], total: number) => {
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${(invoices.length + 1).toString().padStart(3, "0")}`,
      date: new Date().toISOString(),
      lineItems: lineItems.map((item) => ({ ...item, id: `li-${Date.now()}-${item.id}` })),
      totalAmount: total,
      status: "Unpaid",
    };
    setInvoices([...invoices, newInvoice]);
    setShowCreateInvoice(false);
  };

  const toggleInvoiceStatus = (invoiceId: string) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: inv.status === "Paid" ? "Unpaid" : "Paid" }
          : inv
      )
    );
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const invoiceContent = `
INVOICE
======================================
Invoice Number: ${invoice.invoiceNumber}
Patient: ${appointment.patient.name}
Date: ${formatDate(invoice.date)}
Appointment ID: ${appointment.id}
Service: ${appointment.service}

======================================
LINE ITEMS
======================================
${invoice.lineItems.map(item => `${item.description} x ${item.quantity} @ $${item.amount.toFixed(2)} = $${(item.quantity * item.amount).toFixed(2)}`).join('\n')}

======================================
TOTAL: $${invoice.totalAmount.toFixed(2)}
======================================
Status: ${invoice.status}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}-${appointment.patient.name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #171717; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
              .header { margin-bottom: 30px; }
              .header p { margin: 5px 0; color: #525252; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E5E5; }
              th { background-color: #F5F5F5; font-weight: 600; }
              .text-right { text-align: right; }
              .totals { margin-top: 20px; text-align: right; }
              .total { font-size: 20px; font-weight: bold; color: #3B82F6; margin-top: 16px; padding-top: 16px; border-top: 2px solid #3B82F6; }
              .status { margin-top: 30px; padding: 20px; background-color: #F5F5F5; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>INVOICE</h1>
            <div class="header">
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Patient:</strong> ${appointment.patient.name}</p>
              <p><strong>Patient ID:</strong> ${appointment.patient.id}</p>
              <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
              <p><strong>Service:</strong> ${appointment.service}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.lineItems.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td class="text-right">$${(item.quantity * item.amount).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total">TOTAL: $${invoice.totalAmount.toFixed(2)}</div>
            </div>
            
            <div class="status">
              <p><strong>Payment Status:</strong> ${invoice.status}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <ClinicStaffLayout activeMenu="patients" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            <button
              onClick={() => onNavigate("patients")}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Patients
            </button>
            <ChevronRight className="w-4 h-4" />
            <button
              onClick={onBackToPatient}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {appointment.patient.name}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 dark:text-white font-medium">
              Appointment details
            </span>
          </nav>

          {/* Appointment Information Card */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {appointment.service}
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Patient: {appointment.patient.name} ({appointment.patient.id})
                </p>
              </div>
              <span
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Date:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {formatDate(appointment.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Time:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Provider:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.provider}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">Location:</span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                      {appointment.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Section */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Invoices ({invoices.length})
              </h3>
              {appointment.status === "Completed" && (
                <button
                  onClick={() => setShowCreateInvoice(true)}
                  className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
                >
                  <DollarSign className="w-4 h-4" />
                  Generate invoice
                </button>
              )}
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <div key={invoice.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {invoice.invoiceNumber}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${getInvoiceStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Date: {formatDate(invoice.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleInvoiceStatus(invoice.id)}
                        className={`px-4 h-9 rounded-lg border text-sm font-medium transition-colors ${
                          invoice.status === "Paid"
                            ? "border-destructive text-destructive hover:bg-destructive/10"
                            : "border-success-600 text-success-600 hover:bg-success-50 dark:hover:bg-success-950/30"
                        }`}
                      >
                        Mark as {invoice.status === "Paid" ? "unpaid" : "paid"}
                      </button>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800">
                            <th className="text-left text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
                              Description
                            </th>
                            <th className="text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
                              Qty
                            </th>
                            <th className="text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
                              Amount
                            </th>
                            <th className="text-right text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.lineItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-neutral-200 dark:border-neutral-800 last:border-0"
                            >
                              <td className="text-sm text-neutral-900 dark:text-white py-2">
                                {item.description}
                              </td>
                              <td className="text-sm text-neutral-900 dark:text-white text-right py-2">
                                {item.quantity}
                              </td>
                              <td className="text-sm text-neutral-900 dark:text-white text-right py-2">
                                ${item.amount.toFixed(2)}
                              </td>
                              <td className="text-sm text-neutral-900 dark:text-white text-right py-2">
                                ${(item.quantity * item.amount).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan={3}
                              className="text-sm font-semibold text-neutral-900 dark:text-white text-right pt-3"
                            >
                              Total amount:
                            </td>
                            <td className="text-sm font-semibold text-neutral-900 dark:text-white text-right pt-3">
                              ${invoice.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-end mt-4">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-neutral-600 hover:bg-neutral-700 text-white text-sm font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-neutral-600 hover:bg-neutral-700 text-white text-sm font-medium transition-colors ml-2"
                      >
                        <Printer className="w-4 h-4" />
                        Print
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                    No invoices created
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {appointment.status === "Completed"
                      ? "Create an invoice for this completed session"
                      : "Invoices can only be created after the session is completed"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </ClinicStaffLayout>

      {/* Create Invoice Drawer */}
      <CreateInvoiceDrawer
        isOpen={showCreateInvoice}
        onClose={() => setShowCreateInvoice(false)}
        onCreateInvoice={handleCreateInvoice}
        appointmentId={appointment.id}
        patientName={appointment.patient.name}
        service={appointment.service}
        appointmentDate={new Date(appointment.date).toLocaleDateString()}
        appointmentCost={150.00}
      />
    </>
  );
}