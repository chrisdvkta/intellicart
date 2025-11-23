"use client";

import { useTransition } from "react";
import Image from "next/image";
import { updateCartItemAction, removeCartItemAction } from "@/app/actions/cart";
import { useToast } from "@/components/ui/toast-provider";

export type CartLine = {
  id: number;
  name: string;
  productId: number;
  quantity: number;
  price: number;
  image?: string | null;
};

interface Props {
  line: CartLine;
}

export default function CartItemCard({ line }: Props) {
  const [pending, startTransition] = useTransition();
  const { push } = useToast();

  const update = (quantity: number) =>
    startTransition(async () => {
      await updateCartItemAction(line.id, quantity);
      push("Cart updated", "success");
    });

  const remove = () =>
    startTransition(async () => {
      await removeCartItemAction(line.id);
      push("Removed from cart", "success");
    });

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/5">
        <Image src={line.image || "/placeholder.png"} alt={line.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-slate-900">{line.name}</p>
          <span className="text-sm text-emerald-700">${line.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <button
            onClick={() => update(Math.max(1, line.quantity - 1))}
            disabled={pending || line.quantity <= 1}
            className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400 disabled:opacity-50"
          >
            −
          </button>
          <span className="text-slate-900">{line.quantity}</span>
          <button
            onClick={() => update(line.quantity + 1)}
            disabled={pending}
            className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400 disabled:opacity-50"
          >
            +
          </button>
          <button
            onClick={remove}
            disabled={pending}
            className="ml-2 text-xs text-red-500 hover:text-red-400"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
