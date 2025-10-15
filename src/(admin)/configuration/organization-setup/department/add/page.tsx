"use client";

import { Suspense } from "react";
import DepartmentForm from "../components/DepartmentForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepartmentForm />
    </Suspense>
  );
}
