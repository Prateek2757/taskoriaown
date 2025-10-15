import { Suspense } from "react";
import { RiderTypeForm } from "../components/RiderTypeForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RiderTypeForm />
    </Suspense>
  );
}
