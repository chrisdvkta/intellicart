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
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-white">
      <div>
        <div className="text-sm font-semibold">{product.name}</div>
        <div className="text-xs text-white/60">
          ${product.price.toFixed(2)} · Stock {product.stock_quantity} · #{product.id}
        </div>
      </div>
      <button
        onClick={toggleActive}
        disabled={pending}
        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
          product.is_active
            ? "border border-white/20 text-white hover:border-red-200/60"
            : "bg-emerald-400 text-slate-900 hover:-translate-y-0.5"
        } disabled:opacity-60`}
      >
        {pending ? "Saving..." : product.is_active ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
