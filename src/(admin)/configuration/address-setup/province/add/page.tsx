"use client";

import { Suspense } from "react";
import ProvinceForm from "../component/ProvinceForm";

export default function ProvincePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProvinceForm />
    </Suspense>
  );
}
