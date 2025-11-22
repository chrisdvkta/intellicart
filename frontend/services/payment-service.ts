import { createClient } from "@/lib/http-client";
import type { Payment, PaymentMethod } from "@/lib/types";

export class PaymentService {
  constructor(private readonly token?: string) {}

  private client = createClient(this.token);

  async createPayment(orderId: number, method: PaymentMethod) {
    return this.client.post<Payment>(
      `/payments/create?order_id=${orderId}`,
      { payment_method: method }
    );
  }

  async getPaymentForOrder(orderId: number) {
    return this.client.get<Payment>(`/payments/order/${orderId}`);
  }
}

export const paymentService = (token?: string) => new PaymentService(token);
