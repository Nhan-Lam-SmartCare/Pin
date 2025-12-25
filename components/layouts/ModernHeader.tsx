import React, { useState } from "react";
import {
    MagnifyingGlassIcon,
    BellIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
} from "../common/Icons";
import { ThemeToggle } from "../ThemeToggle";
import type { CurrentUser } from "../../contexts/types";

interface ModernHeaderProps {
    currentUser: CurrentUser;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ currentUser }) => {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header className="sticky top-0 z-20 apple-glass border-b border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between px-4 h-12">
                {/* Search Bar - Compact */}
                <div className="flex-1 max-w-md">
                    <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-pin-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm nhanh (Ctrl+K)..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="w-full pl-9 pr-12 py-1.5 text-sm bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg text-pin-gray-900 dark:text-white placeholder-pin-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-pin-gray-500 bg-white/80 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right Actions - Compact */}
                <div className="flex items-center gap-1 ml-4">
                    {/* Dark Mode Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <button
                        className="p-2 rounded-lg text-pin-gray-600 dark:text-pin-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative"
                        title="Thông báo"
                    >
                        <BellIcon className="w-4 h-4" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
                    </button>

                    {/* Help */}
                    <button
                        className="p-2 rounded-lg text-pin-gray-600 dark:text-pin-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title="Trợ giúp"
                    >
                        <QuestionMarkCircleIcon className="w-4 h-4" />
                    </button>

                    {/* Settings */}
                    <button
                        className="p-2 rounded-lg text-pin-gray-600 dark:text-pin-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title="Cài đặt"
                    >
                        <Cog6ToothIcon className="w-4 h-4" />
                    </button>

                    {/* User Avatar */}
                    <div className="ml-2 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-pin-gray-900 dark:text-white hidden md:block">
                            {currentUser?.name}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ModernHeader;
