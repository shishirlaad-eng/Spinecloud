# Appointment Confirmation & Dashboard – Implementation Documentation

This document defines the implemented appointment confirmation screen, patient dashboard, and appointment management features for the SpineCloudIQ Patient Portal.

---

## Implementation Overview

After booking an appointment, patients proceed through:

1. **Appointment Confirmation Screen** - Read-only confirmation of booked appointment
2. **Patient Dashboard** - Central hub with appointments and notifications
3. **My Profile** - View and manage profile information
4. **View Appointment Details** - Detailed appointment view with questionnaire data
5. **Reschedule Functionality** - Modify existing appointments via drawer overlay

---

## Design System Integration

### Layout Structure
- Dashboard uses `DashboardLayout` component
- Persistent header with SpineCloudIQ branding
- Sidebar navigation (Dashboard, Appointments, My Profile)
- Main content area with responsive grid

### Typography Standards
- **Dashboard**: Sentence case throughout
- **Section Headers**: Sentence case - "Upcoming appointments", "Recent notifications"
- **Empty States**: Friendly, sentence case messages
- **Status Badges**: Title case - "Confirmed", "Cancelled"

---

## 12. Appointment Confirmation Screen

### Screen Purpose
Provide immediate confirmation that an appointment has been successfully booked with a complete, read-only summary.

### Implementation Details
**Component**: `/src/app/components/dashboard/AppointmentConfirmationScreen.tsx`

**Layout**:
- Centered card layout
- Success indicator at top (green checkmark icon)
- Appointment details grid
- Action button at bottom

### Displayed Information (Read-Only)

**Success Message**:
- Large success icon (CheckCircle from lucide-react)
- Green color (text-success-600)
- Heading: "Appointment confirmed!"
- Subtext: "Your appointment has been successfully booked"

**Appointment Summary Grid**:

**Date**
- Label: "Date"
- Value: Formatted date (e.g., "Tuesday, January 28, 2025")
- Icon: Calendar

**Time**
- Label: "Time"
- Value: Time slot (e.g., "9:00 AM - 9:30 AM")
- Icon: Clock

**Provider**
- Label: "Provider"
- Value: Provider name (e.g., "Dr. Sarah Johnson")
- Icon: User

**Clinic**
- Label: "Clinic"
- Value: Clinic name (e.g., "Downtown Medical Center")
- Additional: Full address below

**Type**
- Label: "Type"
- Value: Appointment type (e.g., "Initial Consultation")
- Icon: FileText

**Visual Design**:
- 2-column grid layout
- Each item: Label (font-semibold) + Value (text-neutral-600)
- Icons in neutral color for visual hierarchy
- Proper spacing between items

### Default State (On Load)
- All appointment data populated from booking flow
- Success message visible
- "Go to Dashboard" button enabled and prominent
- No editable fields present
- Clean, professional confirmation layout

### Interaction Rules
- Read-only screen - no editing possible
- Must match exact data from booking screen
- Single action available: Navigate to dashboard

### Props Interface
```typescript
interface AppointmentConfirmationScreenProps {
  appointmentData: {
    date: string;
    time: string;
    provider: string;
    clinic: string;
    clinicAddress: string;
    type: string;
  };
  onGoToDashboard: () => void;
}
```

### Primary Action: Go to Dashboard

**Button**: "Go to Dashboard"
- Styling: Full-width primary button
- Position: Bottom of card
- Behavior on click:
  1. Call `onGoToDashboard()` callback
  2. Parent (App.tsx) adds appointment to appointments array
  3. Generate booking notification
  4. Navigate to Dashboard screen
  5. New appointment appears in upcoming appointments list

### System Behavior (Behind the Scenes)

**Appointment Storage**:
```typescript
const newAppointment = {
  ...appointmentData,
  id: Date.now().toString(),
  status: "Confirmed" as const,
  clinic: "Downtown Medical Center",
  clinicAddress: "123 Main Street, Suite 400, New York, NY 10001",
  provider: "Dr. Sarah Johnson",
};
```

