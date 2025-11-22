import OrderStatusForm from "@/components/admin/order-status-form";
import { getSessionUser } from "@/lib/session";

export default function AdminOrdersPage() {
  const user = getSessionUser();
  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        <h1 className="text-3xl font-semibold text-white">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin · Orders</p>
        <h1 className="text-3xl font-semibold text-white">Advance statuses</h1>
        <p className="text-white/70">
          Use the same steps as backend/tests/complete_workflow.http to move orders from pending to delivered.
        </p>
      </div>

      <OrderStatusForm />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
        <p className="font-semibold text-white">Status flow</p>
        <p>pending → confirmed → processing → shipped → delivered (or cancelled)</p>
      </div>
    </div>
  );
}
