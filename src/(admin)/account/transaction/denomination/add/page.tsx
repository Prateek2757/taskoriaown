"use client";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import {
  type SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Calculator } from "lucide-react";
import {
  DenominationSchema,
  DenominationSchemaDTO,
  emptyDenomination,
} from "../../../Schema/DemoninationSchema";
import FormInput from "@/components/formElements/FormInput";

const DenominationForm = () => {
  const form = useForm<DenominationSchemaDTO>({
    resolver: zodResolver(DenominationSchema),
    mode: "onChange",
    defaultValues: emptyDenomination,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "denominations",
  });

  const [total, setTotal] = useState(0);

  // Calculate total whenever denominations change
  const calculateTotal = () => {
    const denominations = form.getValues("denominations");
    const totalAmount = denominations.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    setTotal(totalAmount);
  };

  // Update amount when numberOfNotes changes
  const updateAmount = (index: number, numberOfNotes: number) => {
    const denomination = form.getValues(`denominations.${index}.denomination`);
    const amount = denomination * numberOfNotes;
    form.setValue(`denominations.${index}.amount`, amount);
    form.setValue(`denominations.${index}.numberOfNotes`, numberOfNotes);
    calculateTotal();
  };

  // Watch for changes in form values
  useEffect(() => {
    const subscription = form.watch(() => {
      calculateTotal();
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit: SubmitHandler<DenominationSchemaDTO> = (data) => {
    console.log("Denomination Data:", data);
  };

  const addDenomination = () => {
    append({ denomination: 0, numberOfNotes: 0, amount: 0 });
  };

  return (
    <div className="bg-white rounded-lg border mb-6 mt-4">
      <div className="rounded-t-2xl">
        <Card className="w-full rounded-t-2xl py-0">
          <CardHeader className="bg-blue-400 rounded-t-2xl text-white">
            <CardTitle className="text-xl rounded-t-2xl font-bold">Denomination</CardTitle>
          </CardHeader>
          <CardContent className="p-6 rounded-t-2xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date: 2025-09-08</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="todayCollection">
                      Today Collection: 120023
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousDayCollection">
                      Previous Day Collection: 120023
                    </Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormInput
                      name={"bankDeposited"}
                      type={"text"}
                      label={"Bank Deposited"}
                      placeholder={"Enter Bank Deposited"}
                      form={form}
                    />
                  </div>
                  <div className="space-y-2">
                    <FormInput
                      name={"cashDenomination"}
                      type={"text"}
                      label={"Cash Denomination"}
                      placeholder={"Enter Cash Denomination"}
                      form={form}
                    />
                  </div>
                </div>

                {/* Denomination Table */}
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Table Header */}
                      <div className="grid grid-cols-4 bg-blue-400 text-white font-semibold p-2 rounded-t-md">
                        <div className="text-center">Denomination</div>
                        <div className="text-center">No. of Note</div>
                        <div className="text-center">Amounts</div>
                        <div className="text-center">Action</div>
                      </div>

                      {/* Table Rows */}
                      <div className="border border-t-0 rounded-b-md">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="grid grid-cols-4 border-b last:border-b-0 hover:bg-gray-50"
                          >
                            <div className="p-3 flex items-center justify-center font-medium">
                              {field.denomination}
                            </div>

                            <div className="p-3 flex items-center justify-center">
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentValue = form.getValues(
                                      `denominations.${index}.numberOfNotes`
                                    );
                                    if (currentValue > 0) {
                                      updateAmount(index, currentValue - 1);
                                    }
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
                                >
                                  -
                                </button>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  min="0"
                                  {...form.register(
                                    `denominations.${index}.numberOfNotes`,
                                    {
                                      valueAsNumber: true,
                                      onChange: (e) =>
                                        updateAmount(
                                          index,
                                          parseInt(e.target.value) || 0
                                        ),
                                    }
                                  )}
                                  className="w-16 text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const currentValue = form.getValues(
                                      `denominations.${index}.numberOfNotes`
                                    );
                                    updateAmount(index, currentValue + 1);
                                  }}
                                  className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="p-3 flex items-center justify-center">
                              <div className="flex items-center space-x-2">
                                <span>=</span>
                                <Input
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  {...form.register(
                                    `denominations.${index}.amount`,
                                    {
                                      valueAsNumber: true,
                                    }
                                  )}
                                  className="w-20 text-center bg-gray-50"
                                  readOnly
                                />
                              </div>
                            </div>

                            <div className="p-3 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Total Row */}
                        <div className="grid grid-cols-4 bg-gray-100 border-t-2 border-gray-300 font-semibold">
                          <div className="p-3"></div>
                          <div className="p-3"></div>
                          <div className="p-3 text-center">
                            Total: {total.toLocaleString()}
                          </div>
                          <div className="p-3"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Denomination Button */}
                  <Button
                    type="button"
                    onClick={addDenomination}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Denomination
                  </Button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start space-x-4 pt-4">
                 
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    <Calculator size={16} className="mr-2" />
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DenominationForm;
