import { useState, useEffect } from "react";
import { SignupScreen } from "@/app/components/auth/SignupScreen";
import { LoginScreen } from "@/app/components/auth/LoginScreen";
import { OTPPasswordScreen } from "@/app/components/auth/OTPPasswordScreen";
import { ForgotPasswordScreen } from "@/app/components/auth/ForgotPasswordScreen";
import { PatientOnboardingFlow } from "@/app/components/onboarding/PatientOnboardingFlow";
import { InsuranceDetailsScreen } from "@/app/components/profile/InsuranceDetailsScreen";
import { ConsentFormsScreen } from "@/app/components/consent/ConsentFormsScreen";
import { ClinicSelectionScreen } from "@/app/components/booking/ClinicSelectionScreen";
import { ProviderSelectionScreen } from "@/app/components/booking/ProviderSelectionScreen";
import { AppointmentBookingScreen } from "@/app/components/booking/AppointmentBookingScreen";
import { BookingFromDashboardFlow } from "@/app/components/booking/BookingFromDashboardFlow";
import { BookingDrawer } from "@/app/components/booking/BookingDrawer";
import { DashboardScreen } from "@/app/components/dashboard/DashboardScreen";
import { ModernQuestionnaireScreen } from "@/app/components/questionnaire/ModernQuestionnaireScreen";
import { MyProfileScreen } from "@/app/components/profile/MyProfileScreen";
import { ViewAppointmentDetailsScreen } from "@/app/components/appointments/ViewAppointmentDetailsScreen";
import { RescheduleDrawer } from "@/app/components/appointments/RescheduleDrawer";
import { AppointmentsListScreen } from "@/app/components/appointments/AppointmentsListScreen";
import { FormsAgreementsPatientScreen } from "@/app/components/patient/FormsAgreementsPatientScreen";
import { InvoicesListScreen as PatientInvoicesListScreen } from "@/app/components/invoices/InvoicesListScreen";
import { NotificationsScreen } from "@/app/components/notifications/NotificationsScreen";
import { NotificationDetailScreen } from "@/app/components/notifications/NotificationDetailScreen";
import { SettingsScreen } from "@/app/components/settings/SettingsScreen";
import { PatientTicketManagementScreen } from "@/app/components/patient/tickets/PatientTicketManagementScreen";
import { TicketDetailScreen } from "@/app/components/shared/TicketDetailScreen";
import { PatientSpineCloudIndexScreen } from "@/app/components/spinecloud/PatientSpineCloudIndexScreen";
import { PatientClinicalRecordsScreen } from "@/app/components/patient/clinical-records/PatientClinicalRecordsScreen";
import { SpineCloudQuestionnaireScreen } from "@/app/components/spinecloud/SpineCloudQuestionnaireScreen";
import { SpineCloudResultsScreen } from "@/app/components/spinecloud/SpineCloudResultsScreen";
import { ClinicAdminNotificationsScreen } from "@/app/components/clinic-admin/notifications/ClinicAdminNotificationsScreen";
import { ClinicAdminNotificationDetailScreen } from "@/app/components/clinic-admin/notifications/ClinicAdminNotificationDetailScreen";
import { ProviderNotificationsScreen } from "@/app/components/provider/notifications/ProviderNotificationsScreen";
import { ProviderNotificationDetailScreen } from "@/app/components/provider/notifications/ProviderNotificationDetailScreen";
import { ClinicStaffNotificationsScreen } from "@/app/components/clinic-staff/notifications/ClinicStaffNotificationsScreen";
import { ClinicStaffNotificationDetailScreen } from "@/app/components/clinic-staff/notifications/ClinicStaffNotificationDetailScreen";
import { EntitySwitcher } from "@/app/components/shared/EntitySwitcher";
import { ClinicAdminRegisterScreen } from "@/app/components/clinic-admin/ClinicAdminRegisterScreen";
import { ClinicAdminVerificationScreen } from "@/app/components/clinic-admin/ClinicAdminVerificationScreen";
import { ClinicAdminLoginScreen } from "@/app/components/clinic-admin/ClinicAdminLoginScreen";
import { ClinicAdminForgotPasswordScreen } from "@/app/components/clinic-admin/ClinicAdminForgotPasswordScreen";
import { ClinicAdminDashboardScreen } from "@/app/components/clinic-admin/ClinicAdminDashboardScreen";
import { BaseSetupScreen } from "@/app/components/clinic-admin/BaseSetupScreen";
import { BranchesListScreen } from "@/app/components/clinic-admin/BranchesListScreen";
import { AddEditBranchScreen } from "@/app/components/clinic-admin/AddEditBranchScreen";
import { RolesManagementScreen } from "@/app/components/clinic-admin/RolesManagementScreen";
import { AddEditRoleScreen } from "@/app/components/clinic-admin/AddEditRoleScreen";
import { UserManagementScreen } from "@/app/components/clinic-admin/UserManagementScreen";
import { AddEditUserScreen } from "@/app/components/clinic-admin/AddEditUserScreen";
import { PatientFormsListScreen } from "@/app/components/clinic-admin/PatientFormsListScreen";
import { AddEditPatientFormScreen } from "@/app/components/clinic-admin/AddEditPatientFormScreen";
import { PreviewPatientFormModal } from "@/app/components/clinic-admin/PreviewPatientFormModal";
import { ProvidersListScreen } from "@/app/components/clinic-admin/ProvidersListScreen";
import { ProviderDetailsScreen } from "@/app/components/clinic-admin/ProviderDetailsScreen";
import { ProviderScheduleScreen } from "@/app/components/clinic-admin/ProviderScheduleScreen";
import { ProviderCalendarScreen } from "@/app/components/clinic-admin/ProviderCalendarScreen";
import { AgreementsListScreen } from "@/app/components/clinic-admin/AgreementsListScreen";
import { AddEditAgreementScreen } from "@/app/components/clinic-admin/AddEditAgreementScreen";
import { PatientsListScreen } from "@/app/components/clinic-admin/PatientsListScreen";
import { PatientDetailsScreen } from "@/app/components/clinic-admin/PatientDetailsScreen";
import { AddPatientDrawer } from "@/app/components/clinic-admin/AddPatientDrawer";
import { AddPatientSelectionScreen } from "@/app/components/clinic-admin/AddPatientSelectionScreen";
import { GenerateSignupLinkScreen } from "@/app/components/clinic-admin/GenerateSignupLinkScreen";
import { AddPatientFullPageScreen } from "@/app/components/clinic-admin/AddPatientFullPageScreen";
import { AddEditServiceDrawer } from "@/app/components/clinic-admin/AddEditServiceDrawer";
import { ServicesListScreenRedesigned } from "@/app/components/clinic-admin/services/ServicesListScreenRedesigned";
import { AddEditServiceDrawerRedesigned } from "@/app/components/clinic-admin/services/AddEditServiceDrawerRedesigned";
import { AddProviderScreen } from "@/app/components/clinic-admin/AddProviderScreen";
import { SubscriptionSelectionScreen } from "@/app/components/clinic-admin/SubscriptionSelectionScreen";
import {
  OrganizationDetailsScreen,
  type OrganizationData,
} from "@/app/components/clinic-admin/OrganizationDetailsScreen";
import { CheckoutScreen } from "@/app/components/clinic-admin/CheckoutScreen";
import { SubscriptionSuccessScreen } from "@/app/components/clinic-admin/SubscriptionSuccessScreen";
import { SubscriptionManagementScreen } from "@/app/components/clinic-admin/SubscriptionManagementScreen";
import {
  SetupWizard,
  type WizardData,
} from "@/app/components/clinic-admin/setup-wizard/SetupWizard";
import { SetupIncompleteBanner } from "@/app/components/clinic-admin/SetupIncompleteBanner";
import { ClinicCalendarScreen } from "@/app/components/clinic-admin/ClinicCalendarScreen";
import { ProviderLoginScreen } from "@/app/components/provider/ProviderLoginScreen";
import { ProviderForgotPasswordScreen } from "@/app/components/provider/ProviderForgotPasswordScreen";
import { ProviderResetPasswordScreen } from "@/app/components/provider/ProviderResetPasswordScreen";
import { ProviderDashboardScreen } from "@/app/components/provider/ProviderDashboardScreen";
import { ProviderCalendarScreen as ProviderCalendarViewScreen } from "@/app/components/provider/ProviderCalendarScreen";
import { ProviderPatientsScreen } from "@/app/components/provider/ProviderPatientsScreen";
import { ProviderPatientDetailsScreen } from "@/app/components/provider/ProviderPatientDetailsScreen";
import { ProviderAppointmentDetailsScreen } from "@/app/components/provider/ProviderAppointmentDetailsScreen";
import { ClinicStaffLoginScreen } from "@/app/components/clinic-staff/ClinicStaffLoginScreen";
import { ClinicStaffCalendarScreen } from "@/app/components/clinic-staff/ClinicStaffCalendarScreen";
import { ClinicStaffPatientsScreen } from "@/app/components/clinic-staff/ClinicStaffPatientsScreen";
import { ClinicStaffPatientDetailsScreen } from "@/app/components/clinic-staff/ClinicStaffPatientDetailsScreen";
import { ClinicStaffAppointmentDetailsScreen } from "@/app/components/clinic-staff/ClinicStaffAppointmentDetailsScreen";
import { AddPatientByStaffFlow } from "@/app/components/clinic-staff/AddPatientByStaffFlow";
import { AddPatientSelectionScreen as StaffAddPatientSelectionScreen } from "@/app/components/clinic-staff/AddPatientSelectionScreen";
import { GenerateSignupLinkScreen as StaffGenerateSignupLinkScreen } from "@/app/components/clinic-staff/GenerateSignupLinkScreen";
import { AddPatientFullPageScreen as StaffAddPatientFullPageScreen } from "@/app/components/clinic-staff/AddPatientFullPageScreen";
import { InvoicesListScreen } from "@/app/components/clinic-admin/InvoicesListScreen";
import { InvoiceDetailsScreen } from "@/app/components/clinic-admin/InvoiceDetailsScreen";
import { PaymentsOverviewScreen } from "@/app/components/clinic-admin/PaymentsOverviewScreen";
import { AppointmentReportScreen } from "@/app/components/clinic-admin/AppointmentReportScreen";
import { ClinicAdminProfileScreen } from "@/app/components/clinic-admin/ClinicAdminProfileScreen";
import { EmailManagementScreen } from "@/app/components/clinic-admin/EmailManagementScreen";
import { EditEmailTemplateScreen } from "@/app/components/clinic-admin/EditEmailTemplateScreen";
import { ClinicSettingsScreen } from "@/app/components/clinic-admin/ClinicSettingsScreen";
import { TicketManagementScreen } from "@/app/components/clinic-admin/TicketManagementScreen";
import { RaiseTicketScreen } from "@/app/components/clinic-admin/RaiseTicketScreen";
import { ProviderProfileScreen } from "@/app/components/provider/ProviderProfileScreen";
import { ClinicStaffProfileScreen } from "@/app/components/clinic-staff/ClinicStaffProfileScreen";
import { ActivityLogScreen } from "@/app/components/clinic-admin/ActivityLogScreen";
import { AuditLogScreen } from "@/app/components/clinic-admin/AuditLogScreen";
import { RoomManagementScreen } from "@/app/components/clinic-admin/RoomManagementScreen";
import { AddEditRoomDrawer } from "@/app/components/clinic-admin/AddEditRoomDrawer";
import { RoomDetailsDrawer } from "@/app/components/clinic-admin/RoomDetailsDrawer";
import { SpineCloudIndexConfigScreen } from "@/app/components/clinic-admin/SpineCloudIndexConfigScreen";
import { ClinicAdminSpineCloudIndexScreen } from "@/app/components/clinic-admin/ClinicAdminSpineCloudIndexScreen";
import { ClinicAdminSpineCloudDetailsScreen } from "@/app/components/clinic-admin/ClinicAdminSpineCloudDetailsScreen";
import { ProviderSpineCloudIndexScreen } from "@/app/components/provider/ProviderSpineCloudIndexScreen";
import { ProviderSpineCloudDetailsScreen } from "@/app/components/provider/ProviderSpineCloudDetailsScreen";
import { SOAPMasterScreen } from "@/app/components/clinic-admin/soap-master/SOAPMasterScreen";
import { CarePlanMasterScreen } from "@/app/components/clinic-admin/master/CarePlanMasterScreen";
import { ClinicAdminClinicalRecordsScreen } from "@/app/components/clinic-admin/ClinicAdminClinicalRecordsScreen";
import { HolidaysListScreen } from "@/app/components/clinic-admin/holidays/HolidaysListScreen";
import { LeaveManagementScreen } from "@/app/components/provider/LeaveManagementScreen";
import { generateDummyAppointments } from "@/utils/appointmentGenerator";
import { Check } from "lucide-react";

type Screen =
  | "login"
  | "signup"
  | "otpPassword"
  | "forgotPassword"
  | "patientOnboarding"
  | "patientProfile"
  | "insurance"
  | "questionnaireCategory"
  | "questionnaire"
  | "clinicSelection"
  | "providerSelection"
  | "appointmentBooking"
  | "consent"
  | "appointmentConfirmation"
  | "dashboard"
  | "appointments"
  | "myProfile"
  | "settings"
  | "notifications"
  | "notificationDetail"
  | "viewAppointment"
  | "rescheduleClinicSelection"
  | "rescheduleProviderSelection"
  | "rescheduleAppointmentBooking"
  | "subscriptionSelection"
  | "organizationDetails"
  | "subscriptionCheckout"
  | "subscriptionSuccess"
  | "clinicAdminRegister"
  | "clinicAdminVerification"
  | "clinicAdminLogin"
  | "clinicAdminForgotPassword"
  | "clinicAdminDashboard"
  | "branchesList"
  | "addEditBranch"
  | "rolesManagement"
  | "addEditRole"
  | "userManagement"
  | "addEditUser"
  | "questionnairesList"
  | "addEditQuestionnaire"
  | "providersList"
  | "addProvider"
  | "providerDetails"
  | "providerSchedule"
  | "providerCalendar"
  | "consentFormsList"
  | "addEditConsentForm"
  | "patientsList"
  | "patientDetails"
  | "addPatientSelection"
  | "addPatientFullPage"
  | "generateSignupLink"
  | "servicesList"
  | "setupWizard"
  | "subscriptionManagement"
  | "clinicCalendar"
  | "invoicesList"
  | "invoiceDetails"
  | "paymentsList"
  | "appointmentReport"
  | "providerLogin"
  | "providerForgotPassword"
  | "providerResetPassword"
  | "providerDashboard"
  | "providerPatients"
  | "providerPatientDetails"
  | "providerAppointmentDetails"
  | "providerProfile"
  | "clinicStaffLogin"
  | "clinicStaffCalendar"
  | "clinicStaffPatients"
  | "clinicStaffPatientDetails"
  | "clinicStaffAppointmentDetails"
  | "clinicStaffAddPatientSelection"
  | "clinicStaffAddPatient"
  | "clinicStaffGenerateLink"
  | "clinicStaffBookAppointment"
  | "clinicStaffProfile"
  | "clinicAdminBookAppointment"
  | "clinicAdminProfile"
  | "bookingServiceType"
  | "roomsList"
  | "activityLog"
  | "auditLog"
  | "spineCloudConfig"
  | "spineCloudConfig"
  | "soapMaster"
  | "emailManagement"
  | "editEmailTemplate"
  | "clinicSettings"
  | "ticketManagement"
  | "raiseTicket"
  | "patientInvoices"
  | "patientTickets"
  | "holidaysList"
  | "providerLeaveManagement"
  | "carePlanMaster"
  | "patientClinicalRecords"
  | "consentForms"
  | "ticketDetails"
  | "clinicAdminClinicalRecords";

type PasswordContext = "signup" | "forgotPassword";

