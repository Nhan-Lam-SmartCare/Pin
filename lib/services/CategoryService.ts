// Category Service - Quản lý danh mục sản phẩm với Supabase
import { supabase, isSupabaseConfigured } from "../../supabaseClient";
import type { Category } from "../../types";

const STORAGE_KEY = "pin_categories";

export class CategoryService {
  /**
   * Lấy tất cả danh mục
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("pin_categories")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;

        if (data) {
          // Lưu vào localStorage làm backup
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Default categories nếu chưa có gì
      return [
        {
          id: "cat-material-default",
          name: "Vật liệu",
          description: "Vật liệu thô, linh kiện điện tử",
          type: "material",
        },
        {
          id: "cat-product-default",
          name: "Thành phẩm",
          description: "Sản phẩm hoàn chỉnh",
          type: "product",
        },
      ];
    } catch (error) {
      console.error("Error loading categories:", error);

      // Fallback to localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      return [];
    }
  }

  /**
   * Lấy danh mục theo loại
   */
  static async getCategoriesByType(type: "material" | "product"): Promise<Category[]> {
    const allCategories = await this.getAllCategories();
    return allCategories.filter((c) => c.type === type);
  }

  /**
   * Lấy danh mục theo ID
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    const allCategories = await this.getAllCategories();
    return allCategories.find((c) => c.id === id) || null;
  }

  /**
   * Tạo danh mục mới
   */
  static async createCategory(
    category: Omit<Category, "id" | "created_at" | "updated_at">
  ): Promise<Category> {
    try {
      const newCategory: Category = {
        id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from("pin_categories")
          .insert([newCategory])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          // Cập nhật localStorage
          const allCategories = await this.getAllCategories();
          allCategories.push(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));
          return data;
        }
      }

      // Fallback to localStorage
      const allCategories = await this.getAllCategories();
      allCategories.push(newCategory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Cập nhật danh mục
   */
  static async updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    try {
      const updatedData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("pin_categories").update(updatedData).eq("id", id);

        if (error) throw error;

        // Cập nhật localStorage
        const allCategories = await this.getAllCategories();
        const index = allCategories.findIndex((c) => c.id === id);
        if (index >= 0) {
          allCategories[index] = { ...allCategories[index], ...updatedData };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));
        }

        return true;
      }

      // Fallback to localStorage
      const allCategories = await this.getAllCategories();
      const index = allCategories.findIndex((c) => c.id === id);
      if (index >= 0) {
        allCategories[index] = { ...allCategories[index], ...updatedData };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allCategories));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating category:", error);
      return false;
    }
  }

  /**
   * Xóa danh mục
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.from("pin_categories").delete().eq("id", id);

        if (error) throw error;

        // Cập nhật localStorage
        const allCategories = await this.getAllCategories();
        const filtered = allCategories.filter((c) => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

        return true;
      }

      // Fallback to localStorage
      const allCategories = await this.getAllCategories();
      const filtered = allCategories.filter((c) => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }
}
