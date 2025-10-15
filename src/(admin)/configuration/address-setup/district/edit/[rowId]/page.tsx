"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DistrictForm from "../../components/DistrictForm";
import { AddDistrictDTO } from "../../DistrictSchema";

export default function DistrictPage() {
  const [districtData, setDistrictData] = useState<AddDistrictDTO>();
  const params = useParams();

  useEffect(() => {
    const districtRowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: districtRowId || null,
          endpoint: "district_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is district detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setDistrictData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching District Detail data:", error);
      } finally {
      }
    };
    if (districtRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <DistrictForm data={districtData} />;
}
