import ProductForm from "@/components/admin/product-form";
import ProductRow from "@/components/admin/product-row";
import { catalogService } from "@/services/catalog-service";
import { getSessionUser } from "@/lib/session";

export default async function AdminProductsPage() {
  const user = getSessionUser();
  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        <h1 className="text-3xl font-semibold text-white">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage products.</p>
      </div>
    );
  }

  const catalog = catalogService();
  const [categories, products] = await Promise.all([
    catalog.listCategories().catch(() => []),
    catalog.listProducts().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin · Products</p>
        <h1 className="text-3xl font-semibold text-white">Publish & control inventory</h1>
        <p className="text-white/70">Create products and toggle availability to mirror backend routes.</p>
      </div>

      <ProductForm categories={categories} />

      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between text-white">
          <h3 className="text-lg font-semibold">Catalog</h3>
          <span className="text-sm text-white/60">{products.length} total</span>
        </div>
        <div className="space-y-3">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
          {!products.length && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center text-white/70">
              No products yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
