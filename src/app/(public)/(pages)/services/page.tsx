import ServiceCategoriesClient from "@/components/services/serviceCategories";
import { fetchCategories } from "@/utils/api";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await fetchCategories();

  return {
    title: `Explore Service Categories — Taskoria`,
    description: `Browse ${categories.length} service categories and find skilled professionals.`,
    openGraph: {
      title: "Service Categories — Taskoria",
      description: "Discover top-rated professionals across diverse categories.",
    },
  };
}

export default async function ServicesPage() {
  const categories = await fetchCategories();

  return <ServiceCategoriesClient  categories={categories} />;
}
