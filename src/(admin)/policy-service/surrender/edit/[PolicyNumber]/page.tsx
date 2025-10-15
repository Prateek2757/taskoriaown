"use client";

import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SurrenderForm from "../../components/SurrenderForm";

const page = () => {
  const params = useParams();
  const proposalNumber = params.PolicyNumber;
  const [proposalData, setProposalData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          policyNumberEncrypted: proposalNumber || null,
          endpoint: "surrender_details_edit",
        };
        const response = await apiPostCall(data as PostCallData);
        console.log("this is proposal detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setProposalData(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      } finally {
      }
    };
    if (proposalNumber) {
      fetchData();
    }
  }, []);
  return (
    <div>
      <SurrenderForm proposalData={proposalData} />
    </div>
  );
};

export default page;
