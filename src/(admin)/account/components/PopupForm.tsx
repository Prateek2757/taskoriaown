import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { Button } from "@/components/ui/button";
// import {
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Building2, User, FileText, Settings, CreditCard } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  AccountSchema,
  AccountSchemaDTO,
  initialAccountData,
} from "../Schema/AccountSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { apiPostCall, PostCallData } from "@/helper/apiService";
import { API_CONSTANTS, SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { useRouter } from "next/navigation";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Usevalidation from "@/hooks/Admin/use-validation";

interface AccountFormValues {
  ledgerNo: string;
}

const PopupForm = ({ ledgerNo }: AccountFormValues) => {
  const [ledgerRequiredDetails, setLedgerRequiredDetails] = useState<any>({});
  const form = useForm({
    resolver: zodResolver(AccountSchema),
    defaultValues: initialAccountData,
    mode: "all",
  });

  const { showToast } = useToast();
  const route = useRouter();

  useEffect(() => {
    if (ledgerNo) {
      form.setValue("ledgerNo", ledgerNo);
    }
  }, [ledgerNo, form]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {
          LedgerNumber: ledgerNo || null,
          endpoint: "ledger_details",
        };
        const response = await apiPostCall(data as PostCallData);
        if (response?.data && response.status === API_CONSTANTS.success) {
          console.log(
            "Ledger Required Details is in this response:",
            response.data
          );
          setLedgerRequiredDetails(response.data);
        } else {
          console.error("Invalid response format or failed API call");
        }
      } catch (error) {
        console.error("Error fetching  data:", error);
      } finally {
      }
    };
    if (ledgerNo) {
      fetchData();
    }
  }, [ledgerNo]);

  const onSubmit: SubmitHandler<AccountSchemaDTO> = async (
    formData: AccountSchemaDTO
  ) => {
    console.log("formData is being summitted underwritting", formData);

    try {
      console.log("this is ledger_add form data", formData);

      const submitData: PostCallData & {
        userName?: string | undefined | null;
      } = {
        ...formData,
        endpoint: "ledger_add",
      };
       console.log("this is ledger_add form data submit data", submitData);
      const response = await apiPostCall(submitData);

      console.log("this is ledger_add form data response", response.data);

      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        showToast(
          response.data.code,
          response.data.message,
          "Ledger Added Successfully"
        );
        route.push(`/account`);
      } else {
        showToast(
          response?.data.code,
          response?.data.message,
          "Ledger Addition Failed"
        );
      }
    } catch (error) {
      console.log("Error submitting ledger form:", error);
    } finally {
      console.log("Ledger Created");
    }
  };
  const { onInvalid, validationErrors } = Usevalidation();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6"
      >
        <DialogContent className="max-w-7xl min-w-[60vw] max-h-[95vh] overflow-hidden bg-gradient-to-br from-white to-gray-50">
          {ledgerNo ? (
            <>
              <DialogHeader className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                      Add New Ledger Account
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1">
                      Create a new ledger account with the required information.
                      Fields marked with * are required.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="overflow-y-auto max-h-[calc(95vh-220px)] px-1">
                {/* LG Code Display */}
                <div className="text-center mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center space-x-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-semibold text-lg">
                      LG Code: {ledgerNo || "Selected Ledger No"}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Basic Information
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Row 1: Ledger No & Ledger Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Ledger No"
                          name="ledgerNo"
                          form={form}
                          placeholder="Enter Ledger Number"
                          type="text"
                          required
                          disabled
                        />
                        <FormInput
                          label="Ledger Name *"
                          name="ledgerName"
                          form={form}
                          placeholder="Enter Ledger Name"
                          required
                          type="text"
                        />
                      </div>

                      {/* Row 2: Ledger Name (Local) & Ledger Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Ledger Name (Local)"
                          name="ledgerNameLocal"
                          form={form}
                          placeholder="Enter Local Name"
                          type="text"
                        />
                        <FormSelect
                          label="Ledger Type"
                          name="ledgerType"
                          form={form}
                          options={ledgerRequiredDetails?.ledgerTypeList || []}
                          caption="Select Ledger Type"
                          // required
                        />
                      </div>

                      {/* Row 3: Employee ID & Branch */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Employee ID"
                          name="employeeId"
                          form={form}
                          placeholder="Enter Employee ID"
                          type="text"
                        />
                        <FormSelect
                          label="Branch"
                          name="branch"
                          form={form}
                          options={ledgerRequiredDetails?.branchList || []}
                          caption="Select Branch"
                        />
                      </div>

                      {/* Row 4: Product Code & Bank */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                          label="Product Code"
                          name="productCode"
                          form={form}
                          options={ledgerRequiredDetails?.productList || []}
                          caption="Select Product"
                        />
                        <FormSelect
                          label="Bank"
                          name="bank"
                          form={form}
                          options={ledgerRequiredDetails?.bankList || []}
                          caption="Select Bank"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Information Section */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                        Financial Information
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Bank Account No"
                          name="bankAccountNo"
                          form={form}
                          placeholder="Enter Bank Account Number"
                          type="text"
                        />
                        <FormInput
                          label="Mobile No"
                          name="mobileNo"
                          form={form}
                          placeholder="Enter Mobile Number"
                          type="tel"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Email"
                          name="email"
                          form={form}
                          placeholder="Enter Email Address"
                          type="email"
                        />
                        <FormInput
                          label="PAN No"
                          name="panNo"
                          form={form}
                          placeholder="Enter PAN Number"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-purple-500" />
                        Description & Remarks
                      </h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Row 1: Ledger Description & Remarks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormSelect
                          label="Ledger Description"
                          name="ledgerDescription"
                          form={form}
                          options={
                            ledgerRequiredDetails?.ledgerDescriptionList || []
                          }
                          caption="Select Ledger Description"
                        />
                        <FormInput
                          label="Remarks"
                          name="remarks"
                          form={form}
                          placeholder="Enter Remarks"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="border-b border-gray-200 p-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-orange-500" />
                        Account Settings
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <FormSwitch
                            label="Is Allow For Voucher Entry"
                            name="allowVoucherEntry"
                            form={form}
                          />
                          <p className="text-xs text-gray-500">
                            Enable voucher entry for this account
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <FormSwitch
                            label="Is Allow For Branch"
                            name="allowForBranch"
                            form={form}
                          />
                          <p className="text-xs text-gray-500">
                            Allow branch-level access
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <FormSwitch
                            label="Is Active"
                            name="isActive"
                            form={form}
                          />
                          <p className="text-xs text-gray-500">
                            Account status
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-gray-200 pt-4 bg-gray-50 rounded-b-xl">
                <div className="flex space-x-3 w-full justify-end">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit, onInvalid)()}
                    className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all duration-200"
                  >
                    {form.formState.isSubmitting
                      ? "Submitting..."
                      : "Add Ledger"}
                  </Button>
                </div>
                <div>
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <title>Title</title>
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
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                      Ledger Number is not selected
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1">
                      For creating the new ledger the ledger number must be
                      selected from the list.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </form>
    </Form>
  );
};

export default PopupForm;
