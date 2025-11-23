import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import AddToCartButton from "./add-to-cart-button";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
            <Link href={`/products/${product.id}`} className="hover:text-emerald-600">
              {product.name}
            </Link>
          </h3>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {product.stock_quantity > 0 ? `${product.stock_quantity} left` : "Sold out"}
          </div>
          <AddToCartButton productId={product.id} compact />
        </div>
      </div>
    </div>
  );
}
