"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiderCriteriaForm } from "../../components/RiderCriteriaForm";
import { RiderCriteriaDTO } from "../../RiderCriteriaSchema";

export default function Page() {
  const [riderCriteriaData, setRiderCriteriaData] =
    useState<RiderCriteriaDTO>();
  const params = useParams();
  const rowId = params.rowId;

  useEffect(() => {
    if (!rowId) return;

    const fetchData = async () => {
      try {
        const data = {
          rowId,
          endpoint: "ridercriteria_details",
        };
        const response = await apiPostCall(data as PostCallData);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setRiderCriteriaData(response.data);
          console.log("Rider Criteria data fetched:", response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Rider Criteria data:", error);
      }
    };

    fetchData();
  }, []);

  return <RiderCriteriaForm data={riderCriteriaData} />;
}
