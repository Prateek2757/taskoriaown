"use client";
import { ArrowDown, FileText, Plus, Printer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createPolicyLoanColumns } from "./columns";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function Page() {
    const searchOptions = [
        {
            placeholder: "Filter Product Id",
            name: "productId",
            type: "text",
        },
        {
            placeholder: "Product Name",
            name: "productName",
            type: "text",
        },
    ];
    return (
        <div className="w-full">
            <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">

                <Button className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium">
                    <ArrowDown color="#fff" size={18} />
                    <span>Export</span>
                </Button>

                <Button
                    onClick={() => window.print()}
                    className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium"
                >
                    <Printer color="#fff" size={18} />
                    <span>Print</span>
                </Button>
                <Button asChild>
                    <Link
                        href="/policy-service/policy-loan/policy-loan/register"
                        className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                    >
                        <Plus color="#fff" size={18} />
                        <span>Register</span>
                    </Link>
                </Button>
            </div>
            <Tabs defaultValue="All" className="w-[400px] mt-3">
                <TabsList>
                    <TabsTrigger value="All">All</TabsTrigger>
                    <TabsTrigger value="Registered">Registered</TabsTrigger>
                    <TabsTrigger value="Pending">Pending</TabsTrigger>
                    <TabsTrigger value="Approved">Approved</TabsTrigger>
                </TabsList>
            </Tabs>
            
            <DataTable
                searchOptions={searchOptions}
                columns={createPolicyLoanColumns}
                endpoint="kyc_list"
            />
            
        </div>
    );
}
