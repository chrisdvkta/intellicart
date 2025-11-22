import { createClient } from "@/lib/http-client";
import type { Order, OrderStatus, PaymentMethod } from "@/lib/types";

export class OrderService {
  constructor(private readonly token?: string) {}

  private client = createClient(this.token);

  async getOrders() {
    return this.client.get<Order[]>("/orders");
  }

  async getOrder(orderId: number) {
    return this.client.get<Order>(`/orders/${orderId}`);
  }

  async createFromCart(cartId: number, input: { shipping_address: string; payment_method: PaymentMethod }) {
    return this.client.post<Order>(`/orders/from-cart?cart_id=${cartId}`, input);
  }

  async updateStatus(orderId: number, newStatus: OrderStatus) {
    return this.client.patch<Order>(`/orders/${orderId}/status`, { new_status: newStatus });
  }
}

export const orderService = (token?: string) => new OrderService(token);
