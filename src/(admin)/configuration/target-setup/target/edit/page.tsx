"use client";

import { FormProvider, useForm } from "react-hook-form";
import TargetSetupEdit from "./targetDetailsEdit";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";

export default function Page() {
  // Initialize react-hook-form with default values
  const form = useForm<AddEditKycDTO>({
    defaultValues: {
      fiscalyear: "",
      branchName: "",
      fpiConvTarget: "",
      nopConvTarget: "",
      fpiIndTermTarget: "",
      nopIndTermTarget: "",
      fpiMicroTarget: "",
      nopMicroTarget: "",
      noaTarget: "",
      isActive: true,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <TargetSetupEdit form={form} />
      </div>
    </FormProvider>
  );
}
