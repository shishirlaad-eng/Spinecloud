import { X, ArrowRight } from "lucide-react";

interface TooltipBubbleProps {
  /** Step label shown in badge, e.g. "Step 1" */
  step: string;
  /** Short bold title */
  title: string;
  /** Longer description text */
  description: string;
  /** Which side of the wrapper the bubble should appear on */
  side?: "bottom" | "right" | "left";
  /** Whether the bubble is visible */
  visible: boolean;
  /** Called when user clicks the × dismiss button */
  onDismiss: () => void;
}

/**
 * A floating tooltip bubble that appears beside a button to guide the user.
 * Wrap your target button in a `relative` container and render <TooltipBubble> as a sibling.
 *
 * Example:
 *   <div className="relative inline-block">
 *     <button>Add Branch</button>
 *     <TooltipBubble step="Step 1" title="Add a Branch" description="..." visible={show} onDismiss={...} />
 *   </div>
 */
export function TooltipBubble({
  step,
  title,
  description,
  side = "bottom",
  visible,
  onDismiss,
}: TooltipBubbleProps) {
  if (!visible) return null;

  // Positioning classes depending on side
  const positionClasses: Record<NonNullable<TooltipBubbleProps["side"]>, string> = {
    bottom:
      "top-full left-0 mt-3",
    right:
      "left-full top-1/2 -translate-y-1/2 ml-4",
    left:
      "right-full top-1/2 -translate-y-1/2 mr-4",
  };

  // Arrow/caret classes
  const caretClasses: Record<NonNullable<TooltipBubbleProps["side"]>, string> = {
    bottom:
      "absolute -top-[7px] left-5 w-3.5 h-3.5 bg-primary-600 rotate-45 rounded-sm",
    right:
      "absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary-600 rotate-45 rounded-sm",
    left:
      "absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary-600 rotate-45 rounded-sm",
  };

  return (
    <div
      className={`absolute z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-300 ${positionClasses[side]}`}
    >
      {/* Caret arrow */}
      <div className={caretClasses[side]} />

      {/* Bubble body */}
      <div className="relative bg-primary-600 text-white rounded-xl shadow-xl px-4 py-3.5">
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Dismiss guide"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Step badge */}
        <span className="inline-block text-xs font-semibold bg-white/20 rounded-full px-2.5 py-0.5 mb-2">
          {step}
        </span>

        {/* Title */}
        <p className="text-sm font-semibold leading-snug mb-1">{title}</p>

        {/* Description */}
        <p className="text-xs text-primary-100 leading-relaxed mb-3">{description}</p>

        {/* Call-to-action hint */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary-100">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>Click the button above</span>
        </div>
      </div>
    </div>
  );
}
