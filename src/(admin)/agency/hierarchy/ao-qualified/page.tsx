"use client";

import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createHierarchyTypeColumns } from "./columns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HierarchyTypeListPage() {
  const searchOptions = [
    { placeholder: "Filter Agent Code", name: "agentCode", type: "text" },
    { placeholder: "Filter Agent Name", name: "agentName", type: "text" },
    { placeholder: "Filter Premium", name: "premium", type: "text" },
  ];

  return (
    <div>
      <Tabs defaultValue="all" className="">
        <div className="relative md:absolute md:top-3 md:right-3 md:z-50">
          <TabsList className="w-auto">
            <TabsTrigger value="all">All List</TabsTrigger>
            <TabsTrigger value="ao">Qualified AO List</TabsTrigger>
            <TabsTrigger value="am">Qualified AM List</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">
          <DataTable
            searchOptions={searchOptions}
            columns={createHierarchyTypeColumns}
            endpoint="hierarchy_list"
          />
        </TabsContent>

        <TabsContent value="ao">
          <DataTable
            searchOptions={searchOptions}
            columns={createHierarchyTypeColumns}
            endpoint="qualified_bd_list"
          />
        </TabsContent>

        <TabsContent value="bm">
          <DataTable
            searchOptions={searchOptions}
            columns={createHierarchyTypeColumns}
            endpoint="qualified_bm_list"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
