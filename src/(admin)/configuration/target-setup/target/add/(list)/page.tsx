"use client";
import { LinkIcon, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createProposalColumns } from "./columns";
import FormSelect from "@/components/formElements/FormSelect";

import { FormProvider, useForm } from "react-hook-form";

export default function ProposalList() {
  const form = useForm({
    defaultValues: {
      fiscalYear: "",
    },
  });

  const fiscalYearOptions = [
    { text: "2025/26", value: "2025-26" },
    { text: "2024/25", value: "2024-25" },
    { text: "2023/24", value: "2023-24" },
  ];

  const searchOptions = [
    {
      placeholder: "fiscal year",
      name: "FiscalYear",
      type: "text",
    },
  ];

  return (
    <FormProvider {...form}>
      <div className="bg-white rounded-lg border border-gray-200 mb-2 mt-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Branch Wise Target List
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-0">
            <div className="y-2 ">
              <FormSelect
                form={form}
                name="fiscalYear"
                label="Fiscal Year"
                options={fiscalYearOptions}
                required
              />
            </div>
          </div>
        </div>
        <div className="pl-4 pt-0">
          <DataTable
            searchOptions={searchOptions}
            columns={createProposalColumns}
            endpoint="online_proposal_list"
          />
        </div>
      </div>

      <div className="flex justify-start mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/target-setup/add">
            <span>Submit</span>
          </Link>
        </Button>
      </div>
    </FormProvider>
  );
}
