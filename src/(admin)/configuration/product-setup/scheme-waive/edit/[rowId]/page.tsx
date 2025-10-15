"use client";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SchemeWaiveForm } from "../../components/SchemeWaiveForm";
import { SchemeWaiveDTO } from "../../SchemeWaiveSchema";

export default function Page() {
  const [schemeWaiveData, setSchemeWaiveData] = useState<SchemeWaiveDTO>();

  const params = useParams();
  useEffect(() => {
    const rowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: rowId,
          endpoint: "schemewaive_details",
        };
        const response = await apiPostCall(data as PostCallData);
        const testdata = response.data;
        console.log("Fetched Scheme Waive Detail data:", testdata);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setSchemeWaiveData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Scheme Waive Detail data:", error);
      } finally {
      }
    };
    if (rowId) {
      fetchData();
    }
  }, [params.rowId]);
  return <SchemeWaiveForm data={schemeWaiveData} />;
}
