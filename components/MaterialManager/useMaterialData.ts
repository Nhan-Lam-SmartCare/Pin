import { useState, useCallback, useMemo, useEffect } from "react";
import type { PinMaterial, Supplier } from "../../types";
import { supabase, isSupabaseConfigured } from "../../supabaseClient";

interface UseMaterialDataProps {
  initialMaterials: PinMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<PinMaterial[]>>;
  suppliers: Supplier[];
}

interface UseMaterialDataReturn {
  // State
  loading: boolean;
  setLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortField: keyof PinMaterial;
  setSortField: (field: keyof PinMaterial) => void;
  sortDirection: "asc" | "desc";
  setSortDirection: (direction: "asc" | "desc") => void;

  // Computed
  filteredMaterials: PinMaterial[];
  sortedMaterials: PinMaterial[];

  // Actions
  loadMaterials: () => Promise<void>;
  handleSort: (field: keyof PinMaterial) => void;

  // Stats
  stats: MaterialStats;
}

interface MaterialStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

const LOW_STOCK_THRESHOLD = 5;

export function useMaterialData({
  initialMaterials,
  setMaterials,
  suppliers,
}: UseMaterialDataProps): UseMaterialDataReturn {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof PinMaterial>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Load materials from database
  const loadMaterials = useCallback(async () => {
    if (!isSupabaseConfigured()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pin_materials")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      if (data) {
        setMaterials(data);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    } finally {
      setLoading(false);
    }
  }, [setMaterials]);

  // Filter materials by search query
  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return initialMaterials;

    const query = searchQuery.toLowerCase().trim();
    return initialMaterials.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.sku?.toLowerCase().includes(query) ||
        m.supplier?.toLowerCase().includes(query)
    );
  }, [initialMaterials, searchQuery]);

  // Sort materials
  const sortedMaterials = useMemo(() => {
    return [...filteredMaterials].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal, "vi")
          : bVal.localeCompare(aVal, "vi");
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredMaterials, sortField, sortDirection]);

  // Handle sort toggle
  const handleSort = useCallback(
    (field: keyof PinMaterial) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  // Calculate stats
  const stats = useMemo<MaterialStats>(() => {
    const total = initialMaterials.length;
    const outOfStock = initialMaterials.filter(
      (m) => (m.stock ?? 0) <= 0
    ).length;
    const lowStock = initialMaterials.filter(
      (m) => (m.stock ?? 0) > 0 && (m.stock ?? 0) <= LOW_STOCK_THRESHOLD
    ).length;
    const inStock = total - outOfStock - lowStock;
    const totalValue = initialMaterials.reduce(
      (sum, m) => sum + (m.stock ?? 0) * (m.purchasePrice ?? 0),
      0
    );

    return { total, inStock, lowStock, outOfStock, totalValue };
  }, [initialMaterials]);

  return {
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    filteredMaterials,
    sortedMaterials,
    loadMaterials,
    handleSort,
    stats,
  };
}

// Export types
export type { UseMaterialDataReturn, MaterialStats };
