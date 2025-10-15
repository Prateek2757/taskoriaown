"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import Link from "next/link";
import FixedDepositReportSearch from "../components/FdReportSearch";

export default function Page() {
  // Initialize react-hook-form
  const form = useForm<AddProposalDTO>({
    defaultValues: {
      fromdate: "",
      todate: "",
      fdno: "",
      bankname: "",
      reporttype: "",
    },
  });
  
  

  return (
     <FormProvider {...form}>
        <div className="min-h-screen">

        <div className="bg-white rounded-lg border-1 mt-4 gap-4">
        <FixedDepositReportSearch form={form} />
        
        </div>
    
        </div>
    </FormProvider>
    
  );
}

