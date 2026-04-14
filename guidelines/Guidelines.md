**Add your own guidelines here**

# Patient Flow Application - Design Guidelines

## Overview

This document defines the complete design system for the SpineCloudIQ Patient Portal, including branding, typography, colors, component specifications, navigation patterns, and accessibility standards.

---

## Branding & Layout

### SpineCloudIQ Logo Placement
- **Logo Position**: Outside and above card containers
- **Typography**: text-3xl font-semibold text-neutral-900
- **Accent**: 16px width (w-16), 4px height (h-1), blue underline (bg-primary-600), centered, rounded-full
- **Applied to**: All authentication screens, booking screens, and profile collection screens

### Layout Structure
**Authentication & Booking Screens**:
- Logo outside card at top
- Centered card with max-width constraint
- Card contains: Header with back button (optional) → Title/Description → Content → Footer

**Dashboard Screens**:
- DashboardLayout component with persistent header and sidebar
- Header: Logo, navigation, profile menu
- Sidebar: Dashboard, Appointments, My Profile
- Main content area: Responsive grid layout

---

## Color System

### Primary Colors - Subtle Blue
- **Primary-500 (#3B82F6)**: Main brand color for buttons, links, and primary actions
- **Primary-600 (#2563EB)**: Hover states, emphasis, logo accent
- **Primary-700 (#1D4ED8)**: Active/pressed states
- **Primary-50 (#EFF6FF)**: Light backgrounds, hover states
- **Primary-100 (#DBEAFE)**: Subtle backgrounds
- **Use for**: Primary buttons, active states, links, focus indicators, brand elements

### Success Colors - Soft Green
- **Success-500 (#10B981)**: Success messages, completed states
- **Success-600 (#059669)**: Success hover states
- **Success-700 (#047857)**: Success emphasis
- **Success-50 (#ECFDF5)**: Success backgrounds
- **Success-100 (#D1FAE5)**: Light success backgrounds
- **Use for**: Success messages, checkmarks, positive indicators, confirmation badges

### Neutral Colors - Warm Gray
- **Neutral-50 (#FAFAFA)**: Page backgrounds, input backgrounds
- **Neutral-100 (#F5F5F5)**: Card backgrounds, muted sections
- **Neutral-200 (#E5E5E5)**: Borders, dividers
- **Neutral-400 (#A3A3A3)**: Placeholder text, disabled text
- **Neutral-600 (#525252)**: Body text, labels, icons
- **Neutral-700 (#404040)**: Emphasis text, form labels
- **Neutral-900 (#171717)**: Headings, important text
- **Use for**: Text, backgrounds, borders, subtle elements

### Destructive Colors - Red
- **Destructive (#EF4444)**: Error states, delete actions
- **Destructive-50 (#FEF2F2)**: Error backgrounds
- **Use for**: Error messages, delete buttons, critical warnings, cancel actions

---

## Typography Standards

### Case Conventions (CRITICAL)
All text must follow these exact capitalization rules:

**Sentence case** (First word capitalized):
- Page titles (H2): "Create account", "Login", "Select clinic", "Book appointment"
- Descriptions: "Fill in your details to get started"
- Form labels: "First name", "Email address", "Password", "Appointment type"
- Form section headers: "Demographics", "Address", "Emergency contact"
- Button text: "Continue", "Login", "Send reset code", "Confirm appointment"
- Error messages: "This field is required", "Invalid email address"
- Placeholder text: "Enter first name", "Select appointment type"
- Helper text: All helper and instructional text

**Title Case** (Each Word Capitalized):
- Status badges only: "Confirmed", "Cancelled", "Pending"
- Category names: "Neck / Shoulder", "Lower Back"

**Brand Name** (Proper Case):
- Always: "SpineCloudIQ" (never "Spine Cloud IQ" or "spinecloudiq")

### Font Sizes & Weights
- **Logo (H1)**: text-3xl (30px), font-semibold (600)
- **Page Titles (H2)**: text-xl (20px), font-semibold (600), centered
- **Section Headers (H4)**: text-sm (14px), font-semibold (600), sentence case, tracking-wide
- **Body Text**: text-sm (14px), font-normal (400)
- **Form Labels**: text-sm (14px), font-medium (500)
- **Descriptions**: text-sm (14px), font-normal (400)
- **Error Messages**: text-xs (12px), font-normal (400)
- **Button Text**: text-sm (14px), font-medium (500)

### Typography Hierarchy
```
H1 (Logo): SpineCloudIQ - text-3xl font-semibold
H2 (Page Title): Create account - text-xl font-semibold text-center
H4 (Section): DEMOGRAPHICS - text-sm font-semibold uppercase tracking-wide
Label: First name - text-sm font-medium text-neutral-700
Body: Description text - text-sm text-neutral-600
Error: This field is required - text-xs text-destructive
```

### Form Fields Typography
- **Labels**: text-sm (14px), text-neutral-700, font-medium, mb-1.5 (6px spacing below)
- **Inputs**: text-sm (14px), text-neutral-900, placeholder:text-neutral-400
- **Error Messages**: text-xs (12px), text-destructive, mt-1 (4px spacing above)
- **Helper Text**: text-sm (14px), text-neutral-500
- **Section Headers**: text-sm (14px), font-semibold, tracking-wide, sentence case
- **All Other Text**: text-sm (14px) - This includes descriptions, body text, badges (non-error), info text, etc.

**CRITICAL RULE**: Everything on the platform uses text-sm (14px) EXCEPT error messages which use text-xs (12px).

This is the foundation of the entire typography system. No exceptions.

### Complete Typography Specification
```
✓ Form Section Headers: text-sm (14px) font-semibold tracking-wide
✓ Form Labels: text-sm (14px) font-medium
✓ Body/Description Text: text-sm (14px)
✓ Input Fields: text-sm (14px)
✓ Helper Text: text-sm (14px)
✓ Info Text: text-sm (14px)
✓ Badges: text-sm (14px)
✓ Status Indicators: text-sm (14px)
✓ Descriptive Labels: text-sm (14px)
✓ Button Text (ALL buttons): text-sm (14px) font-medium
✓ Success/Warning Messages: text-sm (14px)
✓ Demo Credentials: text-sm (14px)
✓ Link Text: text-sm (14px)
✓ Dropdown Text: text-sm (14px)
✓ Notification Text: text-sm (14px)
✓ ALL Text Elements: text-sm (14px)
✗ Error Messages ONLY: text-xs (12px) - THE ONLY EXCEPTION
```

---

## Component Specifications

### Buttons

**Primary Buttons**:
- Background: bg-primary-600
- Hover: hover:bg-primary-700
- Active: active:bg-primary-800
- Text: text-white
- Height: h-10 (40px) for main actions, h-9 (36px) for inline actions
- Padding: px-4 or px-6
- Border Radius: rounded-lg
- Font: font-medium
- Transition: transition-colors
- Disabled: opacity-50, cursor-not-allowed, pointer-events-none

**Secondary Buttons**:
- Border: border border-neutral-300
- Hover: hover:bg-neutral-50
- Text: text-neutral-700
- Height: h-10 (40px)
- Padding: px-4 or px-6
- Border Radius: rounded-lg
- Font: font-medium

**Back Buttons**:
- Display: inline-flex items-center gap-2
- Icon: ArrowLeft (w-4 h-4)
- Text: text-sm text-neutral-600
- Hover: hover:text-neutral-900
- Icon Animation: group-hover:-translate-x-1
- Transition: transition-colors and transition-transform

**Disabled State** (All Buttons):
- Opacity: opacity-50
- Cursor: cursor-not-allowed
- Pointer Events: pointer-events-none

### Cards

**Container**:
- Background: bg-white
- Border: border border-neutral-200
- Border Radius: rounded-xl (12px)
- Shadow: shadow-sm (subtle) or none for flat design
- Padding: px-6 py-6 (24px all sides)

**Card Header** (Optional):
- Border Bottom: border-b border-neutral-200
- Padding: px-6 pt-6 pb-4 (top padding 24px, bottom 16px)
- Contains: Title (H2) and Description

**Card Body**:
- Padding: px-6 py-6
- Sections separated by: gap-6 (24px)
- Fields separated by: gap-4 (16px)

**Card Footer** (Optional):
- Border Top: border-t border-neutral-200
- Padding: px-6 pt-4 pb-6
- Alignment: Usually flex justify-end or justify-between

### Forms

**Input Fields**:
- Height: h-10 (40px) - standardized across ALL inputs
- Padding: px-3 py-1
- Background: bg-neutral-50
- Border: border border-neutral-200
- Border Radius: rounded-lg
- Text: text-sm text-neutral-900
- Placeholder: placeholder:text-neutral-400
- Focus: focus:border-primary-600, focus:ring-2, focus:ring-primary-500/10
- Error: aria-invalid:border-destructive
- Transition: transition-[border-color,box-shadow]
- Outline: outline-none (remove default)

**Select Dropdowns**:
- Same styling as Input Fields
- Height: h-10 (40px)
- Include default option as placeholder

**Textarea**:
- Min Height: min-h-24
- Same padding, border, focus states as inputs
- Resize: resize-none or resize-y

**Checkboxes & Radio Buttons**:
- Use proper spacing: gap-3 (12px) between options
- Label clickable: htmlFor matching input id
- Multi-column layout: grid-cols-2 for better space usage

**Form Layout**:
- Spacing between fields: gap-4 (16px)
- Form grid: grid-cols-1 md:grid-cols-2 gap-4 for responsive 2-column
- Section spacing: gap-6 (24px) between form sections

### Selection Cards (Clinic/Provider/Category)

**Card Design**:
- Border: border border-neutral-200
- Padding: p-5 or p-6
- Border Radius: rounded-lg
- Cursor: cursor-pointer
- Hover: hover:bg-neutral-50
- Transition: transition-all

**Selected State**:
- Border: border-primary-500
- Background: bg-primary-50
- Ring: ring-2 ring-primary-500/20
- Selection Indicator: Circular radio indicator in top-right
  - Container: size-5, rounded-full, bg-primary-600
  - Inner Dot: size-2, rounded-full, bg-white

**Completed State** (Questionnaire Categories):
- Text Badge: "Completed" in text-xs text-success-600
- Icon Badge: Check icon in circular bg-success-500 badge

### Spacing Scale

**Standard Spacing Values**:
- gap-3: 12px (checkbox options)
- gap-4: 16px (form fields)
- gap-6: 24px (form sections)
- px-3: 12px (input horizontal padding)
- px-5: 20px (mobile page padding)
- px-6: 24px (card padding, desktop page padding)
- py-1: 4px (input vertical padding)
- py-6: 24px (card vertical padding)
- mb-1.5: 6px (label bottom margin)
- mt-1: 4px (error top margin)
- mt-3: 12px (logo accent top margin)

**Responsive Spacing**:
- Page padding: p-5 md:p-6 (20px mobile, 24px desktop)
- Grid columns: grid-cols-1 md:grid-cols-2 (stacked mobile, 2-col desktop)

---

## Navigation Patterns

### Back Navigation
**Implementation**: Back buttons on most screens except primary entry points

**Screens WITH Back Button**:
- Forgot Password → Back to Login
- OTP & Password → Back to Signup or Forgot Password (context-aware)
- Clinic Selection → Back to Questionnaire Categories
- Provider Selection → Back to Clinic Selection
- Appointment Booking → Back to Provider Selection
- View Appointment Details → Back to Dashboard
- My Profile → Back to Dashboard

**Screens WITHOUT Back Button**:
- Login (primary entry point)
- Dashboard (main hub)

**Back Button Design**:
- Position: Top-left in card padding area (px-6 pt-6)
- Icon: ArrowLeft from lucide-react
- Text: "Back" or contextual (e.g., "Back to Login")
- Styling: Inline-flex with icon, hover animation

### Navigation Flow

**Complete User Journey**:
```
Signup
  ↓ [Continue]
OTP & Password (signup context)
  ↓ [Set password]
Login ← Success message
  ↓ [Login] (new user)
Patient Profile
  ↓ [Continue]
Insurance Details (optional - can skip)
  ↓ [Continue / Skip for now]
Questionnaire Categories
  ↓ [Select category]
Questionnaire (Multi-step: 4 steps)
  ↓ [Submit] (repeat for multiple categories)
← Back to Categories
  ↓ [Continue to appointment]
Clinic Selection
  ↓ [Continue]
Provider Selection
  ↓ [Continue]
Appointment Booking
  ↓ [Confirm appointment]
Consent Forms (Click to read → Accept each)
  ↓ [Accept all and confirm appointment]
Appointment Confirmation
  ↓ [Go to dashboard]
Dashboard
```

**Returning User Flow**:
```
Login
  ↓ [Login] (returning user)
Dashboard (with existing appointments)
```

**Dashboard Navigation**:
```
Dashboard (Sidebar Options)
├── Dashboard (home)
├── Appointments (list view)
└── My Profile (profile management)

Dashboard Actions
├── Book New Appointment → Clinic Selection
├── View Appointment → View Details
├── Reschedule → RescheduleDrawer
└── Cancel → Confirmation Dialog
```

---

## Interaction Patterns

### Validation Strategy

**On-Blur Validation**:
- Validate individual fields when user leaves the field (onBlur event)
- Real-time feedback for immediate correction
- Error messages display below each field immediately
- Error state: aria-invalid={true}, border-destructive

**Submit Button Enablement**:
- Button disabled by default
- Enabled only when all required fields are valid AND no errors exist
- Computed validation: `isFormValid` function checks all conditions
- Visual feedback: Disabled buttons have opacity-50

**Error Display**:
- Position: Below field, mt-1 (4px spacing)
- Styling: text-xs text-destructive
- Content: Clear, actionable message in sentence case
- Examples:
  - "This field is required"
  - "Enter a valid email address"
  - "Password must be at least 8 characters"
  - "Passwords do not match"

**Required Fields**:
- Indicator: Red asterisk (*) after label
- Example: `First name <span className="text-destructive">*</span>`
- Validation: Cannot be empty

### Loading & Async States
- Use disabled state on buttons during submission
- Button text can change to "Loading..." or show spinner
- Prevent double-submission with pointer-events-none

### Success States
- Success messages: Green banner (bg-success-50, text-success-700)
- Success icons: CheckCircle or Check from lucide-react
- Position: Top of form or as notification
- Auto-dismiss: Optional after timeout

### Empty States
- Centered content with icon
- Icon: Large (w-12 h-12), neutral color
- Message: Friendly, sentence case
- Action button: Primary CTA to resolve empty state
- Example: "No upcoming appointments" → "Book Appointment"

---

## Accessibility Standards

### Semantic HTML
- Always use `htmlFor` on labels matching input `id`
- Use semantic elements: button, label, input, select, textarea
- Use aria-invalid for error states: `aria-invalid={!!error}`
- Use aria-label for icon-only buttons

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows logical flow
- Focus states visible: ring-2 ring-primary-500
- Enter key submits forms
- Escape key closes dialogs/drawers

### Color Contrast
- Ensure WCAG AA minimum contrast ratios
- Text on backgrounds: Minimum 4.5:1
- Large text: Minimum 3:1
- Interactive elements: Sufficient contrast in all states

### Focus Management
- Focus visible on all interactive elements
- Focus outline: ring-2 ring-primary-500 with offset
- Don't remove focus outlines (outline-none only when custom ring added)
- Trap focus in modals/dialogs

---

## Design Principles

### Consistency
- Use the same component patterns throughout the application
- Logo placement consistent across all auth/booking screens
- Button styling consistent (primary vs. secondary)
- Spacing system followed everywhere (gap-4, gap-6, px-6, py-6)
- Typography case rules applied uniformly

### Clarity
- Clear labels with proper capitalization (sentence case)
- Helpful placeholders that show format examples
- Informative error messages that guide correction
- Descriptions that explain what to do next
- Status badges that clearly communicate state

### Efficiency
- Minimize steps in workflows
- Validate progressively (on blur, not on every keystroke)
- Provide clear next actions with prominent CTAs
- Remember user selections during back navigation
- Auto-enable buttons when conditions met

### Clean Design
- Flat design with subtle shadows (shadow-sm or none)
- Consistent spacing creates visual rhythm
- Harmonious color palette with limited accent colors
- White space for breathing room
- Minimal visual clutter

### Responsiveness
- Mobile-first approach with responsive breakpoints
- Grid layouts: grid-cols-1 md:grid-cols-2
- Padding adjusts: p-5 md:p-6
- Cards stack on mobile, side-by-side on desktop
- Touch-friendly tap targets (minimum 40px height)

---

## Special Patterns

### Multi-Step Forms
**Questionnaire Screen**: Progressive multi-step form with validation

**Step Structure**:
- Visual step indicator (progress dots)
- Step counter text: "Step X of Y: [Step Title]"
- Back button in header (returns to previous step or exit)
- Footer navigation: Back + Continue/Submit buttons

**Step Indicator Design**:
- Active step: w-8 bg-primary-600 (elongated, colored)
- Completed steps: w-2 bg-primary-600 (dot, colored)
- Upcoming steps: w-2 bg-neutral-300 (dot, gray)
- Smooth transitions between states

**Navigation Buttons**:
- Back button: Disabled on Step 1 (header back goes to exit)
- Continue button: Steps 1-(n-1), validation required
- Submit button: Final step, all validations checked
- Buttons use ChevronLeft/ChevronRight icons

**Validation Strategy**:
- Per-step validation before allowing Continue
- Submit enabled only when all steps valid
- Visual feedback on invalid attempts
- State preserved when navigating back

**Example (Questionnaire)**:
- Step 1: Complaint & Functional Difficulties
- Step 2: Relieving Factors
- Step 3: Overall Change & Pain Description
- Step 4: Pain Levels + Submit

### Consent Forms Pattern
**Consent Forms Screen**: Modal-based consent review and acceptance

**Design Pattern**:
- Each consent document displayed as a card
- Click to open full document in modal overlay
- Modal features:
  - Full scrollable content for easy reading
  - Checkbox at bottom to accept
  - Close button to return to main screen
- Main screen shows all 4 consents with status
- Cards highlight when accepted (border-primary-500, bg-primary-50)
- Submit button enabled only when all 4 accepted

**Four Required Consents**:
1. Terms and Conditions
2. Privacy Policy
3. HIPAA Authorization
4. Consent to Treat

**Modal Design**:
- Semi-transparent backdrop (bg-black/50)
- Large modal (max-w-3xl)
- Scrollable content area
- Footer with checkbox and close button
- Clean, readable typography (text-sm/16px)

**Consent Cards**:
- Icon + Title + "Click to read" link
- Accept checkbox on right
- Highlighted when accepted
- All must be checked to continue

**Button State**:
- Disabled until all 4 consents accepted
- Text: "Accept all and confirm appointment"

### Context-Aware Screens
**OTP & Password Screen**: Changes content based on context
- Signup context: "Verify email & set password", navigate back to Signup
- Forgot Password context: "Reset password", navigate back to Forgot Password
- Success messages differ based on context

### Conditional Navigation
**Clinic Selection**: Could skip if only one clinic (future enhancement)
**Profile Screen**: Only shown to new users, skipped for returning users

### Drawer Overlays
**RescheduleDrawer**:
- Right-sliding panel overlay
- Semi-transparent backdrop (bg-black/50)
- Contains full booking flow (Clinic → Provider → Booking)
- Close button (X icon) in top-right
- Smooth animations: transition-transform
- On confirm: Updates appointment, closes drawer

### Confirmation Dialogs
**Cancel Appointment**:
- AlertDialog component
- Warning message and description
- Two actions: "Cancel" (secondary) and "Confirm Cancellation" (destructive)
- Prevents accidental actions

---

## Component Files Reference

**Authentication**:
- `/src/app/components/auth/SignupScreen.tsx`
- `/src/app/components/auth/LoginScreen.tsx`
- `/src/app/components/auth/OTPPasswordScreen.tsx`
- `/src/app/components/auth/ForgotPasswordScreen.tsx`

**Insurance & Consent**:
- `/src/app/components/profile/InsuranceDetailsScreen.tsx`
- `/src/app/components/consent/ConsentFormsScreen.tsx`

**Booking**:
- `/src/app/components/booking/ClinicSelectionScreen.tsx`
- `/src/app/components/booking/ProviderSelectionScreen.tsx`
- `/src/app/components/booking/AppointmentBookingScreen.tsx`

**Dashboard**:
- `/src/app/components/dashboard/DashboardScreen.tsx`
- `/src/app/components/dashboard/AppointmentConfirmationScreen.tsx`
- `/src/app/components/layout/DashboardLayout.tsx`
- `/src/app/components/layout/Header.tsx`
- `/src/app/components/layout/Sidebar.tsx`

**Appointments**:
- `/src/app/components/appointments/ViewAppointmentDetailsScreen.tsx` - Redesigned with appointment details, questionnaires, and actions
- `/src/app/components/appointments/RescheduleDrawer.tsx`

**Profile & Questionnaire**:
- `/src/app/components/profile/MyProfileScreen.tsx` - Two tabs: Basic Information and Insurance
- `/src/app/components/questionnaire/QuestionnaireScreen.tsx`

**Main App**:
- `/src/app/App.tsx` - Main routing and state management

---

## Notes for Developers

**CRITICAL Typography Rule**:
- ALL text must use sentence case unless explicitly in exceptions list
- Check every label, button, title, and message before committing
- Use find-replace to fix case issues: "Email Address" → "Email address"

**Spacing System**:
- Always use the spacing scale (gap-3, gap-4, gap-6)
- Never use arbitrary values like gap-5 or px-7
- Consistency creates visual harmony

**Component Reuse**:
- Extract repeated patterns into reusable components
- Use consistent props interfaces
- Follow established patterns for new screens

**State Management**:
- Keep state in App.tsx for cross-screen data
- Use local state for form fields
- Pass callbacks as props for navigation and actions

---