'use server';

import { revalidatePath } from "next/cache";
import { cartService } from "@/services/cart-service";
import { orderService } from "@/services/order-service";
import { paymentService } from "@/services/payment-service";
import { getSessionToken } from "@/lib/session";
import type { PaymentMethod } from "@/lib/types";

type CheckoutResult = {
  error?: string;
  orderId?: number;
  paymentId?: number;
  status?: string;
};

export async function checkoutAction(_: CheckoutResult, formData: FormData): Promise<CheckoutResult> {
  const token = await getSessionToken();
  if (!token) {
    return { error: "Please login to checkout." };
  }

  const shipping_address = formData.get("shipping_address")?.toString() ?? "";
  const payment_method = (formData.get("payment_method")?.toString() ??
    "cash_on_delivery") as PaymentMethod;

  if (!shipping_address) {
    return { error: "Shipping address is required" };
  }

  try {
    const cartApi = cartService(token);
    const orderApi = orderService(token);
    const paymentApi = paymentService(token);

    const cart = await cartApi.getCart();
    const order = await orderApi.createFromCart(cart.cart.id, {
      shipping_address,
      payment_method,
    });
    const payment = await paymentApi.createPayment(order.id, payment_method);

    revalidatePath("/cart");
    revalidatePath("/orders");

    return {
      orderId: order.id,
      paymentId: payment.id,
      status: payment.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return { error: message };
  }
}
