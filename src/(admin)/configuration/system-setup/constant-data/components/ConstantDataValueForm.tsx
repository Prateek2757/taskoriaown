"use client";

import React from "react";
import ConstantDataValue from "./ConstantDataValue";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

function ConstantDataValueForm() {
  const form = useForm();

  const handleAdd = () => {
    console.log("Add button clicked");
  };

  return (
    <FormProvider {...form}>
      <div>
        <ConstantDataValue form={form} />
        <Button type="button" onClick={handleAdd} className="bg-blue-600">
          Submit
        </Button>
      </div>
    </FormProvider>
  );
}

export default ConstantDataValueForm;
