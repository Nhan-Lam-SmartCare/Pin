import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils/cn";

export interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  return (
    <aside
      className={cn(
        "w-64 h-screen",
        "bg-white dark:bg-pin-dark-200",
        "border-r border-pin-gray-200 dark:border-pin-dark-300",
        "fixed left-0 top-0",
        "overflow-y-auto",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </aside>
  );
};

export interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "h-16 flex items-center px-6",
        "border-b border-pin-gray-200 dark:border-pin-dark-300",
        "bg-white dark:bg-pin-dark-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent: React.FC<SidebarContentProps> = ({
  children,
  className,
}) => {
  return <nav className={cn("p-4 space-y-1", className)}>{children}</nav>;
};

export interface SidebarGroupProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const SidebarGroup: React.FC<SidebarGroupProps> = ({
  label,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-pin-gray-500 dark:text-pin-dark-500 uppercase tracking-wider">
            {label}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
};

export interface SidebarItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  badge?: string | number;
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  badge,
  className,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg",
          "text-sm font-medium",
          "transition-all duration-200",
          isActive
            ? "bg-pin-blue-50 dark:bg-pin-blue-900/20 text-pin-blue-600 dark:text-pin-blue-400"
            : "text-pin-gray-700 dark:text-pin-dark-700 hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300",
          className
        )
      }
    >
      {icon && (
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full bg-pin-blue-100 dark:bg-pin-blue-900/30 text-pin-blue-700 dark:text-pin-blue-300">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0",
        "p-4 border-t border-pin-gray-200 dark:border-pin-dark-300",
        "bg-white dark:bg-pin-dark-200",
        className
      )}
    >
      {children}
    </div>
  );
};

// Collapsible Sidebar Item
export interface SidebarCollapsibleProps {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const SidebarCollapsible: React.FC<SidebarCollapsibleProps> = ({
  icon,
  label,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("space-y-1", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
          "text-sm font-medium",
          "text-pin-gray-700 dark:text-pin-dark-700",
          "hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300",
          "transition-all duration-200"
        )}
      >
        {icon && (
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        <svg
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="pl-8 space-y-1">{children}</div>}
    </div>
  );
};
