import type { Supplier } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";
import type { PinContextType } from "../../contexts/types";

export interface SuppliersService {
  upsertSupplier: (supplier: Supplier) => Promise<void>;
}

export function createSuppliersService(ctx: PinContextType): SuppliersService {
  return {
    upsertSupplier: async (supplier) => {
      if (IS_OFFLINE_MODE) {
        ctx.setSuppliers((prev: any) => {
          const idx = prev.findIndex((s: any) => s.id === supplier.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = supplier;
            return next;
          }
          return [supplier, ...prev];
        });
        return;
      }

      try {
        // Validate UUID format before sending
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidUUID = uuidRegex.test(supplier.id);

        const payload: any = { ...supplier };

        // Only include id if it's a valid UUID, let DB generate otherwise
        if (!isValidUUID) {
          delete payload.id;
        }

        const { error } = await supabase.from("pin_suppliers").upsert(payload);
        if (error) {
          ctx.addToast?.({
            title: "Lỗi lưu nhà cung cấp",
            message: error.message || String(error),
            type: "error",
          });
          return;
        }
        ctx.setSuppliers((prev: any) => {
          const idx = prev.findIndex((s: any) => s.id === supplier.id);
          if (idx > -1)
            return prev.map((s: any) => (s.id === supplier.id ? supplier : s));
          return [supplier, ...prev];
        });
        ctx.addToast?.({
          title: "Đã lưu nhà cung cấp",
          message: supplier.name,
          type: "success",
        });
      } catch (e: any) {
        console.error("Exception upserting supplier:", e);
        ctx.addToast?.({
          title: "Lỗi lưu nhà cung cấp",
          message: e?.message || String(e),
          type: "error",
        });
      }
    },
  };
}
