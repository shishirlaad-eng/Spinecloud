# Clinic & Appointment Booking Flow – Implementation Documentation

This document defines the implemented clinic selection, provider selection, and appointment booking screens for the SpineCloudIQ Patient Portal.

---

## Implementation Overview

The booking flow consists of three sequential screens:

1. **Clinic Selection** - Choose clinic location
2. **Provider Selection** - Choose healthcare provider at selected clinic
3. **Appointment Booking** - Select appointment type, date, and time slot
4. **Appointment Confirmation** - Review and confirm booking

This flow is used for both:
- Initial appointment booking (after questionnaires)
- Rescheduling existing appointments (via RescheduleDrawer)

---

## Design System Integration

### Branding Placement
- **SpineCloudIQ logo** appears **outside and above** card containers
- Logo styling: `text-3xl font-semibold` with blue accent underline
- Consistent with authentication screens

### Navigation Pattern
- Back buttons with arrow icons and hover animations
- Breadcrumb flow: Category Selection → Clinic → Provider → Booking
- Each screen can navigate back to previous step

### Typography Standards
- **Page Titles (H2)**: Sentence case, centered - "Select clinic", "Select provider", "Book appointment"
- **Descriptions**: Sentence case, centered - "Choose your preferred clinic location for the appointment"
- **Labels**: Sentence case - "Appointment type", "Appointment date"
- **Buttons**: Sentence case - "Continue", "Confirm appointment", "Back"

---

## 9. Clinic Selection Screen

### Screen Purpose
Allow patients to select a clinic or branch where the appointment will take place. This selection determines provider availability and scheduling options.

### Implementation Details
**Component**: `/src/app/components/booking/ClinicSelectionScreen.tsx`

**Layout**:
- Logo outside card at top
- Back button in card (if onBack prop provided)
- Card with header section (title + description)
- 2-column grid of clinic cards (responsive to 1 column on mobile)
- Footer with Continue button

### Props Interface
```typescript
interface ClinicSelectionScreenProps {
  clinics: Clinic[];
  onContinue: (clinicId: string) => void;
  onBack?: () => void;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  workingHours: string;
}
```

### Clinic Card Display

**Each Clinic Card Shows**:
- **Clinic Name**: font-medium text-neutral-900
- **Address**: with MapPin icon, text-xs text-neutral-600
- **Working Hours**: with Clock icon, text-xs text-neutral-600

**Visual Design**:
- Border: border-neutral-200
- Padding: p-5
- Rounded: rounded-lg
- Hover state: hover:bg-neutral-50
- Selected state:
  - border-primary-500
  - bg-primary-50
  - ring-2 ring-primary-500/20
  - Radio indicator in top-right (circular with dot)

**Interaction**:
- Full card is clickable button
- Click to select clinic
- Visual selection indicator appears
- Only one clinic can be selected at a time

### Mock Data (In App.tsx)

**Three Clinics Available**:
1. **Downtown Medical Center**
   - Address: 123 Main Street, Suite 400, New York, NY 10001
   - Hours: Mon–Fri, 9:00 AM – 6:00 PM
   
2. **Uptown Wellness Clinic**
   - Address: 456 Park Avenue, 2nd Floor, New York, NY 10022
   - Hours: Mon–Sat, 8:00 AM – 7:00 PM
   
3. **Brooklyn Health Center**
   - Address: 789 Atlantic Avenue, Brooklyn, NY 11217
   - Hours: Mon–Fri, 10:00 AM – 5:00 PM

### Default State (On Load)
- All clinic cards displayed in grid
- No clinic selected by default
- Continue button disabled
- No error messages visible
- Back button enabled (if onBack provided)

### Interaction Rules

**Selection Behavior**:
- Click any clinic card to select
- Selected card visually highlighted
- Previous selection automatically deselected
- Continue button enabled on selection
- Error message hidden on selection

**Conditional Logic** (Future Enhancement):
- If only one clinic: Could auto-select and skip screen
- Current implementation: Always shows selection screen

### Validation States

**No Selection Error**:
- Displayed if Continue clicked without selection
- Message: "Please select a clinic to continue"
- Styling: text-xs text-destructive
- Positioned below clinic grid

### Button States

