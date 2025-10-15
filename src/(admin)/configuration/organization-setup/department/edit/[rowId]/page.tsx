"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddDepartmentDTO } from "../../departmentSchema";
import DepartmentForm from "../../components/DepartmentForm";

export default function Page() {
  const [departmentData, setDepartmentData] = useState<AddDepartmentDTO>();
  const params = useParams();

  useEffect(() => {
    const departmentRowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: departmentRowId || null,
          endpoint: "department_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is proposal detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setDepartmentData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (departmentRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <DepartmentForm data={departmentData} />;
}
