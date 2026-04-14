import { ArrowLeft } from "lucide-react";

interface AuthHeaderProps {
  onBack?: () => void;
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
}

export function AuthHeader({ 
  onBack, 
  showLogo = true,
  title,
  subtitle,
  description 
}: AuthHeaderProps) {
  return (
    <div className="px-6 pt-6 pb-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
      )}

      {/* Logo and Title */}
      {showLogo && (
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
            {title || "SpineCloudIQ"}
          </h1>
          <div className="w-12 h-1 bg-primary-600 mx-auto mt-2 rounded-full"></div>
        </div>
      )}

      {/* Subtitle and Description */}
      {(subtitle || description) && (
        <div className="text-center mt-6">
          {subtitle && (
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}