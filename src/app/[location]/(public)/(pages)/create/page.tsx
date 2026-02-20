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
  public_id?: string;
}

export default function CategorySelectionPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/signup/category-selection");
        setCategories(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();

    const savedDraft = localStorage.getItem("draftProviderPublicId");
    console.log("Draft ID from localStorage:", savedDraft); // ADD THIS

    if (savedDraft) setDraftId(String(savedDraft));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories([]);
      return;
    }
    setFilteredCategories(
      categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, categories]);

  const handleSelectCategory = (id: string, name: string) => {

    setSelectedCategory(id);
    setSearchQuery(name);
  };

  const goNext = () => {
    if (!selectedCategory) return alert("Please select a category to continue");
    if (!draftId) return alert("Draft ID missing! Restart onboarding.");
    
    console.log("Navigating with:", { draftId, selectedCategory }); 
    const url = `/create-account?user_id=${draftId}&cn=${selectedCategory}`;
    
    setIsNavigating(true);
    router.push(url);
  };

  const popularCategories = useMemo(() => categories.slice(0, 8), [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-3" />
        <p className="text-gray-600 dark:text-gray-300">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-white via-cyan-50/40 to-gray-50 dark:from-black dark:via-gray-900 dark:to-gray-800 transition-colors">
      <Card className="max-w-2xl w-full shadow-2xl border border-gray-200/40 dark:border-gray-700/40 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/40 transition-colors">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold bg-blue-500 bg-clip-text text-transparent">
              What service do you provide?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Start typing to find your category or choose a popular one below.
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for a service..."
              className="pl-10 py-5 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100   rounded-xl text-base shadow-sm transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <AnimatePresence>
            {searchQuery.trim() !== "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
              >
                {filteredCategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCategories.map((c) => (
                      <motion.div
                        key={c.public_id}
                        whileHover={{ scale: 1.03 }}
                        className={`cursor-pointer border rounded-xl py-2 text-center font-medium transition-all duration-200 ${
                          selectedCategory === String(c.public_id)
                            ? "bg-blue-500 text-white border-cyan-600 shadow-md"
                            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                        }`}
                        onClick={() =>
                          handleSelectCategory(String(c.public_id), c.name)
                        }
                      >
                        {c.name}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 dark:text-gray-500 mt-3">
                    No matching categories found.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {searchQuery.trim() === "" && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center">
                Popular Categories
              </h2>
              <div className="flex flex-wrap justify-center gap-1">
                {popularCategories.map((c) => (
                  <Button
                    key={c.category_id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(String(c.public_id));
                      setSearchQuery(c.name);
                    }}
                    className={`rounded-full px-4 py-2 text-sm transition  ${
                      selectedCategory === String(c.public_id)
                        ? "bg-cyan-600 text-white border-cyan-600"
                        : "hover:bg-cyan-100 dark:hover:bg-cyan-900/20 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <Button
              disabled={isNavigating}
              onClick={goNext}
              className="bg-gradient-to-r bg-blue-600 text-white px-10 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-700 hover:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-600 transition-all w-full"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting...
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





