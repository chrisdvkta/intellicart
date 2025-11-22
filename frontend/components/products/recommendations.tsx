import ProductCard from "./product-card";
import type { Product } from "@/lib/types";

interface Props {
  products: Product[];
}

export default function Recommendations({ products }: Props) {
  if (!products.length) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">You might also like</p>
          <h3 className="text-2xl font-semibold text-slate-900">Recommended for you</h3>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
