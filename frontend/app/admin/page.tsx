import Link from "next/link";
import { getSessionUser } from "@/lib/session";

export default function AdminHome() {
  const user = getSessionUser();

  if (!user?.admin) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
        <h1 className="text-3xl font-semibold text-white">Admin only</h1>
        <p className="mt-2">Sign in with an admin account to manage catalog and orders.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/auth/login" className="rounded-full bg-white px-4 py-2 text-slate-900">
            Sign in
          </Link>
          <Link href="/" className="rounded-full border border-white/30 px-4 py-2 text-white">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Categories", href: "/admin/categories", detail: "Create and manage collections." },
    { title: "Products", href: "/admin/products", detail: "Publish new products and toggle status." },
    { title: "Orders", href: "/admin/orders", detail: "Advance order statuses per workflow." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Admin console</p>
        <h1 className="text-3xl font-semibold text-white">Operate the shop</h1>
        <p className="text-white/70">Mirror every backend step from complete_workflow.http.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-lg transition hover:-translate-y-1 hover:border-emerald-200/60"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-white/60">Manage</p>
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-sm text-white/70">{card.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
