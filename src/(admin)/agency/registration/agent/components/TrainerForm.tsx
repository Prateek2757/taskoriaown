"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import AddressDetails from "./AddressDetails";
import {
  AddEditTrainerDTO,
  AddEditTrainerSchema,
} from "../schemas/trainerSchema";
type TrainerFormProps = {
  onSubmit: (data: AddEditTrainerDTO) => void;
  defaultValues?: AddEditTrainerDTO;
  isEditMode?: boolean;
};

export default function TrainerForm({
  onSubmit,
  defaultValues,
  isEditMode = false,
}: TrainerFormProps) {
  const form = useForm<AddEditTrainerDTO>({
    resolver: zodResolver(AddEditTrainerSchema),
    defaultValues: defaultValues || {},
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className=" p-3 mt-3 bg-white rounded-lg border-1 mb-3 space-y-4">
          <PersonalDetails form={form} />
          <AddressDetails form={form} />
          <ContactDetails form={form} />
        </div>
      </form>
      <div className="flex text-start">
        <Button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-md flex items-center"
        >
          {isEditMode ? "Update Trainer" : "Create Trainer"}
        </Button>
      </div>
    </FormProvider>
  );
}
