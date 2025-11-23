"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin";
import type { Order, OrderStatus } from "@/lib/types";
import { useToast } from "@/components/ui/toast-provider";

interface Props {
  orders: Order[];
}

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderList({ orders }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [_, startTransition] = useTransition();
  const { push } = useToast();

  const handleUpdate = (orderId: number, status: OrderStatus) => {
    startTransition(async () => {
      setPendingId(orderId);
      const formData = new FormData();
      formData.set("order_id", String(orderId));
      formData.set("new_status", status);
      const res = await updateOrderStatusAction({}, formData);
      if (res?.error) {
        push(res.error, "error");
      } else {
        push(`Order #${orderId} → ${status}`, "success");
      }
      setPendingId(null);
    });
  };

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow">
        No recent orders for this admin account. Use a customer Order ID to update status.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Recent orders</p>
          <p className="text-sm text-slate-600">Select a status and update directly.</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-semibold">Order #{order.id}</span>
                <span className="text-xs text-slate-600">
                  {order.status} · ${order.total_amount.toFixed(2)} · {order.shipping_address}
                </span>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                {order.payment_method}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-xs text-slate-600">Set status</label>
              <select
                defaultValue={order.status}
                onChange={(e) => handleUpdate(order.id, e.target.value as OrderStatus)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-800"
                disabled={pendingId === order.id}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {pendingId === order.id && <span className="text-xs text-slate-500">Updating…</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
