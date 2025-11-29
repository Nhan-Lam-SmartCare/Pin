// Types for MaterialManager components

export interface MaterialItem {
  id: number;
  name: string;
  sku: string;
  unit: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  quantity: number;
  totalCost: number;
}

export interface StockHistory {
  id: string;
  material_id: string;
  transaction_type: "import" | "export" | "adjustment";
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reason: string;
  created_at: string;
  created_by: string;
  invoice_number?: string;
  supplier?: string;
}

export interface StockAdjustment {
  material_id: string;
  current_stock: number;
  actual_stock: number;
  reason: string;
  note?: string;
}

export interface StockForecast {
  material_id: string;
  material_name: string;
  current_stock: number;
  average_monthly_consumption: number;
  forecasted_stock_30_days: number;
  forecasted_stock_60_days: number;
  forecasted_stock_90_days: number;
  recommended_reorder_date: string;
  recommended_reorder_quantity: number;
  risk_level: "low" | "medium" | "high" | "critical";
  trend: "increasing" | "stable" | "decreasing";
  seasonal_factor?: number;
}

export interface SupplierPriceAnalysis {
  material_id: string;
  material_name: string;
  suppliers: SupplierPrice[];
  price_trend: "rising" | "falling" | "stable";
  average_price: number;
  best_price: number;
  best_supplier: string;
  price_variance: number;
  recommendations: string[];
}

export interface SupplierPrice {
  supplier_name: string;
  current_price: number;
  last_updated: string;
  price_history: PricePoint[];
  quality_rating?: number;
  delivery_time_days?: number;
  reliability_score?: number;
}

export interface PricePoint {
  date: string;
  price: number;
  quantity?: number;
  invoice_number?: string;
}

// Form data interface
export interface MaterialFormData {
  supplier: string;
  supplierPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  partialPaymentAmount: number;
}

// Available product for dropdown
export interface AvailableProduct {
  name: string;
  sku: string;
  unit: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
}

// Tab types
export type MaterialTab = "all" | "inStock" | "lowStock" | "outOfStock";
export type ViewType = "materials" | "history";
