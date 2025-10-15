"use client";

import { useForm, FormProvider } from "react-hook-form";
import CommissionDisbursementForm from "../components/CommissionDistributionForm";

type CommissionFilterForm = {
  fromDate: string;
  toDate: string;
  agentCode: string;
  kycNo: string;
  licenseNo: string;
  panNo: string;
  branch: string;
  bankStatus: string;
  kycStatus: string;
  premiumType: string;
  businessType: string;
  sameBank: boolean;
};

export default function CommissionDisbursementPage() {
  const form = useForm<CommissionFilterForm>({
    defaultValues: {
      fromDate: "",
      toDate: "",
      agentCode: "",
      kycNo: "",
      licenseNo: "",
      panNo: "",
      branch: "",
      bankStatus: "VERIFIED",
      kycStatus: "VERIFIED",
      premiumType: "",
      businessType: "",
      sameBank: false,
    },
  });

  return (
    <main className="">
      <FormProvider {...form}>
        <CommissionDisbursementForm form={form} isLoggedIn={true} />
      </FormProvider>
    </main>
  );
}
