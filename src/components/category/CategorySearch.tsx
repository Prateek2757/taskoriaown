"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";

type Category = {
  category_id: number;
  name: string;
  slug?: string;
};

type Props = {
  onSelect?: (category: Category) => void;
  placeholder?: string;
  presetCategory?: Category;
};

export default function CategorySearch({
  onSelect,
  placeholder,
  presetCategory,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<Category | null>(
    presetCategory || null
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (presetCategory) {
      setQuery(presetCategory.name);
      setSelected(presetCategory);
    }
  }, [presetCategory]);
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/signup/category-selection");
        setCategories(res.data);
      } catch (e) {
        console.error("Failed to fetch categories");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (selected) return;

    if (!query.trim()) {
      setFiltered(categories.slice(0, 10));
      return;
    }

    const f = categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(f);
  }, [query, categories, selected]);

  const handleSelect = (cat: Category) => {
    setQuery(cat.name);
    setSelected(cat);
    setShowSuggestions(false);
    onSelect?.({
      category_id: cat.category_id,
      name: cat.name,
      slug: cat.slug,
    });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (selected && value !== selected.name) setSelected(null);
    setShowSuggestions(true);
  };

  return (
    <div ref={wrapperRef} className="relative overflow-visible  w-full">
      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || "Search category..."}
        onFocus={() => {
          setShowSuggestions(true);
          if (!query) setFiltered(categories.slice(0, 10));
        }}
        className="pl-9 rounded-lg py-5 max-sm:text-sm"
      />

      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 border mt-1 w-full rounded-lg shadow-lg 
             max-h-60 overflow-y-auto pointer-events-auto overscroll-contain backdrop-blur-xl bg-[rgba(255,255,255,.2)]  "
          >
            {filtered.map((cat) => (
              <li
                key={cat.category_id}
                onMouseDown={() => handleSelect(cat)}
                onTouchStart={() => handleSelect(cat)}
                className="p-3 cursor-pointer hover:bg-blue-100 dark:text-gray-400  text-gray-700 text-sm"
              >
                {cat.name}
              </li>
            ))}
          </motion.div>
        )}

        {showSuggestions && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-40 bg-white border mt-1 w-full rounded-lg p-3 text-gray-500 text-sm"
          >
            No categories found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
