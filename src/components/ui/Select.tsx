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
          "w-full px-3 py-2 bg-surface-secondary border rounded-lg",
          "text-text-primary placeholder-text-tertiary",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          error ? "border-red-500" : "border-border-primary",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
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


