"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddEditTemplateSchema,
  emptyTemplate,
  AddEditTemplateDTO,
} from "../schemas/templateSchemas";

import TemplateSetup from "./TemplateSetup";

export default function TemplateForm() {
  const form = useForm<AddEditTemplateDTO>({
    resolver: zodResolver(AddEditTemplateSchema),
    defaultValues: emptyTemplate,
  });

  const handleSubmit = (data: AddEditTemplateDTO) => {
    console.log("Form Submitted", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <TemplateSetup form={form} />
      </form>
    </FormProvider>
  );
}