**Notification Generation**:
```typescript
{
  id: Date.now().toString(),
  message: `Appointment confirmed for ${date}`,
  timestamp: new Date().toISOString(),
  type: "booking",
}
```

**State Updates**:
- Appointment added to `appointments` state array
- Notification added to `notifications` state array
- Navigation to "dashboard" screen

---

## 13. Patient Dashboard

### Screen Purpose
Central hub for patients to view upcoming appointments, recent notifications, and navigate to other sections.

### Implementation Details
**Component**: `/src/app/components/dashboard/DashboardScreen.tsx`

**Layout**:
- Uses `DashboardLayout` with header and sidebar
- Main content area with responsive grid
- Two-column layout on desktop: Appointments (2/3) + Notifications (1/3)
- Stacked on mobile

### Props Interface
```typescript
interface DashboardScreenProps {
  appointments: Appointment[];
  notifications: Notification[];
  onNavigate: (screen: Screen) => void;
  onCancelAppointment: (id: string) => void;
  onViewAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string) => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  provider: string;
  clinic: string;
  clinicAddress: string;
  type: string;
  status: "Confirmed" | "Cancelled";
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: "booking" | "reschedule" | "cancellation";
}
```

### Section 1: Upcoming Appointments

**Header**:
- Title: "Upcoming appointments"
- "Book New Appointment" button (right-aligned)

**Appointment Cards**:

Each card displays:
- **Date & Time**: Large, prominent at top
  - Example: "Jan 28, 2025 • 9:00 AM - 9:30 AM"
- **Provider**: Dr. name with User icon
- **Clinic**: Clinic name with MapPin icon
- **Type**: Appointment type with FileText icon
- **Status Badge**: 
  - "Confirmed" - Green (bg-success-100, text-success-700)
  - "Cancelled" - Gray (bg-neutral-100, text-neutral-600)
- **Actions Menu**: Three-dots menu (MoreVertical icon)

**Actions Menu (Dropdown)**:
- **View Details**: Opens View Appointment Details screen
- **Reschedule**: Opens RescheduleDrawer
- **Cancel**: Opens confirmation dialog

**Visual Design**:
- White card: bg-white, border-neutral-200
- Rounded: rounded-xl
- Padding: p-6
- Hover effect on menu button
- Responsive grid: grid-cols-1 with gap-4

**Empty State**:
- No appointments icon (CalendarX2)
- Message: "No upcoming appointments"
- Subtext: "Book your first appointment to get started"
- "Book Appointment" button
- Centered, friendly design

### Section 2: Recent Notifications

**Header**:
- Title: "Recent notifications"
- Badge showing unread count (if applicable)

**Notification Items**:

Each notification displays:
- **Icon**: Based on type
  - booking: Calendar (text-primary-600)
  - reschedule: Clock (text-primary-600)
  - cancellation: X (text-neutral-600)
- **Message**: Notification text
  - Example: "Appointment confirmed for Jan 28, 2025"
  - Example: "Appointment rescheduled successfully"
  - Example: "Appointment cancelled successfully"
- **Timestamp**: Relative time (e.g., "2 hours ago")

**Visual Design**:
- List layout: space-y-3
- Each item: flex layout with icon + content
- Border between items
- Text size: text-sm
- Icon size: w-5 h-5

**Empty State**:
- Message: "No notifications yet"
- Centered text

### Default State (On Load)

**New Users (Post-Signup)**:
- Profile completed but no appointments yet
- Empty appointments state shown
- Welcome notification: "Welcome to the Patient Portal"

**Returning Users (Direct Login)**:
- Mock appointments displayed (2 upcoming)
- Previous notifications shown
- Full dashboard with data

**After Booking**:
- Newly booked appointment at top of list
- Booking confirmation notification at top
- "Confirmed" status badge

### Interaction Rules

