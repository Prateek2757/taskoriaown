"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProvinceForm from "../../component/ProvinceForm";
import { AddProvinceDTO } from "../../provinceSchema";

export default function ProvincePage() {
  const [provinceData, setProvinceData] = useState<AddProvinceDTO>();
  const params = useParams();
  const provinceRowId = params.rowId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          rowId: provinceRowId,
          endpoint: "province_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is province detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setProvinceData(response.data);
          console.log("testing ", provinceData);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (provinceRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <ProvinceForm data={provinceData} />;
}
