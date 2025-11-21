import { supabase } from "../../supabaseClient";

export interface PinUnit {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const UnitsService = {
  /**
   * Get all units
   */
  async getAllUnits(): Promise<PinUnit[]> {
    const { data, error } = await supabase
      .from("pin_units")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching units:", error);
      throw error;
    }

    return data || [];
  },

  /**
   * Add a new unit
   */
  async addUnit(name: string): Promise<PinUnit | null> {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Unit name cannot be empty");
    }

    const { data, error } = await supabase
      .from("pin_units")
      .insert({ name: trimmedName })
      .select()
      .single();

    if (error) {
      // If duplicate, just return null (unit already exists)
      if (error.code === "23505") {
        return null;
      }
      console.error("Error adding unit:", error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a unit
   */
  async deleteUnit(id: string): Promise<void> {
    const { error } = await supabase.from("pin_units").delete().eq("id", id);

    if (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  },
};
