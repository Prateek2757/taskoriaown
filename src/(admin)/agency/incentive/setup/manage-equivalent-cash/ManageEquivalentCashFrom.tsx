"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/formElements/FormInput";
import FormCombo from "@/components/formElements/FormCombo";
import {
  AddSchemeDTO,
  addSchemeSchema,
  emptyAddScheme,
} from "../schemas/addSchemeSchema";
import { Button } from "@/components/ui/button";

type SelectOption = {
  text: string;
  value: string | number;
};

type ManageEquivalentCashFromProps = {
  onSubmit: (data: AddSchemeDTO) => void;
  initialValues?: AddSchemeDTO; 
};

export default function ManageEquivalentCashFrom({
  onSubmit,
  initialValues,
}: ManageEquivalentCashFromProps) {
  const form = useForm<AddSchemeDTO>({
    resolver: zodResolver(addSchemeSchema),
    defaultValues: initialValues || emptyAddScheme,
  });

  const fiscalYears: SelectOption[] = [
    { text: "2021/22", value: "2021/22" },
    { text: "2022/23", value: "2022/23" },
    { text: "2023/24", value: "2023/24" },
  ];

  const schemeForOptions: SelectOption[] = [
    { text: "AM", value: "AM" },
    { text: "TM", value: "TM" },
    { text: "Agent", value: "Agent" },
  ];

  const nepaliMonths: SelectOption[] = [
    { text: "Baisakh", value: "Baisakh" },
    { text: "Jestha", value: "Jestha" },
    { text: "Ashadh", value: "Ashadh" },
    { text: "Shrawan", value: "Shrawan" },
    { text: "Bhadra", value: "Bhadra" },
    { text: "Ashwin", value: "Ashwin" },
    { text: "Kartik", value: "Kartik" },
    { text: "Mangsir", value: "Mangsir" },
    { text: "Poush", value: "Poush" },
    { text: "Magh", value: "Magh" },
    { text: "Falgun", value: "Falgun" },
    { text: "Chaitra", value: "Chaitra" },
  ];

  return (
    <FormProvider {...form}>
      <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Scheme Detail</h2>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border border-dashed border-blue-300 bg-white rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <FormCombo
                form={form}
                name="fiscalYear"
                label="Fiscal Year"
                options={fiscalYears}
                required
              />

              <FormCombo
                form={form}
                name="schemeFor"
                label="Scheme For"
                options={schemeForOptions}
                required
              />

              <FormCombo
                form={form}
                name="month"
                label="Month"
                options={nepaliMonths}
                required
              />

              <FormInput
                form={form}
                name="schemeName"
                label="Scheme Name"
                placeholder="Enter Scheme Name"
                required
                type="text"
              />
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                className=" text-white font-semibold py-2 px-4 rounded shadow"
              >
                {initialValues ? "Update Scheme" : "Add Scheme"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
