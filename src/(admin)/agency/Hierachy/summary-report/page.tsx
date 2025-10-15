import { DataTable } from "@/components/uiComponents/data-table/data-table";
import React from "react";
import { createKycColumns } from "./columns";
import { MapPin, Phone } from "lucide-react";

export default function Page() {
  const monthlyCommissions: any[] = [
    {
      type: "Life Insurance",
      premium: 15000,
      commission: 1500,
      tds: 225,
      net: 1275,
    },
    {
      type: "Health Insurance",
      premium: 8000,
      commission: 800,
      tds: 120,
      net: 680,
    },
  ];
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <div className="min-h-screen  py-6">
      <div className="container mx-0">
        <div className="w-full bg-white">
          {/* Top section with title and company info */}
          <div className="flex justify-between items-start px-6 py-4 bg-white">
            {/* Left side - Title */}
            <div className="bg-slate-600 text-white px-4 py-2 rounded">
              <h1 className="text-base font-medium">
                Agent Hierachy Business Summary Report
              </h1>
            </div>

            {/* Right side - Company info */}
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Micro Life Insurance Limited
              </div>
              <div className="flex items-center justify-end gap-1 text-sm text-gray-600 mb-1">
                <MapPin className="w-3 h-3" />
                <span>Biratnagar-7, Morang</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                <Phone className="w-3 h-3" />
                <span>Ph No : 5918017</span>
              </div>
            </div>
          </div>

          {/* Gray separator line */}
          <div className="w-full h-px bg-gray-300"></div>

          {/* Bottom section with report details */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="text-center">
              <h2 className="text-base font-medium text-gray-700 leading-tight">
                Downline Business Summary Report of Nirmala Kumari Chaudhary
                with AgentCode 05001134
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                From Date:2025-04-14 ToDate:2025-08-26
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
            <h2 className="uppercase font-bold text-xl text-blue-700  mb-1">
              Self Business
            </h2>
            <DataTable
              searchOptions={[]}
              columns={createKycColumns}
              endpoint="kyc_list"
              fulltable={false}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
            <h2 className="uppercase font-bold text-xl text-blue-700 mb-4">
              Direct Level Business
            </h2>
            <DataTable
              searchOptions={[]}
              columns={createKycColumns}
              endpoint="kyc_list"
              fulltable={false}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
            <h2 className="uppercase font-bold text-xl text-blue-700 mb-4">
              Indirect Level Business
            </h2>
            <DataTable
              searchOptions={[]}
              columns={createKycColumns}
              endpoint="kyc_list"
              fulltable={false}
            />
          </div>
          <div className="bg-white rounded-lg lg:max-w-1/2 shadow-sm border border-blue-200 p-6">
            <div>
              <div>
                <h2 className="uppercase font-bold text-xl text-blue-700 mb-4">
                  Summary
                </h2>

                {/* Table for larger screens */}
                <div className="hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-600 rounded-lg text-white">
                          <th className="px-4 py-3 text-left text-sm font-medium rounded-lg">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            PolicyCounts
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Sum Assured
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Premium
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyCommissions.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No commission data for this month
                            </td>
                          </tr>
                        ) : (
                          monthlyCommissions.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {item.type}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {formatCurrency(item.premium)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {formatCurrency(item.commission)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {formatCurrency(item.tds)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
