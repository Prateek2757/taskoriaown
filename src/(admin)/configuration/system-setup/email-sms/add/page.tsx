import { Suspense } from "react";
import TemplateForm from "../components/TemplateForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplateForm />
    </Suspense>
  );
}
