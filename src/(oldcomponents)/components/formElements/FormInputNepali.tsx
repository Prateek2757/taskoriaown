"use client";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import googleTransliterate from "react-nepali-typing";
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
	placeholder: string;
	form: UseFormReturn<T>;
	disabled?: boolean;
	required?: boolean;
};

function FormInputNepali<T extends FieldValues>({
	name,
	label,
	type,
	placeholder,
	form,
	disabled,
	required = false,
}: InputProps<T>) {
	const inputLanguage = "ne-t-i0-und";
	const maxResult = 1;

	function handleNepaliFont(inputValueEnglish: string, currentValue: string) {
		if (!inputValueEnglish.trim()) {
			return;
		}

		const request = new XMLHttpRequest();

		googleTransliterate(request, inputValueEnglish, inputLanguage, maxResult)
			.then((response: string[]) => {
				if (
					response.constructor === Array &&
					(response as string[]).length > 0
				) {
					let translatedText = "";
					for (const item of response) {
						if (item?.[0]) {
							translatedText = item[0];
						}
					}
					const words = currentValue.split(" ");
					words[words.length - 1] = translatedText;
					const newValue = `${words.join(" ")} `;

					form.setValue(name, newValue as any);
				}
			})
			.catch((error: string) => {
				console.error("Translation error:", error);
			});
	}

	const isMobileDevice = () => {
		return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			(isMobileDevice() && (e.code === "Space" || e.keyCode === 32)) ||
    		(!isMobileDevice() && (e.code === "Tab" || e.keyCode === 9))
		) {
			e.preventDefault();
			const currentValue = (e.target as HTMLInputElement).value;
			const words = currentValue.split(" ");
			const lastWord = words[words.length - 1];
			if (lastWord.trim()) {
				handleNepaliFont(lastWord.trim(), currentValue);
			} else {
				const newValue = `${currentValue} `;
				form.setValue(name, newValue as any);
			}
		}
	};

	return (
		<>
			<FormField
				control={form.control}
				name={name}
				render={({ field }) => (
					<FormItem>
						{label && (
							<FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
								{label}
								{required && <span className="text-red-500">*</span>}
								<small>
									{!!isMobileDevice? "(press Tab to convert to Nepali)" : "(press Space to convert to Nepali)"}
									
								</small>
							</FormLabel>
						)}
						<FormControl>
							<Input
								disabled={disabled}
								type={type}
								placeholder={placeholder}
								{...field}
								onKeyDown={handleKeyDown}
								value={field.value ?? ""}
							/>
						</FormControl>
						<FormMessage className="text-xs" />
					</FormItem>
				)}
			/>
		</>
	);
}

export default FormInputNepali;
