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
import { ArrowUpRight, Building2, ChevronRight, Search } from "lucide-react";
import AlphabetJumpFilter from "@/components/ui/alphabet-jump-filter";

export type DirectoryLocation = {
  city_id: number;
  name: string;
  slug: string;
  display_name?: string | null;
  postcode?: string | null;
  state_slug?: string | null;
};

type Props<T extends DirectoryLocation> = {
  locations: T[];
  buildHref?: (location: T) => string;
  basePath?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  overviewHref?: string;
  overviewLabel?: string;
  searchPlaceholder?: string;
  className?: string;
  availableLetters?: Iterable<string>;
  initialLetter?: string | null;
  letterHref?: (letter: string) => string;
  letterHrefPrefix?: string;
  totalCount?: number;
  dataUrl?: string;
};

export default function LocationAlphabetDirectory<T extends DirectoryLocation>({
  locations,
  buildHref,
  basePath,
  title,
  description,
  eyebrow = "Locations",
  overviewHref,
  overviewLabel = "View overview",
  searchPlaceholder = "Search suburb or postcode",
  className,
  availableLetters: availableLettersOverride,
  initialLetter,
  letterHref,
  letterHrefPrefix,
  totalCount,
  dataUrl,
}: Props<T>) {
  const [directoryLocations, setDirectoryLocations] = useState<T[]>(locations);
  const [isLoading, setIsLoading] = useState(Boolean(dataUrl));
  const [loadError, setLoadError] = useState(false);
  const serverLetterMode = Boolean(letterHref || letterHrefPrefix);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearch = useDeferredValue(searchQuery);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  const availableLetters = useMemo(
    () =>
      new Set(
        Array.from(
          availableLettersOverride ??
            directoryLocations.map((location) =>
              location.name.charAt(0).toUpperCase()
            )
        )
          .map((letter) => letter.toUpperCase())
          .filter(Boolean)
      ),
    [directoryLocations, availableLettersOverride]
  );

  const [activeLetter, setActiveLetter] = useState<string | null>(() => {
    const letters = Array.from(availableLetters).sort();
    if (initialLetter && availableLetters.has(initialLetter.toUpperCase())) {
      return initialLetter.toUpperCase();
    }
    return availableLetters.has("A") ? "A" : letters[0] ?? null;
  });

  const filteredLocations = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    return directoryLocations
      .filter((location) => {
        const searchable = [
          location.name,
          location.display_name,
          location.postcode,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          (!query || searchable.includes(query)) &&
          (!serverLetterMode ||
            !activeLetter ||
            location.name.charAt(0).toUpperCase() === activeLetter)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name, "en-AU"));
  }, [directoryLocations, deferredSearch, activeLetter, serverLetterMode]);

  useEffect(() => {
    if (!dataUrl) {
      setDirectoryLocations(locations);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(false);

    fetch(dataUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load locations");
        return response.json() as Promise<T[]>;
      })
      .then((rows) => setDirectoryLocations(rows))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [dataUrl, locations]);

  const groups = useMemo(() => {
    const result = new Map<string, T[]>();
    for (const location of filteredLocations) {
      const letter = location.name.charAt(0).toUpperCase();
      if (!result.has(letter)) result.set(letter, []);
      result.get(letter)?.push(location);
    }
    return result;
  }, [filteredLocations]);

  const renderedLetters = useMemo(
    () => Array.from(groups.keys()).sort(),
    [groups]
  );

  const updateActiveLetter = useCallback(() => {
    if (serverLetterMode || !renderedLetters.length) return;

    const content = contentRef.current;
    if (!content) return;

    const activationLine = content.getBoundingClientRect().top + 24;
    let current = renderedLetters[0];
    let foundAbove = false;
    let closestBelow = Number.POSITIVE_INFINITY;

    for (const letter of renderedLetters) {
      const element = sectionRefs.current[letter];
      if (!element) continue;
      const top = element.getBoundingClientRect().top;

      if (top <= activationLine) {
        current = letter;
        foundAbove = true;
      } else if (!foundAbove && top - activationLine < closestBelow) {
        closestBelow = top - activationLine;
        current = letter;
      }
    }

    setActiveLetter((previous) => (previous === current ? previous : current));
  }, [renderedLetters, serverLetterMode]);

  useEffect(() => {
    if (serverLetterMode) return;

    const onScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        updateActiveLetter();
      });
    };

    updateActiveLetter();
    const content = contentRef.current;
    content?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      content?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [serverLetterMode, updateActiveLetter]);

  const resolveLocationHref = (location: T) => {
    if (buildHref) return buildHref(location);
    if (basePath && location.state_slug) {
      return `${basePath}/${location.state_slug}/${location.slug}`;
    }
    return `${basePath ?? ""}/${location.slug}`;
  };

  const resolveLetterHref = letterHref
    ? letterHref
    : letterHrefPrefix
      ? (letter: string) =>
          `${letterHrefPrefix}${letter.toLowerCase()}#alphabetical-locations`
      : undefined;

  const selectLetter = (letter: string) => {
    setActiveLetter(letter);
    setSearchQuery("");
    if (!serverLetterMode) {
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
    }
  };

  const resetDirectory = () => {
    setSearchQuery("");
    const firstLetter = Array.from(availableLetters).sort()[0] ?? null;
    setActiveLetter(firstLetter);
  };

  const searchInput = (
    <label className="relative block">
      <span className="sr-only">Search locations</span>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          if (serverLetterMode) setActiveLetter(null);
        }}
        placeholder={searchPlaceholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-blue-950"
      />
    </label>
  );

  return (
    <div className={`flex h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className ?? ""}`}>
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#2563EB] dark:text-blue-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {(totalCount ?? directoryLocations.length).toLocaleString("en-AU")} locations. {description ?? "Choose a location to find nearby professionals."}
          </p>
        </div>
        {overviewHref && (
          <Link href={overviewHref} className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-slate-200 px-4 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-200">
            {overviewLabel}
          </Link>
        )}
      </div>

      <div className="flex min-h-0 flex-1 items-stretch gap-7 p-5 sm:p-7">
        <aside className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto lg:flex">
          {searchInput}
          <AlphabetJumpFilter
            availableLetters={availableLetters}
            activeLetter={activeLetter}
            onSelect={selectLetter}
            ariaLabel={`Filter ${title} by first letter`}
            getHref={resolveLetterHref}
          />
        </aside>

        <div
          ref={contentRef}
          className="min-w-0 flex-1 space-y-7 overflow-y-auto pr-1"
        >
          <div className="sticky top-0 z-10 space-y-3 bg-white pb-3 dark:bg-slate-900 lg:hidden">
            {searchInput}
            <AlphabetJumpFilter
              availableLetters={availableLetters}
              activeLetter={activeLetter}
              onSelect={selectLetter}
              ariaLabel={`Filter ${title} by first letter`}
              variant="horizontal"
              getHref={resolveLetterHref}
            />
          </div>

          {isLoading && (
            <div className="rounded-xl bg-slate-50 py-12 text-center text-sm font-medium text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              Loading all Australian locations…
            </div>
          )}

          {!isLoading && loadError && (
            <div className="rounded-xl bg-red-50 py-10 text-center text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
              Locations could not be loaded. Refresh to try again.
            </div>
          )}

          {!isLoading && !loadError && renderedLetters.map((letter) => (
            <div
              key={letter}
              ref={(element) => {
                sectionRefs.current[letter] = element;
              }}
              className="scroll-mt-28"
            >
              <div className="mb-2.5 flex items-center gap-2.5 border-b border-slate-200 pb-2 dark:border-slate-800">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-xs font-extrabold text-white">
                  {letter}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {groups.get(letter)?.length ?? 0} locations
                </span>
              </div>

              <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 xl:grid-cols-4">
                {groups.get(letter)?.map((location) => (
                  <Link
                    key={location.city_id}
                    href={resolveLocationHref(location)}
                    className="group flex min-w-0 items-center hover:underline justify-sart  px-2 py-2 text-sm font-semibold text-[#2563EB] transition hover:bg-blur-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-sky-950/30"
                  >
                    <span className="truncate">{location.name}</span>
                    <ArrowUpRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1 opacity-0 duration-300 group-hover:rotate-45 group-hover:opacity-100"
                  aria-hidden="true"
                />
                    {/* <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" /> */}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {!isLoading && !loadError && filteredLocations.length === 0 && (
            <div className="rounded-xl bg-slate-50 py-12 text-center dark:bg-slate-950">
              <Building2 className="mx-auto mb-3 h-7 w-7 text-slate-300" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No locations match "{searchQuery}"
              </p>
              <button type="button" onClick={resetDirectory} className="mt-2 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
                Reset directory
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
