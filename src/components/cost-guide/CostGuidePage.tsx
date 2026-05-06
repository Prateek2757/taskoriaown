"use client"
import { useCategories } from "@/hooks/useCategories";

type Props = {
  slug: string;
};
export default function GostGuidePage({ slug }: Props) {
  const { categories, loading } = useCategories();
  const matched = categories?.filter((cat) => cat.slug === slug);
  return (
    <div>
      {matched?.map((cat) => (
        <div key={cat.slug}>
          <h1>{cat.name}</h1>
        </div>
      ))}
    </div>
  );
}
