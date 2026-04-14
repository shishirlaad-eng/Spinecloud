# Patient Authentication Flow – Implementation Documentation

This document defines the implemented authentication screens, behaviors, validations, and flow for the SpineCloudIQ Patient Portal.

---

## Implementation Overview

The authentication system consists of five main screens with proper navigation flow, branding, and validation:

1. **Signup Screen** - Account creation with email verification
2. **OTP & Password Screen** - Combined OTP verification and password setup (context-aware for signup/forgot password)
3. **Login Screen** - User authentication entry point
4. **Forgot Password Screen** - Password reset initiation
5. **Navigation Flow** - Complete back navigation and breadcrumbs

---

## Design System Integration

### Branding Placement
- **SpineCloudIQ logo** appears **outside and above** all card containers
- Logo styling: `text-3xl font-semibold` with blue accent underline
- Consistent across all authentication screens

### Typography Standards
- **Page Titles (H2)**: Sentence case, centered - "Create account", "Login", "Forgot password"
- **Descriptions**: Sentence case, centered - "Fill in your details to get started"
- **Form Labels**: Sentence case - "First name", "Email address", "Password"
- **Buttons**: Sentence case - "Continue", "Login", "Send reset code"
- **Error Messages**: Sentence case

### Navigation Pattern
- Back buttons with arrow icons and hover animations
- Context-aware navigation (e.g., OTP screen knows to return to signup or forgot password)
- No back button on Login screen (primary entry point)

---

## 1. Signup Screen

### Screen Purpose
Allow a new patient to initiate account creation using basic identity details.

### Implementation Details
**Component**: `/src/app/components/auth/SignupScreen.tsx`

**Layout**:
- Logo outside card at top
- Card with header section (title + description)
- Form fields in card body
- Footer links at bottom

### Fields

**First Name**
- Label: First name *
- Placeholder: Enter first name
- Field Type: Text input
- Mandatory: Yes
- Validation: On blur - "This field is required"

**Last Name**
- Label: Last name *
- Placeholder: Enter last name
- Field Type: Text input
- Mandatory: Yes
- Validation: On blur - "This field is required"

**Email Address**
- Label: Email address *
- Placeholder: Enter email address
- Field Type: Email input
- Mandatory: Yes
- Validation: On blur
  - Empty: "This field is required"
  - Invalid format: "Enter a valid email address"

**Mobile Number** (Optional)
- Label: Mobile number
- Country code dropdown + phone input
- Field Type: Tel input with country code selector
- Mandatory: No
- Supported country codes: US (+1), UK (+44), IN (+91), CN (+86), JP (+81), DE (+49), FR (+33), AU (+61), BR (+55), RU (+7)

### Button States
- **"Continue" button**:
  - Disabled by default
  - Enabled when: firstName && lastName && validEmail && no errors
  - Styling: Primary button (bg-primary-600, h-9, rounded-lg)

### Navigation
- **"Already have an account? Login"** link at bottom
  - Navigates to Login screen

### Flow
On successful submission:
1. Store email in state
2. Set context to "signup"
3. Navigate to OTP & Password Screen

---

## 2. OTP & Password Screen (Combined)

### Screen Purpose
Verify email with OTP and set password in one unified screen.
**Context-aware**: Used for both signup and forgot password flows.

### Implementation Details
**Component**: `/src/app/components/auth/OTPPasswordScreen.tsx`

**Layout**:
- Logo outside card at top
- Back button (context-aware)
- Card with dynamic header based on context
- Three-step form: OTP → New Password → Confirm Password
- Resend OTP with countdown timer

### Fields

**Verification Code (OTP)**
- Label: Verification code *
- Placeholder: Enter 6-digit code
- Field Type: Text input
- Mandatory: Yes
- Validation: On blur
  - Empty: "This field is required"
  - Invalid: "Invalid verification code"
- **Dummy OTP for testing**: `123456`

**New Password**
- Label: New password *
- Placeholder: Enter new password
- Field Type: Password input
- Mandatory: Yes
- Validation: On blur
  - Empty: "This field is required"
  - Weak: "Password must be at least 8 characters"

**Confirm Password**
- Label: Confirm password *
- Placeholder: Re-enter new password
- Field Type: Password input
- Mandatory: Yes
- Validation: On blur
  - Empty: "This field is required"
  - Mismatch: "Passwords do not match"

### Resend OTP Feature
- Button labeled "Resend code"
- Disabled during 30-second countdown
- Shows countdown timer: "Resend code in 30s", "Resend code in 29s", etc.
- Re-enabled after countdown completes

### Button States
- **"Set password" button**:
  - Disabled by default
  - Enabled when: OTP valid && passwords match && all fields filled
  - Styling: Primary button

