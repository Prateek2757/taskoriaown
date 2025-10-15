"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { AddEditTrainerDTO } from "../../schemas/trainerSchema";
import TrainerForm from "../../components/TrainerForm";

export default function Page() {
  const [trainerData, setTrainerData] = useState<AddEditTrainerDTO>();

  const params = useParams();
  useEffect(() => {
    const trainerId = params.trainerId;
    const fetchData = async () => {
      try {
        const data = {
          trainerIdEncrypted: trainerId || null,
          endpoint: "kyc_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setTrainerData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (trainerId) {
      fetchData();
    }
  }, [params.trainerId]);
  return <TrainerForm data={trainerData} />;
}
