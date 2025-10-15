"use client"; // Only if using Next.js App Router

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddAgentInfoDTO,
  AddAgentInfoSchema,
  emptyAgentInfo,
} from "./schemas/agenctSchema";
import CorporateAgentInfo from "./components/CorporateAgentInfo";
import AgentDocuments from "./components/AgentDocuments";
const Page = () => {
  const form = useForm<AddAgentInfoDTO>({
    resolver: zodResolver(AddAgentInfoSchema),
    defaultValues: emptyAgentInfo,
  });

  const onSubmit = (data: AddAgentInfoDTO) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-10 ">
        <div className="border border-gray border-gray-200 rounded-lg p-6">
          <CorporateAgentInfo form={form} />
          <AgentDocuments form={form} />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default Page;
