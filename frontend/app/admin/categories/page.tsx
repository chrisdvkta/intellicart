import CategoryForm from "@/components/admin/category-form";
import CategoryRow from "@/components/admin/category-row";
import { catalogService } from "@/services/catalog-service";
import { getSessionUser } from "@/lib/session";

export default async function AdminCategoriesPage() {
  const user = getSessionUser();
  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage categories.</p>
      </div>
    );
  }

  const categories = await catalogService().listCategories().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin · Categories</p>
        <h1 className="text-3xl font-semibold text-slate-900">Collections</h1>
        <p className="text-slate-600">Create categories to group products for shoppers.</p>
      </div>

      <CategoryForm />

      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between text-slate-900">
          <h3 className="text-lg font-semibold">Existing categories</h3>
          <span className="text-sm text-slate-500">{categories.length} total</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} />
          ))}
          {!categories.length && (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-4 text-center text-slate-600 shadow">
              No categories yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
