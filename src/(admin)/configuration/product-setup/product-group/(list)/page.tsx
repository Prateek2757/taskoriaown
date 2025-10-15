"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createProductGroupColumns } from "./columns";

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
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/configuration/product-setup/product-group/add">
            <Plus color="#fff" size={18} />
            <span>Add New Product Group</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createProductGroupColumns}
        endpoint="productgroup_list"
      />
    </>
  );
}
