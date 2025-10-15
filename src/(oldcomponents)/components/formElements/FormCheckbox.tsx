"use client";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

type InputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	form: UseFormReturn<T>;
	onCheckedChange?: (checked: boolean) => void;
};

function FormCheckbox<T extends FieldValues>({
	name,
	label,
	form,
	onCheckedChange,
}: InputProps<T>) {
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<>
					<FormItem key={name} className="flex flex-row items-start gap-2">
						<FormControl>
							<Checkbox
								checked={Boolean(field.value)}
								onCheckedChange={(checked) => {
									field.onChange(checked);
									if (typeof checked === "boolean") {
										onCheckedChange?.(checked);
									}
								}}
								id={name}
								className="mt-0.5"
							/>
						</FormControl>
						<FormLabel htmlFor={name} className="text-sm font-normal">
							{label}
						</FormLabel>
					</FormItem>
					{/* <FormMessage className="text-xs" /> */}
				</>
			)}
		/>
	);
}

export default FormCheckbox;
