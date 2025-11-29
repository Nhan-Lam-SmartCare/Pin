import type { Supplier } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";
import type { PinContextType } from "../../contexts/types";

export interface SuppliersService {
  upsertSupplier: (supplier: Supplier) => Promise<void>;
}

interface DBSupplier {
  id?: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  created_at?: string;
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export function createSuppliersService(ctx: PinContextType): SuppliersService {
  return {
    upsertSupplier: async (supplier) => {
      if (IS_OFFLINE_MODE) {
        ctx.setSuppliers((prev: Supplier[]) => {
          const idx = prev.findIndex((s) => s.id === supplier.id);
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
        const payload: DBSupplier = {
          name: supplier.name,
          phone: supplier.phone ?? null,
          email: supplier.email ?? null,
          address: supplier.address ?? null,
          notes: supplier.notes ?? null,
        };

        // Only include id if it's a valid UUID, let DB generate otherwise
        if (isValidUUID(supplier.id)) {
          payload.id = supplier.id;
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
        ctx.setSuppliers((prev: Supplier[]) => {
          const idx = prev.findIndex((s) => s.id === supplier.id);
          if (idx > -1) return prev.map((s) => (s.id === supplier.id ? supplier : s));
          return [supplier, ...prev];
        });
        ctx.addToast?.({
          title: "Đã lưu nhà cung cấp",
          message: supplier.name,
          type: "success",
        });
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Exception upserting supplier:", e);
        ctx.addToast?.({
          title: "Lỗi lưu nhà cung cấp",
          message: errorMessage,
          type: "error",
        });
      }
    },
  };
}
