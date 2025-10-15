"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Form } from "@/components/ui/form";

import {
  hierarchyformSchema,
  type HierarchyFormDTO,
  emptyHierarchyForm,
} from "@/app/(admin)/agency/hierarchy/position-type/schemas/hierarchyformSchema";

export default function EditHierarchyForm({
  defaultValues,
}: {
  defaultValues?: Partial<HierarchyFormDTO>;
}) {
  const form = useForm<HierarchyFormDTO>({
    resolver: zodResolver(hierarchyformSchema),
    defaultValues: defaultValues || emptyHierarchyForm,
  });

  const onSubmit = (data: HierarchyFormDTO) => {
    console.log("✅ Updated Hierarchy:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 bg-white rounded-lg border mb-6 mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Position Type Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">
                Fiscal Year <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="fiscalYear"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white border border-gray-300 text-sm">
                      <SelectValue placeholder="Select Fiscal Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.fiscalYear && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.fiscalYear.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-gray-600">
                Position Type <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                placeholder="Enter Position Type"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                {...form.register("positionType")}
              />
              {form.formState.errors.positionType && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.positionType.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-gray-600">
                Position Description <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                placeholder="Enter Position Description"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                {...form.register("positionDescription")}
              />
              {form.formState.errors.positionDescription && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.positionDescription.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Label className="flex items-center text-gray-700 text-sm">
              Remarks
            </Label>
            <Textarea
              placeholder="Enter Remarks"
              className="bg-white border border-gray-300 text-sm w-full"
              {...form.register("remarks")}
            />
            {form.formState.errors.remarks && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.remarks.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Label className="text-sm text-gray-600">Is Active</Label>
            <Controller
              name="isActive"
              control={form.control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </form>
      <div className="flex justify-start  -mt-6">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
        >
          Add Agent Position
        </Button>
      </div>
    </Form>
  );
}
