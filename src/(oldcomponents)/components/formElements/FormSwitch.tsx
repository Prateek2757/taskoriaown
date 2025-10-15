import type { UseFormReturn } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface CustomSwitchProps {
  label?: string;
  form: UseFormReturn<any>;
  name: string;
  disable?: boolean;
  required?: boolean;
  defaultChecked?: boolean;
}
export function FormSwitch({
  label,
  form,
  name,
  disable = false,
  required = false,
}: CustomSwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex flex-col items-start justify-between rounded-lg  p-3 ">
            {label && (
              <div className="space-y-0.5">
                <FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
                  {label}
                  {required && <span className="text-red-500">*</span>}
                </FormLabel>
              </div>
            )}
            <FormControl>
              <Switch
                checked={field.value}
                disabled={disable}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
