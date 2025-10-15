"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

export default function FormTimePicker({
  form,
  name,
  label,
  required,
  placeholder,
}: Props) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <Controller
        control={form.control}
        name={name}
        rules={{ required }}
        render={({ field }) => (
          <DatePicker
            selected={field.value}
            onChange={field.onChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}               
            timeCaption="Time"
            dateFormat="h:mm aa"              
            placeholderText={placeholder || "Select time"}
            className="
              w-full
              rounded-md
              border
              border-gray-300
              px-3
              py-2
              text-sm
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-gray-300
              focus:border-gray-300
            "
          />
        )}
      />

      {form.formState.errors[name] && (
        <span className="text-xs text-red-500">This field is required</span>
      )}
    </div>
  );
}
