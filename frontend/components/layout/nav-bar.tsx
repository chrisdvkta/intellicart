import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/session";
import { APP_NAME } from "@/lib/config";

export default async function NavBar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
            IC
          </span>
          <div className="leading-tight">
            <div className="text-sm uppercase tracking-[0.2em] text-emerald-600">
              curated
            </div>
            <div className="text-xl font-semibold">{APP_NAME}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-700">
          <Link href="/#catalog" className="hover:text-slate-900 transition">
            Catalog
          </Link>
          <Link href="/cart" className="hover:text-slate-900 transition">
            Cart
          </Link>
          <Link href="/orders" className="hover:text-slate-900 transition">
            Orders
          </Link>
          {user?.admin && (
            <Link href="/admin" className="hover:text-slate-900 transition">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-slate-600 sm:inline">
                {user.email} {user.admin ? "(admin)" : ""}
              </span>
              <form action={logoutAction}>
                <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:-translate-y-0.5 hover:shadow-lg">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-slate-200 px-4 py-2 text-slate-800 transition hover:border-slate-400 hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-emerald-500 px-4 py-2 text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
