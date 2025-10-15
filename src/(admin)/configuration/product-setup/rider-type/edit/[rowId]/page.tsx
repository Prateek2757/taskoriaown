"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiderTypeForm } from "../../components/RiderTypeForm";
import { RiderTypeDTO } from "../../RiderTypeSchema";

export default function Page() {
  const [riderTypeData, setRiderTypeData] = useState<RiderTypeDTO>();
  const params = useParams();
  const rowId = params.rowId;

  useEffect(() => {
    if (!rowId) return;

    const fetchData = async () => {
      try {
        const data = {
          rowId,
          endpoint: "ridertype_details",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("Rider Type Details Response:", response);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setRiderTypeData(response.data);
          console.log("Rider Type data fetched:", response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Rider Type data:", error);
      }
    };

    fetchData();
  }, [rowId]);

  return <RiderTypeForm data={riderTypeData} />;
}
