"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // <-- added this import
import type { UseFormReturn } from "react-hook-form";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import FormInput from "@/components/formElements/FormInput";
import FormCombo from "@/components/formElements/FormCombo";
import FormSelect from "@/components/formElements/FormSelect";
import FormCheckbox from "@/components/formElements/FormCheckbox";
import { apiPostCall } from "@/helper/apiService";
import { API_CONSTANTS } from "@/constants/staticConstant";
import { Button } from "@/components/ui/button";
import { FormSwitch } from "@/components/formElements/FormSwitch";

type SelectOption = {
  text: string;
  value: string | number;
};

type CommissionFilterForm = {
  fromDate: string;
  toDate: string;
  agentCode: string;
  kycNo: string;
  licenseNo: string;
  panNo: string;
  branch: string;
  bankStatus: string;
  kycStatus: string;
  premiumType: string;
  businessType: string;
  sameBank: boolean;
};

type Props = {
  form: UseFormReturn<CommissionFilterForm>;
  isLoggedIn: boolean;
};

export default function CommissionDisbursementForm({
  form,
  isLoggedIn,
}: Props) {
  const router = useRouter(); // initialize router

  const [branchOptions, setBranchOptions] = useState<SelectOption[]>([]);
  const [premiumTypeOptions, setPremiumTypeOptions] = useState<SelectOption[]>([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<SelectOption[]>([]);

  const getDropdownOptions = useCallback(async () => {
    try {
      const res = await apiPostCall(
        { flag: "CommissionFilterDropdowns", endpoint: "get_utility_dropdown" },
        isLoggedIn
      );
      if (res.status === API_CONSTANTS.success) {
        setBranchOptions(res.data.branchList || []);
        setPremiumTypeOptions(res.data.premiumTypeList || []);
        setBusinessTypeOptions(res.data.businessTypeList || []);
      }
    } catch (err) {
      console.error("Error fetching dropdown options", err);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    getDropdownOptions();
  }, [getDropdownOptions]);

  const handleSearch = () => {
    const values = form.getValues();
    console.log("Search Triggered", values);

    // Navigate to the desired route
    router.push("/payment-list/commission-payment");
  };

  const handleExport = () => {
    const values = form.getValues();
    console.log("Export Triggered", values);
  };

  return (
    <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
      <div className="border border-dashed border-blue-200 rounded-lg p-6 mt-3">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Commission Disbursement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <DateConverter form={form} name="fromDate" labelEng="From Date" labelNep="From Date" />
          <DateConverter form={form} name="toDate" labelEng="To Date" labelNep="To Date" />

          <FormCombo form={form} name="agentCode" label="Agent Code" caption="Enter Agent Code" type="text" />
          <FormCombo form={form} name="kycNo" label="KYC No" caption="Enter KYC No" type="text" />
          <FormCombo form={form} name="licenseNo" label="License No" caption="Enter License No" type="text" />
          <FormCombo form={form} name="panNo" label="PAN No" placeholder="Enter PAN No" type="text" />

          <FormCombo form={form} name="branch" label="Branch" options={branchOptions} />

          <FormSelect
            form={form}
            name="bankStatus"
            label="Bank Status"
            options={[
              { text: "VERIFIED", value: "VERIFIED" },
              { text: "UNVERIFIED", value: "UNVERIFIED" },
            ]}
          />

          <FormSelect
            form={form}
            name="kycStatus"
            label="KYC Status"
            options={[
              { text: "VERIFIED", value: "VERIFIED" },
              { text: "UNVERIFIED", value: "UNVERIFIED" },
            ]}
          />

          <FormSelect form={form} name="premiumType" label="Premium Type" options={premiumTypeOptions} />
          <FormSelect form={form} name="businessType" label="Business Type" options={businessTypeOptions} />
          <FormSwitch form={form} name="sameBank" label="Same Bank" />
        </div>
      </div>
      <div className="flex gap-4 mt-4">
        <Button
          type="button"
          onClick={handleSearch}
          className=" text-white px-4 py-2 rounded"
        >
          Search
        </Button>
        <Button
          type="button"
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export To Excel
        </Button>
      </div>
    </div>
  );
}
