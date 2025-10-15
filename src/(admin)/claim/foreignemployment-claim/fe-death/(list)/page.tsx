"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  feDeathAllColumns,
  feDeathPendingColumns,
  feDeathRecommendedColumns,
  feDeathApprovedColumns,
} from "./columns";

export default function FeDeathClaimListPage() {
  return (
    <div>
      <Tabs defaultValue="all">
        {/* Top-right: Tabs + Add button */}
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50 flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All List</TabsTrigger>
            <TabsTrigger value="pending">Pending List</TabsTrigger>
            <TabsTrigger value="recommended">Recommended List</TabsTrigger>
            <TabsTrigger value="approved">Approved List</TabsTrigger>
          </TabsList>

          <Button asChild>
            <Link
              href="/claim/fe-claim/fe-death/add"
              className="flex items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={18} />
              <span>Add </span>
            </Link>
          </Button>
        </div>

        {/* All List */}
        <TabsContent value="all">
          <DataTable
            searchOptions={[
              {
                placeholder: "Filter Policy No",
                name: "policyNo",
                type: "text",
              },
              {
                placeholder: "Filter Full Name",
                name: "fullName",
                type: "text",
              },
            ]}
            columns={feDeathAllColumns}
            endpoint="fe_death_all_list"
          />
        </TabsContent>

        {/* Pending List */}
        <TabsContent value="pending">
          <DataTable
            searchOptions={[
              {
                placeholder: "Filter Policy No",
                name: "policyNo",
                type: "text",
              },
              {
                placeholder: "Filter Full Name",
                name: "fullName",
                type: "text",
              },
            ]}
            columns={feDeathPendingColumns}
            endpoint="fe_death_pending_list"
          />
        </TabsContent>

        {/* Recommended List */}
        <TabsContent value="recommended">
          <DataTable
            searchOptions={[
              {
                placeholder: "Filter Policy No",
                name: "policyNo",
                type: "text",
              },
              {
                placeholder: "Filter Full Name",
                name: "fullName",
                type: "text",
              },
            ]}
            columns={feDeathRecommendedColumns}
            endpoint="fe_death_recommended_list"
          />
        </TabsContent>

        {/* Approved List */}
        <TabsContent value="approved">
          <DataTable
            searchOptions={[
              {
                placeholder: "Filter Policy No",
                name: "policyNo",
                type: "text",
              },
              {
                placeholder: "Filter Full Name",
                name: "fullName",
                type: "text",
              },
            ]}
            columns={feDeathApprovedColumns}
            endpoint="fe_death_approved_list"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
