export interface TaxReportData {
  reportDate: string;
  fromDate: string;
  toDate: string;
  businessInfo: {
    name: string;
    taxCode: string;
    address: string;
    phone: string;
  };
  sales: TaxSaleItem[];
  purchases: TaxPurchaseItem[];
  summary: TaxSummary;
}

export interface TaxSaleItem {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerTaxCode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface TaxPurchaseItem {
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  supplierTaxCode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
}

export interface TaxSummary {
  totalSalesAmount: number;
  totalSalesVAT: number;
  totalSales: number;
  totalPurchaseAmount: number;
  totalPurchaseVAT: number;
  totalPurchase: number;
  netVAT: number;
}

export type TaxReportPeriod = "month" | "quarter" | "year" | "custom";
