import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

export default function Collections({ categories }: Props) {
  if (!categories.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">Shop by category</p>
          <h2 className="text-2xl font-semibold text-white">Collections built for discovery</h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((category) => (
          <div
            key={category.id}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-200/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
            {category.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.image_url}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )}
            <div className="relative space-y-2">
              <span className="inline-flex rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                Curated
              </span>
              <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              <p className="text-sm text-white/70 line-clamp-2">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
