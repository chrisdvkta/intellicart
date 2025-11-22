import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
}

export default function CategoryRow({ categories }: Props) {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <span
          key={category.id}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-200/50 hover:text-white"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}
