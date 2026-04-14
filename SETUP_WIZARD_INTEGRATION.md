# Setup Wizard Integration Guide

## Overview
This guide explains how to integrate the Initial Setup Wizard into the clinic admin flow. The wizard guides new clinic admins through essential configuration after subscription purchase.

## Components Created

### Main Wizard Component
- `/src/app/components/clinic-admin/setup-wizard/SetupWizard.tsx`
  - Orchestrates the entire wizard flow
  - Manages state across all steps
  - Handles navigation between steps
  - Saves/resumes progress

### Step Components
1. `/src/app/components/clinic-admin/setup-wizard/steps/OrganizationBasicsStep.tsx`
   - Organization name, timezone, communication sender name
   
2. `/src/app/components/clinic-admin/setup-wizard/steps/CreateLocationStep.tsx`
   - First clinic location with address, hours, booking settings
   - Reuses branch form logic
   
3. `/src/app/components/clinic-admin/setup-wizard/steps/CreateProviderStep.tsx`
   - First healthcare provider with schedule
   - Reuses provider form logic
   
4. `/src/app/components/clinic-admin/setup-wizard/steps/BookingPreferencesStep.tsx`
   - Org-level booking rules and preferences
   
5. `/src/app/components/clinic-admin/setup-wizard/steps/IntakeDefaultsStep.tsx`
   - Optional questionnaire and consent preferences
   
6. `/src/app/components/clinic-admin/setup-wizard/steps/InviteStaffStep.tsx`
   - Optional bulk staff invitations
   
7. `/src/app/components/clinic-admin/setup-wizard/steps/SetupCompleteStep.tsx`
   - Success screen with summary

### Additional Components
- `/src/app/components/clinic-admin/SetupIncompleteBanner.tsx`
  - Banner shown when setup is incomplete
  - Allows resuming the wizard

## Integration Steps

### 1. Update App.tsx - Add Screen Types

```typescript
type Screen =
  // ... existing screens ...
  | "setupWizard"
  | "subscriptionManagement";
```

### 2. Update App.tsx - Add State

```typescript
// Add to existing state
const [setupComplete, setSetupComplete] = useState(false);
const [wizardData, setWizardData] = useState<any>(null);

// Load wizard progress on mount
useEffect(() => {
  const savedProgress = localStorage.getItem("setupWizardProgress");
  if (savedProgress) {
    const { currentStep, wizardData } = JSON.parse(savedProgress);
    setWizardData(wizardData);
    setSetupComplete(false);
  } else {
    // Check if setup was completed before
    const isSetupComplete = localStorage.getItem("setupComplete") === "true";
    setSetupComplete(isSetupComplete);
  }
}, []);
```

### 3. Update Subscription Success Handler

```typescript
const handleSubscriptionSuccess = () => {
  // After subscription is purchased, go to setup wizard
  setCurrentScreen("setupWizard");
};
```

### 4. Add Setup Wizard Handler

```typescript
const handleSetupWizardComplete = (data: any) => {
  setWizardData(data);
  setSetupComplete(true);
  localStorage.setItem("setupComplete", "true");
  localStorage.removeItem("setupWizardProgress");
  
  // Save the configuration data (location, provider, etc.)
  // This would typically save to your backend
  console.log("Setup data:", data);
  
  // Navigate to clinic admin dashboard
  setCurrentScreen("clinicAdminDashboard");
};

const handleResumeSetup = () => {
  setCurrentScreen("setupWizard");
};
```

### 5. Add Wizard to Routing

```typescript
// In the render section of App.tsx

{currentScreen === "setupWizard" && (
  <SetupWizard
    onComplete={handleSetupWizardComplete}
    onLogout={handleLogout}
    existingData={wizardData}
  />
)}
```

### 6. Update Subscription Success Screen

In `SubscriptionSuccessScreen.tsx`, instead of navigating to dashboard directly, navigate to setup wizard:

```typescript
// Change from:
onContinueToDashboard={() => setCurrentScreen("clinicAdminDashboard")}

// To:
onContinueToDashboard={() => setCurrentScreen("setupWizard")}
```

### 7. Add Incomplete Setup Banner to Dashboard

In `ClinicAdminDashboardScreen.tsx` or wrap it in App.tsx:

```typescript
{currentScreen === "clinicAdminDashboard" && (
  <>
    {!setupComplete && (
      <SetupIncompleteBanner onResumeSetup={handleResumeSetup} />
    )}
    <ClinicAdminDashboardScreen
      // ... existing props ...
    />
  </>
)}
```

### 8. Add Subscription Management to Sidebar

Update `ClinicAdminSidebar.tsx` to include subscription link:

```typescript
// Add to navigation items
{
  icon: CreditCard,
  label: "Subscription",
  menu: "subscription",
  active: currentScreen === "subscriptionManagement",
}

// Add click handler
onNavigate={(menu) => {
  if (menu === "subscription") {
    setCurrentScreen("subscriptionManagement");
  }
  // ... other navigation logic ...
}}
```

