"use client";

import { useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

type FaqsFieldArrayProps = {
  control: any;
};

export function FaqsFieldArray({ control }: FaqsFieldArrayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faqs",
  });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <Card key={field.id} className="border py-3 border-dashed shadow-none">
          <CardHeader className="py-0 px-4 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              FAQ {index + 1}
            </span>
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
              name={`faqs.${index}.question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Question</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="What is included in..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`faqs.${index}.answer`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      placeholder="The service usually covers..."
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => append({ question: "", answer: "" })}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add FAQ
      </Button>
    </div>
  );
}
