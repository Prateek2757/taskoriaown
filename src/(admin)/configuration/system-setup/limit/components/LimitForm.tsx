"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import LimitDetails from "./LimitDetails";
import UnderwritingDetails from "./UnderWriting";
import Loan from "./Loan";
import PolicyServicingDetails from "./PolicyServicing";
import Claims from "./Claims";
import Journal from "./Journal";
import { Button } from "@/components/ui/button";

function LimitForm() {
  const form = useForm({
    defaultValues: {
      limit: "",
      roleName: "",
      // Underwriting defaults
      minMedicalSA: "",
      maxMedicalSA: "",
      minMedicalAge: "",
      maxMedicalAge: "",
      minNonMedicalSA: "",
      maxNonMedicalSA: "",
      minNonMedicalAge: "",
      maxNonMedicalAge: "",
      // Policy Servicing defaults
      minSurrenderAmount: "",
      maxSurrenderAmount: "",
      minMaturityAmount: "",
      maxMaturityAmount: "",
      minSurvivalAmount: "",
      maxSurvivalAmount: "",
      minDeathClaimAmount: "",
      maxDeathClaimAmount: "",
      minAdultRiderAmount: "",
      maxAdultRiderAmount: "",
      minChildRiderAmount: "",
      maxChildRiderAmount: "",
      minForeignClaimAmount: "",
      maxForeignClaimAmount: "",
      minVoucherAmount: "",
      maxVoucherAmount: "",
      isActive: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Submitted: ", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
        <LimitDetails />
        <UnderwritingDetails form={form} />
        <Loan form={form} />
        <PolicyServicingDetails form={form} />
        <Claims form={form} />
        <Journal form={form} />
        <Button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700
                                text-white text-sm py-2 px-6 rounded-md flex
                                items-center"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export default LimitForm;
