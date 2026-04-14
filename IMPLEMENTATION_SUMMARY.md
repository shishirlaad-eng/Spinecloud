# Insurance & Consent Implementation Summary

## New Files Created

### 1. Insurance Details Screen
**Location**: `/src/app/components/profile/InsuranceDetailsScreen.tsx`

**Purpose**: Collect insurance information during onboarding and from profile

**Fields Collected**:
1. Insurance Provider Name (required)
2. Plan / Network Name (optional)
3. Policy / Member ID Number (required)
4. Group Number (optional)
5. Name of Policyholder (required)
6. Policyholder Date of Birth (required)
7. Relationship to Policyholder - Self/Spouse/Child (required)
8. Insurance Card – Front Image (upload)
9. Insurance Card – Back Image (upload)

**Features**:
- Can skip during onboarding ("Skip for now" button)
- File upload with preview
- 10MB file size limit
- Form validation
- Accessible from profile for updates

---

### 2. Consent Signature Screen
**Location**: `/src/app/components/consent/ConsentSignatureScreen.tsx`

**Purpose**: Collect consent and digital signature during appointment booking

**Four Consent Documents**:
1. Terms and Conditions
2. Privacy Policy
3. HIPAA Authorization
4. Consent to Treat

**Digital Signature Features**:
- **Draw Signature**: Canvas-based drawing with clear button
- **Type Name**: Text input with preview in serif italic font
- All 4 consents must be checked
- Signature stored with timestamp
- Cannot submit without all consents + signature

---

### 3. Profile Screen with Tabs
**Location**: `/src/app/components/profile/MyProfileScreenWithTabs.tsx`

**Purpose**: View and manage all profile information in one place

**Three Tabs**:
1. **Basic Information**: 
   - Account info (read-only)
   - Demographics
   - Address
   - Emergency contact

2. **Insurance**: 
   - View insurance details
   - Edit button to update
   - Shows "No insurance" if not added

3. **Consent Forms**: 
   - List of all signed consents
   - Date signed
   - Signature preview
   - Document type

---

## Integration Points

### During Onboarding (New User Flow):
```
Signup → Email Verification → Login
  ↓
Patient Profile (Basic Details)
  ↓
Insurance Details Screen ← NEW (Can skip)
  ↓
Questionnaire Categories → Multi-step Questionnaire
  ↓
Clinic Selection → Provider Selection
  ↓
Appointment Booking Screen
  ↓
Consent & Signature Screen ← NEW (Required)
  ↓
Appointment Confirmation → Dashboard
```

### From Dashboard Profile:
```
Dashboard → My Profile (with tabs)
  ├── Basic Information Tab (editable)
  ├── Insurance Tab (view/edit via button)
  └── Consent Forms Tab (view signed documents)
```

---

## How to Use These Components

### 1. Add Insurance Screen to App Flow

In your `App.tsx`, add a new screen state and navigation:

```typescript
// Add to screen state
const [currentScreen, setCurrentScreen] = useState<"signup" | "login" | "profile" | "insurance" | ...>("signup");

// Add navigation handler
const handleProfileComplete = () => {
  setCurrentScreen("insurance");
};

const handleInsuranceComplete = (data) => {
  // Store insurance data
  setInsuranceData(data);
  setCurrentScreen("questionnaireCategories");
};

const handleInsuranceSkip = () => {
  setCurrentScreen("questionnaireCategories");
};

// In render:
{currentScreen === "insurance" && (
  <InsuranceDetailsScreen
    onBack={() => setCurrentScreen("profile")}
    onContinue={handleInsuranceComplete}
    onSkip={handleInsuranceSkip}
  />
)}
```

### 2. Add Consent Screen Before Appointment Confirmation

```typescript
// After appointment booking
const handleAppointmentBooked = (appointmentData) => {
  setAppointmentData(appointmentData);
  setCurrentScreen("consent");
};

const handleConsentComplete = (signatureData) => {
  // Store consent with signature
  setConsentData(signatureData);
  setCurrentScreen("appointmentConfirmation");
};

// In render:
{currentScreen === "consent" && (
  <ConsentSignatureScreen
    onBack={() => setCurrentScreen("appointmentBooking")}
    onComplete={handleConsentComplete}
  />
)}
```

### 3. Use Tabbed Profile Screen

Replace the existing `MyProfileScreen` import with:

```typescript
import { MyProfileScreenWithTabs } from "@/app/components/profile/MyProfileScreenWithTabs";

// Use it in render:
{currentScreen === "myProfile" && (
  <MyProfileScreenWithTabs
    onNavigate={handleNavigation}
    onBack={() => setCurrentScreen("dashboard")}
    onLogout={handleLogout}
    onNavigateToInsurance={() => setCurrentScreen("insurance")}
  />
)}
```

---

## File Upload Handling

The insurance card images are stored as `File` objects. To handle these properly:

```typescript
const [insuranceCardFront, setInsuranceCardFront] = useState<File | null>(null);
const [insuranceCardBack, setInsuranceCardBack] = useState<File | null>(null);

// When insurance data is submitted:
const handleInsuranceComplete = (data) => {
  // Convert File to base64 or FormData for API upload
  if (data.insuranceCardFront) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      // Store or send to API
    };
    reader.readAsDataURL(data.insuranceCardFront);
  }
};
```

---

## Data Storage Structure

### Insurance Data:
```typescript
interface InsuranceData {
  insuranceProvider: string;
  planNetworkName?: string;
  policyNumber: string;
  groupNumber?: string;
  policyHolderName: string;
  policyHolderDOB: string;
  relationshipToPolicyholder: "self" | "spouse" | "child";
  insuranceCardFront?: File | null;
  insuranceCardBack?: File | null;
}
```

### Consent Signature Data:
```typescript
interface ConsentSignatureData {
  type: "draw" | "type";
  data: string; // Base64 image for draw, or typed name
  timestamp: string; // ISO date string
  consentAccepted: {
    terms: boolean;
    privacy: boolean;
    hipaa: boolean;
    consentToTreat: boolean;
  };
}
```

---

## Typography Consistency

All components follow the platform typography standards:
- ✅ All text uses `text-sm` (16px) except error messages
- ✅ Error messages use `text-xs` (12px)
- ✅ Sentence case for all labels and headers
- ✅ Consistent spacing and layout

---

## Next Steps

1. **Import the components** in your `App.tsx`
2. **Add navigation logic** for the insurance screen after profile
3. **Add consent screen** before appointment confirmation
4. **Replace MyProfileScreen** with `MyProfileScreenWithTabs`
5. **Test the complete flow** from signup to appointment booking

All files are ready to use and follow your design system!
