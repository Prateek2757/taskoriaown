"use client";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";

type Props = {
  name: string;
  category_id?: string;
  slug: string;
  img_url: string;
};
export default function GostGuidePage({ slug }: Props) {
  const { categories, loading } = useCategories();
  const matched = categories?.filter((cat) => cat.slug === slug);
  return (
    <section>
      <div>
        {matched?.map((cat) => (
          // <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
            <article>
            <Link href={`/cost-guides/${cat.slug}`} className="block">
              <div className="relative h-80 w-full flex justify-center rounded-2xl overflow-hidden">
                <img
                  src={cat.image_url || "/taskorialogonew.png"}
                  alt={cat.name} className="h-full w-auto object-full"
                />
              </div>
            </Link>
            <h1 className="absolute">{cat.name}</h1>
          </article>
        ))}
      </div>
    </section>
  );
}
