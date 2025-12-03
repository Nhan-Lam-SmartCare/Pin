import React from "react";
import { PinTopNav } from "../PinSidebar";
import type { CurrentUser } from "../../contexts/types";

interface DesktopLayoutProps {
  children: React.ReactNode;
  currentUser: CurrentUser;
  onSwitchApp: () => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  currentUser,
  onSwitchApp,
}) => {
  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      {/* Desktop Top Nav */}
      <div className="print:hidden">
        <PinTopNav currentUser={currentUser} onSwitchApp={onSwitchApp} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto p-3 lg:p-4">{children}</main>
      </div>
    </div>
  );
};

export default DesktopLayout;
