import OrderStatusForm from "@/components/admin/order-status-form";
import { getSessionUser } from "@/lib/session";

export default function AdminOrdersPage() {
  const user = getSessionUser();
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
        <p className="text-slate-600">Advance orders from pending to delivered for your customers.</p>
      </div>

      <OrderStatusForm />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-lg">
        <p className="font-semibold text-slate-900">Status flow</p>
        <p>pending → confirmed → processing → shipped → delivered (or cancelled)</p>
      </div>
    </div>
  );
}