**Continue Button**:
- Disabled by default: `disabled={!selectedClinicId}`
- Enabled when clinic selected
- Styling: bg-primary-600, h-10, px-6, rounded-lg
- Position: Right-aligned in footer
- Hover: bg-primary-700

**Back Button** (if provided):
- Always enabled
- Position: Top-left in card padding area
- Label: "Back"
- Icon: ArrowLeft with hover animation
- Navigation: Returns to Questionnaire Category Selection

### Primary Actions

**Select Clinic**:
1. User clicks clinic card
2. State updated with selected clinic ID
3. Card visual state changes to selected
4. Continue button enabled
5. Error message cleared

**Continue**:
1. Validates selection exists
2. Calls `onContinue(clinicId)` callback
3. Parent navigates to Provider Selection
4. Clinic ID stored in parent state

---

## 10. Provider Selection Screen

### Screen Purpose
Allow patients to select a healthcare provider associated with the previously selected clinic.

### Implementation Details
**Component**: `/src/app/components/booking/ProviderSelectionScreen.tsx`

**Layout**:
- Logo outside card at top
- Back button in card (always present)
- Card with header (includes selected clinic name in description)
- 2-column grid of provider cards
- Footer with Continue button

### Props Interface
```typescript
interface ProviderSelectionScreenProps {
  providers: Provider[];
  clinicName: string;
  onContinue: (providerId: string) => void;
  onBack: () => void;
}

interface Provider {
  id: string;
  name: string;
  specialization: string;
  availability: string;
}
```

### Provider Card Display

**Each Provider Card Shows**:
- **Provider Name**: font-medium text-neutral-900, with "Dr." prefix
- **Specialization**: with Stethoscope icon, text-xs text-neutral-600
- **Availability**: with Calendar icon, text-xs text-success-600 (green for positive indicator)

**Visual Design**:
- Same selection pattern as clinic cards
- Border: border-neutral-200
- Padding: p-5
- Rounded: rounded-lg
- Hover: hover:bg-neutral-50
- Selected state: border-primary-500, bg-primary-50, ring-2
- Radio indicator in top-right when selected

### Mock Data (In App.tsx)

**Three Providers Available**:
1. **Dr. Sarah Johnson**
   - Specialization: Chiropractor
   - Availability: Available Today
   
2. **Dr. Michael Chen**
   - Specialization: Physical Therapist
   - Availability: Next available: Tomorrow
   
3. **Dr. Emily Rodriguez**
   - Specialization: Sports Medicine Specialist
   - Availability: Available Today

### Default State (On Load)
- Provider list filtered by selected clinic (conceptually)
- No provider selected by default
- Continue button disabled
- No error messages visible
- Back button always enabled

### Empty State Handling

**If No Providers Available**:
- Display empty state with User icon
- Message: "No providers available at this location"
- Icon: w-12 h-12 text-neutral-400
- Continue button remains disabled
- Back button still functional

**Current Implementation**: Always shows 3 providers (mock data)

### Interaction Rules

**Selection Behavior**:
- Click provider card to select
- Only one provider at a time
- Visual feedback on selection
- Continue button enables
- Error cleared on selection

**Availability Display**:
- Informational only
- Does not restrict selection
- Full availability shown on booking screen

### Validation States

**No Selection Error**:
- Message: "Please select a provider to continue"
- Displayed on Continue click without selection
- Styling: text-xs text-destructive

### Button States

**Continue Button**:
- Disabled: `disabled={!selectedProviderId || providers.length === 0}`
- Enabled when provider selected AND providers exist
- Position: Right-aligned in footer
- Styling: bg-primary-600, h-10, px-6

**Back Button**:
- Always enabled and visible
- Label: "Back"
- Navigation: Returns to Clinic Selection
- Position: Top-left in card

### Primary Actions

**Select Provider**:
1. Click provider card
2. Update selectedProviderId state
3. Update visual selection
4. Enable Continue button

**Continue**:
1. Validate provider selected
2. Call `onContinue(providerId)` callback
3. Navigate to Appointment Booking Screen

**Back**:
1. Call `onBack()` callback
2. Navigate to Clinic Selection
3. Clinic selection preserved in parent state

---

## 11. Appointment Booking Screen

### Screen Purpose
Allow patients to select appointment type, date, and available time slot for the chosen clinic and provider.

