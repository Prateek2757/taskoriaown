import React, { Suspense } from "react";
import ApplicationUserForm from "../components/ApplicationUserForm";

function page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center mt-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
        </div>
      }
    >
      <ApplicationUserForm />
    </Suspense>
  );
}

export default page;
