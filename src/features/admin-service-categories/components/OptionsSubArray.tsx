"use client";

import { useWatch } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OptionsSubArrayProps = {
  control: any;
  questionIndex: number;
  register: any;
  setValue: (name: string, value: string[]) => void;
};

export function OptionsSubArray({
  control,
  questionIndex,
  register,
  setValue,
}: OptionsSubArrayProps) {
  const options: string[] =
    useWatch({ control, name: `questions.${questionIndex}.options` }) ?? [];

  function removeOption(index: number) {
    setValue(
      `questions.${questionIndex}.options`,
      options.filter((_, optionIndex) => optionIndex !== index)
    );
  }

  function addOption() {
    setValue(`questions.${questionIndex}.options`, [...options, ""]);
  }

  return (
    <div>
      <p className="text-xs font-medium mb-1.5 text-muted-foreground">
        Options
      </p>
      <div className="space-y-1.5">
        {options.map((_, optionIndex) => (
          <div key={optionIndex} className="flex gap-2">
            <Input
              {...register(`questions.${questionIndex}.options.${optionIndex}`)}
              placeholder={`Option ${optionIndex + 1}`}
              className="h-8 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeOption(optionIndex)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-primary"
          onClick={addOption}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add option
        </Button>
      </div>
    </div>
  );
}
