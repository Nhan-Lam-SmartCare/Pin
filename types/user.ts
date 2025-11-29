/**
 * User and Permission Types
 */

export type AllowedApp = "motocare" | "pincorp" | "both";

export type UserRole = "admin" | "manager" | "employee";

export interface UserPermissions {
  canViewProfitReports: boolean;
  canViewCostDetails: boolean;
  canViewFinancialSummary: boolean;
  canEditPricing: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loginPhone: string;
  password?: string;
  creationDate?: string;
  status: "active" | "inactive";
  departmentIds: string[];
  allowedApps?: AllowedApp;
  role?: UserRole;
  created_at?: string;
  address?: string;
  salaryBase?: number;
  allowance?: number;
  overtimeRate?: number;
  deductions?: number;
  payrollMethod?: "cash" | "bank";
  defaultPaymentSourceId?: string;
}

export type PermissionLevel = "all" | "restricted" | "none";

export interface ModulePermission {
  level: PermissionLevel;
  details?: { [key: string]: boolean };
}

export interface Permissions {
  [moduleKey: string]: ModulePermission | boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  permissions: Permissions;
  created_at?: string;
}

// Helper functions for permission checks
export const getUserPermissions = (user: User | null): UserPermissions => {
  if (!user) {
    return {
      canViewProfitReports: false,
      canViewCostDetails: false,
      canViewFinancialSummary: false,
      canEditPricing: false,
    };
  }

  const role = user.role || "employee";

  switch (role) {
    case "admin":
      return {
        canViewProfitReports: true,
        canViewCostDetails: true,
        canViewFinancialSummary: true,
        canEditPricing: true,
      };
    case "manager":
      return {
        canViewProfitReports: true,
        canViewCostDetails: true,
        canViewFinancialSummary: true,
        canEditPricing: false,
      };
    case "employee":
    default:
      return {
        canViewProfitReports: false,
        canViewCostDetails: false,
        canViewFinancialSummary: false,
        canEditPricing: false,
      };
  }
};

export const canViewProfitInfo = (user: User | null): boolean => {
  return getUserPermissions(user).canViewProfitReports;
};

export const canViewCostDetails = (user: User | null): boolean => {
  return getUserPermissions(user).canViewCostDetails;
};
