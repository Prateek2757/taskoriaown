"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import KycForm from "../../../endorsement/components/EndorsementForm";
import type { AddEditKycDTO } from "../../../kyc-endorsement/schemas/endorsementSchema";
import EndorsementForm from "../../../kyc-endorsement/components/EndorsementForm";
// import { log } from "console";

export default function Page() {
  const [kycData, setKycData] = useState<
    AddEditKycDTO & {
      EndorsementId?: string | null;
      EncryptedID?: string | null;
      EndorsementIdEncrypted?: string | null;
      kycNumber: string;
    }
  >();

  const params = useParams();

  useEffect(() => {
    const kycNumber = params.kycNumber;

    const fetchData = async () => {
      try {
        const data = {
          KYCNumberEncrypted: kycNumber || null,
          endpoint: "kyc_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("API response------------:", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setKycData({
            ...response.data,
            EndorsementId: response.data?.EndorsementId ?? null,
            EncryptedID: response.data?.EncryptedID ?? null,
            EndorsementIdEncrypted:
              response.data?.EndorsementIdEncrypted ?? null,
            KYCNumberEncrypted: kycNumber,
          });
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      }
    };

    if (kycNumber) {
      fetchData();
    }
  }, [params.kycNumber]);

  // console.log("Kiran:",kycNumber);

  return <EndorsementForm data={kycData} />;
}
