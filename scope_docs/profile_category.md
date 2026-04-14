# Patient Profile & Questionnaire Category – Implementation Documentation

This document defines the implemented patient profile collection and questionnaire category selection screens for the SpineCloudIQ Patient Portal.

---

## Implementation Overview

After successful login, new patients proceed through:

1. **Patient Profile Screen** - Collect demographics and contact information
2. **Questionnaire Category Selection** - Select and complete health questionnaires by category
3. **Questionnaire Screen** - Answer category-specific questions (see questionnaire_screen.md)

---

## Design System Integration

### Branding Placement
- **SpineCloudIQ logo** appears at top of page, inside card header
- Consistent with authentication screens' design pattern
- Clean, professional layout

### Typography Standards
- **Page Titles**: Sentence case - "Patient profile", "Questionnaire categories"
- **Section Headers**: UPPERCASE with tracking - "DEMOGRAPHICS", "ADDRESS"
- **Form Labels**: Sentence case - "Date of birth", "Gender", "Street address"
- **Buttons**: Sentence case - "Continue", "Continue to appointment"
- **Helper Text**: "(Optional)" in neutral color for non-required sections

---

## 1. Patient Profile Screen

### Screen Purpose
Collect essential demographic and contact information before proceeding to questionnaires and appointments.

### Implementation Details
**Component**: Inline in `/src/app/App.tsx` as `PatientProfileScreenInline`

**Layout**:
- Centered card layout with max-width constraint
- Brand header with SpineCloudIQ title inside card
- Three sections: Demographics, Address, Emergency Contact
- Full-width continue button at bottom

### Section 1: Demographics (Required)

**Date of Birth**
- Label: Date of birth *
- Field Type: Date input
- Mandatory: Yes
- Validation: Must be provided
- Styling: h-10 height, rounded-lg, bg-neutral-50

**Gender**
- Label: Gender *
- Field Type: Dropdown select
- Mandatory: Yes
- Options:
  - Select gender (placeholder)
  - Male
  - Female
  - Other
  - Prefer not to say
- Styling: h-10 height, rounded-lg, bg-neutral-50

**Layout**: 2-column grid on desktop, stacked on mobile

### Section 2: Address (Optional)

Section header: "ADDRESS (Optional)"

**Street Address**
- Label: Street address
- Placeholder: 123 Main Street, Apt 4B
- Field Type: Text input
- Mandatory: No
- Full width field

**City**
- Label: City
- Placeholder: New York
- Field Type: Text input
- Mandatory: No

**State**
- Label: State
- Field Type: Dropdown select
- Mandatory: No
- Options: All 50 US states in alphabetical order
- Dropdown includes: Alabama, Alaska, Arizona, ... Wyoming

**ZIP Code**
- Label: Zip code
- Placeholder: 10001
- Field Type: Text input
- Mandatory: No

**Country**
- Label: Country
- Field Type: Dropdown select
- Mandatory: No
- Options:
  - Select country (placeholder)
  - United States
  - Canada
  - United Kingdom
  - Australia

**Layout**: 
- Street address: full width
- City & State: 2-column grid
- ZIP & Country: 2-column grid

### Section 3: Emergency Contact (Optional)

Section header: "EMERGENCY CONTACT (Optional)"

**Emergency Contact Name**
- Label: Emergency contact name
- Placeholder: John Doe
- Field Type: Text input
- Mandatory: No
- Full width field

**Emergency Contact Number**
- Label: Emergency contact number
- Field Type: Country code dropdown + phone input
- Mandatory: No
- Country codes available:
  - +1 (US)
  - +44 (UK)
  - +61 (AU)
  - +91 (IN)
- Layout: Country code selector (w-28) + phone input (flex-1)

### Button States
- **"Continue" button**:
  - Disabled by default
  - Enabled when: dateOfBirth && gender (required fields filled)
  - Full width button at bottom
  - Styling: bg-primary-600, h-10, rounded-lg

### Validation Rules
- Only Date of Birth and Gender are required
- All address and emergency contact fields are optional
- No validation errors shown for optional fields
- Button enables as soon as required fields are filled

### Flow
On successful submission:
1. Store profile data in state
2. Set hasCompletedProfile flag to true
3. Navigate to Questionnaire Category Selection screen

---

## 2. Questionnaire Category Selection Screen

