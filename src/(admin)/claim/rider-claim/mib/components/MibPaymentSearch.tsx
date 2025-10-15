"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

import {
  mibPaymentSchema,
  MibPaymentDTO,
  emptyMibPayment,
} from "../schemas/mibpaymentSchema";

import MibTable from "./MibTable"; // Your table component

export default function MibPayment() {
  const [tableData, setTableData] = useState<MibPaymentDTO[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const form = useForm<MibPaymentDTO>({
    resolver: zodResolver(mibPaymentSchema),
    defaultValues: emptyMibPayment,
  });

  const onSubmit = (data: MibPaymentDTO) => {
    console.log("🔍 Search Data:", data);

    // Save selected date for table header
    setSelectedDate(data.eligibleDate || "");

    // Replace with real API call; using mock data here
    const mockResult: MibPaymentDTO[] = [
      {
        ...data,
        mibId: "MIB123",
        policyNo: "POL456",
        fullName: "John Doe",
        instalment: "Monthly",
        mibAmount: 5000,
        principalAmount: 4500,
        accrualInterest: 200,
        currentInterest: 150,
        lessPremium: 100,
        tax: 50,
        netPayable: 4700,
        bankName: "Nepal Bank",
        accountName: "John Doe",
        accountNo: "1234567890",
        bankStatus: "Cleared",
      },
    ];

    setTableData(mockResult);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white border rounded-lg p-6 space-y-6 mt-4"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            MIB Payment Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DateConverter
              form={form}
              name="eligibleDate"
              labelNep="Eligible Date (BS)"
              labelEng="Eligible Date (AD)"
            />
          </div>

          {form.formState.errors.eligibleDate && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.eligibleDate.message}
            </p>
          )}

          <div className="flex justify-start">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
            >
              Search
            </Button>
          </div>
        </form>
      </Form>

      {/* Render table only after search */}
      {tableData.length > 0 && <MibTable data={tableData} />}
    </div>
  );
}
