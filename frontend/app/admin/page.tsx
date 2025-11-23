import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default async function AdminHome() {
  const user = await getSessionUser();

  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-700 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage catalog and orders.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/auth/login" className="rounded-full bg-slate-900 px-4 py-2 text-white">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-slate-200 px-4 py-2 text-slate-900">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Categories", href: "/admin/categories", detail: "Create and manage collections." },
    { title: "Products", href: "/admin/products", detail: "Publish new products and toggle status." },
    { title: "Orders", href: "/admin/orders", detail: "Advance order statuses and keep customers updated." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Admin console</p>
        <h1 className="text-3xl font-semibold text-slate-900">Operate the shop</h1>
        <p className="text-slate-600">Operate catalog, products, and orders from one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg transition hover:-translate-y-1 hover:border-emerald-200/60"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Manage</p>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-sm text-slate-600">{card.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
