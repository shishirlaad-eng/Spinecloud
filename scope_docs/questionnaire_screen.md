# Questionnaire Screen – Implementation Documentation

This document defines the implemented category-specific questionnaire screen for collecting structured clinical information in the SpineCloudIQ Patient Portal.

---

## Implementation Overview

The Questionnaire Screen collects detailed health information for a selected complaint category through a **multi-step form** with 4 progressive sections. It captures functional impact, symptom quality, and pain severity through a comprehensive guided flow.

**Component**: `/src/app/components/questionnaire/QuestionnaireScreen.tsx`

---

## Multi-Step Form Structure

### Step Navigation
The questionnaire is divided into 4 steps with the following structure:
- **Step indicator**: Visual progress bar showing current step
- **Back button**: Navigate to previous step (or back to categories on Step 1)
- **Continue button**: Navigate to next step (Steps 1-3)
- **Submit button**: Final submission on Step 4

### Step 1: Complaint & Functional Difficulties
**Fields**:
- Complaint description (textarea, 140 character limit with counter)
- Functional difficulties / Aggravating activities (multi-select checkboxes)

**Validation**: Both fields required (complaint must have text, at least one difficulty selected)

### Step 2: Relieving Factors
**Fields**:
- Relieving or improving factors (multi-select checkboxes)

**Validation**: At least one factor must be selected

### Step 3: Overall Change & Pain Description
**Fields**:
- Overall change since last visit (radio buttons - single select)
- Pain description (multi-select checkboxes)

**Validation**: Both fields required (one option selected for change, at least one pain descriptor)

### Step 4: Pain Levels
**Fields**:
- Current pain level (slider 0-10)
- Worst pain level in last 24 hours (slider 0-10)
- Submit button

**Validation**: Both sliders must have values set (not null)

---

## Design System Integration

### Layout Structure
- Full-screen centered form with logo at top
- Clean white card with proper spacing
- Step indicator with progress dots
- Back button navigation in header and footer
- Continue/Submit button in footer

### Typography Standards
- **Page Title (H2)**: text-xl font-semibold - Category name (e.g., "Neck / Shoulder")
- **Description**: text-sm - Sentence case below title
- **Step Info**: text-sm text-neutral-500 - "Step X of 4: [Step Title]"
- **Section Labels**: text-sm font-medium text-neutral-700
- **Checkboxes/Radio Labels**: text-sm labels with proper spacing
- **Character Counter**: text-sm text-neutral-500
- **Buttons**: text-sm font-medium - "Back", "Continue", "Submit questionnaire"

### Spacing System
- Card padding: px-6 py-6
- Section gap: gap-6 (24px between sections)
- Field gap: gap-4 (16px between fields within sections)
- Checkbox gap: gap-3 (12px between checkbox items)

### Step Indicator
- Active step: w-8 bg-primary-600 (wider, colored)
- Completed step: w-2 bg-primary-600 (dot, colored)
- Upcoming step: w-2 bg-neutral-300 (dot, gray)

---

## Screen Purpose

Collect structured clinical information for a single selected complaint category through a guided multi-step process including:
1. Complaint description and functional difficulties
2. Relieving or improving factors
3. Overall change assessment and pain quality descriptions
4. Current and worst pain levels

---

## Display Context

**Dynamic Content**:
- **Category Name**: Passed as prop (e.g., "Neck / Shoulder", "Lower Back")
- **Category Description**: Passed as prop or default text
- **Default Description**: "Please answer the following questions about your condition"

**Navigation**:
- Back button in header - Returns to Questionnaire Category Selection
- Integrated with DashboardLayout for consistent navigation

---

## Fields & Implementation

### 1. Complaint Description (Read-only)
- **Display**: Category description shown below title
- **Purpose**: Provide context for the questionnaire
- **Styling**: text-sm text-neutral-600
- **Example**: "Please answer the following questions about your condition"

---

### 2. Functional Difficulties / Aggravating Activities

**Field Type**: Multi-checkbox
**Label**: "Functional difficulties / Aggravating activities"
**Mandatory**: No
**State Variable**: `functionalDifficulties` (string array)

**Options (13)**:
- Housekeeping
- Climbing stairs
- Getting dressed
- Sitting for long periods
- Standing for long periods
- Walking
- Lifting objects
- Reaching overhead
- Sleeping
- Driving
- Working at a desk
- Exercise / physical activity
- Bending or twisting

**Implementation**:
- 2-column grid layout (grid-cols-2)
- Each option is a checkbox with label
- Multiple selections allowed
- Stored as array of selected values
- Checkbox styling: Proper spacing, hover states, focus rings

