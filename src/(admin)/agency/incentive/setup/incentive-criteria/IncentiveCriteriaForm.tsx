"use client";

import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/formElements/FormInput";
import FormInputFile from "@/components/formElements/FormInputFile";
import { Button } from "@/components/ui/button";
import {
  agentIncentiveSchema,
  AgentIncentiveFormDTO,
  emptyAgentIncentiveForm,
} from "../schemas/addSchemeSchema";
import { Plus, Trash } from "lucide-react";
import { FormSwitch } from "@/components/formElements/FormSwitch";
import DateConverter from "@/components/uiComponents/date-converter/date-converter";

export default function AgentIncentiveForm({
  onSubmit,
  initialValues,
}: {
  onSubmit: (data: AgentIncentiveFormDTO) => void;
  initialValues?: AgentIncentiveFormDTO;
}) {
  const form = useForm<AgentIncentiveFormDTO>({
    resolver: zodResolver(agentIncentiveSchema),
    defaultValues: initialValues || emptyAgentIncentiveForm,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "incentiveCriteria",
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-md bg-white"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Agent Incentive Criteria
        </h2>
        <div className="border border-dashed border-blue-400 bg-white rounded-lg p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <FormInput
              form={form}
              name="fiscalYear"
              label="Fiscal Year"
              readOnly
            />
            <FormInput form={form} name="month" label="Month" readOnly />
            <FormInput
              form={form}
              name="schemeName"
              label="Scheme Name"
              readOnly
            />

            <FormInput
              form={form}
              name="schemeFor"
              label="Scheme For"
              readOnly
            />
           <DateConverter
            form={form}
            name="businessFrom"
            labelEng="Business From"
            labelNep="Business From"
          />
           <DateConverter
            form={form}
            name="businessTo"
            labelEng="Business To"
            labelNep="Business To"
          />

            <FormInput
              form={form}
              name="singlePremiumPercentage"
              label="Single Premium Percentage"
              placeholder="Enter Single Premium Percentage"
              required
            />
            <FormInput
              form={form}
              name="termPremiumPercentage"
              label="Term Premium Percentage"
              placeholder="Term Premium Percentage"
            />
            <FormInput
              form={form}
              name="excludePremium"
              label="Exclude Premium"
              placeholder="Exclude Premium"
            />

            <FormInput
              form={form}
              name="maximumPremium"
              label="Maximum Premium"
              placeholder="Maximum Premium"
              required
            />
            <FormInput
              form={form}
              name="premiumSlab"
              label="Premium Slab"
              placeholder="Premium Slab"
              required
            />
            <FormInput
              form={form}
              name="additionalIncentive"
              label="Additional Incentive"
              placeholder="Additional Incentive"
              required
            />

            <FormInputFile
              form={form}
              name="document"
              label="Document"
              accept=".pdf,.jpg,.png"
              maxSize={5}
              validTypes={["application/pdf", "image/jpeg", "image/png"]}
              required
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Incentive Criteria</h2>
        <div className="overflow-x-auto rounded">
          <table className="min-w-full border rounded-xl">
            <thead className=" text-black border-b">
              <tr>
                <th className="p-2">SN</th>
                <th className="p-2">Min Premium</th>
                <th className="p-2">Max Premium</th>
                <th className="p-2">Equivalent Item</th>
                <th className="p-2">Incentive</th>
                <th className="p-2">
                  <Button
                    type="button"
                    onClick={() =>
                      append({
                        minPremium: "",
                        maxPremium: "",
                        equivalentItem: "",
                        incentive: "",
                      })
                    }
                    className="bg-gray-50 text-black"
                  >
                    <Plus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b mt-5 border-gray-200">
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2">
                    <FormInput
                      form={form}
                      type= "number"
                      name={`incentiveCriteria.${index}.minPremium`}
                      placeholder="Min. Premium"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <FormInput
                      form={form}
                      type="number"
                      name={`incentiveCriteria.${index}.maxPremium`}
                      placeholder="Max. Premium"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <FormInput
                      form={form}
                      type= "number"
                      name={`incentiveCriteria.${index}.equivalentItem`}
                      placeholder="Equivalent Item"
                    />
                  </td>
                  <td className="p-2">
                    <FormInput
                      form={form}
                      type="number"
                      name={`incentiveCriteria.${index}.incentive`}
                      placeholder="Incentive Amount"
                      required
                    />
                  </td>
                  <td className="p-2 text-center">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Trash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 items-center">
          <FormInput
            form={form}
            name="remarks"
            label="Remarks"
            placeholder="Enter Remarks"
            textarea
          />
          <FormSwitch form={form} name="isActive" label="Is Active" />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
