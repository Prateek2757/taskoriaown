"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycLinkColumns } from "./column";

export default function MunicipalityPage() {
  const searchOptions = [
    {
      placeholder: "KYC Number",
      name: "kycNumber",
      type: "text",
    },
    {
      placeholder: "Policy Number",
      name: "policyNumber",
      type: "text",
    },
    {
      placeholder: "Agent Code",
      name: "agentCode",
      type: "text",
    },
  ];

  return (
    <>
      <DataTable
        searchOptions={searchOptions}
        columns={createKycLinkColumns}
        endpoint="kyclink_list"
      />
    </>
  );
}
