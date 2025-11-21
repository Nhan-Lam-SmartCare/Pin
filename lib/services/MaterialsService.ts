import type { PinContextType } from "../../contexts/types";
import type { PinMaterial } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";

export interface MaterialsService {
  upsertMaterial: (material: PinMaterial) => Promise<void>;
  deleteMaterial: (materialId: string) => Promise<void>;
  reloadHistory: () => Promise<void>;
}

export function createMaterialsService(ctx: PinContextType): MaterialsService {
  const upsertLocal = async (material: PinMaterial) => {
    ctx.setPinMaterials((prev: PinMaterial[]) => {
      const idx = prev.findIndex((m: PinMaterial) => m.id === material.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...prev[idx], ...material } as PinMaterial;
        return next;
      }
      return [material, ...prev];
    });
  };

  return {
    upsertMaterial: async (material) => {
      try {
        if (IS_OFFLINE_MODE || !ctx.currentUser) {
          await upsertLocal(material);
          return;
        }

        const payload: any = {
          name: material.name,
          sku: material.sku,
          unit: material.unit,
          purchase_price: material.purchasePrice ?? 0,
          retail_price: material.retailPrice ?? 0,
          wholesale_price: material.wholesalePrice ?? 0,
          stock: material.stock ?? 0,
          committed_quantity: material.committedQuantity ?? 0,
          supplier: material.supplier || null,
          description: material.description || null,
          updated_at: new Date().toISOString(),
        };

        // Only include id if it's a valid UUID (for updates)
        if (
          material.id &&
          material.id.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          )
        ) {
          payload.id = material.id;
        }

        const { error } = await supabase.from("pin_materials").upsert(payload);
        if (error) throw error;
        await upsertLocal(material);
      } catch (e: any) {
        ctx.addToast?.({
          type: "error",
          title: "Lưu vật tư thất bại",
          message: e?.message || String(e),
        });
        throw e;
      }
    },
    deleteMaterial: async (materialId) => {
      try {
        if (!(IS_OFFLINE_MODE || !ctx.currentUser)) {
          const { error } = await supabase
            .from("pin_materials")
            .delete()
            .eq("id", materialId);
          if (error) throw error;
        }
        ctx.setPinMaterials((prev: PinMaterial[]) =>
          prev.filter((m: PinMaterial) => m.id !== materialId)
        );
      } catch (e: any) {
        ctx.addToast?.({
          type: "error",
          title: "Xóa vật tư thất bại",
          message: e?.message || String(e),
        });
        throw e;
      }
    },
    reloadHistory: async () => {
      await ctx.reloadPinMaterialHistory();
    },
  };
}
