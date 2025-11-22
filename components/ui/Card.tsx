import React from "react";
import { cn } from "../../lib/utils/cn";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = "md",
  hover = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-pin-dark-200",
        "rounded-xl",
        "shadow-sm",
        "border border-pin-gray-200 dark:border-pin-dark-300",
        "transition-all duration-200",
        "overflow-hidden",
        paddingClasses[padding],
        hover && "hover:shadow-md cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-b border-pin-gray-200 dark:border-pin-dark-300",
        "pb-4 mb-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  subtitle,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pin-blue-50 dark:bg-pin-blue-900/20 flex items-center justify-center text-pin-blue-600 dark:text-pin-blue-400">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-pin-gray-900 dark:text-pin-dark-900">
            {children}
          </h3>
          {subtitle && (
            <p className="text-sm text-pin-gray-500 dark:text-pin-dark-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "border-t border-pin-gray-200 dark:border-pin-dark-300",
        "pt-4 mt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

// Stats Card Component
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses = {
  default: "from-pin-gray-500 to-pin-gray-600",
  primary: "from-pin-blue-500 to-pin-blue-600",
  success: "from-pin-green-500 to-pin-green-600",
  warning: "from-pin-orange-500 to-pin-orange-600",
  danger: "from-pin-red-500 to-pin-red-600",
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = "primary",
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "bg-gradient-to-br",
        variantClasses[variant],
        "text-white",
        "rounded-xl p-6",
        "shadow-lg",
        className
      )}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "font-semibold",
                trend.value >= 0 ? "text-white" : "text-white/70"
              )}
            >
              {trend.value >= 0 ? "↗" : "↘"} {Math.abs(trend.value)}%
            </span>
            <span className="text-white/70">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Grid layout for cards
export interface CardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

const gridColsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export const CardGrid: React.FC<CardGridProps> = ({
  children,
  cols = 3,
  className,
}) => {
  return (
    <div className={cn("grid gap-6", gridColsClasses[cols], className)}>
      {children}
    </div>
  );
};
