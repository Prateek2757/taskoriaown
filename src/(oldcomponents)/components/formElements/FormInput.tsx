"use client";
import { useEffect } from "react";
import type {
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type InputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	type: string;
	placeholder?: string;
	form: UseFormReturn<T>;
	disabled?: boolean;
	required?: boolean;
	value?: PathValue<T, Path<T>>;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	maxLength?: number;
};

function FormInput<T extends FieldValues>({
	name,
	label,
	type,
	placeholder,
	form,
	disabled,
	required = false,
	value,
	onKeyDown,
	maxLength,
}: InputProps<T>) {
	useEffect(() => {
		if (value !== undefined) {
			form.setValue(name, value);
		}
	}, [form, name, value]);
	return (
		<FormField
			control={form.control}
			name={name}
			
			render={({ field }) => (
				<FormItem>
					{label && (
						<FormLabel suppressHydrationWarning className="flex items-center text-gray-700 dark:text-white text-sm">
							{label}
							{required && <span className="text-red-500">*</span>}
						</FormLabel>
					)}
					<FormControl>
						<Input
							className="text-[14px]"
							disabled={disabled}
							type={type}
							placeholder={placeholder}
							{...field}
							value={field.value ?? ""}
							onKeyDown={onKeyDown}
							maxLength={maxLength}
						/>
					</FormControl>
					<FormMessage className="text-xs" />
				</FormItem>
			)}
		/>
	);
}

export default FormInput;
