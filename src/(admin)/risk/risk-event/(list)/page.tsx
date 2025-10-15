"use client";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createRiskColumns } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList,TabsTrigger } from "@/components/ui/tabs";

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
        <div className="">
            <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
                <Button asChild>
                    <Link
                        href="risk-event/add"
                        className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                    >
                        <Plus color="#fff" size={18} />
                        <span>Register New Risk</span>
                    </Link>
                </Button>
            </div>
            <Tabs defaultValue="allRisks" className=" mt-3">
                <TabsList>
                    <TabsTrigger value="allRisks">All Risks</TabsTrigger>
                    <TabsTrigger value="registered">Registered</TabsTrigger>
                    <TabsTrigger value="forwarded">Forwarded</TabsTrigger>
                    <TabsTrigger value="reverted">Reverted</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="deleted">Deleted</TabsTrigger>
                </TabsList>
            </Tabs>
            <DataTable
                searchOptions={searchOptions}
                columns={createRiskColumns}
                endpoint="proposal_list"
            />

        </div>
    );
}
