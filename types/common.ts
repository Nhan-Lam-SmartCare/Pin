/**
 * Common and Store Types
 */

export interface RepairTemplatePart {
  name: string;
  quantity: number;
  price: number;
  unit?: string;
}

export interface RepairTemplate {
  id: string;
  name: string;
  description?: string;
  estimatedTime?: string;
  baseCost?: number;
  parts: RepairTemplatePart[];
}

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  branches: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountHolder?: string;
    logoUrl?: string;
    taxCode?: string;
  }[];
  repairTemplates?: RepairTemplate[];
  categoryReorderDefaults?: {
    [category: string]: {
      leadTimeDays?: number;
      safetyDays?: number;
    };
  };
  targets?: {
    [branchId: string]: {
      day?: {
        revenue?: number;
        grossMargin?: number;
        gmPct?: number;
        aov?: number;
      };
      week?: {
        revenue?: number;
        grossMargin?: number;
        gmPct?: number;
        aov?: number;
      };
      month?: {
        revenue?: number;
        grossMargin?: number;
        gmPct?: number;
        aov?: number;
      };
      year?: {
        revenue?: number;
        grossMargin?: number;
        gmPct?: number;
        aov?: number;
      };
    };
  };
  alertThresholds?: {
    lowStock?: number;
    expiryWarning?: number;
    gmPctMin?: number;
    gmPctDropWarn?: number;
    lowStockCountWarn?: number;
    cashflowNegativeDays?: number;
  };
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  stock: { [branchId: string]: number };
  price: { [branchId: string]: number };
  retailPrice: { [branchId: string]: number };
  wholesalePrice: { [branchId: string]: number };
  category?: string;
  description?: string;
  warrantyPeriod?: string;
  expiryDate?: string;
  created_at?: string;
  leadTimeDays?: number;
  safetyDays?: number;
}

export interface WorkOrderPart {
  partId: string;
  partName: string;
  sku: string;
  quantity: number;
  price: number;
  vatRate?: 0 | 5 | 8 | 10;
  vatAmount?: number;
}

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface WorkOrder {
  id: string;
  creationDate: string;
  customerName: string;
  customerPhone: string;
  phoneNumber: string;
  vehicleModel: string;
  licensePlate: string;
  issueDescription: string;
  technicianName: string;
  status: "Tiếp nhận" | "Đang sửa" | "Đã sửa xong" | "Trả máy";
  total: number;
  branchId: string;
  laborCost: number;
  partsUsed?: WorkOrderPart[];
  quotationItems?: QuotationItem[];
  notes?: string;
  processingType?: string;
  customerQuote?: number;
  discount?: number;
  mileage?: number;
  paymentStatus?: "paid" | "unpaid";
  paymentMethod?: "cash" | "bank";
  paymentDate?: string;
  cashTransactionId?: string;
  created_at?: string;
  createdAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  loyaltyPoints: number;
  created_at?: string;
}

export interface InventoryTransaction {
  id: string;
  type: "Nhập kho" | "Xuất kho";
  partId: string;
  partName: string;
  quantity: number;
  date: string;
  notes: string;
  unitPrice?: number;
  totalPrice: number;
  branchId: string;
  saleId?: string;
  transferId?: string;
  goodsReceiptId?: string;
  discount?: number;
  customerId?: string;
  customerName?: string;
  userId?: string;
  userName?: string;
  created_at?: string;
  vatRate?: 0 | 5 | 8 | 10;
  vatAmount?: number;
}

export interface CartItem {
  partId: string;
  partName: string;
  sku: string;
  quantity: number;
  sellingPrice: number;
  stock: number;
  discount?: number;
  warrantyPeriod?: string;
  vatRate?: 0 | 5 | 8 | 10;
  vatAmount?: number;
}

export interface Sale {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  customer: {
    id?: string;
    name: string;
    phone?: string;
  };
  paymentMethod: "cash" | "bank";
  userId: string;
  userName: string;
  branchId: string;
  cashTransactionId?: string;
  created_at?: string;
}

export interface ReceiptItem {
  partId: string;
  partName: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  warrantyPeriod?: string;
  vatRate?: 0 | 5 | 8 | 10;
  vatAmount?: number;
}

export interface GoodsReceipt {
  id: string;
  supplierId: string;
  items: ReceiptItem[];
  totalAmount: number;
  notes?: string;
  receivedDate: string;
  created_at: string;
  userId: string;
  userName: string;
  branchId: string;
}

export type ContactType =
  | "Khách hàng"
  | "Nhà cung cấp"
  | "Đối tác sửa chữa"
  | "Đối tác tài chính";

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  type: ContactType[];
}
