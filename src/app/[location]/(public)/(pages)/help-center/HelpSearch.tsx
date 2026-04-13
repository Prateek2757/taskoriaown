"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { ARTICLES } from "./articles";

const ALL = Object.values(ARTICLES);

export default function HelpSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? ALL.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function go(id: string, cat: string) {
    setQuery("");
    setOpen(false);
    router.push(`/help/${cat}/${id}`);
  }

  const CAT_BADGE: Record<string, string> = {
    new: "New to Taskoria",
    pro: "Professionals",
    customer: "Customers",
  };

  return (
    <div ref={wrapRef} className="relative max-w-lg mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder="Tell us how we can help..."
          className="w-full pl-10 pr-4 py-3.5 rounded-full border-0 outline-none shadow-md text-sm text-slate-700 placeholder:text-slate-400 bg-white"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
          {results.map((a) => (
            <li key={a.id}>
              <button
                onClick={() => go(a.id, a.cat)}
                className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                <span className="flex-1 text-slate-700">{a.title}</span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  {CAT_BADGE[a.cat]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
