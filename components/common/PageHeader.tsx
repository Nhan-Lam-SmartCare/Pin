import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

/**
 * PageHeader - Compact header component for each page
 * Replaces the global ModernHeader to save vertical space
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    actions,
    className = "",
}) => {
    return (
        <div
            className={`sticky top-0 z-20 apple-glass border-b border-black/5 dark:border-white/5 ${className}`}
        >
            <div className="flex items-center justify-between px-6 py-3">
                {/* Title Section */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-pin-gray-900 dark:text-white truncate">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-xs text-pin-gray-500 dark:text-pin-gray-400 mt-0.5 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Actions Section */}
                {actions && (
                    <div className="flex items-center gap-3 ml-4">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
