"use client";

import { useRouter } from "next/navigation";
import ManageEquivalentCashFrom from "../manage-equivalent-cash/ManageEquivalentCashFrom";
import { AddSchemeDTO } from "../schemas/addSchemeSchema";

export default function AddSchemePage() {
  const router = useRouter();

  const handleFormSubmit = (data: AddSchemeDTO) => {
    console.log("Submitted data:", data);

    router.push("/setup/scheme-criteria");
  };

  return < ManageEquivalentCashFrom onSubmit={handleFormSubmit} />;
}
