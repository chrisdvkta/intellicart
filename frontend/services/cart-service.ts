import { createClient } from "@/lib/http-client";
import type { CartItem, CartSummary } from "@/lib/types";

export class CartService {
  constructor(private readonly token?: string) {}

  private client = createClient(this.token);

  async getCart() {
    return this.client.get<CartSummary>("/cart");
  }

  async addItem(productId: number, quantity: number) {
    return this.client.post<CartItem>("/cart/items", {
      product_id: productId,
      quantity,
    });
  }

  async updateQuantity(itemId: number, quantity: number) {
    return this.client.put<CartItem | { message: string }>(
      `/cart/items/${itemId}?quantity=${quantity}`
    );
  }

  async removeItem(itemId: number) {
    return this.client.delete<{ message: string }>(`/cart/items/${itemId}`);
  }
}

export const cartService = (token?: string) => new CartService(token);
