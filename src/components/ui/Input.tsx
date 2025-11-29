"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  // Add specific props to avoid empty interface error
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ 
  label,
  error,
  helperText,
  className = "",
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 bg-surface-secondary border rounded-lg
          text-text-primary placeholder-text-tertiary
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error ? 'border-red-500' : 'border-border-primary'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
}