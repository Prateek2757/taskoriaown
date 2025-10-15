"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/formElements/FormInput";
import FormSelect from "@/components/formElements/FormSelect";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { User } from "lucide-react";
import * as z from "zod";

const CaseSchema = z.object({
  name: z.string().nonempty("Name is required"),
  uniqueId: z.string().nonempty("Unique Id is required"),
  amount: z.string().nonempty("Amount is required"),
  isActive: z.boolean().default(true),
});

type CaseFormValues = z.infer<typeof CaseSchema>;

const initialData: CaseFormValues = {
  name: "",
  uniqueId: "",
  amount: "",
  isActive: true,
};

const CasePopupForm = () => {
  const { showToast } = useToast();

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(CaseSchema),
    defaultValues: initialData,
    mode: "all",
  });

  const onSubmit = (data: CaseFormValues) => {
    console.log("Submitted Data:", data);
    showToast("200", "Case Added Successfully", "Case Details saved");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogContent className="max-w-7xl min-w-[60vw] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-gray-50">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Case Details
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-4 py-4 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Basic Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormSelect
                    label="Name"
                    name="name"
                    form={form}
                    options={[
                      { label: "Case A", value: "caseA" },
                      { label: "Case B", value: "caseB" },
                    ]}
                    caption="Select Name"
                    required
                  />
                  <FormInput
                    label="Unique Id"
                    name="uniqueId"
                    form={form}
                    placeholder="Enter Unique Id"
                    required
                    type="text"
                  />
                  <FormInput
                    label="Amount"
                    name="amount"
                    form={form}
                    placeholder="Enter Amount"
                    required
                    type="number"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <FormSwitch label="Is Active" name="isActive" form={form} />
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  );
};

export default CasePopupForm;
