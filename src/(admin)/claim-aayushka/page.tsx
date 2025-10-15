"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import ClaimSearchForm from "./components/ClaimSearch";

function ClaimPage() {
  const form = useForm();

  const claimTypes = [
    { label: "Policy Loan", value: "policy_loan" },
    { label: "Maturity", value: "maturity" },
    { label: "Death", value: "death" },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
  ];

  const provinceOptions = [
    { label: "Province 1", value: "p1" },
    { label: "Province 2", value: "p2" },
  ];

  const branchOptions = [
    { label: "Kathmandu", value: "ktm" },
    { label: "Pokhara", value: "pokhara" },
  ];

  const policyOptions = [
    { label: "Policy #123", value: "123" },
    { label: "Policy #456", value: "456" },
  ];

  const typeOptions = [
    { label: "Requested Branch", value: "requested" },
    { label: "Home Branch", value: "home" },
  ];

  const handleSearch = () => {
    const values = form.getValues();
    console.log("Search values:", values);
    
  };

  return (
    <FormProvider {...form}>
      <div className="mx-1 my-6">
        <ClaimSearchForm
          form={form}
          claimTypes={claimTypes}
          statusOptions={statusOptions}
          provinceOptions={provinceOptions}
          branchOptions={branchOptions}
          policyOptions={policyOptions}
          typeOptions={typeOptions}
          onSearch={handleSearch}
          
        />
       
      </div>
    </FormProvider>
  );
}

export default ClaimPage;
