import Hero from "@/components/sections/hero";
import CategoryRow from "@/components/categories/category-row";
import ProductCard from "@/components/products/product-card";
import Perks from "@/components/sections/perks";
import Collections from "@/components/sections/collections";
import Recommendations from "@/components/products/recommendations";
import { catalogService } from "@/services/catalog-service";
import type { Product, Category } from "@/lib/types";
import PlasmaBg from "@/components/ui/plasma-bg";

const fetchCatalog = async () => {
  const api = catalogService();
  try {
    const [categories, products] = await Promise.all([
      api.listCategories(),
      api.listProducts(),
    ]);
    const recs =
      products.length > 0
        ? await api.getRecommendations(products[0].id, 6).catch(() => [])
        : [];
    return { categories, products, recs };
  } catch (error) {
    return {
      categories: [] as Category[],
      products: [] as Product[],
      recs: [] as Product[],
    };
  }
};

export default async function HomePage() {
  const { categories, products, recs } = await fetchCatalog();

  return (
    <div className="space-y-14">
      <Hero />
      <Perks />

      <section
        className="relative space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl"
        id="catalog"
      >
        <PlasmaBg className="opacity-90" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">
              curated catalog
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Fast-moving products
            </h2>
            <p className="text-slate-600">
              Live inventory refreshed in real time.
            </p>
          </div>
          <CategoryRow categories={categories} />
        </div>
        <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.length ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow">
              No products yet. Check back soon for fresh drops.
            </div>
          )}
        </div>
      </section>

      {!!recs.length && <Recommendations products={recs} />}

      <Collections categories={categories} />
    </div>
  );
}
