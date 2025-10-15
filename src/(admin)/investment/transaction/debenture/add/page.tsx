"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import TransactionDetails from "../components/Transaction";
import DebentureDetails from "../components/DebentureDetails";

export default function Page() {
  // Initialize react-hook-form
  const form = useForm<AddProposalDTO>({
    defaultValues: {
      companyName: "",
      shortName: "",
      companyAddress: "",
      currencycode: "",
      companylogoInBase64: "",
      companylogoName: "",
      isActive: true,
    },
  });

  // Example options for select fields (replace with API data later)
  const proposalRequiredFields: ProposalRequiredFields = {
    branchList: [
      { value: "nepal", text: "Nepal" },
      { value: "india", text: "India" },
      { value: "china", text: "China" },
    ],
  };
  

  return (
   
    <FormProvider {...form}>
        <div className="bg-white rounded-lg border mb-3 mt-4 justify-start">
        <DebentureDetails form={form} proposalRequiredFields={proposalRequiredFields} />
        <TransactionDetails form={form} />
        
        </div>
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-gray-800 hover:bg-gray-800">
            Submit
          </Button>
        </div>
      
    </FormProvider>
    
  );
}
