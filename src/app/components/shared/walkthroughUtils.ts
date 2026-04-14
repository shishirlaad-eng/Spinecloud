/**
 * Centralized walkthrough helpers shared across all modules.
 *
 * Walkthrough step order:
 *  1. branches
 *  2. roles
 *  3. providers
 *  4. questionnaires
 *  5. consentForms
 */

export const WALKTHROUGH_STEPS = [
  { id: "branches", route: "branches" },
  { id: "roles", route: "roles" },
  { id: "providers", route: "providers" },
  { id: "questionnaires", route: "questionnaires" },
  { id: "consentForms", route: "consentForms" },
] as const;

/** Returns the array of completed step IDs from localStorage */
export function getCompletedSteps(): string[] {
  try {
    const raw = localStorage.getItem("spinecloud_walkthrough_completed");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Returns true if the given module step has already been completed */
export function isStepCompleted(stepId: string): boolean {
  return getCompletedSteps().includes(stepId);
}

/**
 * Marks a step as completed and clears the active guide.
 * Returns the next uncompleted step's route (or null if all done).
 */
export function completeStep(stepId: string): string | null {
  const completed = getCompletedSteps();
  if (!completed.includes(stepId)) {
    completed.push(stepId);
    localStorage.setItem("spinecloud_walkthrough_completed", JSON.stringify(completed));
  }
  localStorage.removeItem("spinecloud_active_guide");

  // Find the next uncompleted step
  for (const step of WALKTHROUGH_STEPS) {
    if (!completed.includes(step.id)) {
      return step.route;
    }
  }
  return null; // All done
}

/** Returns the bubble step label (e.g. "Step 1") for a given module */
export function getStepLabel(stepId: string): string {
  const idx = WALKTHROUGH_STEPS.findIndex((s) => s.id === stepId);
  return idx >= 0 ? `Step ${idx + 1} of ${WALKTHROUGH_STEPS.length}` : "";
}
