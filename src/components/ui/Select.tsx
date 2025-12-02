"use client";
import React from "react";

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Select({
  label,
  error,
  helperText,
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <select
        className={[
          "w-full px-3 py-2 rounded-lg border",
          "bg-slate-800 text-white placeholder-text-tertiary",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
          "appearance-none",
          "[&>option]:bg-slate-800 [&>option]:text-white",
          error ? "border-red-500" : "border-border-primary",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ colorScheme: 'dark' }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
}