### Implementation Details
**Component**: `/src/app/components/booking/AppointmentBookingScreen.tsx`

**Layout**:
- Logo outside card at top
- Back button in card
- Card with header (includes provider and clinic names)
- Form with three sections: Type, Date, Time Slots
- Footer with Confirm button

### Props Interface
```typescript
interface AppointmentBookingScreenProps {
  clinicName: string;
  providerName: string;
  onConfirm: (appointmentData: {
    type: string;
    date: string;
    timeSlot: string;
  }) => void;
  onBack: () => void;
}
```

### Section 1: Appointment Type

**Field Type**: Dropdown select
**Label**: "Appointment type *"
**Mandatory**: Yes

**Options**:
- Select appointment type (placeholder)
- Initial Consultation
- Follow-up Visit
- Therapy Session

**Implementation**:
- HTML select element
- h-10 height, rounded-lg
- Triggers date picker enablement on selection
- Triggers time slot generation when combined with date

### Section 2: Appointment Date

**Field Type**: Date input
**Label**: "Appointment date *"
**Mandatory**: Yes
**Min Date**: Today (past dates disabled)

**Implementation**:
- Native HTML date input
- `min={today}` attribute prevents past dates
- Today calculated: `new Date().toISOString().split("T")[0]`
- Enabled only after appointment type selected
- Triggers time slot fetch on selection

### Section 3: Available Time Slots

**Field Type**: Button grid selection
**Label**: "Available time slots *"
**Mandatory**: Yes

**Display Conditions**:
- Only shown when both type AND date selected
- Generated based on type + date combination
- If no slots available: Message displayed

**Time Slot Mock Generation**:
```typescript
const generateTimeSlots = (date: string, type: string): TimeSlot[] => {
  if (!date || !type) return [];
  
  return [
    { id: "09:00", time: "9:00 AM", available: true },
    { id: "09:30", time: "9:30 AM", available: true },
    { id: "10:00", time: "10:00 AM", available: false },
    { id: "10:30", time: "10:30 AM", available: true },
    { id: "11:00", time: "11:00 AM", available: true },
    { id: "11:30", time: "11:30 AM", available: true },
    { id: "14:00", time: "2:00 PM", available: true },
    { id: "14:30", time: "2:30 PM", available: false },
    { id: "15:00", time: "3:00 PM", available: true },
    { id: "15:30", time: "3:30 PM", available: true },
    { id: "16:00", time: "4:00 PM", available: true },
    { id: "16:30", time: "4:30 PM", available: true },
  ];
};
```

**Slot Display**:
- Grid layout: 3 columns on desktop
- Each slot as button
- Available slots: Clickable, hover effects
- Unavailable slots: Grayed out, cursor-not-allowed, opacity-50
- Selected slot: bg-primary-600 text-white
- Unselected available: border-neutral-200, hover:bg-neutral-50

### Default State (On Load)
- Appointment type: Not selected
- Appointment date: Empty
- Time slots: Hidden (not rendered)
- Confirm button: Disabled
- Description shows provider and clinic names

### Interaction Flow

**Step 1: Select Appointment Type**
1. User opens type dropdown
2. Selects type (e.g., "Initial Consultation")
3. Date picker becomes enabled
4. Time slots remain hidden

**Step 2: Select Appointment Date**
1. User opens date picker
2. Selects date (today or future)
3. `useEffect` triggers on date/type change
4. Time slots generated and displayed
5. Selected time slot cleared
6. "No slots" message shown if applicable

**Step 3: Select Time Slot**
1. User views available time slots grid
2. Clicks available slot button
3. Slot visually selected (primary color)
4. Confirm button enabled

### Validation & Error States

**Past Dates**:
- Prevented by `min` attribute on date input
- User cannot select past dates

**No Slots Available**:
- Message: "No available time slots for this date. Please select another date."
- Styling: text-sm text-neutral-600 in alert box
- Displayed in place of time slot grid
- State tracked: `showNoSlotsMessage`

**Unavailable Slots**:
- Visually distinct: opacity-50, cursor-not-allowed
- Cannot be selected
- Included in grid but disabled

### Button States

