"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MarketingStaffForm from "../components/MarketingStaffForm";
import { AddMarketingStaffDTO } from "../marketingStaffSchema";

export default function Page() {
  const [marketingstaffData, setMaraketingstaffData] =
    useState<AddMarketingStaffDTO>();
  const params = useParams();

  useEffect(() => {
    const marketingStaffRowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: marketingStaffRowId || null,
          endpoint: "marketingstaff_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is proposal detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setMaraketingstaffData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Marketing staff Detail data:", error);
      } finally {
      }
    };
    if (marketingStaffRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <MarketingStaffForm data={marketingstaffData} />;
}
