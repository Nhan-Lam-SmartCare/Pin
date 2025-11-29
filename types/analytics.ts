/**
 * Analytics and Prediction Types
 */

// Cost Prediction Engine
export interface CostPrediction {
  orderId: string;
  predictedTotalCost: number;
  confidenceLevel: number;
  basedOnHistoricalOrders: number;
  predictionFactors: PredictionFactor[];
  riskAssessment: RiskAssessment;
  lastUpdated: string;
}

export interface PredictionFactor {
  factor:
    | "material_price_trend"
    | "seasonal_variation"
    | "supplier_reliability"
    | "complexity_level"
    | "team_efficiency";
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
}

export interface RiskAssessment {
  overallRisk: "low" | "medium" | "high" | "critical";
  riskFactors: RiskFactor[];
  mitigationSuggestions: string[];
}

export interface RiskFactor {
  type:
    | "budget_overrun"
    | "material_shortage"
    | "supplier_delay"
    | "capacity_constraint"
    | "quality_risk";
  severity: "low" | "medium" | "high" | "critical";
  probability: number;
  description: string;
  impact: number;
}

// Smart Inventory Management
export interface InventoryForecast {
  materialId: string;
  currentStock: number;
  projectedDemand: DemandProjection[];
  reorderPoint: number;
  optimalOrderQuantity: number;
  stockoutRisk: number;
  recommendedAction: ReorderRecommendation;
}

export interface DemandProjection {
  date: string;
  projectedDemand: number;
  confidence: number;
  basedOnOrders: string[];
}

export interface ReorderRecommendation {
  action: "immediate" | "within_week" | "within_month" | "no_action_needed";
  recommendedQuantity: number;
  urgencyLevel: "critical" | "high" | "medium" | "low";
  reasonCode: string;
  estimatedCost: number;
  preferredSupplierId?: string;
}

// Supplier Performance Analytics
export interface SupplierMetrics {
  supplierId: string;
  performanceScore: number;
  deliveryMetrics: DeliveryMetrics;
  qualityMetrics: QualityMetrics;
  pricingMetrics: PricingMetrics;
  reliabilityScore: number;
  recommendations: SupplierRecommendation[];
}

export interface DeliveryMetrics {
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  earlyDeliveryRate: number;
  lateDeliveryRate: number;
  averageDelayWhenLate: number;
}

export interface QualityMetrics {
  defectRate: number;
  returnRate: number;
  complianceScore: number;
  certificationStatus: string[];
}

export interface PricingMetrics {
  averagePriceVariation: number;
  priceStability: number;
  competitivenessRank: number;
  lastPriceUpdate: string;
}

export interface SupplierRecommendation {
  type: "maintain" | "negotiate" | "find_alternative" | "increase_orders" | "reduce_orders";
  reason: string;
  potentialBenefit: number;
  actionPriority: "high" | "medium" | "low";
}

// Production Optimization
export interface ProductionOptimization {
  orderId: string;
  currentSchedule: ProductionSchedule;
  optimizedSchedule: ProductionSchedule;
  potentialSavings: OptimizationSavings;
  recommendations: OptimizationSuggestion[];
}

export interface ProductionSchedule {
  startTime: string;
  estimatedEndTime: string;
  resourceAllocations: ResourceAllocation[];
  dependencies: string[];
  bottlenecks: Bottleneck[];
}

export interface ResourceAllocation {
  resourceType: "labor" | "machine" | "workspace";
  resourceId: string;
  allocationStart: string;
  allocationEnd: string;
  utilizationRate: number;
}

export interface Bottleneck {
  resourceType: "labor" | "machine" | "material" | "workspace";
  resourceId: string;
  severity: "minor" | "moderate" | "major" | "critical";
  estimatedDelay: number;
  suggestions: string[];
}

export interface OptimizationSavings {
  timeSaved: number;
  costSaved: number;
  efficiencyGain: number;
  resourceOptimization: number;
}

export interface OptimizationSuggestion {
  type: "reschedule" | "reallocate_resources" | "batch_orders" | "outsource" | "delay_non_critical";
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  potentialSavings: number;
  description: string;
  implementationSteps: string[];
}

// Real-time Analytics
export interface ProductionAnalytics {
  timestamp: string;
  activeOrders: ProductionOrderStatus[];
  overallEfficiency: number;
  costVarianceToday: number;
  materialUtilization: number;
  alerts: ProductionAlert[];
}

export interface ProductionOrderStatus {
  orderId: string;
  status: string;
  progressPercentage: number;
  currentCostVariance: number;
  estimatedCompletion: string;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface ProductionAlert {
  id: string;
  type: "cost_overrun" | "material_shortage" | "schedule_delay" | "quality_issue" | "resource_conflict";
  severity: "info" | "warning" | "error" | "critical";
  orderId?: string;
  message: string;
  suggestedAction?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}
