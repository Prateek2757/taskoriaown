"use client";

import { Suspense } from "react";
import DistrictForm from "../components/DistrictForm";

export default function DistrictPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DistrictForm />
    </Suspense>
  );
}
