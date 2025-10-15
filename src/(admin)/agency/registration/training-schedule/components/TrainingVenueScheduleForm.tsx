"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TrainingDetails from "./TraningDetails";
import {
  AddTrainingScheduleSchema,
  type AddTrainingFormDTO,
  emptyTrainingForm,
} from "../schemas/TraniningVenuScheduleSchemas";

type Props = {
  data?: AddTrainingFormDTO;
};

const isLoggedIn = true;

function TrainingVenueScheduleForm({ data }: Props) {
  const form = useForm<AddTrainingFormDTO>({
    defaultValues: data ?? emptyTrainingForm,
    resolver: zodResolver(AddTrainingScheduleSchema),
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const isEditMode = !!data;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          console.log(isEditMode ? "Updating..." : "Submitting...", values);
        })}
        className="space-y-4"
      >
        <TrainingDetails
          form={form}
          isLoggedIn={isLoggedIn}
          isEditMode={isEditMode}
          data={{
            photoFileUrl: data?.photoFileUrl,
            photoFileName: data?.photoFileName,
          }}
        />

        <button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700
                                text-white text-sm py-2 px-6 rounded-md flex
                                items-center"
        >
          {isEditMode ? "Update" : "Submit"}
        </button>
      </form>
    </FormProvider>
  );
}

export default TrainingVenueScheduleForm;
