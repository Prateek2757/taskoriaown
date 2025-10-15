import { Suspense } from "react";
import { RiderCriteriaForm } from "../components/RiderCriteriaForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiderCriteriaForm />
    </Suspense>
  );
}
