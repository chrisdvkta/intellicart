"use client";

import { useTransition } from "react";
import type { Category, Product } from "@/lib/types";
import { updateProductAction, deleteProductAction } from "@/app/actions/admin";
import { useToast } from "@/components/ui/toast-provider";

interface Props {
  product: Product;
  categories: Category[];
}

export default function ProductEditCard({ product, categories }: Props) {
  const [pending, startTransition] = useTransition();
  const { push } = useToast();

  const onSave = (formData: FormData) => {
    startTransition(async () => {
      const res = await updateProductAction(formData);
      if (res?.error) push(res.error, "error");
      else push("Product updated", "success");
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", String(product.id));
      const res = await deleteProductAction({}, fd);
      if (res?.error) push(res.error, "error");
      else push("Product deleted", "success");
    });
  };

  return (
    <form
      action={onSave}
      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow"
    >
      <input type="hidden" name="id" value={product.id} />
      <div className="flex items-center justify-between">
        <input
          name="name"
          defaultValue={product.name}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900"
          required
        />
        <span className="ml-3 text-xs text-slate-500">#{product.id}</span>
      </div>
      <textarea
        name="description"
        defaultValue={product.description}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
        rows={2}
        required
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-xs text-slate-700">
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={product.price}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
            required
          />
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-700">
          Stock
          <input
            name="stock_quantity"
            type="number"
            min={0}
            defaultValue={product.stock_quantity}
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
            required
          />
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-slate-700">
          Category
          <select
            name="category_id"
            defaultValue={product.category_id ?? ""}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-700">
          Image URL
          <input
            name="image_url"
            defaultValue={product.image_url}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
            required
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-700">
        <input type="checkbox" name="is_active" defaultChecked={product.is_active} />
        Active
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
