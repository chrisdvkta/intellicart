import Link from "next/link";
import PlasmaBg from "@/components/ui/plasma-bg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-emerald-50 to-blue-50 px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
      <PlasmaBg className="opacity-100" />
      <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">
            fresh drops
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Shop statement tech, streetwear, and home drops—no boring inventory.
          </h1>
          <p className="max-w-2xl text-lg text-slate-700">
            Limited-run releases, live stock, and checkout that just works. Add the looks you love
            and track them from cart to doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#catalog"
              className="rounded-full bg-slate-900 px-5 py-3 text-white transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore the catalog
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-slate-300 px-5 py-3 text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-500"
            >
              Join & start a wishlist
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-700">
            <div>
              <div className="text-2xl font-semibold text-slate-900">Same-week</div>
              delivery on featured gear.
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">Hassle-free</div>
              returns & instant status updates.
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">Curated</div>
              by merchandisers, not algorithms.
            </div>
          </div>
        </div>
        <div className="relative h-full w-full rounded-3xl border border-slate-200 bg-white p-6 backdrop-blur">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span>Realtime cart</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">live</span>
            </div>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-white"
                >
                  <div>
                    <div className="text-sm font-semibold">Drop #{item} · Limited</div>
                    <div className="text-xs text-white/80">Ships this week</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-200">$ {(120 + item * 30).toFixed(0)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-white/80">
              <span>Order ready in</span>
              <span className="text-lg font-semibold text-white">02:38</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
