"use client";

type StepIndicatorProps = {
  step: "location" | "details";
};

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {["location", "details"].map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step === item
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                : index < (step === "details" ? 1 : 0)
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
            }`}
          >
            {index < (step === "details" ? 1 : 0) ? "✓" : index + 1}
          </div>
          {index < 1 && (
            <div
              className={`w-12 h-0.5 rounded-full transition-all duration-500 ${
                step === "details"
                  ? "bg-emerald-400"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
