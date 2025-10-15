"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ClaimViewPage() {
  return (
    <div className="bg-white border rounded-lg p-6 space-y-6 mt-4 w-full text-gray-800 font-sans">
      {/* Claim Details */}
      <div className="border border-dashed border-blue-200 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Claim Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <Detail label="Claim No" value="" />
          <Detail label="Requested Branch" value="" />
          <Detail label="Policy No" value="" />
          <Detail label="Claim Type" value="" />
          <Detail label="Anticipated Instalment" value="" />
          <Detail label="PayCheque/Adjustment" value="" />
          <Detail label="Has Loan ?" value="" />
          <Detail label="Has Document" value="" />
          <Detail label="Created By" value="" />
          <Detail label="Created Branch" value="" />
          <Detail label="Verified By" value="" />
          <Detail label="Verified Branch" value="" />
          <Detail label="Approved By" value="" />
          <Detail label="Approved Date" value="" />
          <Detail label="Is Signature Verified ?" value="" />
          <Detail label="Created Date" value="" />
          <Detail label="Verified Date" value="" />
        </div>
      </div>

      {/* Documents */}
      <div className="border border-dashed border-blue-200 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-4">Documents</h3>
        <div className="flex justify-center">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            All Documents
          </Button>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <p>
    <strong>{label}:</strong> {value}
  </p>
);
