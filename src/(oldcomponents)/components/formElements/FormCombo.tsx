import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type SelectOption = {
  saExtraRate?: string;
  value: string;
  text: string;
};

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  onChange?: (e: { target: { name: string; value: string } }) => void;
  options: SelectOption[] | undefined;
  label?: string;
  form: UseFormReturn<T>;
  required?: boolean;
  disabled?: boolean;
  language?: "en" | "ne";
  onSearch?: (value: string) => Promise<void>;
};

function FormCombo<T extends FieldValues>({
  name,
  onChange,
  options,
  label,
  form,
  required = false,
  disabled = false,
  language,
  onSearch,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <FormLabel className="flex items-center text-gray-700 dark:text-white text-sm">
              {label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  // biome-ignore lint/a11y/useSemanticElements: <explanation>
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                    fieldState.error && "border-red-500 focus:border-red-500"
                  )}
                  disabled={disabled}
                >
                  {field.value
                    ? options?.find((option) => option.value === field.value)
                        ?.text
                    : `Select ${label}`}
                  <div className="flex items-center gap-1">
                    {field.value && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange("");
                          onChange?.({ target: { name, value: "" } });
                        }}
                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                      >
                        ✕
                      </span>
                    )}
                    <ChevronsUpDown className="opacity-50" />
                  </div>{" "}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[--radix-popover-trigger-width] min-w-[var(--radix-popover-trigger-width)]">
              <Command>
                <CommandInput
                  placeholder={`Search ${label}`}
                  className="h-9"
                  onValueChange={(value) => {
                    onSearch?.(value);
                  }}
                />
                <CommandList>
                  <CommandEmpty>No {label} found.</CommandEmpty>
                  <CommandGroup>
                    {/* <CommandItem
                      key="__clear"
                      value="__clear"
                      onSelect={() => {
                        field.onChange("");
                        if (onChange) {
                          onChange({
                            target: { name, value: "" },
                          });
                        }
                        setOpen(false);
                        form.clearErrors(name);
                      }}
                    >
                      Clear selection
                    </CommandItem> */}
                    {options?.map((option) => (
                      <CommandItem
                        value={option.text}
                        key={option.value}
                        onSelect={() => {
                          field.onChange(option.value);

                          if (onChange) {
                            onChange({
                              target: {
                                name,
                                value: option.value,
                                dataValue: option.saExtraRate,
                              },
                            });
                          }

                          setOpen(false);

                          form.clearErrors(name);
                        }}
                      >
                        {option.text}
                        <Check
                          className={cn(
                            "ml-auto",
                            option.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}

export default FormCombo;
