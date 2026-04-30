"use client"
import dynamic from "next/dynamic";
import PageSkeleton from "../skeleton/PageSkeleton";

const ServicePageClient = dynamic(
  () => import("@/components/servicePage/ServicePage"),
  {
    loading: () => (
      <div className="min-h-screen w-full">
        <div className="animate-pulse text-gray-400"><PageSkeleton/></div>
      </div>
    ),
  }
);

export default function ServicePageWrapper(
  props: React.ComponentProps<typeof ServicePageClient>
) {
  return <ServicePageClient {...props} />;
}