import { Suspense } from "react";
import { SchemeWaiveForm } from "../components/SchemeWaiveForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchemeWaiveForm />
    </Suspense>
  );
}
