"use client";

import React from "react";

type Props = {
  step: number;
  total: number;
};

export default function StepProgress({ step, total }: Props) {
  const percentage = (step / total) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>Step {step} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-slate-700">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}