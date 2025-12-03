import React from "react";
import { MobileLayout } from "./MobileLayout";
import { DesktopLayout } from "./DesktopLayout";
import { useMediaQuery } from "../../lib/hooks/useMediaQuery";
import type { CurrentUser } from "../../contexts/types";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  currentUser: CurrentUser;
  onSwitchApp: () => void;
}

/**
 * ResponsiveLayout - Automatically switches between Mobile and Desktop layouts
 * based on screen width.
 *
 * Breakpoint: 768px (md in Tailwind)
 * - Below 768px: MobileLayout with bottom nav, drawer, etc.
 * - Above 768px: DesktopLayout with top nav
 */
export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  currentUser,
  onSwitchApp,
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <MobileLayout currentUser={currentUser} onSwitchApp={onSwitchApp}>
        {children}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout currentUser={currentUser} onSwitchApp={onSwitchApp}>
      {children}
    </DesktopLayout>
  );
};

export default ResponsiveLayout;
