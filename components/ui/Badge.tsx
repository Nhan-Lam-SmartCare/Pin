import React from "react";
import { cn } from "../../lib/utils/cn";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantClasses = {
  default:
    "bg-pin-gray-100 text-pin-gray-800 dark:bg-pin-dark-300 dark:text-pin-dark-700",
  primary:
    "bg-pin-blue-100 text-pin-blue-800 dark:bg-pin-blue-900/30 dark:text-pin-blue-400",
  success:
    "bg-pin-green-100 text-pin-green-800 dark:bg-pin-green-900/30 dark:text-pin-green-400",
  warning:
    "bg-pin-yellow-100 text-pin-yellow-800 dark:bg-pin-yellow-900/30 dark:text-pin-yellow-400",
  danger:
    "bg-pin-red-100 text-pin-red-800 dark:bg-pin-red-900/30 dark:text-pin-red-400",
  info: "bg-pin-blue-100 text-pin-blue-800 dark:bg-pin-blue-900/30 dark:text-pin-blue-400",
  neutral:
    "bg-pin-gray-100 text-pin-gray-800 dark:bg-pin-dark-300 dark:text-pin-dark-700",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

const dotColors = {
  default: "bg-pin-gray-500",
  primary: "bg-pin-blue-500",
  success: "bg-pin-green-500",
  warning: "bg-pin-yellow-500",
  danger: "bg-pin-red-500",
  info: "bg-pin-blue-500",
  neutral: "bg-pin-gray-500",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  icon,
  dot = false,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "rounded-full",
        "font-medium",
        "whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// Status Badge - specific for order/repair statuses
export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
}) => {
  const getVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("xong") || s.includes("hoàn thành") || s.includes("trả"))
      return "success";
    if (s.includes("đang") || s.includes("tiến hành")) return "info";
    if (s.includes("chờ") || s.includes("tiếp nhận")) return "warning";
    if (s.includes("hủy") || s.includes("lỗi")) return "danger";
    return "default";
  };

  const getIcon = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("xong") || s.includes("hoàn thành") || s.includes("trả"))
      return "✅";
    if (s.includes("đang") || s.includes("tiến hành")) return "🔧";
    if (s.includes("chờ") || s.includes("tiếp nhận")) return "⏳";
    if (s.includes("hủy") || s.includes("lỗi")) return "❌";
    return "📋";
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {getIcon(status)} {status}
    </Badge>
  );
};

// Payment Status Badge
export interface PaymentBadgeProps {
  status: "paid" | "unpaid" | "partial";
  amount?: number;
  depositAmount?: number;
  className?: string;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({
  status,
  amount,
  depositAmount,
  className,
}) => {
  // If unpaid but has deposit, show deposit info
  if (status === "unpaid" && depositAmount && depositAmount > 0) {
    return (
      <Badge variant="warning" dot className={className}>
        💰 Đã cọc {formatCurrency(depositAmount)}
        {amount && amount > 0 ? ` | Còn nợ ${formatCurrency(amount)}` : ""}
      </Badge>
    );
  }

  const variants = {
    paid: "success" as const,
    unpaid: "danger" as const,
    partial: "warning" as const,
  };

  const labels = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    partial: amount ? `Còn nợ ${formatCurrency(amount)}` : "Thanh toán 1 phần",
  };

  const icons = {
    paid: "✓",
    unpaid: "⚠",
    partial: "◐",
  };

  return (
    <Badge variant={variants[status]} dot className={className}>
      {icons[status]} {labels[status]}
    </Badge>
  );
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
