"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { AddUserSchema } from "../../schemas/ApplicationUserSchemas"; // Adjust path if needed
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormCombo from "@/components/formElements/FormCombo";
import { useCallback, useEffect, useState } from "react";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";

type AddUserDTO = z.infer<typeof AddUserSchema>;

type UserDetailsFormProps = {
  form: UseFormReturn<AddUserDTO>;
  genderList: { label: string; value: string }[];
};

export default function UserDetails({
  form,
  genderList,
}: UserDetailsFormProps) {
  const [kycNumber, setKycNumber] = useState<SelectOption[]>([]);

  const getKycNumber = useCallback(async () => {
    try {
      const submitData: PostCallData & {
        flag: string;
      } = {
        flag: "KYCNoAutoComplete",
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData);
      console.log("kyc number list", response);

      if (response && response.status === API_CONSTANTS.success) {
        setKycNumber(response.data);
      } else {
        alert(`Failed to get Ward Number List: ${response || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error || "Failed to get Ward Number List"}`);
    } finally {
      console.log("Ward Number List got successfully");
    }
  }, []);

  useEffect(() => {
    getKycNumber();
  }, [getKycNumber]);
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">User Details</h2>

      <div className="border-blue-200 rounded-lg pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* KYC Number */}
          <div className="space-y-2">
            <FormCombo
              form={form}
              name="kycNumber"
              label="KYC Number"
              options={kycNumber}
              required
            />
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <FormInput
              form={form}
              name="firstName"
              label="First Name"
              placeholder="Enter First Name"
              type="text"
              required
              onKeyDown={useOnlyAlphabets()}
            />
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <FormInput
              form={form}
              name="middleName"
              type="text"
              placeholder="Enter Middle Name"
              label="Middle Name"
              onKeyDown={useOnlyAlphabets()}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <FormInput
              form={form}
              name="lastName"
              label="Last Name"
              placeholder="Enter Last Name"
              type="text"
              required
              onKeyDown={useOnlyAlphabets()}
            />
          </div>

          {/* Full Name in Nepali */}
          <div className="space-y-2">
            <FormInputNepali
              form={form}
              name="fullNameLocal"
              label="Full Name (Nepali)"
              placeholder="नाम नेपालीमा"
              type="text"
              required={true}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <FormSelect
              form={form}
              name="gender"
              label="Gender"
              caption="Select Gender"
              options={genderList}
              required={true}
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <FormInput
              form={form}
              name="contactNumber"
              label="Mobile Number"
              placeholder="98XXXXXXXXXX"
              type="text"
              required
              maxLength={10}
              onKeyDown={useOnlyNumbers()}
            />
          </div>
        </div>
      </div>
    </>
  );
}
