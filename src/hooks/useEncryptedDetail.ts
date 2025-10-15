// hooks/useEncryptedDetail.ts
"use client";
import { useEffect, useState } from "react";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";

export function useEncryptedDetail<T>(
  encryptedId: string | undefined,
  fieldName: string,
  endpoint: string
): T | undefined {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          [fieldName]: encryptedId || null,
          endpoint :"endorsement_detail",
        };

        const response = await apiPostCall(payload as PostCallData);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching detail data:", error);
      }
    };

    if (encryptedId) fetchData();
  }, [encryptedId, endpoint, fieldName]);

  return data;
}
