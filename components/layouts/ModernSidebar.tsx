import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";
import {
    CubeIcon,
    BeakerIcon,
    WrenchScrewdriverIcon,
    TagIcon,
    ShoppingCartIcon,
    ChartBarIcon,
    BanknotesIcon,
    SparklesIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    DocumentChartBarIcon,
    QuestionMarkCircleIcon,
    TruckIcon,
} from "../common/Icons";

interface SidebarItemProps {
    to: string;
    icon: React.ReactElement;
    label: string;
    isCollapsed: boolean;
    color?: string;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    to,
    icon,
    label,
    isCollapsed,
    color = "text-pin-blue-500",
    onClick,
}) => {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                `flex ${isCollapsed ? 'flex-col items-center py-3 px-1' : 'flex-row items-center gap-2.5 px-2.5 py-2'} my-0.5 rounded-lg transition-all duration-200 group relative text-sm ${isActive
                    ? "bg-blue-500 text-white font-medium shadow-sm shadow-blue-500/20"
                    : "text-pin-gray-600 dark:text-pin-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <div
                        className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex items-center justify-center transition-colors duration-200 ${isActive ? "text-white" : color
                            }`}
                    >
                        {icon}
                    </div>

                    <div
                        className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed
                            ? "text-[9px] font-medium mt-1 text-center leading-tight"
                            : "w-auto opacity-100"
                            }`}
                    >
                        {label}
                    </div>

                    {!isCollapsed && isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    )}
                </>
            )}
        </NavLink>
    );
};

export const ModernSidebar: React.FC<{
    currentUser: any;
    onSwitchApp: () => void;
}> = ({ currentUser, onSwitchApp }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const navGroups = [
        {
            title: "Kinh doanh",
            items: [
                { to: "/sales", icon: <ShoppingCartIcon className="w-4 h-4" />, label: "Bán hàng", color: "text-emerald-500" },
                { to: "/products", icon: <TagIcon className="w-4 h-4" />, label: "Sản phẩm", color: "text-amber-500" },
                { to: "/delivery", icon: <TruckIcon className="w-4 h-4" />, label: "Giao hàng", color: "text-orange-500" },
            ],
        },
        {
            title: "Sản xuất & Kho",
            items: [
                { to: "/materials", icon: <CubeIcon className="w-4 h-4" />, label: "Kho vật tư", color: "text-teal-500" },
                { to: "/boms", icon: <BeakerIcon className="w-4 h-4" />, label: "Sản xuất", color: "text-rose-500" },
                { to: "/repairs", icon: <WrenchScrewdriverIcon className="w-4 h-4" />, label: "Sửa chữa", color: "text-pink-500" },
            ],
        },
        {
            title: "Quản trị",
            items: [
                { to: "/financial", icon: <BanknotesIcon className="w-5 h-5" />, label: "Tài chính", color: "text-cyan-500" },
                { to: "/receivables", icon: <BanknotesIcon className="w-5 h-5" />, label: "Công nợ", color: "text-indigo-500" },
                { to: "/reports", icon: <ChartBarIcon className="w-5 h-5" />, label: "Báo cáo", color: "text-violet-500" },
                { to: "/analytics", icon: <SparklesIcon className="w-5 h-5" />, label: "Phân tích AI", color: "text-purple-500" },
            ],
        },
    ];

    return (
        <aside
            className={`h-[94vh] my-[3vh] ml-3 apple-glass rounded-xl flex flex-col transition-all duration-300 z-30 hidden lg:flex shadow-md ${isCollapsed ? "w-20" : "w-52"
                }`}
        >
            {/* Header / Logo */}
            <div className="h-12 flex items-center justify-center relative border-b border-black/5 dark:border-white/5 mx-3">
                <div className={`transition-all duration-300 flex items-center gap-2 ${isCollapsed ? "scale-0 w-0" : "scale-100 w-auto"}`}>
                    <Logo size={24} />
                    <span className="font-bold text-sm text-pin-gray-800 dark:text-white tracking-tight">PIN Corp</span>
                </div>

                {isCollapsed && <Logo size={24} className="absolute" />}

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-pin-dark-100 border border-pin-gray-200 dark:border-pin-dark-300 rounded-full flex items-center justify-center shadow-sm text-pin-gray-500 hover:text-pin-blue-500 transition-colors"
                >
                    {isCollapsed ? <ChevronRightIcon className="w-2.5 h-2.5" /> : <ChevronLeftIcon className="w-2.5 h-2.5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3 no-scrollbar hover:show-scrollbar">
                {navGroups.map((group, idx) => (
                    <div key={idx}>
                        {!isCollapsed && (
                            <h3 className="px-3 mb-1 text-[10px] font-semibold text-pin-gray-400 dark:text-pin-gray-500 uppercase tracking-wider">
                                {group.title}
                            </h3>
                        )}
                        <div className="space-y-0">
                            {group.items.map((item) => (
                                <SidebarItem
                                    key={item.to}
                                    to={item.to}
                                    icon={item.icon}
                                    label={item.label}
                                    color={item.color}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                        {!isCollapsed && idx < navGroups.length - 1 && <div className="my-2 border-t border-dashed border-pin-gray-200 dark:border-pin-dark-300 mx-2" />}
                    </div>
                ))}
            </nav>

            {/* Footer / User Wrapper */}
            <div className="p-2 border-t border-pin-gray-100 dark:border-pin-dark-300">
                <div className={`flex items-center gap-2 p-1.5 rounded-lg bg-pin-gray-50 dark:bg-pin-dark-100 transition-all ${isCollapsed ? "justify-center" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pin-blue-500 to-pin-blue-400 flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "flex-1 w-auto"}`}>
                        <p className="text-[11px] font-semibold text-pin-gray-800 dark:text-white truncate">{currentUser?.name}</p>
                        <button onClick={onSwitchApp} className="text-[9px] text-pin-gray-500 hover:text-pin-blue-500 truncate flex items-center gap-0.5">
                            <HomeIcon className="w-2.5 h-2.5" /> Chuyển App
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};
