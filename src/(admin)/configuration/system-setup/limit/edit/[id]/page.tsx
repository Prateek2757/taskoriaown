"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import type { AddEditLimitDTO } from "../../schemas/limitSchemas";
import LimitForm from "../../components/LimitForm";

export default function Page() {
  const [limitData, setLimitData] = useState<AddEditLimitDTO>();

  const params = useParams();
  useEffect(() => {
    const id = params.id;
    const fetchData = async () => {
      try {
        const data = {
          KYCNumberEncrypted: id || null,
          endpoint: "kyc_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setLimitData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (id) {
      fetchData();
    }
  }, [params.id]);
  return <LimitForm data={limitData} />;
}
