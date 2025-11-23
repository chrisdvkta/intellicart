import ProductForm from "@/components/admin/product-form";
import ProductEditCard from "@/components/admin/product-edit-card";
import { catalogService } from "@/services/catalog-service";
import { getSessionUser } from "@/lib/session";

export default async function AdminProductsPage() {
  const user = getSessionUser();
  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Admin only</h1>
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
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin · Products</p>
        <h1 className="text-3xl font-semibold text-slate-900">Publish & control inventory</h1>
        <p className="text-slate-600">Create products and control availability.</p>
      </div>

      <ProductForm categories={categories} />

      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between text-slate-900">
          <h3 className="text-lg font-semibold">Catalog</h3>
          <span className="text-sm text-slate-500">{products.length} total</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <ProductEditCard key={product.id} product={product} categories={categories} />
          ))}
          {!products.length && (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-4 text-center text-slate-600 shadow">
              No products yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
