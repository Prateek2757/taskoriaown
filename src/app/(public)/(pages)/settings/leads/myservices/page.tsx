"use client";

import { useLeadProfile, Category } from "@/hooks/useLeadProfile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  MapPin,
  PlusCircle,
  ArrowLeft,
  XCircle,
  Search,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LocationSearch from "@/components/Location/locationsearch";

export default function MyServicesPage() {
  const {
    profile,
    categories,
    userLocations,
    loading,
    saving,
    error,
    addCategory,
    removeCategory,
    addLocation,
    removeLocation,
    toggleNationwide,
  } = useLeadProfile();

  const [catSearch, setCatSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<{
    type: "service" | "location";
    id: number | null;
  }>({
    type: "service",
    id: null,
  });

  const handleCategorySearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredCategories(categories.slice(0, 15));
        return;
      }
      const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) 
      );
      setFilteredCategories(filtered);
    }, 250),
    [categories]
  );

  useEffect(() => {
    if (categories.length > 0 && serviceDialogOpen) {
      setFilteredCategories(categories.slice(0, 15));
    }
  }, [categories, serviceDialogOpen]);

  useEffect(() => handleCategorySearch(catSearch), [catSearch, handleCategorySearch]);

  const isCategorySelected = (categoryId: number) => {
    return (
      profile?.categories.some((c) => c.category_id === categoryId) ||
      selectedCategories.includes(categoryId)
    );
  };

  const toggleCategorySelection = (categoryId: number) => {
    if (isCategorySelected(categoryId)) {
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
      if (profile?.categories.some((c) => c.category_id === categoryId)) {
        removeCategory(categoryId);
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
        !profile?.categories.some((c) => c.category_id === categoryId)
      ) {
        addCategory(category.category_id, category.name as any);
      }
    });
    setSelectedCategories([]);
    setServiceDialogOpen(false);
    setCatSearch("");
  };

  const handleAddLocation = async (data: { city_id?: number; city?: string } | null) => {
    if (!data) {
      setLocationError(null);
      setLocationSuccess(null);
      return;
    }

    if (!data.city_id || !data.city) {
      setLocationError("Invalid location data. Please select a valid location.");
      setTimeout(() => setLocationError(null), 5000);
      return;
    }

    setLocationError(null); 
    setLocationSuccess(null); 
    
    try {
      await addLocation(data.city_id as any, data.city as any);
      setLocationSuccess(`${data.city} added successfully!`);
      
      setTimeout(() => {
        setLocationDialogOpen(false);
        setLocationSuccess(null);
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to add location";
      setLocationError(errorMessage);
      
      setTimeout(() => {
        setLocationError(null);
      }, 5000);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-6xl mx-auto py-20 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-gray-300 text-lg">
            Loading your services and locations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-6 space-y-6">
      <Link href="/provider/dashboard">
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Button>
      </Link>

      <div className="flex items-center justify-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Manage Your Services & Locations
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl">
        Select the services you offer and locations you serve. Choose multiple
        options to build a comprehensive profile.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your Services
              </CardTitle>
              <Dialog
                open={serviceDialogOpen}
                onOpenChange={setServiceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Services
                  </Button>
                </DialogTrigger>
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
                            (pc) => pc.category_id === c.category_id
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
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="min-h-[120px]">
              {profile.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((c) => (
                    <Badge
                      key={c.category_id}
                      className="bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 px-4 py-2 text-sm rounded-full flex items-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-700 dark:hover:text-red-200 transition-all"
                      onClick={() => {
                        if (!saving) {
                          setPendingRemove({
                            type: "service",
                            id: c.category_id,
                          });
                          setConfirmOpen(true);
                        }
                      }}
                    >
                      {c.category_name} <XCircle className="w-3.5 h-3.5" />
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
                  <p className="text-base font-medium">No services selected yet</p>
                  <p className="text-sm mt-1">Click "Add Services" to get started</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 <strong>Tip:</strong> Click on a service badge to remove it
                from your profile
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Your Locations
                </CardTitle>
              </div>
              <Dialog
                open={locationDialogOpen}
                onOpenChange={(open) => {
                  setLocationDialogOpen(open);
                  if (!open) {
                    setLocationError(null); 
                    setLocationSuccess(null); 
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={profile.is_nationwide}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" /> Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-visible flex flex-col">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold dark:text-gray-100">
                      Add Location
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
                      Select cities where you provide services. You can add multiple locations.
                    </DialogDescription>
                  </DialogHeader>

                  {locationSuccess && (
                    <div
                      className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-start gap-3"
                      role="alert"
                    >
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{locationSuccess}</p>
                      </div>
                    </div>
                  )}

                  {locationError && (
                    <div
                      className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-start gap-3"
                      role="alert"
                    >
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Cannot add location</p>
                        <p className="text-sm mt-0.5">{locationError}</p>
                      </div>
                      <button
                        onClick={() => setLocationError(null)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4 flex-1 flex flex-col">
                    <LocationSearch onSelect={handleAddLocation} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="min-h-[120px]">
              {profile.is_nationwide ? (
                <div className="flex items-center justify-center h-full py-8">
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-base font-semibold shadow-sm">
                    🌍 Nationwide Coverage
                  </Badge>
                </div>
              ) : userLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userLocations.map((loc) => (
                    <Badge
                      key={loc.id}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-700 dark:hover:text-red-200 transition-all text-sm font-medium shadow-sm"
                      onClick={() => {
                        if (!saving) {
                          setPendingRemove({ 
                            type: "location", 
                            id: loc.city_id 
                          });
                          setConfirmOpen(true);
                        }
                      }}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      {loc.city_name}
                      <XCircle className="w-3.5 h-3.5" />
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
                  <p className="text-base font-medium">No locations selected yet</p>
                  <p className="text-sm mt-1">Choose cities or enable nationwide</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Nationwide Service
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Serve customers across the country
                  </p>
                </div>
                <Switch
                  checked={profile.is_nationwide}
                  onCheckedChange={(val: boolean) =>
                    !saving && toggleNationwide(val)
                  }
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 <strong>Tip:</strong> Click on a location badge to remove it. Add multiple cities to expand your reach.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div
          className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <span className="font-bold mr-2">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {saving && (
        <div
          className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-800 dark:text-blue-200 px-4 py-3 rounded-lg shadow-sm"
          role="alert"
        >
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-200 mr-3"></div>
            <span className="font-medium">Saving your changes...</span>
          </div>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Confirm Removal
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to remove this{" "}
              {pendingRemove.type === "service" ? "service" : "location"}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              No, Keep it
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white"
              onClick={() => {
                if (pendingRemove.type === "service" && pendingRemove.id) {
                  removeCategory(pendingRemove.id);
                } else if (pendingRemove.type === "location" && pendingRemove.id) {
                  removeLocation(pendingRemove.id);
                }
                setConfirmOpen(false);
              }}
            >
              Yes, Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}