### Screen Purpose
Central hub for managing multiple health complaint categories, completing questionnaires, and proceeding to appointment booking.

### Implementation Details
**Component**: Inline in `/src/app/App.tsx` as `QuestionnaireCategoryScreenInline`

**Layout**:
- Centered card with max-width constraint
- Header with title and description
- 2-column grid of category cards (4 categories)
- Footer with "Continue to Appointment" button

### Category Display

**Available Categories**:
1. **Neck / Shoulder** - ID: "neck-shoulder"
2. **Lower Back** - ID: "lower-back"
3. **Upper Extremity** - ID: "upper-extremity"
4. **Posture / Wellness** - ID: "posture-wellness"

**Category Card Design**:
- Border: border-neutral-200
- Padding: p-6
- Rounded: rounded-lg
- Hover state: bg-neutral-50
- Clickable: Full card is interactive button

**Completed State**:
- Shows "Completed" text in success-600 color
- Check icon badge in top-right corner
- Green circular badge (bg-success-500) with white check mark
- Visual indicator: Check icon from lucide-react

**Interaction**:
- Click any category card to open that category's questionnaire
- Categories can be completed in any order
- Can revisit and re-complete categories
- Completion tracked in state array: `completedCategories`

### Button States
- **"Continue to Appointment" button**:
  - Disabled by default
  - Enabled when: at least one category completed
  - Positioned in footer with border-top separator
  - Right-aligned
  - Styling: bg-primary-600, h-10, px-6, rounded-lg
  - State: `disabled={completedCategories.length === 0}`

### State Management
**Completed Categories Tracking**:
```typescript
const [completedCategories, setCompletedCategories] = useState<string[]>([]);
```
- Array stores IDs of completed categories
- Updated when questionnaire is successfully submitted
- Persists for entire session
- Used to:
  - Show completion badges
  - Enable "Continue to Appointment" button
  - Track patient progress

### Navigation

**Select Category Action**:
- Click category card
- Store selected category ID in state
- Navigate to Questionnaire Screen with category name and description

**Continue to Appointment Action**:
- Click "Continue to Appointment" button
- Only available when completedCategories.length > 0
- Navigate to Clinic Selection screen
- Begin appointment booking flow

### Default State (On Load)
- All four categories displayed
- No categories selected
- No categories marked as completed
- "Continue to Appointment" button disabled
- Clean, uncluttered interface

### Visual Feedback
- **Hover states**: Cards show bg-neutral-50 on hover
- **Completion indicator**: Prominent green check badge
- **Progress tracking**: User can see which categories are completed at a glance
- **Button state**: Disabled state has reduced opacity

---

## Flow Diagram

```
Login (new user)
  ↓
Patient Profile
  ↓ [Continue]
Questionnaire Category Selection
  ↓ [Select category]
Questionnaire Screen
  ↓ [Submit questionnaire]
← Back to Questionnaire Category Selection (category now marked completed)
  ↓ [Select another category or Continue to Appointment]
Clinic Selection
```

---

## Data Storage

**Profile Data**:
- Stored in App.tsx state
- Used to set `hasCompletedProfile` flag
- Determines if returning user bypasses profile screen

**Questionnaire Responses**:
```typescript
const [questionnaireResponses, setQuestionnaireResponses] = useState<any[]>([]);
```
- Stores all submitted questionnaires
- Each response includes:
  - categoryId
  - categoryName
  - timestamp
  - all questionnaire answers
- Used to display data in appointment details view

**Completed Categories**:
```typescript
const [completedCategories, setCompletedCategories] = useState<string[]>([]);
```
- Array of category IDs that have been completed
- Checked before allowing appointment booking

---

## Component Files

- `/src/app/App.tsx` - Contains:
  - `PatientProfileScreenInline` component
  - `QuestionnaireCategoryScreenInline` component
  - State management for profile and categories
  - Navigation logic

---

## Integration Points

**From Authentication**:
- After successful login, new users navigate to Patient Profile
- Returning users skip directly to Dashboard

**To Questionnaire**:
- Category selection passes category name and ID to QuestionnaireScreen
- QuestionnaireScreen component in `/src/app/components/questionnaire/QuestionnaireScreen.tsx`

**To Appointment Booking**:
- "Continue to Appointment" enabled after at least one category completed
- Navigates to Clinic Selection screen (see clinic_appointment.md)

---
