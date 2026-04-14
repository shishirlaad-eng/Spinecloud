import { useState, useEffect } from "react";
import { X, Plus, Trash2, DollarSign, Download, Printer } from "lucide-react";

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  amount: number;
}

interface InsuranceDetails {
  insurerName: string;
  policyNumber: string;
  policyHolderName: string;
  relationship: string;
}

interface CreateInvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (lineItems: InvoiceLineItem[], total: number) => void;
  appointmentId: string;
  patientName: string;
  service?: string;
  appointmentDate?: string;
  appointmentCost?: number;
}

export function CreateInvoiceDrawer({
  isOpen,
  onClose,
  onCreateInvoice,
  appointmentId,
  patientName,
  service = "Initial Consultation",
  appointmentDate = new Date().toLocaleDateString(),
  appointmentCost = 150.00,
}: CreateInvoiceDrawerProps) {
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { 
      id: "initial-1", 
      description: service, 
      quantity: 1, 
      amount: appointmentCost 
    },
  ]);
  
  const [discountType, setDiscountType] = useState<"flat" | "percentage">("flat");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash" | "insurance" | "credit_card">("online");
  const [isPaid, setIsPaid] = useState(false);
  const [insuranceDetails, setInsuranceDetails] = useState<InsuranceDetails>({
    insurerName: "",
    policyNumber: "",
    policyHolderName: "",
    relationship: "",
  });

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLineItems([
        { 
          id: "initial-1", 
          description: service, 
          quantity: 1, 
          amount: appointmentCost 
        },
      ]);
      setDiscountType("flat");
      setDiscountAmount(0);
      setPaymentMethod("online");
      setIsPaid(false);
      setInsuranceDetails({
        insurerName: "",
        policyNumber: "",
        policyHolderName: "",
        relationship: "",
      });
    }
  }, [isOpen, service, appointmentCost]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: `temp-${Date.now()}`, description: "", quantity: 1, amount: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.amount, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discountAmount) / 100;
    }
    return discountAmount;
  };

  const calculateTotal = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscount());
  };

  const handleSave = () => {
    const total = calculateTotal();
    onCreateInvoice(lineItems, total);
    // Reset form
    setLineItems([{ id: "temp-1", description: "", quantity: 1, amount: 0 }]);
  };

  const handleDownload = () => {
    // Create invoice content
    const invoiceContent = `
INVOICE
======================================
Patient: ${patientName}
Date: ${appointmentDate}
Appointment ID: ${appointmentId}

======================================
LINE ITEMS
======================================
${lineItems.map(item => `${item.description} x ${item.quantity} @ $${item.amount.toFixed(2)} = $${(item.quantity * item.amount).toFixed(2)}`).join('\n')}

======================================
Subtotal: $${calculateSubtotal().toFixed(2)}
Discount (${discountType === 'percentage' ? `${discountAmount}%` : `$${discountAmount.toFixed(2)}`}): -$${calculateDiscount().toFixed(2)}
======================================
TOTAL: $${calculateTotal().toFixed(2)}
======================================

Payment Method: ${paymentMethod.replace('_', ' ').toUpperCase()}
${paymentMethod === 'cash' ? `Status: ${isPaid ? 'PAID' : 'UNPAID'}` : ''}
${paymentMethod === 'insurance' ? `
Insurance Details:
- Insurer: ${insuranceDetails.insurerName}
- Policy Number: ${insuranceDetails.policyNumber}
- Policy Holder: ${insuranceDetails.policyHolderName}
- Relationship: ${insuranceDetails.relationship}
` : ''}
    `;

    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${appointmentId}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${appointmentId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #171717; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E5E5; }
              th { background-color: #F5F5F5; font-weight: 600; }
              .totals { margin-top: 20px; text-align: right; }
              .totals div { margin: 8px 0; }
              .total { font-size: 20px; font-weight: bold; color: #3B82F6; margin-top: 16px; padding-top: 16px; border-top: 2px solid #3B82F6; }
              .details { margin-top: 30px; padding: 20px; background-color: #F5F5F5; border-radius: 8px; }
            </style>
          </head>
          <body>
            <h1>INVOICE</h1>
            <p><strong>Patient:</strong> ${patientName}</p>
            <p><strong>Date:</strong> ${appointmentDate}</p>
            <p><strong>Appointment ID:</strong> ${appointmentId}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${lineItems.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td>$${(item.quantity * item.amount).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div><strong>Subtotal:</strong> $${calculateSubtotal().toFixed(2)}</div>
              <div><strong>Discount (${discountType === 'percentage' ? `${discountAmount}%` : `$${discountAmount.toFixed(2)}`}):</strong> -$${calculateDiscount().toFixed(2)}</div>
              <div class="total">TOTAL: $${calculateTotal().toFixed(2)}</div>
            </div>
            
            <div class="details">
              <p><strong>Payment Method:</strong> ${paymentMethod.replace('_', ' ').toUpperCase()}</p>
              ${paymentMethod === 'cash' ? `<p><strong>Status:</strong> ${isPaid ? 'PAID' : 'UNPAID'}</p>` : ''}
              ${paymentMethod === 'insurance' ? `
                <p><strong>Insurance Details:</strong></p>
                <p>Insurer: ${insuranceDetails.insurerName}</p>
                <p>Policy Number: ${insuranceDetails.policyNumber}</p>
                <p>Policy Holder: ${insuranceDetails.policyHolderName}</p>
                <p>Relationship: ${insuranceDetails.relationship}</p>
              ` : ''}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const isValid =
    lineItems.every((item) => item.description.trim() && item.amount > 0) &&
    calculateTotal() >= 0 &&
    (paymentMethod !== "insurance" || (
      insuranceDetails.insurerName.trim() &&
      insuranceDetails.policyNumber.trim() &&
      insuranceDetails.policyHolderName.trim() &&
      insuranceDetails.relationship.trim()
    ));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[540px] bg-white dark:bg-neutral-900 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Create invoice
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {patientName} • {appointmentDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Line Items Section */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Service Details
              </h4>
              <div className="space-y-4">
                {lineItems.map((item, index) => (
                  <div key={item.id} className="space-y-3 pb-4 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Line item {index + 1}
                      </label>
                      {lineItems.length > 1 && (
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Remove line item"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Description <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        placeholder="Enter service description"
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Quantity <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)
                          }
                          className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                          Amount <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.amount}
                            onChange={(e) =>
                              updateLineItem(item.id, "amount", parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        ${(item.quantity * item.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addLineItem}
                className="mt-4 inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add line item
              </button>
            </div>

            {/* Discount Section */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Discount
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Type
                    </label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "flat" | "percentage")}
                      className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                    >
                      <option value="flat">Flat amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {discountType === "flat" ? "Amount" : "Percentage"}
                    </label>
                    <div className="relative">
                      {discountType === "flat" ? (
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      ) : null}
                      <input
                        type="number"
                        min="0"
                        step={discountType === "flat" ? "0.01" : "1"}
                        max={discountType === "percentage" ? "100" : undefined}
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                        className={`w-full h-10 ${discountType === "flat" ? "pl-9" : "pl-3"} pr-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600`}
                      />
                      {discountType === "percentage" && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">%</span>
                      )}
                    </div>
                  </div>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm p-3 bg-success-50 dark:bg-success-950/30 rounded-lg">
                    <span className="text-success-700 dark:text-success-300">Discount applied:</span>
                    <span className="font-medium text-success-700 dark:text-success-300">
                      -${calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4 uppercase tracking-wide">
                Payment Method
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    How will this be paid? <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                  >
                    <option value="online">Online</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit card</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                {/* Cash - Mark as Paid */}
                {paymentMethod === "cash" && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        Mark as paid
                      </span>
                    </label>
                  </div>
                )}

                {/* Insurance Details */}
                {paymentMethod === "insurance" && (
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg space-y-3">
                    <p className="text-sm font-medium text-neutral-900 dark:text-white mb-3">
                      Insurance details
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Insurer name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={insuranceDetails.insurerName}
                        onChange={(e) =>
                          setInsuranceDetails({ ...insuranceDetails, insurerName: e.target.value })
                        }
                        placeholder="e.g., Blue Cross Blue Shield"
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Policy number <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={insuranceDetails.policyNumber}
                        onChange={(e) =>
                          setInsuranceDetails({ ...insuranceDetails, policyNumber: e.target.value })
                        }
                        placeholder="Enter policy number"
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Policy holder name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        value={insuranceDetails.policyHolderName}
                        onChange={(e) =>
                          setInsuranceDetails({ ...insuranceDetails, policyHolderName: e.target.value })
                        }
                        placeholder="Enter policy holder name"
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                        Relationship to policyholder <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={insuranceDetails.relationship}
                        onChange={(e) =>
                          setInsuranceDetails({ ...insuranceDetails, relationship: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                      >
                        <option value="">Select relationship</option>
                        <option value="Self">Self</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Discount:
                    </span>
                    <span className="font-medium text-success-600 dark:text-success-400">
                      -${calculateDiscount().toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Total amount:
                  </span>
                  <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm"
            >
              Save invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
}