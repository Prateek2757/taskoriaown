import { Suspense } from "react";
import { ProductGroupForm } from "../components/ProductGroupForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductGroupForm />
    </Suspense>
  );
}
