import { useState } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Edit, Eye } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
  variables: string[];
  enabled: boolean;
  category: "Appointment" | "Payment" | "Account" | "Clinical";
}

interface EmailManagementScreenProps {
  onNavigate: (menu: "dashboard" | "branches" | "questionnaires" | "roles" | "users" | "providers" | "consentForms" | "patients" | "master" | "subscription" | "calendar" | "appointment-categories" | "invoices" | "payments" | "email-management" | "clinic-settings" | "tickets") => void;
  onEditTemplate?: (template: EmailTemplate) => void;
  onLogout?: () => void;
}

export function EmailManagementScreen({
  onNavigate,
  onEditTemplate,
  onLogout,
}: EmailManagementScreenProps) {
  // Mock email templates data
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: "template-001",
      name: "Appointment Confirmation",
      description: "Sent when an appointment is confirmed",
      subject: "Appointment Confirmed - {appointmentDate}",
      body: `Dear {patientName},\n\nYour appointment has been confirmed for {appointmentDate} at {appointmentTime}.\n\nProvider: {providerName}\nLocation: {clinicLocation}\nService: {serviceType}\n\nPlease arrive 10 minutes early to complete any necessary paperwork.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nBest regards,\n{clinicName} Team`,
      variables: ["patientName", "appointmentDate", "appointmentTime", "providerName", "clinicLocation", "serviceType", "clinicName"],
      enabled: true,
      category: "Appointment",
    },
    {
      id: "template-002",
      name: "Appointment Reminder",
      description: "Sent 24 hours before appointment",
      subject: "Reminder: Appointment Tomorrow at {appointmentTime}",
      body: `Dear {patientName},\n\nThis is a friendly reminder about your upcoming appointment tomorrow.\n\nDate: {appointmentDate}\nTime: {appointmentTime}\nProvider: {providerName}\nLocation: {clinicLocation}\n\nIf you need to reschedule or cancel, please contact us at least 24 hours in advance.\n\nWe look forward to seeing you!\n\nBest regards,\n{clinicName} Team`,
      variables: ["patientName", "appointmentDate", "appointmentTime", "providerName", "clinicLocation", "clinicName"],
      enabled: true,
      category: "Appointment",
    },
    {
      id: "template-003",
      name: "Appointment Cancellation",
      description: "Sent when appointment is cancelled",
      subject: "Appointment Cancelled",
      body: `Dear {patientName},\n\nYour appointment scheduled for {appointmentDate} at {appointmentTime} has been cancelled as requested.\n\nIf you'd like to reschedule, please contact us or book online through our patient portal.\n\nBest regards,\n{clinicName} Team`,
      variables: ["patientName", "appointmentDate", "appointmentTime", "clinicName"],
      enabled: true,
      category: "Appointment",
    },
    {
      id: "template-004",
      name: "Invoice Email",
      description: "Sent when invoice is generated",
      subject: "Invoice {invoiceNumber} from {clinicName}",
      body: `Dear {patientName},\n\nPlease find your invoice for the recent visit.\n\nInvoice Number: {invoiceNumber}\nTotal Amount: {totalAmount}\nDue Date: {dueDate}\n\nYou can view and pay your invoice online through our patient portal, or contact our billing department for assistance.\n\nThank you for choosing {clinicName}.\n\nBest regards,\n{clinicName} Billing Team`,
      variables: ["patientName", "invoiceNumber", "totalAmount", "dueDate", "clinicName"],
      enabled: true,
      category: "Payment",
    },
    {
      id: "template-005",
      name: "Payment Receipt",
      description: "Sent after successful payment",
      subject: "Payment Receipt - {invoiceNumber}",
      body: `Dear {patientName},\n\nThank you for your payment. Your transaction has been processed successfully.\n\nPayment Amount: {paymentAmount}\nPayment Method: {paymentMethod}\nDate: {paymentDate}\nInvoice Number: {invoiceNumber}\n\nYour receipt has been attached to this email and is also available in your patient portal.\n\nBest regards,\n{clinicName} Team`,
      variables: ["patientName", "paymentAmount", "paymentMethod", "paymentDate", "invoiceNumber", "clinicName"],
      enabled: true,
      category: "Payment",
    },
    {
      id: "template-006",
      name: "Welcome Email",
      description: "Sent when new patient account is created",
      subject: "Welcome to {clinicName}!",
      body: `Dear {patientName},\n\nWelcome to {clinicName}! We're excited to have you as part of our patient community.\n\nYour account has been successfully created. You can now:\n- Book appointments online\n- View your medical history\n- Access your invoices and payment history\n- Complete questionnaires before your visit\n- View lab results and clinical reports\n\nTo get started, log in to your patient portal at {portalUrl}\n\nIf you have any questions or need assistance, please don't hesitate to contact us.\n\nBest regards,\n{clinicName} Team`,
      variables: ["patientName", "clinicName", "portalUrl"],
      enabled: true,
      category: "Account",
    },
  ]);

  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const handleEditTemplate = (template: EmailTemplate) => {
    if (onEditTemplate) {
      onEditTemplate(template);
    }
  };

  const handlePreviewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setShowTemplatePreview(true);
  };

  return (
    <>
      <ClinicAdminLayout activeMenu="email-management" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
              Email management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Manage email templates sent to patients
            </p>
          </div>

          {/* Templates Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Template name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {emailTemplates.length > 0 ? (
                    emailTemplates.map((template) => (
                      <tr
                        key={template.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              {template.name}
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {template.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-neutral-900 dark:text-white">
                            {template.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium ${
                              template.enabled
                                ? "bg-success-100 text-success-700 border border-success-200 dark:bg-success-950/30 dark:text-success-400 dark:border-success-800"
                                : "bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                            }`}
                          >
                            {template.enabled ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditTemplate(template)}
                              className="inline-flex items-center gap-1.5 px-3 h-8 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handlePreviewTemplate(template)}
                              className="inline-flex items-center gap-1.5 px-3 h-8 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          No templates found
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ClinicAdminLayout>

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Preview template
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {selectedTemplate.name}
                </p>
              </div>
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Subject
                </label>
                <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white">
                  {selectedTemplate.subject}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Body
                </label>
                <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white whitespace-pre-wrap font-mono">
                  {selectedTemplate.body}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowTemplatePreview(false)}
                className="h-10 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}