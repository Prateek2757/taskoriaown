"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import AgentPositionForm from "../../components/AgentPositionForm";
import type { AgentPositionDTO } from "../../schemas/agentPositionSchema";

export default function Page() {
  const [agentPositionData, setAgentPositionData] =
    useState<AddEditAgentPositionDTO>();
  const params = useParams();

  useEffect(() => {
    const agentPositionId = params.agentPositionId as string;

    const fetchData = async () => {
      try {
        const data = {
          AgentPositionIdEncrypted: agentPositionId || null,
          endpoint: "agent_position_detail",
        };
        const response = await apiPostCall(data as PostCallData);

        if (response?.data && response.status === API_CONSTANTS.success) {
          setAgentPositionData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Agent Position Detail data:", error);
      }
    };

    if (agentPositionId) {
      fetchData();
    }
  }, [params.agentPositionId]);

  return <AgentPositionForm data={agentPositionData} />;
}
