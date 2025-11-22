import React from "react";
import { cn } from "../../lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-pin-blue-500 hover:bg-pin-blue-600 active:bg-pin-blue-700
    text-white
    shadow-sm hover:shadow-md
    border border-transparent
    focus:ring-pin-blue-500
  `,
  secondary: `
    bg-white hover:bg-pin-gray-50 active:bg-pin-gray-100
    dark:bg-pin-dark-200 dark:hover:bg-pin-dark-300 dark:active:bg-pin-dark-400
    text-pin-gray-700 dark:text-pin-dark-700
    border border-pin-gray-300 dark:border-pin-dark-400
    shadow-sm
    focus:ring-pin-gray-300
  `,
  danger: `
    bg-pin-red-500 hover:bg-pin-red-600 active:bg-pin-red-700
    text-white
    shadow-sm hover:shadow-md
    border border-transparent
    focus:ring-pin-red-500
  `,
  success: `
    bg-pin-green-500 hover:bg-pin-green-600 active:bg-pin-green-600
    text-white
    shadow-sm hover:shadow-md
    border border-transparent
    focus:ring-pin-green-500
  `,
  ghost: `
    bg-transparent hover:bg-pin-gray-100 active:bg-pin-gray-200
    dark:hover:bg-pin-dark-300 dark:active:bg-pin-dark-400
    text-pin-gray-700 dark:text-pin-dark-700
    border border-transparent
    focus:ring-pin-gray-300
  `,
  link: `
    bg-transparent hover:bg-transparent active:bg-transparent
    text-pin-blue-500 hover:text-pin-blue-600 dark:text-pin-blue-400
    border border-transparent
    shadow-none
    focus:ring-0
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "font-medium rounded-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
