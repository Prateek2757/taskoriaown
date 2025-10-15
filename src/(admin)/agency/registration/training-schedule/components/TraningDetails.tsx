"use client";

import { useEffect, useState, useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormCombo from "@/components/formElements/FormCombo";
import FormCheckbox from "@/components/formElements/FormCheckbox";
import { useOnlyNumbers } from "@/hooks/useInputValidation";
import { apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormSelect from "@/components/formElements/FormSelect";
import AddressSelect from "@/components/uiComponents/address-select/address-select";
import FormInputFile from "@/components/formElements/FormInputFile";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import FormTextarea from "@/components/formElements/FormTextarea";
import { AddTrainingFormDTO } from "../schemas/TraniningVenuScheduleSchemas";
import FormTimePicker from "@/components/formElements/FormTimePicker";

type Props = {
  form: UseFormReturn<AddTrainingFormDTO>;
  isLoggedIn: boolean;
  isEditMode?: boolean;
  data?: {
    photoFileUrl?: string;
    photoFileName?: string;
  };
};

export default function TrainingDetails({
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
    <>
      <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Training Details
        </h2>

        <div className="border border-dashed border-blue-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-2 mb-6">
            <FormInput
              form={form}
              name="trainingBranch"
              label="Training Branch"
              placeholder="Enter Training Branch"
              required
              type="text"
            />

            <FormCombo
              form={form}
              name="trainer"
              label="Trainer"
              options={trainerList}
              required
            />

            <DateConverter
              form={form}
              name="startDate"
              labelEng="Start Date"
              labelNep="Start Date"
            />

            <DateConverter
              form={form}
              name="endDate"
              labelEng="End Date"
              labelNep="End Date"
            />

            <FormTimePicker
              form={form}
              name="startTime"
              label="Start Time"
              placeholder="10:00 AM"
              required
            />

            <FormTimePicker
              form={form}
              name="endTime"
              label="End Time"
              placeholder="04:00 PM"
              required
            />

            <FormInput
              form={form}
              name="venueName"
              label="Venue Name"
              placeholder="Enter Venue"
              required
              type="text"
            />

            <FormInput
              form={form}
              name="street"
              label="Street"
              placeholder="Enter Street"
              type="text"
            />

            <AddressSelect
              form={form}
              pName="province"
              dName="district"
              mName="municipality"
            />

            <FormSelect
              form={form}
              name="wardNo"
              label="Ward No"
              options={wardNoList}
              required
            />

            <FormInput
              form={form}
              name="totalParticipants"
              label="Total Participants"
              type="number"
              required
              onKeyDown={onlyNumbers}
            />

            <FormTextarea
              form={form}
              name="remarks"
              label="Remarks"
              placeholder="Remarks"
            />

            <FormSwitch form={form} name="isActive" label="Is Active" />
          </div>
        </div>
      </div>
    </>
  );
}
