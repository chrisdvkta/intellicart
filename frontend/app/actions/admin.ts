'use server';

import { revalidatePath } from "next/cache";
import { catalogService } from "@/services/catalog-service";
import { orderService } from "@/services/order-service";
import { getSessionToken, getSessionUser } from "@/lib/session";
import type { ActionResult } from "./auth";
import type { ProductInput } from "@/lib/types";

const requireAdmin = async () => {
  const [token, user] = await Promise.all([getSessionToken(), getSessionUser()]);
  if (!token || !user?.admin) {
    throw new Error("Admin access required");
  }
  return { token, user };
};

export async function createCategoryAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const name = formData.get("name")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const image_url = formData.get("image_url")?.toString() || undefined;
    const is_active = formData.get("is_active")?.toString() === "on";

    if (!name || !description) return { error: "Name and description are required" };

    await catalogService(token).createCategory({ name, description, image_url, is_active });
    revalidatePath("/admin/categories");
    return { success: "Category created" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create category";
    return { error: message };
  }
}

export async function updateCategoryAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const id = Number(formData.get("id") ?? 0);
    const name = formData.get("name")?.toString() ?? "";
    const description = formData.get("description")?.toString() ?? "";
    const image_url = formData.get("image_url")?.toString() || undefined;
    const is_active = formData.get("is_active")?.toString() === "on";

    if (!id || !name || !description) return { error: "All fields are required" };

    await catalogService(token).updateCategory(id, { name, description, image_url, is_active });
    revalidatePath("/admin/categories");
    return { success: "Category updated" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update category";
    return { error: message };
  }
}

export async function deleteCategoryAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const id = Number(formData.get("id") ?? 0);
    if (!id) return { error: "Missing category id" };
    await catalogService(token).deleteCategory(id);
    revalidatePath("/admin/categories");
    return { success: "Category deleted" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete category";
    return { error: message };
  }
}

export async function createProductAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const payload: ProductInput = {
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      price: Number(formData.get("price") ?? 0),
      stock_quantity: Number(formData.get("stock_quantity") ?? 0),
      category_id: formData.get("category_id")
        ? Number(formData.get("category_id"))
        : undefined,
      image_url: formData.get("image_url")?.toString() || "",
      is_active: formData.get("is_active")?.toString() === "on",
    };

    if (!payload.name || !payload.description || !payload.image_url) {
      return { error: "Name, description, and image are required" };
    }

    await catalogService(token).createProduct(payload);
    revalidatePath("/admin/products");
    return { success: "Product published" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create product";
    return { error: message };
  }
}

export async function updateProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const id = Number(formData.get("id") ?? 0);
    if (!id) return { error: "Missing product id" };

    const rawActive = formData.get("is_active")?.toString();
    const isActiveFlag = rawActive === "true" || rawActive === "on";

    const payload: ProductInput = {
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() ?? "",
      price: Number(formData.get("price") ?? 0),
      stock_quantity: Number(formData.get("stock_quantity") ?? 0),
      category_id: formData.get("category_id")
        ? Number(formData.get("category_id"))
        : undefined,
      image_url: formData.get("image_url")?.toString() || "",
      is_active: isActiveFlag,
    };

    await catalogService(token).updateProduct(id, payload);
    revalidatePath("/admin/products");
    return { success: "Product updated" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update product";
    return { error: message };
  }
}

export async function deleteProductAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const id = Number(formData.get("id") ?? 0);
    if (!id) return { error: "Missing product id" };
    await catalogService(token).deleteProduct(id);
    revalidatePath("/admin/products");
    return { success: "Product deleted" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete product";
    return { error: message };
  }
}

export async function updateOrderStatusAction(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const { token } = await requireAdmin();
    const orderId = Number(formData.get("order_id") ?? 0);
    const newStatus = formData.get("new_status")?.toString();
    if (!orderId || !newStatus) return { error: "Order ID and status required" };

    await orderService(token).updateStatus(orderId, newStatus as any);
    revalidatePath("/admin/orders");
    return { success: "Order status updated" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update order";
    return { error: message };
  }
}
