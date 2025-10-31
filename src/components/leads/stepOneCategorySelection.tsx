"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import LocationSearch from "../Location/locationsearch";
import CategorySearch from "../category/CategorySearch";

type Category = {
  category_id: number;
  name: string;
  remote_available: boolean;
};


type Props = {
  onNext: () => void;
  onClose: () => void;
  setSelectedCategoryId: (id: string) => void;
  setSelectedLocationId: (id: string) => void;
  setSelectedCategoryTitle: (title: string) => void;
};

export default function StepOneCategoryForm({
  onNext,
  onClose,
  setSelectedCategoryId,
  setSelectedCategoryTitle,
  setSelectedLocationId,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchCategoryTerm, setSearchCategoryTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      category_id: 0,
      city_id: 0,
      category_name: "",
      location: "",
    },
  });

  const categoryId = watch("category_id");
  const selectedLocation = watch("location");

  const selectedCategory = categories.find(
    (c) => c.category_id === Number(categoryId)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes] = await Promise.all([
          axios.get("/api/signup/category-selection"),
        ]);
        setCategories(catRes.data);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const term = searchCategoryTerm.trim();

    if (!term) {
      setFilteredCategories([]);
      setShowCategorySuggestions(false);
      return;
    }

    const currentlySelected = categories.find(
      (c) => c.category_id === Number(categoryId)
    );
    if (
      currentlySelected &&
      term.toLowerCase() === currentlySelected.name.toLowerCase()
    ) {
      setFilteredCategories([]);
      setShowCategorySuggestions(false);
      return;
    }

    setFilteredCategories(
      categories.filter((c) =>
        c.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    setShowCategorySuggestions(true);
  }, [searchCategoryTerm, categories, categoryId]);

  const handleSelectCategory = (cat: Category) => {
    setValue("category_id", cat.category_id);
    setValue("category_name", cat.name);
    setSearchCategoryTerm(cat.name);
    setShowCategorySuggestions(false);
    setSelectedCategoryTitle(cat.name);


  };

  const onContinue = (data: any) => {
    if (!data.category_id || data.category_id === 0) {
      return toast.error("Please select a service category");
    }
    if (!data.location) {
      return toast.error("Please select a location");
    }
    setSelectedCategoryId(String(data.category_id));
    setSelectedLocationId(String(data.city_id));
    onNext();
  };

  const isContinueEnabled = !!selectedCategory && !!selectedLocation;



  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-md mx-auto p-6 sm:p-8 space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          What kind of service do you need?
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Start typing to find your category.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading options...</p>
        </div>
      ) : (
        <>
          {/* Category Search */}
          <div className="relative">
            <Label className="font-semibold text-gray-800 dark:text-gray-200">
              Service Category <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              {/* <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search service category..."
                value={searchCategoryTerm}
                onChange={(e) => setSearchCategoryTerm(e.target.value)}
                onKeyDown={handleCategoryKeyDown}
                className="pl-9 w-full border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              /> */}
              <CategorySearch onSelect={(data)=>{
                setValue("category_id",data.id);
                setValue("category_name",data.name)
                setSelectedCategoryTitle(data.name)
              }} />
            </div>

            <AnimatePresence>
              {showCategorySuggestions &&
                (filteredCategories.length > 0 ? (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredCategories.map((cat) => (
                      <li
                        key={`cat-${cat.category_id}`}
                        onClick={() => handleSelectCategory(cat)}
                        className={cn(
                          "px-4 py-3 cursor-pointer text-sm sm:text-base",
                          "hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-100"
                        )}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </motion.ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400"
                  >
                    No matching categories found.
                  </motion.p>
                ))}
            </AnimatePresence>
          </div>

          {/* Location Search */}
          <div className="relative">
            <Label className="font-semibold text-gray-800 dark:text-gray-200">
              Location
            </Label>
            <div className="relative mt-2">
             
                <LocationSearch
                onSelect={(data) => {
                  setValue("city_id", data.city_id),
                    setValue("location", data.city);
                }}
              />
          
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onContinue)}
              disabled={!isContinueEnabled}
              className={cn(
                "flex-1 rounded-lg bg-gradient-to-r from-[#00E5FF]  via-[#6C63FF] to-[#8A2BE2] text-white font-medium shadow-lg hover:shadow-xl",
                !isContinueEnabled && "opacity-60 cursor-not-allowed"
              )}
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
