"use client";
import React from "react";
// Removed motion import
import "@/styles/button.css"; // Import the new CSS file

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  readonly size?: "sm" | "md" | "lg" | "xl" | "icon";
  readonly loading?: boolean;
  readonly leftIcon?: React.ReactNode;
  readonly rightIcon?: React.ReactNode;
  readonly fullWidth?: boolean;
  readonly iconOnly?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  iconOnly = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  // Removed scaleHover and scaleTap calculations

  return (
    <button
      className={[
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && "btn-full-width",
        iconOnly && "btn-icon-only",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="btn-loading-spinner" />}

      {!loading && leftIcon && !iconOnly && (
        <span className="flex-shrink-0 mr-2">{leftIcon}</span>
      )}

      {!iconOnly && (
        <span className={loading ? "opacity-0" : "opacity-100"}>
          {children}
        </span>
      )}

      {iconOnly && children}

      {!loading && rightIcon && !iconOnly && (
        <span className="flex-shrink-0 ml-2">{rightIcon}</span>
      )}
    </button>
  );
}
