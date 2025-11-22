import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1021] via-slate-950 to-[#02060f] px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/80">
            fresh drops
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Shop statement tech, streetwear, and home drops—no boring inventory.
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Limited-run releases, live stock, and checkout that just works. Add the looks you love
            and track them from cart to doorstep.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#catalog"
              className="rounded-full bg-white px-5 py-3 text-slate-900 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Explore the catalog
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full border border-white/30 px-5 py-3 text-white transition hover:-translate-y-0.5 hover:border-white"
            >
              Join & start a wishlist
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/80">
            <div>
              <div className="text-2xl font-semibold text-white">Same-week</div>
              delivery on featured gear.
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">Hassle-free</div>
              returns & instant status updates.
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">Curated</div>
              by merchandisers, not algorithms.
            </div>
          </div>
        </div>
        <div className="relative h-full w-full rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
          <div className="rounded-2xl bg-slate-900/80 p-4 shadow-inner">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Realtime cart</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">live</span>
            </div>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/40 px-3 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-white">Drop #{item} · Limited</div>
                    <div className="text-xs text-white/50">Ships this week</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-200">$ {(120 + item * 30).toFixed(0)}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-white/70">
              <span>Order ready in</span>
              <span className="text-lg font-semibold text-white">02:38</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
