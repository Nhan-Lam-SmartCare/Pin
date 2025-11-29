import { useState, useCallback } from "react";
import type { PinMaterial, Supplier } from "../../types";
import type { StockForecast, SupplierPriceAnalysis } from "./types";

interface UseMaterialModalsReturn {
  // Form Modal
  showFormModal: boolean;
  setShowFormModal: (show: boolean) => void;
  editingMaterial: PinMaterial | null;
  setEditingMaterial: (material: PinMaterial | null) => void;
  openAddModal: () => void;
  openEditModal: (material: PinMaterial) => void;
  closeFormModal: () => void;

  // Detail Modal
  showDetailModal: boolean;
  setShowDetailModal: (show: boolean) => void;
  detailMaterial: PinMaterial | null;
  setDetailMaterial: (material: PinMaterial | null) => void;
  openDetailModal: (material: PinMaterial) => void;
  closeDetailModal: () => void;

  // Stock Adjustment Modal
  showStockAdjustment: boolean;
  setShowStockAdjustment: (show: boolean) => void;
  adjustmentMaterial: PinMaterial | null;
  setAdjustmentMaterial: (material: PinMaterial | null) => void;
  openStockAdjustmentModal: (material: PinMaterial) => void;
  closeStockAdjustmentModal: () => void;

  // Forecast Modal
  showForecastModal: boolean;
  setShowForecastModal: (show: boolean) => void;
  forecastData: StockForecast[];
  setForecastData: (data: StockForecast[]) => void;
  openForecastModal: () => void;
  closeForecastModal: () => void;

  // Price Analysis Modal
  showPriceAnalysis: boolean;
  setShowPriceAnalysis: (show: boolean) => void;
  priceAnalysisData: SupplierPriceAnalysis[];
  setPriceAnalysisData: (data: SupplierPriceAnalysis[]) => void;
  openPriceAnalysisModal: () => void;
  closePriceAnalysisModal: () => void;

  // Import Modal
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;

  // Supplier Modal
  showSupplierModal: boolean;
  setShowSupplierModal: (show: boolean) => void;
  supplierToEdit: Supplier | null;
  setSupplierToEdit: (supplier: Supplier | null) => void;
}

export function useMaterialModals(): UseMaterialModalsReturn {
  // Form Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<PinMaterial | null>(
    null
  );

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailMaterial, setDetailMaterial] = useState<PinMaterial | null>(
    null
  );

  // Stock Adjustment Modal State
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [adjustmentMaterial, setAdjustmentMaterial] =
    useState<PinMaterial | null>(null);

  // Forecast Modal State
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [forecastData, setForecastData] = useState<StockForecast[]>([]);

  // Price Analysis Modal State
  const [showPriceAnalysis, setShowPriceAnalysis] = useState(false);
  const [priceAnalysisData, setPriceAnalysisData] = useState<
    SupplierPriceAnalysis[]
  >([]);

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);

  // Supplier Modal State
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

  // Form Modal Actions
  const openAddModal = useCallback(() => {
    setEditingMaterial(null);
    setShowFormModal(true);
  }, []);

  const openEditModal = useCallback((material: PinMaterial) => {
    setEditingMaterial(material);
    setShowFormModal(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingMaterial(null);
  }, []);

  // Detail Modal Actions
  const openDetailModal = useCallback((material: PinMaterial) => {
    setDetailMaterial(material);
    setShowDetailModal(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setDetailMaterial(null);
  }, []);

  // Stock Adjustment Modal Actions
  const openStockAdjustmentModal = useCallback((material: PinMaterial) => {
    setAdjustmentMaterial(material);
    setShowStockAdjustment(true);
  }, []);

  const closeStockAdjustmentModal = useCallback(() => {
    setShowStockAdjustment(false);
    setAdjustmentMaterial(null);
  }, []);

  // Forecast Modal Actions
  const openForecastModal = useCallback(() => {
    setShowForecastModal(true);
  }, []);

  const closeForecastModal = useCallback(() => {
    setShowForecastModal(false);
  }, []);

  // Price Analysis Modal Actions
  const openPriceAnalysisModal = useCallback(() => {
    setShowPriceAnalysis(true);
  }, []);

  const closePriceAnalysisModal = useCallback(() => {
    setShowPriceAnalysis(false);
  }, []);

  return {
    // Form Modal
    showFormModal,
    setShowFormModal,
    editingMaterial,
    setEditingMaterial,
    openAddModal,
    openEditModal,
    closeFormModal,

    // Detail Modal
    showDetailModal,
    setShowDetailModal,
    detailMaterial,
    setDetailMaterial,
    openDetailModal,
    closeDetailModal,

    // Stock Adjustment Modal
    showStockAdjustment,
    setShowStockAdjustment,
    adjustmentMaterial,
    setAdjustmentMaterial,
    openStockAdjustmentModal,
    closeStockAdjustmentModal,

    // Forecast Modal
    showForecastModal,
    setShowForecastModal,
    forecastData,
    setForecastData,
    openForecastModal,
    closeForecastModal,

    // Price Analysis Modal
    showPriceAnalysis,
    setShowPriceAnalysis,
    priceAnalysisData,
    setPriceAnalysisData,
    openPriceAnalysisModal,
    closePriceAnalysisModal,

    // Import Modal
    showImportModal,
    setShowImportModal,

    // Supplier Modal
    showSupplierModal,
    setShowSupplierModal,
    supplierToEdit,
    setSupplierToEdit,
  };
}

export type { UseMaterialModalsReturn };
