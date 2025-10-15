"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AgentLoanSetUpForm from "../(list)/components/AgentLoanSetUpForm";

type AddTrainingFormD = {
  fiscalYear: string;
  loanName: string;
  schemeName: string;
  schemeEffectiveFrom: string;
  schemeEffectiveTO: string;
  loanTimePeriod: number;
  loanType: string;
  interestRate: number;
  equivalent?: File;
  equivalentName?: string;
};

export default function Page() {
  const form = useForm<AddTrainingFormD>();

  const handleSubmit = (data: AddTrainingFormD) => {
    console.log("Submitted data", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <AgentLoanSetUpForm form={form} isLoggedIn={true} />
        <Button type="submit" className="btn btn-primary mt-4">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
