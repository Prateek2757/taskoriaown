"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DoctorForm from "../../components/DoctorForm";
import { AddDoctorDTO } from "../../doctorSchema";

export default function Page() {
  const [doctorData, setDoctorData] = useState<AddDoctorDTO>();
  const params = useParams();

  useEffect(() => {
    const doctorRowId = params.rowId;
    const fetchData = async () => {
      try {
        const data = {
          rowId: doctorRowId || null,
          endpoint: "doctor_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is proposal detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setDoctorData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching doctor Detail data:", error);
      } finally {
      }
    };
    if (doctorRowId) {
      fetchData();
    }
  }, [params.rowId]);

  return <DoctorForm data={doctorData} />;
}