---

### 3. Relieving or Improving Factors

**Field Type**: Multi-checkbox
**Label**: "Relieving or improving factors"
**Mandatory**: No
**State Variable**: `relievingFactors` (string array)

**Options (13)**:
- Heating pad
- Aspirin
- Lying down
- Ice pack
- Rest
- Stretching
- Massage
- Changing posture
- Over-the-counter pain medication
- Prescription medication
- Gentle movement
- Physical therapy exercises
- Hot shower or bath

**Implementation**:
- 2-column grid layout (grid-cols-2)
- Multiple selections allowed
- Same visual treatment as functional difficulties
- Stored as array of selected values

---

### 4. Overall Change Since Last Visit

**Field Type**: Single-select radio group (visually checkboxes)
**Label**: "Overall change since last visit *"
**Mandatory**: Yes (Required for submission)
**State Variable**: `overallChange` (single string value)

**Options (9)**:
- Stayed the same
- Improved 5–20%
- Improved 21–40%
- Improved 41–60%
- Improved 61–80%
- Improved 81–100%
- Worsened 5–20%
- Worsened 21–40%
- Worsened 41–60%

**Implementation**:
- Single column layout (grid-cols-1)
- Only one option can be selected at a time
- Radio button behavior with checkbox UI
- Clicking a new option deselects previous
- Required field indicator (*) in label
- Validation error shown if not selected on submit

---

### 5. Pain Description

**Field Type**: Multi-checkbox
**Label**: "Pain description"
**Mandatory**: No
**State Variable**: `painDescription` (string array)

**Options (13)**:
- Aching
- Sharp
- Shooting
- Dull
- Throbbing
- Burning
- Stabbing
- Tight
- Stiff
- Cramping
- Sore
- Tender
- Numbness / tingling

**Implementation**:
- 2-column grid layout (grid-cols-2)
- Multiple selections allowed
- Comprehensive pain quality descriptors
- Stored as array of selected values

---

### 6. Current Pain Level

**Field Type**: Range slider (0-10 scale)
**Label**: "Current pain level *"
**Mandatory**: Yes (Required for submission)
**State Variable**: `currentPain` (number)
**Range**: 0–10
**Default**: No default value (user must interact)

**Scale Reference Labels**:
- 0 – No pain
- 1–2 – Slight pain
- 3–4 – Mild pain
- 5–6 – Moderate pain
- 7–8 – Severe pain
- 9–10 – Worst possible pain

**Implementation**:
- HTML range input with custom styling
- Shows current selected value prominently
- Scale labels displayed below slider for reference
- Value updates in real-time as user drags
- Required field indicator (*) in label
- Must be set to enable submit button

**Visual Design**:
- Slider track: bg-neutral-200
- Slider thumb: bg-primary-600
- Current value display: Large, bold text above slider
- Scale labels: Small text below in grid layout

---

### 7. Worst Pain Level Since Last Visit

**Field Type**: Range slider (0-10 scale)
**Label**: "Worst pain level since last visit *"
**Mandatory**: Yes (Required for submission)
**State Variable**: `worstPain` (number)
**Range**: 0–10
**Default**: No default value (user must interact)

**Scale Reference Labels**: Same as Current Pain Level
- 0 – No pain
- 1–2 – Slight pain
- 3–4 – Mild pain
- 5–6 – Moderate pain
- 7–8 – Severe pain
- 9–10 – Worst possible pain

**Implementation**: Same as Current Pain Level slider
- HTML range input with custom styling
- Real-time value display
- Scale reference labels below
- Required for form submission

**Note**: No validation comparing current vs. worst pain values - data accepted as entered

---

## Default State (On Load)

**Initial Field States**:
- All checkboxes: Unchecked
- Overall Change: No selection
- Pain sliders: No value (undefined state)
- Submit button: Disabled
- No validation messages visible

**Visual State**:
- Clean, empty form
- Clear instruction text
- Required fields marked with asterisk (*)
- Back button enabled

---

## Interaction Rules

**Checkbox Behavior**:
- Multi-checkbox fields: Multiple selections allowed simultaneously
- Overall Change field: Only one option at a time (radio behavior)
- Toggle on/off by clicking checkbox or label
- Visual feedback on hover and focus

**Slider Behavior**:
- Click or drag to set value
- Value updates in real-time
- Large number display above slider shows current value
- Must be actively set (no default value)