### 9. Add Subscription Management Screen to Routing

```typescript
{currentScreen === "subscriptionManagement" && (
  <SubscriptionManagementScreen
    onUpgrade={() => setCurrentScreen("subscriptionSelection")}
    onCancel={() => {
      // Handle subscription cancellation
      console.log("Subscription cancelled");
    }}
  />
)}
```

## Data Flow

### Wizard Data Structure

```typescript
interface WizardData {
  // Step 1
  organizationName: string;
  defaultTimezone: string;
  senderName: string;

  // Step 2
  location: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    timezone: string;
    workingHours: any;
    selfBookingEnabled: boolean;
    cancellationWindow: number;
    rescheduleWindow: number;
  } | null;

  // Step 3
  provider: {
    firstName: string;
    lastName: string;
    email: string;
    specialty: string;
    assignedLocations: string[];
    workingHours: any;
    selfBookable: boolean;
  } | null;

  // Step 4
  bookingPreferences: {
    allowSelfBooking: boolean;
    minNoticeHours: number;
    maxFutureDays: number;
    allowPatientCancel: boolean;
    allowPatientReschedule: boolean;
    allowStaffOverrides: boolean;
  };

  // Step 5
  intakeDefaults: {
    enableIntakeWizard: boolean;
    enableConsents: boolean;
    complaintTemplates: string[];
    consentForms: string[];
  };

  // Step 6
  staff: Array<{
    email: string;
    role: string;
    locations: string[];
  }>;
}
```

### Progress Persistence

The wizard automatically saves progress to localStorage on "Save & Exit":
- Key: `setupWizardProgress`
- Contains: `{ currentStep, wizardData }`

On completion:
- Removes: `setupWizardProgress`
- Sets: `setupComplete = "true"`

## User Flow

### New Clinic Admin Flow

1. **Sign Up** → Subscription Selection
2. **Select Plan** → Organization Details (with blue side panel)
3. **Enter Details** → OTP Verification
4. **Verify Email** → Checkout & Payment
5. **Complete Payment** → **Setup Wizard Step 1**
6. **Complete Wizard (6 steps)** → Dashboard
7. **Dashboard** → All modules available

### Resuming Incomplete Setup

1. User logs in
2. System detects incomplete setup (localStorage check)
3. **Setup Incomplete Banner** appears at top of dashboard
4. User clicks "Resume setup"
5. Wizard opens at last saved step
6. User completes remaining steps
7. Banner disappears when complete

### Skipping Optional Steps

Steps 5 (Intake Defaults) and 6 (Invite Staff) can be skipped:
- User clicks "Skip for now"
- Wizard proceeds to next step
- Configuration can be completed later in respective modules

## Benefits of This Approach

### Reuses Existing Components
- Location step uses branch form logic
- Provider step uses provider form logic
- No code duplication

### Cohesive Experience
- Progressive disclosure of complexity
- Guided onboarding prevents overwhelming users
- Clear progress indicators

### Flexible
- Users can save and resume anytime
- Optional steps for advanced configuration
- Can be re-entered from dashboard if incomplete

### Well-Connected
- Wizard data can populate existing modules
- Seamless transition to full admin dashboard
- Setup status tracked and visible

## Backend Integration Points

When implementing with a real backend:

1. **Save Organization Settings** (Step 1)
   - POST `/api/organization/settings`

2. **Create Location** (Step 2)
   - POST `/api/locations`

3. **Create Provider** (Step 3)
   - POST `/api/providers`
   - Send invitation email

4. **Update Booking Preferences** (Step 4)
   - PUT `/api/organization/booking-preferences`

5. **Configure Intake** (Step 5)
   - PUT `/api/organization/intake-settings`

6. **Invite Staff** (Step 6)
   - POST `/api/users/bulk-invite`
   - Send invitation emails

7. **Mark Setup Complete**
   - PUT `/api/organization/setup-complete`

## Testing Checklist

- [ ] New signup flow leads to wizard after payment
- [ ] All 6 steps validate correctly
- [ ] Save & Exit preserves progress in localStorage
- [ ] Resume Setup loads from localStorage
- [ ] Skipping optional steps works
- [ ] Setup completion removes banner
- [ ] Wizard data saves to backend (when implemented)
- [ ] Provider and staff invitation emails sent
- [ ] Dashboard shows created location and provider
- [ ] Subscription management screen accessible

## Next Steps

1. Integrate wizard into App.tsx routing
2. Connect wizard completion to data persistence
3. Add backend API calls for each step
4. Test complete onboarding flow
5. Add analytics tracking for wizard completion rates
6. Consider adding tooltips/help text for complex fields

## Notes

- The wizard is fully responsive and supports dark mode
- All form validation follows the existing design guidelines
- Typography and spacing match the existing design system
- The wizard can be extended with additional steps if needed
- Consider adding a "Skip wizard" option for experienced admins
