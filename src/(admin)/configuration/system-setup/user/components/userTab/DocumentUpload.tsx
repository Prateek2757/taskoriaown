"use client";

import type { UseFormReturn } from "react-hook-form";
import FormInputFile from "@/components/formElements/FormInputFile";

type UploadPictureFormProps<T> = {
  form: UseFormReturn<T>;
  data?: {
    photoFileUrl?: string;
    photoFileName?: string;
  };
};

export default function UploadPictureForm<T>({
  form,
  data,
}: UploadPictureFormProps<T>) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Upload Picture</h2>

      <div className="border-blue-200 rounded-lg pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormInputFile
            name="profilePicture"
            label="Photo"
            form={form}
            fileNameField="photoFileName"
            accept=".png,.jpg,.jpeg,.pdf"
            maxSize={5}
            validTypes={["image/png", "image/jpeg", "image/pdf"]}
            {...(data?.photoFileUrl && {
              editMode: true,
              initialImageUrl: data.photoFileUrl,
              initialFileName: data.photoFileName,
            })}
            required={true}
          />
        </div>
      </div>
    </>
  );
}
