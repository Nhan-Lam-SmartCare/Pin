import type { PinCustomer } from "../../types";
import { supabase, IS_OFFLINE_MODE } from "../../supabaseClient";
import type { PinContextType } from "../../contexts/types";

export interface CustomersService {
  upsertPinCustomer: (customer: PinCustomer) => Promise<void>;
}

export function createCustomersService(ctx: PinContextType): CustomersService {
  return {
    upsertPinCustomer: async (customer) => {
      // Optimistic/offline-first
      if (IS_OFFLINE_MODE) {
        ctx.setPinCustomers((prev: any[]) => {
          const idx = prev.findIndex((c: any) => c.id === customer.id);
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
        // Validate UUID format before sending
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidUUID = uuidRegex.test(customer.id);

        // Minimal normalization for DB
        const payload: any = {
          name: customer.name,
          phone: customer.phone,
          address: customer.address ?? null,
          notes: customer.notes ?? null,
        };

        // Only include id if it's a valid UUID
        if (isValidUUID) {
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
        ctx.setPinCustomers((prev: any[]) => {
          const idx = prev.findIndex((c: any) => c.id === customer.id);
          if (idx > -1)
            return prev.map((c: any) => (c.id === customer.id ? customer : c));
          return [customer, ...prev];
        });
        ctx.addToast?.({
          title: "Đã lưu khách hàng",
          message: customer.name,
          type: "success",
        });
      } catch (e: any) {
        console.error("Exception upserting pin_customer:", e);
        ctx.addToast?.({
          title: "Lỗi lưu khách hàng",
          message: e?.message || String(e),
          type: "error",
        });
      }
    },
  };
}
