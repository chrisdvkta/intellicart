import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/add-to-cart-button";
import ProductCard from "@/components/products/product-card";
import { catalogService } from "@/services/catalog-service";
import type { Product } from "@/lib/types";

const fetchProduct = async (id: number) => {
  const api = catalogService();
  const product = await api.getProduct(id).catch(() => null);
  const siblings = await api.listProducts().catch(() => []);
  return { product, siblings: siblings.filter((item) => item.id !== id).slice(0, 3) };
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const { product, siblings } = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl">
          <Image
            src={(product as Product).image_url || "/placeholder.svg"}
            alt={(product as Product).name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-emerald-400/30 px-3 py-1 text-xs font-semibold text-white">
            #{product?.id}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Product</p>
            <h1 className="text-3xl font-semibold text-white">{product?.name}</h1>
          </div>
          <p className="text-lg text-white/70">{product?.description}</p>
          <div className="flex items-center gap-3 text-white">
            <span className="text-2xl font-semibold">${product?.price.toFixed(2)}</span>
            <span className="text-sm text-white/60">
              {product?.stock_quantity} in stock · {product?.is_active ? "active" : "inactive"}
            </span>
          </div>
          <AddToCartButton productId={productId} />
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white/70">
            <p className="font-semibold text-white">Why this product</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Synced with live FastAPI inventory and stock controls.</li>
              <li>Ships once payment is confirmed (COD supported out of the box).</li>
              <li>Eligible for order status tracking: pending → delivered.</li>
            </ul>
          </div>
        </div>
      </div>

      {!!siblings.length && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">You may also like</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {siblings.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
