"use client";

import { useFormState } from "react-dom";
import { checkoutAction } from "@/app/actions/order";

const initialState = { error: "", orderId: undefined as number | undefined, paymentId: undefined as number | undefined, status: "" };

export default function CheckoutForm() {
  const [state, formAction] = useFormState(checkoutAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Checkout</p>
          <h3 className="text-xl font-semibold text-white">Shipping & payment</h3>
        </div>
        {state.orderId && (
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
            Payment {state.status}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70">Shipping address</label>
        <textarea
          name="shipping_address"
          required
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          placeholder="123 Main St, City, State 12345"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70">Payment method</label>
        <select
          name="payment_method"
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white outline-none ring-emerald-300/30 focus:border-emerald-200/60 focus:ring-2"
          defaultValue="cash_on_delivery"
        >
          <option value="cash_on_delivery">Cash on delivery</option>
          <option value="card">Card (Stripe)</option>
          <option value="bank_transfer">Bank transfer</option>
        </select>
      </div>
      <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
        Place order
      </button>
      {state.error && <p className="text-sm text-red-300">{state.error}</p>}
      {state.orderId && (
        <div className="rounded-xl border border-emerald-300/40 bg-emerald-400/10 p-3 text-sm text-emerald-100">
          Order #{state.orderId} created. Payment #{state.paymentId} status: {state.status}
        </div>
      )}
    </form>
  );
}
