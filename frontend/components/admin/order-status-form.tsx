"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin";

const initial = { error: "", success: "" };
const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusForm() {
  const [state, formAction] = useActionState(updateOrderStatusAction, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin</p>
          <h3 className="text-lg font-semibold text-white">Update order status</h3>
        </div>
        {state.success && (
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
            {state.success}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">Order ID</label>
        <input
          name="order_id"
          type="number"
          min="1"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="123"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-white/70">New status</label>
        <select
          name="new_status"
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
        Update status
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
    </form>
  );
}
