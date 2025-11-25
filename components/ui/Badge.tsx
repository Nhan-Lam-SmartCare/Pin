import React from "react";
import { cn } from "../../lib/utils/cn";
import { Icon, IconName, IconTone } from "../common/Icon";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
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

const variantIconMap: Record<BadgeVariant, IconName> = {
  default: "info",
  primary: "info",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "info",
};

const variantToneMap: Record<BadgeVariant, IconTone> = {
  default: "default",
  primary: "primary",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "muted",
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

  const getIconName = (variant: BadgeVariant): IconName => {
    if (variant === "success") return "success";
    if (variant === "warning") return "pending";
    if (variant === "danger") return "danger";
    if (variant === "info") return "repairs";
    return "orders";
  };

  const variant = getVariant(status);

  return (
    <Badge
      variant={variant}
      className={className}
      icon={
        <Icon
          name={getIconName(variant)}
          tone={variantToneMap[variant]}
          size="sm"
        />
      }
    >
      {status}
    </Badge>
  );
};

// Payment Status Badge
export interface PaymentBadgeProps {
  status: "paid" | "unpaid" | "partial";
  amount?: number;
  depositAmount?: number;
  paidAmount?: number;
  className?: string;
}

export const PaymentBadge: React.FC<PaymentBadgeProps> = ({
  status,
  amount,
  depositAmount,
  paidAmount,
  className,
}) => {
  const baseVariants = {
    paid: "success" as BadgeVariant,
    unpaid: "danger" as BadgeVariant,
    partial: "warning" as BadgeVariant,
  };

  const labels = {
    paid: "Đã thanh toán",
    unpaid: "Chưa thanh toán",
    partial: "Thanh toán 1 phần",
  };

  const outstandingAmount =
    status !== "paid" && amount && amount > 0 ? amount : undefined;
  const depositInfo =
    status !== "paid" && depositAmount && depositAmount > 0
      ? `Đã cọc ${formatCurrency(depositAmount)}`
      : undefined;
  const paidInfo =
    status !== "paid" && paidAmount && paidAmount > 0
      ? `Đã trả ${formatCurrency(paidAmount)}`
      : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Badge
        variant={baseVariants[status]}
        size="sm"
        icon={
          <Icon
            name={variantIconMap[baseVariants[status]]}
            tone={variantToneMap[baseVariants[status]]}
            size="sm"
          />
        }
      >
        {labels[status]}
      </Badge>
      {depositInfo && (
        <Badge
          variant="neutral"
          size="sm"
          icon={<Icon name="money" tone="primary" size="sm" />}
        >
          {depositInfo}
        </Badge>
      )}
      {paidInfo && (
        <Badge
          variant="success"
          size="sm"
          icon={<Icon name="money" tone="success" size="sm" />}
        >
          {paidInfo}
        </Badge>
      )}
      {outstandingAmount && (
        <Badge
          variant={status === "partial" ? "warning" : "danger"}
          size="sm"
          icon={
            <Icon
              name={status === "partial" ? "warning" : "danger"}
              tone={status === "partial" ? "warning" : "danger"}
              size="sm"
            />
          }
        >
          Còn nợ {formatCurrency(outstandingAmount)}
        </Badge>
      )}
    </div>
  );
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
