"use client";

import { Suspense } from "react";
import DoctorForm from "../components/DoctorForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorForm />
    </Suspense>
  );
}
