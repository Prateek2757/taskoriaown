"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";
import { X } from "lucide-react";

type KeywordsInputProps = {
  control: any;
  setValue: (name: string, value: string[]) => void;
};

export function KeywordsInput({ control, setValue }: KeywordsInputProps) {
  const keywords: string[] = useWatch({ control, name: "keywords" }) ?? [];
  const [input, setInput] = useState("");

  function add() {
    const keyword = input.trim().toLowerCase();
    if (!keyword || keywords.includes(keyword)) return;
    setValue("keywords", [...keywords, keyword]);
    setInput("");
  }

  function remove(index: number) {
    setValue(
      "keywords",
      keywords.filter((_, keywordIndex) => keywordIndex !== index)
    );
  }

  return (
    <div
      className={`
        flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border border-input
        bg-background px-3 py-2 text-sm ring-offset-background
        focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
        transition-shadow cursor-text
      `}
      onClick={(event) => {
        (event.currentTarget.querySelector("input") as HTMLInputElement)?.focus();
      }}
    >
      {keywords.map((keyword, index) => (
        <span
          key={keyword + index}
          className="inline-flex items-center gap-1 rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 text-xs font-medium shrink-0"
        >
          {keyword}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              remove(index);
            }}
            className="opacity-50 hover:opacity-100 hover:text-destructive transition-colors"
            aria-label={`Remove ${keyword}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add();
          }
          if (event.key === "Backspace" && !input && keywords.length > 0) {
            remove(keywords.length - 1);
          }
        }}
        placeholder={keywords.length === 0 ? "Type and press Enter or comma..." : ""}
        className="flex-1 min-w-35 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
      />
    </div>
  );
}
