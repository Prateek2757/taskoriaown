"use client";

import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AddProposalDTO, ProposalRequiredFields } from "../proposalSchema";
import FixedDepositReport from "../components/FixedDepositReport";
import Link from "next/link";
import { FileDown, FileText, Printer } from "lucide-react";

export default function Page() {
  const form = useForm<AddProposalDTO>({
    defaultValues: {
      fromdate: "",
      todate: "",
      fdno: "",
      bankname: "",
      reporttype: "",
    },
  });

  const proposalRequiredFields: ProposalRequiredFields = {
    branchList: [
      { value: "nepal", text: "Nepal" },
      { value: "india", text: "India" },
      { value: "china", text: "China" },
    ],
  };

  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
          <Button className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            Export
          </Button>

          <Button className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2">
            <FileText className="w-4 h-4" />
            PDF
          </Button>

          <Button className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        <div className="bg-white rounded-lg border mt-4 gap-4">
          <FixedDepositReport
            form={form}
            proposalRequiredFields={proposalRequiredFields}
          />
        </div>

        <div className="flex justify-start mt-6">
          <Button asChild>
            <Link
              href="/investment/report/search"
              className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-gray-600 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
            >
              <span>Search</span>
            </Link>
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
