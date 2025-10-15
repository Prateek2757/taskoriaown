import { convertADToBS, convertBSToAD } from "date-picker-np";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import FormInputDate from "@/components/formElements/FormInputDate";
import FormInputDateNepali from "@/components/formElements/FormInputDateNepali";

type DateConverterProps<T extends NonNullable<FieldValues>> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  labelNep: string;
  labelEng: string;
  disabled?: boolean;
};

function DateConverter<T extends FieldValues>({
  form,
  name,
  labelNep,
  labelEng,
  disabled = false,
}: DateConverterProps<T>) {
  const formTyped = form as UseFormReturn<FieldValues>;

  const handleDateChange = (value: string, source: "nepali" | "english") => {
    if (source === "nepali") {
      const adDate = convertBSToAD(value);
      form.setValue(name, adDate);
      form.setValue(`${name}Local`, value);
      console.log(adDate);
    } else {
      const bsDate = convertADToBS(value);
      form.setValue(name, value);
      form.setValue(`${name}Local`, bsDate);
    }
  };
  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor={`${name}Local`}
          className="flex items-center text-gray-700 text-sm font-medium"
        >
          {labelNep}
          <span className="text-red-500 ml-2">*</span>
        </label>
        <div className="relative w-full">
          <FormInputDateNepali
            form={formTyped}
            name={`${name}Local`}
            onChange={(value) => handleDateChange(value, "nepali")}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative ">
          <FormInputDate
            name={name}
            label={labelEng}
            form={formTyped}
            onChange={(value) => handleDateChange(value, "english")}
            required={true}
            disabled={disabled}
            futureDate={false}
          />
        </div>
      </div>
    </>
  );
}

export default DateConverter;
