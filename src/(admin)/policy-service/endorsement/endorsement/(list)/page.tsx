"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createPolicyColumns } from "./columns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
    const searchOptions = [
        {
            placeholder: "Filter Policy Number",
            name: "policyNumber",
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
                        href="endorsement/add"
                        className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                    >
                        <Plus color="#fff" size={18} />
                        <span>Add Endorsement</span>
                    </Link>
                </Button>
            </div>
            <Tabs defaultValue="All" className="w-[400px] mt-3">
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="mopChange">MOP Change</TabsTrigger>
                    <TabsTrigger value="occupationExtraChange">Occupation Extra Change</TabsTrigger>
                    <TabsTrigger value="riderChange">Rider Change</TabsTrigger>
                    <TabsTrigger value="premiumNonEffective">Premium Non Effective</TabsTrigger>
                    <TabsTrigger value="dobChange">DOB Change</TabsTrigger>
                </TabsList>

            </Tabs>
            <DataTable
                searchOptions={searchOptions}
                columns={createPolicyColumns}
                endpoint="proposal_list"
            />
        </div>
    );
}
