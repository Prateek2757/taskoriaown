import ServiceCategoriesClient from "@/components/services/serviceCategories";
import { fetchCategories } from "@/utils/api";
import { Metadata } from "next";



export async function generateMetadata(): Promise<Metadata> {
  const categories = await fetchCategories();
  return {
    title: `Browse Services | Hire Local Professionals Across Australia – Taskoria`,
    description: `Explore  ${categories.length}  of services on Taskoria—from cleaning and trades to digital and creative work. Compare verified providers and hire with confidence.`,
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
