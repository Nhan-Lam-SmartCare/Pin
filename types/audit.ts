/**
 * Audit and Logging Types
 */

export interface AuditLog {
  id: string;
  table_name: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  record_id: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changed_fields?: string[];
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditStats {
  table_name: string;
  operation: string;
  count: number;
}

export interface AuditTrailItem {
  id: string;
  operation: "INSERT" | "UPDATE" | "DELETE";
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changed_fields?: string[];
  user_email?: string;
  created_at: string;
}
