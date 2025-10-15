import { Button } from '@/components/ui/button';
import { DockIcon } from 'lucide-react';
import React from 'react';

const CommissionDashboard = () => {
  // Sample data - replace with your actual data
  const overallStats = {
    totalPremium: 30336.00,
    totalCommission: 3033.60,
    totalTDS: 454.95,
    netCommissionEarned: 2578.65
  };

  const monthlyCommissions: any[] = [
    // Add your monthly commission data here
    // { type: 'Life Insurance', premium: 15000, commission: 1500, tds: 225, net: 1275 },
    // { type: 'Health Insurance', premium: 8000, commission: 800, tds: 120, net: 680 },
  ];

  const formatCurrency = (amount: number  ) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="w-full max-w-full mx-auto  space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg md:text-xl font-medium text-gray-800">
            COMMISSION EARNED BY AGENT NIRMALA KUMARI CHAUDHARY WITH AGENTCODE 05001134
          </h1>
          <div className="justify-end flex w-full">
                  <Button className="bg-blue-500 ">
                    {" "}
                    <DockIcon /> Excell(.xls){" "}
                  </Button>{" "}
                </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Commission Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-6">OVER ALL COMMISSION</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">Total Premium:</span>
                <span className="font-medium text-gray-800">{formatCurrency(overallStats.totalPremium)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">Total Commission:</span>
                <span className="font-medium text-gray-800">{formatCurrency(overallStats.totalCommission)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm md:text-base">Total TDS:</span>
                <span className="font-medium text-gray-800">{formatCurrency(overallStats.totalTDS)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 pt-4">
                <span className="text-gray-700 font-medium text-sm md:text-base">Net Commission Earned:</span>
                <span className="font-semibold text-lg text-blue-600">{formatCurrency(overallStats.netCommissionEarned)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Commission Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-6">COMMISSION EARNED THIS MONTH</h2>
            
            {/* Table for larger screens */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-600 text-white">
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Premium</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Commission</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">TDS</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyCommissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No commission data for this month
                        </td>
                      </tr>
                    ) : (
                      monthlyCommissions.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">{item.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(item.premium)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(item.commission)}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(item.tds)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{formatCurrency(item.net)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card layout for mobile screens */}
            <div className="md:hidden space-y-4">
              {monthlyCommissions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No commission data for this month
                </div>
              ) : (
                monthlyCommissions.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="font-medium text-gray-800 mb-3">{item.type}</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-medium">{formatCurrency(item.premium)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission:</span>
                        <span className="font-medium">{formatCurrency(item.commission)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TDS:</span>
                        <span className="font-medium">{formatCurrency(item.tds)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net:</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(item.net)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards for Mobile */}
      <div className="grid grid-cols-2 md:hidden gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(overallStats.totalPremium)}</div>
          <div className="text-sm text-gray-600 mt-1">Total Premium</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{formatCurrency(overallStats.netCommissionEarned)}</div>
          <div className="text-sm text-gray-600 mt-1">Net Earned</div>
        </div>
      </div>
    </div>
  );
};

export default CommissionDashboard;