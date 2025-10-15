import { Suspense } from "react";
import MunicipalityForm from "../components/MunicipalityForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MunicipalityForm />
    </Suspense>
  );
}
