"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin";

const initial = { error: "", success: "" };
const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusForm() {
  const [state, formAction] = useActionState(updateOrderStatusAction, initial);

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin</p>
          <h3 className="text-lg font-semibold text-slate-900">Update order status</h3>
        </div>
        {state.success && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {state.success}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">Order ID</label>
        <input
          name="order_id"
          type="number"
          min="1"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="123"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm text-slate-700">New status</label>
        <select
          name="new_status"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
        Update status
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  );
}
