"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import AgentTrainingForm from "../../components/AgentTrainingForm";
import { AddEditAgentTrainingDTO } from "../../schemas/agentTrainingSchema";

export default function Page() {
  const [agentData, setAgentData] = useState<AddEditAgentTrainingDTO>();

  const params = useParams();
  useEffect(() => {
    const agentId = params.agentId;
    const fetchData = async () => {
      try {
        const data = {
          AgentIdEncrypted: agentId || null,
          endpoint: "kyc_detail",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is form response", response);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setAgentData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (agentId) {
      fetchData();
    }
  }, [params.kycNumber]);
  return <AgentTrainingForm data={agentData} />;
}