const categoryNames: Record<string, string> = {
  "neck-shoulder": "Neck / Shoulder",
  "lower-back": "Lower Back",
  "upper-extremity": "Upper Extremity",
  "posture-wellness": "Posture / Wellness",
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    "clinicAdminLogin",
  );
  const [currentEntity, setCurrentEntity] = useState<
    "patient" | "clinicAdmin" | "provider" | "clinic-staff"
  >("clinicAdmin");
  const [passwordContext, setPasswordContext] =
    useState<PasswordContext>("signup");
  const [userEmail, setUserEmail] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] =
    useState("");
  const [completedCategories, setCompletedCategories] =
    useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState("");
  const [hasCompletedProfile, setHasCompletedProfile] =
    useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);

  // Appointment state
  const [bookedAppointment, setBookedAppointment] =
    useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentAppointmentId, setCurrentAppointmentId] =
    useState<string>("");
  const [showRescheduleDrawer, setShowRescheduleDrawer] =
    useState(false);
  const [showBookingDrawer, setShowBookingDrawer] =
    useState(false);
  const [questionnaireResponses, setQuestionnaireResponses] =
    useState<any[]>([]);

  // Invoice state
  const [invoices, setInvoices] = useState<any[]>([
    {
      id: "inv-1",
      invoiceId: "INV-2025-0001",
      appointmentId: "APT-2025-0001",
      date: new Date().toISOString().split("T")[0],
      totalAmount: 150.0,
      paymentType: "Insurance",
      paymentStatus: "Unpaid" as const,
    },
    {
      id: "inv-2",
      invoiceId: "INV-2025-0007",
      appointmentId: "APT-2025-0007",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      totalAmount: 120.0,
      paymentType: "Self-Pay",
      paymentStatus: "Paid" as const,
    },
  ]);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: "notif-1",
      type: "reminder",
      category: "appointment",
      title: "Upcoming appointment reminder",
      message:
        "Your appointment with Dr. Sarah Johnson is tomorrow at 10:30 AM",
      fullContent:
        "This is a reminder that you have an upcoming appointment with Dr. Sarah Johnson at SpineCloudIQ - Downtown Branch.\n\nAppointment Details:\n- Date: January 31, 2026\n- Time: 10:30 AM\n- Location: Downtown Branch\n- Service: Follow-up Visit\n\nPlease arrive 10 minutes early to complete any necessary paperwork. If you need to reschedule, please contact us at least 24 hours in advance.",
      timestamp: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: false,
      priority: "normal",
      relatedInfo: [
        { label: "Appointment ID", value: "APT-2025-0001" },
        { label: "Provider", value: "Dr. Sarah Johnson" },
        {
          label: "Date & Time",
          value: "January 31, 2026 at 10:30 AM",
        },
        { label: "Location", value: "Downtown Branch" },
      ],
    },
    {
      id: "notif-2",
      type: "action",
      category: "document",
      title: "Complete intake forms",
      message:
        "Please complete your intake forms before your appointment",
      fullContent:
        "We noticed that you have not yet completed your intake forms for your upcoming appointment.\n\nTo ensure we can provide you with the best care possible, please complete the following forms before your appointment:\n\n- Medical History Form\n- Current Medications List\n- Pain Assessment Questionnaire\n- Insurance Information Verification\n\nThis will help us better understand your condition and provide more effective treatment during your visit.",
      timestamp: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: true,
      actionLabel: "Complete forms",
      actionUrl: "/questionnaire",
      priority: "high",
    },
    {
      id: "notif-3",
      type: "alert",
      category: "payment",
      title: "Payment due",
      message: "You have an outstanding balance of $150.00",
      fullContent:
        "Our records indicate that you have an outstanding balance for your recent visit.\n\nInvoice Details:\n- Invoice #: INV-2025-0001\n- Date of Service: January 27, 2026\n- Amount Due: $150.00\n- Due Date: February 10, 2026\n\nPlease submit payment at your earliest convenience to avoid any late fees. You can pay online through the patient portal or call our billing department.",
      timestamp: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: true,
      actionLabel: "Pay now",
      actionUrl: "/invoices",
      priority: "normal",
      relatedInfo: [
        { label: "Invoice Number", value: "INV-2025-0001" },
        { label: "Amount Due", value: "$150.00" },
        { label: "Due Date", value: "February 10, 2026" },
      ],
    },
    {
      id: "notif-4",
      type: "message",
      category: "general",
      title: "Appointment confirmed",
      message:
        "Your appointment has been successfully scheduled",
      fullContent:
        "Thank you for booking with SpineCloudIQ!\n\nYour appointment has been confirmed with the following details:\n\n- Date: January 27, 2026\n- Time: 10:30 AM\n- Provider: Dr. Sarah Johnson\n- Location: Downtown Branch\n- Service: Initial Consultation\n\nYou will receive a reminder notification 24 hours before your appointment. If you need to make any changes, please use the Reschedule option in your appointments section or call us directly.\n\nWe look forward to seeing you!",
      timestamp: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: true,
      isActionable: false,
      priority: "normal",
    },
  ]);
  const [currentNotificationId, setCurrentNotificationId] =
    useState<string>("");

  // Clinic Admin notifications
  const [
    clinicAdminNotifications,
    setClinicAdminNotifications,
  ] = useState<any[]>([
    {
      id: "admin-notif-1",
      type: "alert",
      category: "system",
      title: "Subscription renewal due soon",
      message:
        "Your SpineCloudIQ subscription will expire in 7 days",
      fullContent:
        "Your current subscription plan is set to expire on February 6, 2026.\n\nSubscription Details:\n- Plan: Professional Plan\n- Expiry Date: February 6, 2026\n- Monthly Cost: $299/month\n- Active Users: 12/15\n\nTo avoid any interruption in service, please renew your subscription before the expiry date. You can manage your subscription from the Subscription Management section.",
      timestamp: new Date(
        Date.now() - 2 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: true,
      actionLabel: "Renew subscription",
      actionUrl: "/subscription",
      priority: "high",
      relatedInfo: [
        { label: "Current Plan", value: "Professional Plan" },
        { label: "Expiry Date", value: "February 6, 2026" },
        { label: "Monthly Cost", value: "$299/month" },
      ],
    },
    {
      id: "admin-notif-2",
      type: "action",
      category: "user",
      title: "New user registration pending",
      message:
        "3 new staff members are awaiting account approval",
      fullContent:
        "You have 3 new user registration requests that require your approval:\n\n1. Dr. Emily Chen - Chiropractor (Downtown Branch)\n2. Sarah Mitchell - Front Desk Staff (Westside Branch)\n3. Dr. Michael Roberts - Physical Therapist (Eastside Clinic)\n\nPlease review their profiles and approve or reject their access to the system.",
      timestamp: new Date(
        Date.now() - 5 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: true,
      actionLabel: "Review requests",
      actionUrl: "/users",
      priority: "normal",
    },
    {
      id: "admin-notif-3",
      type: "reminder",
      category: "branch",
      title: "Branch capacity update needed",
      message:
        "Downtown Branch is approaching maximum capacity",
      fullContent:
        "The Downtown Branch has reached 90% of its maximum appointment capacity for the upcoming week.\n\nCurrent Status:\n- Scheduled Appointments: 135/150\n- Available Slots: 15\n- Peak Days: Tuesday & Thursday\n\nConsider adjusting provider schedules or adding temporary staff to handle the increased demand.",
      timestamp: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: false,
      priority: "normal",
    },
    {
      id: "admin-notif-4",
      type: "message",
      category: "general",
      title: "Monthly report available",
      message: "Your January 2026 performance report is ready",
      fullContent:
        "Your monthly performance report for January 2026 has been generated and is now available for review.\n\nReport Highlights:\n- Total Appointments: 542\n- New Patients: 87\n- Revenue: $45,230\n- Patient Satisfaction: 4.8/5.0\n\nYou can download the full report from the Reports section.",
      timestamp: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: true,
      isActionable: false,
      priority: "normal",
    },
  ]);
  const [
    currentClinicAdminNotificationId,
    setCurrentClinicAdminNotificationId,
  ] = useState<string>("");

  // Provider notifications
  const [providerNotifications, setProviderNotifications] =
    useState<any[]>([
      {
        id: "prov-notif-1",
        type: "reminder",
        category: "appointment",
        title: "Appointment starting soon",
        message:
          "Your appointment with Sarah Johnson starts in 15 minutes",
        fullContent:
          "Your next appointment is starting soon.\n\nPatient: Sarah Johnson\nTime: 10:30 AM\nService: Follow-up Visit\nLocation: Treatment Room 3\n\nPlease review the patient's chart and previous notes before the session.",
        timestamp: new Date(
          Date.now() - 15 * 60 * 1000,
        ).toISOString(),
        isRead: false,
        isActionable: false,
        priority: "high",
      },
      {
        id: "prov-notif-2",
        type: "action",
        category: "document",
        title: "Complete SOAP notes",
        message: "You have 3 pending SOAP notes to complete",
        fullContent:
          "The following appointments require completed SOAP notes:\n\n1. Sarah Johnson - January 29, 2026\n2. Michael Brown - January 28, 2026\n3. Jennifer Lee - January 27, 2026\n\nPlease complete these notes within 24 hours to maintain compliance with documentation requirements.",
        timestamp: new Date(
          Date.now() - 4 * 60 * 60 * 1000,
        ).toISOString(),
        isRead: false,
        isActionable: true,
        actionLabel: "Complete notes",
        actionUrl: "/calendar",
        priority: "normal",
      },
      {
        id: "prov-notif-3",
        type: "alert",
        category: "patient",
        title: "Patient file updated",
        message: "Sarah Johnson uploaded new medical records",
        fullContent:
          "Sarah Johnson has uploaded new documents to her patient file:\n\n- MRI Results (January 28, 2026)\n- Lab Results (January 27, 2026)\n\nPlease review these documents before the next appointment.",
        timestamp: new Date(
          Date.now() - 1 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isRead: false,
        isActionable: false,
        priority: "normal",
      },
      {
        id: "prov-notif-4",
        type: "message",
        category: "general",
        title: "Schedule updated",
        message: "Your schedule for next week has been updated",
        fullContent:
          "Your schedule has been updated with the following changes:\n\n- Tuesday, February 4: Added 2 new appointments\n- Thursday, February 6: One appointment rescheduled to 2:00 PM\n- Friday, February 7: Morning slot now available\n\nPlease review your updated calendar for the complete schedule.",
        timestamp: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        isRead: true,
        isActionable: false,
        priority: "normal",
      },
    ]);
  const [
    currentProviderNotificationId,
    setCurrentProviderNotificationId,
  ] = useState<string>("");

  // Clinic Staff notifications
  const [
    clinicStaffNotifications,
    setClinicStaffNotifications,
  ] = useState<any[]>([
    {
      id: "staff-notif-1",
      type: "reminder",
      category: "appointment",
      title: "Patient check-in reminder",
      message:
        "Sarah Johnson is scheduled to arrive in 30 minutes",
      fullContent:
        "Upcoming patient arrival:\n\nPatient: Sarah Johnson\nArrival Time: 10:00 AM (for 10:30 AM appointment)\nProvider: Dr. Emily Wilson\nService: Follow-up Visit\nLocation: Treatment Room 3\n\nPlease ensure the treatment room is prepared and all necessary forms are ready.",
      timestamp: new Date(
        Date.now() - 30 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: false,
      priority: "normal",
    },
    {
      id: "staff-notif-2",
      type: "action",
      category: "patient",
      title: "Incomplete patient forms",
      message: "3 patients have incomplete intake forms",
      fullContent:
        "The following patients have incomplete intake forms:\n\n1. Robert Martinez - Missing insurance information\n2. Jennifer Lee - Incomplete medical history\n3. Michael Brown - Consent forms not signed\n\nPlease contact these patients to complete their forms before their next appointments.",
      timestamp: new Date(
        Date.now() - 3 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: true,
      actionLabel: "View patients",
      actionUrl: "/patients",
      priority: "normal",
    },
    {
      id: "staff-notif-3",
      type: "alert",
      category: "system",
      title: "Appointment cancellation",
      message:
        "Michael Brown cancelled appointment for tomorrow",
      fullContent:
        "Appointment Cancellation Notice:\n\nPatient: Michael Brown\nOriginal Date: January 31, 2026\nOriginal Time: 2:00 PM\nProvider: Dr. Sarah Johnson\nReason: Personal emergency\n\nThe appointment slot is now available for rebooking. Please update the schedule and notify the provider.",
      timestamp: new Date(
        Date.now() - 6 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: false,
      isActionable: false,
      priority: "normal",
    },
    {
      id: "staff-notif-4",
      type: "message",
      category: "general",
      title: "Office hours updated",
      message: "Clinic hours changed for next Monday",
      fullContent:
        "Office Hours Update:\n\nDate: Monday, February 3, 2026\nNew Hours: 8:00 AM - 5:00 PM (closing 2 hours early)\nReason: Staff training session\n\nPlease inform patients who call to schedule appointments on this date. All appointments after 5:00 PM have been automatically rescheduled.",
      timestamp: new Date(
        Date.now() - 1 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isRead: true,
      isActionable: false,
      priority: "normal",
    },
  ]);
  const [
    currentClinicStaffNotificationId,
    setCurrentClinicStaffNotificationId,
  ] = useState<string>("");

  // Clinic Admin state
  const [branches, setBranches] = useState<any[]>([]);
  const [currentBranchId, setCurrentBranchId] =
    useState<string>("");
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [questionnaires, setQuestionnaires] = useState<any[]>(
    [],
  );
  const [editingQuestionnaire, setEditingQuestionnaire] =
    useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] =
    useState(false);
  const [previewQuestionnaire, setPreviewQuestionnaire] =
    useState<any>(null);
  const [providers, setProviders] = useState<any[]>([
    {
      id: "user-2",
      firstName: "Michael",
      lastName: "Chen",
      name: "Dr. Michael Chen",
      email: "michael.chen@example.com",
      role: "Medical Staff",
      specialty: "Chiropractor",
      specialization: "Chiropractor",
      color: "#3B82F6",
      branches: ["Downtown Branch", "Uptown Branch"],
      status: "Active",
      accountStatus: "Active",
      createdAt: "2024-02-12T09:00:00Z",
    },
    {
      id: "user-1",
      firstName: "Sarah",
      lastName: "Johnson",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Clinic Administrator",
      specialty: "Physical Therapist",
      specialization: "Physical Therapist",
      color: "#10B981",
      branches: ["Downtown Branch"],
      status: "Active",
      accountStatus: "Active",
      createdAt: "2024-01-05T08:30:00Z",
    },
    {
      id: "user-3",
      firstName: "Emily",
      lastName: "Rodriguez",
      name: "Dr. Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      role: "Medical Staff",
      specialty: "Physical Therapist",
      specialization: "Physical Therapist",
      color: "#F59E0B",
      branches: ["Downtown Branch"],
      status: "Active",
      accountStatus: "Invited",
      createdAt: "2024-06-20T11:15:00Z",
    },
    {
      id: "user-4",
      firstName: "David",
      lastName: "Kim",
      name: "Dr. David Kim",
      email: "david.kim@example.com",
      role: "Medical Staff",
      specialty: "Massage Therapist",
      specialization: "Massage Therapist",
      color: "#8B5CF6",
      branches: ["Uptown Branch"],
      status: "Active",
      accountStatus: "Suspended",
      createdAt: "2024-09-03T14:45:00Z",
    },
  ]);
  const [providerLeaves, setProviderLeaves] = useState<any[]>([]);
  const [selectedProviderId, setSelectedProviderId] =
    useState<string>("");
  const [consentForms, setConsentForms] = useState<any[]>([]);
  const [editingConsentForm, setEditingConsentForm] =
    useState<any>(null);
  const [patients, setPatients] = useState<any[]>([
    {
      id: "PT-001",
      patientId: "00001",
      firstName: "Sarah",
      lastName: "Johnson",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      phoneCountryCode: "+1",
      dateOfBirth: "1985-03-15",
      gender: "Female",
      address: {
        street: "123 Main Street",
        city: "Los Angeles",
        state: "California",
        zip: "90001",
        country: "United States",
      },
      emergencyContact: {
        name: "John Johnson",
        relationship: "Spouse",
        phone: "(555) 123-4568",
        phoneCountryCode: "+1",
      },
      insurance: {
        provider: "Blue Cross Blue Shield",
        planNetworkName: "PPO Network",
        policyNumber: "BCBS123456",
        groupNumber: "GRP789",
        policyHolderName: "Sarah Johnson",
        policyHolderDOB: "1985-03-15",
        relationshipToPolicyholder: "Self",
      },
      location: "Downtown Clinic",
      totalAppointments: 5,
      registeredDate: "2024-01-15",
      lastVisit: "2026-01-20",
      upcomingAppointment: "2026-02-05",
      status: "Active" as const,
    },
    {
      id: "PT-002",
      patientId: "00002",
      firstName: "James",
      lastName: "Wilson",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "(555) 234-5678",
      phoneCountryCode: "+1",
      dateOfBirth: "1978-07-22",
      gender: "Male",
      address: {
        street: "456 Oak Avenue",
        city: "San Francisco",
        state: "California",
        zip: "94102",
        country: "United States",
      },
      emergencyContact: {
        name: "Emily Wilson",
        relationship: "Spouse",
        phone: "(555) 234-5679",
        phoneCountryCode: "+1",
      },
      insurance: {
        provider: "United Healthcare",
        planNetworkName: "Choice Plus",
        policyNumber: "UHC987654",
        groupNumber: "GRP456",
        policyHolderName: "James Wilson",
        policyHolderDOB: "1978-07-22",
        relationshipToPolicyholder: "Self",
      },
      location: "Downtown Clinic",
      totalAppointments: 3,
      registeredDate: "2024-03-10",
      lastVisit: "2026-01-25",
      upcomingAppointment: "2026-02-10",
      status: "Active" as const,
    },
    {
      id: "PT-003",
      patientId: "00003",
      firstName: "Maria",
      lastName: "Garcia",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "(555) 345-6789",
      phoneCountryCode: "+1",
      dateOfBirth: "1990-11-08",
      gender: "Female",
      address: {
        street: "789 Pine Road",
        city: "San Diego",
        state: "California",
        zip: "92101",
        country: "United States",
      },
      emergencyContact: {
        name: "Carlos Garcia",
        relationship: "Spouse",
        phone: "(555) 345-6790",
        phoneCountryCode: "+1",
      },
      insurance: {
        provider: "Aetna",
        planNetworkName: "HMO Network",
        policyNumber: "AET456789",
        groupNumber: "GRP123",
        policyHolderName: "Carlos Garcia",
        policyHolderDOB: "1988-05-14",
        relationshipToPolicyholder: "Spouse",
      },
      location: "Westside Branch",
      totalAppointments: 8,
      registeredDate: "2023-11-05",
      lastVisit: "2026-01-28",
      upcomingAppointment: "2026-02-12",
      status: "Active" as const,
    },
    {
      id: "PT-004",
      patientId: "00004",
      firstName: "Robert",
      lastName: "Martinez",
      name: "Robert Martinez",
      email: "robert.martinez@email.com",
      phone: "(555) 456-7890",
      phoneCountryCode: "+1",
      dateOfBirth: "1982-04-30",
      gender: "Male",
      address: {
        street: "321 Elm Street",
        city: "Sacramento",
        state: "California",
        zip: "95814",
        country: "United States",
      },
      emergencyContact: {
        name: "Lisa Martinez",
        relationship: "Spouse",
        phone: "(555) 456-7891",
        phoneCountryCode: "+1",
      },
      location: "Downtown Clinic",
      totalAppointments: 2,
      registeredDate: "2025-06-20",
      lastVisit: "2026-01-15",
      status: "Link sent" as const,
    },
    {
      id: "PT-005",
      patientId: "00005",
      firstName: "Jennifer",
      lastName: "Lee",
      name: "Jennifer Lee",
      email: "jennifer.lee@email.com",
      phone: "(555) 567-8901",
      phoneCountryCode: "+1",
      dateOfBirth: "1995-09-17",
      gender: "Female",
      address: {
        street: "654 Maple Drive",
        city: "Oakland",
        state: "California",
        zip: "94601",
        country: "United States",
      },
      emergencyContact: {
        name: "David Lee",
        relationship: "Spouse",
        phone: "(555) 567-8902",
        phoneCountryCode: "+1",
      },
      insurance: {
        provider: "Cigna",
        planNetworkName: "EPO Network",
        policyNumber: "CIG789012",
        groupNumber: "GRP234",
        policyHolderName: "Jennifer Lee",
        policyHolderDOB: "1995-09-17",
        relationshipToPolicyholder: "Self",
      },
      location: "Eastside Clinic",
      totalAppointments: 6,
      registeredDate: "2024-02-18",
      lastVisit: "2026-01-22",
      upcomingAppointment: "2026-02-08",
      status: "Active" as const,
    },
    {
      id: "PT-006",
      patientId: "00006",
      firstName: "Michael",
      lastName: "Brown",
      name: "Michael Brown",
      email: "michael.brown@email.com",
      phone: "(555) 678-9012",
      phoneCountryCode: "+1",
      dateOfBirth: "1988-12-25",
      gender: "Male",
      address: {
        street: "987 Birch Lane",
        city: "Fresno",
        state: "California",
        zip: "93701",
        country: "United States",
      },
      emergencyContact: {
        name: "Susan Brown",
        relationship: "Mother",
        phone: "(555) 678-9013",
        phoneCountryCode: "+1",
      },
      insurance: {
        provider: "Kaiser Permanente",
        planNetworkName: "HMO Network",
        policyNumber: "KP345678",
        groupNumber: "GRP567",
        policyHolderName: "Michael Brown",
        policyHolderDOB: "1988-12-25",
        relationshipToPolicyholder: "Self",
      },
      location: "Westside Branch",
      totalAppointments: 4,
      registeredDate: "2024-08-12",
      lastVisit: "2026-01-18",
      upcomingAppointment: "2026-02-15",
      status: "Active" as const,
    },
  ]);
  const [selectedPatientId, setSelectedPatientId] =
    useState<string>("");
  const [selectedAppointmentId, setSelectedAppointmentId] =
    useState<string | null>(null);
  const [reschedulingAppointmentId, setReschedulingAppointmentId] =
    useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] =
    useState<string>("");
  const [patientTickets, setPatientTickets] = useState<any[]>([
    {
      id: "ticket-001",
      ticketId: "TKT-2026-001",
      subject: "Issue with appointment booking",
      category: "Appointment",
      priority: "High",
      status: "Resolved",
      createdAt: "2026-02-15",
      updatedAt: "2026-02-18",
      createdBy: "John Smith",
      createdByRole: "Patient",
      description: "I'm unable to book an appointment for next week. The calendar doesn't show any available slots even though I was told there are openings.",
      messages: [
        {
          id: "resp-001",
          author: "Sarah Johnson",
          role: "Staff",
          content: "Thank you for reaching out. We're looking into the calendar availability issue. In the meantime, I've checked manually and we do have slots available next Tuesday and Thursday.",
          timestamp: "2026-02-15T10:30:00",
          isYou: false
        },
        {
          id: "resp-002",
          author: "John Smith",
          role: "Patient",
          content: "Thank you! I can see the slots now. I've booked Tuesday at 2 PM.",
          timestamp: "2026-02-15T14:45:00",
          isYou: true
        },
        {
          id: "resp-003",
          author: "Sarah Johnson",
          role: "Staff",
          content: "Perfect! We've confirmed your appointment. The calendar issue has been fixed. Thank you for your patience!",
          timestamp: "2026-02-18T09:15:00",
          isYou: false
        },
      ],
    },
    {
      id: "ticket-002",
      ticketId: "TKT-2026-002",
      subject: "Question about insurance coverage",
      category: "Billing",
      priority: "Medium",
      status: "In Progress",
      createdAt: "2026-02-18",
      updatedAt: "2026-02-19",
      createdBy: "John Smith",
      createdByRole: "Patient",
      description: "I wanted to check if my insurance plan covers the imaging services that were recommended during my last visit.",
      messages: [
        {
          id: "resp-004",
          author: "Michael Chen",
          role: "Staff",
          content: "Thank you for your inquiry. Our billing team is reviewing your insurance plan details. We'll get back to you within 24 hours with specific coverage information for the recommended imaging services.",
          timestamp: "2026-02-18T16:20:00",
          isYou: false
        },
      ],
    },
    {
      id: "ticket-003",
      ticketId: "TKT-2026-003",
      subject: "Unable to access clinical reports",
      category: "Technical",
      priority: "Low",
      status: "Open",
      createdAt: "2026-02-20",
      updatedAt: "2026-02-20",
      createdBy: "John Smith",
      createdByRole: "Patient",
      description: "I'm trying to download my recent lab reports but the download button doesn't seem to work. Can you please help?",
      messages: [],
    },
  ]);
  const [adminTickets, setAdminTickets] = useState<any[]>([
    {
      id: "1",
      ticketId: "TKT-2026-001",
      subject: "Unable to access patient records",
      category: "Technical Issue",
      priority: "High",
      status: "In Progress",
      createdBy: "Dr. Sarah Johnson",
      createdByRole: "Provider",
      assignedTo: "IT Support Team",
      createdAt: "2026-02-18T09:30:00",
      updatedAt: "2026-02-19T14:20:00",
      description: "I'm unable to access patient records in the system. Getting an error message when trying to view patient history.",
      messages: [
        { id: "m1", author: "IT Support", role: "Staff", content: "We are looking into this.", timestamp: "2026-02-18T10:00:00", isYou: false }
      ]
    },
    {
      id: "2",
      ticketId: "TKT-2026-002",
      subject: "Billing discrepancy in invoice #INV-2026-042",
      category: "Billing",
      priority: "Medium",
      status: "Open",
      createdBy: "Emily Staff",
      createdByRole: "Clinic Staff",
      assignedTo: "Finance Team",
      createdAt: "2026-02-19T11:15:00",
      updatedAt: "2026-02-19T11:15:00",
      description: "There's a discrepancy in the total amount for invoice #INV-2026-042. The insurance amount doesn't match our records.",
      messages: []
    }
  ]);
  const [editingEmailTemplate, setEditingEmailTemplate] =
    useState<any | null>(null);
  const [patientAppointments, setPatientAppointments] =
    useState<any[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] =
    useState<string>("");
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<string>("");
  const [
    isAddPatientSelectionOpen,
    setIsAddPatientSelectionOpen,
  ] = useState(false);
  const [isAddPatientDrawerOpen, setIsAddPatientDrawerOpen] =
    useState(false);
  const [
    isGenerateSignupLinkOpen,
    setIsGenerateSignupLinkOpen,
  ] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<
    any[]
  >([]);
  const [editingServiceType, setEditingServiceType] =
    useState<any>(null);
  const [isAddEditServiceTypeOpen, setIsAddEditServiceTypeOpen] = useState(false);

  // Clinic Settings state for patient portal visibility
  const [clinicSettings, setClinicSettings] = useState({
    patientPortal: {
      showSOAPNotes: true,
      showDICOMReports: true,
      showWellnessIndex: true,
      showKDTReports: true,
      showCarePlans: true,
      showFinancialPlans: true,
      showStructuralIntegrity: true,
    }
  });

  // Rooms state
  const [rooms, setRooms] = useState<any[]>([
    {
      id: "room-1",
      roomId: "R-001",
      roomName: "Examination Room 1",
      roomType: "Examination Room",
      cleanupTime: 15,
      status: "Active" as const,
      notes: "Main examination room with adjustable table",
      addedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "room-2",
      roomId: "R-002",
      roomName: "Treatment Room A",
      roomType: "Treatment Room",
      cleanupTime: 20,
      status: "Active" as const,
      notes: "Equipped with therapy equipment",
      addedDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "room-3",
      roomId: "R-003",
      roomName: "X-Ray Room",
      roomType: "X-Ray Room",
      cleanupTime: 10,
      status: "Active" as const,
      addedDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "room-4",
      roomId: "R-004",
      roomName: "Physical Therapy Room",
      roomType: "Physical Therapy Room",
      cleanupTime: 25,
      status: "Active" as const,
      notes: "Large space with exercise equipment",
      addedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "room-5",
      roomId: "R-005",
      roomName: "Consultation Room 1",
      roomType: "Consultation Room",
      cleanupTime: 10,
      status: "Inactive" as const,
      notes: "Currently under renovation",
      addedDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [isAddEditRoomDrawerOpen, setIsAddEditRoomDrawerOpen] = useState(false);
  const [isRoomDetailsDrawerOpen, setIsRoomDetailsDrawerOpen] = useState(false);

  // SOAP Master state
  const [soapCategories, setSOAPCategories] = useState<any[]>([
    // Subjective Section
    {
      id: "subj-1",
      section: "subjective",
      name: "Chief Complaint",
      subcategories: [
        {
          id: "subj-1-1",
          name: "Primary complaint",
          inputType: "text",
        },
        {
          id: "subj-1-2",
          name: "Symptom duration",
          inputType: "dropdown",
          options: ["< 1 week", "1-4 weeks", "1-3 months", "3-6 months", "> 6 months"],
        },
      ],
    },
    {
      id: "subj-2",
      section: "subjective",
      name: "Pain Assessment",
      subcategories: [
        {
          id: "subj-2-1",
          name: "Pain intensity",
          inputType: "slider",
          min: 0,
          max: 10,
          unit: "/10",
        },
        {
          id: "subj-2-2",
          name: "Pain location",
          inputType: "bodychart",
        },
        {
          id: "subj-2-3",
          name: "Pain character",
          inputType: "checkbox",
          options: ["Sharp", "Dull", "Aching", "Burning", "Shooting", "Stabbing", "Throbbing"],
        },
      ],
    },
    {
      id: "subj-3",
      section: "subjective",
      name: "Functional Impact",
      subcategories: [
        {
          id: "subj-3-1",
          name: "Impact on daily activities",
          inputType: "textarea",
        },
        {
          id: "subj-3-2",
          name: "Sleep quality",
          inputType: "radio",
          options: ["Good", "Fair", "Poor", "Very poor"],
        },
      ],
    },
    // Objective Section
    {
      id: "obj-1",
      section: "objective",
      name: "Vital Signs",
      subcategories: [
        {
          id: "obj-1-1",
          name: "Blood pressure",
          inputType: "text",
        },
        {
          id: "obj-1-2",
          name: "Heart rate",
          inputType: "text",
        },
        {
          id: "obj-1-3",
          name: "Temperature",
          inputType: "text",
        },
      ],
    },
    {
      id: "obj-2",
      section: "objective",
      name: "Physical Examination",
      subcategories: [
        {
          id: "obj-2-1",
          name: "Posture assessment",
          inputType: "textarea",
        },
        {
          id: "obj-2-2",
          name: "Gait pattern",
          inputType: "radio",
          options: ["Normal", "Antalgic", "Trendelenburg", "Ataxic", "Other"],
        },
        {
          id: "obj-2-3",
          name: "Muscle strength",
          inputType: "slider",
          min: 0,
          max: 5,
          unit: "/5",
        },
      ],
    },
    {
      id: "obj-3",
      section: "objective",
      name: "Range of Motion",
      subcategories: [
        {
          id: "obj-3-1",
          name: "Cervical ROM",
          inputType: "textarea",
        },
        {
          id: "obj-3-2",
          name: "Lumbar ROM",
          inputType: "textarea",
        },
        {
          id: "obj-3-3",
          name: "ROM limitations",
          inputType: "checkbox",
          options: ["Flexion", "Extension", "Lateral bending left", "Lateral bending right", "Rotation left", "Rotation right"],
        },
      ],
    },
    // Assessment Section
    {
      id: "assess-1",
      section: "assessment",
      name: "Diagnosis",
      subcategories: [
        {
          id: "assess-1-1",
          name: "Primary diagnosis",
          inputType: "text",
        },
        {
          id: "assess-1-2",
          name: "Secondary diagnosis",
          inputType: "text",
        },
        {
          id: "assess-1-3",
          name: "Diagnosis confidence",
          inputType: "radio",
          options: ["Definite", "Probable", "Possible", "Rule out"],
        },
      ],
    },
    {
      id: "assess-2",
      section: "assessment",
      name: "Clinical Impression",
      subcategories: [
        {
          id: "assess-2-1",
          name: "Overall impression",
          inputType: "textarea",
        },
        {
          id: "assess-2-2",
          name: "Prognosis",
          inputType: "radio",
          options: ["Excellent", "Good", "Fair", "Guarded", "Poor"],
        },
        {
          id: "assess-2-3",
          name: "Contributing factors",
          inputType: "checkbox",
          options: ["Postural", "Mechanical", "Degenerative", "Inflammatory", "Traumatic", "Psychosocial"],
        },
      ],
    },
    // Plan Section
    {
      id: "plan-1",
      section: "plan",
      name: "Treatment Plan",
      subcategories: [
        {
          id: "plan-1-1",
          name: "Recommended treatment",
          inputType: "textarea",
        },
        {
          id: "plan-1-2",
          name: "Treatment frequency",
          inputType: "dropdown",
          options: ["1x/week", "2x/week", "3x/week", "As needed", "Daily"],
        },
        {
          id: "plan-1-3",
          name: "Treatment modalities",
          inputType: "checkbox",
          options: ["Manual therapy", "Exercise therapy", "Heat therapy", "Cold therapy", "Electrical stimulation", "Ultrasound", "Traction"],
        },
      ],
    },
    {
      id: "plan-2",
      section: "plan",
      name: "Patient Education",
      subcategories: [
        {
          id: "plan-2-1",
          name: "Education provided",
          inputType: "textarea",
        },
        {
          id: "plan-2-2",
          name: "Home exercise program",
          inputType: "radio",
          options: ["Provided", "Not provided", "Previously provided"],
        },
      ],
    },
    {
      id: "plan-3",
      section: "plan",
      name: "Follow-up",
      subcategories: [
        {
          id: "plan-3-1",
          name: "Next visit",
          inputType: "dropdown",
          options: ["1 week", "2 weeks", "1 month", "3 months", "As needed", "Discharge"],
        },
        {
          id: "plan-3-2",
          name: "Referrals",
          inputType: "text",
        },
        {
          id: "plan-3-3",
          name: "Additional recommendations",
          inputType: "textarea",
        },
      ],
    },
  ]);

  // SpineCloud Index configuration state
  const [spineCloudConfig, setSpineCloudConfig] = useState({
    enabled: true, // Enable by default for demo purposes
    inactivityValue: 2, // Default: 2
    inactivityUnit: "months" as "weeks" | "months", // Default: months
  });
  const [selectedSpineCloudPatientId, setSelectedSpineCloudPatientId] = useState<string>("");
  const [spineCloudResults, setSpineCloudResults] = useState<any[]>([
    {
      id: "scwi-001",
      patientId: "patient-123",
      patientName: "John Smith",
      patientAge: 35,
      patientDateOfBirth: "1991-01-15",
      completedAt: "2026-02-10T14:30:00",
      score: 73.5,
      categoryScores: {
        neuromuscular: 75,
        autonomic: 68,
        structural: 80,
        metabolic: 70,
        cognitive: 75,
      },
      responses: {
        Q01: 1,
        Q02: 2,
        Q03: 1,
        Q04: 2,
        Q05: 2,
        Q06: 1,
        Q07: 2,
        Q08: 1,
        Q09: 1,
        Q10: 2,
        Q11: 1,
        Q12: 2,
        Q13: 2,
        Q14: 1,
        Q15: 2,
      },
    },
    {
      id: "scwi-002",
      patientId: "patient-123",
      patientName: "John Smith",
      patientAge: 35,
      patientDateOfBirth: "1991-01-15",
      completedAt: "2026-01-15T10:15:00",
      score: 68.2,
      categoryScores: {
        neuromuscular: 70,
        autonomic: 65,
        structural: 72,
        metabolic: 65,
        cognitive: 69,
      },
      responses: {
        Q01: 2,
        Q02: 2,
        Q03: 2,
        Q04: 3,
        Q05: 2,
        Q06: 2,
        Q07: 2,
        Q08: 2,
        Q09: 1,
        Q10: 3,
        Q11: 2,
        Q12: 2,
        Q13: 3,
        Q14: 2,
        Q15: 3,
      },
    },
  ]);
  const [currentSpineCloudResultId, setCurrentSpineCloudResultId] = useState<string>("");

  // Services state (redesigned with categories)
  const [serviceCategories, setServiceCategories] = useState<
    any[]
  >([]);
  const [services, setServices] = useState<any[]>([
    {
      id: "svc-1",
      appointmentCategoryId: "cat-1",
      name: "Initial Consultation - Neck/Shoulder",
      roomId: "room-1",
      phases: [
        { id: "phase-1-1", duration: 30, providerRequired: true },
        { id: "phase-1-2", duration: 30, providerRequired: false },
      ],
      price: 150,
      providerIds: ["user-1", "user-2"],
      locationIds: ["branch-1"],
      allowOnlineBooking: true,
      bookingStartTime: "09:00",
      bookingEndTime: "17:00",
      slotCapacity: 2,
      isActive: true,
      questionnaireId: "quest-1",
      createdAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "svc-2",
      appointmentCategoryId: "cat-1",
      name: "Initial Consultation - Lower Back",
      roomId: "room-2",
      phases: [
        { id: "phase-2-1", duration: 40, providerRequired: true },
        { id: "phase-2-2", duration: 20, providerRequired: false },
      ],
      price: 150,
      providerIds: ["user-1", "user-2"],
      locationIds: ["branch-1", "branch-2"],
      allowOnlineBooking: true,
      bookingStartTime: "09:00",
      bookingEndTime: "17:00",
      slotCapacity: 2,
      isActive: true,
      questionnaireId: "quest-1",
      createdAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "svc-3",
      appointmentCategoryId: "cat-2",
      name: "Follow-up Visit",
      roomId: "room-1",
      phases: [
        { id: "phase-3-1", duration: 30, providerRequired: true },
      ],
      price: 75,
      providerIds: ["user-1", "user-2"],
      locationIds: ["branch-1"],
      allowOnlineBooking: true,
      bookingStartTime: "09:00",
      bookingEndTime: "17:00",
      slotCapacity: 3,
      isActive: true,
      createdAt: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 25 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "svc-4",
      appointmentCategoryId: "cat-3",
      name: "Physical Therapy Session",
      roomId: "room-3",
      phases: [
        { id: "phase-4-1", duration: 15, providerRequired: true },
        { id: "phase-4-2", duration: 30, providerRequired: false },
      ],
      price: 100,
      providerIds: ["user-1"],
      locationIds: ["branch-1"],
      allowOnlineBooking: true,
      bookingStartTime: "08:00",
      bookingEndTime: "18:00",
      slotCapacity: 4,
      isActive: true,
      createdAt: new Date(
        Date.now() - 20 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 20 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
    {
      id: "svc-5",
      appointmentCategoryId: "cat-4",
      name: "Chiropractic Adjustment",
      roomId: "room-2",
      phases: [
        { id: "phase-5-1", duration: 30, providerRequired: true },
      ],
      price: 80,
      providerIds: ["prov-1", "prov-3"],
      locationIds: ["branch-1"],
      allowOnlineBooking: true,
      bookingStartTime: "09:00",
      bookingEndTime: "16:00",
      slotCapacity: 2,
      isActive: true,
      createdAt: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      updatedAt: new Date(
        Date.now() - 15 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    },
  ]);
  const [editingServiceCategory, setEditingServiceCategory] =
    useState<any>(null);
  const [editingService, setEditingService] =
    useState<any>(null);
  const [
    selectedServiceCategoryId,
    setSelectedServiceCategoryId,
  ] = useState<string>("");
  const [
    isAddEditServiceCategoryOpen,
    setIsAddEditServiceCategoryOpen,
  ] = useState(false);
  const [isAddEditServiceOpen, setIsAddEditServiceOpen] =
    useState(false);
  const [
    isAddEditServiceRedesignedOpen,
    setIsAddEditServiceRedesignedOpen,
  ] = useState(false);

  // Subscription state
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    billingCycle: "monthly" | "yearly";
    price: number;
    locationLimit: string;
    userLimit: string;
  } | null>(null);
  const [organizationData, setOrganizationData] =
    useState<OrganizationData | null>(null);

  // Setup Wizard state
  const [setupComplete, setSetupComplete] = useState(() => {
    return localStorage.getItem("setupComplete") === "true";
  });
  const [wizardData, setWizardData] =
    useState<WizardData | null>(() => {
      const savedProgress = localStorage.getItem(
        "setupWizardProgress",
      );
      if (savedProgress) {
        try {
          return JSON.parse(savedProgress).wizardData;
        } catch {
          return null;
        }
      }
      return null;
    });

  // Initialize dummy data on mount
  useEffect(() => {
    // Only initialize if we don't have appointments yet
    if (patientAppointments.length === 0) {
      const generatedAppointments = generateDummyAppointments();

      // Add specific appointments for provider "user-1" to ensure calendar has data
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Helper to get date string with offset
      const getDateStr = (daysOffset: number) => {
        const date = new Date(today);
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split("T")[0];
      };

      const providerAppointments = [
        // Today's appointments
        {
          id: "prov-apt-1",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: todayStr,
          startTime: "09:00",
          endTime: "10:00",
          service: "Initial Consultation",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-2",
          patientName: "Michael Brown",
          providerId: "user-1",
          locationId: "branch-1",
          date: todayStr,
          startTime: "11:00",
          endTime: "11:30",
          service: "Follow-up",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-3",
          patientName: "Emily Davis",
          providerId: "user-1",
          locationId: "branch-2",
          date: todayStr,
          startTime: "14:00",
          endTime: "15:00",
          type: "Therapy Session",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-4",
          patientName: "David Wilson",
          providerId: "user-1",
          locationId: "branch-1",
          date: todayStr,
          startTime: "16:30",
          endTime: "17:00",
          type: "Checkup",
          status: "Confirmed" as const,
        },
        // Tomorrow
        {
          id: "prov-apt-5",
          patientName: "Jennifer Lee",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(1),
          startTime: "10:00",
          endTime: "11:00",
          service: "Initial Consultation",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-6",
          patientName: "Robert Taylor",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(1),
          startTime: "13:00",
          endTime: "13:30",
          service: "Follow-up",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-7",
          patientName: "Amanda Martinez",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(1),
          startTime: "15:30",
          endTime: "16:00",
          type: "Therapy Session",
          status: "Confirmed" as const,
        },
        // Day after tomorrow
        {
          id: "prov-apt-8",
          patientName: "Christopher Anderson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(2),
          startTime: "09:30",
          endTime: "10:30",
          service: "Initial Consultation",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-9",
          patientName: "Jessica White",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(2),
          startTime: "14:00",
          endTime: "14:30",
          type: "Checkup",
          status: "Confirmed" as const,
        },
        // Next week
        {
          id: "prov-apt-10",
          patientName: "Matthew Harris",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(7),
          startTime: "10:00",
          endTime: "11:00",
          type: "Therapy Session",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-11",
          patientName: "Ashley Clark",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(7),
          startTime: "11:30",
          endTime: "12:00",
          service: "Follow-up",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-12",
          patientName: "Daniel Lewis",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(7),
          startTime: "15:00",
          endTime: "16:00",
          service: "Initial Consultation",
          status: "Confirmed" as const,
        },
        // Yesterday (completed)
        {
          id: "prov-apt-13",
          patientName: "Lauren Walker",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-1),
          startTime: "09:00",
          endTime: "10:00",
          type: "Therapy Session",
          status: "Completed" as const,
          completedAt: new Date(
            today.getTime() -
              24 * 60 * 60 * 1000 +
              10 * 60 * 60 * 1000 +
              15 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: "prov-apt-14",
          patientName: "Kevin Young",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(-1),
          startTime: "14:00",
          endTime: "14:30",
          service: "Follow-up",
          status: "Completed" as const,
          completedAt: new Date(
            today.getTime() -
              24 * 60 * 60 * 1000 +
              14 * 60 * 60 * 1000 +
              35 * 60 * 1000,
          ).toISOString(),
        },
        // Last week (completed)
        {
          id: "prov-apt-15",
          patientName: "Michelle King",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-7),
          startTime: "10:30",
          endTime: "11:30",
          service: "Initial Consultation",
          status: "Completed" as const,
          completedAt: new Date(
            today.getTime() -
              7 * 24 * 60 * 60 * 1000 +
              11 * 60 * 60 * 1000 +
              40 * 60 * 1000,
          ).toISOString(),
        },
        // Additional Sarah Johnson appointments - various scenarios
        {
          id: "prov-apt-sarah-1",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(3),
          startTime: "14:00",
          endTime: "15:00",
          type: "Follow-up Visit",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-2",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(10),
          startTime: "10:30",
          endTime: "11:30",
          type: "Chiropractic Adjustment",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-3",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(17),
          startTime: "15:00",
          endTime: "16:00",
          type: "Physical Therapy",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-4",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(24),
          startTime: "09:30",
          endTime: "10:30",
          type: "Massage Therapy",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-5",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-3),
          startTime: "11:00",
          endTime: "12:00",
          type: "Follow-up Visit",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-6",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(-7),
          startTime: "13:30",
          endTime: "14:30",
          type: "Chiropractic Adjustment",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-7",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-14),
          startTime: "10:00",
          endTime: "11:00",
          type: "Physical Therapy",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-8",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(-21),
          startTime: "14:00",
          endTime: "15:00",
          service: "Initial Consultation",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-9",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-28),
          startTime: "16:00",
          endTime: "17:00",
          type: "Massage Therapy",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-10",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(-35),
          startTime: "11:30",
          endTime: "12:30",
          type: "Chiropractic Adjustment",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-11",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(5),
          startTime: "13:00",
          endTime: "14:00",
          type: "Acupuncture",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-12",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(14),
          startTime: "09:00",
          endTime: "10:00",
          type: "Pain Management Consultation",
          status: "Confirmed" as const,
        },
        {
          id: "prov-apt-sarah-13",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(-10),
          startTime: "15:30",
          endTime: "16:30",
          type: "Follow-up Visit",
          status: "Cancelled" as const,
        },
        {
          id: "prov-apt-sarah-14",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-1",
          date: getDateStr(-42),
          startTime: "10:30",
          endTime: "11:30",
          type: "X-Ray Examination",
          status: "Completed" as const,
        },
        {
          id: "prov-apt-sarah-15",
          patientName: "Sarah Johnson",
          providerId: "user-1",
          locationId: "branch-2",
          date: getDateStr(30),
          startTime: "14:30",
          endTime: "15:30",
          type: "Rehabilitation Session",
          status: "Confirmed" as const,
        },
      ];

      setPatientAppointments([
        ...generatedAppointments,
        ...providerAppointments,
      ]);
    }

    // Initialize branches if empty
    if (branches.length === 0) {
      setBranches([
        {
          id: "branch-1",
          name: "Downtown Branch",
          address: "123 Main St, Suite 100",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          phone: "(555) 123-4567",
          email: "downtown@clinic.com",
          status: "Active",
          intakeEnabled: true,
          consentEnabled: true,
        },
        {
          id: "branch-2",
          name: "Uptown Branch",
          address: "456 Park Ave, Floor 5",
          city: "New York",
          state: "NY",
          zipCode: "10022",
          phone: "(555) 987-6543",
          email: "uptown@clinic.com",
          status: "Active",
          intakeEnabled: true,
          consentEnabled: true,
        },
        {
          id: "branch-3",
          name: "Westside Clinic",
          address: "789 West End Ave",
          city: "New York",
          state: "NY",
          zipCode: "10025",
          phone: "(555) 456-7890",
          email: "westside@clinic.com",
          status: "Active",
          intakeEnabled: false,
          consentEnabled: false,
        },
      ]);
    }

    // Initialize patients if empty
    if (patients.length === 0) {
      setPatients([
        {
          id: "patient-1",
          patientId: "00001",
          firstName: "Sarah",
          lastName: "Johnson",
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 234-5678",
          locationId: "branch-1",
          locationName: "Downtown Branch",
          dateOfBirth: "1990-07-22",
          gender: "Female",
          address: {
            street: "456 Oak Avenue",
            city: "New York",
            state: "NY",
            zip: "10002",
          },
          registeredDate: "2024-02-10",
          lastVisit: "2025-01-10",
          upcomingAppointment: "2025-02-20",
          status: "Active" as const,
          totalAppointments: 12,
          appointmentCount: 12,
          outstandingAmount: 150,
          lastUpdated: "2025-01-10",
          addedDate: "2024-02-10",
          tag: "self-signup" as const,
          insurance: {
            provider: "Aetna",
            policyNumber: "AE987654321",
            policyHolderName: "Sarah Johnson",
            policyHolderDOB: "1990-07-22",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-2",
          patientId: "00002",
          firstName: "Michael",
          lastName: "Brown",
          name: "Michael Brown",
          email: "michael.brown@email.com",
          phone: "+1 (555) 456-7890",
          locationId: "branch-2",
          locationName: "Uptown Branch",
          dateOfBirth: "1978-11-05",
          gender: "Male",
          address: {
            street: "789 Pine Road",
            city: "New York",
            state: "NY",
            zip: "10003",
          },
          registeredDate: "2024-03-20",
          lastVisit: "2024-12-15",
          status: "Active" as const,
          totalAppointments: 8,
          appointmentCount: 8,
          outstandingAmount: 0,
          lastUpdated: "2024-12-15",
          addedDate: "2024-03-20",
          tag: "staff" as const,
        },
        {
          id: "patient-3",
          patientId: "00003",
          firstName: "Emily",
          lastName: "Davis",
          name: "Emily Davis",
          email: "emily.davis@email.com",
          phone: "+1 (555) 567-8901",
          locationId: "branch-1",
          locationName: "Downtown Branch",
          dateOfBirth: "1995-04-18",
          gender: "Female",
          address: {
            street: "321 Elm Street",
            city: "New York",
            state: "NY",
            zip: "10004",
          },
          registeredDate: "2024-05-12",
          lastVisit: "2025-01-18",
          upcomingAppointment: "2025-02-25",
          status: "Active" as const,
          totalAppointments: 15,
          appointmentCount: 15,
          outstandingAmount: 75,
          lastUpdated: "2025-01-18",
          addedDate: "2024-05-12",
          tag: "self-signup" as const,
          insurance: {
            provider: "UnitedHealthcare",
            policyNumber: "UH456789123",
            policyHolderName: "Emily Davis",
            policyHolderDOB: "1995-04-18",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-4",
          patientId: "00004",
          firstName: "David",
          lastName: "Wilson",
          name: "David Wilson",
          email: "david.wilson@email.com",
          phone: "+1 (555) 678-9012",
          locationId: "branch-2",
          locationName: "Uptown Branch",
          dateOfBirth: "1982-09-30",
          gender: "Male",
          address: {
            street: "654 Maple Drive",
            city: "New York",
            state: "NY",
            zip: "10005",
          },
          registeredDate: "2024-06-08",
          lastVisit: "2024-11-22",
          status: "Inactive" as const,
          totalAppointments: 5,
          appointmentCount: 5,
          outstandingAmount: 0,
          lastUpdated: "2024-11-22",
          addedDate: "2024-06-08",
          tag: "link-sent" as const,
        },
        {
          id: "patient-5",
          patientId: "00005",
          firstName: "Jennifer",
          lastName: "Lee",
          name: "Jennifer Lee",
          email: "jennifer.lee@email.com",
          phone: "+1 (555) 789-0123",
          locationId: "branch-1",
          locationName: "Downtown Branch",
          dateOfBirth: "1988-12-12",
          gender: "Female",
          address: {
            street: "987 Cedar Lane",
            city: "New York",
            state: "NY",
            zip: "10006",
          },
          registeredDate: "2024-08-25",
          status: "Active" as const,
          totalAppointments: 9,
          appointmentCount: 9,
          outstandingAmount: 0,
          lastUpdated: "2025-01-05",
          addedDate: "2024-08-25",
          tag: "staff" as const,
        },
        {
          id: "patient-6",
          patientId: "00006",
          firstName: "Robert",
          lastName: "Taylor",
          name: "Robert Taylor",
          email: "robert.taylor@email.com",
          phone: "+1 (555) 890-1234",
          locationId: "branch-2",
          locationName: "Uptown Branch",
          dateOfBirth: "1985-03-15",
          gender: "Male",
          address: {
            street: "123 Main Street",
            city: "New York",
            state: "NY",
            zip: "10001",
          },
          registeredDate: "2024-01-15",
          lastVisit: "2024-12-20",
          upcomingAppointment: "2025-02-15",
          status: "Active" as const,
          totalAppointments: 6,
          appointmentCount: 6,
          outstandingAmount: 0,
          lastUpdated: "2024-12-20",
          addedDate: "2024-01-15",
          tag: "self-signup" as const,
          insurance: {
            provider: "Blue Cross Blue Shield",
            policyNumber: "BC123456789",
            policyHolderName: "Robert Taylor",
            policyHolderDOB: "1985-03-15",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-7",
          patientId: "00007",
          firstName: "Amanda",
          lastName: "Martinez",
          name: "Amanda Martinez",
          email: "amanda.martinez@email.com",
          phone: "+1 (555) 901-2345",
          locationId: "branch-1",
          locationName: "Downtown Branch",
          dateOfBirth: "1992-06-08",
          gender: "Female",
          address: {
            street: "234 Birch Street",
            city: "New York",
            state: "NY",
            zip: "10007",
          },
          registeredDate: "2024-04-18",
          lastVisit: "2025-01-15",
          status: "Active" as const,
          totalAppointments: 11,
          appointmentCount: 11,
          outstandingAmount: 200,
          lastUpdated: "2025-01-15",
          addedDate: "2024-04-18",
          tag: "self-signup" as const,
          insurance: {
            provider: "Cigna",
            policyNumber: "CG789456123",
            policyHolderName: "Amanda Martinez",
            policyHolderDOB: "1992-06-08",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-8",
          patientId: "00008",
          firstName: "Christopher",
          lastName: "Anderson",
          name: "Christopher Anderson",
          email: "chris.anderson@email.com",
          phone: "+1 (555) 012-3456",
          locationId: "branch-2",
          locationName: "Uptown Branch",
          dateOfBirth: "1987-09-22",
          gender: "Male",
          address: {
            street: "345 Spruce Avenue",
            city: "New York",
            state: "NY",
            zip: "10008",
          },
          registeredDate: "2024-07-10",
          lastVisit: "2024-12-28",
          status: "Active" as const,
          totalAppointments: 7,
          appointmentCount: 7,
          outstandingAmount: 0,
          lastUpdated: "2024-12-28",
          addedDate: "2024-07-10",
          tag: "staff" as const,
        },
        {
          id: "patient-9",
          patientId: "00009",
          firstName: "Jessica",
          lastName: "White",
          email: "jessica.white@email.com",
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1993-11-30",
          gender: "Female",
          address: {
            street: "456 Willow Drive",
            city: "New York",
            state: "NY",
            zip: "10009",
          },
          registeredDate: "2024-09-05",
          status: "Link sent" as const,
          totalAppointments: 0,
          addedDate: "2024-09-05",
          tag: "link-sent" as const,
        },
        {
          id: "patient-10",
          patientId: "00010",
          firstName: "Matthew",
          lastName: "Harris",
          email: "matthew.harris@email.com",
          phone: "+1 (555) 234-5678",
          dateOfBirth: "1981-04-12",
          gender: "Male",
          address: {
            street: "567 Ash Lane",
            city: "New York",
            state: "NY",
            zip: "10010",
          },
          registeredDate: "2024-02-28",
          lastVisit: "2025-01-12",
          upcomingAppointment: "2025-02-18",
          status: "Active" as const,
          totalAppointments: 13,
          outstandingAmount: 125,
          lastUpdated: "2025-01-12",
          addedDate: "2024-02-28",
          tag: "self-signup" as const,
          insurance: {
            provider: "Humana",
            policyNumber: "HU321654987",
            policyHolderName: "Matthew Harris",
            policyHolderDOB: "1981-04-12",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-11",
          patientId: "00011",
          firstName: "Ashley",
          lastName: "Clark",
          email: "ashley.clark@email.com",
          phone: "+1 (555) 345-6789",
          dateOfBirth: "1994-08-20",
          gender: "Female",
          address: {
            street: "678 Poplar Road",
            city: "New York",
            state: "NY",
            zip: "10011",
          },
          registeredDate: "2024-05-22",
          lastVisit: "2025-01-08",
          status: "Active" as const,
          totalAppointments: 10,
          outstandingAmount: 0,
          lastUpdated: "2025-01-08",
          addedDate: "2024-05-22",
          tag: "staff" as const,
        },
        {
          id: "patient-12",
          patientId: "00012",
          firstName: "Daniel",
          lastName: "Lewis",
          email: "daniel.lewis@email.com",
          phone: "+1 (555) 456-7890",
          dateOfBirth: "1986-01-15",
          gender: "Male",
          address: {
            street: "789 Chestnut Street",
            city: "New York",
            state: "NY",
            zip: "10012",
          },
          registeredDate: "2024-03-14",
          lastVisit: "2025-01-20",
          upcomingAppointment: "2025-02-22",
          status: "Active" as const,
          totalAppointments: 14,
          outstandingAmount: 50,
          lastUpdated: "2025-01-20",
          addedDate: "2024-03-14",
          tag: "self-signup" as const,
          insurance: {
            provider: "Kaiser Permanente",
            policyNumber: "KP654987321",
            policyHolderName: "Daniel Lewis",
            policyHolderDOB: "1986-01-15",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-13",
          patientId: "00013",
          firstName: "Lauren",
          lastName: "Walker",
          email: "lauren.walker@email.com",
          phone: "+1 (555) 567-8901",
          dateOfBirth: "1997-05-28",
          gender: "Female",
          address: {
            street: "890 Hickory Avenue",
            city: "New York",
            state: "NY",
            zip: "10013",
          },
          registeredDate: "2024-10-10",
          status: "Link sent" as const,
          totalAppointments: 0,
          addedDate: "2024-10-10",
          tag: "link-sent" as const,
        },
        {
          id: "patient-14",
          patientId: "00014",
          firstName: "Kevin",
          lastName: "Young",
          email: "kevin.young@email.com",
          phone: "+1 (555) 678-9012",
          dateOfBirth: "1983-12-03",
          gender: "Male",
          address: {
            street: "901 Beech Lane",
            city: "New York",
            state: "NY",
            zip: "10014",
          },
          registeredDate: "2024-01-20",
          lastVisit: "2025-01-22",
          upcomingAppointment: "2025-02-28",
          status: "Active" as const,
          totalAppointments: 16,
          outstandingAmount: 0,
          lastUpdated: "2025-01-22",
          addedDate: "2024-01-20",
          tag: "self-signup" as const,
          insurance: {
            provider: "Blue Shield",
            policyNumber: "BS987321654",
            policyHolderName: "Kevin Young",
            policyHolderDOB: "1983-12-03",
            relationshipToPolicyholder: "Self",
          },
        },
        {
          id: "patient-15",
          patientId: "00015",
          firstName: "Michelle",
          lastName: "King",
          email: "michelle.king@email.com",
          phone: "+1 (555) 789-0123",
          dateOfBirth: "1991-02-17",
          gender: "Female",
          address: {
            street: "012 Magnolia Drive",
            city: "New York",
            state: "NY",
            zip: "10015",
          },
          registeredDate: "2024-11-15",
          status: "Inactive" as const,
          totalAppointments: 2,
          lastUpdated: "2024-11-30",
          addedDate: "2024-11-15",
          tag: "staff" as const,
        },
      ]);
    }
  }, []);

  // Auth Flow Handlers
  const handleSignupSuccess = (email: string) => {
    setUserEmail(email);
    setPasswordContext("signup");
    if (currentEntity === "patient") {
      setCurrentScreen("otpPassword");
    } else {
      setCurrentScreen("clinicAdminVerification");
    }
    setIsNewSignup(true);
  };

  const handleOTPPasswordSuccess = (message: string) => {
    setLoginSuccessMessage(message);
    if (currentEntity === "patient") {
      // For new signups, go to patient onboarding; for password reset, go to login
      if (isNewSignup) {
        setCurrentScreen("patientOnboarding");
      } else {
        setCurrentScreen("login");
      }
    } else {
      setCurrentScreen("clinicAdminLogin");
    }
  };

  // Subscription Flow Handlers
  const handleSelectPlan = (
    planId: string,
    billingCycle: "monthly" | "yearly",
  ) => {
    const planDetails = {
      starter: {
        name: "Starter",
        monthlyPrice: 99,
        yearlyPrice: 79,
        locationLimit: "1 location",
        userLimit: "Up to 5 users",
      },
      professional: {
        name: "Professional",
        monthlyPrice: 249,
        yearlyPrice: 199,
        locationLimit: "Up to 5 locations",
        userLimit: "Up to 25 users",
      },
      enterprise: {
        name: "Enterprise",
        monthlyPrice: 499,
        yearlyPrice: 399,
        locationLimit: "Unlimited locations",
        userLimit: "Unlimited users",
      },
    };

    const plan =
      planDetails[planId as keyof typeof planDetails];
    setSelectedPlan({
      id: planId,
      name: plan.name,
      billingCycle,
      price:
        billingCycle === "monthly"
          ? plan.monthlyPrice
          : plan.yearlyPrice,
      locationLimit: plan.locationLimit,
      userLimit: plan.userLimit,
    });
    setCurrentScreen("organizationDetails");
  };

  const handleOrganizationDetailsSubmit = (
    data: OrganizationData,
  ) => {
    setOrganizationData(data);
    setUserEmail(data.email);
    setPasswordContext("signup");
    setCurrentScreen("clinicAdminVerification");
  };

  const handleSubscriptionOTPSuccess = () => {
    setCurrentScreen("subscriptionCheckout");
  };

  const handlePaymentSuccess = () => {
    setCurrentScreen("subscriptionSuccess");
  };

  const handleSetupWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setSetupComplete(true);
    localStorage.setItem("setupComplete", "true");
    localStorage.removeItem("setupWizardProgress");

    // Generate dummy data based on wizard configuration
    console.log("Setup wizard completed with data:", data);

    // Create branch from location data
    let branchesData: any[] = [];
    if (data.location) {
      const newBranch = {
        id: "branch-1",
        name: data.location.name,
        address: `${data.location.street}, ${data.location.city}, ${data.location.state} ${data.location.zip}`,
        fullAddress: {
          street: data.location.street,
          city: data.location.city,
          state: data.location.state,
          zip: data.location.zip,
          country: data.location.country,
        },
        phone: "+1 (555) 123-4567",
        email: `contact@${data.location.name.toLowerCase().replace(/\s+/g, "")}.com`,
        timezone: data.location.timezone,
        status: "Active" as const,
        workingHours: data.location.workingHours,
        selfBookingEnabled: data.location.selfBookingEnabled,
        allowPatientCancel: data.location.allowPatientCancel,
        allowPatientReschedule:
          data.location.allowPatientReschedule,
        minNoticeHours: data.location.minNoticeHours,
        maxFutureDays: data.location.maxFutureDays,
        cancellationWindow: data.location.cancellationWindow,
        rescheduleWindow: data.location.rescheduleWindow,
      };
      branchesData = [newBranch];
      setBranches(branchesData);
    }

    // Create provider from provider data
    if (data.provider) {
      const newProvider = {
        id: "provider-1",
        firstName: data.provider.firstName,
        lastName: data.provider.lastName,
        email: data.provider.email,
        phone: "+1 (555) 987-6543",
        role: "Medical Staff",
        specialty: data.provider.specialty,
        branches: data.provider.assignedLocations,
        workingHours: data.provider.workingHours,
        selfBookable: data.provider.selfBookable,
        selfBookingEligible: data.provider.selfBookable,
        status: "Active" as const,
        accountStatus: "Active" as const,
        availabilityStatus: "Configured" as const,
        hasSchedule: true,
        hasVisitTypes: true,
        avatar: `https://ui-avatars.com/api/?name=${data.provider.firstName}+${data.provider.lastName}&background=3B82F6&color=fff`,
      };
      setProviders([newProvider]);
    }

    // Create default service types
    const defaultServiceTypes = [
      {
        id: "service-type-1",
        name: "Initial consultation",
        duration: 60,
        color: "#3B82F6",
        description:
          "First-time patient assessment and consultation",
        isActive: true,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "service-type-2",
        name: "Follow-up",
        duration: 30,
        color: "#10B981",
        description: "Regular follow-up appointment",
        isActive: true,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "service-type-3",
        name: "Therapy session",
        duration: 45,
        color: "#F59E0B",
        description: "Therapeutic treatment session",
        isActive: true,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setServiceTypes(defaultServiceTypes);

    // Create questionnaires if intake wizard is enabled
    if (data.intakeDefaults.enableIntakeWizard) {
      const defaultQuestionnaires = [
        {
          id: "questionnaire-1",
          categoryName: "Neck / Shoulder",
          categoryId: "neck-shoulder",
          name: "Neck and Shoulder Assessment",
          description:
            "Comprehensive assessment for neck and shoulder complaints",
          isActive: true,
          questionCount: 7,
          branchNames: data.location
            ? [data.location.name]
            : [],
          updatedAt: new Date().toISOString(),
          steps: [
            {
              title:
                "Chief complaint & functional difficulties",
              fields: [
                {
                  id: "complaint",
                  label: "What is your chief complaint?",
                  type: "textarea",
                  required: true,
                  placeholder:
                    "Describe your primary concern...",
                },
                {
                  id: "functionalDifficulty",
                  label:
                    "What functional difficulty are you experiencing?",
                  type: "textarea",
                  required: true,
                  placeholder:
                    "Describe difficulties in daily activities...",
                },
              ],
            },
            {
              title: "Relieving factors",
              fields: [
                {
                  id: "relievingFactors",
                  label: "What makes your symptoms better?",
                  type: "checkbox-group",
                  required: true,
                  options: [
                    "Rest",
                    "Ice",
                    "Heat",
                    "Medication",
                    "Stretching",
                    "Physical therapy",
                  ],
                },
              ],
            },
            {
              title: "Overall change & pain description",
              fields: [
                {
                  id: "overallChange",
                  label:
                    "How have your symptoms changed over time?",
                  type: "radio-group",
                  required: true,
                  options: [
                    "Much better",
                    "Somewhat better",
                    "No change",
                    "Somewhat worse",
                    "Much worse",
                  ],
                },
                {
                  id: "painDescription",
                  label: "Describe your pain",
                  type: "checkbox-group",
                  required: true,
                  options: [
                    "Sharp",
                    "Dull",
                    "Throbbing",
                    "Burning",
                    "Aching",
                    "Shooting",
                  ],
                },
              ],
            },
            {
              title: "Pain levels",
              fields: [
                {
                  id: "currentPain",
                  label: "Current pain level (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
                {
                  id: "worstPain",
                  label: "Worst pain level in past week (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
                {
                  id: "averagePain",
                  label: "Average pain level (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
              ],
            },
          ],
        },
        {
          id: "questionnaire-2",
          categoryName: "Lower Back",
          categoryId: "lower-back",
          name: "Lower Back Assessment",
          description:
            "Comprehensive assessment for lower back complaints",
          isActive: true,
          questionCount: 7,
          branchNames: data.location
            ? [data.location.name]
            : [],
          updatedAt: new Date().toISOString(),
          steps: [
            {
              title:
                "Chief complaint & functional difficulties",
              fields: [
                {
                  id: "complaint",
                  label: "What is your chief complaint?",
                  type: "textarea",
                  required: true,
                  placeholder:
                    "Describe your primary concern...",
                },
                {
                  id: "functionalDifficulty",
                  label:
                    "What functional difficulty are you experiencing?",
                  type: "textarea",
                  required: true,
                  placeholder:
                    "Describe difficulties in daily activities...",
                },
              ],
            },
            {
              title: "Relieving factors",
              fields: [
                {
                  id: "relievingFactors",
                  label: "What makes your symptoms better?",
                  type: "checkbox-group",
                  required: true,
                  options: [
                    "Rest",
                    "Ice",
                    "Heat",
                    "Medication",
                    "Stretching",
                    "Physical therapy",
                  ],
                },
              ],
            },
            {
              title: "Overall change & pain description",
              fields: [
                {
                  id: "overallChange",
                  label:
                    "How have your symptoms changed over time?",
                  type: "radio-group",
                  required: true,
                  options: [
                    "Much better",
                    "Somewhat better",
                    "No change",
                    "Somewhat worse",
                    "Much worse",
                  ],
                },
                {
                  id: "painDescription",
                  label: "Describe your pain",
                  type: "checkbox-group",
                  required: true,
                  options: [
                    "Sharp",
                    "Dull",
                    "Throbbing",
                    "Burning",
                    "Aching",
                    "Shooting",
                  ],
                },
              ],
            },
            {
              title: "Pain levels",
              fields: [
                {
                  id: "currentPain",
                  label: "Current pain level (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
                {
                  id: "worstPain",
                  label: "Worst pain level in past week (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
                {
                  id: "averagePain",
                  label: "Average pain level (0-10)",
                  type: "number",
                  required: true,
                  min: 0,
                  max: 10,
                },
              ],
            },
          ],
        },
      ];
      setQuestionnaires(defaultQuestionnaires);
    }

    // Create consent forms - always create them for patient onboarding
    const defaultConsentForms = [
      {
        id: "consent-1",
        title: "Terms and Conditions",
        content: `This agreement outlines the terms and conditions for receiving healthcare services at ${data.organizationName || "our clinic"}. By accepting these terms, you agree to:\n\n1. Provide accurate and complete information about your health history\n2. Follow the treatment plan recommended by your healthcare provider\n3. Notify us of any changes to your health status or contact information\n4. Arrive on time for your scheduled appointments\n5. Provide at least ${data.location?.cancellationWindow || 24} hours notice for cancellations\n\nFailure to comply with these terms may result in discharge from care.`,
        isActive: true,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "consent-2",
        title: "Privacy Policy",
        content: `${data.organizationName || "Our organization"} is committed to protecting your privacy and personal health information. This privacy policy explains how we collect, use, and safeguard your information:\n\n1. We collect only information necessary for providing quality healthcare\n2. Your information is stored securely and accessed only by authorized personnel\n3. We do not sell or share your information with third parties without your consent\n4. You have the right to access, correct, or request deletion of your information\n5. We comply with all applicable privacy laws and regulations including HIPAA\n\nBy accepting this policy, you acknowledge that you have read and understand how we handle your personal information.`,
        isActive: true,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "consent-3",
        title: "HIPAA Authorization",
        content: `This authorization allows ${data.organizationName || "our clinic"} to use and disclose your protected health information (PHI) for treatment, payment, and healthcare operations:\n\n1. We may use your PHI to provide, coordinate, or manage your healthcare\n2. We may disclose your PHI to other healthcare providers involved in your care\n3. We may use your PHI for billing and payment purposes\n4. We may contact you for appointment reminders and follow-up care\n5. You have the right to revoke this authorization at any time in writing\n\nThis authorization remains in effect until you revoke it or until the purpose for which it was given is accomplished.`,
        isActive: true,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "consent-4",
        title: "Consent to Treat",
        content: `By signing this consent, you authorize the healthcare providers at ${data.organizationName || "our clinic"} to perform the following:\n\n1. Conduct physical examinations and diagnostic tests as necessary\n2. Provide treatment including but not limited to physical therapy, chiropractic care, and rehabilitation\n3. Prescribe medications or therapeutic interventions as appropriate\n4. Make referrals to other healthcare specialists when needed\n5. Modify your treatment plan based on your progress and response to therapy\n\nYou have the right to ask questions about your treatment and to refuse any procedure or treatment. This consent remains in effect for all visits unless you revoke it in writing.`,
        isActive: true,
        isRequired: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setConsentForms(defaultConsentForms);

    // Create default roles
    const defaultRoles = [
      {
        id: "role-1",
        name: "Administrator",
        description:
          "Full access to all system features and settings",
        permissions: {
          dashboard: { view: true },
          branches: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          patients: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          questionnaires: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          providers: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          consentForms: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          master: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          roles: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          users: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          subscription: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        branchIds: branchesData.map((b) => b.id),
      },
      {
        id: "role-2",
        name: "Front Desk",
        description:
          "Manage appointments and patient check-ins",
        permissions: {
          dashboard: { view: true },
          branches: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          patients: {
            view: true,
            create: true,
            edit: true,
            delete: false,
          },
          questionnaires: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          providers: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          consentForms: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          master: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          roles: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          users: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          subscription: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
        },
        branchIds: branchesData.map((b) => b.id),
      },
    ];
    setRoles(defaultRoles);

    // Generate dummy patient data
    const dummyPatients = [
      {
        id: "patient-1",
        patientId: "00001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 234-5678",
        dateOfBirth: "1985-03-15",
        gender: "Male",
        address: {
          street: "123 Main Street",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10001",
        },
        registeredDate: "2024-01-15",
        lastVisit: "2024-12-20",
        upcomingAppointment: "2025-02-15",
        status: "Active" as const,
        totalAppointments: 8,
        outstandingAmount: 0,
        lastUpdated: "2024-12-20",
        addedDate: "2024-01-15",
        tag: "staff" as const,
        insurance: {
          provider: "Blue Cross Blue Shield",
          policyNumber: "BC123456789",
        },
      },
      {
        id: "patient-2",
        patientId: "00002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 345-6789",
        dateOfBirth: "1990-07-22",
        gender: "Female",
        address: {
          street: "456 Oak Avenue",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10002",
        },
        registeredDate: "2024-02-10",
        lastVisit: "2025-01-10",
        upcomingAppointment: "2025-02-20",
        status: "Active" as const,
        totalAppointments: 12,
        outstandingAmount: 150,
        lastUpdated: "2025-01-10",
        addedDate: "2024-02-10",
        tag: "self-signup" as const,
        insurance: {
          provider: "Aetna",
          policyNumber: "AE987654321",
        },
      },
      {
        id: "patient-3",
        patientId: "00003",
        firstName: "Michael",
        lastName: "Davis",
        email: "m.davis@email.com",
        phone: "+1 (555) 456-7890",
        dateOfBirth: "1978-11-05",
        gender: "Male",
        address: {
          street: "789 Pine Road",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10003",
        },
        registeredDate: "2024-03-20",
        lastVisit: "2024-12-15",
        status: "Active" as const,
        totalAppointments: 5,
        outstandingAmount: 0,
        lastUpdated: "2024-12-15",
        addedDate: "2024-03-20",
        tag: "staff" as const,
      },
      {
        id: "patient-4",
        patientId: "00004",
        firstName: "Emily",
        lastName: "Wilson",
        email: "emily.wilson@email.com",
        phone: "+1 (555) 567-8901",
        dateOfBirth: "1995-04-18",
        gender: "Female",
        address: {
          street: "321 Elm Street",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10004",
        },
        registeredDate: "2024-05-12",
        lastVisit: "2025-01-18",
        upcomingAppointment: "2025-02-25",
        status: "Active" as const,
        totalAppointments: 6,
        outstandingAmount: 75,
        lastUpdated: "2025-01-18",
        addedDate: "2024-05-12",
        tag: "self-signup" as const,
        insurance: {
          provider: "UnitedHealthcare",
          policyNumber: "UH456789123",
        },
      },
      {
        id: "patient-5",
        patientId: "00005",
        firstName: "Robert",
        lastName: "Martinez",
        email: "r.martinez@email.com",
        phone: "+1 (555) 678-9012",
        dateOfBirth: "1982-09-30",
        gender: "Male",
        address: {
          street: "654 Maple Drive",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10005",
        },
        registeredDate: "2024-06-08",
        lastVisit: "2024-11-22",
        status: "Inactive" as const,
        totalAppointments: 3,
        outstandingAmount: 0,
        lastUpdated: "2024-11-22",
        addedDate: "2024-06-08",
        tag: "link-sent" as const,
      },
      {
        id: "patient-6",
        patientId: "00006",
        firstName: "Jessica",
        lastName: "Anderson",
        email: "jessica.a@email.com",
        phone: "+1 (555) 789-0123",
        dateOfBirth: "1988-12-12",
        gender: "Female",
        address: {
          street: "987 Cedar Lane",
          city: data.location?.city || "New York",
          state: data.location?.state || "NY",
          zip: "10006",
        },
        registeredDate: "2024-08-25",
        status: "Link sent" as const,
        totalAppointments: 0,
        addedDate: "2024-08-25",
        tag: "link-sent" as const,
      },
    ];
    setPatients(dummyPatients);

    // Create users from invited staff
    if (data.staff && data.staff.length > 0) {
      const staffUsers = data.staff.map(
        (staffMember, index) => ({
          id: `user-${index + 2}`, // Start from 2 since admin is user-1
          email: staffMember.email,
          name: staffMember.email.split("@")[0],
          role: staffMember.role,
          assignedBranches: staffMember.locations,
          status: "Pending" as const, // Since they're invited but haven't accepted yet
          lastLogin: null,
        }),
      );

      // Add the admin user (the person who completed setup)
      const adminUser = {
        id: "user-1",
        email: organizationData?.email || "admin@clinic.com",
        name: data.organizationName,
        role: "Administrator",
        assignedBranches: data.location
          ? [data.location.name]
          : [],
        status: "Active" as const,
        lastLogin: new Date().toISOString(),
      };

      setUsers([adminUser, ...staffUsers]);
    } else {
      // Just create the admin user
      const adminUser = {
        id: "user-1",
        email: organizationData?.email || "admin@clinic.com",
        name: data.organizationName,
        role: "Administrator",
        assignedBranches: data.location
          ? [data.location.name]
          : [],
        status: "Active" as const,
        lastLogin: new Date().toISOString(),
      };
      setUsers([adminUser]);
    }

    // Navigate to clinic admin dashboard
    setCurrentScreen("clinicAdminDashboard");
  };

  const handleResumeSetup = () => {
    setCurrentScreen("setupWizard");
  };

  // Force initialize patient portal appointments if empty (for patient entity)
  useEffect(() => {
    if (
      currentEntity === "patient" &&
      appointments.length === 0
    ) {
      const today = new Date();
      setAppointments([
        {
          id: "apt-1",
          appointmentId: "APT-2025-0001",
          patientId: "patient-1",
          patientName: "Emma Wilson",
          providerId: "user-2",
          date: new Date(today.getTime())
            .toISOString()
            .split("T")[0],
          time: "10:30",
          timeSlot: "10:30 AM - 11:00 AM",
          provider: "Dr. Michael Chen",
          clinic: "Uptown Wellness Clinic",
          clinicAddress:
            "456 Park Avenue, 2nd Floor, New York, NY 10022",
          service: "Chiropractic Adjustment",
          status: "Confirmed" as const,
        },
        {
          id: "apt-4",
          appointmentId: "APT-2025-0004",
          patientId: "patient-1",
          patientName: "Emma Wilson",
          providerId: "user-2",
          date: new Date(
            today.getTime() + 2 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          time: "11:00",
          timeSlot: "11:00 AM - 11:30 AM",
          provider: "Dr. Michael Chen",
          clinic: "Uptown Wellness Clinic",
          clinicAddress:
            "456 Park Avenue, 2nd Floor, New York, NY 10022",
          service: "Follow-up",
          status: "Confirmed" as const,
        },
        {
          id: "apt-7",
          appointmentId: "APT-2025-0007",
          patientId: "patient-1",
          patientName: "Emma Wilson",
          providerId: "user-2",
          date: new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split("T")[0],
          time: "09:30",
          timeSlot: "9:30 AM - 10:00 AM",
          provider: "Dr. Michael Chen",
          clinic: "Uptown Wellness Clinic",
          clinicAddress:
            "456 Park Avenue, 2nd Floor, New York, NY 10022",
          service: "Chiropractic Adjustment",
          status: "Completed" as const,
        },
      ]);
    }
  }, [currentEntity, appointments.length]);

  const handleLogout = () => {
    setCurrentEntity("patient");
    setCurrentScreen("login");
  };

  const handleLoginSuccess = () => {
    // Clinic Admin login
    if (currentEntity === "clinicAdmin") {
      // Add dummy branches data
      if (branches.length === 0) {
        setBranches([
          {
            id: "branch-1",
            name: "Downtown Branch",
            clinicName: "SpineCloudIQ Medical Center",
            email: "downtown@spinecloudiq.com",
            street: "123 Main Street, Suite 400",
            city: "New York",
            state: "New York",
            zip: "10001",
            country: "US",
            status: "Active" as const,
            workingHours: {
              monday: {
                open: "09:00",
                close: "17:00",
                isOpen: true,
              },
              tuesday: {
                open: "09:00",
                close: "17:00",
                isOpen: true,
              },
              wednesday: {
                open: "09:00",
                close: "17:00",
                isOpen: true,
              },
              thursday: {
                open: "09:00",
                close: "17:00",
                isOpen: true,
              },
              friday: {
                open: "09:00",
                close: "17:00",
                isOpen: true,
              },
              saturday: {
                open: "09:00",
                close: "13:00",
                isOpen: false,
              },
              sunday: {
                open: "09:00",
                close: "13:00",
                isOpen: false,
              },
            },
          },
          {
            id: "branch-2",
            name: "Uptown Branch",
            clinicName: "SpineCloudIQ Wellness Center",
            email: "uptown@spinecloudiq.com",
            street: "456 Park Avenue, 2nd Floor",
            city: "New York",
            state: "New York",
            zip: "10022",
            country: "US",
            status: "Active" as const,
            workingHours: {
              monday: {
                open: "08:00",
                close: "19:00",
                isOpen: true,
              },
              tuesday: {
                open: "08:00",
                close: "19:00",
                isOpen: true,
              },
              wednesday: {
                open: "08:00",
                close: "19:00",
                isOpen: true,
              },
              thursday: {
                open: "08:00",
                close: "19:00",
                isOpen: true,
              },
              friday: {
                open: "08:00",
                close: "19:00",
                isOpen: true,
              },
              saturday: {
                open: "09:00",
                close: "15:00",
                isOpen: true,
              },
              sunday: {
                open: "09:00",
                close: "13:00",
                isOpen: false,
              },
            },
          },
          {
            id: "branch-3",
            name: "Brooklyn Branch",
            clinicName: "SpineCloudIQ Health Center",
            email: "brooklyn@spinecloudiq.com",
            street: "789 Atlantic Avenue",
            city: "Brooklyn",
            state: "New York",
            zip: "11217",
            country: "US",
            status: "Inactive" as const,
            workingHours: {
              monday: {
                open: "10:00",
                close: "17:00",
                isOpen: true,
              },
              tuesday: {
                open: "10:00",
                close: "17:00",
                isOpen: true,
              },
              wednesday: {
                open: "10:00",
                close: "17:00",
                isOpen: true,
              },
              thursday: {
                open: "10:00",
                close: "17:00",
                isOpen: true,
              },
              friday: {
                open: "10:00",
                close: "17:00",
                isOpen: true,
              },
              saturday: {
                open: "09:00",
                close: "13:00",
                isOpen: false,
              },
              sunday: {
                open: "09:00",
                close: "13:00",
                isOpen: false,
              },
            },
          },
        ]);
      }

      // Add dummy roles data
      if (roles.length === 0) {
        setRoles([
          {
            id: "role-1",
            name: "Clinic Administrator",
            description:
              "Full access to all clinic management features",
            permissions: {
              dashboard: { view: true },
              branches: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              patients: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              questionnaires: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              providers: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              consentForms: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              master: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              roles: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              users: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              subscription: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
            },
            branchIds: ["branch-1", "branch-2", "branch-3"],
          },
          {
            id: "role-2",
            name: "Medical Staff",
            description:
              "Access to patient records and appointment management",
            permissions: {
              dashboard: { view: true },
              branches: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              patients: {
                view: true,
                create: true,
                edit: true,
                delete: false,
              },
              questionnaires: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              providers: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              consentForms: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              master: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              roles: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              users: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              subscription: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
            },
            branchIds: ["branch-1", "branch-2"],
          },
          {
            id: "role-3",
            name: "Receptionist",
            description:
              "Front desk operations and appointment scheduling",
            permissions: {
              dashboard: { view: true },
              branches: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              patients: {
                view: true,
                create: true,
                edit: true,
                delete: false,
              },
              questionnaires: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              providers: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              consentForms: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              master: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              roles: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              users: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              subscription: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
            },
            branchIds: ["branch-1"],
          },
          {
            id: "role-4",
            name: "Billing Specialist",
            description:
              "Manage billing, insurance claims, and financial records",
            permissions: {
              dashboard: { view: true },
              branches: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              patients: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              questionnaires: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              providers: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              consentForms: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              master: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              roles: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              users: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              subscription: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
            },
            branchIds: ["branch-1", "branch-2"],
          },
        ]);
      }

      // Add dummy users data
      if (users.length === 0) {
        setUsers([
          {
            id: "user-1",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@example.com",
            role: "Clinic Administrator",
            status: "Accepted",
            invitedAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            acceptedAt: new Date(
              Date.now() - 6 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "user-2",
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.chen@example.com",
            role: "Medical Staff",
            status: "Accepted",
            invitedAt: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            acceptedAt: new Date(
              Date.now() - 13 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "user-3",
            firstName: "Emily",
            lastName: "Rodriguez",
            email: "emily.rodriguez@example.com",
            role: "Receptionist",
            status: "Pending",
            invitedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "user-4",
            firstName: "David",
            lastName: "Kim",
            email: "david.kim@example.com",
            role: "Billing Specialist",
            status: "Expired",
            invitedAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ]);
      }

      // Add dummy questionnaires data
      if (questionnaires.length === 0) {
        setQuestionnaires([
          {
            id: "quest-1",
            categoryName: "Neck / Shoulder Pain",
            description:
              "Help us understand your neck and shoulder pain better",
            questionCount: 5,
            branchNames: ["Downtown Branch", "Uptown Branch"],
            branchIds: ["branch-1", "branch-2"],
            createdAt: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            questions: [
              {
                id: "q1",
                text: "What brings you to the clinic today?",
                type: "textarea",
                required: true,
              },
              {
                id: "q2",
                text: "How would you rate your pain?",
                type: "slider",
                min: 0,
                max: 10,
                required: true,
              },
              {
                id: "q3",
                text: "When did the pain start?",
                type: "radio",
                options: [
                  "Less than 1 week",
                  "1-4 weeks",
                  "1-3 months",
                  "More than 3 months",
                ],
                required: true,
              },
              {
                id: "q4",
                text: "What activities make it worse?",
                type: "checkbox",
                options: [
                  "Sitting",
                  "Standing",
                  "Walking",
                  "Lifting",
                  "Bending",
                ],
                required: false,
              },
              {
                id: "q5",
                text: "Have you had this condition before?",
                type: "radio",
                options: ["Yes", "No"],
                required: true,
              },
            ],
          },
          {
            id: "quest-2",
            categoryName: "Lower Back Pain",
            description:
              "Tell us about your lower back condition",
            questionCount: 4,
            branchNames: ["Downtown Branch"],
            branchIds: ["branch-1"],
            createdAt: new Date(
              Date.now() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            questions: [
              {
                id: "q1",
                text: "Rate your current pain level",
                type: "slider",
                min: 0,
                max: 10,
                required: true,
              },
              {
                id: "q2",
                text: "Does the pain radiate to your legs?",
                type: "radio",
                options: ["Yes", "No"],
                required: true,
              },
              {
                id: "q3",
                text: "What makes your pain better?",
                type: "checkbox",
                options: [
                  "Rest",
                  "Ice",
                  "Heat",
                  "Medication",
                  "Exercise",
                ],
                required: false,
              },
              {
                id: "q4",
                text: "Additional notes",
                type: "textarea",
                required: false,
              },
            ],
          },
        ]);
      }

      // Add dummy providers data
      if (providers.length === 0) {
        setProviders([
          {
            id: "user-2",
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.chen@example.com",
            role: "Medical Staff",
            specialty: "Chiropractor",
            color: "#3B82F6",
            branches: ["Downtown Branch", "Uptown Branch"],
            status: "Active",
            workingHours: {
              monday: [{ start: "08:00", end: "19:00" }],
              tuesday: [{ start: "08:00", end: "19:00" }],
              wednesday: [{ start: "08:00", end: "19:00" }],
              thursday: [{ start: "08:00", end: "19:00" }],
              friday: [{ start: "08:00", end: "19:00" }],
              saturday: [{ start: "09:00", end: "15:00" }],
              sunday: [],
            },
            schedule: {
              monday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "10:00",
                    endTime: "12:00",
                    branchId: "branch-2",
                  },
                  {
                    startTime: "15:00",
                    endTime: "18:00",
                    branchId: "branch-1",
                  },
                ],
              },
              tuesday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "13:00",
                    branchId: "branch-2",
                  },
                ],
              },
              wednesday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "09:00",
                    endTime: "12:00",
                    branchId: "branch-2",
                  },
                  {
                    startTime: "14:00",
                    endTime: "17:00",
                    branchId: "branch-2",
                  },
                ],
              },
              thursday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "09:00",
                    endTime: "12:00",
                    branchId: "branch-1",
                  },
                  {
                    startTime: "15:00",
                    endTime: "18:00",
                    branchId: "branch-1",
                  },
                ],
              },
              friday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "09:00",
                    endTime: "12:00",
                    branchId: "branch-1",
                  },
                  {
                    startTime: "13:00",
                    endTime: "16:00",
                    branchId: "branch-2",
                  },
                ],
              },
              saturday: { isWorking: false, timeSlots: [] },
              sunday: { isWorking: false, timeSlots: [] },
            },
          },
          {
            id: "user-1",
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@example.com",
            role: "Clinic Administrator",
            specialty: "Physical Therapist",
            color: "#10B981",
            branches: ["Downtown Branch"],
            status: "Active",
            workingHours: {
              monday: [{ start: "08:00", end: "16:00" }],
              tuesday: [{ start: "08:00", end: "16:00" }],
              wednesday: [{ start: "08:00", end: "16:00" }],
              thursday: [{ start: "08:00", end: "16:00" }],
              friday: [{ start: "08:00", end: "12:00" }],
              saturday: [],
              sunday: [],
            },
            schedule: {
              monday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "16:00",
                    branchId: "branch-1",
                  },
                ],
              },
              tuesday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "16:00",
                    branchId: "branch-1",
                  },
                ],
              },
              wednesday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "16:00",
                    branchId: "branch-1",
                  },
                ],
              },
              thursday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "16:00",
                    branchId: "branch-1",
                  },
                ],
              },
              friday: {
                isWorking: true,
                timeSlots: [
                  {
                    startTime: "08:00",
                    endTime: "12:00",
                    branchId: "branch-1",
                  },
                ],
              },
              saturday: { isWorking: false, timeSlots: [] },
              sunday: { isWorking: false, timeSlots: [] },
            },
          },
          {
            id: "user-3",
            firstName: "Emily",
            lastName: "Rodriguez",
            email: "emily.rodriguez@example.com",
            role: "Medical Staff",
            specialty: "Physical Therapist",
            color: "#F59E0B",
            branches: ["Downtown Branch"],
            status: "Active",
            workingHours: {
              monday: [{ start: "09:00", end: "17:00" }],
              tuesday: [{ start: "09:00", end: "17:00" }],
              wednesday: [{ start: "09:00", end: "17:00" }],
              thursday: [{ start: "09:00", end: "17:00" }],
              friday: [{ start: "09:00", end: "17:00" }],
              saturday: [],
              sunday: [],
            },
            schedule: {
              monday: { isWorking: true, timeSlots: [{ startTime: "09:00", endTime: "17:00", branchId: "branch-1" }] },
              tuesday: { isWorking: true, timeSlots: [{ startTime: "09:00", endTime: "17:00", branchId: "branch-1" }] },
              wednesday: { isWorking: true, timeSlots: [{ startTime: "09:00", endTime: "17:00", branchId: "branch-1" }] },
              thursday: { isWorking: true, timeSlots: [{ startTime: "09:00", endTime: "17:00", branchId: "branch-1" }] },
              friday: { isWorking: true, timeSlots: [{ startTime: "09:00", endTime: "17:00", branchId: "branch-1" }] },
              saturday: { isWorking: false, timeSlots: [] },
              sunday: { isWorking: false, timeSlots: [] },
            },
          },
          {
            id: "user-4",
            firstName: "David",
            lastName: "Kim",
            email: "david.kim@example.com",
            role: "Medical Staff",
            specialty: "Massage Therapist",
            color: "#8B5CF6",
            branches: ["Uptown Branch"],
            status: "Active",
            workingHours: {
              monday: [{ start: "10:00", end: "18:00" }],
              tuesday: [{ start: "10:00", end: "18:00" }],
              wednesday: [{ start: "10:00", end: "18:00" }],
              thursday: [{ start: "10:00", end: "18:00" }],
              friday: [{ start: "10:00", end: "14:00" }],
              saturday: [],
              sunday: [],
            },
            schedule: {
              monday: { isWorking: true, timeSlots: [{ startTime: "10:00", endTime: "18:00", branchId: "branch-2" }] },
              tuesday: { isWorking: true, timeSlots: [{ startTime: "10:00", endTime: "18:00", branchId: "branch-2" }] },
              wednesday: { isWorking: true, timeSlots: [{ startTime: "10:00", endTime: "18:00", branchId: "branch-2" }] },
              thursday: { isWorking: true, timeSlots: [{ startTime: "10:00", endTime: "18:00", branchId: "branch-2" }] },
              friday: { isWorking: true, timeSlots: [{ startTime: "10:00", endTime: "14:00", branchId: "branch-2" }] },
              saturday: { isWorking: false, timeSlots: [] },
              sunday: { isWorking: false, timeSlots: [] },
            },
          },
        ]);
      }

      // Add dummy consent forms data
      if (consentForms.length === 0) {
        const now = new Date();
        setConsentForms([
          {
            id: "consent-1",
            title: "Patient consent for treatment",
            content: `<h2>Consent for Treatment</h2><p>I, <strong>{{firstName}} {{lastName}}</strong>, hereby consent to receive chiropractic treatment and related healthcare services.</p><p><strong>Patient Information:</strong></p><ul><li>Email: {{email}}</li><li>Phone: {{mobile}}</li><li>Date of Birth: {{dateOfBirth}}</li></ul><p>I understand that the treatment may include manual adjustments, soft tissue therapy, and other therapeutic procedures as deemed necessary by my healthcare provider.</p>`,
            status: "Active" as const,
            createdAt: new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "consent-2",
            title: "HIPAA authorization form",
            content: `<h2>HIPAA Authorization</h2><p>I, <strong>{{firstName}} {{lastName}}</strong>, authorize SpineCloudIQ to use and disclose my protected health information for treatment, payment, and healthcare operations.</p><p><strong>Contact Information:</strong></p><ul><li>Address: {{street}}, {{city}}, {{state}} {{zip}}</li><li>Email: {{email}}</li><li>Mobile: {{mobile}}</li></ul><p>This authorization is effective immediately and will remain in effect until revoked in writing.</p>`,
            status: "Active" as const,
            createdAt: new Date(
              now.getTime() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "consent-3",
            title: "Financial responsibility agreement",
            content: `<h2>Financial Responsibility Agreement</h2><p>Patient Name: <strong>{{firstName}} {{lastName}}</strong></p><p>I understand that I am financially responsible for all charges not covered by my insurance plan. I agree to pay my portion of the charges at the time of service.</p><p><strong>Emergency Contact:</strong></p><ul><li>Name: {{emergencyContactName}}</li><li>Phone: {{emergencyContactPhone}}</li></ul><p>I have read and agree to the terms outlined above.</p>`,
            status: "Active" as const,
            createdAt: new Date(
              now.getTime() - 60 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "consent-4",
            title: "Privacy policy acknowledgment",
            content: `<h2>Privacy Policy Acknowledgment</h2><p>I, <strong>{{firstName}} {{lastName}}</strong>, acknowledge that I have received and reviewed the SpineCloudIQ Privacy Policy.</p><p>I understand how my personal information will be collected, used, and protected in accordance with applicable privacy laws.</p><p><strong>Patient Details:</strong></p><ul><li>Gender: {{gender}}</li><li>Date of Birth: {{dateOfBirth}}</li><li>Contact: {{email}} | {{mobile}}</li></ul>`,
            status: "Inactive" as const,
            createdAt: new Date(
              now.getTime() - 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 90 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ]);
      }

      // Add dummy service types data
      if (serviceTypes.length === 0) {
        const now = new Date();
        setServiceTypes([
          {
            id: "service-type-1",
            name: "Initial consultation",
            branches: ["Downtown Branch", "Uptown Branch"],
            status: "Active" as const,
            description:
              "Initial consultation for new patients",
            addedDate: new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            createdAt: new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "service-type-2",
            name: "Follow-up",
            branches: ["Downtown Branch"],
            status: "Active" as const,
            description:
              "Follow-up visit for existing patients",
            addedDate: new Date(
              now.getTime() - 25 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            createdAt: new Date(
              now.getTime() - 25 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "service-type-3",
            name: "Therapy session",
            branches: ["Uptown Branch", "Brooklyn Branch"],
            status: "Active" as const,
            description: "Therapeutic treatment session",
            addedDate: new Date(
              now.getTime() - 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            createdAt: new Date(
              now.getTime() - 20 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "service-type-4",
            name: "Chiropractic adjustment",
            branches: [
              "Downtown Branch",
              "Uptown Branch",
              "Brooklyn Branch",
            ],
            status: "Active" as const,
            description: "Chiropractic adjustment session",
            addedDate: new Date(
              now.getTime() - 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            createdAt: new Date(
              now.getTime() - 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            updatedAt: new Date(
              now.getTime() - 15 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ]);
      }

      // Add dummy service categories and services
      if (
        serviceCategories.length === 0 &&
        services.length === 0
      ) {
        const now = new Date();

        // Service Categories
        const categories = [
          {
            id: "cat-1",
            name: "Appointments",
            description:
              "Standard services and consultations",
            order: 1,
          },
          {
            id: "cat-2",
            name: "Therapy",
            description: "Therapeutic services and treatments",
            order: 2,
          },
          {
            id: "cat-3",
            name: "Diagnostics",
            description: "Diagnostic and assessment services",
            order: 3,
          },
        ];
        setServiceCategories(categories);

        // Services
        const servicesData = [
          // Appointments category
          {
            id: "svc-1",
            categoryId: "cat-1",
            name: "Initial Consultation",
            description:
              "Comprehensive first-time patient consultation and assessment",
            durations: [
              {
                id: "dur-1",
                duration: 30,
                recoveryTime: 10,
                price: 100,
              },
              {
                id: "dur-2",
                duration: 60,
                recoveryTime: 15,
                price: 180,
              },
            ],
            locationIds: ["branch-1", "branch-2"],
            providerIds: ["user-1", "user-2"],
            allowOnlineBooking: true,
            isActive: true,
          },
          {
            id: "svc-2",
            categoryId: "cat-1",
            name: "Follow-up Appointment",
            description:
              "Regular follow-up visit for ongoing treatment",
            durations: [
              {
                id: "dur-3",
                duration: 15,
                recoveryTime: 5,
                price: 50,
              },
              {
                id: "dur-4",
                duration: 30,
                recoveryTime: 10,
                price: 85,
              },
            ],
            locationIds: ["branch-1", "branch-2", "branch-3"],
            providerIds: ["user-1", "user-2"],
            allowOnlineBooking: true,
            isActive: true,
          },
          // Therapy category
          {
            id: "svc-3",
            categoryId: "cat-2",
            name: "Cupping Therapy",
            description:
              "Traditional cupping therapy session for muscle relief",
            durations: [
              {
                id: "dur-5",
                duration: 30,
                recoveryTime: 5,
                price: 75,
              },
              {
                id: "dur-6",
                duration: 45,
                recoveryTime: 10,
                price: 110,
              },
            ],
            locationIds: ["branch-1", "branch-2"],
            providerIds: ["user-1"],
            allowOnlineBooking: true,
            isActive: true,
          },
          {
            id: "svc-4",
            categoryId: "cat-2",
            name: "Spasm Therapy",
            description:
              "Targeted treatment for muscle spasms and tension",
            durations: [
              {
                id: "dur-7",
                duration: 25,
                recoveryTime: 10,
                price: 95,
              },
              {
                id: "dur-8",
                duration: 50,
                recoveryTime: 15,
                price: 165,
              },
            ],
            locationIds: ["branch-2"],
            providerIds: ["user-2"],
            allowOnlineBooking: false,
            isActive: true,
          },
          {
            id: "svc-5",
            categoryId: "cat-2",
            name: "Manual Therapy",
            description:
              "Hands-on mobilization and manipulation techniques",
            durations: [
              {
                id: "dur-9",
                duration: 30,
                recoveryTime: 5,
                price: 85,
              },
            ],
            locationIds: ["branch-1"],
            providerIds: ["user-1", "user-2"],
            allowOnlineBooking: true,
            isActive: true,
          },
          // Diagnostics category
          {
            id: "svc-6",
            categoryId: "cat-3",
            name: "Posture Analysis",
            description:
              "Comprehensive posture and movement assessment",
            durations: [
              {
                id: "dur-10",
                duration: 45,
                recoveryTime: 0,
                price: 120,
              },
            ],
            locationIds: ["branch-1", "branch-2"],
            providerIds: ["user-1"],
            allowOnlineBooking: true,
            isActive: true,
          },
          {
            id: "svc-7",
            categoryId: "cat-3",
            name: "Range of Motion Assessment",
            description:
              "Detailed evaluation of joint mobility and flexibility",
            durations: [
              {
                id: "dur-11",
                duration: 30,
                recoveryTime: 5,
                price: 90,
              },
            ],
            locationIds: ["branch-1", "branch-3"],
            providerIds: ["user-2"],
            allowOnlineBooking: false,
            isActive: false,
          },
        ];
        setServices(servicesData);
      }

      // Add comprehensive dummy appointments for clinic admin calendar
      if (patientAppointments.length === 0) {
        const generatedAppointments =
          generateDummyAppointments();

        // Add specific appointments for provider "user-1" to ensure calendar has data
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        // Helper to get date string with offset
        const getDateStr = (daysOffset: number) => {
          const date = new Date(today);
          date.setDate(date.getDate() + daysOffset);
          return date.toISOString().split("T")[0];
        };

        const providerAppointments = [
          // Today's appointments
          {
            id: "prov-apt-1",
            patientName: "Sarah Johnson",
            providerId: "user-1",
            locationId: "branch-1",
            date: todayStr,
            startTime: "09:00",
            endTime: "10:00",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-2",
            patientName: "Michael Brown",
            providerId: "user-1",
            locationId: "branch-1",
            date: todayStr,
            startTime: "11:00",
            endTime: "11:30",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-3",
            patientName: "Emily Davis",
            providerId: "user-1",
            locationId: "branch-2",
            date: todayStr,
            startTime: "14:00",
            endTime: "15:00",
            type: "Therapy Session",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-4",
            patientName: "David Wilson",
            providerId: "user-1",
            locationId: "branch-1",
            date: todayStr,
            startTime: "16:30",
            endTime: "17:00",
            type: "Checkup",
            status: "Confirmed" as const,
          },
          // Tomorrow
          {
            id: "prov-apt-5",
            patientName: "Jennifer Lee",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(1),
            startTime: "10:00",
            endTime: "11:00",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-6",
            patientName: "Robert Taylor",
            providerId: "user-1",
            locationId: "branch-2",
            date: getDateStr(1),
            startTime: "13:00",
            endTime: "13:30",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-7",
            patientName: "Amanda Martinez",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(1),
            startTime: "15:30",
            endTime: "16:00",
            type: "Therapy Session",
            status: "Confirmed" as const,
          },
          // Day after tomorrow
          {
            id: "prov-apt-8",
            patientName: "Christopher Anderson",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(2),
            startTime: "09:30",
            endTime: "10:30",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-9",
            patientName: "Jessica White",
            providerId: "user-1",
            locationId: "branch-2",
            date: getDateStr(2),
            startTime: "14:00",
            endTime: "14:30",
            type: "Checkup",
            status: "Confirmed" as const,
          },
          // Next week
          {
            id: "prov-apt-10",
            patientName: "Matthew Harris",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(7),
            startTime: "10:00",
            endTime: "11:00",
            type: "Therapy Session",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-11",
            patientName: "Ashley Clark",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(7),
            startTime: "11:30",
            endTime: "12:00",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "prov-apt-12",
            patientName: "Daniel Lewis",
            providerId: "user-1",
            locationId: "branch-2",
            date: getDateStr(7),
            startTime: "15:00",
            endTime: "16:00",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          // Yesterday (completed)
          {
            id: "prov-apt-13",
            patientName: "Lauren Walker",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(-1),
            startTime: "09:00",
            endTime: "10:00",
            type: "Therapy Session",
            status: "Completed" as const,
            completedAt: new Date(
              today.getTime() -
                24 * 60 * 60 * 1000 +
                10 * 60 * 60 * 1000 +
                15 * 60 * 1000,
            ).toISOString(),
          },
          {
            id: "prov-apt-14",
            patientName: "Kevin Young",
            providerId: "user-1",
            locationId: "branch-2",
            date: getDateStr(-1),
            startTime: "14:00",
            endTime: "14:30",
            service: "Follow-up",
            status: "Completed" as const,
            completedAt: new Date(
              today.getTime() -
                24 * 60 * 60 * 1000 +
                14 * 60 * 60 * 1000 +
                35 * 60 * 1000,
            ).toISOString(),
          },
          // Last week (completed)
          {
            id: "prov-apt-15",
            patientName: "Michelle King",
            providerId: "user-1",
            locationId: "branch-1",
            date: getDateStr(-7),
            startTime: "10:30",
            endTime: "11:30",
            service: "Initial Consultation",
            status: "Completed" as const,
            completedAt: new Date(
              today.getTime() -
                7 * 24 * 60 * 60 * 1000 +
                11 * 60 * 60 * 1000 +
                40 * 60 * 1000,
            ).toISOString(),
          },
        ];

        setPatientAppointments([
          ...generatedAppointments,
          ...providerAppointments,
        ]);
      }

      // Add dummy appointments for calendar
      if (appointments.length === 0) {
        const today = new Date();
        setAppointments([
          {
            id: "apt-1",
            appointmentId: "APT-2025-0001",
            patientId: "patient-1",
            patientName: "Emma Wilson",
            providerId: "user-2",
            date: new Date(today.getTime())
              .toISOString()
              .split("T")[0],
            time: "10:30",
            timeSlot: "10:30 AM - 11:00 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Chiropractic Adjustment",
            status: "Confirmed" as const,
          },
          {
            id: "apt-2",
            appointmentId: "APT-2025-0002",
            patientId: "patient-2",
            patientName: "James Martinez",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 1 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "09:00",
            timeSlot: "9:00 AM - 9:30 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "apt-3",
            appointmentId: "APT-2025-0003",
            patientId: "patient-3",
            patientName: "Sophia Anderson",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 1 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "16:00",
            timeSlot: "4:00 PM - 4:30 PM",
            provider: "Dr. Michael Chen",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Physical Therapy",
            status: "Confirmed" as const,
          },
          {
            id: "apt-4",
            appointmentId: "APT-2025-0004",
            patientId: "patient-1",
            patientName: "Emma Wilson",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 2 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "11:00",
            timeSlot: "11:00 AM - 11:30 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "apt-5",
            appointmentId: "APT-2025-0005",
            patientId: "patient-2",
            patientName: "James Martinez",
            providerId: "user-1",
            date: new Date(
              today.getTime() + 3 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "14:00",
            timeSlot: "2:00 PM - 2:30 PM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Physical Therapy",
            status: "Confirmed" as const,
          },
          {
            id: "apt-6",
            appointmentId: "APT-2025-0006",
            patientId: "patient-3",
            patientName: "Sophia Anderson",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 4 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "10:00",
            timeSlot: "10:00 AM - 10:30 AM",
            provider: "Dr. Michael Chen",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          {
            id: "apt-7",
            appointmentId: "APT-2025-0007",
            patientId: "patient-1",
            patientName: "Emma Wilson",
            providerId: "user-2",
            date: new Date(
              today.getTime() - 7 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "09:30",
            timeSlot: "9:30 AM - 10:00 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Chiropractic Adjustment",
            status: "Completed" as const,
          },
          {
            id: "apt-8",
            appointmentId: "APT-2025-0008",
            patientId: "patient-2",
            patientName: "James Martinez",
            providerId: "user-1",
            date: new Date(
              today.getTime() - 14 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "15:00",
            timeSlot: "3:00 PM - 3:30 PM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Physical Therapy Session",
            status: "Completed" as const,
          },
          // Patient 4 - David Wilson appointments
          {
            id: "apt-9",
            appointmentId: "APT-2025-0009",
            patientId: "patient-4",
            patientName: "David Wilson",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 5 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "10:00",
            timeSlot: "10:00 AM - 10:30 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "apt-10",
            appointmentId: "APT-2025-0010",
            patientId: "patient-4",
            patientName: "David Wilson",
            providerId: "user-1",
            date: new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "14:00",
            timeSlot: "2:00 PM - 2:30 PM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Initial Consultation",
            status: "Completed" as const,
          },
          // Patient 5 - Jennifer Lee appointments
          {
            id: "apt-11",
            appointmentId: "APT-2025-0011",
            patientId: "patient-5",
            patientName: "Jennifer Lee",
            providerId: "user-2",
            date: new Date(
              today.getTime() + 8 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "09:30",
            timeSlot: "9:30 AM - 10:00 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Physical Therapy",
            status: "Confirmed" as const,
          },
          {
            id: "apt-12",
            appointmentId: "APT-2025-0012",
            patientId: "patient-5",
            patientName: "Jennifer Lee",
            providerId: "user-1",
            date: new Date(
              today.getTime() - 10 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "11:00",
            timeSlot: "11:00 AM - 11:30 AM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Chiropractic Adjustment",
            status: "Completed" as const,
          },
          {
            id: "apt-13",
            appointmentId: "APT-2025-0013",
            patientId: "patient-5",
            patientName: "Jennifer Lee",
            providerId: "user-2",
            date: new Date(
              today.getTime() - 25 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "15:30",
            timeSlot: "3:30 PM - 4:00 PM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Follow-up",
            status: "Completed" as const,
          },
          // Patient 6 - Robert Taylor appointments
          {
            id: "apt-14",
            appointmentId: "APT-2025-0014",
            patientId: "patient-6",
            patientName: "Robert Taylor",
            providerId: "user-1",
            date: new Date(
              today.getTime() + 12 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "13:00",
            timeSlot: "1:00 PM - 1:30 PM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Initial Consultation",
            status: "Confirmed" as const,
          },
          {
            id: "apt-15",
            appointmentId: "APT-2025-0015",
            patientId: "patient-6",
            patientName: "Robert Taylor",
            providerId: "user-2",
            date: new Date(
              today.getTime() - 15 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "10:30",
            timeSlot: "10:30 AM - 11:00 AM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Therapy Session",
            status: "Completed" as const,
          },
          // Patient 7 - Amanda Martinez appointments
          {
            id: "apt-16",
            appointmentId: "APT-2025-0016",
            patientId: "patient-7",
            patientName: "Amanda Martinez",
            providerId: "user-1",
            date: new Date(
              today.getTime() + 3 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "14:30",
            timeSlot: "2:30 PM - 3:00 PM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Follow-up",
            status: "Confirmed" as const,
          },
          {
            id: "apt-17",
            appointmentId: "APT-2025-0017",
            patientId: "patient-7",
            patientName: "Amanda Martinez",
            providerId: "user-2",
            date: new Date(
              today.getTime() - 7 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "11:30",
            timeSlot: "11:30 AM - 12:00 PM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Chiropractic Adjustment",
            status: "Completed" as const,
          },
          {
            id: "apt-18",
            appointmentId: "APT-2025-0018",
            patientId: "patient-7",
            patientName: "Amanda Martinez",
            providerId: "user-1",
            date: new Date(
              today.getTime() - 21 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "09:00",
            timeSlot: "9:00 AM - 9:30 AM",
            provider: "Sarah Johnson",
            clinic: "Downtown Medical Center",
            clinicAddress:
              "123 Main Street, Suite 400, New York, NY 10001",
            service: "Initial Consultation",
            status: "Completed" as const,
          },
          {
            id: "apt-19",
            appointmentId: "APT-2025-0019",
            patientId: "patient-7",
            patientName: "Amanda Martinez",
            providerId: "user-2",
            date: new Date(
              today.getTime() - 40 * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
            time: "16:00",
            timeSlot: "4:00 PM - 4:30 PM",
            provider: "Dr. Michael Chen",
            clinic: "Uptown Wellness Clinic",
            clinicAddress:
              "456 Park Avenue, 2nd Floor, New York, NY 10022",
            service: "Physical Therapy",
            status: "Completed" as const,
          },
        ]);
      }

      // Add dummy patients data
      if (patients.length === 0) {
        const now = new Date();
        setPatients([
          {
            id: "patient-1",
            patientId: "00001",
            firstName: "Emma",
            lastName: "Wilson",
            email: "emma.wilson@example.com",
            phone: "+1 (555) 123-4567",
            dateOfBirth: "1985-03-15",
            gender: "Female",
            address: {
              street: "789 Elm Street, Apt 12B",
              city: "New York",
              state: "New York",
              zip: "10001",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 60 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 60 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 8,
            outstandingAmount: 125.5,
            tag: "self-signup" as const,
            insurance: {
              provider: "Blue Cross Blue Shield",
              planNetworkName: "PPO",
              policyNumber: "BCBS123456",
              groupNumber: "GRP789",
              policyHolderName: "Emma Wilson",
              policyHolderDOB: "1985-03-15",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "John Wilson",
              relationship: "Spouse",
              phone: "+1 (555) 987-6543",
            },
          },
          {
            id: "patient-2",
            patientId: "00002",
            firstName: "James",
            lastName: "Martinez",
            email: "james.martinez@example.com",
            phone: "+1 (555) 234-5678",
            dateOfBirth: "1990-07-22",
            gender: "Male",
            address: {
              street: "456 Oak Avenue",
              city: "Brooklyn",
              state: "New York",
              zip: "11217",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 45 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 5,
            outstandingAmount: 0,
            tag: "self-signup" as const,
            insurance: {
              provider: "Aetna",
              planNetworkName: "HMO",
              policyNumber: "AET987654",
              groupNumber: "GRP456",
              policyHolderName: "James Martinez",
              policyHolderDOB: "1990-07-22",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "Maria Martinez",
              relationship: "Sister",
              phone: "+1 (555) 345-6789",
            },
          },
          {
            id: "patient-3",
            patientId: "00003",
            firstName: "Sophia",
            lastName: "Anderson",
            email: "sophia.anderson@example.com",
            phone: "+1 (555) 345-6789",
            dateOfBirth: "1978-11-08",
            gender: "Female",
            address: {
              street: "123 Pine Road",
              city: "Queens",
              state: "New York",
              zip: "11375",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 3,
            outstandingAmount: 250.0,
            tag: "staff" as const,
            insurance: {
              provider: "UnitedHealthcare",
              planNetworkName: "EPO",
              policyNumber: "UHC456789",
              groupNumber: "GRP123",
              policyHolderName: "Sophia Anderson",
              policyHolderDOB: "1978-11-08",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "David Anderson",
              relationship: "Husband",
              phone: "+1 (555) 456-7890",
            },
          },
          {
            id: "patient-4",
            patientId: "00004",
            firstName: "David",
            lastName: "Wilson",
            email: "david.wilson@example.com",
            phone: "+1 (555) 456-7891",
            dateOfBirth: "1982-04-16",
            gender: "Male",
            address: {
              street: "234 Maple Drive",
              city: "Manhattan",
              state: "New York",
              zip: "10011",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 50 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 8 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 6 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 50 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 6,
            outstandingAmount: 75.0,
            tag: "self-signup" as const,
            insurance: {
              provider: "Cigna",
              planNetworkName: "PPO",
              policyNumber: "CIG456123",
              groupNumber: "GRP234",
              policyHolderName: "David Wilson",
              policyHolderDOB: "1982-04-16",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "Sarah Wilson",
              relationship: "Wife",
              phone: "+1 (555) 567-8901",
            },
          },
          {
            id: "patient-5",
            patientId: "00005",
            firstName: "Jennifer",
            lastName: "Lee",
            email: "jennifer.lee@example.com",
            phone: "+1 (555) 567-8902",
            dateOfBirth: "1995-09-14",
            gender: "Female",
            address: {
              street: "567 Cedar Lane",
              city: "Bronx",
              state: "New York",
              zip: "10458",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 40 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 4 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 40 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 4,
            outstandingAmount: 180.0,
            tag: "staff" as const,
            insurance: {
              provider: "Humana",
              planNetworkName: "HMO",
              policyNumber: "HUM789456",
              groupNumber: "GRP567",
              policyHolderName: "Jennifer Lee",
              policyHolderDOB: "1995-09-14",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "Michael Lee",
              relationship: "Brother",
              phone: "+1 (555) 678-9012",
            },
          },
          {
            id: "patient-6",
            patientId: "00006",
            firstName: "Robert",
            lastName: "Taylor",
            email: "robert.taylor@example.com",
            phone: "+1 (555) 678-9013",
            dateOfBirth: "1988-12-05",
            gender: "Male",
            address: {
              street: "890 Birch Avenue",
              city: "Staten Island",
              state: "New York",
              zip: "10301",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 35 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 12 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 35 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 5,
            outstandingAmount: 0,
            tag: "self-signup" as const,
            insurance: {
              provider: "Kaiser Permanente",
              planNetworkName: "HMO",
              policyNumber: "KP123789",
              groupNumber: "GRP890",
              policyHolderName: "Robert Taylor",
              policyHolderDOB: "1988-12-05",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "Lisa Taylor",
              relationship: "Sister",
              phone: "+1 (555) 789-0123",
            },
          },
          {
            id: "patient-7",
            patientId: "00007",
            firstName: "Amanda",
            lastName: "Martinez",
            email: "amanda.martinez@example.com",
            phone: "+1 (555) 789-0124",
            dateOfBirth: "1992-06-20",
            gender: "Female",
            address: {
              street: "345 Spruce Street",
              city: "Brooklyn",
              state: "New York",
              zip: "11215",
              country: "United States",
            },
            registeredDate: new Date(
              now.getTime() - 55 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastVisit: new Date(
              now.getTime() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            lastUpdated: new Date(
              now.getTime() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            addedDate: new Date(
              now.getTime() - 55 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            status: "Active" as const,
            totalAppointments: 7,
            outstandingAmount: 95.5,
            tag: "self-signup" as const,
            insurance: {
              provider: "Oxford Health Plans",
              planNetworkName: "PPO",
              policyNumber: "OXF987321",
              groupNumber: "GRP678",
              policyHolderName: "Amanda Martinez",
              policyHolderDOB: "1992-06-20",
              relationshipToPolicyholder: "Self",
            },
            emergencyContact: {
              name: "Carlos Martinez",
              relationship: "Father",
              phone: "+1 (555) 890-1234",
            },
          },
        ]);
      }

      setCurrentScreen("clinicAdminDashboard");
      return;
    }

    // Patient login flow
    // If this is a new signup flow, always go to patient profile
    if (isNewSignup) {
      setIsNewSignup(false); // Reset the flag
      setCurrentScreen("patientProfile");
    }
    // If returning user (direct login), go directly to dashboard
    else {
      // Simulate that the user already has completed profile and appointments
      setHasCompletedProfile(true);

      // Patient portal appointments are already initialized in useEffect with patientId fields
      // Commenting out to avoid overwriting clinic admin data
      // if (appointments.length === 0) {
      //   const today = new Date();
      //   setAppointments([
      //     // Upcoming appointments
      //     {
      //       id: "apt-patient-1",
      //       date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "10:30",
      //       timeSlot: "10:30 AM - 11:00 AM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Chiropractic Adjustment",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Confirmed" as const,
      //     },
      //     {
      //       id: "apt-patient-2",
      //       date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "14:00",
      //       timeSlot: "2:00 PM - 2:30 PM",
      //       clinic: "Uptown Wellness Clinic",
      //       clinicAddress: "456 Park Avenue, 2nd Floor, New York, NY 10022",
      //       type: "Follow-up Visit",
      //       provider: "Dr. Michael Chen",
      //       status: "Confirmed" as const,
      //     },
      //     {
      //       id: "apt-patient-3",
      //       date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "09:00",
      //       timeSlot: "9:00 AM - 9:30 AM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Physical Therapy",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Confirmed" as const,
      //     },
      //     {
      //       id: "apt-patient-4",
      //       date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "11:30",
      //       timeSlot: "11:30 AM - 12:00 PM",
      //       clinic: "Uptown Wellness Clinic",
      //       clinicAddress: "456 Park Avenue, 2nd Floor, New York, NY 10022",
      //       type: "Checkup",
      //       provider: "Dr. Michael Chen",
      //       status: "Confirmed" as const,
      //     },
      //     // Past appointments (completed)
      //     {
      //       id: "apt-patient-5",
      //       date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "10:00",
      //       timeSlot: "10:00 AM - 10:30 AM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Initial Consultation",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Completed" as const,
      //     },
      //     {
      //       id: "apt-patient-6",
      //       date: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "15:00",
      //       timeSlot: "3:00 PM - 3:30 PM",
      //       clinic: "Uptown Wellness Clinic",
      //       clinicAddress: "456 Park Avenue, 2nd Floor, New York, NY 10022",
      //       type: "Chiropractic Adjustment",
      //       provider: "Dr. Michael Chen",
      //       status: "Completed" as const,
      //     },
      //     {
      //       id: "apt-patient-7",
      //       date: new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "13:30",
      //       timeSlot: "1:30 PM - 2:00 PM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Physical Therapy",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Completed" as const,
      //     },
      //     {
      //       id: "apt-patient-8",
      //       date: new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "16:00",
      //       timeSlot: "4:00 PM - 4:30 PM",
      //       clinic: "Uptown Wellness Clinic",
      //       clinicAddress: "456 Park Avenue, 2nd Floor, New York, NY 10022",
      //       type: "Follow-up Visit",
      //       provider: "Dr. Michael Chen",
      //       status: "Completed" as const,
      //     },
      //     {
      //       id: "apt-patient-9",
      //       date: new Date(today.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "11:00",
      //       timeSlot: "11:00 AM - 11:30 AM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Massage Therapy",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Completed" as const,
      //     },
      //     {
      //       id: "apt-patient-10",
      //       date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      //       time: "09:30",
      //       timeSlot: "9:30 AM - 10:00 AM",
      //       clinic: "Downtown Medical Center",
      //       clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
      //       type: "Checkup",
      //       provider: "Dr. Sarah Johnson",
      //       status: "Cancelled" as const,
      //     },
      //   ]);
      // }

      // Add questionnaire responses data
      if (questionnaireResponses.length === 0) {
        setQuestionnaireResponses([
          {
            categoryId: "cat-1",
            categoryName: "Neck / Shoulder",
            completedAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            responses: [
              {
                questionId: "q1",
                question: "Please describe your main complaint",
                type: "textarea",
                answer:
                  "Persistent neck stiffness and shoulder pain",
              },
              {
                questionId: "q2",
                question:
                  "What functional difficulties are you experiencing?",
                type: "checkbox",
                answer: [
                  "Difficulty turning head while driving",
                  "Trouble sleeping on side",
                ],
              },
              {
                questionId: "q3",
                question: "What factors relieve your symptoms?",
                type: "checkbox",
                answer: [
                  "Heat therapy",
                  "Rest",
                  "Gentle stretching",
                ],
              },
              {
                questionId: "q4",
                question:
                  "How has your condition changed overall?",
                type: "radio",
                answer: "Slightly better",
              },
              {
                questionId: "q5",
                question: "How would you describe your pain?",
                type: "checkbox",
                answer: ["Sharp", "Shooting pain", "Radiating"],
              },
              {
                questionId: "q6",
                question: "Current pain level (0-10)",
                type: "scale",
                answer: 6,
              },
              {
                questionId: "q7",
                question:
                  "Worst pain level in the last week (0-10)",
                type: "scale",
                answer: 8,
              },
            ],
          },
          {
            categoryId: "cat-2",
            categoryName: "Lower Back",
            completedAt: new Date(
              Date.now() - 14 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            responses: [
              {
                questionId: "q1",
                question: "Please describe your main complaint",
                type: "textarea",
                answer:
                  "Lower back pain when sitting for extended periods",
              },
              {
                questionId: "q2",
                question:
                  "What functional difficulties are you experiencing?",
                type: "checkbox",
                answer: [
                  "Difficulty bending forward",
                  "Pain when lifting objects",
                ],
              },
              {
                questionId: "q3",
                question: "What factors relieve your symptoms?",
                type: "checkbox",
                answer: [
                  "Stretching",
                  "Walking",
                  "Heat application",
                ],
              },
              {
                questionId: "q4",
                question:
                  "How has your condition changed overall?",
                type: "radio",
                answer: "Much better",
              },
              {
                questionId: "q5",
                question: "How would you describe your pain?",
                type: "checkbox",
                answer: ["Dull", "Aching pain", "Constant"],
              },
              {
                questionId: "q6",
                question: "Current pain level (0-10)",
                type: "scale",
                answer: 4,
              },
              {
                questionId: "q7",
                question:
                  "Worst pain level in the last week (0-10)",
                type: "scale",
                answer: 7,
              },
            ],
          },
        ]);
        setCompletedCategories(["cat-1", "cat-2"]);
      }

      setCurrentScreen("dashboard");
    }
  };

  const handleForgotPasswordSendCode = (email: string) => {
    setUserEmail(email);
    setPasswordContext("forgotPassword");
    setCurrentScreen("otpPassword");
    setIsNewSignup(false); // Reset flag for forgot password flow
  };

  // Patient Flow Handlers
  const handleOnboardingComplete = (onboardingData: any) => {
    // Store all onboarding data
    setHasCompletedProfile(true);
    if (
      onboardingData.questionnaires &&
      onboardingData.questionnaires.length > 0
    ) {
      setQuestionnaireResponses(onboardingData.questionnaires);
    }

    if (onboardingData.appointmentDetails && onboardingData.selectedClinic && onboardingData.selectedProvider) {
      // Create appointment from onboarding data WITH dummy details
      const newAppointmentId = `apt-${Date.now()}`;
      const newAppointment = {
        id: newAppointmentId,
        date: onboardingData.appointmentDetails.date,
        time: onboardingData.appointmentDetails.time || onboardingData.appointmentDetails.timeSlot,
        timeSlot: onboardingData.appointmentDetails.timeSlot,
        clinic: onboardingData.selectedClinic.name,
        clinicAddress:
          onboardingData.selectedClinic.address +
          ", " +
          onboardingData.selectedClinic.city,
        type: onboardingData.appointmentDetails.type || "Initial Consultation",
        provider: onboardingData.selectedProvider.name,
        status: "Confirmed" as const,
        // Add dummy details for viewing
        sessionNotes:
          "Patient reports improvement in mobility and reduced pain levels. Continuing with current treatment plan. Follow-up recommended in 2 weeks to assess progress.",
        images: [
          {
            id: "img-1",
            url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
            caption: "X-ray - Lateral view",
            annotations: [
              {
                id: "ann-1",
                x: 45,
                y: 30,
                text: "Area of concern",
                color: "#EF4444",
              },
              {
                id: "ann-2",
                x: 60,
                y: 50,
                text: "Improved alignment",
                color: "#10B981",
              },
            ],
          },
          {
            id: "img-2",
            url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
            caption: "MRI - Sagittal view",
            annotations: [
              {
                id: "ann-3",
                x: 50,
                y: 40,
                text: "Normal tissue",
                color: "#10B981",
              },
            ],
          },
        ],
      };
      setAppointments([...appointments, newAppointment]);
      setCurrentAppointmentId(newAppointmentId);
      setBookedAppointment(newAppointment); // Set bookedAppointment for confirmation screen

      // Check if consent forms are enabled
      if (wizardData?.intakeDefaults?.enableConsents) {
        setCurrentScreen("consent");
      } else {
        // Skip consent forms, go directly to confirmation
        setCurrentScreen("appointmentConfirmation");
      }
    } else {
      // Skipped appointment booking
      setBookedAppointment(null);
      
      // Check if consent forms are enabled
      if (wizardData?.intakeDefaults?.enableConsents) {
        setCurrentScreen("consent");
      } else {
        setCurrentScreen("dashboard");
      }
    }
  };

  const handlePatientProfileContinue = () => {
    setHasCompletedProfile(true);
    setCurrentScreen("insurance");
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireSubmit = (
    categoryId: string,
    questionnaireData: any,
  ) => {
    if (!completedCategories.includes(categoryId)) {
      setCompletedCategories([
        ...completedCategories,
        categoryId,
      ]);
    }
    // Store questionnaire response
    setQuestionnaireResponses([
      ...questionnaireResponses,
      {
        categoryId,
        categoryName: categoryNames[categoryId],
        ...questionnaireData,
        timestamp: new Date().toISOString(),
      },
    ]);
    setCurrentScreen("questionnaireCategory");
  };

  const handleQuestionnaireBack = () => {
    setCurrentScreen("questionnaireCategory");
  };

  const handleContinueToAppointment = () => {
    // After completing questionnaires, always go to consent forms during onboarding
    console.log("🔄 handleContinueToAppointment called - navigating to consent screen");
    alert("Navigating to consent screen! Current screen: " + currentScreen);
    setCurrentScreen("consent");
  };

  const handleClinicSelection = () => {
    setCurrentScreen("providerSelection");
  };

  const handleProviderSelection = () => {
    setCurrentScreen("appointmentBooking");
  };

  const handleAppointmentBooking = (appointmentData: {
    type: string;
    date: string;
    timeSlot: string;
  }) => {
    // Store the appointment data WITH dummy details
    const newAppointment = {
      ...appointmentData,
      clinic: "Downtown Medical Center",
      clinicAddress:
        "123 Main Street, Suite 400, New York, NY 10001",
      provider: "Dr. Sarah Johnson",
      id: Date.now().toString(),
      status: "Confirmed" as const,
      // Add dummy details for viewing
      sessionNotes:
        "Patient reports improvement in mobility and reduced pain levels. Continuing with current treatment plan. Follow-up recommended in 2 weeks to assess progress.",
      images: [
        {
          id: "img-1",
          url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=600&fit=crop",
          caption: "X-ray - Lateral view",
          annotations: [
            {
              id: "ann-1",
              x: 45,
              y: 30,
              text: "Area of concern",
              color: "#EF4444",
            },
            {
              id: "ann-2",
              x: 60,
              y: 50,
              text: "Improved alignment",
              color: "#10B981",
            },
          ],
        },
        {
          id: "img-2",
          url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
          caption: "MRI - Sagittal view",
          annotations: [
            {
              id: "ann-3",
              x: 50,
              y: 40,
              text: "Normal tissue",
              color: "#10B981",
            },
          ],
        },
      ],
    };

    setBookedAppointment(newAppointment);

    // Check if consent forms are enabled
    if (wizardData?.intakeDefaults?.enableConsents) {
      setCurrentScreen("consent");
    } else {
      // Skip consent forms, go directly to confirmation
      setCurrentScreen("appointmentConfirmation");
    }
  };

  const handleConsentComplete = () => {
    // Store consent acceptance data
    // In a real app, you would send this to your backend
    console.log(
      "Consents accepted at:",
      new Date().toISOString(),
    );

    // Navigate to confirmation
    setCurrentScreen("appointmentConfirmation");
  };

  const handleAppointmentConfirmation = () => {
    // Add to appointments list only if it doesn't already exist
    if (bookedAppointment) {
      const appointmentExists = appointments.some(
        (apt) => apt.id === bookedAppointment.id,
      );
      if (!appointmentExists) {
        setAppointments([bookedAppointment, ...appointments]);
      }

      // Add notification only if appointment was just added
      const notificationExists = notifications.some((n) =>
        n.message.includes(
          new Date(bookedAppointment.date).toLocaleDateString(),
        ),
      );
      if (!notificationExists) {
        setNotifications([
          {
            id: Date.now().toString(),
            message: `Appointment confirmed for ${new Date(bookedAppointment.date).toLocaleDateString()}`,
            timestamp: new Date().toISOString(),
            type: "booking",
          },
          ...notifications,
        ]);
      }
    }
    setCurrentScreen("dashboard");
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
      )
    );
    setPatientAppointments(
      patientAppointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "Cancelled" } : apt
      )
    );
    setNotifications([
      {
        id: Date.now().toString(),
        message: "Appointment cancelled successfully",
        timestamp: new Date().toISOString(),
        type: "cancellation",
      },
      ...notifications,
    ]);
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    setReschedulingAppointmentId(appointmentId);
    setCurrentScreen("clinicCalendar");
  };

  const handleMarkNoShowAppointment = (appointmentId: string) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "No-Show" } : apt
      )
    );
    setPatientAppointments(
      patientAppointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: "No-Show" } : apt
      )
    );
  };

  // Clinic Admin - Consent Forms Handlers
  const handleAddConsentForm = (
    formData: Omit<any, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newForm = {
      id: `consent-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConsentForms([newForm, ...consentForms]);
    setCurrentScreen("consentFormsList");
  };

  const handleEditConsentForm = (
    formData: Omit<any, "id" | "createdAt" | "updatedAt">,
  ) => {
    if (editingConsentForm) {
      setConsentForms(
        consentForms.map((form) =>
          form.id === editingConsentForm.id
            ? {
                ...form,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : form,
        ),
      );
      setEditingConsentForm(null);
      setCurrentScreen("consentFormsList");
    }
  };

  const handlePreviewConsentForm = () => {
    // In a real app, this would show a preview modal with sample patient data
    alert(
      "Preview functionality - This would show the consent form with sample patient data filled in",
    );
  };

  // Clinic Admin - Patients Handlers
  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentScreen("patientDetails");
  };

  const handleAddPatient = (patientData: any) => {
    const now = new Date();
    // Generate sequential patient ID
    const nextPatientNumber = patients.length + 1;
    const patientId = String(nextPatientNumber).padStart(
      5,
      "0",
    );

    const newPatient = {
      id: `patient-${Date.now()}`,
      patientId: patientId, // Sequential ID like 00001, 00002
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      email: patientData.email,
      phone: `${patientData.phoneCountryCode} ${patientData.phone}`,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      address: patientData.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
      },
      registeredDate: now.toISOString(),
      lastVisit: "",
      lastUpdated: now.toISOString(),
      status: "Active" as const,
      totalAppointments: 0,
      outstandingAmount: 0,
      tag: "staff" as "staff" | "self-signup" | "link-sent",
      insurance: patientData.insurance,
      emergencyContact: patientData.emergencyContact,
    };

    setPatients([...patients, newPatient]);
    setIsAddPatientDrawerOpen(false);
    // Navigate back to patients list if coming from full page
    if (currentScreen === "addPatientFullPage") {
      setCurrentScreen("patientsList");
    }
  };

  const handleGenerateSignupLink = (
    email: string,
    firstName: string,
    lastName: string,
    city: string,
    state: string,
    country: string,
    notes: string,
  ) => {
    // Generate patient ID
    const patientId = String(patients.length + 1).padStart(
      5,
      "0",
    );

    const now = new Date();
    const newPatient = {
      id: `patient-${Date.now()}`,
      patientId,
      firstName,
      lastName,
      email,
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: {
        street: "",
        city,
        state,
        zip: "",
        country,
      },
      registeredDate: now.toISOString(),
      lastVisit: "",
      lastUpdated: now.toISOString(),
      addedDate: now.toISOString(),
      status: "Link sent" as const,
      totalAppointments: 0,
      outstandingAmount: 0,
      tag: "link-sent" as "staff" | "self-signup" | "link-sent",
      notes,
    };

    setPatients([...patients, newPatient]);
    setIsGenerateSignupLinkOpen(false);
  };

  const handleClinicStaffGenerateSignupLink = (
    email: string,
    firstName: string,
    lastName: string,
    city: string,
    state: string,
    country: string,
    notes: string,
  ) => {
    // Generate patient ID
    const patientId = String(patients.length + 1).padStart(
      5,
      "0",
    );

    const now = new Date();
    const newPatient = {
      id: `patient-${Date.now()}`,
      patientId,
      firstName,
      lastName,
      email,
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: {
        street: "",
        city,
        state,
        zip: "",
        country,
      },
      registeredDate: now.toISOString(),
      lastVisit: "",
      lastUpdated: now.toISOString(),
      addedDate: now.toISOString(),
      status: "Link sent" as const,
      totalAppointments: 0,
      outstandingAmount: 0,
      tag: "link-sent" as "staff" | "self-signup" | "link-sent",
      notes,
    };

    setPatients([...patients, newPatient]);
  };

  // Room Management Handlers
  const handleSaveRoom = (roomData: {
    roomId: string;
    roomName: string;
    roomType: string;
    cleanupTime: number;
    status: "Active" | "Inactive";
    notes?: string;
  }) => {
    if (editingRoom) {
      // Update existing room
      setRooms(
        rooms.map((room) =>
          room.id === editingRoom.id
            ? {
                ...room,
                ...roomData,
                updatedDate: new Date().toISOString(),
              }
            : room
        )
      );
    } else {
      // Add new room
      const newRoom = {
        id: `room-${Date.now()}`,
        ...roomData,
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      setRooms([...rooms, newRoom]);
    }
    setIsAddEditRoomDrawerOpen(false);
    setEditingRoom(null);
  };

  const handleViewRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsRoomDetailsDrawerOpen(true);
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setIsRoomDetailsDrawerOpen(false);
    setIsAddEditRoomDrawerOpen(true);
  };

  // Centralized Clinic Admin Navigation Handler
  const handleClinicAdminNavigate = (menu: string) => {
    if (menu === "dashboard") {
      setCurrentScreen("clinicAdminDashboard");
    } else if (menu === "baseSetup") {
      setCurrentScreen("baseSetup");
    } else if (menu === "calendar") {
      setCurrentScreen("clinicCalendar");
    } else if (menu === "holidays") {
      setCurrentScreen("holidaysList");
    } else if (menu === "branches") {
      setCurrentScreen("branchesList");
    } else if (menu === "questionnaires") {
      setCurrentScreen("questionnairesList");
    } else if (menu === "providers") {
      setCurrentScreen("providersList");
    } else if (menu === "roles") {
      setCurrentScreen("rolesManagement");
    } else if (menu === "users") {
      setCurrentScreen("userManagement");
    } else if (menu === "consentForms") {
      setCurrentScreen("consentFormsList");
    } else if (menu === "patients") {
      setCurrentScreen("patientsList");
    } else if (menu === "master" || menu === "services") {
      setCurrentScreen("servicesList");
    } else if (menu === "subscription") {
      setCurrentScreen("subscriptionManagement");
    } else if (menu === "invoices") {
      setCurrentScreen("invoicesList");
    } else if (menu === "payments") {
      setCurrentScreen("paymentsList");
    } else if (menu === "reports") {
      setCurrentScreen("appointmentReport");
    } else if (menu === "activityLog") {
      setCurrentScreen("activityLog");
    } else if (menu === "auditLog") {
      setCurrentScreen("auditLog");
    } else if (menu === "rooms") {
      setCurrentScreen("roomsList");
    } else if (menu === "clinicalRecords") {
      setCurrentScreen("clinicAdminClinicalRecords");
    } else if (menu === "soapMaster") {
      setCurrentScreen("soapMaster");
    } else if (menu === "email-management") {
      setCurrentScreen("emailManagement");
    } else if (menu === "clinic-settings") {
      setCurrentScreen("clinicSettings");
    } else if (menu === "tickets") {
      setCurrentScreen("ticketManagement");
    } else if (menu === "raise-ticket") {
      setCurrentScreen("raiseTicket");
    } else if (menu === "carePlanMaster") {
      setCurrentScreen("carePlanMaster");
    } else if (menu === "clinicalRecords") {
      setCurrentScreen("clinicAdminClinicalRecords");
    }
  };

  // Entity Switching Handler
  const handleEntitySwitch = (
    entity:
      | "patient"
      | "clinicAdmin"
      | "provider"
      | "clinic-staff",
  ) => {
    setCurrentEntity(entity);
    setLoginSuccessMessage("");

    // Navigate to appropriate screen based on current screen
    if (
      currentScreen === "signup" ||
      currentScreen === "clinicAdminRegister" ||
      currentScreen === "subscriptionSelection"
    ) {
      if (entity === "patient") {
        setCurrentScreen("signup");
      } else if (entity === "provider") {
        setCurrentScreen("providerLogin");
      } else if (entity === "clinic-staff") {
        setCurrentScreen("clinicStaffLogin");
      } else {
        setCurrentScreen("subscriptionSelection");
      }
    } else if (
      currentScreen === "login" ||
      currentScreen === "clinicAdminLogin" ||
      currentScreen === "providerLogin" ||
      currentScreen === "clinicStaffLogin"
    ) {
      if (entity === "patient") {
        setCurrentScreen("login");
      } else if (entity === "provider") {
        setCurrentScreen("providerLogin");
      } else if (entity === "clinic-staff") {
        setCurrentScreen("clinicStaffLogin");
      } else {
        setCurrentScreen("clinicAdminLogin");
      }
    } else if (
      currentScreen === "forgotPassword" ||
      currentScreen === "clinicAdminForgotPassword" ||
      currentScreen === "providerForgotPassword"
    ) {
      if (entity === "patient") {
        setCurrentScreen("forgotPassword");
      } else if (entity === "provider") {
        setCurrentScreen("providerForgotPassword");
      } else {
        setCurrentScreen("clinicAdminForgotPassword");
      }
    }
  };

  // Check if we should show entity switcher (on auth screens only)
  const showEntitySwitcher = [
    "signup",
    "login",
    "forgotPassword",
    "otpPassword",
    "subscriptionSelection",
    "clinicAdminRegister",
    "clinicAdminLogin",
    "clinicAdminForgotPassword",
    "clinicAdminVerification",
    "providerLogin",
    "providerForgotPassword",
    "providerResetPassword",
    "clinicStaffLogin",
  ].includes(currentScreen);

  // Debug logging
  console.log("📱 Current Screen:", currentScreen);

  return (
    <div className="size-full">
      {/* Entity Switcher - Shows on auth screens only */}
      {showEntitySwitcher && (
        <EntitySwitcher
          currentEntity={currentEntity}
          onSwitch={handleEntitySwitch}
        />
      )}

      {currentScreen === "signup" && (
        <SignupScreen
          onNavigateToLogin={() => {
            setIsNewSignup(false);
            setCurrentScreen("login");
          }}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {currentScreen === "login" && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToForgotPassword={() =>
            setCurrentScreen("forgotPassword")
          }
          onNavigateToSignup={() => setCurrentScreen("signup")}
          successMessage={loginSuccessMessage}
        />
      )}

      {currentScreen === "otpPassword" && (
        <OTPPasswordScreen
          email={userEmail}
          context={passwordContext}
          onSuccess={handleOTPPasswordSuccess}
          onBackToLogin={() => setCurrentScreen("login")}
          onBack={() => {
            if (passwordContext === "signup") {
              setCurrentScreen("signup");
            } else {
              setCurrentScreen("forgotPassword");
            }
          }}
        />
      )}

      {currentScreen === "forgotPassword" && (
        <ForgotPasswordScreen
          onSuccess={handleForgotPasswordSendCode}
          onBackToLogin={() => setCurrentScreen("login")}
        />
      )}

      {/* Patient Onboarding Flow - Modern Stepper UI */}
      {currentScreen === "patientOnboarding" && (
        <PatientOnboardingFlow
          onComplete={handleOnboardingComplete}
          onBack={() => setCurrentScreen("otpPassword")}
          wizardData={wizardData}
          services={services}
          branches={branches}
          providers={providers}
          questionnaires={questionnaires}
        />
      )}

      {/* Patient Profile - Inline Implementation */}
      {currentScreen === "patientProfile" && (
        <PatientProfileScreenInline
          onContinue={handlePatientProfileContinue}
        />
      )}

      {/* Insurance Details - Inline Implementation */}
      {currentScreen === "insurance" && (
        <InsuranceDetailsScreen
          onBack={() => setCurrentScreen("patientProfile")}
          onContinue={() => {
            // Check if intake wizard is enabled
            if (wizardData?.intakeDefaults?.enableIntakeWizard) {
              setCurrentScreen("questionnaireCategory");
            } else {
              // Skip questionnaires, go directly to clinic selection
              setCurrentScreen("clinicSelection");
            }
          }}
        />
      )}

      {/* Questionnaire Category - Inline Implementation */}
      {currentScreen === "questionnaireCategory" && (
        <QuestionnaireCategoryScreenInline
          onSelectCategory={handleSelectCategory}
          onContinueToAppointment={handleContinueToAppointment}
          completedCategories={completedCategories}
        />
      )}

      {/* Questionnaire - Inline Implementation */}
      {currentScreen === "questionnaire" && (
        <ModernQuestionnaireScreen
          categoryName={
            categoryNames[selectedCategoryId] || "Category"
          }
          categoryDescription="Please answer the following questions about your condition"
          onBack={handleQuestionnaireBack}
          onSubmit={(data) =>
            handleQuestionnaireSubmit(selectedCategoryId, data)
          }
        />
      )}

      {/* Clinic Selection - Inline Implementation */}
      {currentScreen === "clinicSelection" && (
        <ClinicSelectionScreen
          clinics={[
            {
              id: "1",
              name: "Downtown Medical Center",
              address:
                "123 Main Street, Suite 400, New York, NY 10001",
              workingHours: "Mon–Fri, 9:00 AM – 6:00 PM",
            },
            {
              id: "2",
              name: "Uptown Wellness Clinic",
              address:
                "456 Park Avenue, 2nd Floor, New York, NY 10022",
              workingHours: "Mon–Sat, 8:00 AM – 7:00 PM",
            },
            {
              id: "3",
              name: "Brooklyn Health Center",
              address:
                "789 Atlantic Avenue, Brooklyn, NY 11217",
              workingHours: "Mon–Fri, 10:00 AM – 5:00 PM",
            },
          ]}
          onContinue={handleClinicSelection}
          onBack={() => {
            // Always go back to consent forms during patient onboarding
            setCurrentScreen("consent");
          }}
        />
      )}

      {/* Provider Selection - Inline Implementation */}
      {currentScreen === "providerSelection" && (
        <ProviderSelectionScreen
          clinicName="Downtown Medical Center"
          providers={[
            {
              id: "1",
              name: "Dr. Sarah Johnson",
              specialization: "Chiropractor",
              availability: "Available Today",
            },
            {
              id: "2",
              name: "Dr. Michael Chen",
              specialization: "Physical Therapist",
              availability: "Next available: Tomorrow",
            },
            {
              id: "3",
              name: "Dr. Emily Rodriguez",
              specialization: "Sports Medicine Specialist",
              availability: "Available Today",
            },
          ]}
          onContinue={handleProviderSelection}
          onBack={() => setCurrentScreen("clinicSelection")}
        />
      )}

      {/* Appointment Booking - Inline Implementation */}
      {currentScreen === "appointmentBooking" && (
        <AppointmentBookingScreen
          clinicName="Downtown Medical Center"
          providerName="Dr. Sarah Johnson"
          onConfirm={handleAppointmentBooking}
          onBack={() => setCurrentScreen("providerSelection")}
        />
      )}

      {/* Consent Forms - Inline Implementation */}
      {currentScreen === "consent" && (
        <>
          {console.log("✅ Rendering ConsentFormsScreen - currentScreen:", currentScreen)}
          <ConsentFormsScreen
            onBack={() => {
              if (hasCompletedProfile) {
                setCurrentScreen("patientOnboarding");
              } else {
                setCurrentScreen("questionnaireCategory");
              }
            }}
            onComplete={() => {
              if (hasCompletedProfile) {
                if (bookedAppointment) {
                  setCurrentScreen("appointmentConfirmation");
                } else {
                  setCurrentScreen("dashboard");
                }
              } else {
                setCurrentScreen("clinicSelection");
              }
            }}
          />
        </>
      )}

      {/* Appointment Confirmation - Inline Implementation */}
      {currentScreen === "appointmentConfirmation" &&
        bookedAppointment && (
          <AppointmentConfirmationScreen
            appointmentData={{
              date: bookedAppointment.date,
              time: bookedAppointment.timeSlot,
              provider: bookedAppointment.provider,
              clinic: bookedAppointment.clinic,
              clinicAddress: bookedAppointment.clinicAddress,
              type: bookedAppointment.type,
            }}
            onGoToDashboard={handleAppointmentConfirmation}
          />
        )}

      {/* Dashboard - Now with real data */}
      {currentScreen === "dashboard" && (
        <DashboardScreen
          appointments={appointments}
          notifications={notifications}
          onNavigate={(menu) => {
            if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else {
              setCurrentScreen(menu as any);
            }
          }}
          onCancelAppointment={handleCancelAppointment}
          onViewAppointment={(id) => {
            setCurrentAppointmentId(id);
            setCurrentScreen("viewAppointment");
          }}
          onRescheduleAppointment={(id) => {
            setCurrentAppointmentId(id);
            setShowRescheduleDrawer(true);
          }}
          onLogout={() => setCurrentScreen("login")}
          onNavigateToProfile={() =>
            setCurrentScreen("myProfile")
          }
          onNavigateToNotifications={() =>
            setCurrentScreen("notifications")
          }
          onViewNotification={(notificationId) => {
            setCurrentNotificationId(notificationId);
            setCurrentScreen("notificationDetail");
          }}
        />
      )}

      {/* My Profile */}
      {currentScreen === "myProfile" && (
        <MyProfileScreen
          onNavigate={(menu) => {
            setCurrentScreen(menu as any);
          }}
          onBack={() => setCurrentScreen("dashboard")}
          onLogout={() => setCurrentScreen("login")}
          onNavigateToNotifications={() =>
            setCurrentScreen("notifications")
          }
          onViewNotification={(notificationId) => {
            setCurrentNotificationId(notificationId);
            setCurrentScreen("notificationDetail");
          }}
          notifications={notifications}
        />
      )}

      {/* Appointments List */}
      {currentScreen === "appointments" && (
        <AppointmentsListScreen
          appointments={appointments}
          services={services}
          onNavigate={(menu) => {
            if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else {
              setCurrentScreen(menu as any);
            }
          }}
          onReschedule={(id) => {
            setCurrentAppointmentId(id);
            setShowRescheduleDrawer(true);
          }}
          onCancel={handleCancelAppointment}
          onLogout={() => setCurrentScreen("login")}
          onBookAppointment={() =>
            setShowBookingDrawer(true)
          }
          onNavigateToNotifications={() =>
            setCurrentScreen("notifications")
          }
          onViewNotification={(notificationId) => {
            setCurrentNotificationId(notificationId);
            setCurrentScreen("notificationDetail");
          }}
          notifications={notifications}
        />
      )}

      {/* Invoices List */}
      {currentScreen === "invoices" && (
        <PatientInvoicesListScreen
          invoices={invoices}
          onNavigate={(menu) => {
            if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else {
              setCurrentScreen(menu as any);
            }
          }}
          onLogout={() => setCurrentScreen("login")}
          onViewAppointment={(appointmentId) => {
            // Find the appointment by appointmentId (not id)
            const appointment = appointments.find(
              (apt) => apt.appointmentId === appointmentId,
            );
            if (appointment) {
              setCurrentAppointmentId(appointment.id);
              setCurrentScreen("viewAppointment");
            }
          }}
          onPaymentComplete={(invoiceId) => {
            // Update invoice status to Paid
            setInvoices(
              invoices.map((inv) =>
                inv.id === invoiceId
                  ? { ...inv, paymentStatus: "Paid" as const }
                  : inv,
              ),
            );
          }}
          onNavigateToNotifications={() =>
            setCurrentScreen("notifications")
          }
          onViewNotification={(notificationId) => {
            setCurrentNotificationId(notificationId);
            setCurrentScreen("notificationDetail");
          }}
          notifications={notifications}
        />
      )}


      {/* Notification Detail */}
      {currentScreen === "notificationDetail" &&
        currentNotificationId && (
          <NotificationDetailScreen
            notification={
              notifications.find(
                (notif) => notif.id === currentNotificationId,
              )!
            }
            onNavigate={(menu) => setCurrentScreen(menu)}
            onBack={() => setCurrentScreen("notifications")}
            onMarkAsRead={(notificationId) => {
              setNotifications(
                notifications.map((notif) =>
                  notif.id === notificationId
                    ? { ...notif, isRead: true }
                    : notif,
                ),
              );
            }}
            onTakeAction={(actionUrl) => {
              // Handle action based on URL
              if (actionUrl === "/questionnaire") {
                setCurrentScreen("questionnaireCategory");
              } else if (actionUrl === "/invoices") {
                setCurrentScreen("invoices");
              } else if (actionUrl === "/booking") {
                setCurrentScreen("bookingServiceType");
              }
            }}
            onLogout={() => setCurrentScreen("login")}
          />
        )}

      {/* Settings */}
      {currentScreen === "settings" && (
        <SettingsScreen
          onBack={() => setCurrentScreen("dashboard")}
        />
      )}

      {/* Patient Tickets */}
      {currentScreen === "tickets" && (
        <PatientTicketManagementScreen
          onNavigate={(menu) => {
            if (menu === "clinicalRecords") {
              setCurrentScreen("patientClinicalRecords");
            } else {
              setCurrentScreen(menu as any);
            }
          }}
          onViewTicket={(id) => {
            setSelectedTicketId(id);
            setCurrentScreen("ticketDetails");
          }}
          onLogout={() => setCurrentScreen("login")}
          tickets={patientTickets}
          onCreateTicket={(ticketData) => {
            const newTicket = {
              id: `ticket-${Date.now()}`,
              ticketId: `TKT-2026-${String(patientTickets.length + 1).padStart(3, "0")}`,
              subject: ticketData.subject,
              category: ticketData.category,
              priority: ticketData.priority,
              status: "Open",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: "John Smith",
              createdByRole: "Patient",
              description: ticketData.description,
              messages: [],
            };
            setPatientTickets([newTicket, ...patientTickets]);
          }}
        />
      )}

      {/* Ticket Details Screen */}
      {currentScreen === "ticketDetails" && selectedTicketId && (
        <TicketDetailScreen
          portal={currentEntity === "clinicAdmin" ? "admin" : "patient"}
          ticket={
            currentEntity === "clinicAdmin" 
              ? adminTickets.find(t => t.id === selectedTicketId)
              : patientTickets.find(t => t.id === selectedTicketId)
          }
          messages={
            currentEntity === "clinicAdmin"
              ? adminTickets.find(t => t.id === selectedTicketId)?.messages || []
              : patientTickets.find(t => t.id === selectedTicketId)?.messages || []
          }
          onBack={() => {
            if (currentEntity === "clinicAdmin") setCurrentScreen("ticketManagement");
            else setCurrentScreen("tickets");
          }}
          onNavigate={(menu) => {
             if (currentEntity === "clinicAdmin") handleClinicAdminNavigate(menu);
             else if (menu === "clinicalRecords") {
               setCurrentScreen("patientClinicalRecords");
             } else {
               setCurrentScreen(menu as any);
             }
          }}
          onLogout={() => setCurrentScreen("login")}
          onSendReply={(message) => {
            if (currentEntity === "clinicAdmin") {
                const updatedTickets = adminTickets.map(t => {
                  if (t.id === selectedTicketId) {
                    return {
                      ...t,
                      updatedAt: new Date().toISOString(),
                      messages: [
                        ...t.messages,
                        {
                          id: `msg-${Date.now()}`,
                          author: "Clinic Admin",
                          role: "Staff",
                          content: message,
                          timestamp: new Date().toISOString(),
                          isYou: true
                        }
                      ]
                    };
                  }
                  return t;
                });
                setAdminTickets(updatedTickets);
            } else {
                const updatedTickets = patientTickets.map(t => {
                  if (t.id === selectedTicketId) {
                    return {
                      ...t,
                      updatedAt: new Date().toISOString(),
                      messages: [
                        ...t.messages,
                        {
                          id: `msg-${Date.now()}`,
                          author: "John Smith",
                          role: "Patient",
                          content: message,
                          timestamp: new Date().toISOString(),
                          isYou: true
                        }
                      ]
                    };
                  }
                  return t;
                });
                setPatientTickets(updatedTickets);
            }
          }}
          currentEntity={currentEntity}
          onEntitySwitch={handleEntitySwitch}
        />
      )}



      {/* Patient Clinical Records */}
      {currentScreen === "patientClinicalRecords" && (
        <PatientClinicalRecordsScreen
          patientName="John Smith"
          onNavigate={(menu) => {
            setCurrentScreen(menu as any);
          }}
          onLogout={() => setCurrentScreen("login")}
          onNavigateToProfile={() => setCurrentScreen("myProfile")}
          clinicSettings={clinicSettings}
        />
      )}

      {/* Forms & Agreements */}
      {currentScreen === "consentForms" && (
        <FormsAgreementsPatientScreen
          onNavigate={(menu) => {
             if (menu === "clinicalRecords") {
               setCurrentScreen("patientClinicalRecords");
             } else {
               setCurrentScreen(menu as any);
             }
          }}
          onLogout={() => setCurrentScreen("login")}
          onNavigateToProfile={() => setCurrentScreen("myProfile")}
          currentEntity="patient"
          onEntitySwitch={(entity) => {
            setCurrentEntity(entity);
            if (entity === "clinicAdmin") setCurrentScreen("clinicAdminDashboard");
            else if (entity === "provider") setCurrentScreen("providerDashboard");
            else if (entity === "clinic-staff") setCurrentScreen("clinicStaffCalendar");
          }}
          notifications={notifications}
        />
      )}

      {currentScreen === "viewAppointment" &&
        currentAppointmentId && (
          <ViewAppointmentDetailsScreen
            appointment={
              appointments.find(
                (apt) => apt.id === currentAppointmentId,
              )!
            }
            questionnaireData={questionnaireResponses}
            onNavigate={(menu) => {
              setCurrentScreen(menu as any);
            }}
            onBack={() => setCurrentScreen("dashboard")}
            onReschedule={() => {
              setShowRescheduleDrawer(true);
            }}
            onCancel={() => {
              handleCancelAppointment(currentAppointmentId);
              setCurrentScreen("dashboard");
            }}
            onLogout={() => setCurrentScreen("login")}
            onNavigateToProfile={() =>
              setCurrentScreen("myProfile")
            }
            onNavigateToNotifications={() =>
              setCurrentScreen("notifications")
            }
            onViewNotification={(notificationId) => {
              setCurrentNotificationId(notificationId);
              setCurrentScreen("notificationDetail");
            }}
            notifications={notifications}
          />
        )}

      {/* Booking Drawer */}
      {showBookingDrawer && (
        <BookingDrawer
          isOpen={showBookingDrawer}
          onClose={() => setShowBookingDrawer(false)}
          services={services}
          branches={branches.map((b) => ({
            id: b.id,
            name: b.name,
            address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
          }))}
          providers={[
            {
              id: "user-1",
              name: "Dr. Sarah Johnson",
              specialization: "Chiropractor",
              availability: "Available Today",
            },
            {
              id: "user-2",
              name: "Dr. Michael Chen",
              specialization: "Physical Therapist",
              availability: "Next available: Tomorrow",
            },
            {
              id: "user-3",
              name: "Dr. Emily Rodriguez",
              specialization: "Sports Medicine Specialist",
              availability: "Next available: Monday",
            },
          ]}
          onConfirm={(bookingData) => {
            const selectedClinic = branches.find(
              (b) => b.id === bookingData.branchId,
            );
            const providerNames: Record<string, string> = {
              "user-1": "Dr. Sarah Johnson",
              "user-2": "Dr. Michael Chen",
              "user-3": "Dr. Emily Rodriguez",
            };

            const appointmentNumber = String(
              appointments.length + 1,
            ).padStart(4, "0");
            const appointmentId = `APT-2025-${appointmentNumber}`;

            const newAppointment = {
              id: `apt-${Date.now()}`,
              appointmentId: appointmentId,
              patientId: "patient-1",
              patientName: "Emma Wilson",
              providerId: bookingData.providerId,
              date: bookingData.date,
              time: bookingData.time,
              timeSlot: `${bookingData.time} - ${bookingData.time}`,
              provider:
                providerNames[bookingData.providerId] ||
                "Dr. Sarah Johnson",
              clinic:
                selectedClinic?.name ||
                "Downtown Medical Center",
              clinicAddress: selectedClinic
                ? `${selectedClinic.street}, ${selectedClinic.city}, ${selectedClinic.state} ${selectedClinic.zip}`
                : "123 Main Street, Suite 400, New York, NY 10001",
              service: bookingData.service,
              status: "Confirmed" as const,
            };

            setAppointments([...appointments, newAppointment]);
            setNotifications([
              {
                id: `notif-${Date.now()}`,
                message: `Appointment confirmed for ${new Date(bookingData.date).toLocaleDateString()}`,
                timestamp: new Date().toISOString(),
                type: "booking" as const,
              },
              ...notifications,
            ]);
            setShowBookingDrawer(false);
            setCurrentScreen("appointments");
          }}
        />
      )}

      {/* Reschedule Drawer */}
      {showRescheduleDrawer && currentAppointmentId && (
        <RescheduleDrawer
          isOpen={showRescheduleDrawer}
          onClose={() => setShowRescheduleDrawer(false)}
          onConfirm={(bookingData) => {
            const selectedClinic = branches.find(
              (b) => b.id === bookingData.branchId,
            );
            const providerNames: Record<string, string> = {
              "user-1": "Dr. Sarah Johnson",
              "user-2": "Dr. Michael Chen",
              "user-3": "Dr. Emily Rodriguez",
            };

            const updatedAppointments = appointments.map((apt) =>
              apt.id === currentAppointmentId
                ? {
                    ...apt,
                    date: bookingData.date,
                    time: bookingData.time,
                    timeSlot: `${bookingData.time} - ${bookingData.time}`,
                    service: bookingData.service,
                    providerId: bookingData.providerId,
                    provider: providerNames[bookingData.providerId] || "Dr. Sarah Johnson",
                    clinic: selectedClinic?.name || "Downtown Medical Center",
                    clinicAddress: selectedClinic
                      ? `${selectedClinic.street}, ${selectedClinic.city}, ${selectedClinic.state} ${selectedClinic.zip}`
                      : "123 Main Street, Suite 400, New York, NY 10001",
                  }
                : apt,
            );
            setAppointments(updatedAppointments);
            setNotifications([
              {
                id: Date.now().toString(),
                message: "Appointment rescheduled successfully",
                timestamp: new Date().toISOString(),
                type: "reschedule",
              },
              ...notifications,
            ]);
            setShowRescheduleDrawer(false);
          }}
          clinics={branches.map((b) => ({
            id: b.id,
            name: b.name,
            address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
            workingHours: "Mon–Fri, 9:00 AM – 6:00 PM",
          }))}
          providers={[
            {
              id: "user-1",
              name: "Dr. Sarah Johnson",
              specialization: "Chiropractor",
              availability: "Available Today",
            },
            {
              id: "user-2",
              name: "Dr. Michael Chen",
              specialization: "Physical Therapist",
              availability: "Next available: Tomorrow",
            },
            {
              id: "user-3",
              name: "Dr. Emily Rodriguez",
              specialization: "Sports Medicine Specialist",
              availability: "Available Today",
            },
          ]}
        />
      )}

      {/* Clinic Admin Registration */}
      {currentScreen === "clinicAdminRegister" && (
        <ClinicAdminRegisterScreen
          onRegisterSuccess={handleSignupSuccess}
          onNavigateToLogin={() =>
            setCurrentScreen("clinicAdminLogin")
          }
        />
      )}

      {/* Subscription Selection */}
      {currentScreen === "subscriptionSelection" && (
        <SubscriptionSelectionScreen
          onSelectPlan={handleSelectPlan}
          onNavigateToLogin={() =>
            setCurrentScreen("clinicAdminLogin")
          }
        />
      )}

      {/* Organization Details */}
      {currentScreen === "organizationDetails" &&
        selectedPlan && (
          <OrganizationDetailsScreen
            selectedPlan={selectedPlan}
            onContinue={handleOrganizationDetailsSubmit}
            onBack={() =>
              setCurrentScreen("subscriptionSelection")
            }
          />
        )}

      {/* Checkout */}
      {currentScreen === "subscriptionCheckout" &&
        selectedPlan &&
        organizationData && (
          <CheckoutScreen
            selectedPlan={selectedPlan}
            organizationData={organizationData}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() =>
              setCurrentScreen("organizationDetails")
            }
          />
        )}

      {/* Subscription Success */}
      {currentScreen === "subscriptionSuccess" &&
        selectedPlan &&
        organizationData && (
          <SubscriptionSuccessScreen
            organizationName={organizationData.organizationName}
            planName={selectedPlan.name}
            onContinueToDashboard={() =>
              setCurrentScreen("clinicAdminDashboard")
            }
          />
        )}

      {/* Setup Wizard */}
      {currentScreen === "setupWizard" && (
        <SetupWizard
          onComplete={handleSetupWizardComplete}
          onLogout={handleLogout}
          existingData={wizardData || undefined}
        />
      )}

      {/* Clinic Admin Verification */}
      {currentScreen === "clinicAdminVerification" && (
        <ClinicAdminVerificationScreen
          email={userEmail}
          context={passwordContext === "signup" ? "register" : "forgotPassword"}
          onSuccess={
            organizationData
              ? handleSubscriptionOTPSuccess
              : handleOTPPasswordSuccess
          }
          onBack={() => {
            if (organizationData) {
              setCurrentScreen("organizationDetails");
            } else if (passwordContext === "signup") {
              setCurrentScreen("clinicAdminRegister");
            } else {
              setCurrentScreen("clinicAdminForgotPassword");
            }
          }}
        />
      )}

      {/* Clinic Admin Login */}
      {currentScreen === "clinicAdminLogin" && (
        <ClinicAdminLoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToForgotPassword={() =>
            setCurrentScreen("clinicAdminForgotPassword")
          }
          onNavigateToRegister={() =>
            setCurrentScreen("subscriptionSelection")
          }
          successMessage={loginSuccessMessage}
        />
      )}

      {/* Clinic Admin Forgot Password */}
      {currentScreen === "clinicAdminForgotPassword" && (
        <ClinicAdminForgotPasswordScreen
          onSuccess={(email) => {
            setUserEmail(email);
            setPasswordContext("forgotPassword");
            setCurrentScreen("clinicAdminVerification");
          }}
          onBackToLogin={() =>
            setCurrentScreen("clinicAdminLogin")
          }
        />
      )}

      {/* Provider Login */}
      {currentScreen === "providerLogin" && (
        <ProviderLoginScreen
          onLogin={(email, password) => {
            // Validate credentials
            if (
              email === "provider@spinecloudiq.com" &&
              password === "provider123"
            ) {
              // Initialize mock providers if not already loaded
              if (providers.length === 0) {
                setProviders([
                  {
                    id: "user-2",
                    firstName: "Michael",
                    lastName: "Chen",
                    email: "michael.chen@example.com",
                    role: "Medical Staff",
                    specialty: "Chiropractor",
                    color: "#3B82F6",
                    branches: ["Downtown Branch", "Uptown Branch"],
                    status: "Active",
                  },
                  {
                    id: "user-1",
                    firstName: "Sarah",
                    lastName: "Johnson",
                    email: "sarah.johnson@example.com",
                    role: "Clinic Administrator",
                    specialty: "Physical Therapist",
                    color: "#10B981",
                    branches: ["Downtown Branch"],
                    status: "Active",
                  },
                  {
                    id: "user-3",
                    firstName: "Emily",
                    lastName: "Rodriguez",
                    email: "emily.rodriguez@example.com",
                    role: "Medical Staff",
                    specialty: "Physical Therapist",
                    color: "#F59E0B",
                    branches: ["Downtown Branch"],
                    status: "Active",
                  },
                  {
                    id: "user-4",
                    firstName: "David",
                    lastName: "Kim",
                    email: "david.kim@example.com",
                    role: "Medical Staff",
                    specialty: "Massage Therapist",
                    color: "#8B5CF6",
                    branches: ["Uptown Branch"],
                    status: "Active",
                  },
                ]);
              }
              setCurrentScreen("providerDashboard");
            } else {
              alert(
                "Invalid credentials. Use provider@spinecloudiq.com / provider123",
              );
            }
          }}
          onNavigateToForgotPassword={() =>
            setCurrentScreen("providerForgotPassword")
          }
          onSwitchToPatient={() =>
            handleEntitySwitch("patient")
          }
          onSwitchToClinicAdmin={() =>
            handleEntitySwitch("clinicAdmin")
          }
        />
      )}

      {/* Provider Forgot Password */}
      {currentScreen === "providerForgotPassword" && (
        <ProviderForgotPasswordScreen
          onSendResetCode={(email) => {
            setUserEmail(email);
            setCurrentScreen("providerResetPassword");
          }}
          onBack={() => setCurrentScreen("providerLogin")}
        />
      )}

      {/* Provider Reset Password */}
      {currentScreen === "providerResetPassword" && (
        <ProviderResetPasswordScreen
          email={userEmail}
          onResetPassword={(code, newPassword) => {
            setLoginSuccessMessage(
              "Password reset successfully! Please login with your new password.",
            );
            setCurrentScreen("providerLogin");
          }}
          onBack={() =>
            setCurrentScreen("providerForgotPassword")
          }
        />
      )}

      {/* Provider Dashboard */}
      {currentScreen === "providerDashboard" && (
        <ProviderDashboardScreen
          appointments={patientAppointments.filter(
            (apt) => apt.providerId === "user-1",
          )}
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "leaves") {
              setCurrentScreen("providerLeaveManagement");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            } else if (menu === "spineCloud") {
              setCurrentScreen("providerSpineCloudList");
            }
          }}
          onViewAppointment={(appointmentId) => {
            setCurrentAppointmentId(appointmentId);
            console.log("View appointment:", appointmentId);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToProfile={() =>
            setCurrentScreen("providerProfile")
          }
          onNavigateToNotifications={() =>
            setCurrentScreen("providerNotifications")
          }
          unreadNotificationsCount={
            providerNotifications.filter((n) => !n.isRead)
              .length
          }
        />
      )}

      {/* Provider Profile */}
      {currentScreen === "providerProfile" && (
        <ProviderProfileScreen
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "leaves") {
              setCurrentScreen("providerLeaveManagement");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Provider Notifications */}
      {currentScreen === "providerNotifications" && (
        <ProviderNotificationsScreen
          notifications={providerNotifications}
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            }
          }}
          onViewNotification={(notificationId) => {
            setCurrentProviderNotificationId(notificationId);
            setCurrentScreen("providerNotificationDetail");
          }}
          onMarkAsRead={(notificationId) => {
            setProviderNotifications(
              providerNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onMarkAllAsRead={() => {
            setProviderNotifications(
              providerNotifications.map((n) => ({
                ...n,
                isRead: true,
              })),
            );
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Provider Notification Detail */}
      {currentScreen === "providerNotificationDetail" && (
        <ProviderNotificationDetailScreen
          notification={
            providerNotifications.find(
              (n) => n.id === currentProviderNotificationId,
            )!
          }
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            }
          }}
          onBack={() =>
            setCurrentScreen("providerNotifications")
          }
          onMarkAsRead={(notificationId) => {
            setProviderNotifications(
              providerNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onTakeAction={(actionUrl) => {
            console.log("Take action:", actionUrl);
            setCurrentScreen("providerNotifications");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Provider Calendar */}
      {currentScreen === "providerCalendar" && (
        <ProviderCalendarViewScreen
          locations={branches}
          appointments={(() => {
            const filtered = patientAppointments.filter(
              (apt) => apt.providerId === "user-1",
            );
            console.log(
              "Total appointments:",
              patientAppointments.length,
            );
            console.log(
              "Provider appointments:",
              filtered.length,
            );
            console.log(
              "Provider appointments data:",
              filtered,
            );
            console.log(
              "Today's date:",
              new Date().toISOString().split("T")[0],
            );
            return filtered;
          })()}
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "leaves") {
              setCurrentScreen("providerLeaveManagement");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            } else if (menu === "spineCloud") {
              setCurrentScreen("providerSpineCloudList");
            }
          }}
          onViewAppointment={(appointmentId) => {
            const apt = patientAppointments.find((a) => a.id === appointmentId);
            if (apt) {
               const matchedPatient = patients.find(p => p.name === apt.patientName || `${p.firstName} ${p.lastName}` === apt.patientName);
               if (matchedPatient) {
                  setSelectedPatientId(matchedPatient.id);
                  setCurrentScreen("providerPatientDetails");
               }
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          services={services}
        />
      )}

      {/* Provider Patients */}
      {currentScreen === "providerPatients" && (
        <ProviderPatientsScreen
          patients={patients.map((p) => ({
            id: p.id,
            patientId: `PT-${p.patientId}`,
            name: `${p.firstName} ${p.lastName}`,
            locationId: p.locationId || "branch-1",
            locationName: p.locationName || "Downtown Branch",
            email: p.email,
            phone: p.phone,
            appointmentCount: p.totalAppointments || 0,
          }))}
          onNavigate={(menu) => {
            if (menu === "dashboard") {
              setCurrentScreen("providerDashboard");
            } else if (menu === "calendar") {
              setCurrentScreen("providerCalendar");
            } else if (menu === "leaves") {
              setCurrentScreen("providerLeaveManagement");
            } else if (menu === "patients") {
              setCurrentScreen("providerPatients");
            } else if (menu === "spineCloud") {
              setCurrentScreen("providerSpineCloudList");
            }
          }}
          onViewPatient={(patientId) => {
            setSelectedPatientId(patientId);
            setCurrentScreen("providerPatientDetails");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Provider Leave Management */}
      {currentScreen === "providerLeaveManagement" && (() => {
        // Get appointments for conflict detection
        const getConflictingAppointments = (startDate: string, endDate: string) => {
          return patientAppointments.filter((apt) => {
            const aptDate = new Date(apt.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return aptDate >= start && aptDate <= end && apt.providerId === "user-1";
          }).map((apt) => {
            // Find patient by name to get patient ID
            const patient = patients.find((p) => p.name === apt.patientName);
            return {
              id: apt.id,
              patientId: patient?.id || "PAT-001",
              patientName: apt.patientName,
              date: apt.date,
              time: apt.time,
              service: apt.service || apt.serviceType,
              branch: branches.find((b) => b.id === apt.locationId)?.name || "Downtown Branch",
            };
          });
        };

        return (
          <LeaveManagementScreen
            onNavigate={(menu) => {
              if (menu === "dashboard") {
                setCurrentScreen("providerDashboard");
              } else if (menu === "calendar") {
                setCurrentScreen("providerCalendar");
              } else if (menu === "leaves") {
                setCurrentScreen("providerLeaveManagement");
              } else if (menu === "patients") {
                setCurrentScreen("providerPatients");
              } else if (menu === "spineCloud") {
                setCurrentScreen("providerSpineCloudList");
              }
            }}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
            leaves={providerLeaves}
            conflictingAppointments={patientAppointments.filter(apt => apt.providerId === "user-1").map((apt) => {
              const patient = patients.find((p) => p.name === apt.patientName);
              return {
                id: apt.id,
                patientId: patient?.id || "PAT-001",
                patientName: apt.patientName,
                date: apt.date,
                time: apt.time,
                service: apt.service || apt.serviceType,
                branch: branches.find((b) => b.id === apt.locationId)?.name || "Downtown Branch",
              };
            })}
            availableProviders={providers.filter((p) => p.id !== "user-1").map((p) => ({
              id: p.id,
              name: `${p.firstName} ${p.lastName}`,
              specialty: p.specialty,
            }))}
            onAddLeave={(leave) => {
              const newLeave = {
                ...leave,
                id: `leave-${Date.now()}`,
                status: "Approved" as const,
                createdAt: new Date().toISOString(),
                conflictingAppointments: getConflictingAppointments(
                  leave.startDate,
                  leave.endDate
                ).length,
              };
              setProviderLeaves([...providerLeaves, newLeave]);
            }}
            onUpdateLeave={(id, updatedLeave) => {
              setProviderLeaves(
                providerLeaves.map((l) =>
                  l.id === id
                    ? {
                        ...l,
                        ...updatedLeave,
                        conflictingAppointments: getConflictingAppointments(
                          updatedLeave.startDate,
                          updatedLeave.endDate
                        ).length,
                      }
                    : l
                )
              );
            }}
            onCancelLeave={(id) => {
              setProviderLeaves(
                providerLeaves.map((l) =>
                  l.id === id ? { ...l, status: "Cancelled" as const } : l
                )
              );
            }}
            onCancelAppointment={(appointmentId) => {
              setPatientAppointments(
                patientAppointments.filter((a) => a.id !== appointmentId)
              );
            }}
            onReassignAppointment={(appointmentId, newProviderId) => {
              console.log("App.tsx: Reassigning appointment", appointmentId, "to provider", newProviderId);
              setPatientAppointments(
                patientAppointments.map((a) =>
                  a.id === appointmentId
                    ? { ...a, providerId: newProviderId }
                    : a
                )
              );
              console.log("App.tsx: Reassignment complete");
            }}
          />
        );
      })()}

      {/* Provider Patient Details */}
      {currentScreen === "providerPatientDetails" &&
        (() => {
          const patient = patients.find(
            (p) => p.id === selectedPatientId,
          );
          if (!patient) return null;

          // Get patient's appointments by matching patient name (since appointments have patientName, not patientId yet)
          const patientFullName = patient.name || `${patient.firstName} ${patient.lastName}`;
          const patientAppts = patientAppointments.filter(
            (apt) => apt.patientName === patientFullName,
          );

          // Get location name helper
          const getLocationName = (locationId: string) => {
            const branch = branches.find(
              (b) => b.id === locationId,
            );
            return branch?.name || "Unknown Location";
          };

          // Get provider name helper
          const getProviderName = (providerId: string) => {
            const provider = providers.find(
              (p) => p.id === providerId,
            );
            return provider?.name || "Dr. Johnson";
          };

          // Helper to convert status
          const convertStatus = (
            status: string,
          ): "Confirmed" | "Completed" | "Cancelled" => {
            if (status === "Confirmed") return "Confirmed";
            if (status === "Completed") return "Completed";
            if (status === "Cancelled") return "Cancelled";
            return "Confirmed";
          };

          // Create full patient details object
          const fullPatientDetails = {
            id: patient.id,
            firstName: patient.name?.split(" ")[0] || "",
            lastName: patient.name?.split(" ")[1] || "",
            email: patient.email || "",
            phone: patient.phone || "",
            dateOfBirth: "1990-05-15",
            gender: "male",
            profilePicture: null,
            street: "123 Main Street, Apt 4B",
            city: "New York",
            state: "New York",
            zipCode: "10001",
            country: "US",
            emergencyName: "Jane Doe",
            emergencyCountryCode: "+1",
            emergencyContact: "(555) 987-6543",
            insuranceProvider: "Blue Cross Blue Shield",
            planNetworkName: "PPO",
            policyNumber: "BCBS123456789",
            groupNumber: "GRP456",
            policyHolderName: patient.name || "",
            policyHolderDOB: "1990-05-15",
            relationshipToPolicyholder: "self",
            appointments: patientAppts.map((apt) => ({
              id: apt.id,
              service:
                apt.service || "General Appointment",
              date: apt.date,
              time: `${apt.startTime} - ${apt.endTime}`,
              status: convertStatus(apt.status),
              location: getLocationName(apt.locationId),
              provider: getProviderName(apt.providerId),
              completedAt: apt.completedAt,
            })),
          };

          return (
            <ProviderPatientDetailsScreen
              patient={fullPatientDetails}
              soapCategories={soapCategories}
              services={services}
              branches={branches}
              providers={providers}
              onBookAppointments={(newAppts) => {
                setPatientAppointments(prev => [...prev, ...newAppts]);
              }}
              onNavigate={(menu) => {
                if (menu === "dashboard") {
                  setCurrentScreen("providerDashboard");
                } else if (menu === "calendar") {
                  setCurrentScreen("providerCalendar");
                } else if (menu === "leaves") {
                  setCurrentScreen("providerLeaveManagement");
                } else if (menu === "patients") {
                  setCurrentScreen("providerPatients");
                }
              }}
              onBack={() =>
                setCurrentScreen("providerPatients")
              }
              onViewAppointment={(appointmentId) => {
                setSelectedAppointmentId(appointmentId);
                setCurrentScreen("providerAppointmentDetails");
              }}
              onLogout={() => {
                setCurrentEntity("patient");
                setCurrentScreen("login");
              }}
            />
          );
        })()}

      {/* Provider Appointment Details */}
      {currentScreen === "providerAppointmentDetails" &&
        (() => {
          const patient = patients.find(
            (p) => p.id === selectedPatientId,
          );
          if (!patient) return null;

          // Get all patient appointments
          const patientAppts = patientAppointments.filter(
            (apt) => apt.patientName === patient.name,
          );

          // Find the specific appointment
          const appointment = patientAppts.find(
            (apt) => apt.id === selectedAppointmentId,
          );
          if (!appointment) return null;

          // Get location name helper
          const getLocationName = (locationId: string) => {
            const branch = branches.find(
              (b) => b.id === locationId,
            );
            return branch?.name || "Unknown Location";
          };

          // Get provider name helper
          const getProviderName = (providerId: string) => {
            const provider = providers.find(
              (p) => p.id === providerId,
            );
            return provider?.name || "Dr. Johnson";
          };

          // Helper to convert status
          const convertStatus = (
            status: string,
          ): "Confirmed" | "Completed" | "Cancelled" => {
            if (status === "Confirmed") return "Confirmed";
            if (status === "Completed") return "Completed";
            if (status === "Cancelled") return "Cancelled";
            return "Confirmed";
          };

          // Create appointment details object
          const appointmentDetails = {
            id: appointment.id,
            service:
              appointment.service || "General Appointment",
            date: appointment.date,
            time: `${appointment.startTime} - ${appointment.endTime}`,
            status: convertStatus(appointment.status),
            location: getLocationName(appointment.locationId),
            provider: getProviderName(appointment.providerId),
            completedAt: appointment.completedAt,
            patient: {
              id: patient.id,
              name: patient.name || "",
              dateOfBirth: "1990-05-15",
              gender: "male",
              email: patient.email || "",
              phone: patient.phone || "",
            },
          };

          return (
            <ProviderAppointmentDetailsScreen
              appointment={appointmentDetails}
              soapCategories={soapCategories} // Pass SOAP Master categories
              onNavigate={(menu) => {
                if (menu === "dashboard") {
                  setCurrentScreen("providerDashboard");
                } else if (menu === "calendar") {
                  setCurrentScreen("providerCalendar");
                } else if (menu === "leaves") {
                  setCurrentScreen("providerLeaveManagement");
                } else if (menu === "patients") {
                  setCurrentScreen("providerPatients");
                }
              }}
              onBackToPatient={() =>
                setCurrentScreen("providerPatientDetails")
              }
              onCompleteSession={(appointmentId) => {
                // Mark appointment as completed
                setPatientAppointments(
                  patientAppointments.map((apt) =>
                    apt.id === appointmentId
                      ? {
                          ...apt,
                          status: "Completed",
                          completedAt: new Date().toISOString(),
                        }
                      : apt,
                  ),
                );
                alert(
                  "Session completed successfully! Billing and invoicing will be handled by clinic staff.",
                );
              }}
              onLogout={() => {
                setCurrentEntity("patient");
                setCurrentScreen("login");
              }}
            />
          );
        })()}

      {/* Clinic Staff Login */}
      {currentScreen === "clinicStaffLogin" && (
        <ClinicStaffLoginScreen
          onLogin={(email, password) => {
            if (
              email === "staff@clinic.com" &&
              password === "staff123"
            ) {
              setCurrentScreen("clinicStaffCalendar");
            } else {
              alert(
                "Invalid credentials. Use staff@clinic.com / staff123",
              );
            }
          }}
        />
      )}

      {/* Clinic Staff Calendar */}
      {currentScreen === "clinicStaffCalendar" && (
        <ClinicStaffCalendarScreen
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onViewAppointment={(appointmentId, patientId) => {
            setSelectedAppointmentId(appointmentId);
            setSelectedPatientId(patientId);
            setCurrentScreen("clinicStaffAppointmentDetails");
          }}
          onBookAppointment={() => {
            // Navigate to booking flow (use same screen as patient portal)
            setCurrentScreen("clinicStaffBookAppointment");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToNotifications={() =>
            setCurrentScreen("clinicStaffNotifications")
          }
          unreadNotificationsCount={
            clinicStaffNotifications.filter((n) => !n.isRead)
              .length
          }
        />
      )}

      {/* Clinic Staff Profile */}
      {currentScreen === "clinicStaffProfile" && (
        <ClinicStaffProfileScreen
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Notifications */}
      {currentScreen === "clinicStaffNotifications" && (
        <ClinicStaffNotificationsScreen
          notifications={clinicStaffNotifications}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onViewNotification={(notificationId) => {
            setCurrentClinicStaffNotificationId(notificationId);
            setCurrentScreen("clinicStaffNotificationDetail");
          }}
          onMarkAsRead={(notificationId) => {
            setClinicStaffNotifications(
              clinicStaffNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onMarkAllAsRead={() => {
            setClinicStaffNotifications(
              clinicStaffNotifications.map((n) => ({
                ...n,
                isRead: true,
              })),
            );
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToProfile={() =>
            setCurrentScreen("clinicStaffProfile")
          }
        />
      )}

      {/* Clinic Staff Notification Detail */}
      {currentScreen === "clinicStaffNotificationDetail" && (
        <ClinicStaffNotificationDetailScreen
          notification={
            clinicStaffNotifications.find(
              (n) => n.id === currentClinicStaffNotificationId,
            )!
          }
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onBack={() =>
            setCurrentScreen("clinicStaffNotifications")
          }
          onMarkAsRead={(notificationId) => {
            setClinicStaffNotifications(
              clinicStaffNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onTakeAction={(actionUrl) => {
            console.log("Take action:", actionUrl);
            setCurrentScreen("clinicStaffNotifications");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToProfile={() =>
            setCurrentScreen("clinicStaffProfile")
          }
        />
      )}

      {/* Clinic Staff Patients */}
      {currentScreen === "clinicStaffPatients" && (
        <ClinicStaffPatientsScreen
          patients={patients}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onViewPatient={(patientId) => {
            setSelectedPatientId(patientId);
            setCurrentScreen("clinicStaffPatientDetails");
          }}
          onAddPatient={() => {
            setCurrentScreen("clinicStaffAddPatientSelection");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Add Patient Selection */}
      {currentScreen === "clinicStaffAddPatientSelection" && (
        <StaffAddPatientSelectionScreen
          onBack={() => setCurrentScreen("clinicStaffPatients")}
          onSelectManualAdd={() =>
            setCurrentScreen("clinicStaffAddPatient")
          }
          onSelectGenerateLink={() =>
            setCurrentScreen("clinicStaffGenerateLink")
          }
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Add Patient Flow */}
      {currentScreen === "clinicStaffAddPatient" && (
        <StaffAddPatientFullPageScreen
          questionnaires={questionnaires}
          consentForms={consentForms}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onBack={() =>
            setCurrentScreen("clinicStaffAddPatientSelection")
          }
          onSavePatient={handleAddPatient}
          onGenerateLink={() => {
            setCurrentScreen("clinicStaffGenerateLink");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          services={services}
        />
      )}

      {/* Clinic Staff Generate Link */}
      {currentScreen === "clinicStaffGenerateLink" && (
        <StaffGenerateSignupLinkScreen
          onBack={() => setCurrentScreen("clinicStaffPatients")}
          onGenerate={(
            email,
            firstName,
            lastName,
            city,
            state,
            country,
            notes,
          ) => {
            handleClinicStaffGenerateSignupLink(
              email,
              firstName,
              lastName,
              city,
              state,
              country,
              notes,
            );
            // Stay on this screen to show success state
          }}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Patient Details */}
      {currentScreen === "clinicStaffPatientDetails" && (
        <ClinicStaffPatientDetailsScreen
          patientId={selectedPatientId}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onBack={() => setCurrentScreen("clinicStaffPatients")}
          onViewAppointment={(appointmentId) => {
            setSelectedAppointmentId(appointmentId);
            setCurrentScreen("clinicStaffAppointmentDetails");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Appointment Details */}
      {currentScreen === "clinicStaffAppointmentDetails" && (
        <ClinicStaffAppointmentDetailsScreen
          appointmentId={selectedAppointmentId}
          patientId={selectedPatientId}
          onNavigate={(menu) => {
            if (menu === "calendar") {
              setCurrentScreen("clinicStaffCalendar");
            } else if (menu === "patients") {
              setCurrentScreen("clinicStaffPatients");
            }
          }}
          onBackToPatient={() =>
            setCurrentScreen("clinicStaffPatientDetails")
          }
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Staff Book Appointment Flow */}
      {currentScreen === "clinicStaffBookAppointment" && (
        <BookingFromDashboardFlow
          services={services}
          clinics={branches.map((b) => ({
            id: b.id,
            name: b.name,
            address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
          }))}
          providers={[
            {
              id: "user-1",
              name: "Dr. Sarah Johnson",
              specialization: "Chiropractor",
              availability: "Available Today",
            },
            {
              id: "user-2",
              name: "Dr. Michael Chen",
              specialization: "Physical Therapist",
              availability: "Next available: Tomorrow",
            },
            {
              id: "user-3",
              name: "Dr. Emily Rodriguez",
              specialization: "Sports Medicine Specialist",
              availability: "Next available: Monday",
            },
          ]}
          onComplete={(bookingData) => {
            // Create new appointment
            const selectedClinic = branches.find(
              (b) => b.id === bookingData.clinicId,
            );
            const providerNames: Record<string, string> = {
              "user-1": "Dr. Sarah Johnson",
              "user-2": "Dr. Michael Chen",
              "user-3": "Dr. Emily Rodriguez",
            };

            // Generate appointment ID
            const appointmentNumber = String(
              appointments.length + 1,
            ).padStart(4, "0");
            const appointmentId = `APT-2025-${appointmentNumber}`;

            const newAppointment = {
              id: `apt-${Date.now()}`,
              appointmentId: appointmentId,
              patientId: "patient-1",
              patientName: "Emma Wilson",
              providerId: bookingData.providerId,
              date: bookingData.date,
              time: bookingData.time,
              timeSlot: `${bookingData.time} - ${bookingData.time}`,
              provider:
                providerNames[bookingData.providerId] ||
                "Dr. Sarah Johnson",
              service: bookingData.service,
              status: "Confirmed" as const,
            };

            setAppointments([...appointments, newAppointment]);

            // Redirect back to calendar
            setCurrentScreen("clinicStaffCalendar");
          }}
          onCancel={() =>
            setCurrentScreen("clinicStaffCalendar")
          }
        />
      )}

      {/* Clinic Admin Book Appointment Flow */}
      {currentScreen === "clinicAdminBookAppointment" && (
        <BookingFromDashboardFlow
          services={services}
          clinics={branches.map((b) => ({
            id: b.id,
            name: b.name,
            address: `${b.street}, ${b.city}, ${b.state} ${b.zip}`,
          }))}
          providers={[
            {
              id: "user-1",
              name: "Dr. Sarah Johnson",
              specialization: "Chiropractor",
              availability: "Available Today",
            },
            {
              id: "user-2",
              name: "Dr. Michael Chen",
              specialization: "Physical Therapist",
              availability: "Next available: Tomorrow",
            },
            {
              id: "user-3",
              name: "Dr. Emily Rodriguez",
              specialization: "Sports Medicine Specialist",
              availability: "Next available: Monday",
            },
          ]}
          onComplete={(bookingData) => {
            // Create new appointment
            const selectedClinic = branches.find(
              (b) => b.id === bookingData.clinicId,
            );
            const providerNames: Record<string, string> = {
              "user-1": "Dr. Sarah Johnson",
              "user-2": "Dr. Michael Chen",
              "user-3": "Dr. Emily Rodriguez",
            };

            // Generate appointment ID
            const appointmentNumber = String(
              appointments.length + 1,
            ).padStart(4, "0");
            const appointmentId = `APT-2025-${appointmentNumber}`;

            const newAppointment = {
              id: `apt-${Date.now()}`,
              appointmentId: appointmentId,
              patientId: "patient-1",
              patientName: "Emma Wilson",
              providerId: bookingData.providerId,
              date: bookingData.date,
              time: bookingData.time,
              timeSlot: `${bookingData.time} - ${bookingData.time}`,
              provider:
                providerNames[bookingData.providerId] ||
                "Dr. Sarah Johnson",
              service: bookingData.service,
              status: "Confirmed" as const,
            };

            setAppointments([...appointments, newAppointment]);

            // Redirect back to calendar
            setCurrentScreen("clinicCalendar");
          }}
          onCancel={() => setCurrentScreen("clinicCalendar")}
        />
      )}

      {/* Invoices List */}
      {currentScreen === "invoicesList" && (
        <InvoicesListScreen
          onNavigate={handleClinicAdminNavigate}
          onViewInvoice={(invoiceId) => {
            setSelectedInvoiceId(invoiceId);
            setCurrentScreen("invoiceDetails");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Invoice Details */}
      {currentScreen === "invoiceDetails" && (
        <InvoiceDetailsScreen
          invoiceId={selectedInvoiceId}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("invoicesList")}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Payments Overview */}
      {currentScreen === "paymentsList" && (
        <PaymentsOverviewScreen
          onNavigate={handleClinicAdminNavigate}
          onViewPayment={(paymentId) => {
            setSelectedPaymentId(paymentId);
            // For now, just console log - can add payment details screen later
            console.log("View payment:", paymentId);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Appointment Report */}
      {currentScreen === "appointmentReport" && (
        <AppointmentReportScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Activity Log */}
      {currentScreen === "activityLog" && (
        <ActivityLogScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToProfile={() =>
            setCurrentScreen("clinicAdminProfile")
          }
          onNavigateToNotifications={() =>
            setCurrentScreen("clinicAdminNotifications")
          }
          unreadNotificationsCount={
            clinicAdminNotifications.filter((n) => !n.isRead)
              .length
          }
        />
      )}

      {/* Audit Log */}
      {currentScreen === "auditLog" && (
        <AuditLogScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          onNavigateToProfile={() =>
            setCurrentScreen("clinicAdminProfile")
          }
          onNavigateToNotifications={() =>
            setCurrentScreen("clinicAdminNotifications")
          }
          unreadNotificationsCount={
            clinicAdminNotifications.filter((n) => !n.isRead)
              .length
          }
        />
      )}

      {/* Room Management */}
      {currentScreen === "roomsList" && (
        <RoomManagementScreen
          rooms={rooms}
          onNavigate={handleClinicAdminNavigate}
          onAddRoom={() => {
            setEditingRoom(null);
            setIsAddEditRoomDrawerOpen(true);
          }}
          onViewRoom={handleViewRoom}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit Room Drawer */}
      <AddEditRoomDrawer
        isOpen={isAddEditRoomDrawerOpen}
        onClose={() => {
          setIsAddEditRoomDrawerOpen(false);
          setEditingRoom(null);
        }}
        room={editingRoom}
        onSave={handleSaveRoom}
      />

      {/* Room Details Drawer */}
      <RoomDetailsDrawer
        isOpen={isRoomDetailsDrawerOpen}
        onClose={() => {
          setIsRoomDetailsDrawerOpen(false);
          setSelectedRoomId("");
        }}
        room={rooms.find((r) => r.id === selectedRoomId)!}
        onEdit={handleEditRoom}
      />

      {/* Base Setup Screen */}
      {currentScreen === "baseSetup" && (
        <BaseSetupScreen
          branches={branches}
          providers={providers}
          services={services}
          questionnaires={questionnaires}
          consentForms={consentForms}
          roles={roles}
          users={users}
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Admin Dashboard */}
      {currentScreen === "clinicAdminDashboard" && (
        <>
          {!setupComplete && (
            <SetupIncompleteBanner
              onResumeSetup={handleResumeSetup}
            />
          )}
          <ClinicAdminDashboardScreen
            onNavigate={handleClinicAdminNavigate}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
            onNavigateToProfile={() =>
              setCurrentScreen("clinicAdminProfile")
            }
            onNavigateToNotifications={() =>
              setCurrentScreen("clinicAdminNotifications")
            }
            unreadNotificationsCount={
              clinicAdminNotifications.filter((n) => !n.isRead)
                .length
            }
            appointments={patientAppointments}
            patients={patients}
          />
        </>
      )}

      {/* Clinic Admin Profile */}
      {currentScreen === "clinicAdminProfile" && (
        <ClinicAdminProfileScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* SpineCloud Index Configuration */}
      {currentScreen === "spineCloudConfig" && (
        <SpineCloudIndexConfigScreen
          config={spineCloudConfig}
          onSave={(config) => {
            setSpineCloudConfig(config);
            setCurrentScreen("clinicAdminSpineCloudList");
          }}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("clinicAdminSpineCloudList")}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}


      {/* SOAP Master Configuration */}
      {currentScreen === "soapMaster" && (
        <SOAPMasterScreen
          categories={soapCategories}
          onNavigate={handleClinicAdminNavigate}
          onSaveCategories={(categories) => {
            setSOAPCategories(categories);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Email Management */}
      {currentScreen === "emailManagement" && (
        <EmailManagementScreen
          onNavigate={handleClinicAdminNavigate}
          onEditTemplate={(template) => {
            setEditingEmailTemplate(template);
            setCurrentScreen("editEmailTemplate");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Edit Email Template */}
      {currentScreen === "editEmailTemplate" && editingEmailTemplate && (
        <EditEmailTemplateScreen
          template={editingEmailTemplate}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => {
            setCurrentScreen("emailManagement");
            setEditingEmailTemplate(null);
          }}
          onSave={(template) => {
            // Here you would update the template in your state/API
            console.log("Saving template:", template);
            setEditingEmailTemplate(null);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Settings */}
      {currentScreen === "clinicSettings" && (
        <ClinicSettingsScreen
          onNavigate={handleClinicAdminNavigate}
          clinicSettings={clinicSettings}
          setClinicSettings={setClinicSettings}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Ticket Management */}
      {currentScreen === "ticketManagement" && (
        <TicketManagementScreen
          onNavigate={handleClinicAdminNavigate}
          onViewTicket={(id) => {
             setSelectedTicketId(id);
             setCurrentScreen("ticketDetails");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          tickets={adminTickets}
        />
      )}

      {/* Care Plan Master */}
      {currentScreen === "carePlanMaster" && (
        <CarePlanMasterScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Admin Clinical Records */}
      {currentScreen === "clinicAdminClinicalRecords" && (
        <ClinicAdminClinicalRecordsScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Raise Ticket */}
      {currentScreen === "raiseTicket" && (
        <RaiseTicketScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Admin SpineCloud Index Details */}
      {currentScreen === "clinicAdminSpineCloudDetails" && (() => {
        // Mock patient data - in real app, fetch by selectedSpineCloudPatientId
        const mockPatient = {
          id: selectedSpineCloudPatientId,
          name: "Sarah Johnson",
          age: 42,
          dateOfBirth: "1984-03-15",
        };

        return (
          <ClinicAdminSpineCloudDetailsScreen
            patientId={mockPatient.id}
            patientName={mockPatient.name}
            patientAge={mockPatient.age}
            patientDateOfBirth={mockPatient.dateOfBirth}
            onNavigate={handleClinicAdminNavigate}
            onBack={() => setCurrentScreen("clinicAdminSpineCloudList")}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
            onNavigateToProfile={() =>
              setCurrentScreen("clinicAdminProfile")
            }
          />
        );
      })()}


      {/* Clinic Admin Notifications */}
      {currentScreen === "clinicAdminNotifications" && (
        <ClinicAdminNotificationsScreen
          notifications={clinicAdminNotifications}
          onNavigate={handleClinicAdminNavigate}
          onViewNotification={(notificationId) => {
            setCurrentClinicAdminNotificationId(notificationId);
            setCurrentScreen("clinicAdminNotificationDetail");
          }}
          onMarkAsRead={(notificationId) => {
            setClinicAdminNotifications(
              clinicAdminNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onMarkAllAsRead={() => {
            setClinicAdminNotifications(
              clinicAdminNotifications.map((n) => ({
                ...n,
                isRead: true,
              })),
            );
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Admin Notification Detail */}
      {currentScreen === "clinicAdminNotificationDetail" && (
        <ClinicAdminNotificationDetailScreen
          notification={
            clinicAdminNotifications.find(
              (n) => n.id === currentClinicAdminNotificationId,
            )!
          }
          onNavigate={handleClinicAdminNavigate}
          onBack={() =>
            setCurrentScreen("clinicAdminNotifications")
          }
          onMarkAsRead={(notificationId) => {
            setClinicAdminNotifications(
              clinicAdminNotifications.map((n) =>
                n.id === notificationId
                  ? { ...n, isRead: true }
                  : n,
              ),
            );
          }}
          onTakeAction={(actionUrl) => {
            console.log("Take action:", actionUrl);
            // Navigate based on actionUrl
            setCurrentScreen("clinicAdminNotifications");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Clinic Calendar */}
      {currentScreen === "clinicCalendar" && (
        <ClinicCalendarScreen
          locations={branches}
          providers={providers}
          appointments={patientAppointments}
          patients={patients}
          services={services}
          rooms={rooms}
          initialRescheduleId={reschedulingAppointmentId}
          onNavigate={handleClinicAdminNavigate}
          onViewAppointment={(appointmentId) => {
            setCurrentAppointmentId(appointmentId);
            // You could navigate to a view appointment screen if needed
            console.log("View appointment:", appointmentId);
          }}
          onCreateAppointment={(
            date,
            time,
            providerId,
            locationId,
          ) => {
            // Handle create appointment
            console.log("Create appointment:", {
              date,
              time,
              providerId,
              locationId,
            });
          }}
          onRescheduleAppointment={(
            appointmentId,
            newDate,
            newTime,
            newProviderId,
          ) => {
            // Handle reschedule
            const updatedAppointments = patientAppointments.map((a) =>
              a.id === appointmentId
                ? {
                    ...a,
                    date: newDate,
                    startTime: newTime,
                    providerId: newProviderId,
                    status: "Confirmed" as const, // Reset status to confirmed if it was something else
                  }
                : a,
            );
            setPatientAppointments(updatedAppointments);
          }}
          onCancelAppointment={(appointmentId) => {
            // Handle cancellation
            const updatedAppointments = patientAppointments.map((a) =>
              a.id === appointmentId
                ? {
                    ...a,
                    status: "Cancelled" as const,
                  }
                : a,
            );
            setPatientAppointments(updatedAppointments);
          }}
          onBookAppointment={(appointment) => {
            // Create new appointment from booking drawer
            const patient = patients.find(p => p.id === appointment.patientId);
            const service = services.find(s => s.id === appointment.serviceId);
            const provider = providers.find(p => p.id === appointment.providerId);
            
            if (patient && service && provider) {
              // Calculate end time based on service duration + room cleanup
              const room = rooms.find(r => r.id === appointment.roomId);
              const phaseDuration = service.phases.reduce((sum: number, phase: any) => sum + phase.duration, 0);
              const totalDuration = phaseDuration + (room?.cleanupTime || 0);
              
              const [startHour, startMin] = appointment.time.split(':').map(Number);
              const endMinutes = startHour * 60 + startMin + totalDuration;
              const endHour = Math.floor(endMinutes / 60);
              const endMin = endMinutes % 60;
              const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
              
              const newAppointment = {
                id: `apt-${Date.now()}`,
                patientId: appointment.patientId,
                patientName: `${patient.firstName} ${patient.lastName}`,
                providerId: appointment.providerId,
                locationId: branches[0]?.id || 'loc-1', // Use first branch or default
                date: appointment.date,
                startTime: appointment.time,
                endTime: endTime,
                type: service.name,
                status: 'Confirmed' as const,
                serviceId: appointment.serviceId,
                roomId: appointment.roomId,
              };
              
              setPatientAppointments([...patientAppointments, newAppointment]);
              console.log("Appointment booked:", newAppointment);
            }
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Holidays List */}
      {currentScreen === "holidaysList" && (
        <HolidaysListScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          branches={branches}
          holidays={holidays}
          onAddHoliday={(holiday) => {
            const newHoliday = {
              ...holiday,
              id: `holiday-${Date.now()}`,
              createdAt: new Date().toISOString(),
            };
            setHolidays([...holidays, newHoliday]);
          }}
          onUpdateHoliday={(id, updatedHoliday) => {
            setHolidays(
              holidays.map((h) =>
                h.id === id
                  ? { ...h, ...updatedHoliday }
                  : h
              )
            );
          }}
          onDeleteHoliday={(id) => {
            setHolidays(holidays.filter((h) => h.id !== id));
          }}
        />
      )}

      {/* Subscription Management */}
      {currentScreen === "subscriptionManagement" && (
        <SubscriptionManagementScreen
          onNavigate={handleClinicAdminNavigate}
          onUpgrade={() =>
            setCurrentScreen("subscriptionSelection")
          }
          onCancel={() => {
            console.log("Subscription cancelled");
            setCurrentScreen("clinicAdminDashboard");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Branches List */}
      {currentScreen === "branchesList" && (
        <BranchesListScreen
          branches={branches}
          onNavigate={handleClinicAdminNavigate}
          onAddBranch={() => {
            setEditingBranch(null);
            setCurrentScreen("addEditBranch");
          }}
          onViewBranch={(id) => {
            const branch = branches.find((b) => b.id === id);
            setEditingBranch(branch);
            setCurrentBranchId(id);
            setCurrentScreen("addEditBranch");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit Branch */}
      {currentScreen === "addEditBranch" && (
        <AddEditBranchScreen
          branch={editingBranch}
          mode={editingBranch ? "edit" : "add"}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("branchesList")}
          onSave={(branchData) => {
            if (editingBranch) {
              // Edit existing branch
              setBranches(
                branches.map((b) =>
                  b.id === editingBranch.id
                    ? { ...branchData, id: editingBranch.id }
                    : b,
                ),
              );
            } else {
              // Add new branch
              setBranches([
                ...branches,
                { ...branchData, id: `branch-${Date.now()}` },
              ]);
            }
            setEditingBranch(null);
            setCurrentScreen("branchesList");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Questionnaires List */}
      {currentScreen === "questionnairesList" && (
        <PatientFormsListScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit Questionnaire */}
      {currentScreen === "addEditQuestionnaire" && (
        <AddEditQuestionnaireScreen
          questionnaire={editingQuestionnaire}
          mode={editingQuestionnaire ? "edit" : "add"}
          availableBranches={branches}
          availableServices={services}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("questionnairesList")}
          onPreview={(data) => {
            setPreviewQuestionnaire(data);
            setShowPreviewModal(true);
          }}
          onSave={(data) => {
            if (editingQuestionnaire) {
              setQuestionnaires(
                questionnaires.map((q) =>
                  q.id === data.id
                    ? {
                        ...data,
                        questionCount: data.questions.length,
                        branchNames: branches
                          .filter((b) =>
                            data.branchIds.includes(b.id),
                          )
                          .map((b) => b.name),
                        updatedAt: new Date().toISOString(),
                      }
                    : q,
                ),
              );
            } else {
              setQuestionnaires([
                ...questionnaires,
                {
                  ...data,
                  id: `quest-${Date.now()}`,
                  questionCount: data.questions.length,
                  branchNames: branches
                    .filter((b) =>
                      data.branchIds.includes(b.id),
                    )
                    .map((b) => b.name),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ]);
            }
            setEditingQuestionnaire(null);
            setCurrentScreen("questionnairesList");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewQuestionnaire && (
        <PreviewQuestionnaireModal
          isOpen={showPreviewModal}
          questionnaire={previewQuestionnaire}
          onClose={() => {
            setShowPreviewModal(false);
            setPreviewQuestionnaire(null);
          }}
        />
      )}

      {/* Roles Management */}
      {currentScreen === "rolesManagement" && (
        <RolesManagementScreen
          roles={roles}
          userCounts={users.reduce(
            (acc, user) => {
              acc[user.role] = (acc[user.role] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          )}
          onNavigate={handleClinicAdminNavigate}
          onAddRole={() => {
            setEditingRole(null);
            setCurrentScreen("addEditRole");
          }}
          onEditRole={(roleId) => {
            const role = roles.find((r) => r.id === roleId);
            setEditingRole(role);
            setCurrentScreen("addEditRole");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Permissions Management */}
      {currentScreen === "userManagement" && (
        <UserManagementScreen
          users={users}
          onNavigate={handleClinicAdminNavigate}
          onAddUser={() => {
            setEditingUser(null);
            setCurrentScreen("addEditUser");
          }}
          onEditUser={(userId) => {
            const user = users.find((u) => u.id === userId);
            setEditingUser(user);
            setCurrentScreen("addEditUser");
          }}
          onResendInvite={(userId) => {
            console.log("Resend invite to user:", userId);
          }}
          onDeleteUser={(userId) => {
            console.log("Delete user:", userId);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit Role */}
      {currentScreen === "addEditRole" && (
        <AddEditRoleScreen
          role={editingRole}
          mode={editingRole ? "edit" : "add"}
          availableBranches={branches}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("rolesManagement")}
          onSave={(roleData) => {
            if (editingRole) {
              // Edit existing role
              setRoles(
                roles.map((r) =>
                  r.id === roleData.id
                    ? { ...r, ...roleData }
                    : r,
                ),
              );
            } else {
              // Add new role
              setRoles([
                ...roles,
                {
                  ...roleData,
                  id: `role-${Date.now()}`,
                },
              ]);
            }
            setEditingRole(null);
            setCurrentScreen("rolesManagement");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit User */}
      {currentScreen === "addEditUser" && (
        <AddEditUserScreen
          user={editingUser}
          mode={editingUser ? "edit" : "add"}
          availableRoles={roles.map((r) => r.name)}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("userManagement")}
          onSave={(userData) => {
            if (editingUser) {
              // Edit existing user
              setUsers(
                users.map((u) =>
                  u.id === userData.id
                    ? { ...u, ...userData }
                    : u,
                ),
              );
            } else {
              // Add new user (send invite)
              setUsers([
                ...users,
                {
                  ...userData,
                  id: `user-${Date.now()}`,
                  status: "Pending",
                  invitedAt: new Date().toISOString(),
                },
              ]);
            }
            setEditingUser(null);
            setCurrentScreen("userManagement");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Providers List */}
      {currentScreen === "providersList" && (
        <ProvidersListScreen
          providers={providers}
          onNavigate={handleClinicAdminNavigate}
          onViewProvider={(id) => {
            setSelectedProviderId(id);
            setCurrentScreen("providerDetails");
          }}
          onAddProvider={() => setCurrentScreen("addProvider")}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add Provider */}
      {currentScreen === "addProvider" && (
        <AddProviderScreen
          availableBranches={branches}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("providersList")}
          onAddProvider={(newProvider) => {
            setProviders([...providers, newProvider]);
            setCurrentScreen("providersList");
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Provider Details */}
      {currentScreen === "providerDetails" &&
        selectedProviderId && (
          <ProviderDetailsScreen
            provider={
              providers.find(
                (p) => p.id === selectedProviderId,
              )!
            }
            appointments={appointments.filter(
              (a) => a.providerId === selectedProviderId,
            )}
            availableBranches={branches}
            onNavigate={handleClinicAdminNavigate}
            onBack={() => setCurrentScreen("providersList")}
            onUpdateProvider={(updatedProvider) => {
              setProviders(
                providers.map((p) =>
                  p.id === updatedProvider.id
                    ? updatedProvider
                    : p,
                ),
              );
            }}
            onSaveSchedule={(id, schedule) => {
              setProviders(
                providers.map((p) =>
                  p.id === id ? { ...p, schedule } : p,
                ),
              );
            }}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
          />
        )}

      {/* Provider Schedule */}
      {currentScreen === "providerSchedule" &&
        selectedProviderId && (
          <ProviderScheduleScreen
            provider={
              providers.find(
                (p) => p.id === selectedProviderId,
              )!
            }
            availableBranches={branches}
            onNavigate={handleClinicAdminNavigate}
            onBack={() => setCurrentScreen("providersList")}
            onSave={(id, schedule) => {
              // Extract unique branch IDs from the schedule
              const uniqueBranchIds = Array.from(
                new Set(
                  Object.values(schedule)
                    .filter(
                      (day) => day.isWorking && day.branchId,
                    )
                    .map((day) => day.branchId),
                ),
              );

              setProviders(
                providers.map((p) =>
                  p.id === id
                    ? {
                        ...p,
                        schedule,
                        branches: branches
                          .filter((b) =>
                            uniqueBranchIds.includes(b.id),
                          )
                          .map((b) => b.name),
                      }
                    : p,
                ),
              );
              setCurrentScreen("providersList");
            }}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
          />
        )}

      {/* Provider Calendar */}
      {currentScreen === "providerCalendar" &&
        selectedProviderId && (
          <ProviderCalendarScreen
            provider={
              providers.find(
                (p) => p.id === selectedProviderId,
              )!
            }
            appointments={appointments}
            onNavigate={handleClinicAdminNavigate}
            onBack={() => setCurrentScreen("providersList")}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
          />
        )}

      {/* Consent Forms List */}
      {currentScreen === "consentFormsList" && (
        <AgreementsListScreen
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add/Edit Consent Form */}
      {currentScreen === "addEditConsentForm" && (
        <AddEditConsentFormScreen
          form={editingConsentForm}
          onNavigate={handleClinicAdminNavigate}
          onSave={(formData) => {
            if (editingConsentForm) {
              handleEditConsentForm(formData);
            } else {
              handleAddConsentForm(formData);
            }
          }}
          onBack={() => setCurrentScreen("consentFormsList")}
          onPreview={handlePreviewConsentForm}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Patients List */}
      {currentScreen === "patientsList" && (
        <PatientsListScreen
          patients={patients}
          onNavigate={handleClinicAdminNavigate}
          onViewPatient={(patientId) => {
            setSelectedPatientId(patientId);
            setCurrentScreen("patientDetails");
          }}
          onAddPatient={() =>
            setCurrentScreen("addPatientSelection")
          }
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Patient Details */}
      {currentScreen === "patientDetails" &&
        selectedPatientId &&
        (() => {
          const patient = patients.find(
            (p) => p.id === selectedPatientId,
          );
          if (!patient) return null;

          // Transform appointments to match PatientDetailsScreen interface
          const transformedAppointments = patientAppointments
            .filter((a) => a.patientId === selectedPatientId)
            .map((apt) => ({
              id: apt.id,
              date: apt.date,
              time: apt.startTime,
              provider:
                apt.providerId === "user-1"
                  ? "Dr. Sarah Thompson"
                  : "Dr. Michael Chen",
              type: apt.type,
              clinic:
                apt.locationId === "branch-1"
                  ? "Downtown Clinic"
                  : apt.locationId === "branch-2"
                    ? "Westside Branch"
                    : "Eastside Clinic",
              status: apt.status,
              notes: apt.notes,
            }));

          return (
            <PatientDetailsScreen
              patient={patient}
              appointments={transformedAppointments}
              onNavigate={handleClinicAdminNavigate}
              onBack={() => setCurrentScreen("patientsList")}
              onUpdatePatient={(updatedPatient) => {
                setPatients(
                  patients.map((p) =>
                    p.id === updatedPatient.id
                      ? updatedPatient
                      : p,
                  ),
                );
              }}
              onRescheduleAppointment={handleRescheduleAppointment}
              onCancelAppointment={handleCancelAppointment}
              onNoShowAppointment={handleMarkNoShowAppointment}
              onLogout={() => {
                setCurrentEntity("patient");
                setCurrentScreen("login");
              }}
            />
          );
        })()}

      {/* Add Patient Selection */}
      {currentScreen === "addPatientSelection" && (
        <AddPatientSelectionScreen
          onBack={() => setCurrentScreen("patientsList")}
          onSelectManualAdd={() =>
            setCurrentScreen("addPatientFullPage")
          }
          onSelectGenerateLink={() =>
            setCurrentScreen("generateSignupLink")
          }
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Generate Signup Link */}
      {currentScreen === "generateSignupLink" && (
        <GenerateSignupLinkScreen
          onBack={() => setCurrentScreen("patientsList")}
          onGenerate={(
            email,
            firstName,
            lastName,
            city,
            state,
            country,
            notes,
          ) => {
            handleGenerateSignupLink(
              email,
              firstName,
              lastName,
              city,
              state,
              country,
              notes,
            );
            // Stay on this screen to show success state
          }}
          onNavigate={handleClinicAdminNavigate}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
        />
      )}

      {/* Add Patient Full Page */}
      {currentScreen === "addPatientFullPage" && (
        <AddPatientFullPageScreen
          questionnaires={questionnaires}
          consentForms={consentForms}
          onNavigate={handleClinicAdminNavigate}
          onBack={() => setCurrentScreen("patientsList")}
          onSavePatient={handleAddPatient}
          onGenerateLink={() => {
            setCurrentScreen("patientsList");
            setIsGenerateSignupLinkOpen(true);
          }}
          onLogout={() => {
            setCurrentEntity("patient");
            setCurrentScreen("login");
          }}
          services={services}
        />
      )}

      {/* Services List */}
      {currentScreen === "servicesList" && (
        <>
          <ServicesListScreenRedesigned
            services={services}
            locations={branches}
            providers={providers}
            rooms={rooms}
            questionnaires={questionnaires}
            onNavigate={handleClinicAdminNavigate}
            onAddService={() => {
              setEditingService(null);
              setIsAddEditServiceRedesignedOpen(true);
            }}
            onEditService={(serviceId) => {
              const service = services.find(
                (s) => s.id === serviceId,
              );
              setEditingService(service);
              setIsAddEditServiceRedesignedOpen(true);
            }}
            onDeleteService={(serviceId) => {
              if (
                confirm(
                  "Are you sure you want to delete this service?",
                )
              ) {
                setServices((prev) =>
                  prev.filter((s) => s.id !== serviceId),
                );
              }
            }}
            onLogout={() => {
              setCurrentEntity("patient");
              setCurrentScreen("login");
            }}
          />

          {/* Redesigned Service Drawer */}
          <AddEditServiceDrawerRedesigned
            isOpen={isAddEditServiceRedesignedOpen}
            service={editingService}
            locations={branches}
            providers={providers}
            rooms={rooms}
            questionnaires={questionnaires}
            onClose={() => {
              setIsAddEditServiceRedesignedOpen(false);
              setEditingService(null);
            }}
            onSave={(data) => {
              const now = new Date();
              if (editingService) {
                // Update existing
                setServices((prev) =>
                  prev.map((s) =>
                    s.id === editingService.id
                      ? {
                          ...s,
                          ...data,
                          updatedAt: now.toISOString(),
                        }
                      : s,
                  ),
                );
              } else {
                // Add new
                setServices((prev) => [
                  ...prev,
                  {
                    ...data,
                    id: `svc-${Date.now()}`,
                    createdAt: now.toISOString(),
                    updatedAt: now.toISOString(),
                  },
                ]);
              }
              setIsAddEditServiceRedesignedOpen(false);
              setEditingService(null);
            }}
          />
        </>
      )}

      {/* Add Patient Details Drawer - kept for potential future use */}
      <AddPatientDrawer
        isOpen={isAddPatientDrawerOpen}
        onClose={() => setIsAddPatientDrawerOpen(false)}
        availableConsentForms={consentForms}
        onSave={handleAddPatient}
      />
    </div>
  );
}

// ==================== INLINE SCREEN COMPONENTS ====================

function PatientProfileScreenInline({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyCountryCode, setEmergencyCountryCode] =
    useState("+1");
  const [emergencyContact, setEmergencyContact] = useState("");

  const isFormValid = dateOfBirth && gender;

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg w-full max-w-4xl my-8">
        {/* Brand Header */}
        <div className="px-5 pt-6 pb-4 text-center border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            SpineCloudIQ
          </h1>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            Patient Profile
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Please provide your demographic and contact
            information
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isFormValid) onContinue();
          }}
        >
          <div className="p-5 space-y-6">
            {/* Demographics */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                Demographics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dob"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Date of birth{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) =>
                      setDateOfBirth(e.target.value)
                    }
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Gender{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address (Optional) */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                Address{" "}
                <span className="text-sm font-normal text-neutral-500">
                  (Optional)
                </span>
              </h4>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="street"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Street address
                  </label>
                  <input
                    id="street"
                    type="text"
                    placeholder="123 Main Street, Apt 4B"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    >
                      <option value="">Select state</option>
                      {usStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="zip"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Zip code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="10001"
                      value={zipCode}
                      onChange={(e) =>
                        setZipCode(e.target.value)
                      }
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) =>
                        setCountry(e.target.value)
                      }
                      className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact (Optional) */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 tracking-wide mb-3">
                Emergency contact{" "}
                <span className="text-sm font-normal text-neutral-500">
                  (Optional)
                </span>
              </h4>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="emergencyName"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Emergency contact name
                  </label>
                  <input
                    id="emergencyName"
                    type="text"
                    placeholder="John Doe"
                    value={emergencyName}
                    onChange={(e) =>
                      setEmergencyName(e.target.value)
                    }
                    className="flex h-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emergencyContact"
                    className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5"
                  >
                    Emergency contact number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={emergencyCountryCode}
                      onChange={(e) =>
                        setEmergencyCountryCode(e.target.value)
                      }
                      className="flex h-10 w-28 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    >
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+61">+61 (AU)</option>
                      <option value="+91">+91 (IN)</option>
                    </select>
                    <input
                      id="emergencyContact"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={emergencyContact}
                      onChange={(e) =>
                        setEmergencyContact(e.target.value)
                      }
                      className="flex h-10 flex-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full h-10 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuestionnaireCategoryScreenInline({
  onSelectCategory,
  onContinueToAppointment,
  completedCategories,
}: {
  onSelectCategory: (id: string) => void;
  onContinueToAppointment: () => void;
  completedCategories: string[];
}) {
  const categories = [
    { id: "neck-shoulder", name: "Neck / Shoulder" },
    { id: "lower-back", name: "Lower Back" },
    { id: "upper-extremity", name: "Upper Extremity" },
    { id: "posture-wellness", name: "Posture / Wellness" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm w-full max-w-3xl my-8">
        <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
            Questionnaire Categories
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Select areas of concern to complete questionnaires
          </p>
        </div>
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="relative border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 dark:text-white">
                      {category.name}
                    </h4>
                    {completedCategories.includes(
                      category.id,
                    ) && (
                      <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                        Completed
                      </p>
                    )}
                  </div>
                  {completedCategories.includes(
                    category.id,
                  ) && (
                    <div className="flex items-center justify-center size-6 rounded-full bg-success-500 text-white shrink-0">
                      <Check className="size-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={onContinueToAppointment}
              disabled={completedCategories.length === 0}
              className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardScreenInline() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm w-full max-w-2xl my-8">
        <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-full bg-success-100 dark:bg-success-950/30 text-success-600 dark:text-success-400">
              <Check className="size-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
                Welcome to Your Dashboard
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                You have successfully completed the patient
                onboarding process
              </p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-6">
            <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
              Next Steps
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Review your profile information</li>
              <li>Schedule your first appointment</li>
              <li>Complete any remaining questionnaires</li>
              <li>Explore available resources and services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}