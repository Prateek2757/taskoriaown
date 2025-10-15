"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import KycLinkForm from "../components/KycLinkForm";
import { AddKycLinkDTO } from "../KycListSchema";

function KycEditContent() {
  const searchparams = useSearchParams();
  const rowId = searchparams.get("rowId") as string;
  const kycNumber = searchparams.get("kycNumber") as string;
  const [kycLinkData, setKycLinkData] = useState<AddKycLinkDTO>();

  useEffect(() => {
    if (!kycNumber) return;
    const fetchData = async () => {
      try {
        const data: PostCallData & {
          rowId: string;
          kycNumber: string;
        } = {
          rowId: rowId,
          kycNumber: kycNumber,
          endpoint: "kyclink_detail_id",
        };
        const response = await apiPostCall(data);
        console.log("kyc link detail", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setKycLinkData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching kyc link Detail data:", error);
      }
    };
    fetchData();
  }, [kycNumber, rowId]);

  return <KycLinkForm data={kycLinkData} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <KycEditContent />
    </Suspense>
  );
}
