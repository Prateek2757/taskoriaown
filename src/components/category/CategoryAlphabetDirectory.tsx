"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
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
  const deferredSearch = useDeferredValue(searchQuery);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);
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

  const [activeLetter, setActiveLetter] = useState<string | null>(
    () => availableLetters[0] ?? null
  );
  const displayActiveLetter =
    activeLetter && availableLetters.includes(activeLetter)
      ? activeLetter
      : (availableLetters[0] ?? null);

  const updateActiveLetter = useCallback(() => {
    if (!availableLetters.length) {
      setActiveLetter(null);
      return;
    }

    const content = contentRef.current;
    if (!content) return;

    const activationLine = content.getBoundingClientRect().top + 24;
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
      } else if (
        !hasSectionAboveLine &&
        top - activationLine < closestBelowDistance
      ) {
        closestBelowDistance = top - activationLine;
        current = letter;
      }
    }

    setActiveLetter((previous) => (previous === current ? previous : current));
  }, [availableLetters]);

  const scheduleActiveLetterUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateActiveLetter();
    });
  }, [updateActiveLetter]);

  useEffect(() => {
    window.addEventListener("resize", scheduleActiveLetterUpdate);
    scheduleActiveLetterUpdate();

    return () => {
      window.removeEventListener("resize", scheduleActiveLetterUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [scheduleActiveLetterUpdate]);

  const scrollToLetter = (letter: string) => {
    setActiveLetter(letter);
    const content = contentRef.current;
    const section = sectionRefs.current[letter];
    if (!content || !section) return;

    content.scrollTo({
      top:
        content.scrollTop +
        section.getBoundingClientRect().top -
        content.getBoundingClientRect().top -
        24,
      behavior: "smooth",
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
    <section className={`h-[calc(100dvh-1rem)] overflow-hidden ${className}`}>
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800 sm:px-8 lg:px-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#2563EB] dark:text-blue-400">
            Service directory
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            {categories.length.toLocaleString("en-AU")} categories available in{" "}
            {locationLabel}.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 items-stretch gap-7 overflow-hidden p-5 sm:p-7">
          <aside className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">
            {searchInput}
            <AlphabetJumpFilter
              availableLetters={availableLetters}
              activeLetter={displayActiveLetter}
              onSelect={scrollToLetter}
              ariaLabel={`Jump to service categories in ${locationLabel}`}
            />

            <nav
              aria-label="Category shortcuts"
              className="max-h-72 space-y-0.5 overflow-y-auto pr-1"
            >
              {filteredCategories.map((category) => (
                <button
                  key={category.category_id}
                  type="button"
                  onClick={() =>
                    scrollToLetter(category.name.charAt(0).toUpperCase())
                  }
                  className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </aside>

          <div
            ref={contentRef}
            onScroll={scheduleActiveLetterUpdate}
            className="min-w-0 flex-1 space-y-7 overflow-y-auto pr-1"
          >
            <div className="sticky top-0 z-10 space-y-3 bg-white pb-3 dark:bg-slate-900 lg:hidden">
              {searchInput}
              <AlphabetJumpFilter
                availableLetters={availableLetters}
                activeLetter={displayActiveLetter}
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
                <div className="mb-2.5 flex items-center gap-2.5 border-b border-slate-200 pb-3 dark:border-slate-800">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white">
                    {letter}
                  </span>
                  <p className="text-sm font-medium text-slate-400">
                    {groups.get(letter)?.length ?? 0} categories
                  </p>
                </div>

                <div className="space-y-2">
                  {groups.get(letter)?.map((category) => (
                    <Link
                      href={buildHref(category)}
                      key={category.category_id}
                      className="group flex items-center   justify-start hover:underline px-3 py-0.5 text-[#2563EB]  dark:text-blue-400 hover:text-blue-800"
                    >
                      <span className="min-w-0  truncate text-sm font-semibold ">
                        {category.name}
                      </span>
                      <ArrowUpRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-0 duration-300 group-hover:rotate-45 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                      {/* <Link
                        href={buildHref(category)}
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        All in {locationLabel}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link> */}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="rounded-2xl bg-slate-50 py-16 text-center text-slate-400 dark:bg-slate-900">
                <Search className="mx-auto mb-3 h-8 w-8 opacity-40" />
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  {`No categories found for "${searchQuery}"`}
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
