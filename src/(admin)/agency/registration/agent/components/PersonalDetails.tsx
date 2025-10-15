import { useCallback, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import FormInput from "@/components/formElements/FormInput";
import FormCombo from "@/components/formElements/FormCombo";
import FormSelect from "@/components/formElements/FormSelect";
import FormInputNepali from "@/components/formElements/FormInputNepali";

type PersonalDetailsProps = {
  kycRequiredFields?: KycRequiredFields;
  form: UseFormReturn<AddEditKycDTO>;
};

export default function PersonalDetails({
  kycRequiredFields,
  form,
}: PersonalDetailsProps) {
  const kycNumberData = form.getValues("kycNumber");
  const dateOfBirth = form.watch("dateOfBirth");
  const getAge = useCallback(
    async (value: string) => {
      try {
        const submitData: PostCallData & {
          flag: string;
          search: string;
        } = {
          flag: "CalculateAge",
          search: value,
          endpoint: "get_utility_result",
        };

        const response = await apiPostCall(submitData);

        if (response && response.status === API_CONSTANTS.success) {
          form.setValue("age", response.data.data.toString());
        } else {
          alert(
            `Failed to convert Date: ${
              response?.data.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error getting age", error);
        alert(`Error: ${error || "Failed to convert Date"}`);
      } finally {
      }
    },
    [form]
  );

  useEffect(() => {
    if (!dateOfBirth) {
      return;
    }
    getAge(dateOfBirth);
  }, [dateOfBirth, getAge]);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Details</h2>

      <div className="border-0 md:border border-dashed border-blue-200 rounded-lg  p-0 md:p-6 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* {kycNumberData && (
            <div className="space-y-2">
              <FormInput
                form={form}
                name="kycNumber"
                type="text"
                placeholder="KYC Number"
                label="KYC Number"
                disabled
              />
            </div>
          )} */}
          {/* <div className="space-y-2">
            <FormCombo
              name="branchCode"
              options={kycRequiredFields?.branchList}
              label="Branch"
              form={form}
              required={true}
            />
          </div> */}

          <div className="space-y-2">
            <FormSelect
              name="salutation"
              options={kycRequiredFields?.salutationList}
              label="Salutation"
              caption="Select Salutation"
              form={form}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormSelect
              name="gender"
              options={kycRequiredFields?.genderList}
              label="Gender"
              caption="Select Gender"
              form={form}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormInput
              form={form}
              name="firstName"
              type="text"
              placeholder="Enter first name"
              label="First Name"
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormInput
              form={form}
              name="middleName"
              type="text"
              placeholder="Enter Middle Name"
              label="Middle Name"
            />
          </div>

          <div className="space-y-2">
            <FormInput
              form={form}
              name="lastName"
              type="text"
              placeholder="Enter Last Name"
              label="Last Name"
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormInputNepali
              form={form}
              name="nameLocal"
              type="text"
              placeholder="Enter Full Name in Nepali"
              label="Full Name in Nepali"
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormSelect
              name="citizenId"
              options={kycRequiredFields?.residenceStatusList}
              label="Id Type"
              caption="Citizenship"
              form={form}
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormCombo
              form={form}
              name="is IssuedDistrict"
              options={kycRequiredFields?.districtList}
              label="Id Issued District"
              required={true}
            />
          </div>

          <div className="space-y-2">
            <FormSelect
              name="idNo"
              options={kycRequiredFields?.religionList}
              label="Id No"
              caption="10553 /2523"
              form={form}
              required={true}
            />
          </div>

          <DateConverter
            form={form}
            name="identityDocumentIssuedDate"
            labelNep="Identification Issued Date (BS)"
            labelEng="Identification Issued Date (AD)"
            // disabled={isCitizenship}
          />

          <div className="space-y-2">
            <FormSelect
              name="profession"
              options={kycRequiredFields?.maritalStatusList}
              label="Profession "
              caption="Select Profession"
              form={form}
              required={true}
            />
          </div>
          <div className="space-y-2">
            <FormSelect
              name="qualification"
              options={kycRequiredFields?.maritalStatusList}
              label="Qualification "
              caption="Select Qualification"
              form={form}
              required={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