**Form Submission**:
- All three required fields must be filled
- Optional fields can be left empty
- No field interdependency validation

---

## Button Enablement Rules

**"Submit questionnaire" button enabled when**:
1. Overall Change Since Last Visit is selected (required)
2. Current Pain Level has a value (required)
3. Worst Pain Level Since Last Visit has a value (required)

**Implementation**:
```typescript
const isFormValid = 
  overallChange !== "" && 
  currentPain !== undefined && 
  worstPain !== undefined;
```

**Button States**:
- Disabled: opacity-50, cursor-not-allowed, pointer-events-none
- Enabled: bg-primary-600, hover:bg-primary-700
- Positioned: Bottom-right of form

---

## Validation & Error States

**Required Field Validation**:
- Performed on submit attempt
- Inline errors shown below required fields if empty
- Error text: "This field is required"
- Error styling: text-xs text-destructive

**No Cross-Field Validation**:
- Current pain can be higher than worst pain
- System accepts data as entered
- No logical validation between pain values

---

## Primary Action: Submit Questionnaire

**Button**: "Submit questionnaire"
**Behavior on Click**:
1. Collect all form data into object
2. Call `onSubmit` callback with data
3. Data structure:
```typescript
{
  functionalDifficulties: string[],
  relievingFactors: string[],
  overallChange: string,
  painDescription: string[],
  currentPain: number,
  worstPain: number
}
```
4. Parent component (App.tsx) stores response with:
   - categoryId
   - categoryName
   - timestamp
   - All questionnaire data
5. Category marked as **Completed**
6. Navigate back to Questionnaire Category Selection
7. Completion badge appears on category card

---

## Secondary Action: Back

**Button**: "Back" (top-left corner with arrow icon)
**Behavior on Click**:
- Navigate to Questionnaire Category Selection
- Answers NOT saved (draft state lost)
- Category NOT marked as completed
- User can re-enter questionnaire later

**Visual Design**:
- Arrow left icon
- Hover effect: slight translation
- Text: "Back"
- Grouped with icon using flex layout

---

## Data Storage & Usage

**Storage Location**: App.tsx state
```typescript
const [questionnaireResponses, setQuestionnaireResponses] = useState<any[]>([]);
```

**Stored Data Includes**:
- categoryId: String identifier
- categoryName: Display name
- timestamp: ISO string of submission time
- All questionnaire answers (functionalDifficulties, relievingFactors, etc.)

**Data Usage**:
- Displayed in View Appointment Details screen
- Shows patient's health information with their appointment
- Organized by category with collapsible sections
- Formatted for clinical review

---

## Navigation Flow

```
Questionnaire Category Selection
  ↓ [Click category card]
Questionnaire Screen (for selected category)
  ↓ [Submit questionnaire]
← Back to Questionnaire Category Selection
  (Category now shows "Completed" badge)
  ↓ [Select another category OR Continue to Appointment]
Next Screen (Clinic Selection or another Questionnaire)
```

---

## Component Structure

**File**: `/src/app/components/questionnaire/QuestionnaireScreen.tsx`

**Props Interface**:
```typescript
interface QuestionnaireScreenProps {
  categoryName: string;
  categoryDescription: string;
  onBack: () => void;
  onSubmit: (data: QuestionnaireData) => void;
}
```

**State Management**:
- Local state for all form fields
- Validation state for required fields
- Form validity computed state

**Layout Integration**:
- Uses DashboardLayout for consistent shell
- Header, sidebar, and main content area
- Responsive design

---

## Visual Design Details

**Section Spacing**:
- Consistent 24px gap between sections (gap-6)
- 16px gap between fields within sections (gap-4)
- 12px gap between checkbox options (gap-3)

**Color Usage**:
- Primary actions: bg-primary-600
- Success indicators: text-success-600
- Error messages: text-destructive
- Labels: text-neutral-700
- Helper text: text-neutral-600

**Interactive States**:
- Hover: Subtle background changes
- Focus: Ring-2 ring-primary-500
- Disabled: opacity-50
- Selected checkboxes: Checked state with primary color

---

## Integration Points

**From Category Selection**:
- Receives categoryName prop (e.g., "Neck / Shoulder")
- Receives categoryDescription prop
- Receives onBack callback
- Receives onSubmit callback

**To Category Selection**:
- Calls onBack() for navigation
- Calls onSubmit(data) to save and mark complete
- Parent updates completedCategories array
- Parent stores questionnaire response

**To Appointment Details**:
- Stored questionnaire data displayed in appointment view
- Grouped by category
- Formatted for clinical reference

---