"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { type PostCallData, apiPostCall } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AddEditKycDTO } from "../../schemas/endorsementSchema";
import { emptyKyc } from "../../schemas/endorsementSchema";
import EndorsementForm from "../../components/EndorsementForm";

export default function Page() {
  const [endorsementData, setEndorsementData] = useState<AddEditKycDTO>();
  const params = useParams();

  useEffect(() => {
    const endorsementIdEncrypted = params.endorsementIdEncrypted;

    const fetchData = async () => {
      try {
        const data = {
          EndorsementIdEncrypted: endorsementIdEncrypted || null,
          endpoint: "endorsement_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is endorsement form response", response);
        console.log("This is fetch data for Endorsement");

        if (response?.data && response.status === API_CONSTANTS.success) {
          // Optional: sanitize null values
          const sanitizedData = { ...emptyKyc, ...response.data };
          console.log("Sanitized endorsement data", sanitizedData);

          setEndorsementData(sanitizedData as AddEditKycDTO);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Endorsement Detail data:", error);
      } finally {
      }
    };

    if (endorsementIdEncrypted) {
      fetchData();
    }
  }, [params.endorsementIdEncrypted]);

  return <EndorsementForm data={endorsementData} />;
}
