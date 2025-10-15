"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createDoctorColumns } from "./columns";

export default function DoctorList() {
  const searchOptions = [
    {
      placeholder: "Doctor Name",
      name: "doctorName",
      type: "text",
    },
  ];

  return (
    <>
      <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
        <Button asChild className="dark:bg-gray-800 dark:text-white">
          <Link href="/configuration/organization-setup/doctor/add">
            <Plus size={18} />
            <span>Add New Doctor</span>
          </Link>
        </Button>
      </div>
      <DataTable
        searchOptions={searchOptions}
        columns={createDoctorColumns}
        endpoint="doctor_list"
      />
    </>
  );
}
