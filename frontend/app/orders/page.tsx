import Link from "next/link";
import OrderCard from "@/components/orders/order-card";
import { orderService } from "@/services/order-service";
import { getSessionToken } from "@/lib/session";

const fetchOrders = async () => {
  const token = getSessionToken();
  if (!token) return null;
  const orders = await orderService(token).getOrders().catch(() => []);
  return { orders };
};

export default async function OrdersPage() {
  const data = await fetchOrders();

  if (!data) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        <h2 className="text-2xl font-semibold text-white">Track your orders</h2>
        <p className="mt-2">Sign in to see past and current deliveries.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/auth/login" className="rounded-full bg-white px-4 py-2 text-slate-900">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-white/30 px-4 py-2 text-white">
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Orders</p>
        <h1 className="text-3xl font-semibold text-white">Status at a glance</h1>
        <p className="text-white/60">Live states from FastAPI: pending → delivered.</p>
      </div>

      {data.orders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
          No orders yet. Convert a cart to an order to see it here.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
