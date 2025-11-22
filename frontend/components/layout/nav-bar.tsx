import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/session";
import { APP_NAME } from "@/lib/config";

export default async function NavBar() {
  const user = getSessionUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400/20 text-emerald-300">
            IC
          </span>
          <div className="leading-tight">
            <div className="text-sm uppercase tracking-[0.2em] text-emerald-200/70">
              curated
            </div>
            <div className="text-xl font-semibold">{APP_NAME}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-white/80">
          <Link href="/#catalog" className="hover:text-white transition">
            Catalog
          </Link>
          <Link href="/cart" className="hover:text-white transition">
            Cart
          </Link>
          <Link href="/orders" className="hover:text-white transition">
            Orders
          </Link>
          {user?.admin && (
            <Link href="/admin" className="hover:text-white transition">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="hidden text-white/80 sm:inline">
                {user.email} {user.admin ? "(admin)" : ""}
              </span>
              <form action={logoutAction}>
                <button className="rounded-full bg-white px-4 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-white/40 px-4 py-2 text-white transition hover:border-white hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-white px-4 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
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
