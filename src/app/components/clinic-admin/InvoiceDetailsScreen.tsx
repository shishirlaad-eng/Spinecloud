import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { ArrowLeft, Download, Printer, CheckCircle, AlertCircle, CreditCard } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: "Stripe" | "PayPal" | "Cash" | "Check";
  transactionId?: string;
  status: "Success" | "Failed" | "Refunded";
}

interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: "Unpaid" | "Paid";
  issueDate: string;
  dueDate?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  locationId: string;
  locationName: string;
  service: string;
  lineItems: LineItem[];
  discount: number;
  payments: Payment[];
  subtotal: number;
  total: number;
  icdCodes?: ICDCPTCode[];
  cptCodes?: ICDCPTCode[];
}

interface InvoiceDetailsScreenProps {
  invoiceId: string;
  onNavigate: (menu: string) => void;
  onBack: () => void;
  onLogout?: () => void;
}

export function InvoiceDetailsScreen({
  invoiceId,
  onNavigate,
  onBack,
  onLogout,
}: InvoiceDetailsScreenProps) {
  // Mock invoice data - matching the invoices from the list
  const mockInvoices: { [key: string]: Invoice } = {
    "inv-001": {
      id: "inv-001",
      invoiceNumber: "INV-2026-001",
      status: "Unpaid",
      issueDate: "2026-01-25",
      dueDate: "2026-02-25",
      patientId: "PT-001",
      patientName: "Sarah Johnson",
      patientEmail: "sarah.johnson@email.com",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Consultation",
      lineItems: [
        {
          id: "item-1",
          description: "Initial Consultation",
          quantity: 1,
          rate: 150.00,
          amount: 150.00,
        },
        {
          id: "item-2",
          description: "X-Ray Imaging",
          quantity: 2,
          rate: 75.00,
          amount: 150.00,
        },
        {
          id: "item-3",
          description: "Physical Therapy Session",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
      ],
      discount: 50.00,
      payments: [],
      subtotal: 400.00,
      total: 350.00,
    },
    "inv-002": {
      id: "inv-002",
      invoiceNumber: "INV-2026-002",
      status: "Unpaid",
      issueDate: "2026-01-26",
      dueDate: "2026-02-26",
      patientId: "PT-002",
      patientName: "James Wilson",
      patientEmail: "james.wilson@email.com",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Follow-up",
      lineItems: [
        {
          id: "item-1",
          description: "Follow-up Consultation",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
        {
          id: "item-2",
          description: "Physical Therapy Session",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
        {
          id: "item-3",
          description: "Therapeutic Exercise",
          quantity: 1,
          rate: 50.00,
          amount: 50.00,
        },
      ],
      discount: 0,
      payments: [],
      subtotal: 250.00,
      total: 250.00,
    },
    "inv-003": {
      id: "inv-003",
      invoiceNumber: "INV-2026-003",
      status: "Paid",
      issueDate: "2026-01-27",
      patientId: "PT-003",
      patientName: "Maria Garcia",
      patientEmail: "maria.garcia@email.com",
      locationId: "loc-2",
      locationName: "Westside Branch",
      service: "Consultation",
      lineItems: [
        {
          id: "item-1",
          description: "Initial Consultation",
          quantity: 1,
          rate: 150.00,
          amount: 150.00,
        },
        {
          id: "item-2",
          description: "Physical Therapy Session",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
      ],
      discount: 70.00,
      payments: [
        {
          id: "pay-1",
          date: "2026-01-27",
          amount: 180.00,
          method: "Cash",
          status: "Success",
        },
      ],
      subtotal: 250.00,
      total: 180.00,
    },
    "inv-004": {
      id: "inv-004",
      invoiceNumber: "INV-2026-004",
      status: "Unpaid",
      issueDate: "2026-01-15",
      dueDate: "2026-01-20",
      patientId: "PT-004",
      patientName: "Robert Chen",
      patientEmail: "robert.chen@email.com",
      locationId: "loc-1",
      locationName: "Downtown Clinic",
      service: "Follow-up",
      lineItems: [
        {
          id: "item-1",
          description: "Follow-up Consultation",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
        {
          id: "item-2",
          description: "MRI Scan",
          quantity: 1,
          rate: 250.00,
          amount: 250.00,
        },
        {
          id: "item-3",
          description: "Physical Therapy Session",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
      ],
      discount: 30.00,
      payments: [],
      subtotal: 450.00,
      total: 420.00,
    },
    "inv-005": {
      id: "inv-005",
      invoiceNumber: "INV-2026-005",
      status: "Paid",
      issueDate: "2026-01-28",
      patientId: "PT-005",
      patientName: "Lisa Anderson",
      patientEmail: "lisa.anderson@email.com",
      locationId: "loc-3",
      locationName: "Eastside Clinic",
      service: "Consultation",
      lineItems: [
        {
          id: "item-1",
          description: "Initial Consultation",
          quantity: 1,
          rate: 150.00,
          amount: 150.00,
        },
        {
          id: "item-2",
          description: "X-Ray Imaging",
          quantity: 1,
          rate: 75.00,
          amount: 75.00,
        },
        {
          id: "item-3",
          description: "Physical Therapy Session",
          quantity: 1,
          rate: 100.00,
          amount: 100.00,
        },
      ],
      discount: 25.00,
      payments: [
        {
          id: "pay-1",
          date: "2026-01-28",
          amount: 300.00,
          method: "Stripe",
          transactionId: "ch_1234567890abcdef",
          status: "Success",
        },
      ],
      subtotal: 325.00,
      total: 300.00,
    },
  };

  // Get the invoice based on invoiceId, or default to first unpaid invoice
  const [invoice, setInvoice] = useState<Invoice>(
    mockInvoices[invoiceId] || mockInvoices["inv-001"]
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const handleMarkAsPaid = (method: string) => {
    // Create a new payment record
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString(),
      amount: invoice.total,
      method: method as "Stripe" | "PayPal" | "Cash" | "Check",
      status: "Success",
    };

    // Update invoice
    setInvoice({
      ...invoice,
      status: "Paid",
      payments: [...invoice.payments, newPayment],
    });

    setSelectedPaymentMethod(method);
    setShowPaymentModal(false);
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800";
      case "Unpaid":
        return "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700";
      default:
        return "bg-neutral-100 text-neutral-600 border-neutral-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Unpaid":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-success-100 text-success-700 dark:bg-success-950/30 dark:text-success-400";
      case "Failed":
        return "bg-destructive-100 text-destructive-700 dark:bg-destructive-950/30 dark:text-destructive-400";
      case "Refunded":
        return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  const handleDownload = () => {
    // Get ICD codes text
    const icdCodesText = invoice.icdCodes && invoice.icdCodes.length > 0
      ? invoice.icdCodes.map(code => `  • ${code.code} - ${code.description}`).join('\n')
      : '  • M54.5 - Low back pain\n  • M79.1 - Myalgia (muscle pain)\n  • M99.03 - Segmental dysfunction';

    // Get CPT codes text
    const cptCodesText = invoice.cptCodes && invoice.cptCodes.length > 0
      ? invoice.cptCodes.map(code => `  • ${code.code} - ${code.description}`).join('\n')
      : '  • 98941 - CMT (3-4 regions)\n  • 97110 - Therapeutic exercises\n  • 97140 - Manual therapy';

    const invoiceContent = `
INVOICE
======================================
Invoice Number: ${invoice.invoiceNumber}
Status: ${invoice.status}
Issue Date: ${formatDate(invoice.issueDate)}
${invoice.dueDate ? `Due Date: ${formatDate(invoice.dueDate)}` : ''}

Patient: ${invoice.patientName}
Email: ${invoice.patientEmail}
Location: ${invoice.locationName}
Service: ${invoice.service}

======================================
LINE ITEMS
======================================
${invoice.lineItems.map(item => `${item.description} x ${item.quantity} @ ${formatCurrency(item.rate)} = ${formatCurrency(item.amount)}`).join('\n')}

Subtotal: ${formatCurrency(invoice.subtotal)}
${invoice.discount > 0 ? `Discount: -${formatCurrency(invoice.discount)}` : ''}

======================================
TOTAL: ${formatCurrency(invoice.total)}

======================================
ICD-CPT CODES
======================================

ICD CODES (Diagnosis):
${icdCodesText}

CPT CODES (Procedures):
${cptCodesText}

${invoice.status === 'Paid' ? `
======================================
PAYMENT DETAILS
======================================
${invoice.payments.map(pay => `${formatDate(pay.date)} - ${pay.method} - ${formatCurrency(pay.amount)} (${pay.status})`).join('\n')}

PAID IN FULL
` : `
======================================
STATUS: UNPAID
Balance Due: ${formatCurrency(invoice.total)}
`}
======================================
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    // Get ICD codes HTML
    const icdCodesHtml = invoice.icdCodes && invoice.icdCodes.length > 0
      ? invoice.icdCodes.map(code => `
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px;">
            <span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">ICD</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">${code.code}</span>
            <span style="color: #525252; font-size: 12px;">${code.description}</span>
          </div>
        `).join('')
      : `
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px;">
            <span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">ICD</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">M54.5</span>
            <span style="color: #525252; font-size: 12px;">Low back pain</span>
          </div>
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px;">
            <span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">ICD</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">M79.1</span>
            <span style="color: #525252; font-size: 12px;">Myalgia (muscle pain)</span>
          </div>
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 6px;">
            <span style="background-color: #DBEAFE; color: #1E40AF; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">ICD</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">M99.03</span>
            <span style="color: #525252; font-size: 12px;">Segmental dysfunction</span>
          </div>
        `;

    // Get CPT codes HTML
    const cptCodesHtml = invoice.cptCodes && invoice.cptCodes.length > 0
      ? invoice.cptCodes.map(code => `
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 6px;">
            <span style="background-color: #E9D5FF; color: #6B21A8; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">CPT</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">${code.code}</span>
            <span style="color: #525252; font-size: 12px;">${code.description}</span>
          </div>
        `).join('')
      : `
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 6px;">
            <span style="background-color: #E9D5FF; color: #6B21A8; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">CPT</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">98941</span>
            <span style="color: #525252; font-size: 12px;">CMT (3-4 regions)</span>
          </div>
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 6px;">
            <span style="background-color: #E9D5FF; color: #6B21A8; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">CPT</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">97110</span>
            <span style="color: #525252; font-size: 12px;">Therapeutic exercises</span>
          </div>
          <div style="display: inline-block; padding: 6px 10px; margin: 4px; background-color: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 6px;">
            <span style="background-color: #E9D5FF; color: #6B21A8; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px;">CPT</span>
            <span style="font-family: monospace; font-weight: 600; margin-right: 6px;">97140</span>
            <span style="color: #525252; font-size: 12px;">Manual therapy</span>
          </div>
        `;

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
              .totals { margin-top: 20px; }
              .totals-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px; }
              .total { font-size: 20px; font-weight: bold; color: #3B82F6; margin-top: 16px; padding-top: 16px; border-top: 2px solid #3B82F6; }
              .section-title { font-size: 16px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #171717; }
              .status-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: bold; }
              .status-paid { background-color: #D1FAE5; color: #047857; }
              .status-unpaid { background-color: #F5F5F5; color: #525252; }
              .codes-section { margin-top: 30px; padding: 20px; background-color: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 8px; }
              .codes-subtitle { font-size: 13px; font-weight: 600; color: #525252; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
              .codes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            </style>
          </head>
          <body>
            <h1>INVOICE</h1>
            <div class="header">
              <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Status:</strong> <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
              <p><strong>Issue Date:</strong> ${formatDate(invoice.issueDate)}</p>
              ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>` : ''}
              <p><strong>Patient:</strong> ${invoice.patientName}</p>
              <p><strong>Location:</strong> ${invoice.locationName}</p>
              <p><strong>Service:</strong> ${invoice.service}</p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.lineItems.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.rate)}</td>
                    <td class="text-right">${formatCurrency(item.amount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="totals-row">
                <strong>Subtotal:</strong>
                <span>${formatCurrency(invoice.subtotal)}</span>
              </div>
              ${invoice.discount > 0 ? `
                <div class="totals-row">
                  <span>Discount:</span>
                  <span>-${formatCurrency(invoice.discount)}</span>
                </div>
              ` : ''}
              <div class="totals-row total">
                <strong>TOTAL:</strong>
                <strong>${formatCurrency(invoice.total)}</strong>
              </div>
            </div>

            <div class="codes-section">
              <div class="section-title">ICD-CPT CODES</div>
              <div class="codes-grid">
                <div>
                  <p class="codes-subtitle">ICD Codes (Diagnosis)</p>
                  <div>
                    ${icdCodesHtml}
                  </div>
                </div>
                <div>
                  <p class="codes-subtitle">CPT Codes (Procedures)</p>
                  <div>
                    ${cptCodesHtml}
                  </div>
                </div>
              </div>
            </div>

            ${invoice.status === 'Paid' ? `
              <div class="section-title">PAYMENT DETAILS</div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Transaction ID</th>
                    <th class="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.payments.map(pay => `
                    <tr>
                      <td>${formatDate(pay.date)}</td>
                      <td>${pay.method}</td>
                      <td>${pay.transactionId || '—'}</td>
                      <td class="text-right">${formatCurrency(pay.amount)}</td>
                      <td>${pay.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div class="totals">
                <div class="totals-row total" style="color: #059669;">
                  <strong>PAID IN FULL</strong>
                  <strong>${formatCurrency(invoice.total)}</strong>
                </div>
              </div>
            ` : `
              <div class="totals" style="margin-top: 30px;">
                <div class="totals-row total" style="color: #EF4444;">
                  <strong>BALANCE DUE:</strong>
                  <strong>${formatCurrency(invoice.total)}</strong>
                </div>
              </div>
            `}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <ClinicAdminLayout activeMenu="invoices" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to invoices
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                {invoice.invoiceNumber}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Invoice details and payment information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 h-10 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Status</p>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-sm font-medium border ${getStatusColor(
                  invoice.status
                )}`}
              >
                {getStatusIcon(invoice.status)}
                {invoice.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Issue date</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatDate(invoice.issueDate)}
              </p>
            </div>
            {invoice.dueDate && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Due date</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Patient</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {invoice.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Location</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {invoice.locationName}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Service</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {invoice.service}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {formatCurrency(invoice.total)}
              </p>
            </div>
            {invoice.status === "Unpaid" && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Balance due</p>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {formatCurrency(invoice.total)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Line Items & Totals */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
              Invoice details
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {item.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatCurrency(item.rate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-neutral-50 dark:bg-neutral-950 border-t-2 border-neutral-200 dark:border-neutral-800">
                <tr>
                  <td colSpan={3} className="px-6 py-3 text-right">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">
                      Subtotal:
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(invoice.subtotal)}
                    </span>
                  </td>
                </tr>
                {invoice.discount > 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-right">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Discount:
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm font-medium text-success-600 dark:text-success-400">
                        -{formatCurrency(invoice.discount)}
                      </span>
                    </td>
                  </tr>
                )}
                <tr className="border-t border-neutral-200 dark:border-neutral-800">
                  <td colSpan={3} className="px-6 py-4 text-right">
                    <span className="text-base font-semibold text-neutral-900 dark:text-white">
                      Total:
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(invoice.total)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Status - Shows payment details if paid, balance due if unpaid */}
        {invoice.status === "Paid" ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Payment details
              </h3>
            </div>
            {invoice.payments.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-950">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Transaction ID
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {invoice.payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4">
                            <span className="text-sm text-neutral-900 dark:text-white">
                              {formatDate(payment.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-neutral-900 dark:text-white">
                              {payment.method}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                              {payment.transactionId || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                              {formatCurrency(payment.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${getPaymentStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-success-50 dark:bg-success-950/30 border-t-2 border-success-200 dark:border-success-800">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-success-700 dark:text-success-400">
                      Paid in full
                    </span>
                    <span className="text-base font-bold text-success-700 dark:text-success-400">
                      {formatCurrency(invoice.total)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No payment records available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="px-6 py-8 bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="text-base font-semibold text-amber-900 dark:text-amber-300">
                      Payment pending
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      This invoice has not been paid yet
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-700 dark:text-amber-400">Balance due</p>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                <CreditCard className="w-4 h-4" />
                Mark as paid
              </button>
            </div>
          </div>
        )}

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Mark invoice as paid
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Select the payment method used
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {["Cash", "Card", "Online", "Check"].map((method) => (
                    <button
                      key={method}
                      onClick={() => handleMarkAsPaid(method)}
                      className="w-full text-left px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors"
                    >
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">
                        {method}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}