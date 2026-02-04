"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";
import { Category } from "@/hooks/useLeadProfile";
import debounce from "lodash.debounce";

interface AddServicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  profile: any;
  addCategory: (categoryId: number, categoryName: string) => void;
}

export default function AddServicesDialog({
  open,
  onOpenChange,
  categories,
  profile,
  addCategory,
}: AddServicesDialogProps) {
  const [catSearch, setCatSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleCategorySearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredCategories(categories.slice(0, 15));
        return;
      }
      const filtered = categories.filter((c ) =>
        c.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }, 250),
    [categories]
  );

  useEffect(() => {
    if (categories.length > 0 && open) {
      setFilteredCategories(categories.slice(0, 15));
    }
  }, [categories, open]);

  useEffect(() => {
    handleCategorySearch(catSearch);
  }, [catSearch, handleCategorySearch]);

  const isCategorySelected = (categoryId: number) => {
    return (
      profile?.categories.some((c: any) => c.category_id === categoryId) ||
      selectedCategories.includes(categoryId)
    );
  };

  const toggleCategorySelection = (categoryId: number) => {
    if (isCategorySelected(categoryId)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      if (profile?.categories.some((c: any) => c.category_id === categoryId)) {
        // This is already added, don't remove from selected
      }
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }
  };

  const handleAddSelectedCategories = () => {
    selectedCategories.forEach((categoryId) => {
      const category = categories.find((c) => c.category_id === categoryId);
      if (
        category &&
        !profile?.categories.some((c: any) => c.category_id === categoryId)
      ) {
        addCategory(category.category_id, category.name as any);
      }
    });
    setSelectedCategories([]);
    onOpenChange(false);
    setCatSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold dark:text-gray-100">
            Add Services
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
            Select multiple services to add to your profile. Choose
            2-6 options at once for best results.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search for services..."
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              className="pl-11 h-12 text-base border-gray-300 dark:border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              {filteredCategories.map((c) => {
                const isSelected = isCategorySelected(c.category_id);
                const isAlreadyAdded = profile.categories.some(
                  (pc: any) => pc.category_id === c.category_id
                );

                return (
                  <div
                    key={c.category_id}
                    onClick={() =>
                      !isAlreadyAdded &&
                      toggleCategorySelection(c.category_id)
                    }
                    className={`
                      flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all
                      ${
                        isAlreadyAdded
                          ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 cursor-not-allowed opacity-60"
                          : isSelected
                          ? "bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 border-2 border-cyan-500 shadow-sm"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:bg-cyan-50 dark:hover:bg-cyan-900 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 hover:shadow-sm"
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{c.name}</span>
                    {(isSelected || isAlreadyAdded) && (
                      <Check className="w-5 h-5 text-cyan-600 dark:text-cyan-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-base">
                  No services found
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>

          {selectedCategories.length > 0 && (
            <div className="flex items-center justify-between bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 p-4 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">
                  {selectedCategories.length} service
                  {selectedCategories.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-cyan-700 dark:text-cyan-300">
                  Ready to add to your profile
                </p>
              </div>
              <Button
                onClick={handleAddSelectedCategories}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Add Selected
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}