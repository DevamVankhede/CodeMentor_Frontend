"use client";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export default function Label({ 
  children, 
  className = "", 
  ...props 
}: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-text-primary ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}