import Hero from "@/components/sections/hero";
import CategoryRow from "@/components/categories/category-row";
import ProductCard from "@/components/products/product-card";
import Perks from "@/components/sections/perks";
import Collections from "@/components/sections/collections";
import { catalogService } from "@/services/catalog-service";
import type { Product, Category } from "@/lib/types";

const fetchCatalog = async () => {
  const api = catalogService();
  try {
    const [categories, products] = await Promise.all([
      api.listCategories(),
      api.listProducts(),
    ]);
    return { categories, products };
  } catch (error) {
    return { categories: [] as Category[], products: [] as Product[] };
  }
};

export default async function HomePage() {
  const { categories, products } = await fetchCatalog();

  return (
    <div className="space-y-14">
      <Hero />
      <Perks />

      <section className="space-y-4" id="catalog">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
              curated catalog
            </p>
            <h2 className="text-3xl font-semibold text-white">Fast-moving products</h2>
            <p className="text-white/60">Live inventory directly from the FastAPI backend.</p>
          </div>
          <CategoryRow categories={categories} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.length ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
              No products yet. Seed via the admin workflow and refresh.
            </div>
          )}
        </div>
      </section>

      <Collections categories={categories} />
    </div>
  );
}
