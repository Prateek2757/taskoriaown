"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Category {
  category_id: number;
  name: string;
}

export default function CategorySelectionPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/signup/category-selection");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    const savedDraft = localStorage.getItem("draftProviderId");
    if (savedDraft) setDraftId(Number(savedDraft));
    else alert("Draft not found! Please start from 'Join as a Provider'.");
  }, []);

  // Filter dynamically when user types
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories([]);
      return;
    }
    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleSelectCategory = (id: number, name: string) => {
    setSelectedCategory(id);
    setSearchQuery(name);
  };

  const goNext = () => {
    if (!selectedCategory) return alert("Please select a category to continue");
    if (!draftId) return alert("Draft ID missing! Restart onboarding.");
    setIsNavigating(true);
    router.push(`/create-account?user_id=${draftId}&cn=${selectedCategory}`);
  };

  const popularCategories = useMemo(() => categories.slice(0, 8), [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-cyan-50/40 to-gray-50 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border border-gray-100 rounded-3xl backdrop-blur-sm bg-white/90">
        <CardContent className="p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              What service do you provide?
            </h1>
            <p className="text-gray-500 mt-2">
              Start typing to find your category or choose a popular one below.
            </p>
          </div>

          {/* 🔍 Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for a service (e.g., Photographer, Web Designer, Plumber...)"
              className="pl-10 py-6 border-gray-300 focus:ring-2 focus:ring-cyan-500 text-gray-700 rounded-xl text-base shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 🧭 Search results below search bar (only when typing) */}
          <AnimatePresence>
            {searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="mt-2"
              >
                {filteredCategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCategories.map((c) => (
                      <motion.div
                        key={c.category_id}
                        whileHover={{ scale: 1.03 }}
                        className={`cursor-pointer border rounded-xl p-4 text-center font-medium transition-all duration-200 ${
                          selectedCategory === c.category_id
                            ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                            : "bg-white hover:bg-cyan-50 border-gray-200 text-gray-700"
                        }`}
                        onClick={() =>
                          handleSelectCategory(c.category_id, c.name)
                        }
                      >
                        {c.name}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 mt-3">
                    No matching categories found.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ⭐ Popular Categories (only when not searching) */}
          {searchQuery.trim() === "" && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                Popular Categories
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {popularCategories.map((c) => (
                  <Button
                    key={c.category_id}
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCategory(c.category_id)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      selectedCategory === c.category_id
                        ? "bg-cyan-600 text-white"
                        : "hover:bg-cyan-50 text-gray-700"
                    }`}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Continue button */}
          <div className="text-center mt-10">
            <Button
              disabled={isNavigating}
              onClick={goNext}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-10 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-700 hover:to-blue-700 transition-all w-full"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                  Redirecting...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
