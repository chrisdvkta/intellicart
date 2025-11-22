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
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700"
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}
