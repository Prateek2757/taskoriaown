"use client";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { Button } from "@/components/ui/button";
import UseDropDownList from "@/hooks/use-dropdownList";
import type { FirstPremiumDTO } from "../FirstPremiumSchema";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

// import type { ProductProposalDTO } from "../productProposalSchema";

interface ProposalDetailProps {
  form: UseFormReturn<FirstPremiumDTO>;
  partialPayments: FirstPremiumDTO;
}
export default function PartialPaymentDetail({
  form,
  partialPayments,
}: ProposalDetailProps) {
  const [bankName, setBankName] = useState<SelectOption[]>([]);
  const [docs, setDocs] = useState(() => {
    const formDocument = form.getValues("partialPayment") || [];
    if (formDocument.length === 0) {
      return [
        {
          id: 1,
          // sn: '',
          collectionType: "",
          BankName: "",
          ChequeNo: "",
          DepositeDateBS: "",
          DepositeDateAD: "",
          TendorAmount: "",
          Remarks: "",
        },
      ];
    }
    return formDocument.map((docs, index) => ({
      ...docs,
      id: index + 1,
    }));
  });
  const addNominee = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const currentNominees = form.getValues("partialPayment") || [];
      const nextId = Math.max(...docs.map((n) => n.id), 0) + 1;
      const newNominee = {
        id: nextId,
          // sn: '',
          collectionType: "",
          BankName: "",
          ChequeNo: "",
          DepositeDateBS: "",
          DepositeDateAD: "",
          TendorAmount: "",
          Remarks: "",
      };
  
      const updatedNominees = [...currentNominees, newNominee];
      form.setValue("partialPayment", updatedNominees);
      setDocs((prev) => [
        ...prev,
        {
          // id: Math.max(...prev.map((n) => n.id), 0) + 1,
          ...newNominee,
        },
      ]);
    };
    const removeNominee = (id: number) => {
      if (docs.length > 1) {
        const indexToRemove = docs.findIndex((nominee) => nominee.id === id);
        const currentNominees = form.getValues("partialPayment") || [];
        const updatedNominees = currentNominees.filter(
          (_, index) => index !== indexToRemove,
        );
  
        form.setValue("partialPayment", updatedNominees);
        setDocs(docs.filter((nominee) => nominee.id !== id));
      }
    };
  useEffect(()=>{
    const premiumValue = Number(form.watch("premium")) || 0;
    const medicalfeeValue = Number(form.watch("medicalFee")) || 0;
    const tenderAmountValue = Number(form.watch("tenderAmount")) || 0;
    let totalTenderAmount = 0;
    for (let index = 0; index < docs.length; index++) {
      const element = form.watch(`partialPayment.${index}.TendorAmount`);
      totalTenderAmount += Number(element) || 0;
    }
    const totalPaid = medicalfeeValue + tenderAmountValue + totalTenderAmount;
    const excess = totalPaid - premiumValue;
    if (excess !== 0) {
      form.setValue("excessAmount", excess > 0 ? `${excess}` : `${excess}`);
    } else {
      form.setValue("excessAmount", "0");
    }
  }, [docs, form.watch("premium"), form.watch("medicalFee"), form.watch("tenderAmount"), ...docs.map((_, i) => form.watch(`partialPayment.${i}.TendorAmount`))]);
  
  
  
  const { getDataDropdown } = UseDropDownList();
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border  shadow-sm mb-6 mt-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-800">
              Partial Payment Details
            </h2>
          </div>
          <Button
            onClick={addNominee}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Partial Payment
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <h3 className="text-white font-semibold text-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Payment Entries
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {docs.map((nominee, index) => {
                const currentCollectionType = form.watch(
                  `partialPayment.${index}.collectionType`
                );
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-lg border border-purple-100 p-6 relative"
                  >
                    {/* Entry Header */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <h4 className="font-semibold text-purple-800">
                          Payment Entry #{index + 1}
                        </h4>
                      </div>
                      {docs.length > 1 && (
                        <Button
                          onClick={() => removeNominee(nominee.id)}
                          variant={"destructive"}
                          size="sm"
                          type="button"
                          className="flex items-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <FormSelect
                          name={`partialPayment.${index}.collectionType`}
                          label="Collection Type"
                          options={partialPayments?.collectionTypeList || []}
                          form={form}
                          caption="Please Select Collection Type"
                        />
                      </div>
                      {currentCollectionType === "V" && (
                        <>
                          <div className="space-y-2 overflow-hidden">
                            <FormCombo
                              name={`partialPayment.${index}.BankName`}
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
                          </div>

                          <div className="space-y-2">
                            <FormInput
                              form={form}
                              name={`partialPayment.${index}.ChequeNo`}
                              type="text"
                              placeholder={`Enter Cheque Number`}
                              label={`Cheque Number`}
                              required={false}
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <FormInput
                          form={form}
                          name={`partialPayment.${index}.TendorAmount`}
                          type="number"
                          placeholder={`Enter Amount`}
                          label={`Tender Amount`}
                          required={true}
                        />
                      </div>

                      {currentCollectionType === "V" && (
                        <>
                          <div className="space-y-2  grid col-span-2 grid-cols-2 gap-4">                         
                            <DateConverter
                              form={form}
                              name={`partialPayment.${index}.DepositeDateBS`}
                              labelNep="Deposit Date (BS)"
                              labelEng="Deposit Date (AD)"
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <FormInput
                          form={form}
                          name={`partialPayment.${index}.Remarks`}
                          type="text"
                          placeholder={`Enter Remarks`}
                          label={`Remarks`}
                          required={false}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
