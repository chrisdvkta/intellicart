"use client";

import { useActionState } from "react";
import { createCategoryAction } from "@/app/actions/admin";

const initialState = { error: "", success: "" };

export default function CategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialState);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin</p>
          <h3 className="text-lg font-semibold text-white">Create category</h3>
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
          placeholder="Electronics"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Description</label>
        <textarea
          name="description"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="All the latest gadgets and gear."
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Image URL</label>
        <input
          name="image_url"
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="https://..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded border-white/30 bg-transparent" />
        Active
      </label>
      <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
        Create
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
    </form>
  );
}