**Confirm Appointment Button**:
- Disabled by default
- Enabled when: `appointmentType && appointmentDate && selectedTimeSlot`
- Full form validation: `isFormValid` computed property
- Styling: bg-primary-600, h-10, px-6
- Position: Right-aligned in footer
- Label: "Confirm appointment"

**Back Button**:
- Always enabled
- Position: Top-left in card
- Label: "Back"
- Navigation: Returns to Provider Selection

### Primary Actions

**Confirm Appointment**:
1. Validate all fields filled
2. Find selected time slot details
3. Prepare appointment data:
```typescript
{
  type: appointmentType,
  date: appointmentDate,
  timeSlot: selectedSlot.time // "9:00 AM"
}
```
4. Call `onConfirm(appointmentData)` callback
5. Navigate to Appointment Confirmation Screen

**Back**:
1. Call `onBack()` callback
2. Navigate to Provider Selection
3. Form state preserved in parent if needed

### State Management (useEffect)

**Time Slot Generation**:
```typescript
useEffect(() => {
  if (appointmentDate && appointmentType) {
    const slots = generateTimeSlots(appointmentDate, appointmentType);
    setTimeSlots(slots);
    setSelectedTimeSlot(""); // Clear selection
    setShowNoSlotsMessage(slots.filter(s => s.available).length === 0);
  } else {
    setTimeSlots([]);
    setShowNoSlotsMessage(false);
  }
}, [appointmentDate, appointmentType]);
```

**Dependencies**: appointmentDate, appointmentType
**Effect**: Regenerate time slots when either changes

---

## Appointment Confirmation Screen

### Screen Purpose
Display appointment confirmation and allow navigation to dashboard.

### Implementation Details
**Component**: `/src/app/components/dashboard/AppointmentConfirmationScreen.tsx`

**Data Displayed**:
- Appointment date (formatted)
- Time slot
- Provider name
- Clinic name and address
- Appointment type

**Actions**:
- "Go to Dashboard" button
- On click: Navigate to Dashboard
- Appointment added to appointments list

---

## Flow Diagram

```
Questionnaire Category Selection
  ↓ [Continue to Appointment]
Clinic Selection
  ↓ [Continue]
Provider Selection
  ↓ [Continue]
Appointment Booking
  ↓ [Confirm Appointment]
Appointment Confirmation
  ↓ [Go to Dashboard]
Dashboard (with new appointment)
```

### Back Navigation Flow

```
Clinic Selection ← [Back] ← Provider Selection
                            ↑
                            [Back]
                            ↓
                    Appointment Booking
```

---

## Reschedule Flow (RescheduleDrawer)

The same booking screens are replicated inside a drawer overlay for rescheduling:

**Component**: `/src/app/components/appointments/RescheduleDrawer.tsx`

**Features**:
- Right-sliding drawer overlay
- Contains all three booking screens (Clinic, Provider, Appointment)
- Same appointment types: Initial Consultation, Follow-up Visit, Therapy Session
- Same time slot system with availability
- Close button to cancel
- On confirm: Updates existing appointment instead of creating new one

**Usage**:
- Accessible from Dashboard appointment three-dots menu
- Accessible from View Appointment Details screen
- Smooth animations and transitions
- Matches initial booking flow exactly

---

## Mock Data Summary

**Clinics** (3):
- Downtown Medical Center
- Uptown Wellness Clinic
- Brooklyn Health Center

**Providers** (3):
- Dr. Sarah Johnson - Chiropractor
- Dr. Michael Chen - Physical Therapist
- Dr. Emily Rodriguez - Sports Medicine Specialist

**Appointment Types** (3):
- Initial Consultation
- Follow-up Visit
- Therapy Session

**Time Slots** (12 per day):
- Morning: 9:00 AM - 11:30 AM (30-minute intervals)
- Afternoon: 2:00 PM - 4:30 PM (30-minute intervals)
- Some slots marked unavailable for realism

---

## Component Files

- `/src/app/components/booking/ClinicSelectionScreen.tsx`
- `/src/app/components/booking/ProviderSelectionScreen.tsx`
- `/src/app/components/booking/AppointmentBookingScreen.tsx`
- `/src/app/components/dashboard/AppointmentConfirmationScreen.tsx`
- `/src/app/components/appointments/RescheduleDrawer.tsx`
- `/src/app/App.tsx` - Main routing and state management

---
