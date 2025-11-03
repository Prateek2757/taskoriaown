"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

export default function ProgressSidebar({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Registration Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step.number
                  ? "bg-blue-600 text-white"
                  : step.number < currentStep
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`font-medium ${
                currentStep === step.number ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
