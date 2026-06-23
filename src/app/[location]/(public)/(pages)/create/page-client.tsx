"use client";

import { Suspense } from "react";
import PageSkeleton from "@/components/skeleton/PageSkeleton";
import CategorySelectionContent from "@/components/signupcreate/categoryslectionpage";

export default function CategorySelectionPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategorySelectionContent />
    </Suspense>
  );
}