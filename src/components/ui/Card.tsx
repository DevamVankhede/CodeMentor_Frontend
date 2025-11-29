"use client";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/card.css"; // Import the new CSS file

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  children: React.ReactNode;
}

export default function Card({
  variant = "default",
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      className={[
        "card",
        `card-${variant}`,
        `card-p-${padding}`,
        hover && "card-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Card sub-components
export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["card-header", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={["card-title", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={["card-description", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["card-content", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["card-footer", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
