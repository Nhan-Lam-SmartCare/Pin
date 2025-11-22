import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils/cn";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full",
          sizeClasses[size],
          "bg-white dark:bg-pin-dark-200",
          "rounded-2xl shadow-2xl",
          "max-h-[90vh]",
          "animate-in zoom-in-95 fade-in duration-200",
          className
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4 z-10",
              "p-2 rounded-lg",
              "text-pin-gray-400 hover:text-pin-gray-600",
              "dark:text-pin-dark-500 dark:hover:text-pin-dark-700",
              "hover:bg-pin-gray-100 dark:hover:bg-pin-dark-300",
              "transition-colors duration-200"
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "px-6 py-5 border-b border-pin-gray-200 dark:border-pin-dark-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const ModalTitle: React.FC<ModalTitleProps> = ({
  children,
  subtitle,
  className,
}) => {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-pin-gray-900 dark:text-pin-dark-900">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-pin-gray-500 dark:text-pin-dark-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("px-6 py-6 overflow-y-auto", className)}>{children}</div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-pin-gray-200 dark:border-pin-dark-300",
        "flex items-center justify-end gap-3",
        "bg-pin-gray-50 dark:bg-pin-dark-100",
        className
      )}
    >
      {children}
    </div>
  );
};

// Dialog Component (Alternative to Modal with specific use case)
export interface DialogProps extends ModalProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "danger";
  loading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  onConfirm,
  variant = "default",
  loading = false,
  size = "sm",
  ...props
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} {...props}>
      {title && (
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
      )}
      {description && (
        <ModalBody>
          <p className="text-pin-gray-600 dark:text-pin-dark-600">
            {description}
          </p>
        </ModalBody>
      )}
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            "px-4 py-2 rounded-lg",
            "text-sm font-medium",
            "text-pin-gray-700 dark:text-pin-dark-700",
            "bg-white dark:bg-pin-dark-200",
            "border border-pin-gray-300 dark:border-pin-dark-400",
            "hover:bg-pin-gray-50 dark:hover:bg-pin-dark-300",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {cancelLabel}
        </button>
        {onConfirm && (
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-sm font-medium",
              "text-white",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              variant === "danger"
                ? "bg-pin-red-500 hover:bg-pin-red-600"
                : "bg-pin-blue-500 hover:bg-pin-blue-600"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              confirmLabel
            )}
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

// Drawer Component (Slide from side)
export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const drawerSizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  side = "right",
  size = "md",
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className={cn(
          "fixed top-0 bottom-0 w-full",
          drawerSizeClasses[size],
          "bg-white dark:bg-pin-dark-200",
          "shadow-2xl",
          "overflow-y-auto",
          side === "left" ? "left-0" : "right-0",
          side === "left"
            ? "animate-in slide-in-from-left duration-300"
            : "animate-in slide-in-from-right duration-300",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
