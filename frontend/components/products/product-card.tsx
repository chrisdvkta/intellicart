import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import AddToCartButton from "./add-to-cart-button";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-slate-900 to-slate-950 shadow-xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/70" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-white line-clamp-2">
            <Link href={`/products/${product.id}`} className="hover:text-emerald-200">
              {product.name}
            </Link>
          </h3>
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-white/60">
            {product.stock_quantity > 0 ? `${product.stock_quantity} left` : "Sold out"}
          </div>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
