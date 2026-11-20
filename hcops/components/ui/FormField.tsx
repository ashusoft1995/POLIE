"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

/* ─────────────────────────────────────────────────────
   FormField — wraps label + input/select/textarea + error
───────────────────────────────────────────────────── */

interface BaseProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  icon?: ReactNode;
}

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "as"> & {
    as?: "input";
  };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "as"> & {
    as: "textarea";
    rows?: number;
  };

type SelectProps = BaseProps & {
  as: "select";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  children: ReactNode;
  id?: string;
  name?: string;
};

type FieldProps = InputProps | TextareaProps | SelectProps;

export default function FormField(props: FieldProps) {
  const { label, error, hint, required, className = "", icon } = props;
  const id = (props as any).id ?? (props as any).name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-[11px] font-semibold text-[var(--slate)] uppercase tracking-wide flex items-center gap-1">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {props.as === "textarea" ? (
        <textarea
          id={id}
          {...(props as TextareaProps)}
          rows={(props as TextareaProps).rows ?? 3}
          className={`input h-auto px-3 py-2 resize-none text-sm ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""
          }`}
        />
      ) : props.as === "select" ? (
        <select
          id={id}
          value={(props as SelectProps).value}
          onChange={(props as SelectProps).onChange}
          disabled={(props as SelectProps).disabled}
          name={(props as SelectProps).name}
          className={`input text-sm appearance-none ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""
          }`}
        >
          {(props as SelectProps).children}
        </select>
      ) : (
        <input
          id={id}
          {...(props as InputProps)}
          className={`input text-sm ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""
          }`}
        />
      )}

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-500 font-medium mt-0.5">
          <AlertCircle size={11} className="shrink-0" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[11px] text-[var(--muted)] mt-0.5">{hint}</p>
      )}
    </div>
  );
}
