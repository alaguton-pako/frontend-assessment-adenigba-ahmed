"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "outline",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded transition-colors font-medium";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300",
    outline:
      "border border-gray-300 cursor-pointer bg-white text-gray-500 hover:text-gray-800 disabled:opacity-50",
    ghost:
      "text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
