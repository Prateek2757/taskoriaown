"use client";
import { FileDown, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createTemplateColumns } from "./column";

export default function Page() {
  const searchOptions = [
    {
      placeholder: "Filter KYC Number",
      name: "kycNumber",
      type: "text",
    },
    {
      placeholder: "Filter Name",
      name: "FullName",
      type: "text",
    },
    {
      placeholder: "Mobile Number",
      name: "MobileNumber",
      type: "tel",
    },
  ];
  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild>
          <Link href="/configuration/system-setup/email-sms/add">
            <Plus size={18} />
            <span>Add Email / SMS</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createTemplateColumns}
        endpoint="emailsms_list"
      />
    </>
  );
}
