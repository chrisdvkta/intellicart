"use client";

import { useTransition } from "react";
import type { Category } from "@/lib/types";
import { deleteCategoryAction, updateCategoryAction } from "@/app/actions/admin";
import { useToast } from "@/components/ui/toast-provider";

interface Props {
  category: Category;
}

export default function CategoryRow({ category }: Props) {
  const [pending, startTransition] = useTransition();
  const { push } = useToast();

  const onSave = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateCategoryAction({}, formData);
      if (result?.error) push(result.error, "error");
      else push("Category updated", "success");
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", String(category.id));
      const result = await deleteCategoryAction({}, fd);
      if (result?.error) push(result.error, "error");
      else push("Category deleted", "success");
    });
  };

  return (
    <form
      action={onSave}
      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow"
    >
      <input type="hidden" name="id" value={category.id} />
      <div className="flex items-center justify-between">
        <input
          name="name"
          defaultValue={category.name}
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900"
          required
        />
        <span className="ml-3 text-xs text-slate-500">#{category.id}</span>
      </div>
      <textarea
        name="description"
        defaultValue={category.description}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
        rows={2}
        required
      />
      <input
        name="image_url"
        defaultValue={category.image_url ?? ""}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-800"
        placeholder="Image URL"
      />
      <label className="flex items-center gap-2 text-xs text-slate-700">
        <input type="checkbox" name="is_active" defaultChecked={category.is_active} />
        Active
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:shadow disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
