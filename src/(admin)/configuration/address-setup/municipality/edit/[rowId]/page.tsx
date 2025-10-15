"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import MunicipalityForm from "../../components/MunicipalityForm";
import { AddMunicipalityDTO } from "../../MunicipalitySchema";

export default function Page() {
  const [municipalityData, setMunicipalityData] =
    useState<AddMunicipalityDTO>();
  const params = useParams();

  useEffect(() => {
    const rowId = params.rowId;
    if (!rowId) return;

    const fetchData = async () => {
      try {
        const data: PostCallData & { rowId: string | string[] } = {
          rowId,
          endpoint: "municipality_details",
        };
        const response = await apiPostCall(data);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setMunicipalityData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Municipality Detail data:", error);
      }
    };

    fetchData();
  }, [params.rowId]);

  return <MunicipalityForm data={municipalityData} />;
}
