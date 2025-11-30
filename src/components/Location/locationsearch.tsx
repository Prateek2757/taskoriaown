"use client";

import { useState, useRef } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";

type Location = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    municipality?:string;
    town?: string;
    territory?:string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
};

type Props = {
  onSelect?: (data: { city_id: number; city: string ; display_name:string ; municipality:string}) => void;
};

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cache = useRef<{ [key: string]: Location[] }>({});
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAddresses = async (value: string) => {
    if (value.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (cache.current[value]) {
      setResults(cache.current[value]);
      setShowDropdown(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=au&q=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();
      setResults(data);
      console.log(data);
      
      cache.current[value] = data;
      setShowDropdown(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchAddresses(value), 400);
  };

  const handleSelect = async (r: Location) => {
    const location = {
      place_id: r.place_id,
      display_name: r.display_name,
      city: r.address?.city || r.address?.town || r.address?.village || "",
      state: r.address?.state || "",
      country: r.address?.country || "",
      territory:r.address?.territory || "",
      postcode: r.address?.postcode || "",
      municipality:r.address?.municipality || "",
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    };

    setQuery(location.display_name);
    setResults([]);
    setShowDropdown(false);
    setActiveIndex(-1);

    try {
      const res = await fetch("/api/signup/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });
      const data = await res.json();
      onSelect?.({ city_id: data.city_id, city: location.city ,display_name:location.display_name ,municipality:location.municipality});
    } catch (err) {
      console.error("Failed to save location:", err);
    }
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
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Search className="absolute left-3 mr-4 top-3 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search your location"
        className="w-full border border-gray-300 rounded-xl pl-9 focus:outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
        onFocus={() =>
          query.length >= 3 && results.length > 0 && setShowDropdown(true)
        }
      />

      {loading && (
        <div className="absolute top-full left-0 mt-1 w-full flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-md text-gray-500 text-sm z-50">
          <Loader2 className="animate-spin h-4 w-4" /> Searching...
        </div>
      )}

      {showDropdown && !loading && results.length > 0 && (
        <ul
          className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50 scroll-smooth"
          onMouseLeave={() => setActiveIndex(-1)}
        >
          {results.map((r, i) => (
            <li
              key={r.place_id}
              className={`p-3 cursor-pointer text-sm transition-colors ${
                i === activeIndex
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => handleSelect(r)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <p className="truncate font-medium">{r.display_name}</p>
              {(r.address?.city || r.address?.town || r.address?.village) && (
                <span className="text-xs text-gray-400">
                  {r.address?.city || r.address?.town || r.address?.village || r.address.municipality},{" "}
                  {r.address?.state}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {showDropdown &&
        !loading &&
        query.length >= 3 &&
        results.length === 0 && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg p-2 text-gray-400 text-sm shadow-md z-50">
            No results found.
          </div>
        )}
    </div>
  );
}