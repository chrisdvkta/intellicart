"use client";

import { useActionState, useEffect } from "react";
import { createCategoryAction } from "@/app/actions/admin";
import { useToast } from "@/components/ui/toast-provider";

const initialState = { error: "", success: "" };

export default function CategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, initialState);
  const { push } = useToast();

  useEffect(() => {
    if (state.success) push(state.success, "success");
    if (state.error) push(state.error, "error");
  }, [state.error, state.success, push]);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin</p>
          <h3 className="text-lg font-semibold text-slate-900">Create category</h3>
        </div>
        {state.success && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {state.success}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Name</label>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="Electronics"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Description</label>
        <textarea
          name="description"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="All the latest gadgets and gear."
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Image URL</label>
        <input
          name="image_url"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="https://..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="is_active" defaultChecked className="h-4 w-4 rounded border-white/30 bg-transparent" />
        Active
      </label>
      <button className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
        Create
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
