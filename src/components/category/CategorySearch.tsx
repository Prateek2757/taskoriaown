"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Category = {
  category_id: number;
  name: string;
  slug:string;
};

type Props = {
  onSelect?: (category: { id: number; name: string ;slug:string}) => void;
  placeholder?: string;
};

export default function CategorySearch({ onSelect, placeholder }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null); 

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
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }

    const f = categories.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(f);
    setShowSuggestions(true);
  }, [query, categories, selected]);

  // Handle selection
  const handleSelect = (cat: Category) => {
    setQuery(cat.name);
    setSelected(cat);
    setShowSuggestions(false);
    onSelect?.({ id: cat.category_id, name: cat.name ,slug:cat.slug });
  };

  // If user edits again manually, reset selection
  const handleChange = (value: string) => {
    setQuery(value);
    if (selected && value !== selected.name) {
      setSelected(null);
    }
  };

  return (
    <div className="relative  w-full">
      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder || "Search category..."}
        onFocus={() => {
          if (!selected && filtered.length > 0) setShowSuggestions(true);
        }}
        className={cn(
          "pl-9 rounded-xl py-2 border border-gray-300"
        )}
        
      />

      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-30 bg-white border mt-1 w-full rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {filtered.map((cat) => (
              <li
                key={cat.category_id}
                onMouseDown={() => handleSelect(cat)}
                className={cn(
                  "p-3 cursor-pointer hover:bg-blue-50 text-gray-700 text-sm"
                )}
              >
                {cat.name}
              </li>
            ))}
          </motion.ul>
        )}
        {showSuggestions && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute z-30 bg-white border mt-1 w-full rounded-lg p-3 text-gray-500 text-sm"
          >
            No categories found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}