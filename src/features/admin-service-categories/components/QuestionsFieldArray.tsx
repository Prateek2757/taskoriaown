"use client";

import { useFieldArray } from "react-hook-form";
import { GripVertical, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FIELD_TYPE_OPTIONS } from "../constants";
import { OptionsSubArray } from "./OptionsSubArray";

type QuestionsFieldArrayProps = {
  control: any;
  setValue: (name: string, value: any) => void;
  register: any;
};

export function QuestionsFieldArray({
  control,
  setValue,
  register,
}: QuestionsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <Card key={field.id} className="border py-3 border-dashed shadow-none">
          <CardHeader className=" px-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Question {index + 1}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <FormField
              control={control}
              name={`questions.${index}.question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Question text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. What type of property needs cleaning?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={control}
                name={`questions.${index}.field_type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Field type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FIELD_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`questions.${index}.is_required`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-xs">Required</FormLabel>
                    <FormControl>
                      <div className="flex items-center h-10">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <OptionsSubArray
              control={control}
              questionIndex={index}
              setValue={setValue}
              register={register}
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() =>
          append({
            question: "",
            field_type: "select",
            options: [],
            is_required: true,
            sort_order: fields.length + 1,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Add question
      </Button>
    </div>
  );
}
