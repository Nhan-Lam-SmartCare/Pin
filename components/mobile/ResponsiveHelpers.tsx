import React from "react";
import { useIsMobile } from "../../lib/hooks/useMediaQuery";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

/**
 * Container that applies different styles based on screen size
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  mobileClassName = "",
  desktopClassName = "",
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${className} ${isMobile ? mobileClassName : desktopClassName}`}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  mobileColumns?: 1 | 2 | 3 | 4;
  desktopColumns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
}

/**
 * Responsive grid that changes columns based on screen size
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = "",
  mobileColumns = 2,
  desktopColumns = 4,
  gap = "md",
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const mobileColClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const desktopColClasses = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
    6: "md:grid-cols-6",
  };

  return (
    <div
      className={`grid ${mobileColClasses[mobileColumns]} ${desktopColClasses[desktopColumns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
};

interface MobileOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Renders children only on mobile devices
 */
export const MobileOnly: React.FC<MobileOnlyProps> = ({ children, fallback = null }) => {
  const isMobile = useIsMobile();
  return <>{isMobile ? children : fallback}</>;
};

/**
 * Renders children only on desktop devices
 */
export const DesktopOnly: React.FC<MobileOnlyProps> = ({ children, fallback = null }) => {
  const isMobile = useIsMobile();
  return <>{!isMobile ? children : fallback}</>;
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  mobileDirection?: "row" | "col";
  desktopDirection?: "row" | "col";
  gap?: "sm" | "md" | "lg";
}

/**
 * Stack that changes direction based on screen size
 */
export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className = "",
  mobileDirection = "col",
  desktopDirection = "row",
  gap = "md",
}) => {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const mobileDir = mobileDirection === "row" ? "flex-row" : "flex-col";
  const desktopDir = desktopDirection === "row" ? "md:flex-row" : "md:flex-col";

  return (
    <div className={`flex ${mobileDir} ${desktopDir} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  MobileOnly,
  DesktopOnly,
  ResponsiveStack,
};