**Appointment Cards**:
- Hover effects on entire card
- Three-dots menu opens on click
- Status badge is read-only
- All appointment info is read-only on dashboard

**Actions Menu**:
- Opens on three-dots click
- Positioned relative to button
- Click outside to close
- Click action to execute

**Navigation**:
- Sidebar: Navigate between Dashboard, Appointments, My Profile
- Header: Logo, notifications, profile menu
- Logout available in profile dropdown

### Available Actions

#### View Appointment Details
**Trigger**: Click "View Details" in three-dots menu

**Behavior**:
1. Store appointment ID in state
2. Navigate to View Appointment Details screen
3. Display full appointment information
4. Show associated questionnaire data
5. Provide reschedule/cancel options

**Component**: `/src/app/components/appointments/ViewAppointmentDetailsScreen.tsx`

#### Reschedule Appointment
**Trigger**: Click "Reschedule" in three-dots menu

**Behavior**:
1. Store appointment ID in state
2. Open RescheduleDrawer overlay
3. Show clinic selection → provider selection → date/time
4. Same flow as initial booking
5. On confirm: Update existing appointment
6. Generate reschedule notification

**Component**: `/src/app/components/appointments/RescheduleDrawer.tsx`

**RescheduleDrawer Features**:
- Right-sliding drawer overlay
- Semi-transparent backdrop
- Close button (X icon) in top-right
- Internal navigation through booking steps
- Same appointment types as initial booking
- Same time slot availability system
- Smooth animations (slide-in/out)
- On confirm: Updates appointment in state
- Notification: "Appointment rescheduled successfully"

#### Cancel Appointment
**Trigger**: Click "Cancel" in three-dots menu

**Behavior**:
1. Open confirmation dialog (AlertDialog component)
2. Show warning message:
   - Title: "Cancel appointment?"
   - Description: "Are you sure you want to cancel this appointment? This action cannot be undone."
3. Two buttons:
   - "Cancel" (secondary) - Close dialog without action
   - "Confirm Cancellation" (destructive) - Proceed with cancellation

**On Confirmation**:
1. Call `onCancelAppointment(appointmentId)`
2. Remove appointment from appointments array
3. Generate cancellation notification
4. Close dialog
5. Update UI immediately

**Cancellation Notification**:
```typescript
{
  id: Date.now().toString(),
  message: "Appointment cancelled successfully",
  timestamp: new Date().toISOString(),
  type: "cancellation",
}
```

### Mock Data for Returning Users

**Appointment 1**:
- Date: 7 days from today
- Time: 10:00 AM - 10:30 AM
- Provider: Dr. Sarah Johnson
- Clinic: Downtown Medical Center
- Type: Follow-up Consultation
- Status: Confirmed

**Appointment 2**:
- Date: 14 days from today
- Time: 2:00 PM - 2:30 PM
- Provider: Dr. Michael Chen
- Clinic: Uptown Wellness Clinic
- Type: Physical Therapy Session
- Status: Confirmed

**Initial Notification**:
- Message: "Welcome to the Patient Portal"
- Type: booking
- Timestamp: Current time

### Validation & Rules

**Reschedule & Cancel**:
- Available for all appointments regardless of date (in this implementation)
- No cutoff time restrictions (mock data)
- All appointments modifiable

**Cancelled Appointments**:
- Removed from dashboard immediately
- Do not appear in "Upcoming Appointments"
- Stored in state with "Cancelled" status if needed for history

**Future Appointments Only**:
- Currently not enforced (all mock appointments are future)
- Could be added: Check if date > today before allowing actions

---

## My Profile Screen

### Screen Purpose
Allow patients to view and edit their profile information.

### Implementation Details
**Component**: `/src/app/components/profile/MyProfileScreen.tsx`

**Sections**:
1. Personal Information (read-only display)
2. Account Settings
3. Support & Help

**Layout**:
- Uses DashboardLayout
- Card-based sections
- Back button navigation

**Features**:
- View profile data
- Edit profile (placeholder for future)
- Change password link
- Help and support links
- Logout option

