"use client";

import { useActionState, useEffect } from "react";
import { checkoutAction } from "@/app/actions/order";
import { useToast } from "@/components/ui/toast-provider";

const initialState = { error: "", orderId: undefined as number | undefined, paymentId: undefined as number | undefined, status: "" };

export default function CheckoutForm() {
  const [state, formAction] = useActionState(checkoutAction, initialState);
  const { push } = useToast();

  useEffect(() => {
    if (state.orderId) {
      push(`Order #${state.orderId} placed`, "success");
    } else if (state.error) {
      push(state.error, "error");
    }
  }, [state.orderId, state.error, push]);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Checkout</p>
          <h3 className="text-xl font-semibold text-slate-900">Shipping & payment</h3>
        </div>
        {state.orderId && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Payment {state.status}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Shipping address</label>
        <textarea
          name="shipping_address"
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          placeholder="123 Main St, City, State 12345"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-slate-700">Payment method</label>
        <select
          name="payment_method"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
          defaultValue="cash_on_delivery"
        >
          <option value="cash_on_delivery">Cash on delivery</option>
          <option value="card">Card (Stripe)</option>
          <option value="bank_transfer">Bank transfer</option>
        </select>
      </div>
      <button className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg">
        Place order
      </button>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.orderId && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Order #{state.orderId} created. Payment #{state.paymentId} status: {state.status}
        </div>
      )}
    </form>
  );
}
