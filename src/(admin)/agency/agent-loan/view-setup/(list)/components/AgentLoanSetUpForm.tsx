"use client";

import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import FormSelect from "@/components/formElements/FormSelect";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall } from "@/helper/apiService";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { useEffect, useState, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

type SelectOption = {
  label: string;
  value: string | number;
};

type AddTrainingFormD = {
  fiscalYear: string;
  loanName: string;
  schemeName: string;
  schemeEffectiveFrom: string;
  schemeEffectiveTO: string;
  loanTimePeriod: number;
  loanType: string;
  interestRate: number;
  equivalent?: File;
  equivalentName?: string;
};

type Props = {
  form: UseFormReturn<AddTrainingFormD>;
  isLoggedIn: boolean;
  isEditMode?: boolean;
  data?: {
    photoFileUrl?: string;
    photoFileName?: string;
    equivalent?: string;
    equivalentName?: string;
  };
};

export default function AgentLoanSetUpForm({
  form,
  isLoggedIn,
  isEditMode = false,
  data,
}: Props) {
  const onlyNumbers = useOnlyNumbers();
  const [wardNoList, setWardNoList] = useState<SelectOption[]>([]);
  const [trainerList, setTrainerList] = useState<SelectOption[]>([]);

  const getWardNo = useCallback(async () => {
    try {
      const res = await apiPostCall(
        { flag: "WardNoAutoComplete", endpoint: "get_utility_dropdown" },
        isLoggedIn
      );
      if (res.status === API_CONSTANTS.success) setWardNoList(res.data);
    } catch (err) {
      console.error("Error loading ward numbers", err);
    }
  }, [isLoggedIn]);

  const getTrainerList = useCallback(async () => {
    try {
      const res = await apiPostCall(
        { flag: "TrainerAutoComplete", endpoint: "get_utility_dropdown" },
        isLoggedIn
      );
      if (res.status === API_CONSTANTS.success) setTrainerList(res.data);
    } catch (err) {
      console.error("Error loading trainer list", err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    getWardNo();
    getTrainerList();
  }, [getWardNo, getTrainerList]);

  return (
    <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Agent Loan Set Up</h2>

      <div className="border border-dashed border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormCombo
            form={form}
            name="fiscalYear"
            label="Fiscal Year"
            options={trainerList}
            required
          />

          <FormInput
            form={form}
            name="loanName"
            label="Loan Name"
            placeholder="Enter Loan Name"
            required
            type="text"
          />

          <FormInput
            form={form}
            name="schemeName"
            label="Scheme Name"
            placeholder="Enter Scheme Name"
            type="text"
            required
          />

          <DateConverter
            form={form}
            name="schemeEffectiveFrom"
            labelEng="Scheme Effective From"
            labelNep="Scheme Effective From"
          />

          <DateConverter
            form={form}
            name="schemeEffectiveTO"
            labelEng="Scheme Effective To"
            labelNep="Scheme Effective To"
          />

          <FormInput
            form={form}
            name="loanTimePeriod"
            label="Loan Time Period (In Months)"
            placeholder="Enter Loan Time Period"
            type="number"
            required
          />

          <FormSelect
            form={form}
            name="loanType"
            label="Loan Type"
            options={wardNoList}
            required
          />

          <FormInput
            form={form}
            name="interestRate"
            label="Interest Rate"
            placeholder="Enter Interest Rate"
            required
            type="number"
            onKeyDown={onlyNumbers}
          />
        </div>
         <div className="w-1/3">
           <FormInputFile
            form={form}
            name="equivalent"
            label="Equivalent"
            fileNameField="equivalentName"
            accept=".png,.jpg,.jpeg,.pdf"
            maxSize={5}
            validTypes={["image/png", "image/jpeg", "application/pdf"]}
            required
            {...(data?.equivalent && {
              editMode: true,
              initialImageUrl: data.equivalent,
              initialFileName: data.equivalentName,
            })}
          />
         </div>
      </div>
    </div>
  );
}
