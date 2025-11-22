"use client";

import { useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { useToast } from "@/components/ui/toast-provider";

interface Props {
  productId: number;
  compact?: boolean;
}

export default function AddToCartButton({ productId, compact }: Props) {
  const [pending, startTransition] = useTransition();
  const { push } = useToast();

  const handleAdd = () => {
    startTransition(async () => {
      try {
        await addToCartAction(productId, 1);
        push("Added to cart", "success");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unable to add";
        push(msg, "error");
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
    </div>
  );
}
