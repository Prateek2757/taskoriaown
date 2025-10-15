"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import AgentLoanSetUpForm from "../(list)/components/AgentLoanSetUpForm";
import { AddTrainingFormDTO } from "../../agency/registration/training-schedule-list/schemas/TraniningVenuScheduleSchemas";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [trainerData, setTrainerData] = useState<AddTrainingFormDTO>();

  const form = useForm<AddTrainingFormDTO>();
  const params = useParams();

  useEffect(() => {
    const proposalNumber = params.proposalNumber;
    const fetchData = async () => {
      try {
        const data = {
          ProposalNumberEncrypted: proposalNumber || null,
          endpoint: "proposal_detail",
        };

        const response = await apiPostCall(data as PostCallData);
        console.log("this is proposal detail response", response.data);
        if (response?.data && response.status === API_CONSTANTS.success) {
          setTrainerData(response.data);
          form.reset(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching Kyc Detail data:", error);
      }
    };

    if (proposalNumber) {
      fetchData();
    }
  }, [params.proposalNumber]);

  const handleSubmit = (data: AddTrainingFormDTO) => {
    console.log("Submitted form data:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <AgentLoanSetUpForm
          form={form}
          isLoggedIn={true}
          isEditMode={!!trainerData}
          data={trainerData}
        />
        <Button type="submit" className="btn btn-primary mt-4">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
