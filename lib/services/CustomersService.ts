import type { PinCustomer } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";
import type { PinContextType } from "../../contexts/types";

export interface CustomersService {
  upsertPinCustomer: (customer: PinCustomer) => Promise<void>;
}

interface DBPinCustomer {
  id?: string;
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
}

function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function createCustomersService(ctx: PinContextType): CustomersService {
  return {
    upsertPinCustomer: async (customer) => {
      // Optimistic/offline-first
      if (IS_OFFLINE_MODE) {
        ctx.setPinCustomers((prev: PinCustomer[]) => {
          const idx = prev.findIndex((c) => c.id === customer.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = customer;
            return next;
          }
          return [customer, ...prev];
        });
        return;
      }

      try {
        // Minimal normalization for DB
        const payload: DBPinCustomer = {
          name: customer.name,
          phone: customer.phone,
          address: customer.address ?? null,
          notes: customer.notes ?? null,
        };

        // Only include id if it's a valid UUID
        if (isValidUUID(customer.id)) {
          payload.id = customer.id;
        }

        const { error } = await supabase.from("pin_customers").upsert(payload);
        if (error) {
          ctx.addToast?.({
            title: "Lỗi lưu khách hàng",
            message: error.message || String(error),
            type: "error",
          });
          return;
        }
        ctx.setPinCustomers((prev: PinCustomer[]) => {
          const idx = prev.findIndex((c) => c.id === customer.id);
          if (idx > -1) return prev.map((c) => (c.id === customer.id ? customer : c));
          return [customer, ...prev];
        });
        ctx.addToast?.({
          title: "Đã lưu khách hàng",
          message: customer.name,
          type: "success",
        });
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error("Exception upserting pin_customer:", e);
        ctx.addToast?.({
          title: "Lỗi lưu khách hàng",
          message: errorMessage,
          type: "error",
        });
      }
    },
  };
}
