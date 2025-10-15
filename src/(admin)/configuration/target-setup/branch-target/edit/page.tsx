"use client";

import { FormProvider, useForm } from "react-hook-form";

import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import BranchTargetAdd from "../components/branchTargetAdd";
import { Button } from "@/components/ui/button";

export default function Page() {
  // Initialize form with default values
  const form = useForm<AddEditKycDTO>({
    defaultValues: {
      Targetdate: "",
      targetAmount: "",
      isActive: true,
    },
  });

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <BranchTargetAdd form={form} />
     
       <div className="flex items-end justify-start ml-0 ">
                    <Button className="bg-gray-800 text-white rounded-md px-4 py-2"
                      type="button"
                    >
                    <span>  Edit </span>
                    </Button>
				</div>

 </div>
    </FormProvider>
  );
}
