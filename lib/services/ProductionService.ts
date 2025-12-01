import type { PinContextType } from "../../contexts/types";
import type { PinBOM, ProductionOrder, PinProduct, PinMaterial } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";
import { generateProductSKU } from "../../lib/sku";

let syncRunning = false;

// Helper to convert date formats (dd/MM/yyyy -> yyyy-MM-dd for PostgreSQL)
const toPostgresDate = (dateStr: string | undefined): string => {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  // Check if already in ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.split('T')[0];
  }
  // Convert from dd/MM/yyyy format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return new Date().toISOString().split('T')[0];
};

export interface ProductionService {
  upsertBOM: (bom: PinBOM) => Promise<void>;
  deleteBOM: (bomId: string) => Promise<void>;
  addOrder: (order: ProductionOrder, bom: PinBOM) => Promise<void>;
  updateOrderStatus: (orderId: string, status: ProductionOrder["status"]) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
  syncProductsFromCompletedOrders: () => Promise<void>;
  updateProduct: (product: PinProduct) => Promise<void>;
  removeProductAndReturnMaterials: (product: PinProduct, quantityToRemove: number) => Promise<void>;
}

interface DBPinProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  cost_price: number;
  retail_price?: number | null;
  wholesale_price?: number | null;
}

interface DBPinBOM {
  id?: string;
  product_name: string;
  product_sku: string;
  materials: PinBOM["materials"];
  notes?: string | null;
}

interface DBProductionOrder {
  id: string;
  creation_date?: string;
  product_name: string;
  bom_id: string;
  quantity_produced: number;
  materials_cost: number;
  additional_costs?: any[];
  total_cost: number;
  status: string;
  notes?: string | null;
  user_name?: string | null;
}

function isValidUUID(v: string | undefined): boolean {
  return (
    !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
  );
}

