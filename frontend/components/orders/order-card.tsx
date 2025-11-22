import type { Order } from "@/lib/types";

interface Props {
  order: Order;
}

const statusColor: Record<Order["status"], string> = {
  pending: "bg-amber-400/20 text-amber-200",
  confirmed: "bg-emerald-400/20 text-emerald-200",
  processing: "bg-blue-400/20 text-blue-200",
  shipped: "bg-cyan-400/20 text-cyan-200",
  delivered: "bg-emerald-500/20 text-emerald-100",
  cancelled: "bg-red-400/20 text-red-200",
};

export default function OrderCard({ order }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Order</p>
          <h3 className="text-xl font-semibold">#{order.id}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status]}`}>
          {order.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70">Shipped to: {order.shipping_address}</p>
      <div className="mt-3 flex items-center justify-between text-sm text-white/80">
        <span>Payment: {order.payment_method}</span>
        <span className="text-lg font-semibold text-emerald-200">${order.total_amount.toFixed(2)}</span>
      </div>
    </div>
  );
}
