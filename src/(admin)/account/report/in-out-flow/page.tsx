import React from 'react';
import Image from 'next/image';
import { Button } from 'react-day-picker';
import Link from 'next/link';
import { FileText, FileUp, Plus, Printer } from 'lucide-react';

export default function IMELifeReport() {
  return (
    <div>
        <div className="relative md:fixed md:top-3 md:right-3 md:z-50 flex flex-wrap gap-2 mt-3 md:mt-0">
				
                <Button asChild>
					<Link
						href="/kyc/add"
						className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<FileText color="#fff" size={18} />
						<span>PDF</span>
					</Link>
				</Button>
                <Button asChild>
					<Link
						href="/kyc/add"
						className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<FileUp color="#fff" size={18} />
						<span>Export</span>
					</Link>
				</Button>
                <Button asChild>
					<Link
						href="/kyc/add"
						className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
					>
						<Printer color="#fff" size={18} />
						<span>Print</span>
					</Link>
				</Button>
			</div>
    
    <div className="bg-white p-6 font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        {/* Logo Section */}
        <div>
            <Image src={"/images/logo.png"} alt="IME Life Logo" width={100} height={100}/>
        </div>

        {/* Company Info */}
        <div className="text-right text-gray-700">
          <h2 className="font-bold text-lg mb-2">Sun Nepal Life Insurance Company Limited</h2>
          <div className="text-sm space-y-1">
            <div className="flex items-center justify-end">
              <span className="mr-2">📍</span>
              <span>4th Floor, Simkhada PlazaNew Plaza, Road, Kathmandu 44600</span>
            </div>
            <div className="flex items-center justify-end">
              <span className="mr-2">📞</span>
              <span>Ph No. 014024071, Fax No. 4024075, PO No. 740</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          <span className="font-medium">From Date:</span> {new Date().toISOString().split('T')[0]}
        </div>
        
        <div className="flex items-center space-x-3">
          
          <h3 className="text-gray-600 font-medium text-lg">In-Flow Out-Flow Report</h3>
        </div>
        
        <div className="text-gray-600">
          <span className="font-medium">To Date:</span> {new Date().toISOString().split('T')[0]}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-300">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-400">
              <th className="border border-gray-300 px-4 py-3 text-left font-bold text-black" rowSpan={2}>
                Branch Name
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" colSpan={3}>
                In Flow
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black">
                Out Flow
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" rowSpan={2}>
                Total In-Flow Amount
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" rowSpan={2}>
                Total Out-Flow Amount
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" rowSpan={2}>
                Diff Amount
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" rowSpan={2}>
                InFlow Percent(%)
              </th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold text-black" rowSpan={2}>
                OutFlow Percent(%)
              </th>
            </tr>
            <tr className="bg-blue-400">
              <th className="border border-gray-300 px-4 py-2 text-center font-bold text-black">
                Cash
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center font-bold text-black">
                Cheque
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center font-bold text-black">
                Bank
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center font-bold text-black">
                Bank
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-gray-300 px-4 py-3 font-medium text-black">
                Total
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                00.00
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                12
              </td>
              <td className="border border-gray-300 px-4 py-3 text-center text-black">
                12
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}