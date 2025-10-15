"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type {
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

type InputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	type?: string;
	placeholder?: string;
	form: UseFormReturn<T>;
	onChange?: (date: string) => void;
	required?: boolean;
	disabled?: boolean;
	futureDate?: boolean;
};

function FormInputDate<T extends FieldValues>({
	name,
	label,
	placeholder = "YYYY-MM-DD",
	form,
	onChange,
	required = false,
	disabled = false,
	futureDate = false,
}: InputProps<T>) {
	const [open, setOpen] = useState(false);
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				let parsedDate: Date | null = null;

				let displayValue = "";

				if (typeof field.value === "string") {
					displayValue = field.value;
					const d = parseISO(field.value);
					parsedDate = isValid(d) ? d : null;
				} else if (
					(field.value as unknown) instanceof Date &&
					isValid(field.value)
				) {
					parsedDate = field.value;
					displayValue = format(field.value, "yyyy-MM-dd");
				}

				// const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
				// 	const value = e.target.value;
				// 	field.onChange(value);

				// 	const date = parseISO(value);
				// 	if (isValid(date)) {
				// 		form.setValue(name, value as PathValue<T, typeof name>);
				// 		form.trigger(name);
				// 		onChange?.(value);
				// 	}
				// };

				const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
					const raw = e.target.value;

					const isDeleting = raw.length < (field.value?.length || 0);

					let value = raw.replace(/\D/g, "");

					if (!isDeleting) {
						if (value.length > 3)
							value = `${value.slice(0, 4)}-${value.slice(4)}`;
						if (value.length > 6)
							value = `${value.slice(0, 7)}-${value.slice(7)}`;
					} else {
						value = raw;
					}

					field.onChange(value);

					const date = parseISO(value);
					if (isValid(date)) {
						form.setValue(name, value as PathValue<T, typeof name>);
						form.trigger(name);
						onChange?.(value);
					}
				};

				const handleDateSelect = (date: Date | undefined) => {
					if (!date) return;

					const dateValue = format(date, "yyyy-MM-dd");
					form.setValue(name, dateValue as PathValue<T, typeof name>);
					form.trigger(name);
					field.onChange(dateValue);
					onChange?.(dateValue);
					setOpen(false);
				};

				return (
					<FormItem className="flex flex-col">
						{label && (
							<FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
								{label}
								{required && <span className="text-red-500">*</span>}
							</FormLabel>
						)}
						<Popover modal={false} open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild className="pointer-events-auto">
								<FormControl>
									<div className="relative">
										<Input
											placeholder={placeholder}
											value={displayValue}
											onChange={handleInputChange}
											disabled={disabled}
											className="pr-10"
										/>
										<CalendarIcon
											className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 cursor-pointer"
											onClick={() => setOpen(!open)}
										/>
									</div>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent
								className="w-auto p-0 z-[999999] pointer-events-auto"
								align="start"
							>
								<Calendar
									mode="single"
									className="pointer-events-auto"
									selected={parsedDate || undefined}
									onSelect={handleDateSelect}
									disabled={
										!futureDate
											? (date) =>
													date > new Date() || date < new Date("1900-01-01")
											: undefined
									}
									captionLayout="dropdown"
									defaultMonth={parsedDate || undefined}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						<FormMessage className="text-xs" />
					</FormItem>
				);
			}}
		/>
	);
}

export default FormInputDate;
