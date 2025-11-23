'use server';

import { revalidatePath } from "next/cache";
import { cartService } from "@/services/cart-service";
import { getSessionToken } from "@/lib/session";

const ensureToken = () => {
  const token = getSessionToken();
  if (!token) {
    throw new Error("You need to be logged in to manage your cart.");
  }
  return token;
};

export async function addToCartAction(productId: number, quantity = 1) {
  const token = await ensureToken();
  const cartApi = cartService(token);
  await cartApi.addItem(productId, quantity);
  revalidatePath("/cart");
  return { message: "Added to cart" };
}

export async function updateCartItemAction(itemId: number, quantity: number) {
  const token = await ensureToken();
  const cartApi = cartService(token);
  await cartApi.updateQuantity(itemId, quantity);
  revalidatePath("/cart");
  return { message: "Cart updated" };
}

export async function removeCartItemAction(itemId: number) {
  const token = await ensureToken();
  const cartApi = cartService(token);
  await cartApi.removeItem(itemId);
  revalidatePath("/cart");
  return { message: "Item removed" };
}
