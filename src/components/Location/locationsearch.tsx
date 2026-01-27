"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import axios from "axios";

type Location = {
  place_id: string;
  city_id?: number;
  display_name: string;
  city?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  onSelect?: (data: Location | null) => void;
  presetLocation?: Location | null;
};

export default function LocationSearch({ onSelect, presetLocation }: Props) {
  const sessionToken = useRef(
    typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cache = useRef<{ [key: string]: Location[] }>({});
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (presetLocation) {
      const cleanName = (presetLocation.display_name || "")
        .replace(/,?\s*Australia$/i, "")
        .trim();
      setQuery(cleanName);
    }
  }, [presetLocation]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAutocomplete = async (input: string) => {
    if (input.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (cache.current[input]) {
      setResults(cache.current[input]);
      setShowDropdown(true);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/googlemap/autocomplete", {
        input,
        session: sessionToken.current,
      });

      const suggestions = res.data.suggestions || [];

      const mapped = suggestions.map((s: any) => ({
        place_id: s.placePrediction.placeId,
        display_name: s.placePrediction.text.text,
      }));

      cache.current[input] = mapped;
      setResults(mapped);
      setShowDropdown(true);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (
    placeId: string
  ): Promise<Location | null> => {
    try {
      const res = await axios.get("/api/googlemap/place-details", {
        params: { place_id: placeId, session: sessionToken.current },
      });

      const data = res.data;

      return {
        place_id: data.place_id,
        display_name: data.display_name,
        city: data.city,
        suburb: data.suburb,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        lat: data.lat,
        lng: data.lng,
      };
    } catch (err) {
      console.error("Place details error:", err);
      return null;
    }
  };

  const handleSelect = async (loc: Location) => {
    setQuery(loc.display_name);
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);

    setLoading(true);
    const details = await fetchPlaceDetails(loc.place_id);
    setLoading(false);

    if (!details) return;

    try {
      const reslocation = await axios.post(
        "/api/signup/location",
        details
      );

      const city_id = reslocation.data.city_id;

      onSelect?.({
        ...details,
        city_id,
        display_name: loc.display_name,
      });
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    // Pass null to indicate clearing
    if (onSelect) {
      onSelect(null);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceTimeout.current)
      clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(
      () => fetchAutocomplete(value),
      300
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + results.length) % results.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(results[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

      <Input
        type="text"
        value={query}
        placeholder="Enter your postcode or suburbs"
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() =>
          query.length >= 3 &&
          results.length > 0 &&
          setShowDropdown(true)
        }
        className="w-full border border-gray-300 rounded-xl pl-9 pr-9 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Show loader OR clear button, not both */}
      <div className="absolute right-3 top-3">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full left-0 z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((r, i) => (
            <li
              key={r.place_id}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`cursor-pointer p-3 text-sm font-semibold transition ${
                i === activeIndex
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-primary"
              }`}
            >
              {r.display_name}
            </li>
          ))}
        </ul>
      )}

      {showDropdown &&
        query.length >= 3 &&
        results.length === 0 &&
        !loading && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 text-sm text-gray-400 shadow-md">
            No results found.
          </div>
        )}
    </div>
  );
}