"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import axios from "axios";
import { ProviderResponse } from "@/types";
import { toast } from "sonner";
import { mutate } from "swr";
interface EstimateModalProps {
  open: boolean;
  onClose: () => void;
  response: ProviderResponse;
}
type EstimateForm = {
  price: string; 
 message: string;
  unit: string;
};
export default function EstimateModal({
  open,
  onClose,
  response,
}: EstimateModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPricingType, setShowPricingType] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EstimateForm>({
    defaultValues: {
      price: "",
      message: "",
      unit: "one off fee",
    },
  });
  const unit = watch("unit");
  const estimateUnits = [
    "one off fee",
    "per hour",
    "per visit",
    "per session",
    "per head",
    "per day",
    "per week",
    "per month",
  ];

  const onSubmit = async (data: EstimateForm) => {
    setLoading(true);

    try {
      const res = await axios.post("/api/provider_estimates", {
        task_id: response.task_id,
        customer_email: response.customer_email,
        customer_name: response.customer_name,
        task_title: response.category_name,
        price: data.price,
        unit: data.unit,
        message: data.message,
        professional_name: response.professional_name,
        professional_company_name: response.professional_company_name,
        professional_phone: response.professional_contact_number,
      });
      mutate(`/api/provider_estimates?task_id=${response.task_id}`);
      if (res.data.success) {
        reset();
        setShowPricingType(false);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-md  rounded-xl flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <DialogTitle>Send an estimate</DialogTitle>
        </DialogHeader>
        <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col flex-1 min-h-0"
    >
        <div className="flex-1 overflow-y-auto px-1 space-y-4 min-h-0">
          <p className="text-sm text-gray-500">
            Enter a guide price and some notes to explain your charges
          </p>

          <Input
            type="number"
            placeholder="Enter price (A$)"
            {...register("price", { required: "Price is required" })}
          />

          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}

          <div className="relative">
            <p className="text-sm font-medium mb-2">Pricing Type</p>

            <Button
              type="button"
              onClick={() => setShowPricingType((prev) => !prev)}
              className="w-full flex items-center justify-between border text-gray-800 rounded-lg px-4 py-3 text-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
            >
              <span className="capitalize">{unit}</span>
              {showPricingType ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </Button>

            {showPricingType && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border rounded-xl shadow-lg overflow-hidden">
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setShowPricingType(false);
                      }}
                      className="max-h-52 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800"
                    >
                      {estimateUnits.map((item) => (
                        <Label
                          key={item}
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                unit === item
                                  ? "border-black dark:border-white bg-black dark:bg-white"
                                  : "border-gray-300 dark:border-gray-600"
                              }`}
                            >
                              {unit === item && (
                                <Check className="w-2.5 h-2.5 text-white dark:text-black" />
                              )}
                            </span>
                            <span className="text-sm capitalize">{item}</span>
                          </div>

                          <RadioGroupItem
                            value={item}
                            className="sr-only"
                            onClick={() => field.onChange(item)}
                          />
                        </Label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
            )}
          </div>

          {showPricingType && <div className="h-52" />}

          <Textarea
            placeholder="Any additional details?"
            {...register("message")}
            rows={3}
          />
        </div>

        <div className="shrink-0 pt-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send estimate"}
          </Button>
        </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
