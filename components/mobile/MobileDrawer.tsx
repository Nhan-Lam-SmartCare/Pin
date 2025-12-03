import React, { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import {
  XMarkIcon,
  CubeIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  CpuChipIcon,
  BanknotesIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  DocumentChartBarIcon,
  TrashIcon,
  UserCircleIcon,
} from "../common/Icons";
import { ThemeToggle } from "../ThemeToggle";
import type { CurrentUser } from "../../contexts/types";
import { supabase } from "../../supabaseClient";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onSwitchApp: () => void;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  adminOnly?: boolean;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchApp,
}) => {
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const navGroups: NavGroup[] = [
    {
      title: "Bán hàng",
      items: [
        {
          to: "/sales",
          icon: <ShoppingCartIcon className="w-5 h-5 text-emerald-500" />,
          label: "Bán hàng",
          color: "text-emerald-500",
        },
        {
          to: "/products",
          icon: <TagIcon className="w-5 h-5 text-amber-500" />,
          label: "Sản phẩm",
          color: "text-amber-500",
        },
      ],
    },
    {
      title: "Sản xuất",
      items: [
        {
          to: "/materials",
          icon: <CubeIcon className="w-5 h-5 text-teal-500" />,
          label: "Vật liệu",
          color: "text-teal-500",
        },
        {
          to: "/boms",
          icon: <BeakerIcon className="w-5 h-5 text-rose-500" />,
          label: "Sản xuất",
          color: "text-rose-500",
        },
        {
          to: "/repairs",
          icon: <WrenchScrewdriverIcon className="w-5 h-5 text-pink-500" />,
          label: "Sửa chữa",
          color: "text-pink-500",
        },
      ],
    },
    {
      title: "Tài chính & Báo cáo",
      items: [
        {
          to: "/financial",
          icon: <BanknotesIcon className="w-5 h-5 text-cyan-500" />,
          label: "Tài chính",
          color: "text-cyan-500",
        },
        {
          to: "/receivables",
          icon: <BanknotesIcon className="w-5 h-5 text-amber-500" />,
          label: "Công nợ",
          color: "text-amber-500",
        },
        {
          to: "/reports",
          icon: <ChartBarIcon className="w-5 h-5 text-violet-500" />,
          label: "Báo cáo",
          color: "text-violet-500",
        },
        {
          to: "/analytics",
          icon: <SparklesIcon className="w-5 h-5 text-purple-500" />,
          label: "Phân tích",
          color: "text-purple-500",
        },
      ],
    },
    {
      title: "Nâng cao",
      items: [
        {
          to: "/predictive",
          icon: <CpuChipIcon className="w-5 h-5 text-indigo-500" />,
          label: "AI Dự đoán",
          color: "text-indigo-500",
        },
        {
          to: "/cost-analysis",
          icon: <DocumentChartBarIcon className="w-5 h-5 text-slate-500" />,
          label: "Chi phí SX",
          color: "text-slate-500",
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      onClose();
      navigate("/login");
    }
  };

  const isAdmin = currentUser?.departmentIds?.includes("dept_admin");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 bottom-0 w-[280px] max-w-[85vw] bg-white dark:bg-slate-800 z-50 transform transition-transform duration-300 ease-out shadow-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 safe-area-inset-top">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100">PIN Corp</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quản lý kho Pin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 bg-gradient-to-r from-sky-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-sm text-white/80 truncate">{currentUser.email || "Nhân viên"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[calc(100vh-280px)]">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <div>
              <h3 className="px-3 mb-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
                Admin
              </h3>
              <NavLink
                to="/production-reset"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                <span className="font-medium">Production Reset</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 space-y-2 safe-area-inset-bottom">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          >
            <CogIcon className="w-5 h-5 text-slate-500" />
            <span className="font-medium">Cài đặt</span>
          </NavLink>

          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Giao diện</span>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
