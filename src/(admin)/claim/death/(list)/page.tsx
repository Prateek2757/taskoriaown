"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  deathAllColumns,
  deathPendingColumns,
  deathRecommendedColumns,
  deathApprovedColumns,
} from "./columns";

export default function DeathListPage() {
  return (
    <div>
      <Tabs defaultValue="all">
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50 flex gap-2">
          <TabsList>
            <TabsTrigger value="all">All List</TabsTrigger>
            <TabsTrigger value="pending">Pending List</TabsTrigger>
            <TabsTrigger value="recommended">Recommended List</TabsTrigger>
            <TabsTrigger value="approved">Approved List</TabsTrigger>
          </TabsList>

          <Button asChild>
            <Link
              href="/claim/death/add"
              className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 font-medium"
            >
              <Plus size={18} color="#fff" />
              <span>Add Death Claim</span>
            </Link>
          </Button>
        </div>

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
            columns={deathAllColumns}
            endpoint="death_all_list"
          />
        </TabsContent>

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
            columns={deathPendingColumns}
            endpoint="death_pending_list"
          />
        </TabsContent>

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
            columns={deathRecommendedColumns}
            endpoint="death_recommended_list"
          />
        </TabsContent>

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
            columns={deathApprovedColumns}
            endpoint="death_approved_list"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
