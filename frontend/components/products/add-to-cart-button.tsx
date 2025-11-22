"use client";

import { useTransition, useState } from "react";
import { addToCartAction } from "@/app/actions/cart";

interface Props {
  productId: number;
  compact?: boolean;
}

export default function AddToCartButton({ productId, compact }: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleAdd = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        await addToCartAction(productId, 1);
        setMessage("Added");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unable to add";
        setMessage(msg);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleAdd}
        disabled={pending}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          compact
            ? "bg-emerald-400 text-slate-900 hover:-translate-y-0.5"
            : "bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-lg"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {pending ? "Adding..." : "Add to cart"}
      </button>
      {message && <span className="text-xs text-white/70">{message}</span>}
    </div>
  );
}
