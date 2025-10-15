"use client";
import { DockIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";
import CommissionDashboard from "./TopPart";

export default function Page() {
  return (
    <div className="">
      
      <CommissionDashboard/>
      <DataTable
        searchOptions={[]}
        columns={createKycColumns}
        endpoint="kyc_list"
        fulltable={false}
      />
    </div>
  );
}
