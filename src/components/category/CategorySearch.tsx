"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCategories } from "@/hooks/useCategories";

type Category = {
  category_id: number;
  name: string;
  slug?: string;
  keywords?: string[] | null;
};

type Props = {
  onSelect?: (category: Category | null) => void;
  placeholder?: string;
  presetCategory?: Category;
};

export default function CategorySearch({
  onSelect,
  placeholder,
  presetCategory,
}: Props) {
  const { categories, loading } = useCategories();
  const [query, setQuery] = useState(presetCategory?.name ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<Category | null>(
    presetCategory ?? null
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!presetCategory) return;

    setQuery((prev) =>
      prev === presetCategory.name ? prev : presetCategory.name
    );

    setSelected((prev) =>
      prev?.category_id === presetCategory.category_id ? prev : presetCategory
    );
  }, [presetCategory?.category_id, presetCategory?.name]);

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSuggestions(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const filtered = useMemo(() => {
    if (!categories) return [];
    if (selected && query === selected.name) return [];
    if (!query.trim()) return categories.slice(0, 10);

    const q = query.toLowerCase().trim();

    return categories.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(q);
      const keywordMatch = c.keywords?.some((k) => k.toLowerCase().includes(q));
      return nameMatch
        || keywordMatch;
    });
  }, [query, categories, selected]);

  const showNoResults =
    !loading &&
    !!categories &&
    query.trim().length > 0 &&
    filtered.length === 0 &&
    !(selected && query === selected.name);

  const handleSelect = (cat: Category) => {
    setQuery(cat.name);
    setSelected(cat);
    setShowSuggestions(false);
    onSelect?.({ category_id: cat.category_id, name: cat.name, slug: cat.slug });
  };

  const handleClear = () => {
    setQuery("");
    setSelected(null);
    setShowSuggestions(false);
    onSelect?.(null);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (selected && value !== selected.name) setSelected(null);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
    if (window.innerWidth < 640) {
      window.scrollTo({
        top: (wrapperRef.current?.offsetTop ?? 0) + 170,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={wrapperRef} className="relative overflow-visible w-full">
      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder ?? "Search category..."}
        onFocus={handleFocus}
        className="pl-9 pr-9 border-  py-5 max-sm:text-sm"
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 border mt-1 w-full rounded-lg shadow-lg 
             max-h-110 overflow-y-auto overflow-visible pointer-events-auto backdrop-blur-xl bg-[rgba(255,255,255,.2)] touch-pan-y overscroll-auto"
          >
            {filtered.map((cat) => (
              <li
                key={cat.category_id}
                onMouseDown={() => handleSelect(cat)}
                onTouchStart={() => handleSelect(cat)}
                className="p-3 cursor-pointer font-semibold hover:bg-blue-200 dark:hover:bg-gray-500 dark:text-gray-300 text-gray-700 text-sm relative z-50"
              >
                {cat.name}
              </li>
            ))}
          </motion.div>
        )}

        {showSuggestions && loading && query.trim() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-50 bg-white dark:bg-gray-800 border mt-1 w-full rounded-lg p-3 text-gray-500 dark:text-gray-400 text-sm shadow-lg"
          >
            Loading categories...
          </motion.div>
        )}

        {showSuggestions && showNoResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-50 bg-white dark:bg-gray-800 border mt-1 w-full rounded-lg p-3 text-gray-500 dark:text-gray-400 text-sm shadow-lg"
          >
            No categories found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}