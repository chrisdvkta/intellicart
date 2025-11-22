import CategoryForm from "@/components/admin/category-form";
import { catalogService } from "@/services/catalog-service";
import { getSessionUser } from "@/lib/session";

export default async function AdminCategoriesPage() {
  const user = getSessionUser();
  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        <h1 className="text-3xl font-semibold text-white">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage categories.</p>
      </div>
    );
  }

  const categories = await catalogService().listCategories().catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin · Categories</p>
        <h1 className="text-3xl font-semibold text-white">Collections</h1>
        <p className="text-white/70">Create categories to group products, matching the backend flow.</p>
      </div>

      <CategoryForm />

      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between text-white">
          <h3 className="text-lg font-semibold">Existing categories</h3>
          <span className="text-sm text-white/60">{categories.length} total</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-white shadow"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">{cat.name}</h4>
                <span className="text-xs text-white/60">#{cat.id}</span>
              </div>
              <p className="text-sm text-white/70 line-clamp-2">{cat.description}</p>
              <p className="mt-2 text-xs text-white/60">{cat.is_active ? "Active" : "Inactive"}</p>
            </div>
          ))}
          {!categories.length && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-center text-white/70">
              No categories yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
