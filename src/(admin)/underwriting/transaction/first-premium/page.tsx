"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormInputDate from "@/components/formElements/FormInputDate";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import {
  apiGetCall,
  apiPostCall,
  type PostCallData,
} from "@/helper/apiService";
import UseDropDownList from "@/hooks/use-dropdownList";
import {
  emptyFirstPremium,
  type FirstPremiumDTO,
  FirstPremiumSchema,
} from "./FirstPremiumSchema";
import PartialPaymentDetail from "./Component/partial";
import AdditionalInformation from "./Component/AdditionalInformation";
import { useRouter } from "next/navigation";

export default function InsurancePremiumUI() {
  const [agentList, setAgentList] = useState<SelectOption[]>([]);
  const [peerbankList, setpeerbankList] = useState<SelectOption[]>([]);
  const [bankName, setBankName] = useState<SelectOption[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [partialPayments, setPartialPayments] = useState<FirstPremiumDTO>([]);
  const { showToast } = useToast();
  const route = useRouter();

  
  const form = useForm({
    resolver: zodResolver(FirstPremiumSchema),
    defaultValues: emptyFirstPremium(),
    mode: "all",
  });
  const proposalnumber = form.watch("proposalNumber");
  const partialPaymentStatus = form.watch("isPartialPayment");
  const premiumValue = form.watch("premium");
  const medicalfeeValue = form.watch("medicalFee");
  const tenderAmountValue = form.watch("tenderAmount");
  const collectionTypeValue = form.watch("collectionType");
  useEffect(() => {
    const premium = Number(premiumValue);
    const medicalFee = Number(medicalfeeValue);
    const tenderAmount = Number(tenderAmountValue);
    const prevExcess = Number(form.getValues("excessAmount"));

    const safePremium = isNaN(premium) ? 0 : premium;
    const safeMedicalFee = isNaN(medicalFee) ? 0 : medicalFee;
    const safeTenderAmount = isNaN(tenderAmount) ? 0 : tenderAmount;
    const safePrevExcess = isNaN(prevExcess) ? 0 : prevExcess;

    // Example: add previous excess to new calculation
    const excess = safeMedicalFee + safeTenderAmount - safePremium + safePrevExcess;
    if (form.watch("excessAmount") !== excess.toString()) {
      form.setValue("excessAmount", excess.toString());
    }
  }, [premiumValue, medicalfeeValue, tenderAmountValue, form.setValue]);

  const getFirstPremiumDetails = useCallback(
    async (id: string) => {
      try {
        const submitdata = {
          params: { id: id },
          endpoint: "get_first_premium",
        };
        const response = await apiGetCall(submitdata as PostCallData);
        const { data } = response;
        console.log("this is the response from first premium", data);

        if (response.data.code === SYSTEM_CONSTANTS.success_code) {
          form.setValue("premium", data.premium);
          form.setValue("medicalFee", data.medicalFee);
          form.setValue("tenderAmount", data.tenderAmount);
          form.setValue(
            "proposalNumberEncrypted",
            data.proposalNumberEncrypted
          );
          setPartialPayments(data);
        } else {
          showToast(
            response?.data.code,
            response?.data.message,
            "Getting data failed"
          );
        }
      } catch (_error) {
        showToast("103", "Something went wrong", "Getting data failed");
      }
    },
    [showToast, form]
  );
  useEffect(() => {
    if (proposalnumber) {
      getFirstPremiumDetails(proposalnumber);
    }
  }, [proposalnumber, getFirstPremiumDetails]);

  const onSubmit: SubmitHandler<FirstPremiumDTO> = async (
    formData: FirstPremiumDTO
  ) => {
    console.log("formData is being summitted underwritting", formData);

    try {
      console.log("this is Target form data", formData);

      const submitData: PostCallData & {
        userName?: string | undefined | null;
      } = {
        ...formData,
        endpoint: "add_payfirstPremium",
      };
      console.log("this is target form data payload", submitData);

      const response = await apiPostCall(submitData);

      console.log("this is target form data response", response.data);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Target Added Successfully"
        );
        route.push(`/underwriting/transaction/first-premium/fpreceipt/${response.data.data}`);
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Target Addition Failed"
        );
      }
    } catch (error) {
      console.log("Error submitting underwritting form:", error);
    } finally {
      console.log("Underwritting Created");
    }
  };

  const { getDataDropdown } = UseDropDownList();

  const getAllValidationErrors = (errors: any): string[] => {
    const errorMessages: string[] = [];

    const extractErrors = (obj: any, prefix = "") => {
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (value?.message) {
          const readableField = fieldPath
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .replace(/\./g, " - ");
          errorMessages.push(`${readableField}: ${value.message}`);
        } else if (typeof value === "object" && value !== null) {
          extractErrors(value, fieldPath);
        }
      });
    };

    extractErrors(errors);
    return errorMessages;
  };
  const onInvalid = (errors: any) => {
    console.log("Form validation errors:", errors);
    const errorMessages = getAllValidationErrors(errors);
    setValidationErrors(errorMessages);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            First Premium Payment
          </h1>
          <p className="text-gray-600">
            Process and manage insurance premium payments
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Search Proposal
              </h3>
              <div className="mb-6">
                <div className="space-y-2">
                  <FormCombo
                    name="proposalNumber"
                    options={agentList}
                    label="Proposal Number"
                    form={form}
                    required={true}
                    onSearch={async (value) => {
                      await getDataDropdown(
                        value,
                        "ApprovedProposalList",
                        setAgentList
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            {partialPayments?.proposalNumberEncrypted && (
              <>
                {/* Main Content Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <Tabs defaultValue="Payerinfo" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-t-lg border-b">
                      <TabsTrigger
                        value="Payerinfo"
                        className="flex items-center justify-center space-x-2 text-sm py-3 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                      >
                        <span>Payer Information</span>
                      </TabsTrigger>
                      {(partialPayments as any)?.payerStatus == "True" && (
                        <TabsTrigger
                          value="Additionalinfo"
                          className="flex items-center justify-center space-x-2 text-sm py-3 px-6 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                        >
                          <span>Additional Information</span>
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="Payerinfo" className="mt-0">
                      <div className="p-6">
                        {/* Header */}
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Payer Information
                          </h2>
                          <p className="text-gray-600">
                            Manage payer details and collection information
                          </p>
                        </div>

                        {(partialPayments as any)?.payerStatus == "True" && (
                          <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-blue-800 mb-4">
                              Account Details
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                              <div>
                                <FormSelect
                                  name="payer"
                                  label="Payer"
                                  options={[
                                    {
                                      value: "self",
                                      text: "Self",
                                      disabled: false,
                                      group: "",
                                      selected: true,
                                    },
                                    {
                                      value: "other",
                                      text: "Others",
                                      disabled: false,
                                      group: "",
                                      selected: false,
                                    },
                                  ]}
                                  form={form}
                                />
                              </div>

                              <div>
                                <FormSelect
                                  name="peerbank"
                                  label="Bank"
                                  options={peerbankList}
                                  onSearch={async (value: string) => {
                                    await getDataDropdown(
                                      value,
                                      "BankAutoComplete",
                                      setpeerbankList
                                    );
                                  }}
                                  form={form}
                                />
                              </div>

                              <div>
                                <FormInput
                                  name="accountNo"
                                  label="Account No."
                                  placeholder="Enter Account Number"
                                  form={form}
                                />
                              </div>

                              <div>
                                <FormInput
                                  name="accountName"
                                  label="Account Name"
                                  placeholder="Enter Account Holder Name"
                                  form={form}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* Left Panel - Personal Information */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div className="p-6">
                              <div className="flex items-center mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                  <svg
                                    className="w-5 h-5 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-blue-800">
                                  Personal Details
                                </h3>
                              </div>

                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Name
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.name || "N/A"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Address
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.address || "N/A"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Date of Birth
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.dateOfBirth ||
                                      "N/A"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Father Name
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.fatherName ||
                                      "N/A"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Nominee
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.nominee || "N/A"}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 py-2 border-b border-blue-200">
                                  <span className="font-medium text-blue-700">
                                    Mobile No
                                  </span>
                                  <span className="text-gray-900">
                                    {(partialPayments as any)?.mobileNumber ||
                                      "N/A"}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-blue-200">
                                <h4 className="text-md font-semibold text-blue-800 mb-3">
                                  Product Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Product
                                    </span>
                                    <span className="text-gray-900">LI</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Product Name
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.productName ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Product Code
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.productCode ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-blue-200">
                                <h4 className="text-md font-semibold text-blue-800 mb-3">
                                  Agent Information
                                </h4>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Agent Code
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.agentCode ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Agent Name
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.agentName ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-blue-200">
                                <h4 className="text-md font-semibold text-blue-800 mb-3">
                                  Policy Terms
                                </h4>
                                <div className="space-y-2">
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Sum Assured
                                    </span>
                                    <span className="text-gray-900 font-semibold">
                                      {(partialPayments as any)?.sumAssured ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Premium
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.premium ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Medical Fee
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.medicalFee ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Mode of Payment
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)
                                        ?.modeOfPayment || "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Premium Payment Term
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.payTerm ||
                                        "N/A"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 py-1">
                                    <span className="font-medium text-blue-700">
                                      Policy Term
                                    </span>
                                    <span className="text-gray-900">
                                      {(partialPayments as any)?.term || "N/A"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Panel - Collection Details */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="p-6">
                              <div className="flex items-center mb-6">
                                <div className="p-2 bg-green-100 rounded-lg mr-3">
                                  <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    />
                                  </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-green-800">
                                  Collection Details
                                </h3>
                              </div>

                              <div className="space-y-4">
                                {/* Collection Type */}
                                <div className="bg-white p-2 rounded-lg border border-green-200">
                                  <FormSelect
                                    name="collectionType"
                                    label="Collection Type"
                                    options={
                                      partialPayments?.collectionTypeList || []
                                    }
                                    form={form}
                                    caption="Please Select Collection Type"
                                  />
                                </div>

                                {collectionTypeValue === "V" && (
                                  <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <h4 className="text-sm font-semibold text-green-800 mb-3">
                                      Bank Details
                                    </h4>
                                    <div className="space-y-4">
                                      <FormCombo
                                        name="bankName"
                                        options={bankName}
                                        label="Bank Name"
                                        form={form}
                                        onSearch={async (value) => {
                                          await getDataDropdown(
                                            value,
                                            "CollectionBankAutoComplete",
                                            setBankName
                                          );
                                        }}
                                      />

                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <FormInputDate
                                            name="depositedDate"
                                            form={form}
                                            label="Deposited Date"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <FormInputDate
                                            name="collectedDate"
                                            form={form}
                                            label="Collected Date"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Amount Details */}
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                  <h4 className="text-sm font-semibold text-green-800 mb-3">
                                    Amount Details
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <FormInput
                                        name="premium"
                                        label="Premium Amount"
                                        disabled
                                        placeholder="Premium Amount"
                                        form={form}
                                        type={"text"}
                                      />
                                      <FormInput
                                        name="medicalFee"
                                        disabled
                                        label="Medical Fee"
                                        placeholder="Medical Fee"
                                        form={form}
                                        type="text"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <FormInput
                                        name="tenderAmount"
                                        label="Tender Amount"
                                        placeholder="Enter Tender Amount"
                                        form={form}
                                        type="text"
                                      />
                                      <FormInput
                                        name="excessAmount"
                                        label="Excess Amount"
                                        placeholder="Excess Amount"
                                        form={form}
                                        type="text"
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Details */}
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                  <h4 className="text-sm font-semibold text-green-800 mb-3">
                                    Additional Information
                                  </h4>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-700">
                                        Remarks
                                      </label>
                                      <textarea
                                        className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                                        placeholder="Enter any additional remarks..."
                                        rows={3}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Partial Payment Toggle */}
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-sm font-semibold text-green-800">
                                        Payment Options
                                      </h4>
                                      <p className="text-xs text-gray-600 mt-1">
                                        Enable for partial payment processing
                                      </p>
                                    </div>
                                    <FormSwitch
                                      form={form}
                                      name="isPartialPayment"
                                      label="Partial Payment"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {partialPaymentStatus === true && (
                          <div className="mt-6">
                            <PartialPaymentDetail
                              form={form}
                              partialPayments={partialPayments}
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="Additionalinfo" className="mt-0">
                      <div className="p-6">
                        <AdditionalInformation
                          partialPayments={
                            (partialPayments as any)?.goamlDetails
                          }
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Submit Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Submit Payment
                      </h3>
                      <p className="text-gray-600">
                        Review and submit the payment details
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      {form.formState.isSubmitting
                        ? "Processing..."
                        : "Submit Payment"}
                    </Button>
                  </div>

                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <title>Error Icon</title>
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Please fix the following errors:
                          </h3>
                          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                            {validationErrors.map((error, index) => (
                              <li key={`${index * 1}-errors`}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
