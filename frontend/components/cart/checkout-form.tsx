"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { checkoutAction } from "@/app/actions/order";
import { useToast } from "@/components/ui/toast-provider";
import type { PaymentMethod } from "@/lib/types";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/config";

const initialState = {
  error: "",
  orderId: undefined as number | undefined,
  paymentId: undefined as number | undefined,
  status: "",
  paymentMethod: undefined as PaymentMethod | undefined,
  clientSecret: undefined as string | undefined,
};

const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

export default function CheckoutForm() {
  // We still render the form even if Stripe is not configured so COD works.
  const stripeInstance = useMemo(() => stripePromise, []);
  return (
    <Elements stripe={stripeInstance}>
      <CheckoutFormContents stripeConfigured={Boolean(STRIPE_PUBLISHABLE_KEY)} />
    </Elements>
  );
}

function CheckoutFormContents({ stripeConfigured }: { stripeConfigured: boolean }) {
  const [state, formAction, isSubmitting] = useActionState(checkoutAction, initialState);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [cardError, setCardError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { push } = useToast();

  useEffect(() => {
    if (state.orderId) {
      push(`Order #${state.orderId} placed`, "success");
    } else if (state.error) {
      push(state.error, "error");
    }
  }, [state.orderId, state.error, push]);

  useEffect(() => {
    const confirmCardPayment = async () => {
      if (state.paymentMethod !== "card" || !state.clientSecret) return;
      if (!stripe || !elements) return;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setCardError("Add your card details to pay with Stripe.");
        return;
      }

      setIsConfirming(true);
      setCardError(null);

      const result = await stripe.confirmCardPayment(state.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        const message = result.error.message ?? "Card confirmation failed.";
        setCardError(message);
        push(message, "error");
      } else if (result.paymentIntent?.status === "succeeded") {
        push("Payment confirmed successfully.", "success");
      } else {
        push("Payment submitted. Waiting for confirmation.", "default");
      }

      setIsConfirming(false);
    };

    confirmCardPayment();
  }, [state.paymentMethod, state.clientSecret, stripe, elements, push]);

  const disableCardOption = !stripeConfigured;
  const isBusy = isSubmitting || isConfirming;

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Checkout</p>
          <h3 className="text-xl font-semibold text-slate-900">Shipping & payment</h3>
        </div>
        {state.orderId && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Payment {state.status || "pending"}
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
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none ring-emerald-300/30 focus:border-emerald-400/60 focus:ring-2"
        >
          <option value="cash_on_delivery">Cash on delivery</option>
          <option value="card" disabled={disableCardOption}>
            Card (Stripe)
          </option>
          <option value="bank_transfer" disabled>
            Bank transfer (coming soon)
          </option>
        </select>
        {paymentMethod === "card" && !stripeConfigured && (
          <p className="text-sm text-amber-700">
            Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable card payments.
          </p>
        )}
      </div>

      {paymentMethod === "card" && stripeConfigured && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="text-sm font-medium text-slate-700">Card details</label>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <CardElement
              options={{
                style: {
                  base: {
                    color: "#0f172a",
                    fontSize: "16px",
                    "::placeholder": { color: "#cbd5e1" },
                  },
                  invalid: { color: "#ef4444" },
                },
              }}
            />
          </div>
          <p className="text-xs text-slate-500">We use Stripe to encrypt and process your payment securely.</p>
        </div>
      )}

      <button
        className="w-full rounded-full bg-slate-900 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isBusy || (paymentMethod === "card" && !stripeConfigured)}
      >
        {isBusy ? "Processing..." : "Place order"}
      </button>

      {paymentMethod === "card" && cardError && (
        <p className="text-sm text-red-500">
          {cardError}
        </p>
      )}
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      {state.orderId && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Order #{state.orderId} created. Payment #{state.paymentId} status: {state.status || "pending"}. Stripe will
          update the order once the payment intent settles.
        </div>
      )}
    </form>
  );
}
