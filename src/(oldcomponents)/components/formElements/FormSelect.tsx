import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

type SelectProps<T extends FieldValues> = {
	name: Path<T>;
	options: SelectOption[] | undefined;
	caption?: string;
	label?: string;
	form: UseFormReturn<T>;
	required?: boolean;
};

function FormSelect<T extends FieldValues>({
	name,
	options,
	caption,
	label,
	form,
	required = false,
}: SelectProps<T>) {
	return (
		<FormField
			name={name}
			control={form.control}
			render={({ field }) => (
				<FormItem>
					{label && (
						<FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
							{label}
							{required && <span className="text-red-500">*</span>}
						</FormLabel>
					)}
					<Select value={field.value} onValueChange={field.onChange}>
						<FormControl>
							<SelectTrigger className="w-full min-w-[calc(100%-105px)]">
								<SelectValue placeholder={caption || "Select Option"} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options?.map((option) => (
								<SelectItem value={option.value} key={option.value}>
									{option.text}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage className="text-xs" />
				</FormItem>
			)}
		/>
	);
}

export default FormSelect;
