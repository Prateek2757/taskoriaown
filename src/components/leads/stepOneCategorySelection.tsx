"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import LocationSearch from "../Location/locationsearch";
import CategorySearch from "../category/CategorySearch";
import { useCategories } from "@/hooks/useCategories";

type Category = {
  category_id: number;
  name: string;
  remote_available?: boolean;
};

type Props = {
  onNext: () => void;
  onClose: () => void;
  presetCategory?: { category_id: number; name: string; slug?: string };
  presetLocation?: {
    city_id?: number;
    display_name?: string;
    city?: string;
  } | null;
  setSelectedCategoryId: (id: string) => void;
  setShowConfirm: (value: boolean) => void;
  setSelectedLocationId: (id: string) => void;
  setSelectedCategoryTitle: (title: string) => void;
  setSelectedLocation: (
    location: { city_id?: number; display_name?: string; city?: string } | null
  ) => void;
};

export default function StepOneCategoryForm({
  onNext,
  onClose,
  presetCategory,
  presetLocation,
  setSelectedCategoryId,
  setShowConfirm,
  setSelectedCategoryTitle,
  setSelectedLocationId,
  setSelectedLocation,
}: Props) {
  const { categories, loading } = useCategories();
  const [locationLoading, setLocationLoading] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState("");

  const [userInteracted, setUserInteracted] = useState(false);

  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      category_id: 0,
      city_id: 0,
      category_name: "",
      location: "",
    },
  });

  const categoryId = watch("category_id");
  const location = watch("location");
  const locationRef = useRef<{
    city_id?: number;
    resolved: boolean;
  }>({ resolved: false });
  const isContinueEnabled = categoryId > 0 && location?.trim() !== "";

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get("/api/signup/category-selection");
  //       setCategories(res.data);
  //     } catch {
  //       toast.error("Failed to load categories");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    if (presetCategory && !userInteracted) {
      setValue("category_id", presetCategory.category_id);
      setValue("category_name", presetCategory.name);
      setSelectedCategoryTitle(presetCategory.name);
    }
  }, [presetCategory?.category_id, userInteracted]);

  useEffect(() => {
    if (presetLocation) {
      setValue("city_id", presetLocation.city_id || 0);
      setValue("location", presetLocation.display_name || "");
      setSelectedLocationId(String(presetLocation.city_id || 0));
    }
  }, [presetLocation, setValue, setSelectedLocationId]);

  useEffect(() => {
    const term = searchCategoryTerm.trim().toLowerCase();

    if (!term) {
      setFilteredCategories([]);
      setShowCategorySuggestions(false);
      return;
    }

    const currentlySelected = categories.find(
      (c) => c.category_id === categoryId
    );
    if (currentlySelected && term === currentlySelected.name.toLowerCase()) {
      setFilteredCategories([]);
      setShowCategorySuggestions(false);
      return;
    }

    const filtered = categories.filter((c) =>
      c.name.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
    setShowCategorySuggestions(filtered.length > 0);
  }, [searchCategoryTerm, categories, categoryId]);

  useEffect(() => {
    if (!userInteracted) return;
    if (categoryId > 0 && location?.trim() !== "" && !locationLoading) {
      setSelectedCategoryId(String(categoryId));
      setSelectedLocationId(String(watch("city_id")));
      onNext();
    }
  }, [categoryId, location, locationLoading, userInteracted]);

  const handleSelectCategory = (cat: Category) => {
    setValue("category_id", cat.category_id, {
      shouldDirty: true,
      shouldTouch: true,
    });
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

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-500 dark:text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading options...</p>
        </div>
      ) : (
        <>
          <div className="relative">
            <Label className="font-semibold text-gray-800 dark:text-gray-200">
              Service Category <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <CategorySearch
                presetCategory={
                  presetCategory
                    ? {
                        category_id: presetCategory.category_id,
                        name: presetCategory.name,
                        slug: presetCategory.slug || "",
                      }
                    : undefined
                }
                onSelect={(data) => {
                  if (!data) {
                    setValue("category_id", 0);
                    setValue("category_name", "");
                    setSelectedCategoryTitle("");
                    return;
                  }

                  setValue("category_id", data.category_id, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setValue("category_name", data.name);
                  setSelectedCategoryTitle(data.name);
                  setUserInteracted(true);
                }}
              />
            </div>

            <AnimatePresence>
              {showCategorySuggestions && filteredCategories.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                >
                  {filteredCategories.map((cat) => (
                    <li
                      key={cat.category_id}
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
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <Label className="font-semibold text-gray-800 dark:text-gray-200">
              Location <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <LocationSearch
                presetLocation={presetLocation}
                onLoadingChange={(isLoading) => setLocationLoading(isLoading)}
                onSelect={(data) => {
                  if (!data) {
                    locationRef.current = { resolved: false };
                    setValue("city_id", 0);
                    setValue("location", "");
                    setSelectedLocation(null);
                    return;
                  }

                  setValue("location", data.city || data.display_name);

                  if (data._resolving) {
                    locationRef.current = { resolved: false };
                  } else {
                    // Enriched — update city_id and mark resolved
                    locationRef.current = {
                      city_id: data.city_id,
                      resolved: true,
                    };
                    setValue("city_id", data.city_id ?? 0);
                    setSelectedLocationId(String(data.city_id ?? 0));
                    setSelectedLocation({ ...data });
                  }

                  setUserInteracted(true);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(true)}
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onContinue)}
              disabled={!isContinueEnabled || locationLoading}
              className={cn(
                "flex-1 rounded-lg bg-[#3C7DED] text-white font-medium shadow-lg hover:shadow-xl transition-all",
                (!isContinueEnabled || locationLoading) &&
                  "opacity-60 cursor-not-allowed"
              )}
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Getting location…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
