"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddEditAgentTrainingSchema,
  type AddEditAgentTrainingDTO,
  emptyAgentTraining,
} from "@/app/(admin)/agent-training/schemas/agentTrainingSchema";

import KYCDetails from "../components/kycDetails";
import ExaminationInformation from "../components/ExaminationInformation";
import PanInformation from "../components/PanInformation";
import DocumentDetails from "../components/DocumentDetails";
import AgentTraningDocuments from "../components/AgentDocument";
import AdditionalDetails from "../components/AdditionalDetails";
import { Button } from "@/components/ui/button";
import AgentTrainingInfo from "../components/AgentTrainingInfo";

export default function AgentTrainingForm() {
  const form = useForm<AddEditAgentTrainingDTO>({
    resolver: zodResolver(AddEditAgentTrainingSchema),
    defaultValues: emptyAgentTraining,
  });

  const onSubmit = (data: AddEditAgentTrainingDTO) => {
    console.log("Submitted Data:", data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto p-4 space-y-8"
      >
        <KYCDetails
          kycData={{
            kycNumber: "KYC123",
            branchCode: "BR001",
            firstName: "John",
            lastName: "Doe",
          }}
          KycNumberEncrypted="encrypted123"
        />
        <ExaminationInformation form={form} />
        <AgentTrainingInfo form={form} />
        <PanInformation form={form} />
        <DocumentDetails form={form} />
        <AgentTraningDocuments form={form} />
        <AdditionalDetails form={form} />

        <div className="flex pt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-blue-600"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
