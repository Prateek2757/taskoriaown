"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import AlphabetJumpFilter from "@/components/ui/alphabet-jump-filter";

export type DirectoryCategory = {
  category_id: number;
  name: string;
  slug: string;
  subcategories?: { name: string }[];
};

type Props<T extends DirectoryCategory> = {
  categories: T[];
  buildHref: (category: T) => string;
  locationLabel: string;
  title?: string;
  className?: string;
};

export default function CategoryAlphabetDirectory<T extends DirectoryCategory>({
  categories,
  buildHref,
  locationLabel,
  title = "Browse all categories",
  className = "pt-14 pb-20",
}: Props<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(searchQuery);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const frameRef = useRef<number | null>(null);

  const filteredCategories = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    if (!query) return categories;

    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.subcategories?.some((sub) =>
          sub.name.toLowerCase().includes(query)
        )
    );
  }, [categories, deferredSearch]);

  const groups = useMemo(() => {
    const result = new Map<string, T[]>();

    for (const category of filteredCategories) {
      const letter = category.name.charAt(0).toUpperCase();
      if (!result.has(letter)) result.set(letter, []);
      result.get(letter)?.push(category);
    }

    for (const entries of result.values()) {
      entries.sort((a, b) => a.name.localeCompare(b.name, "en-AU"));
    }

    return result;
  }, [filteredCategories]);

  const availableLetters = useMemo(
    () => Array.from(groups.keys()).sort(),
    [groups]
  );

  const updateActiveLetter = useCallback(() => {
    if (!availableLetters.length) {
      setActiveLetter(null);
      return;
    }

    const activationLine = 180;
    let current = availableLetters[0];
    let hasSectionAboveLine = false;
    let closestBelowDistance = Number.POSITIVE_INFINITY;

    for (const letter of availableLetters) {
      const element = sectionRefs.current[letter];
      if (!element) continue;

      const top = element.getBoundingClientRect().top;
      if (top <= activationLine) {
        current = letter;
        hasSectionAboveLine = true;
      } else if (!hasSectionAboveLine && top - activationLine < closestBelowDistance) {
        closestBelowDistance = top - activationLine;
        current = letter;
      }
    }

    setActiveLetter((previous) => (previous === current ? previous : current));
  }, [availableLetters]);

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateActiveLetter();
      });
    };

    updateActiveLetter();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [updateActiveLetter]);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    sectionRefs.current[letter]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const searchInput = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      <input
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search categories…"
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      />
    </div>
  );

  return (
    <section className={className}>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-7 dark:border-slate-800 sm:px-8 lg:px-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-blue-500 dark:text-blue-400">
            Service directory
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {categories.length.toLocaleString("en-AU")} categories available in {locationLabel}.
          </p>
        </div>

        <div className="flex items-start gap-10 p-5 sm:p-8 lg:p-10">
          <aside className="sticky top-24 hidden w-52 shrink-0 flex-col gap-5 lg:flex">
          {searchInput}
          <AlphabetJumpFilter
            availableLetters={availableLetters}
            activeLetter={activeLetter}
            onSelect={scrollToLetter}
            ariaLabel={`Jump to service categories in ${locationLabel}`}
          />

          <nav aria-label="Category shortcuts" className="max-h-72 space-y-0.5 overflow-y-auto pr-1">
            {filteredCategories.map((category) => (
              <button
                key={category.category_id}
                type="button"
                onClick={() => scrollToLetter(category.name.charAt(0).toUpperCase())}
                className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
              >
                {category.name}
              </button>
            ))}
          </nav>
          </aside>

          <div className="min-w-0 flex-1 space-y-10">
          <div className="space-y-3 lg:hidden">
            {searchInput}
            <AlphabetJumpFilter
              availableLetters={availableLetters}
              activeLetter={activeLetter}
              onSelect={scrollToLetter}
              ariaLabel={`Jump to service categories in ${locationLabel}`}
              variant="horizontal"
            />
          </div>

          {availableLetters.map((letter) => (
            <div
              key={letter}
              ref={(element) => {
                sectionRefs.current[letter] = element;
              }}
              data-directory-letter={letter}
              className="scroll-mt-28"
            >
              <div className="mb-4 flex items-center gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-extrabold text-white">
                  {letter}
                </span>
                <p className="text-sm font-medium text-slate-400">
                  {groups.get(letter)?.length ?? 0} categories
                </p>
              </div>

              <div className="space-y-2">
                {groups.get(letter)?.map((category) => (
                  <div
                    key={category.category_id}
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-colors hover:border-blue-100 hover:bg-blue-50/60 dark:hover:border-blue-900 dark:hover:bg-blue-950/20"
                  >
                    <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-900 dark:text-white">
                      {category.name}
                    </h3>
                    <Link
                      href={buildHref(category)}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                    >
                      All in {locationLabel}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="rounded-2xl bg-slate-50 py-16 text-center text-slate-400 dark:bg-slate-900">
              <Search className="mx-auto mb-3 h-8 w-8 opacity-40" />
              <p className="font-medium text-slate-600 dark:text-slate-400">
                No categories found for "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                Clear search
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
