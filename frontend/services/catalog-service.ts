import { createClient } from "@/lib/http-client";
import type { Category, CategoryInput, Product, ProductInput } from "@/lib/types";

export class CatalogService {
  constructor(private readonly token?: string) {}

  private client = createClient(this.token);

  async listProducts() {
    return this.client.get<Product[]>("/products");
  }

  async getProduct(id: number) {
    return this.client.get<Product>(`/products/${id}`);
  }

  async listCategories() {
    const data = await this.client.get<Category[] | { categories: Category[] }>("/categories");
    if (Array.isArray(data)) return data;
    if (data && "categories" in data && Array.isArray((data as any).categories)) {
      return (data as any).categories as Category[];
    }
    return [];
  }

  async createCategory(input: CategoryInput) {
    return this.client.post<Category>("/categories", input);
  }

  async updateCategory(id: number, input: CategoryInput) {
    return this.client.put<Category>(`/categories/${id}`, input);
  }

  async deleteCategory(id: number) {
    return this.client.delete<{ message: string }>(`/categories/${id}`);
  }

  async createProduct(input: ProductInput) {
    return this.client.post<Product>("/products", input);
  }

  async updateProduct(id: number, input: ProductInput) {
    return this.client.put<Product>(`/products/${id}`, input);
  }

  async deleteProduct(id: number) {
    return this.client.delete<{ message: string }>(`/products/${id}`);
  }

  async getRecommendations(seedProductId: number, limit = 6) {
    return this.client.get<Product[]>(
      `/recommendations?seed_product_id=${seedProductId}&limit=${limit}`
    );
  }
}

export const catalogService = (token?: string) => new CatalogService(token);
