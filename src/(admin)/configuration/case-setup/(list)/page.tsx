"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createCaseSetupColumns } from "./columns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PopupForm from "./PopupForm";

export default function Page() {
  const searchOptions = [
    { placeholder: "Filter by Name", name: "name", type: "text" },
    { placeholder: "Filter by Unique Id", name: "uniqueId", type: "text" },
  ];

  return (
    <div>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
            >
              <Plus size={18} />
              <span className="font-bold">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
            </DialogHeader>
            <PopupForm />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        searchOptions={searchOptions}
        columns={createCaseSetupColumns}
        endpoint="case_setup_list"
      />
    </div>
  );
}
