"use client";
import type { UseFormReturn } from "react-hook-form";
import type { AddEditKycDTO } from "@/app/(admin)/kyc/schemas/kycSchema";
import FormCombo from "@/components/formElements/FormCombo";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { apiPostCall, type PostCallData } from "@/helper/apiService";
import { useOnlyAlphabets, useOnlyNumbers } from "@/hooks/useInputValidation";
import AddressSelect from "@/components/uiComponents/address-select/address-select";
import FormInput from "@/components/formElements/FormInput";
import FormInputNepali from "@/components/formElements/FormInputNepali";
import FormCheckbox from "@/components/formElements/FormCheckbox";
import { useCallback, useEffect, useState } from "react";

type AddressDetailsProps = {
  kycRequiredFields?: KycRequiredFields;
  form: UseFormReturn<AddEditKycDTO>;
  isLoggedIn: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function AddressDetails({
  kycRequiredFields,
  form,
  isLoggedIn,
}: AddressDetailsProps) {
  const [wardNoList, setWardNoList] = useState<SelectOption[]>([]);

  const onlyAlphabets = useOnlyAlphabets();
  const onlyNumbers = useOnlyNumbers();
  const permanentProvince = form.watch("permanentProvince");
  const permanentDistrict = form.watch("permanentDistrict");
  const permanentMunicipality = form.watch("permanentMunicipality");
  const permanentStreetName = form.watch("permanentStreetName");
  // const permanentStreetNameLocal = form.watch("permanentStreetNameLocal");
  // const permanentHouseNumber = form.watch("permanentHouseNumber");
  const permanentWardNumber = form.watch("permanentWardNumber");
  const permanentLocation = form.watch("permanentLocation");

  const temporaryProvince = form.watch("temporaryProvince");
  const temporaryDistrict = form.watch("temporaryDistrict");
  const temporaryMunicipality = form.watch("temporaryMunicipality");
  const temporaryStreetName = form.watch("temporaryStreetName");
  // const temporaryStreetNameLocal = form.watch("temporaryStreetNameLocal");
  // const temporaryHouseNumber = form.watch("temporaryHouseNumber");
  const temporaryWardNumber = form.watch("temporaryWardNumber");
  const temporaryLocation = form.watch("temporaryLocation");
  const samePermanentandTemporaryAddress = form.watch(
    "samePermanentandTemporaryAddress"
  );

  const checkAddress = (checked: boolean) => {
    if (checked) {
      form.setValue("temporaryProvince", permanentProvince);
      form.setValue("temporaryDistrict", permanentDistrict);
      form.setValue("temporaryMunicipality", permanentMunicipality);
      form.setValue("temporaryStreetName", permanentStreetName);
      // form.setValue("temporaryStreetNameLocal", permanentStreetNameLocal);
      // form.setValue("temporaryHouseNumber", permanentHouseNumber);
      form.setValue("temporaryWardNumber", permanentWardNumber);
      form.setValue("temporaryLocation", permanentLocation);
    } else {
      form.setValue("temporaryProvince", temporaryProvince);
      form.setValue("temporaryDistrict", temporaryDistrict);
      form.setValue("temporaryMunicipality", temporaryMunicipality);
      form.setValue("temporaryStreetName", temporaryStreetName);
      // form.setValue("temporaryStreetNameLocal", temporaryStreetNameLocal);
      // form.setValue("temporaryHouseNumber", temporaryHouseNumber);
      form.setValue("temporaryWardNumber", temporaryWardNumber);
      form.setValue("temporaryLocation", temporaryLocation);
    }
  };

  const getWardNo = useCallback(async () => {
    try {
      const submitData: PostCallData & {
        flag: string;
      } = {
        flag: "WardNoAutoComplete",
        endpoint: "get_utility_dropdown",
      };

      const response = await apiPostCall(submitData, isLoggedIn);
      console.log("ward number list", response);

      if (response && response.status === API_CONSTANTS.success) {
        setWardNoList(response.data);
      } else {
        alert(`Failed to get Ward Number List: ${response || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error || "Failed to get Ward Number List"}`);
    } finally {
      console.log("Ward Number List got successfully");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    getWardNo();
  }, [getWardNo]);

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        Permanent Address Information
      </h2>

      <div className="border-0 md:border border-dashed border-blue-200 rounded-lg  p-0 md:p-6 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <AddressSelect
            form={form}
            kycRequiredFields={kycRequiredFields}
            pName="permanentProvince"
            dName="permanentDistrict"
            mName="permanentMunicipality"
          />

          <div className="space-y-2">
            <FormInput
              form={form}
              name="permanentStreetName"
              type="text"
              placeholder="Enter Permanent Street Name"
              label="Permanent Street Name"
              onKeyDown={onlyAlphabets}
            />
          </div>

          <div className="space-y-2">
            <FormCombo
              form={form}
              name="permanentWardNumber"
              options={wardNoList}
              label="Permanent Ward No."
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 mt-6">
        Temporary Address Information
        <div className="flex items-center space-x-2 mt-3">
          <FormCheckbox
            form={form}
            name="samePermanentandTemporaryAddress"
            onCheckedChange={checkAddress}
            label="Temporary Address Information same as Permanent Address"
          />
        </div>
      </h2>

      {!samePermanentandTemporaryAddress && (
        <div className="border-0 md:border border-dashed border-blue-200 rounded-lg  p-0 md:p-6 md:pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <AddressSelect
              form={form}
              kycRequiredFields={kycRequiredFields}
              pName="temporaryProvince"
              dName="temporaryDistrict"
              mName="temporaryMunicipality"
            />

            <div className="space-y-2">
              <FormInput
                form={form}
                name="temporaryStreetName"
                type="text"
                placeholder="Enter temporary street name"
                label="Temporary Street Name"
                onKeyDown={onlyAlphabets}
              />
            </div>

            <div className="space-y-2">
              <FormCombo
                form={form}
                name="temporaryWardNumber"
                options={wardNoList}
                label="Temporary Ward No."
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
