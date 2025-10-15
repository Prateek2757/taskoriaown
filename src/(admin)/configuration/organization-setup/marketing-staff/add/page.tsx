"use client";

import { Suspense } from "react";
import MarketingStaffForm from "../components/MarketingStaffForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MarketingStaffForm />
    </Suspense>
  );
}
