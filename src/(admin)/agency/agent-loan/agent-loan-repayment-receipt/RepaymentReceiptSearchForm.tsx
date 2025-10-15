"use client";

import { useForm, FormProvider } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo"; // 👈 Import here
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ReceiptSearchFormFields = {
  receiptNo: string;
};

export default function RepaymentReceiptSearchForm() {
  const form = useForm<ReceiptSearchFormFields>({
    defaultValues: {
      receiptNo: "",
    },
  });

  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    const receiptNo = form.getValues("receiptNo");

    if (receiptNo && receiptNo.length >= 3) {
      if (receiptNo === "RCPT123456") {
        setSearchResult({
          receiptNo: "RCPT123456",
          agent: "Bhesh Raj Karki",
          amount: "10,000",
          date: "2024-08-01",
        });
      } else {
        alert("Receipt not found. Try RCPT123456.");
      }
    } else {
      alert("Please enter 3 or more characters.");
    }
  };

  return (
    <FormProvider {...form}>
      <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
        <h2 className="text-xl font-semibold mb-4 text-black p-2 rounded">
          Repayment Receipt Search
        </h2>

        <div className="border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 text-gray-700">
            <FormCombo
              form={form}
              name="receiptNo"
              label="Receipt No"
              caption="Please Enter Name | Agent Code | Receipt No..."
              required
              options={[
                {
                  text: "RCPT123456 | Bhesh Raj Karki | 10,000 | 2024-08-01",
                  value: "RCPT123456",
                },
                {
                  text: "RCPT123457 | Aayush Sharma | 5,000 | 2024-08-03",
                  value: "RCPT123457",
                },
              ]}
            />
          </div>
        </div>


        {searchResult && (
          <div className="mt-6 border border-blue-300 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Receipt Found</h3>
            <p>
              <strong>Receipt No:</strong> {searchResult.receiptNo}
            </p>
            <p>
              <strong>Agent:</strong> {searchResult.agent}
            </p>
            <p>
              <strong>Amount:</strong> {searchResult.amount}
            </p>
            <p>
              <strong>Date:</strong> {searchResult.date}
            </p>
          </div>
        )}
      </div>
        <Button type="button" className = "mt-4" onClick={handleSearch}>
          Search
        </Button>
    </FormProvider>
  );
}
