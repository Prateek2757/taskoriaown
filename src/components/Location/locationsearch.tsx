"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Search } from "lucide-react";
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
  onSelect?: (data: Location) => void;
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

      setResults(mapped);
      cache.current[input] = mapped;
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
      console.log("Place details received:", data);

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
      const reslocation = await axios.post("/api/signup/location", details);

      const city_id = reslocation.data.city_id;

      const fullLocation = {
        ...details,
        display_name: loc.display_name,
        city_id,
      };

      onSelect?.(fullLocation);
    } catch (error) {
      console.error("Failed to save location:", error);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchAutocomplete(value), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
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
      <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter your postcode or suburbs"
        className="w-full border border-gray-300 rounded-xl pl-9 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
        onFocus={() =>
          query.length >= 3 && results.length > 0 && setShowDropdown(true)
        }
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <Loader2 className="animate-spin h-4 w-4 text-gray-400" />
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <ul
          className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 scroll-smooth"
          onMouseLeave={() => setActiveIndex(-1)}
        >
          {results.map((r, i) => (
            <li
              key={r.place_id}
              className={`p-3 cursor-pointer text-sm font-semibold transition-colors ${
                i === activeIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-primary  text-gray-700"
              }`}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
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
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-400 text-sm shadow-md z-50">
            No results found.
          </div>
        )}
    </div>
  );
}
