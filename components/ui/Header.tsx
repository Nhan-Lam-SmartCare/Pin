import React from "react";
import { cn } from "../../lib/utils/cn";

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  withSidebar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  children,
  className,
  sticky = true,
  withSidebar = false,
}) => {
  return (
    <header
      className={cn(
        "h-16",
        "bg-white dark:bg-pin-dark-200",
        "border-b border-pin-gray-200 dark:border-pin-dark-300",
        "px-6",
        "flex items-center justify-between",
        "transition-all duration-200",
        sticky && "sticky top-0 z-30",
        withSidebar && "ml-64",
        className
      )}
    >
      {children}
    </header>
  );
};

export interface HeaderSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const HeaderLeft: React.FC<HeaderSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-4", className)}>{children}</div>
  );
};

export const HeaderCenter: React.FC<HeaderSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-4 flex-1", className)}>
      {children}
    </div>
  );
};

export const HeaderRight: React.FC<HeaderSectionProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
};

export interface HeaderTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
  children,
  subtitle,
  className,
}) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <h1 className="text-xl font-bold text-pin-gray-900 dark:text-pin-dark-900">
        {children}
      </h1>
      {subtitle && (
        <p className="text-sm text-pin-gray-500 dark:text-pin-dark-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export interface HeaderSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("relative max-w-md w-full", className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pin-gray-400 dark:text-pin-dark-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "w-full pl-10 pr-4 py-2",
          "bg-pin-gray-50 dark:bg-pin-dark-100",
          "border border-transparent",
          "rounded-lg",
          "text-sm text-pin-gray-900 dark:text-pin-dark-900",
          "placeholder:text-pin-gray-400 dark:placeholder:text-pin-dark-500",
          "focus:outline-none focus:ring-2 focus:ring-pin-blue-500 focus:bg-white dark:focus:bg-pin-dark-200",
          "transition-all duration-200"
        )}
      />
    </div>
  );
};

export interface HeaderBadgeProps {
  count?: number;
  children: React.ReactNode;
  className?: string;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  count,
  children,
  className,
}) => {
  return (
    <button
      className={cn(
        "relative p-2 rounded-lg",
        "text-pin-gray-600 dark:text-pin-dark-600",
        "hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300",
        "transition-colors duration-200",
        className
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pin-red-500 rounded-full">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
};

export interface HeaderAvatarProps {
  src?: string;
  name: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

export const HeaderAvatar: React.FC<HeaderAvatarProps> = ({
  src,
  name,
  subtitle,
  onClick,
  className,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg",
        "hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300",
        "transition-colors duration-200",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pin-blue-500 to-pin-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
      )}
      <div className="text-left">
        <div className="text-sm font-medium text-pin-gray-900 dark:text-pin-dark-900">
          {name}
        </div>
        {subtitle && (
          <div className="text-xs text-pin-gray-500 dark:text-pin-dark-500">
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
};

// Mobile Header with Menu Toggle
export interface MobileHeaderProps {
  children?: React.ReactNode;
  onMenuToggle?: () => void;
  className?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  children,
  onMenuToggle,
  className,
}) => {
  return (
    <header
      className={cn(
        "h-14",
        "bg-white dark:bg-pin-dark-200",
        "border-b border-pin-gray-200 dark:border-pin-dark-300",
        "px-4",
        "flex items-center justify-between",
        "sticky top-0 z-30",
        "lg:hidden",
        className
      )}
    >
      <button
        onClick={onMenuToggle}
        className="p-2 -ml-2 rounded-lg hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300 transition-colors"
      >
        <svg
          className="w-6 h-6 text-pin-gray-600 dark:text-pin-dark-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {children}
    </header>
  );
};
