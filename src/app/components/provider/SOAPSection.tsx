import { useState } from "react";

interface SOAPSectionProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isReadOnly: boolean;
  actionButton?: React.ReactNode;
}

export function SOAPSection({
  title,
  value,
  onChange,
  placeholder,
  isReadOnly,
  actionButton,
}: SOAPSectionProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`group relative transition-all ${
        isFocused
          ? "ring-2 ring-primary-500/20 dark:ring-primary-500/30"
          : ""
      }`}
    >
      <div className="absolute -top-2 left-3 px-2 bg-white dark:bg-neutral-900 z-10">
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          {title}
        </label>
      </div>
      {actionButton && (
        <div className="absolute -top-3 right-3 z-10">
          {actionButton}
        </div>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isReadOnly}
          rows={6}
          className="w-full px-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all resize-y disabled:opacity-60 disabled:cursor-not-allowed min-h-[140px]"
        />
      </div>
    </div>
  );
}