### Navigation
- **Back button** (context-aware):
  - If context = "signup": Returns to Signup screen
  - If context = "forgotPassword": Returns to Forgot Password screen
- **"Back to Login"** link at bottom

### Context-Aware Behavior

**Signup Context**:
- Header: "Verify email & set password"
- Description: "Enter the OTP sent to {email} and create your password"
- Success message: "Account created successfully. Please log in."
- Navigates to: Login screen

**Forgot Password Context**:
- Header: "Reset password"
- Description: "Enter the OTP sent to {email} and create a new password"
- Success message: "Password reset successfully. Please log in."
- Navigates to: Login screen

---

## 3. Login Screen

### Screen Purpose
Authenticate existing patients and provide access to the patient portal.

### Implementation Details
**Component**: `/src/app/components/auth/LoginScreen.tsx`

**Layout**:
- Logo outside card at top
- Card with header section
- Form fields
- Links at bottom
- **No back button** (primary entry point)

### Fields

**Email**
- Label: Email *
- Placeholder: Enter email
- Field Type: Email input
- Mandatory: Yes

**Password**
- Label: Password *
- Placeholder: Enter password
- Field Type: Password input
- Mandatory: Yes

### Success Message Display
- If navigated from OTP screen after successful password setup
- Green success banner displays above form
- Messages:
  - "Account created successfully. Please log in." (signup flow)
  - "Password reset successfully. Please log in." (forgot password flow)

### Error Handling
- Invalid credentials: "Invalid email or password"
- Error displayed above form fields in red

### Button States
- **"Login" button**:
  - Disabled by default
  - Enabled when: email && password (both filled)
  - Styling: Primary button

### Navigation
- **"Forgot password?"** link below password field
  - Navigates to Forgot Password screen
- **"Don't have an account? Sign up"** link at bottom
  - Navigates to Signup screen

### Authentication Logic
**Dummy Credentials for Testing**:
- Email: `patient@test.com`
- Password: `Test@123`

**Flow on Success**:
- If new signup: Navigate to Patient Profile screen
- If returning user: Navigate to Dashboard with mock appointments

---

## 4. Forgot Password Screen

### Screen Purpose
Initiate password reset by sending OTP to registered email.

### Implementation Details
**Component**: `/src/app/components/auth/ForgotPasswordScreen.tsx`

**Layout**:
- Logo outside card at top
- Back button to Login
- Card with header section
- Single email field
- Submit button

### Fields

**Email**
- Label: Email *
- Placeholder: Enter your registered email
- Field Type: Email input
- Mandatory: Yes
- Validation: On blur
  - Empty: "This field is required"
  - Invalid format: "Enter a valid email address"

### Button States
- **"Send reset code" button**:
  - Disabled by default
  - Enabled when: valid email && no errors
  - Styling: Primary button

### Navigation
- **Back button** at top
  - Label: "Back to Login"
  - Navigates to Login screen

### Flow
On successful submission:
1. Store email in state
2. Set context to "forgotPassword"
3. Navigate to OTP & Password Screen

---

## Navigation Flow Diagram

```
Signup
  ↓ [Create account]
OTP & Password (signup context)
  ↓ [Set password]
Login ← Success message
  ↓ [Login with credentials]
Patient Profile (new users) / Dashboard (returning users)

Alternative flows:
Login → [Forgot password?] → Forgot Password
  ↓ [Send reset code]
OTP & Password (forgotPassword context)
  ↓ [Set password]
Login ← Success message

Any auth screen ← [Back navigation] → Previous screen
```

---

## Validation Strategy

### On-Blur Validation
- Individual field validation triggers when user leaves field
- Real-time feedback for immediate correction
- Error messages display below each field

### Submit Button Enablement
- Button disabled until all required fields are valid
- Prevents submission of incomplete/invalid forms

### Error Display
- Inline errors below each field
- Text style: `text-xs text-destructive`
- Clear, actionable error messages

---

## Dummy Data (Development/Testing Only)

### OTP
- **Value**: `123456`
- **Usage**: Accepted on Email Verification and Password Reset
- **Implementation**: Hardcoded in OTPPasswordScreen component

### Login Credentials
- **Email**: `patient@test.com`
- **Password**: `Test@123`
- **Behavior**:
  - New signup flow: Navigates to Patient Profile
  - Direct login: Navigates to Dashboard with mock appointments

### Important Notes
- Dummy values never auto-fill
- Used for prototyping and QA only
- Should be replaced with real authentication in production

---

## Component Files

- `/src/app/components/auth/SignupScreen.tsx`
- `/src/app/components/auth/OTPPasswordScreen.tsx`
- `/src/app/components/auth/LoginScreen.tsx`
- `/src/app/components/auth/ForgotPasswordScreen.tsx`
- `/src/app/App.tsx` - Main routing and state management

---