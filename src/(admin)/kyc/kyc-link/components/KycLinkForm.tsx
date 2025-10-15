"use client";

import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { ParamValue } from "next/dist/server/request/params";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AddKycLinkDTO,
  AddKycLinkSchema,
  emptyKycLink,
} from "../KycListSchema";

type KycLinkFormProps = {
  data?: AddKycLinkDTO;
  kycNumber?: ParamValue;
};

export default function KycLinkForm({ data, kycNumber }: KycLinkFormProps) {
  const [policyList, setPolicyList] = useState<SelectOption[]>([]);
  const [agentList, setAgentList] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const form = useForm<AddKycLinkDTO>({
    defaultValues: emptyKycLink,
    resolver: zodResolver(AddKycLinkSchema),
  });

  useEffect(() => {
    if (data?.kycNumber) {
      form.reset(data);
    }
  }, [data, form]);

  useEffect(() => {
    if (!kycNumber) return;
    form.setValue("kycNumber", kycNumber as string);
  }, [kycNumber, form]);

  const getPolicyList = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: "KYCLINKPolicyNo",
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("Policy List Response:", response);

      if (response && response.status === API_CONSTANTS.success) {
        setPolicyList(response.data || []);
      }
    } catch (error) {
      console.error("Error getting policy list", error);
    } finally {
    }
  }, []);

  const getAgentList = useCallback(async (value: string) => {
    try {
      const submitData: PostCallData & {
        flag: string;
        search: string;
      } = {
        flag: "KYCLinkAgentCode",
        search: value,
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("Agent List Response:", response);

      if (response && response.status === API_CONSTANTS.success) {
        setAgentList(response.data || []);
      }
    } catch (error) {
      console.error("Error getting agent list", error);
    } finally {
    }
  }, []);

  const policyNumber = form.watch("policyNumber") ?? "";
  const agentCode = form.watch("agentCode") ?? "";

  const isPolicyDisabled =
    Boolean(agentCode && agentCode.trim() !== "") ||
    Boolean(data?.agentCode && data?.agentCode.trim() !== "");
  const isAgentDisabled =
    Boolean(policyNumber && policyNumber.trim() !== "") ||
    Boolean(data?.policyNumber && data?.policyNumber.trim() !== "");

  useEffect(() => {
    if (!policyNumber) return;
    getPolicyList(policyNumber);
  }, [policyNumber, getPolicyList]);

  useEffect(() => {
    if (!agentCode) return;
    getAgentList(agentCode);
  }, [agentCode, getAgentList]);

  useEffect(() => {
    if (
      policyNumber &&
      policyNumber.trim() !== "" &&
      agentCode &&
      agentCode.trim() !== ""
    ) {
      form.setValue("agentCode", "");
    }
  }, [policyNumber, agentCode, form]);

  const onSubmit: SubmitHandler<AddKycLinkDTO> = async (formData) => {
    try {
      setIsSubmitting(true);
      const submitData: PostCallData = {
        ...formData,
        endpoint: "kyclink_manage",
      };

      console.log("first", submitData);
      const response = await apiPostCall(submitData);

      if (response?.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          `${data ? "Update KYC Link" : "Add KYC link"}`
        );
        router.push("/kyc/kyc-link");
      } else {
        showToast(
          response.data.code,
          response.data.message,
          `${data ? "Update KYC Link" : "Add KYC link"}`
        );
      }
    } catch (error) {
      console.error("Error submitting Kyc Link form:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to save Kyc Link details"}`,
        "Add Kyc List"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Link Policy / Agent </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-0 md:border border-dashed border-gray-400 rounded-lg p-0 md:p-6 md:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <FormInput
                    form={form}
                    name="kycNumber"
                    type="text"
                    label="Kyc No."
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <FormCombo
                    form={form}
                    name="policyNumber"
                    options={policyList}
                    label="Policy No."
                    onSearch={getPolicyList}
                    disabled={isPolicyDisabled}
                  />
                </div>

                <div className="space-y-2">
                  <FormCombo
                    form={form}
                    name="agentCode"
                    options={agentList}
                    label="Agent No."
                    onSearch={getAgentList}
                    disabled={isAgentDisabled}
                  />
                </div>
              </div>
            </div>
            <FormInput form={form} name="rowId" type="hidden" disabled />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
            >
              {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {data ? "Update Kyc Link" : "Create Kyc Link"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
