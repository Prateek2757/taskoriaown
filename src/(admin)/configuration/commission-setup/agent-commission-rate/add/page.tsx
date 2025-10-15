"use client";

import { FormProvider, useForm } from "react-hook-form";
import CommissionDetails from "../components/commissionAdd";



export default function Page() {
  // Initialize react-hook-form
  const form = useForm<AddEditKycDTO>({
    defaultValues: {
      permanentWardNumber: "", // initial controlled value
      photoFile: null,
      photoFileName: "",
    },
  });

  return (
    <FormProvider {...form}>
    <div className=" min-h-screen">
      {/* Commission Details Form */}
      <CommissionDetails form={form} />

      {/* Submit Button */}
     
    </div>
    </FormProvider>
  );
}
