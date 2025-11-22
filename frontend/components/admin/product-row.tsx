"use client";

import { useTransition } from "react";
import type { Product } from "@/lib/types";
import { updateProductAction } from "@/app/actions/admin";

interface Props {
  product: Product;
}

export default function ProductRow({ product }: Props) {
  const [pending, startTransition] = useTransition();
  const toggleActive = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", String(product.id));
      formData.set("name", product.name);
      formData.set("description", product.description);
      formData.set("price", String(product.price));
      formData.set("stock_quantity", String(product.stock_quantity));
      if (product.category_id) formData.set("category_id", String(product.category_id));
      formData.set("image_url", product.image_url);
      formData.set("is_active", product.is_active ? "false" : "true");
      await updateProductAction(formData);
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow">
      <div>
        <div className="text-sm font-semibold">{product.name}</div>
        <div className="text-xs text-slate-600">
          ${product.price.toFixed(2)} · Stock {product.stock_quantity} · #{product.id}
        </div>
      </div>
      <button
        onClick={toggleActive}
        disabled={pending}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          product.is_active
            ? "border border-slate-300 text-slate-700 hover:border-red-300"
            : "bg-emerald-500 text-white hover:-translate-y-0.5"
        } disabled:opacity-60`}
      >
        {pending ? "Saving..." : product.is_active ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
