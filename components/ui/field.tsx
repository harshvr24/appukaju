import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputClasses =
  "w-full rounded-2xl border border-chocolate/15 bg-cream/60 px-5 py-3.5 text-sm text-chocolate placeholder:text-chocolate/35 transition-all duration-300 focus:border-gold focus:bg-cream focus:shadow-soft outline-none";

interface FieldWrapProps {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrap({ label, error, htmlFor, children, className }: FieldWrapProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-xs font-medium tracking-wide text-chocolate/70">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputClasses, className)} {...props} />
  )
);
TextInput.displayName = "TextInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} rows={4} className={cn(inputClasses, "resize-none", className)} {...props} />
  )
);
TextArea.displayName = "TextArea";
