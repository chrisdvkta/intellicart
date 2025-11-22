"use client";

import { useTransition } from "react";
import Image from "next/image";
import { updateCartItemAction, removeCartItemAction } from "@/app/actions/cart";

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

  const update = (quantity: number) =>
    startTransition(async () => {
      await updateCartItemAction(line.id, quantity);
    });

  const remove = () =>
    startTransition(async () => {
      await removeCartItemAction(line.id);
    });

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/5">
        <Image src={line.image || "/placeholder.svg"} alt={line.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-base font-semibold text-white">{line.name}</p>
          <span className="text-sm text-emerald-200">${line.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <button
            onClick={() => update(Math.max(1, line.quantity - 1))}
            disabled={pending || line.quantity <= 1}
            className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 disabled:opacity-50"
          >
            −
          </button>
          <span className="text-white">{line.quantity}</span>
          <button
            onClick={() => update(line.quantity + 1)}
            disabled={pending}
            className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20 disabled:opacity-50"
          >
            +
          </button>
          <button
            onClick={remove}
            disabled={pending}
            className="ml-2 text-xs text-red-300 hover:text-red-200"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
