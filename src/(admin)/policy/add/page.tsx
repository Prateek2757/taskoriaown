import { Suspense } from "react";
import PolicyForm from "../policyForm";


export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
          <PolicyForm />
        </Suspense>
    );
}
