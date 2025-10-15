"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { Button } from "@/components/ui/button";

type RepaymentFormFields = {
  agentCode: string;
  paidAmount: string;
  interestAmount: string;
  collectionType: string;
  remarks?: string;
};

export default function AgentLoanRepaymentForm() {
  const form = useForm<RepaymentFormFields>({
    defaultValues: {
      agentCode: "",
      paidAmount: "",
      interestAmount: "",
      collectionType: "",
      remarks: "",
    },
  });

  const [step, setStep] = useState(1);
  const [agentLoanDetails, setAgentLoanDetails] = useState<any>(null);

  const collectionTypes = [
    { text: "Cash", value: "cash" },
    { text: "Bank Transfer", value: "bank" },
    { text: "Cheque", value: "cheque" },
  ];

  const agentOptions = [
    {
      text: "12300003 | Bhesh Raj Karki | 146656.86 | Active | AL12300003",
      value: "12300003",
    },
  ];

  const mockSearchHandler = () => {
    const code = form.getValues("agentCode");

    if (code === "12300003") {
      setAgentLoanDetails({
        agentCode: "12300003",
        fullName: "Bhesh Raj Karki",
        branch: "123 | Basantapur",
        loanAmount: "208000.00",
        totalPaid: "61343.1418",
        lastPaidOn: "2024-01-07",
        currentInterest: "29315.00",
        remainingPrincipal: "146656.86",
        availableCommission: "7164.69",
        dueNetLoan: "175971.86",
        loanType: "Motorcycle/Scooter",
        loanDate: "2021-03-02",
        loanId: "AL12300003",
      });

      setStep(2);
    } else {
      alert("Agent not found. Try 12300003.");
    }
  };

  const handleSubmit = (data: RepaymentFormFields) => {
    alert(`Repayment submitted:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <FormProvider {...form}>
      <div className="mt-4">
        {step === 1 && (
          <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
            <h2 className="text-xl font-semibold mb-4">Agent Loan Search</h2>
            <div className="border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 text-gray-700">
                <FormSelect
                  form={form}
                  name="agentCode"
                  options={agentOptions}
                  label="Agent Code"
                  caption="Select Agent Code"
                  required
                />
              </div>
            </div>
            <Button type="button" onClick={mockSearchHandler}>
              Search
            </Button>
          </div>
        )}

        {step === 2 && agentLoanDetails && (
          <>
            <div className="border-0 md:border rounded-lg p-0 md:p-6 mt-3">
              <div className="mb-6  space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 tracking-wide">
                  Agent Details
                </h2>
                <div className="border border-dashed border-blue-300 rounded-lg p-3 bg-gray-10 text-sm text-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center gap-50">
                    <div>
                      <strong>Agent Code:</strong> {agentLoanDetails.agentCode}{" "}
                      {agentLoanDetails.fullName}
                    </div>
                    <div className="md:ml-6">
                      <strong>Branch:</strong> {agentLoanDetails.branch}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-wide">
                Agent Loan Details
              </h2>
              <div className="border border-dashed border-blue-300 rounded-lg p-2 mb-8 bg-gray-10">
                <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-700 mb-2">
                  <div>
                    <strong>Agent Code:</strong> {agentLoanDetails.agentCode}
                  </div>
                  <div>
                    <strong>Branch:</strong> {agentLoanDetails.branch}
                  </div>
                  <div>
                    <strong>Loan ID:</strong> {agentLoanDetails.loanId}
                  </div>
                  <div>
                    <strong>Loan Type:</strong> {agentLoanDetails.loanType}
                  </div>
                  <div>
                    <strong>Loan Date:</strong> {agentLoanDetails.loanDate}
                  </div>
                  <div>
                    <strong>Remaining Principal:</strong>{" "}
                    {agentLoanDetails.remainingPrincipal}
                  </div>
                  <div>
                    <strong>Available Commission:</strong>{" "}
                    {agentLoanDetails.availableCommission}
                  </div>
                  <div>
                    <strong>Total Paid Amount:</strong>{" "}
                    {agentLoanDetails.totalPaid}
                  </div>
                  <div>
                    <strong>Last Paid On:</strong> {agentLoanDetails.lastPaidOn}
                  </div>
                  <div>
                    <strong>Current Interest:</strong>{" "}
                    {agentLoanDetails.currentInterest}
                  </div>
                  <div>
                    <strong>Due Net Loan:</strong> {agentLoanDetails.dueNetLoan}
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-6 tracking-wide">
                Payment Details
              </h2>
              <div className="border border-dashed border-blue-300 rounded-lg p-6 mb-8 bg-gray-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 text-gray-700 gap-4">
                  <FormInput
                    form={form}
                    name="paidAmount"
                    type="text"
                    label="Total Paid Amount"
                    placeholder="Enter Paid Amount"
                    required
                  />
                  <FormInput
                    form={form}
                    name="interestAmount"
                    type="text"
                    label="Deducted Interest Amount"
                    placeholder="Enter Interest Amount"
                    required
                  />
                  <FormSelect
                    form={form}
                    name="collectionType"
                    label="Collection Type"
                    options={collectionTypes}
                    caption="Select Collection Type"
                    required
                  />
                  <FormInput
                    form={form}
                    name="remarks"
                    type="text"
                    label="Remarks"
                    placeholder="Enter any remarks"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                type="button"
                className="bg-red-400"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
              <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </FormProvider>
  );
}
