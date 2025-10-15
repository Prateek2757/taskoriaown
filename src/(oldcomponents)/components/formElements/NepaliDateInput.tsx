"use client";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import {
	Controller,
	type Path,
	type FieldValues,
	type UseFormReturn,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	type: string;
	placeholder: string;
	form: UseFormReturn<T>;
	onChange?: (date: string) => void;
};

function NepaliDateInput<T extends FieldValues>({
	name,
	label,
	form,
	onChange,
}: InputProps<T>) {
	return (
		<Controller
				control={form.control}
				name={name}
				render={({ field }) => (
					<>
						{label && (
							<label
								htmlFor={name}
								className="flex items-center text-gray-700 text-sm"
							>
								{label}
							</label>
						)}
						<NepaliDatePicker
							options={{
								calenderLocale: "en",
								valueLocale: "en",
							}}
							className="pr-0 z-50 h-9 text-sm w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
							value={field.value}
							onChange={(date: string) => {
								field.onChange(date);
								onChange?.(date);
							}}
						/>
					</>
				)}
			/>
	);
}

export default NepaliDateInput;
