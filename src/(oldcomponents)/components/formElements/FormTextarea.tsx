'use client';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

type InputProps<T extends FieldValues> = {
    name: Path<T>;
    label?: string;
    placeholder: string;
    form: UseFormReturn<T>;
    disabled?: boolean;
    required?: boolean;
};

function FormTextarea<T extends FieldValues>({
    name,
    label,
    placeholder,
    form,
    disabled,
    required = false,
}: InputProps<T>) {
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
                                {required && (
                                    <span className="text-red-500">*</span>
                                )}
                            </FormLabel>
                        )}
                        <FormControl>
                            <Textarea
                                className="text-[14px]"
                                disabled={disabled}
                                placeholder={placeholder}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem>
                )}
            />
        </>
    );
}

export default FormTextarea;
