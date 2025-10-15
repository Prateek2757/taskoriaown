"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";


import type { AddProposalDTO} from "../proposalSchema";
import FixedDepositAdjustmentAdd from "../../components/FixedDepositAdjustmentAdd";

export default function Page() {
  // Initialize react-hook-form
  const form = useForm<AddProposalDTO>({
    defaultValues: {
      fdno: "",
      transactiondate: "",
    },
  });

  

  return (
    <FormProvider {...form}>
           <div className="bg-white rounded-lg border mb-3 mt-4 justify-start">
           <FixedDepositAdjustmentAdd />
           </div>
           
           <div className="flex justify-start">
             <Button type="submit" className="bg-gray-800 hover:bg-gray-800">
              Submit
             </Button>
           </div>
         
       </FormProvider>
  );
}
