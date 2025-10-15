"use client";
import { Plus, Trash } from "lucide-react";
import { Key, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import FormCombo from "@/components/formElements/FormCombo";
import FormInput from "@/components/formElements/FormInput";
import { Button } from "@/components/ui/button";
import UseDropDownList from "@/hooks/use-dropdownList";
import {
  VoucherSchemaDTO,
  VouterFormTableSchemaDTO,
} from "../Schema/VoucherSchema";
import FormSelect from "@/components/formElements/FormSelect";

interface ProposalDetailProps {
  form: UseFormReturn<VoucherSchemaDTO>;
  partialPayments?: VouterFormTableSchemaDTO;
  data?:any
}
export default function VouterFormTable({
  form,
  partialPayments,
  data
}: ProposalDetailProps) {
 
  const voucherEntries = (form as any).watch("VoucherEntryListJson") as any[];
  const branchValues = Array.isArray(voucherEntries)
    ? voucherEntries.map((entry: any) => entry?.Branch)
    : [];
  const { getDataDropdown } = UseDropDownList();

  // When any branch changes, update all branch fields and branchCode
  useEffect(() => {
    const selectedBranch = branchValues.find(
      (b: string) => typeof b === "string" && b
    );

    if (selectedBranch) {
      const raw = (form as any).getValues("VoucherEntryListJson");
      const entries = Array.isArray(raw) ? raw : [];
      const updatedEntries = entries.map((entry: any) => ({
        ...entry,
        branch: selectedBranch,
      }));
      (form as any).setValue("VoucherEntryListJson", updatedEntries);
      (form as any).setValue("branchCode", selectedBranch);
    }
  }, [branchValues.join(","), form]);
  const [docs, setDocs] = useState<any[]>(() => {
    const formDocument =
      ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
    if (formDocument.length === 0) {
      return [
        {
          id: 1,
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
    const currentNominees =
      ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
    const nextId = Math.max(...docs.map((n: any) => n.id), 0) + 1;
    const newNominee = {
      id: nextId,
      collectionType: "",
      BankName: "",
      ChequeNo: "",
      DepositeDateBS: "",
      DepositeDateAD: "",
      TendorAmount: "",
      Remarks: "",
    };

    const updatedNominees = [...currentNominees, newNominee];
    (form as any).setValue("VoucherEntryListJson", updatedNominees);
    setDocs((prev: any[]) => [
      ...prev,
      {
        ...newNominee,
      },
    ]);
  };
  const removeNominee = (id: number) => {
    if (docs.length > 1) {
      const indexToRemove = docs.findIndex((nominee: any) => nominee.id === id);
      const currentNominees =
        ((form as any).getValues("VoucherEntryListJson") as any[]) || [];
      const updatedNominees = currentNominees.filter(
        (_: any, index: number) => index !== indexToRemove
      );

      (form as any).setValue("VoucherEntryListJson", updatedNominees);
      setDocs(docs.filter((nominee: any) => nominee.id !== id));
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden mb-5">
        <div className="px-4 py-2 font-semibold">
          <span>Voucher Entries</span>
        </div>
        <div className="flex gap-4 border-y font-semibold px-4 py-2 bg-gray-100/50">
          <div className="flex-1">
            <span className="text-sm text-gray-600">Branch</span>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-600">Ledger</span>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-600">Sub Ledger</span>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-600">Dr Amount</span>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-600">Cr Amount</span>
          </div>
          <div className="w-[36px]"></div>
        </div>
        {docs.map((nominee: { id: number }, index: Key | null | undefined) => (
          <div key={index} className="flex gap-4 px-4 py-2 items-center">
            <div className="flex-1">
              <FormSelect
                name={`VoucherEntryListJson.${index}.Branch`}
                options={(partialPayments as any)?.branchList || []}
                caption="Select Branch"
                form={form as any}
              />
            </div>
            <div className="flex-1">
              <FormCombo
                name={`VoucherEntryListJson.${index}.LedgerNumber`}
                options={(partialPayments as any)?.ledgerList || []}
                form={form as any}
                label=""
              />
            </div>
            <div className="flex-1">
              <FormCombo
                name={`VoucherEntryListJson.${index}.SubLedgerNumber`}
                options={(partialPayments as any)?.subLedgerList || []}
                form={form as any}
                label=""
              />
            </div>
            <div className="flex-1">
              <FormInput
                form={form as any}
                name={`VoucherEntryListJson.${index}.DrAmount`}
                type="text"
                placeholder={`Enter Amount`}
                required={false}
                value={
                  (form as any).watch(
                    `VoucherEntryListJson.${index}.DrAmount`
                  ) || "0"
                }
              />
            </div>
            <div className="flex-1">
              <FormInput
                form={form as any}
                name={`VoucherEntryListJson.${index}.CrAmount`}
                type="number"
                value={
                  (form as any).watch(
                    `VoucherEntryListJson.${index}.CrAmount`
                  ) || "0"
                }
                placeholder={`Enter Amount`}
                required={true}
              />
            </div>
            <div className="w-[36px]">
              {docs.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeNominee(nominee.id)}
                  size={"icon"}
                  title="Remove Item"
                >
                  <Trash />
                </Button>
              )}
            </div>
          </div>
        ))}
        <div className="border-t-1 flex justify-end items-center px-4 py-2 font-semibold">
          <Button type="button" onClick={addNominee}>
            <Plus /> Add Entry
          </Button>
        </div>
      </div>
      {(() => {
        const watched = (form as any).watch("VoucherEntryListJson");
        const entries = Array.isArray(watched) ? watched : [];
        const totalDr = entries.reduce(
          (sum: number, entry: any) => sum + (parseFloat(entry?.DrAmount) || 0),
          0
        );
        const totalCr = entries.reduce(
          (sum: number, entry: any) => sum + (parseFloat(entry?.CrAmount) || 0),
          0
        );
        const isValid = totalDr === totalCr && totalDr > 0;
        return (
          <div className="border rounded-lg px-4 py-3 flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
            <div className="flex gap-8">
              <div className="text-lg font-semibold text-black">
                Total Dr Amount: <span className="font-bold">{totalDr}</span>
              </div>
              <div className="text-lg font-semibold text-black">
                Total Cr Amount: <span className="font-bold">{totalCr}</span>
              </div>
            </div>
            {!isValid && (
              <div className="text-red-600 font-medium">
                Dr Amount and Cr Amount must be equal and greater than 0!
              </div>
            )}
            {isValid && (
              <div className="text-green-600 font-medium">
                Amounts are balanced.
              </div>
            )}
          </div>
        );
      })()}
    </>
  );
}
