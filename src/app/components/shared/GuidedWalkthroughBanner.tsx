import { ArrowRight, Lightbulb } from "lucide-react";

interface GuidedWalkthroughBannerProps {
  title: string;
  description: string;
}

export function GuidedWalkthroughBanner({ title, description }: GuidedWalkthroughBannerProps) {
  return (
    <div className="mb-6 bg-primary-50 border border-primary-200 rounded-lg p-4 flex gap-4 items-start shadow-sm">
      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
        <Lightbulb className="w-5 h-5 text-primary-600" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-primary-900 mb-1">{title}</h3>
        <p className="text-sm text-primary-700">{description}</p>
      </div>
      <div className="ml-auto shrink-0 flex items-center pr-2">
        <div className="animate-pulse flex items-center text-primary-600 font-medium text-sm gap-2 mt-2 border border-primary-300 rounded-full px-4 py-1.5 bg-white shadow-sm">
          <span>Action Required</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
