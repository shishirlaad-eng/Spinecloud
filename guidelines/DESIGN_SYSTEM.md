# Typography Standards

## Custom Font Sizes
The platform uses custom font sizes configured in Tailwind CSS v4:
- `text-sm`: 16px (customized from default 14px)
- `text-xs`: 12px (default - ONLY for error messages)

## CRITICAL TYPOGRAPHY RULE
**Everything on the platform uses text-sm (16px) EXCEPT error messages which use text-xs (12px).**

This is a hard rule with no exceptions. All labels, body text, descriptions, helper text, info text, badges, section headers, button text, and any other text element must use text-sm (16px).

### What Uses text-sm (16px):
- Form section headers
- Form labels  
- Descriptive labels (e.g., "Date & time", "Provider", "Clinic location")
- Body and description text
- Input field text and placeholders
- Helper text and character counters
- Info text and notifications
- Badges and status indicators
- **Button text (ALL buttons - primary, secondary, tertiary)**
- Success messages
- Warning messages
- Demo credentials text
- Link text
- Dropdown text
- Table text
- List items
- Navigation items
- Breadcrumbs
- All other text elements

### What Uses text-xs (12px) - THE ONLY EXCEPTION:
- Error messages (e.g., "This field is required", "Invalid email address")
- Error validation text displayed below form fields

That's it. Nothing else should use text-xs.

## Typography Hierarchy

### Form Section Headers (H4)
- **Class**: `text-sm font-semibold tracking-wide`
- **Size**: 16px
- **Weight**: 600 (semibold)
- **Case**: Sentence case
- **Examples**: "Demographics", "Address", "Emergency contact", "Account information"
- **Usage**: Section dividers within forms and content areas

### Form Labels
- **Class**: `text-sm font-medium`
- **Size**: 16px
- **Weight**: 500 (medium)
- **Case**: Sentence case  
- **Examples**: "First name", "Email address", "Date of birth", "Appointment type"
- **Spacing**: `mb-1.5` (6px bottom margin)

### Descriptive Labels (Info/Field Descriptions)
- **Class**: `text-sm font-medium`
- **Size**: 16px
- **Weight**: 500 (medium) or 400 (normal)
- **Examples**: "Date & time", "Provider", "Clinic location", "Complaint description"
- **Usage**: Labels that describe content sections in detail views

### Body & Description Text
- **Class**: `text-sm`
- **Size**: 16px
- **Weight**: 400 (normal)
- **Usage**: Descriptions, helper text, body content, informational text

### Input Fields
- **Class**: `text-sm`
- **Size**: 16px
- **Placeholder**: `placeholder:text-neutral-400`

### Error Messages - THE ONLY EXCEPTION
- **Class**: `text-xs text-destructive`
- **Size**: 12px
- **Weight**: 400 (normal)
- **Spacing**: `mt-1` (4px top margin)
- **CRITICAL**: This is the ONLY place where text-xs is used

### Button Text
- **Class**: `text-sm font-medium`
- **Size**: 16px
- **Weight**: 500 (medium)
- **Examples**: "Continue", "Save changes", "Login"

### Helper/Info Text
- **Class**: `text-sm`
- **Size**: 16px
- **Color**: `text-neutral-500`
- **Examples**: Character counters, hints, supplementary information

### Badges & Status Text
- **Class**: `text-sm`
- **Size**: 16px
- **Weight**: 500 (medium)
- **Examples**: "Confirmed", "Pending", "Completed"

## Complete Checklist
Use this checklist when creating or updating components:

```
✓ Form Section Headers → text-sm font-semibold tracking-wide
✓ Form Labels → text-sm font-medium
✓ Descriptive Labels → text-sm font-medium
✓ Body Text → text-sm
✓ Input Fields → text-sm
✓ Helper Text → text-sm
✓ Info Text → text-sm
✓ Badges → text-sm
✓ Buttons → text-sm font-medium
✓ Character Counters → text-sm
✓ Success Messages → text-sm
✓ Warning Messages → text-sm
✓ All Other Text → text-sm
✗ Error Messages → text-xs (ONLY EXCEPTION)
```

## Examples from Components

### Correct Implementation
```tsx
// Form Label
<label className="text-sm font-medium">First name</label>

// Section Header
<h4 className="text-sm font-semibold tracking-wide">Demographics</h4>

// Descriptive Label in Detail View
<p className="text-sm font-medium">Date & time</p>

// Helper Text
<p className="text-sm text-neutral-500">15/140 characters</p>

// Error Message (ONLY USE OF text-xs)
<p className="text-xs text-destructive">This field is required</p>
```

### Incorrect Implementation
```tsx
// ❌ WRONG - Using text-xs for label
<label className="text-xs font-medium">First name</label>

// ❌ WRONG - Using text-xs for helper text
<p className="text-xs text-neutral-500">15/140 characters</p>

// ❌ WRONG - Using text-xs for descriptive labels
<p className="text-xs font-medium">Date & time</p>
```