---

## View Appointment Details Screen

### Screen Purpose
Provide comprehensive view of a single appointment including questionnaire responses.

### Implementation Details
**Component**: `/src/app/components/appointments/ViewAppointmentDetailsScreen.tsx`

**Sections**:
1. Appointment Information
   - Date, time, provider, clinic, type, status
2. Clinic Address and Directions
   - Full address, Google Maps link
3. Questionnaire Responses (Collapsible)
   - All completed questionnaires by category
   - Functional difficulties
   - Relieving factors
   - Overall change
   - Pain descriptions
   - Current and worst pain levels

**Actions**:
- Back to Dashboard
- Reschedule Appointment
- Cancel Appointment

**Data Display**:
- Organized by questionnaire category
- Accordion/collapsible sections
- Clean typography and spacing
- All questionnaire data from booking flow

---

## State Management in App.tsx

**Appointments State**:
```typescript
const [appointments, setAppointments] = useState<any[]>([]);
```

**Notifications State**:
```typescript
const [notifications, setNotifications] = useState<any[]>([
  {
    id: "1",
    message: "Welcome to the Patient Portal",
    timestamp: new Date().toISOString(),
    type: "booking",
  },
]);
```

**Questionnaire Responses State**:
```typescript
const [questionnaireResponses, setQuestionnaireResponses] = useState<any[]>([]);
```

**Current Appointment Tracking**:
```typescript
const [currentAppointmentId, setCurrentAppointmentId] = useState<string>("");
```

**Reschedule Drawer**:
```typescript
const [showRescheduleDrawer, setShowRescheduleDrawer] = useState(false);
```

---

## Flow Diagrams

### Initial Booking Flow
```
Appointment Booking Screen
  ↓ [Confirm Appointment]
Appointment Confirmation Screen
  ↓ [Go to Dashboard]
Dashboard (with new appointment)
```

### Reschedule Flow
```
Dashboard → Three-dots menu → Reschedule
  ↓
RescheduleDrawer opens
  ↓ Clinic Selection
  ↓ Provider Selection
  ↓ Date/Time Selection
  ↓ [Confirm]
Dashboard (updated appointment + notification)
```

### Cancel Flow
```
Dashboard → Three-dots menu → Cancel
  ↓
Confirmation Dialog
  ↓ [Confirm Cancellation]
Dashboard (appointment removed + notification)
```

### View Details Flow
```
Dashboard → Three-dots menu → View Details
  ↓
View Appointment Details Screen
  (Shows appointment + questionnaire data)
  ↓ [Back] OR [Reschedule] OR [Cancel]
Dashboard
```

---

## Component Files

- `/src/app/components/dashboard/AppointmentConfirmationScreen.tsx`
- `/src/app/components/dashboard/DashboardScreen.tsx`
- `/src/app/components/layout/DashboardLayout.tsx`
- `/src/app/components/layout/Header.tsx`
- `/src/app/components/layout/Sidebar.tsx`
- `/src/app/components/profile/MyProfileScreen.tsx`
- `/src/app/components/appointments/ViewAppointmentDetailsScreen.tsx`
- `/src/app/components/appointments/RescheduleDrawer.tsx`
- `/src/app/App.tsx` - Main state management and routing

---

## Key Features Summary

✅ **Appointment Confirmation** - Immediate visual feedback after booking
✅ **Dashboard** - Central hub with appointments and notifications  
✅ **View Details** - Comprehensive appointment and health information
✅ **Reschedule** - Full rebooking flow in drawer overlay
✅ **Cancel** - Confirmation dialog with immediate state update
✅ **My Profile** - Profile information management
✅ **Navigation** - Consistent sidebar and header across screens
✅ **Notifications** - Real-time updates for all actions
✅ **Empty States** - Friendly messages for new users
✅ **Responsive Design** - Works on mobile and desktop
✅ **Mock Data** - Realistic demo data for testing

---
