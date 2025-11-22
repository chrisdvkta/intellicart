import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/products/add-to-cart-button";
import ProductCard from "@/components/products/product-card";
import Recommendations from "@/components/products/recommendations";
import PlasmaBg from "@/components/ui/plasma-bg";
import { catalogService } from "@/services/catalog-service";
import type { Product } from "@/lib/types";

const fetchProduct = async (id: number) => {
  const api = catalogService();
  const product = await api.getProduct(id).catch(() => null);
  const siblings = await api.listProducts().catch(() => []);
  const recommendations = await api.getRecommendations(id, 6).catch(() => []);
  return {
    product,
    siblings: siblings.filter((item) => item.id !== id).slice(0, 3),
    recommendations: recommendations.filter((item) => item.id !== id),
  };
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const { product, siblings, recommendations } = await fetchProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="relative space-y-12">
      <PlasmaBg className="opacity-90" />
      <div className="relative grid gap-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <Image
            src={(product as Product).image_url || "/placeholder.svg"}
            alt={(product as Product).name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            #{product?.id}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Product</p>
            <h1 className="text-3xl font-semibold text-slate-900">{product?.name}</h1>
          </div>
          <p className="text-lg text-slate-700">{product?.description}</p>
          <div className="flex items-center gap-3 text-slate-900">
            <span className="text-2xl font-semibold">${product?.price.toFixed(2)}</span>
            <span className="text-sm text-slate-600">
              {product?.stock_quantity} in stock · {product?.is_active ? "active" : "inactive"}
            </span>
          </div>
          <AddToCartButton productId={productId} />
        </div>
      </div>

      {!!recommendations.length && <Recommendations products={recommendations} />}

      {!!siblings.length && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">More from the catalog</h2>
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
