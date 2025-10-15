import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { createKycColumns } from "./columns";
import React from "react";

const FPIPendingPolicy = () => {
  const overallStats = {
    totalPremium: 30336.0,
    totalCommission: 3033.6,
    totalTDS: 454.95,
    netCommissionEarned: 2578.65,
  };
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  return (
    <div>
      <div className="pb-4">
        <DataTable
          searchOptions={[]}
          columns={createKycColumns}
          endpoint="kyc_list"
          fulltable={false}
        />
      </div>{" "}
      <div className="bg-white rounded-lg mt-4 shadow-sm border md:max-w-1/2 border-gray-200">
        <div className="p-4 md:p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-6">
            COMMISSION AFTER ISSUED
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm md:text-base">
                Total Premium:
              </span>
              <span className="font-medium text-gray-800">
                {formatCurrency(overallStats.totalPremium)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm md:text-base">
                Total Commission:
              </span>
              <span className="font-medium text-gray-800">
                {formatCurrency(overallStats.totalCommission)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm md:text-base">
                Total TDS:
              </span>
              <span className="font-medium text-gray-800">
                {formatCurrency(overallStats.totalTDS)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 pt-4">
              <span className="text-gray-700 font-medium text-sm md:text-base">
                Net Commission Earned:
              </span>
              <span className="font-semibold text-lg text-blue-600">
                {formatCurrency(overallStats.netCommissionEarned)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPIPendingPolicy;
