import AdminOrderList from "@/components/admin/admin-order-list";
import { getSessionUser, getSessionToken } from "@/lib/session";
import { orderService } from "@/services/order-service";

export default async function AdminOrdersPage() {
  const user = getSessionUser();
  const token = getSessionToken();
  const myOrders = token ? await orderService(token).getOrders().catch(() => []) : [];

  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin · Orders</p>
        <h1 className="text-3xl font-semibold text-slate-900">Advance statuses</h1>
        <p className="text-slate-600">Pick an order below and update its status instantly.</p>
      </div>

      <AdminOrderList orders={myOrders.slice(0, 12)} />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-lg">
        <p className="font-semibold text-slate-900">Status flow</p>
        <p>pending → confirmed → processing → shipped → delivered (or cancelled)</p>
      </div>
    </div>
  );
}
