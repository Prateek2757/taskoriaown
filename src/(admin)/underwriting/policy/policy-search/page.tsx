"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";

export default function Page() {

    return (
        <div className="">
            
            <DataTable
                searchOptions={[]}
                columns={createKycColumns}
                endpoint="kyc_list"
            />
        </div>
    );
}
