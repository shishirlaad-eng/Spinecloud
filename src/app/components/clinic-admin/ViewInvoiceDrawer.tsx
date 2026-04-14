import { useState } from "react";
import { X, Download, Mail, Printer, CheckCircle } from "lucide-react";

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

interface ViewInvoiceDrawerProps {
  show: boolean;
  invoice: Invoice | null;
  onClose: () => void;
  onUpdate: (invoice: Invoice) => void;
}

export function ViewInvoiceDrawer({
  show,
  invoice,
  onClose,
  onUpdate,
}: ViewInvoiceDrawerProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  if (!show || !invoice) return null;

  const handleMarkAsPaid = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }
    
    const updatedInvoice = {
      ...invoice,
      status: "Paid" as const,
      paymentMethod: selectedPaymentMethod,
    };
    
    onUpdate(updatedInvoice);
    setShowPaymentModal(false);
    setSelectedPaymentMethod("");
    alert("Invoice marked as paid successfully!");
  };

  const calculateTotal = () => {
    if (!invoice.lineItems) return 0;
    return invoice.lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleDownloadInvoice = () => {
    let content = `INVOICE\n\n`;
    content += `Invoice Number: ${invoice.invoiceNumber}\n`;
    content += `Invoice Date: ${invoice.invoiceDate}\n`;
    content += `Due Date: ${invoice.dueDate || "N/A"}\n\n`;
    content += `Patient: ${invoice.patientName}\n`;
    content += `Location: ${invoice.locationName}\n`;
    content += `Service: ${invoice.service}\n`;
    content += `Visit Reference: ${invoice.visitRef || "N/A"}\n`;
    content += `Visit Date: ${invoice.visitDate || "N/A"}\n\n`;

    if (invoice.linkedCodeGroups && invoice.linkedCodeGroups.length > 0) {
      content += `ICD-CPT CODES:\n`;
      invoice.linkedCodeGroups.forEach((group) => {
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
    invoice.lineItems?.forEach((item) => {
      content += `${item.description}\t\t${item.quantity}\t\t$${item.rate.toFixed(2)}\t\t$${item.amount.toFixed(2)}\n`;
    });
    content += `-----------------------------------------------------------\n`;
    content += `Total: $${calculateTotal().toFixed(2)}\n\n`;
    content += `Payment Method: ${invoice.paymentMethod || "N/A"}\n`;
    content += `Status: ${invoice.status}\n`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
        <div className="w-full max-w-3xl h-full bg-white dark:bg-neutral-950 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                {invoice.invoiceNumber}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                View invoice details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  invoice.status === "Paid"
                    ? "bg-success-100 text-success-700 border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800"
                    : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                }`}
              >
                {invoice.status === "Paid" && <CheckCircle className="w-4 h-4" />}
                {invoice.status}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
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
                    Patient
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.patientName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Location
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.locationName}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Service
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.service}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Visit reference
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.visitRef || "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Visit date
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.visitDate ? formatDate(invoice.visitDate) : "—"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Invoice date
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {formatDate(invoice.invoiceDate)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Due date
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.dueDate ? formatDate(invoice.dueDate) : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* ICD-CPT Codes */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                ICD-CPT Codes
              </h4>

              {(!invoice.linkedCodeGroups || invoice.linkedCodeGroups.length === 0) ? (
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-6 text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No ICD-CPT groups added
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoice.linkedCodeGroups.map((group, index) => (
                    <div
                      key={group.id}
                      className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3"
                    >
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                        ICD Code Group {index + 1}
                      </p>

                      {/* ICD Code */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            ICD Code
                          </label>
                          <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                            {group.icdCode.code || "—"}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                            ICD Description
                          </label>
                          <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                            {group.icdCode.description || "—"}
                          </div>
                        </div>
                      </div>

                      {/* CPT Codes (multiple) */}
                      <div className="space-y-2 pl-3 border-l-2 border-primary-200 dark:border-primary-800">
                        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Linked CPT Codes</p>
                        {group.cptCodes.map((cpt, cptIdx) => (
                          <div key={cptIdx} className="grid grid-cols-2 gap-3">
                            <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                              {cpt.code || "—"}
                            </div>
                            <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                              {cpt.description || "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wide">
                Line Items
              </h4>

              <div className="space-y-3">
                {invoice.lineItems?.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3"
                  >
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Item {index + 1}
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Description
                      </label>
                      <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                        {item.description}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Quantity
                        </label>
                        <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                          {item.quantity}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Rate ($)
                        </label>
                        <div className="w-full h-9 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                          ${item.rate.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          Amount ($)
                        </label>
                        <div className="w-full h-9 px-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center font-medium">
                          ${item.amount.toFixed(2)}
                        </div>
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
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.paymentMethod || "—"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Status
                  </label>
                  <div className="w-full h-10 px-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white flex items-center">
                    {invoice.status}
                  </div>
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
              {invoice.status === "Unpaid" && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="inline-flex items-center gap-2 h-10 px-4 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as paid
                </button>
              )}
              <button
                onClick={onClose}
                className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Mark invoice as paid
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Select the payment method used
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Payment method <span className="text-destructive">*</span>
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
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

              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                <p className="text-sm text-primary-900 dark:text-primary-100">
                  <span className="font-semibold">Amount to be paid:</span> ${calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPaymentMethod("");
                }}
                className="h-10 px-4 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={!selectedPaymentMethod}
                className="inline-flex items-center gap-2 h-10 px-4 bg-success-600 hover:bg-success-700 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}