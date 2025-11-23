import Link from "next/link";
import OrderCard from "@/components/orders/order-card";
import { orderService } from "@/services/order-service";
import { getSessionToken } from "@/lib/session";

const fetchOrders = async () => {
  const token = await getSessionToken();
  if (!token) return null;
  const orders = await orderService(token).getOrders().catch(() => []);
  return { orders };
};

export default async function OrdersPage() {
  const data = await fetchOrders();

  if (!data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Track your orders</h2>
        <p className="mt-2">Sign in to see past and current deliveries.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/auth/login" className="rounded-full bg-slate-900 px-4 py-2 text-white">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-slate-900">
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Orders</p>
        <h1 className="text-3xl font-semibold text-slate-900">Status at a glance</h1>
        <p className="text-slate-600">Follow your order journey from pending to delivered.</p>
      </div>

      {data.orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
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
