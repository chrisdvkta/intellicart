"use client";

import { useActionState } from "react";
import { createProductAction } from "@/app/actions/admin";
import type { Category } from "@/lib/types";

const initialState = { error: "", success: "" };

interface Props {
  categories: Category[];
}

export default function ProductForm({ categories }: Props) {
  const [state, formAction] = useActionState(createProductAction, initialState);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin</p>
          <h3 className="text-lg font-semibold text-white">Publish product</h3>
        </div>
        {state.success && (
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
            {state.success}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Name</label>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="iPhone 15 Pro"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Description</label>
        <textarea
          name="description"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="Latest flagship with titanium shell."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-white/70">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            placeholder="999.99"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-white/70">Stock</label>
          <input
            name="stock_quantity"
            type="number"
            min="0"
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            placeholder="50"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-white/70">Category</label>
          <select
            name="category_id"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            defaultValue=""
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-white/70">Image URL</label>
          <input
            name="image_url"
            required
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
            placeholder="https://..."
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded border-white/30 bg-transparent" />
        Active
      </label>
      <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
        Publish
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
    </form>
  );
}
