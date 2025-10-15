"use client";
import { DockIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

export default function Page() {
  return (
    <div className="">
      <div className="justify-end flex w-full">
        <Button className="bg-blue-500 ">
          {" "}
          <DockIcon /> Excell(.xls){" "}
        </Button>{" "}
      </div>
      <DataTable
        searchOptions={[]}
        columns={createKycColumns}
        endpoint="kyc_list"
        fulltable={false}
      />
    </div>
  );
}
