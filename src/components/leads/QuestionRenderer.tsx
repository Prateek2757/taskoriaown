"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import CalendarInput from "../CalenderInput";

export default function QuestionRenderer({ q, control, register }: any) {
  const name = `q_${q.category_question_id}`;

  const isMultiCheckbox = q.field_type === "checkbox" && Array.isArray(q.options);

  return (
    <motion.div
      key={q.category_question_id}
      initial={{ x: 100, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -100, opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: [0.25, 0.8, 0.25, 1] }}
      className="space-y-"
    >
      <Label className="block text-lg font-semibold text-center pb-2 text-gray-900 dark:text-white">
        {q.question}
      </Label>

      {q.field_type === "textarea" && (
        <Textarea
          {...register(name)}
          placeholder="Type your answer..."
          className="border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      )}

      {(q.field_type === "text" || q.field_type === "input") && (
        <Input
          {...register(name)}
          placeholder="Type your answer..."
          className="border-gray-300 dark:border-gray-700 rounded-xl  focus:ring-2 focus:ring-blue-500"
        />
      )}

      {q.field_type === "number" && (
        <Input
          type="number"
          {...register(name)}
          placeholder="Enter a number..."
          className="border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      )}

     {q.field_type === "date" && (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <CalendarInput
        
        value={field.value ? new Date(field.value) : undefined}
        minDate={new Date()}  
        onChange={(d) => field.onChange(d)}
      />
    )}
  />
)}

      {!isMultiCheckbox && q.field_type === "checkbox" && (
        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
            )}
          />
          <span className="text-gray-800 dark:text-gray-100">{q.question}</span>
        </div>
      )}

      {isMultiCheckbox && (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const valueArray: string[] = field.value || [];
            return (
              <div className="flex flex-col gap-2">
                {(q.options ?? []).map((opt: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox
                      checked={valueArray.includes(opt)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...valueArray, opt]);
                        } else {
                          field.onChange(valueArray.filter((v) => v !== opt));
                        }
                      }}
                    />
                    <span className="text-gray-800 dark:text-gray-100">{opt}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
      )}

      {(q.field_type === "select" || q.field_type === "radio") && !isMultiCheckbox && (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <div className="space-y-3">
              {(q.options ?? []).map((opt: string, i: number) => (
                <div
                  key={i}
                  onClick={() => field.onChange(opt)}
                  className={cn(
                    "flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 shadow-sm",
                    "hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800",
                    field.value === opt
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition",
                      field.value === opt ? "border-blue-600" : "border-gray-400"
                    )}
                  >
                    {field.value === opt && (
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-800 dark:text-gray-100 font-medium">
                    {opt}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
      )}
    </motion.div>
  );
}