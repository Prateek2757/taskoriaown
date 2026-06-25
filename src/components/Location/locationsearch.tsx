"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { Loader2, MapPin, X, Navigation } from "lucide-react";
import { Input } from "../ui/input";

type Location = {
  place_id?: string;
  australia_location_id?: number;
  city_id?: number;
  display_name: string;
  city?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
  _resolving?: boolean;
};

type Props = {
  onSelect?: (data: Location | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  presetLocation?: Location | null;
};

function stripCountry(name: string) {
  return name.replace(/,?\s*Australia$/i, "").trim();
}

function formatResultLabel(raw: string) {
  const clean = stripCountry(raw);
  const parts = clean.split(",").map((p) => p.trim());
  const primary = parts[0] ?? clean;
  const secondary = parts.slice(1).join(", ");
  return { primary, secondary };
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

export default function LocationSearch({
  onSelect,
  onLoadingChange,
  presetLocation,
}: Props) {
  const listboxId = useId();
  const [query, setQuery] = useState(() =>
    presetLocation?.display_name ? stripCountry(presetLocation.display_name) : ""
  );
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cache = useRef<Record<string, Location[]>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const setLoadingState = useCallback(
    (val: boolean) => {
      setLoading(val);
      onLoadingChange?.(val);
    },
    [onLoadingChange]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    return () => {
      debounceRef.current && clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const fetchAutocomplete = useCallback(
    async (input: string) => {
      if (input.length < 3) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      const cacheKey = input.toLowerCase();
      if (cache.current[cacheKey]) {
        setResults(cache.current[cacheKey]);
        setShowDropdown(true);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoadingState(true);
      try {
        const params = new URLSearchParams({ q: input, limit: "30" });
        const res = await fetch(`/api/signup/location?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Location autocomplete failed");

        const mapped = (await res.json()) as Location[];

        cache.current[cacheKey] = mapped;
        setResults(mapped);
        setShowDropdown(true);
      } catch (err: unknown) {
        if (isAbortError(err)) return;
        console.error("Autocomplete error:", err);
        setResults([]);
      } finally {
        if (abortRef.current === controller) {
          setLoadingState(false);
        }
      }
    },
    [setLoadingState]
  );

  const handleSelect = async (loc: Location) => {
    const displayClean = stripCountry(loc.display_name);
    setQuery(displayClean);
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
  
    onSelect?.({ ...loc, _resolving: true });
  
    setLoadingState(true);
    try {
      const res = await fetch("/api/signup/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          australia_location_id: loc.australia_location_id ?? loc.place_id,
        }),
      });

      if (!res.ok) throw new Error("Location enrichment failed");

      const cityData = await res.json();
      const city_id = cityData.city_id;
  
      onSelect?.({
        ...loc,
        city_id,
        city: cityData.city ?? loc.city,
        _resolving: false,
      });
    } catch (err) {
      console.error("Location enrichment failed:", err);
    
    } finally {
      setLoadingState(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    onSelect?.(null);
    inputRef.current?.focus();
  };

  const handleChange = (value: string) => {
    setQuery(value);

    if (presetLocation) onSelect?.(null);

    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchAutocomplete(value), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || !results.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((p) => (p + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((p) => (p - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) handleSelect(results[activeIndex]);
        break;
      case "Escape":
        setShowDropdown(false);
        setActiveIndex(-1);
        break;
    }
  };

  const isSelected = !!presetLocation && !presetLocation._resolving;

  return (
    <div className="relative  w-full" ref={containerRef}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400 dark:text-gray-500" />
        ) : isSelected ? (
          <Navigation className="h-4 w-4 text-blue-500" />
        ) : (
          <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>

      <Input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Enter suburb or postcode"
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.length >= 3 && results.length > 0) setShowDropdown(true);
        }}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `loc-option-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        aria-label="Location search"
        className="border rounded-md shadow-none focus-visible:ring-0 py-5 pl-9 pr-9 text-sm bg-transparent"
      />

      {query && !loading && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear location"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5
            text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
            transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute top-full left-0 z-[9999] mt-1 max-h-64 w-full overflow-y-auto
            rounded-xl border border-gray-200 bg-white
            dark:border-gray-700 dark:bg-gray-900
            shadow-lg shadow-black/10 dark:shadow-black/40"
        >
          {results.length > 0
            ? results.map((r, i) => {
                const { primary, secondary } = formatResultLabel(
                  r.display_name
                );
                const isActive = i === activeIndex;
                return (
                  <li
                    key={r.australia_location_id ?? r.place_id ?? r.display_name}
                    id={`loc-option-${i}`}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex cursor-pointer items-start gap-3 px-3 py-2 transition-colors
                      ${
                        isActive
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                  >
                    {/* <MapPin
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    /> */}
                    <span className="min-w-0 flex-1">
                      <span className="block  text-sm font-semibold">
                        {primary}
                      </span>
                      {secondary && (
                        <span
                          className={`block truncate text-xs ${
                            isActive
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {secondary} {r.postcode}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })
            : query.length >= 3 && (
                <li className="px-3 py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                  No locations found for &quot;{query}&quot;
                </li>
              )}
        </ul>
      )}
    </div>
  );
}
