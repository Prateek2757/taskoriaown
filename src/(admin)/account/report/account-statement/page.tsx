"use client";
import React, { useState } from "react";
import { Calendar, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormSelect from "@/components/formElements/FormSelect";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  AccountStatementSchema,
  AccountStatementSchemaDTO,
  emptyAccountStatement,
} from "../../Schema/AccountStatementSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInputDate from "@/components/formElements/FormInputDate";
import { FormSwitch } from "@/components/formElements/FormSwitch";

export default function page() {
  const form = useForm<AccountStatementSchemaDTO>({
    resolver: zodResolver(AccountStatementSchema),
    mode: "onChange",
    defaultValues: emptyAccountStatement,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 ">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <Button className="flex cursor-pointer items-center px-3 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button className="flex items-center rounded-md px-3 py-2 text-sm border border-gray-300  bg-blue-600 hover:bg-blue-700 text-white focus:outline-green-500">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
      <Form {...form}>
        <form action="">
          {/* Account Statement Header */}
          <div className="py-4">
            <div className="bg-slate-600 text-white px-4 py-2 rounded-t">
              <h2 className="font-medium">Account Statement</h2>
            </div>

            {/* Filter Section */}
            <div className="bg-white border border-gray-200 p-6 rounded-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Row */}
                <div className="space-y-2">
                  <FormSelect
                    name="branch"
                    options={[]}
                    label="Voucher Type"
                    caption="Select Voucher Type"
                    form={form}
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormInputDate
                    name="branch"
                    label="From Date"
                    form={form}
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormInputDate
                    name="voucherType"
                    label="To Date"
                    form={form}
                    required={true}
                  />
                </div>

                {/* Second Row */}
                <div className="space-y-2">
                  <FormSelect
                    name="branch"
                    options={[]}
                    label="LG Code"
                    caption="Select LG Code"
                    form={form}
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormSelect
                    name="branch"
                    options={[]}
                    label="Ledger"
                    caption="Select Ledger"
                    form={form}
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <FormSelect
                    name="branch"
                    options={[]}
                    label="Sub Ledger"
                    caption="Select Sub Ledger"
                    form={form}
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormSelect
                    name="branch"
                    options={[]}
                    label="Branch"
                    caption="Select Branch"
                    form={form}
                    required={true}
                  />
                </div>
                <div className="space-y-2">
                  <FormSwitch
                    name="branch"
                    label="Branch"
                    form={form}
                    required={true}
                  />
                </div>

                {/* Search Button */}
              </div>
            </div>
            <div className="mt-2 mb-5">
              <Button className="px-6 py-2 bg-slate-600 text-white rounded hover:bg-slate-700">
                Search
              </Button>
            </div>
          </div>

          {/* Report Section */}
          <div className=" pb-6">
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              {/* Report Header */}
              <div className="text-center py-4 border-b">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Account Statement Report
                  </h3>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>From: 2025-08-26</span>
                  </div>
                  <span>→</span>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>To: 2025-08-26</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Ledger Name:</span> FIRST
                  PREMIUM-MICRO TERM INSURANCE PLAN
                </div>
                <div className="mt-1 text-sm text-gray-600 flex items-center justify-center space-x-4">
                  <span>
                    <span className="font-medium">Opening Balance:</span>{" "}
                    267,387.00 (CR)
                  </span>
                  <span>→</span>
                  <span>
                    <span className="font-medium">Closing Balance:</span>{" "}
                    268,363.00 (CR)
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Tran Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Branch
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Ledger Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Sub Ledger Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Narration
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Voucher No
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Chq No.
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        Dr Amount.
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        Cr Amount.
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        Balance
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* Balance Brought Forward Row */}
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm">0</td>
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Balance Brought Forward
                      </td>
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm text-right">0.00</td>
                      <td className="px-4 py-3 text-sm text-right">
                        267,387.00
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        267,387.00
                      </td>
                      <td className="px-4 py-3 text-sm">CR</td>
                    </tr>

                    {/* Transaction Row */}
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm">2025-08-26</td>
                      <td className="px-4 py-3 text-sm">110 | Nuwakot</td>
                      <td className="px-4 py-3 text-sm">
                        100001 | FIRST PREMIUM-MICRO TERM INSURANCE PLAN
                      </td>
                      <td className="px-4 py-3 text-sm">
                        110823000011 | Sarala Pradhan Shrestha
                      </td>
                      <td className="px-4 py-3 text-sm">
                        Sarala Pradhan Shrestha
                      </td>
                      <td className="px-4 py-3 text-sm">FP110823000011</td>
                      <td className="px-4 py-3 text-sm"></td>
                      <td className="px-4 py-3 text-sm text-right">0.00</td>
                      <td className="px-4 py-3 text-sm text-right">976.00</td>
                      <td className="px-4 py-3 text-sm text-right">
                        268,363.00
                      </td>
                      <td className="px-4 py-3 text-sm">CR</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Summary */}
              <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="flex justify-end space-x-8 text-sm">
                  <div className="text-right">
                    <div className="mb-1">
                      <span className="font-medium">Opening Balance</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Total DR(₹)</span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">Total CR(₹)</span>
                    </div>
                    <div className="font-medium border-t pt-1">
                      <span className="font-medium">Closing Balance</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-1">267,387.00</div>
                    <div className="mb-1">0.00</div>
                    <div className="mb-1">268,363.00</div>
                    <div className="font-medium border-t pt-1">268,363.00</div>
                  </div>
                  <div className="text-left">
                    <div className="mb-1">CR</div>
                    <div className="mb-1"></div>
                    <div className="mb-1"></div>
                    <div className="font-medium border-t pt-1">CR</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
