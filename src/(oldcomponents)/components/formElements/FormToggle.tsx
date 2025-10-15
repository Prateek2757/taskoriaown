import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox"; // Make sure this path is correct
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface FormToggleProps {
  label?: string;
  form: UseFormReturn<any>;
  name: string;
  disable?: boolean;
  required?: boolean;
}

export function FormToggle({
  label,
  form,
  name,
  disable = false,
  required = false,
}: FormToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex items-center gap-4 p-3 font-bold rounded-md w-full">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={field.onChange}
                disabled={disable}
              />
            </FormControl>
            {label && (
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-white">
                {label}
                {required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