export function createProductionService(ctx: PinContextType): ProductionService {
  // Helper: upsert product to DB or state
  const persistProduct = async (product: PinProduct): Promise<boolean> => {
    if (IS_OFFLINE_MODE || !ctx.currentUser) {
      ctx.setPinProducts((prev: PinProduct[]) => {
        const idx = prev.findIndex((p) => p.id === product.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = product;
          return next;
        }
        return [product, ...prev];
      });
      return true;
    }
    // Minimal payload to fit current schema (snake_case)
    const payload: DBPinProduct = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      stock: Number(product.stock ?? 0),
      cost_price: Number(product.costPrice ?? 0),
      retail_price: product.retailPrice ?? product.sellingPrice ?? null,
      wholesale_price: product.wholesalePrice ?? null,
    };
    const { error } = await supabase.from("pin_products").upsert(payload);
    if (error) {
      ctx.addToast?.({
        title: "Lỗi lưu sản phẩm",
        message: error.message || String(error),
        type: "error",
      });
      return false;
    }
    ctx.setPinProducts((prev: PinProduct[]) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [product, ...prev];
    });
    return true;
  };

  return {
    upsertBOM: async (bom) => {
      // Offline-first: update memory only when offline or unauthenticated
      if (IS_OFFLINE_MODE || !ctx.currentUser) {
        ctx.setBoms((prev: PinBOM[]) => {
          const idx = prev.findIndex((b) => b.id === bom.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = bom;
            return next;
          }
          return [bom, ...prev];
        });
        return;
      }

      // Online: persist to DB (pin_boms) and update state
      const basePayload: DBPinBOM = {
        product_name: bom.productName,
        product_sku: bom.productSku,
        materials: bom.materials || [],
        notes: bom.notes || null,
      };

      // If bom.id is not a valid UUID, insert without id so DB generates one
      if (!isValidUUID(bom.id)) {
        const { data, error } = await supabase
          .from("pin_boms")
          .insert(basePayload)
          .select()
          .single();
        if (error) {
          ctx.addToast?.({
            title: "Lỗi lưu BOM",
            message: error.message || String(error),
            type: "error",
          });
          return;
        }
        const newBom: PinBOM = { ...bom, id: data.id };
        ctx.setBoms((prev: PinBOM[]) => {
          const idx = prev.findIndex((b) => b.id === bom.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = newBom;
            return next;
          }
          return [newBom, ...prev];
        });
        ctx.addToast?.({
          title: "Đã lưu BOM",
          message: `BOM cho sản phẩm "${bom.productName}" đã được lưu`,
          type: "success",
        });
        return;
      }

      // Existing UUID: safe upsert with id
      const payload: DBPinBOM = { id: bom.id, ...basePayload };
      {
        const { error } = await supabase.from("pin_boms").upsert(payload);
        if (error) {
          ctx.addToast?.({
            title: "Lỗi lưu BOM",
            message: error.message || String(error),
            type: "error",
          });
          return;
        }
      }
      ctx.setBoms((prev: PinBOM[]) => {
        const idx = prev.findIndex((b) => b.id === bom.id);
        if (idx > -1) {
          const next = [...prev];
          next[idx] = bom;
          return next;
        }
        return [bom, ...prev];
      });
      ctx.addToast?.({
        title: "Đã lưu BOM",
        message: `BOM cho sản phẩm "${bom.productName}" đã được lưu`,
        type: "success",
      });
    },
    deleteBOM: async (bomId) => {
      if (IS_OFFLINE_MODE || !ctx.currentUser) {
        ctx.setBoms((prev: PinBOM[]) => prev.filter((b) => b.id !== bomId));
        return;
      }
      const { error } = await supabase.from("pin_boms").delete().eq("id", bomId);
      if (error) {
        ctx.addToast?.({
          title: "Lỗi xoá BOM",
          message: error.message || String(error),
          type: "error",
        });
        return;
      }
      ctx.setBoms((prev: PinBOM[]) => prev.filter((b) => b.id !== bomId));
    },
    addOrder: async (order, bom) => {
      // Default status if missing
      const status = (order.status || "Đang chờ") as ProductionOrder["status"];
      if (IS_OFFLINE_MODE || !ctx.currentUser) {
        ctx.setProductionOrders((prev: ProductionOrder[]) => [order, ...prev]);
        ctx.addToast?.({
          title: "Đã tạo lệnh (Offline)",
          message: `${order.productName} - SL: ${order.quantityProduced}`,
          type: "success",
        });
        return;
      }
      const payload: DBProductionOrder = {
        id: order.id,
        creation_date: toPostgresDate(order.creationDate),
        product_name: order.productName,
        bom_id: order.bomId,
        quantity_produced: Number(order.quantityProduced || 0),
        materials_cost: Number(order.materialsCost || 0),
        additional_costs: order.additionalCosts || [],
        total_cost: Number(order.totalCost || 0),
        status,
        notes: order.notes || null,
        user_name: order.userName || ctx.currentUser?.name || null,
      };
      const { error } = await supabase.from("pin_production_orders").upsert(payload);
      if (error) {
        ctx.addToast?.({
          title: "Lỗi tạo lệnh sản xuất",
          message: error.message || String(error),
          type: "error",
        });
        return;
      }
      ctx.setProductionOrders((prev: ProductionOrder[]) => [order, ...prev]);
      ctx.addToast?.({
        title: "Đã tạo lệnh sản xuất",
        message: `${order.productName} - SL: ${order.quantityProduced}`,
        type: "success",
      });
    },
    updateOrderStatus: async (orderId, status) => {
      if (IS_OFFLINE_MODE || !ctx.currentUser) {
        ctx.setProductionOrders((prev: ProductionOrder[]) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        return;
      }
      const { error } = await supabase
        .from("pin_production_orders")
        .update({ status })
        .eq("id", orderId);
      if (error) {
        ctx.addToast?.({
          title: "Lỗi cập nhật trạng thái",
          message: error.message || String(error),
          type: "error",
        });
        return;
      }
      ctx.setProductionOrders((prev: ProductionOrder[]) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    },
    completeOrder: async (orderId) => {
      // Offline-first guard
      if (IS_OFFLINE_MODE) {
        const order = ctx.productionOrders.find((o) => o.id === orderId);
        if (!order) return;
        const bom = ctx.pinBOMs.find((b) => b.id === order.bomId);
        if (!bom) return;

        const producedQty = Number(order.quantityProduced || 0);
        if (producedQty <= 0) return;

        // Deduct materials locally
        for (const bomItem of bom.materials || []) {
          const material = ctx.pinMaterials.find((m) => m.id === bomItem.materialId);
          if (!material) continue;
          const required = Number(bomItem.quantity || 0) * producedQty;
          const newStock = (material.stock || 0) - required;
          if (newStock < 0) {
            ctx.addToast?.({
              title: "Không đủ nguyên liệu",
              message: `Nguyên liệu "${material.name}" không đủ. Tồn kho: ${material.stock}, Cần: ${required}`,
              type: "error",
            });
            return;
          }
          ctx.setPinMaterials((prev: PinMaterial[]) =>
            prev.map((m) => (m.id === material.id ? { ...m, stock: newStock } : m))
          );
        }

        // Mark order completed in memory
        ctx.setProductionOrders((prev: ProductionOrder[]) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "Hoàn thành" as const } : o))
        );

        // Upsert product locally
        const existingProd = ctx.pinProducts.find((p) => p.sku === bom.productSku);
        const prodId = existingProd?.id || bom.id || `OFFLINE-${bom.productSku}`;
        const oldStock = existingProd?.stock || 0;
        const oldCost = existingProd?.costPrice || 0;
        const totalCost = Number(order.totalCost || 0);
        const newStock = oldStock + producedQty;
        const newCost = newStock > 0 ? (oldCost * oldStock + totalCost) / newStock : oldCost;

        const updated: PinProduct = {
          id: prodId,
          name: bom.productName,
          sku: bom.productSku,
          stock: newStock,
          costPrice: isFinite(newCost) ? newCost : oldCost,
          sellingPrice: existingProd?.sellingPrice || 0,
        } as PinProduct;

        ctx.setPinProducts((prev: PinProduct[]) => {
          const idx = prev.findIndex((p) => p.id === prodId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = updated;
            return next;
          }
          return [updated, ...prev];
        });

        ctx.addToast?.({
          title: "Hoàn thành sản xuất (Offline)",
          message: `Đã hoàn thành sản xuất ${producedQty} ${bom.productName}`,
          type: "success",
        });
        return;
      }

      // Online path - persist changes
      const order = ctx.productionOrders.find((o) => o.id === orderId);
      if (!order) {
        ctx.addToast?.({
          title: "Không tìm thấy lệnh sản xuất",
          message: "Lệnh sản xuất không tồn tại.",
          type: "error",
        });
        return;
      }
      if (order.status === "Hoàn thành") {
        ctx.addToast?.({
          title: "Lệnh đã hoàn thành",
          message: "Lệnh sản xuất này đã được hoàn thành trước đó.",
          type: "warn",
        });
        return;
      }
      const bom = ctx.pinBOMs.find((b) => b.id === order.bomId);
      if (!bom) {
        ctx.addToast?.({
          title: "Không tìm thấy BOM",
          message: "BOM không tồn tại cho lệnh sản xuất này.",
          type: "error",
        });
        return;
      }
      const producedQty = Number(order.quantityProduced || 0);
      if (producedQty <= 0) {
        ctx.addToast?.({
          title: "Số lượng sản xuất không hợp lệ",
          message: "Số lượng sản xuất phải > 0.",
          type: "error",
        });
        return;
      }

      // 1) Deduct materials with persistence via upsertPinMaterial
      for (const bomItem of bom.materials || []) {
        const material = ctx.pinMaterials.find((m) => m.id === bomItem.materialId);
        if (!material) continue;
        const required = Number(bomItem.quantity || 0) * producedQty;
        const newStock = (material.stock || 0) - required;
        if (newStock < 0) {
          ctx.addToast?.({
            title: "Không đủ nguyên liệu",
            message: `Nguyên liệu "${material.name}" không đủ. Tồn kho: ${material.stock}, Cần: ${required}`,
            type: "error",
          });
          return;
        }

        // Persist material change directly (avoid ctx dependency)
        try {
          if (!IS_OFFLINE_MODE) {
            await supabase.from("pin_materials").update({ stock: newStock }).eq("id", material.id);
          }
        } catch {
          // Ignore errors
        }
        // Update local state
        ctx.setPinMaterials((prev: PinMaterial[]) =>
          prev.map((m) => (m.id === material.id ? { ...m, stock: newStock } : m))
        );

        // Record stock history (export)
        const historyPayload = {
          id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          material_id: material.id,
          transaction_type: "export",
          quantity_change: -required,
          quantity_before: material.stock,
          quantity_after: newStock,
          reason: `Sản xuất: ${bom.productName} (${order.id})`,
          created_by: ctx.currentUser?.id,
          created_at: new Date().toISOString(),
        };
        try {
          await supabase.from("pin_stock_history").insert(historyPayload);
        } catch (e) {
          console.warn("Không thể ghi lịch sử kho:", e);
        }
      }

      // 2) Mark order as completed in DB
      const { error: updateError } = await supabase
        .from("pin_production_orders")
        .update({ status: "Hoàn thành" })
        .eq("id", orderId);
      if (updateError) {
        ctx.addToast?.({
          title: "Lỗi hoàn thành lệnh sản xuất",
          message: updateError.message || String(updateError),
          type: "error",
        });
        return;
      }

      // 3) Upsert finished product via existing context helper (handles normalize + RLS)
      const existingProd = ctx.pinProducts.find((p) => p.sku === bom.productSku);
      const prodId = existingProd?.id || bom.id || `PINP-${Date.now()}`;
      const oldStock = existingProd?.stock || 0;
      const oldCost = existingProd?.costPrice || 0;
      const totalCost = Number(order.totalCost || 0);
      const newStock = oldStock + producedQty;
      const newCost = newStock > 0 ? (oldCost * oldStock + totalCost) / newStock : oldCost;

      const product: PinProduct = {
        id: prodId,
        name: bom.productName,
        sku: bom.productSku,
        stock: newStock,
        costPrice: isFinite(newCost) ? newCost : oldCost,
        sellingPrice: existingProd?.sellingPrice || 0,
      } as PinProduct;
      const ok = await persistProduct(product);

      // 4) Local state updates
      ctx.setProductionOrders((prev: ProductionOrder[]) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Hoàn thành" as const } : o))
      );
      if (ok) {
        ctx.setPinProducts((prev: PinProduct[]) => {
          const idx = prev.findIndex((p) => p.id === prodId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = product;
            return next;
          }
          return [product, ...prev];
        });
      }

      ctx.addToast?.({
        title: "Hoàn thành sản xuất",
        message: `Đã hoàn thành sản xuất ${producedQty} ${bom.productName}. Tồn kho: ${oldStock} → ${newStock}`,
        type: "success",
      });
    },
    syncProductsFromCompletedOrders: async () => {
      if (syncRunning) {
        ctx.addToast?.({
          title: "Đang đồng bộ",
          message: "Vui lòng đợi quá trình hiện tại hoàn tất.",
          type: "info",
        });
        return;
      }
      syncRunning = true;

      if (!ctx.currentUser && !IS_OFFLINE_MODE) {
        ctx.addToast?.({
          title: "Yêu cầu đăng nhập",
          message: "Bạn phải đăng nhập để đồng bộ sản phẩm.",
          type: "warn",
        });
        syncRunning = false;
        return;
      }

      const completedOrders = ctx.productionOrders.filter((o) => o.status === "Hoàn thành");
      if (completedOrders.length === 0) {
        ctx.addToast?.({
          title: "Không có đơn hoàn thành",
          message: "Không có đơn sản xuất nào đã hoàn thành để đồng bộ.",
          type: "info",
        });
        syncRunning = false;
        return;
      }

      const productMap = new Map<string, PinProduct>();
      ctx.pinProducts.forEach((p) => productMap.set(p.sku, p));

      let syncedCount = 0;
      for (const order of completedOrders) {
        const bom = ctx.pinBOMs.find((b) => b.id === order.bomId);
        if (!bom) continue;

        const producedQty = Number(order.quantityProduced || 0);
        const totalCost = Number(order.totalCost || 0);

        // Prefer current BOM SKU, fallback by product name for legacy
        let existingProduct: PinProduct | undefined =
          productMap.get(bom.productSku) || ctx.pinProducts.find((p) => p.name === bom.productName);

        // Ensure SKU format TP-ddmmyyyy-xxx; migrate if needed
        const tpPattern = /^TP-\d{8}-\d{3}$/;
        let effectiveSku: string = bom.productSku;
        if (!tpPattern.test(effectiveSku || "")) {
          const existingSkuList = Array.from(productMap.values()).map((p) => ({
            sku: p.sku,
          }));
          effectiveSku = generateProductSKU(existingSkuList);
          // Try to persist new SKU; non-blocking on error
          try {
            await supabase.from("pin_boms").upsert({
              id: bom.id,
              product_name: bom.productName,
              product_sku: effectiveSku,
              materials: bom.materials || [],
              notes: bom.notes || null,
            });
            // update state map for boms
            ctx.setBoms((prev: PinBOM[]) =>
              prev.map((b) => (b.id === bom.id ? { ...b, productSku: effectiveSku } : b))
            );
          } catch {
            // Ignore
          }
        }

        const oldStock = existingProduct?.stock || 0;
        const oldCost = existingProduct?.costPrice || 0;
        const newStock = oldStock + producedQty;
        const newCost = newStock > 0 ? (oldCost * oldStock + totalCost) / newStock : oldCost;

        const product: PinProduct = {
          id: existingProduct?.id || bom.id || `PINP-${Date.now()}`,
          name: bom.productName,
          sku: effectiveSku,
          stock: newStock,
          costPrice: isFinite(newCost) ? newCost : oldCost,
          retailPrice:
            existingProduct?.retailPrice ||
            existingProduct?.sellingPrice ||
            Math.round((isFinite(newCost) ? newCost : oldCost) * 1.2),
          wholesalePrice:
            existingProduct?.wholesalePrice ||
            Math.round(
              (existingProduct?.retailPrice ||
                Math.round((isFinite(newCost) ? newCost : oldCost) * 1.2)) * 0.9
            ),
          sellingPrice:
            existingProduct?.sellingPrice ||
            Math.round((isFinite(newCost) ? newCost : oldCost) * 1.2),
        } as PinProduct;

        if (IS_OFFLINE_MODE) {
          productMap.set(product.sku, product);
          syncedCount++;
          // mark as synced locally
          ctx.setProductionOrders((prev: ProductionOrder[]) =>
            prev.map((o) =>
              o.id === order.id ? { ...o, status: "Đã nhập kho" as ProductionOrder["status"] } : o
            )
          );
        } else {
          try {
            const ok = await persistProduct(product);
            if (ok) {
              productMap.set(product.sku, product);
              syncedCount++;
            }
            // Update order status in DB and state
            try {
              const { error: statusErr } = await supabase
                .from("pin_production_orders")
                .update({ status: "Đã nhập kho" })
                .eq("id", order.id);
              if (!statusErr) {
                ctx.setProductionOrders((prev: ProductionOrder[]) =>
                  prev.map((o) =>
                    o.id === order.id
                      ? { ...o, status: "Đã nhập kho" as ProductionOrder["status"] }
                      : o
                  )
                );
              }
            } catch {
              // Ignore
            }
          } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            ctx.addToast?.({
              title: "Lỗi lưu sản phẩm",
              message: `Không thể lưu ${product.name}: ${errorMessage}`,
              type: "error",
            });
          }
        }
      }

      // Update memory state with merged map
      ctx.setPinProducts(Array.from(productMap.values()));
      ctx.addToast?.({
        title: "Đồng bộ thành phẩm thành công",
        message: `Đã đồng bộ ${syncedCount}/${completedOrders.length} sản phẩm và lưu vào cơ sở dữ liệu`,
        type: "success",
      });
      syncRunning = false;
    },
    updateProduct: async (product) => {
      await persistProduct(product);
    },
    removeProductAndReturnMaterials: async (product, quantityToRemove) => {
      // Normalize quantity
      const qtyRequested = Math.max(1, Math.floor(Number(quantityToRemove) || 0));
      const qty = Math.min(qtyRequested, Math.max(0, Number(product.stock || 0)));
      if (qty <= 0) {
        ctx.addToast?.({
          title: "Số lượng không hợp lệ",
          message: "Số lượng xoá phải > 0 và không vượt quá tồn kho.",
          type: "warn",
        });
        return;
      }

      // Helper: return materials for qty based on BOM
      const returnMaterialsForQty = async (qtyToReturn: number) => {
        const bom = ctx.pinBOMs.find(
          (b) => b.productSku === product.sku || b.productName === product.name
        );
        if (!bom) {
          ctx.addToast?.({
            title: "Không tìm thấy BOM",
            message: "Không thể hoàn kho NVL vì không tìm thấy công thức tương ứng.",
            type: "warn",
          });
          return;
        }
        const returnMap = new Map<string, number>();
        (bom.materials || []).forEach((m) => {
          const q = (m.quantity || 0) * qtyToReturn;
          if (q > 0) returnMap.set(m.materialId, (returnMap.get(m.materialId) || 0) + q);
        });
        if (returnMap.size === 0) return;

        // Apply to state and persist via upsertPinMaterial
        ctx.setPinMaterials((prev: PinMaterial[]) =>
          prev.map((mat) =>
            returnMap.has(mat.id)
              ? {
                  ...mat,
                  stock: (mat.stock || 0) + (returnMap.get(mat.id) || 0),
                }
              : mat
          )
        );
        // Persist each material change (online only)
        if (!IS_OFFLINE_MODE) {
          for (const [materialId, delta] of returnMap.entries()) {
            const mat = ctx.pinMaterials.find((m) => m.id === materialId);
            if (mat) {
              try {
                await supabase
                  .from("pin_materials")
                  .update({ stock: (mat.stock || 0) + delta })
                  .eq("id", materialId);
              } catch {
                // Ignore
              }
            }
          }
        }
      };

      if (IS_OFFLINE_MODE) {
        await returnMaterialsForQty(qty);
        const remaining = Math.max(0, (product.stock || 0) - qty);
        if (remaining === 0) {
          ctx.setPinProducts((prev: PinProduct[]) => prev.filter((p) => p.id !== product.id));
        } else {
          ctx.setPinProducts((prev: PinProduct[]) =>
            prev.map((p) => (p.id === product.id ? { ...p, stock: remaining } : p))
          );
        }
        return;
      }

      // Online path
      await returnMaterialsForQty(qty);
      const remaining = Math.max(0, (product.stock || 0) - qty);
      if (remaining === 0) {
        // Cancel related completed orders to avoid re-sync, then delete product
        const relatedOrders = ctx.productionOrders.filter((o) => {
          const bom = ctx.pinBOMs.find((b) => b.id === o.bomId);
          return (
            bom &&
            (bom.productSku === product.sku || bom.productName === product.name) &&
            o.status === "Hoàn thành"
          );
        });

        for (const order of relatedOrders) {
          const { error: orderErr } = await supabase
            .from("pin_production_orders")
            .update({ status: "Đã hủy" })
            .eq("id", order.id);
          if (!orderErr) {
            ctx.setProductionOrders((prev: ProductionOrder[]) =>
              prev.map((o) =>
                o.id === order.id ? { ...o, status: "Đã hủy" as ProductionOrder["status"] } : o
              )
            );
          }
        }

        const { error: delErr } = await supabase.from("pin_products").delete().eq("id", product.id);
        if (delErr) {
          ctx.addToast?.({
            title: "Lỗi xoá",
            message: delErr.message || String(delErr),
            type: "error",
          });
          return;
        }
        ctx.setPinProducts((prev: PinProduct[]) => prev.filter((p) => p.id !== product.id));
        ctx.addToast?.({
          title: "Đã xoá thành phẩm",
          message: `${product.name} (xóa ${qty}) và hủy ${relatedOrders.length} lệnh sản xuất liên quan`,
          type: "success",
        });
      } else {
        // Partial: update product stock
        const ok = await persistProduct({
          ...product,
          stock: remaining,
        } as PinProduct);
        if (ok) {
          ctx.setPinProducts((prev: PinProduct[]) =>
            prev.map((p) => (p.id === product.id ? { ...p, stock: remaining } : p))
          );
        }
        ctx.addToast?.({
          title: "Đã cập nhật tồn kho",
          message: `${product.name}: -${qty}, còn ${remaining}`,
          type: "success",
        });
      }
    },
  };
}
