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
import DateConverter from "@/components/uiComponents/date-converter/date-converter";
import { AgentPositionDTO, agentPositionSchema, emptyAgentPosition } from "../schemas/agentPositionSchema";


export default function AddAgentPosition() {
  const form = useForm<AgentPositionDTO>({
    resolver: zodResolver(agentPositionSchema),
    defaultValues: emptyAgentPosition,
  });

  const onSubmit = (data: AgentPositionDTO) => {
    console.log(" Submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="p-6 bg-white rounded-lg border mb-6 mt-4 ">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Agent Position Details
          </h2>

          <div className="border border-dashed border-gray-300 rounded-md px-6 py-4 text-sm mb-6">
            <div className="grid grid-cols-3 gap-y-4 gap-x-8">
              <div>
                <span className="text-gray-600">Agent Code: </span>
                <span className="font-semibold">05001240</span>
              </div>
              <div>
                <span className="text-gray-600">Qualified For: </span>
                <span className="font-semibold">BD</span>
              </div>
              <div>
                <span className="text-gray-600">Qualified Date: </span>
                <span className="font-semibold">2025-08-27</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DateConverter
              form={form}
              name="effectiveFrom"
              labelNep="Effective From (BS)"
              labelEng="Effective From (AD)"
            />
            <DateConverter
              form={form}
              name="effectiveTo"
              labelNep="Effective To (BS)"
              labelEng="Effective To (AD)"
            />
            <DateConverter
              form={form}
              name="promotedDate"
              labelNep="Promoted Date (BS)"
              labelEng="Promoted Date (AD)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">
                Parent Code <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="parentCode"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-white border border-gray-300 text-sm">
                      <SelectValue placeholder="Select Parent Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="001">001</SelectItem>
                      <SelectItem value="002">002</SelectItem>
                      <SelectItem value="003">003</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.parentCode && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.parentCode.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
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

            <div></div>
          </div>

          <div className="mb-6">
            <Label className="flex items-center text-gray-700 mb-2  text-sm">
              Remarks
            </Label>
            <Controller
              name="remarks"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  placeholder="Enter Remarks"
                  className="bg-white-50 border border-gray-200 text-sm w-full"
                  {...field}
                />
              )}
            />
            {form.formState.errors.remarks && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.remarks.message}
              </p>
            )}
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
