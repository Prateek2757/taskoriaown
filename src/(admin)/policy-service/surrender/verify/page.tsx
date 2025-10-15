import { Button } from "@/components/ui/button";
import React from "react";
import RowField from "@/app/(admin)/policy-service/surrender/components/RowField";
import Link from "next/link";
import { BadgeCheck, CircleArrowLeft, FileText } from "lucide-react";
interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  isRightColumn?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  isRightColumn = false,
}) => (
  <div className={`grid grid-cols-3 py-1 ${isRightColumn ? "pl-8" : ""}`}>
    <span className="text-gray-700 text-sm">{label} </span>:
    <span className="text-gray-900 text-sm font-medium"> {value}</span>
  </div>
);
const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Policy Search Button */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <Button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors font-medium">
          Verify Surrender
        </Button>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposal Details */}
          <div className="bg-white rounded-lg shadow-sm border relative overflow-hidden">
            {/* Background Pattern */}

            <div className=" bg-blue-50 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-900">
                PROPOSAL DETAILS
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3 relative z-10">
              <RowField label="Proposal No" value="710001275" />
              <RowField label="Branch" value="710" />
              <RowField label="Full Name" value="Aashish Dhami" />

              <RowField label="DOB" value="1995-05-19" />

              <RowField label="Address" value="-" />
              <RowField label="Phone" value="-" />
              <RowField label="Nominee Name" value="Parvati Kumari Bohara" />
              <RowField label="Proposer Name" value="-" />
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-sm border relative overflow-hidden">
            {/* Background Pattern */}

            <div className=" bg-blue-50 px-4 py-3">
              <h2 className="text-lg font-semibold text-gray-900">
                PRODUCT DETAILS
              </h2>
            </div>

            <div className="px-6 py-4 space-y-3 relative z-10">
              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Product</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  710001275
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Sum Assured</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  710
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Premium</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  Aashish Dhami
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100">
                <span className="text-gray-600 ">Term|Pay Term</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  1995-05-19
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">MOP</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">DOC| Maturity Date</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>

              <div className="flex justify-between items-center  border-b border-gray-100">
                <span className="text-gray-600 ">Instalment</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  Parvati Kumari Bohara
                </span>
              </div>

              <div className="flex justify-between items-center ">
                <span className="text-gray-600 ">Next Due Date</span>
                <span className="text-gray-600 mx-2">:</span>
                <span className="font-medium text-gray-900 flex-1 text-right">
                  -
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg mt-5 shadow-md overflow-hidden">
          <div className="bg-blue-100  px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-800">
              CALCULATION DETAILS
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-2">
                <DetailRow label="Surrender Date" value={"data"} />
                <DetailRow label="Paid Instalment" value={"0"} />
                <DetailRow label="Remaining Period (in Years)" value={"data"} />
                <DetailRow label="SVF" value={"data"} />
                <DetailRow label="PaidUp Sum Assured" value={"data"} />
                <DetailRow label="Adjusted PaidUp SA" value={"data"} />
                <DetailRow label="Surrender Value" value={"data"} />
                <DetailRow label="Tax" value={"data"} />
                <DetailRow label="Anticipation Paid" value={"data"} />
              </div>

              {/* Right Column */}
              <div className="space-y-2">
                <DetailRow
                  label="Anniversary Date"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow
                  label="Total Premium Paid"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow
                  label="Completed Months"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow
                  label="Monthly Adjustment Factor"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow label="Bonus" value={"data"} isRightColumn />
                <DetailRow
                  label="Adjusted Bonus"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow
                  label="Taxable Amount"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow
                  label="Excess / Short"
                  value={"data"}
                  isRightColumn
                />
                <DetailRow label="Net Payable" value={"data"} isRightColumn />
              </div>
            </div>
          </div>
        </div>
        <div className="my-6 gap-2 flex">
          <Link href={`/surrender/memo/${"data?.policyNumberEncrypted"}`}>
            <Button
              type="button"
              className="bg-white hover:bg-blue-200 text-black border-2  border-gray-600 font-bold "
            >
              <FileText />
              Generate Memo
            </Button>
          </Link>
          <Button
              type="button"
              className="bg-white hover:bg-blue-200 text-black border-2  border-gray-600 font-bold "
            >
              <CircleArrowLeft />
              Revert
            </Button>
            <Button
              type="button"
              className="bg-white hover:bg-blue-200 text-black border-2  border-gray-600 font-bold "
            >    <BadgeCheck />

              Verify
            </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
